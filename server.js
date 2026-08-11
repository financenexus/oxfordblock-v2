import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const app = express();
const ROOT = import.meta.dirname;

// Deno Deploy injects PORT; fall back to 8123 locally.
const isDeno = Boolean(globalThis.Deno);
const env = (key) => (isDeno ? Deno.env.get(key) : process.env[key]);
const PORT = Number(env('PORT')) || 8123;

// ===== Config =====
// Production (Deno Deploy) reads env vars. Local dev may use config.json,
// which is gitignored. Env vars always win.
let fileConfig = {};
try {
  fileConfig = JSON.parse(fs.readFileSync(path.join(ROOT, 'config.json'), 'utf8'));
} catch {
  /* no config.json — expected in production */
}

const MAIL = {
  apiKey: env('RESEND_API_KEY') || fileConfig.email?.resend_api_key || '',
  to: env('MAIL_TO') || fileConfig.email?.to || '',
  from: env('MAIL_FROM') || fileConfig.email?.from || 'Oxford Brasil <onboarding@resend.dev>',
};
const mailConfigured = Boolean(MAIL.apiKey && MAIL.to);

// ===== Storage =====
// Deno Deploy has a read-only filesystem, so submissions go to Deno KV there.
// Locally (Node) they are written to submissions/ exactly as before.
const SUBMISSIONS_DIR = path.join(ROOT, 'submissions');
const SUBMISSIONS_FILE = path.join(SUBMISSIONS_DIR, 'submissions.json');
const kv = isDeno ? await Deno.openKv() : null;

if (!kv && !fs.existsSync(SUBMISSIONS_DIR)) fs.mkdirSync(SUBMISSIONS_DIR, { recursive: true });

async function saveSubmission(submission) {
  if (kv) {
    await kv.set(['submissions', submission.timestamp, submission.id], submission);
    return;
  }
  let all = [];
  try {
    all = JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
  } catch { /* first submission */ }
  all.push(submission);
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(all, null, 2));
  fs.writeFileSync(
    path.join(SUBMISSIONS_DIR, `${submission.id}.json`),
    JSON.stringify(submission, null, 2)
  );
}

// Middleware
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple in-memory rate limiter: max 10 submissions per IP per hour.
// Note: on Deno Deploy this is per-isolate, so it is a speed bump rather than
// a hard guarantee. The honeypot below is the primary bot defence.
const rateLimit = new Map();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_LIMIT_WINDOW;
  }
  entry.count++;
  rateLimit.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
}

// Cleanup stale rate limit entries every 30 min
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimit) {
    if (now > entry.resetAt) rateLimit.delete(ip);
  }
}, 30 * 60 * 1000);

// Serve static files
app.use(express.static(ROOT, {
  extensions: ['html'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
    if (filePath.match(/\.(png|jpg|webp|svg|woff2?)$/)) res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// ===== API: Partner form submission =====
app.post('/api/partner', async (req, res) => {
  try {
    const data = req.body;

    // Honeypot: if filled, silently discard (bot detection)
    if (data.website && String(data.website).trim() !== '') {
      return res.json({ ok: true, id: crypto.randomUUID(), message: 'Cadastro recebido.' });
    }

    // Rate limit
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ ok: false, error: 'Muitas tentativas. Tente novamente em 1 hora ou nos escreva por e-mail.' });
    }

    // Basic validation
    const required = ['tipo', 'nome', 'empresa', 'email', 'mensagem'];
    const missing = required.filter(f => !data[f] || !String(data[f]).trim());
    if (missing.length > 0) {
      return res.status(400).json({
        ok: false,
        error: 'Campos obrigatórios faltando: ' + missing.join(', ')
      });
    }

    // Email format check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) {
      return res.status(400).json({ ok: false, error: 'E-mail inválido.' });
    }

    // Sanitize string inputs (trim + length cap)
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string') {
        data[key] = data[key].trim().slice(0, 5000);
      }
    }

    // Build submission record
    const submission = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ip,
      ...data
    };
    delete submission.website;

    await saveSubmission(submission);
    console.log(`[submission] Saved ${submission.id} from ${data.nome} (${data.empresa})`);

    // Send email notification
    if (mailConfigured) {
      try {
        await sendNotificationEmail(submission);
        console.log(`[submission] Email sent to ${MAIL.to}`);
      } catch (emailErr) {
        console.error('[submission] Email failed:', emailErr.message);
        // Don't fail the request — submission is already saved
      }
    } else {
      console.warn('[submission] No email configured — submission stored only.');
    }

    res.json({
      ok: true,
      id: submission.id,
      message: 'Cadastro recebido com sucesso.'
    });

  } catch (err) {
    console.error('[submission] Error:', err);
    res.status(500).json({ ok: false, error: 'Erro interno. Tente novamente ou nos contate por e-mail.' });
  }
});

// ===== Email sender (Resend HTTP API — Deno Deploy blocks outbound SMTP) =====
async function sendNotificationEmail(submission) {
  const typeLabels = {
    institucional: 'Projeto Institucional',
    collab: 'Collab de Marca',
    revenda: 'Revender Oxford',
    catalogo: 'Solicitar Catálogo',
    reuniao: 'Agendar Reunião'
  };

  const typeLabel = typeLabels[submission.tipo] || submission.tipo;
  const esc = (v) => String(v ?? '—').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  const rows = [
    ['Tipo', typeLabel],
    ['Nome', submission.nome],
    ['Cargo', submission.cargo],
    ['Empresa / Marca', submission.empresa],
    ['E-mail', submission.email],
    ['Telefone / WhatsApp', submission.telefone],
    ['Site', submission.site],
    ['Segmento', submission.segmento],
    ['Porte / Alcance', submission.porte],
    ['Faixa de orçamento', submission.orcamento],
    ['Prazo desejado', submission.prazo],
    ['Quantidade estimada', submission.quantidade],
    ['Como conheceu', submission.como_conheceu],
    ['Newsletter', submission.newsletter === 'on' ? 'Sim' : 'Não'],
  ];

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f8f8; padding: 24px;">
      <div style="background: #fff; border-radius: 8px; padding: 32px; border-left: 4px solid #D42B24;">
        <h2 style="margin: 0 0 8px; color: #D42B24; font-size: 22px;">Nova solicitação de parceria</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 24px;">${new Date(submission.timestamp).toLocaleString('pt-BR')} · ID: ${submission.id}</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          ${rows.map(([k, v]) => `<tr><td style="padding: 8px 0; color: #888; width: 180px; vertical-align: top;">${k}</td><td style="padding: 8px 0; color: #222; font-weight: 600;">${esc(v)}</td></tr>`).join('')}
        </table>
        <h3 style="margin: 24px 0 8px; font-size: 15px; color: #444;">Mensagem</h3>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #333; white-space: pre-wrap;">${esc(submission.mensagem)}</div>
      </div>
      <p style="text-align: center; color: #aaa; font-size: 11px; margin-top: 16px;">Oxford Blocks Brasil — Sistema de Cadastro de Parceiros</p>
    </div>
  `;

  const text = `Nova solicitação de parceria\n\n${rows.map(([k, v]) => `${k}: ${v ?? '—'}`).join('\n')}\n\nMensagem:\n${submission.mensagem}\n\n---\nID: ${submission.id}\nTimestamp: ${submission.timestamp}`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MAIL.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: MAIL.from,
      to: [MAIL.to],
      reply_to: submission.email,
      subject: `[Oxford Brasil] ${typeLabel} — ${submission.empresa}`,
      text,
      html
    })
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

// ===== Health check =====
app.get('/api/health', (req, res) => {
  res.json({ ok: true, port: PORT, runtime: isDeno ? 'deno' : 'node', emailConfigured: mailConfigured });
});

// SPA fallback (catch-all for non-API routes; tolerates trailing slashes)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  // Strip trailing slash and resolve to a local .html file if it exists
  const clean = req.path.replace(/\/+$/, '') || '/';
  const candidate = path.join(ROOT, clean.endsWith('.html') ? clean : clean + '.html');
  if (!candidate.startsWith(ROOT)) return res.status(403).end();
  res.sendFile(candidate, (err) => {
    if (err) res.sendFile(path.join(ROOT, 'index.html'));
  });
});

app.listen(PORT, () => {
  console.log(`\n  Oxford Blocks Brasil — server running on http://localhost:${PORT}`);
  console.log(`  Runtime: ${isDeno ? 'Deno' : 'Node'} · Storage: ${kv ? 'Deno KV' : 'submissions/'}`);
  console.log(`  Email configured: ${mailConfigured}\n`);
});
