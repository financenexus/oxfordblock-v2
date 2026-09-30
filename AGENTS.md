# Oxford Blocks Brasil — Agent Rules

## Commands
- `npm install` once, then `node server.js` → http://localhost:8123 (Express serves statics + `/api/partner`)
- Deno parity (production): `deno task start`
- No test suite — verify changes in a real browser before calling done.

## Conventions
- Single-file app: markup, CSS, and JS all live in `index.html` (`parceiro.html` is the partner form).
- Vanilla JS — `var`/`function` style, no modules, no framework. CSS via inline custom properties (`--red`, `--line`, `--ink2`, ...).
- Site copy is PT-BR; code and comments are English.
- Full architecture: `COMPLETE_PROJECT_DOCUMENTATION.md`.

## Product line cards (CATS) — THE STANDARD
The `CATS` accordion (`#catList`) is the approved pattern for every product line:

- Data: `{t, tag, d, photo?, videos?[], photos?[]}` — plain object, PT-BR copy.
- Layout: `.catBody` flex row — text left, `.catShot` photo right (240px×190px, `object-fit:contain`, framed). Mobile: stacked, photo on top.
- The photo shows the FULL image — contain, never cropped, no overlay badges.
- Photo cards carry a red `.catShotCta` pill on the shot ("▶ Viva a experiência" with videos, "Explore a coleção" photo-only) — pulsing glow, pointer-events none (it's a label, the card click opens).
- Click card → `.is-open` → `.catExpand` drops media + autoplays MUTED. One card open at a time.
- Sound is opt-in: `.vMute` pill on the video ("Ativar som"/"Desativar som") toggles mute — owner decision, no fullscreen button.
- Cover slideshow (`initScrub`): with 2+ `photos`, the `.catShot` cover auto-crossfades every 3s (only while ≥40% on screen and tab visible; staggered per card; off for `prefers-reduced-motion`). Hover pauses it and scrubs by mouse X; progress dots always visible.
- Photo cards omit `.catMore`; text-only cards keep it.
- Expand area: media only — the "Solicitar catálogo"/"WhatsApp" buttons were removed by owner decision (Sep 28). WhatsApp stays available via the floating `waBubble`.
- Cards with `photos:[]` and/or 2+ `videos:[]` render the DECK gallery (approved standard — Cobra Combat, Crayon Shin-chan, Patrimônio Cultural Coreano, Heróis — Yi Sun-sin): `.gDeckStage` shows the top item (video muted-autoplay or photo), `.gDeckStack` is a swipeable/arrow card fan; all items cycle through the stage, clicked stage photos open the lightbox at that index.
- Deck order is grouped PER MODEL: a video pairs with photos sharing its name stem (`assets/<slug>.mp4` ↔ `assets/<slug>-front.webp`/`assets/<slug>-back.webp`); each group shows that model's photos then its video; videos with no photos (e.g. intro clips) lead. Name new assets `cobra-combat-<unit>.mp4` / `cobra-combat-<unit>-front.webp`.
- Scales to 20+ videos: deck cards are static poster faces (`data-vsrc`), only ONE stage `<video>` exists per card — its `src` swaps.
- Lightbox `openPortModal({n,c,photos,videos}, true, idx)` takes a `videos:[]` array — video items come first (idx 0..n-1), photos after; `true` bypasses `HIDE_PORTFOLIO_PHOTOS`.
- `.catItem:before`/`:after` overlays are `pointer-events:none` — decorative only; children (shot, video bar, deck cards) must receive clicks.

## Media assets
- Photos: WebP ≤1600px, q82 — `sharp(src).resize({width:1600}).webp({quality:82})`.
- Videos: h264 mp4 WITH audio track — muted by default, user toggles via "Ativar som".
- `<video>` uses `muted playsinline preload="metadata"` + a `poster` frame — NO `loop`: videos play once and stop. Clicking the video toggles play/pause (and replays after it ends; must not collapse the card). Only control: `.vMute` "Ativar som" pill.
- Every video needs a poster at `assets/<slug>-poster.webp` (auto-derived by `vidPoster()`): `ffmpeg -i <slug>.mp4 -frames:v 1 -vf scale=640:-1 -quality 82 <slug>-poster.webp`. Badges/thumbs fall back to a plain ▶ badge if the poster 404s.
- Names: `assets/<slug>.webp` / `assets/<slug>.mp4`.

## Anti-copy (site rippers)
- `server.js` returns 403 to offline-downloader / scraper user-agents (`RIPPER_UA`: HTTrack, Wget, WebCopy, SiteSucker, python-requests, ...) and to empty UAs; 429 after 300 requests/min per IP (a full visit is ~23).
- `robots.txt` disallows ripper bots. Never add search engines or AI crawlers to the block list (SEO/`llms.txt`).
- Speed bump only — a spoofed UA gets through; screenshots/DevTools cannot be blocked by any website.

## Security (server.js) — keep these when editing
- `/api/partner` keeps ONLY `PARTNER_FIELDS` (string values); `id`/`timestamp`/`ip` are server-set LAST. Never spread `req.body` into a record — `id` becomes a filename in `submissions/`. New form field → add it to `PARTNER_FIELDS`.
- JSON bodies only (100kb cap); no urlencoded parser (blocks cross-site HTML-form spam).
- `query parser` is `'simple'` (no `qs`) and `x-powered-by` is off.
- CSP allows only self + `cdn.jsdelivr.net` (scripts) + Google Fonts. Adding any new external script/font/embed/API → update the CSP or it will be blocked; verify zero CSP console violations in a browser.
- CDN scripts carry SRI `integrity` hashes — changing a GSAP version means recomputing: `curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A`.
- Only `PUBLIC_FILE` paths are served; server source, docs, `submissions/`, `.git` return 404.
- `deno.lock` (production) must be regenerated with Deno when dependencies change — it can lag `package-lock.json`.

## GO-LIVE CHECKLIST — do this when moving to https://oxfordblocosbrasil.com.br/ + Supabase
Status (Sep 28): the free preview `oxfordblock-v2.financenexus.deno.net` serves the repo as STATIC files — `server.js` does NOT run there. So online: `/api/partner` is broken (405), no security headers, rippers not blocked, and `/server.js`, `/AGENTS.md`, docs are publicly downloadable. Everything below must be done and verified at go-live — remind the owner.

1. **Run `server.js`, not static hosting.** Host must execute `server.js` (Deno: `deno task start`, entrypoint `server.js`; Node: `node server.js`). Verify online: `/api/health` returns JSON, `/server.js` and `/AGENTS.md` return 404.
2. **Domain + HTTPS.** Point `oxfordblocosbrasil.com.br` (+ `www`) to the host, HTTPS forced. `server.js` already sends HSTS and allows indexing only on that hostname — confirm `Strict-Transport-Security` is present and `X-Robots-Tag: noindex` is absent. Update `sitemap.xml`/canonical URLs if paths change.
3. **Supabase for submissions** (replaces Deno KV / `submissions/` in `saveSubmission()`):
   - Table e.g. `partner_submissions` with the `PARTNER_FIELDS` columns + `id uuid`, `timestamp timestamptz`, `ip text`.
   - Enable **Row Level Security** with NO public policies — only the server writes.
   - Insert from `server.js` with the **service role key** read from env (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). NEVER put the service key (or any Supabase key) in `index.html`/`parceiro.html` or git.
   - Keep the `PARTNER_FIELDS` whitelist — never insert `req.body` directly.
   - Server-side calls need no CSP change; if the browser ever talks to Supabase directly, add its URL to `connect-src` and use only the anon key + strict RLS.
   - Turn on Supabase backups; export old Deno KV submissions before switching.
4. **Env vars on the host:** `RESEND_API_KEY`, `MAIL_TO`, `MAIL_FROM` (verified domain sender, e.g. `parceria@oxfordblocosbrasil.com.br`), Supabase vars. Never commit `config.json`.
5. **Dependencies:** regenerate `deno.lock` with `deno install` (it pins old `qs@6.15.3`/`express@4.22.2`), then `npm audit` → 0.
6. **Rate limit:** in-memory limits are per-instance; move the `/api/partner` limit to a Supabase table (or Deno KV) so it holds across instances.
7. **LGPD:** `privacidade.html` (v1.0) + required consent checkbox (`consent_lgpd`, enforced server-side) are DONE. Before go-live: fill the yellow `.ph` placeholders ([RAZÃO SOCIAL], [CNPJ], [ENDEREÇO]) and have a Brazilian lawyer review it. Retention promised = 12 months for leads with no deal → implement the deletion job. Whenever a provider changes (Supabase, new host, analytics, cookies), update sections 05/06/08 of the policy and bump its version/date — the policy must match what the site really does.
8. **Verify live after deploy:** security headers present (CSP, X-Frame-Options, Permissions-Policy, no X-Powered-By); HTTrack UA → 403; submit the real form end-to-end (row in Supabase + email arrives); zero CSP violations in browser console on both pages.

## Git rules
- **NEVER commit or push without an explicit order from the owner.** Make changes, verify them locally, and wait to be told to sync/commit/push.

## Environment notes
- Repo dir is on an NTFS mount (currently `/mnt/Windows_Drive/Users/Nexus-Dev/Downloads/oxfordblock`, previously `/run/media/...`); its `node_modules` holds Windows junction links — broken on Linux. Reinstall with `npm install` on whatever OS runs it.
- Local preview copy lives at `~/oxfordblock-local`; sync files back to the repo after edits when the drive is mounted.
- The NTFS mount is writable from Linux — copy new assets into `assets/` directly. If the drive refuses to mount ("volume is dirty"), Windows didn't shut down cleanly: fix with `ntfsfix -d` or a full Windows shutdown. If it ever mounts read-only, new assets must be copied in on the Windows side before deploying.
