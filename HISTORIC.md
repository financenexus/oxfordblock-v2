# HISTORIC — Oxford Blocks Brasil

Complete project history. Everything that was decided, built, and shipped, in order.
Owner: Ez Eldin Al Ali (Nexus OS — https://os-nexus.com.br). Built with Devin.

---

## Phase 0 — Foundation (before Sep 27, 2026)

- Single-file site: `index.html` (all markup + CSS + JS inline), `parceiro.html` partner form, `server.js` (Express on Node, `deno task start` on Deno Deploy), `cursor.js`/`cursor.css` custom red-brick cursor.
- GSAP 3.12.5 + ScrollTrigger animations, vanilla JS (`var`/`function`), PT-BR site copy.
- WhatsApp quote builder (`waBubble` + `waSheet`), `/api/partner` form → Resend email or `submissions/` JSON files locally / Deno KV in production.
- GEO/SEO groundwork: JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`, canonical URLs for `oxfordblocosbrasil.com.br`.
- Early fixes: cursor click-offset bugs, hero rework, brick icon system, hidden portfolio photos, removed a 192MB `portfolio-korea` dir that broke Deno Deploy.

## Sep 27–28 — Product line cards

- **Card standard (CATS accordion `#catList`):** text left, framed photo right (full image, `contain`, never cropped), click expands → video drops down.
- **Brickmania — King Tiger**: `brickmania-king-tiger.webp/.mp4` added.
- **Brickmania — Merkava**: `brickmania-merkava.webp/.mp4`; video replaced once with a better clip.
- **Sound:** first version auto-unmuted on click (reverted) → final standard: muted autoplay + floating **"Ativar som"/"Desativar som"** pill on the video (owner's reference screenshot), no fullscreen button.
- **Expand-area CTAs removed** ("Solicitar catálogo"/"WhatsApp") — owner decision Sep 28; WhatsApp stays via the floating bubble.
- Red **"▶ Viva a experiência"** CTA pill — first on the photo, then moved centered under the card content per the owner's sketch ("Explore a coleção" for photo-only cards).
- Cover **hover-scrub**: moving the mouse over the photo previews all `photos` with progress dots.

## Sep 28 — Gallery models (the "Teste de galeria")

Cobra Combat needed many photos + many videos. Four gallery models were built with a temporary switcher:

- **Bento** — mosaic tiles, hero video + expandable tiles.
- **Deck** — stage + swipeable card fan. **Chosen by the owner as THE standard** for Cobra Combat, Crayon Shin-chan, Patrimônio Cultural Coreano, Heróis — Yi Sun-sin, and every future line.
- **Filmstrip** — side rail swapping a Ken-Burns stage.
- **Clássico** — main media + thumb strip.

After the choice, the switcher and the other three modes were deleted; only Deck remains.

### Deck fixes & polish
- Original bug: the MBC video was pinned and never joined the rotation → reworked so ALL items (videos + photos) cycle through one stage; both arrows rotate the full set.
- **Video posters**: every video shows its first frame (`<slug>-poster.webp`, generated via ffmpeg) so users see what a video contains before opening it.
- **20+ video support**: deck cards are static poster faces; only ONE stage `<video>` exists per card — its `src` swaps. Stress-tested with 22 videos + 10 photos, zero errors, no overflow.
- **Lightbox** (`openPortModal`) upgraded: accepts `videos:[]` (videos first, then photos), poster thumbs, arrows/keyboard/Esc; card galleries bypass `HIDE_PORTFOLIO_PHOTOS`.
- **Video controls**: `loop` removed (plays once, stops); click video = pause/play/replay; "↺ Rever" button added then removed (redundant); video clicks must not collapse the card; `.catItem` overlays set `pointer-events:none` (they were eating thumb clicks).

## Sep 28 — Security audit + anti-ripper

- **Critical fix:** `/api/partner` spread `req.body` — a crafted `id` wrote files outside `submissions/` (proved with a probe, removed). Now only `PARTNER_FIELDS` are kept; `id`/`timestamp`/`ip` are server-set last.
- JSON-only bodies (100kb), urlencoded parser removed, `query parser: 'simple'` (no `qs`), `x-powered-by` off.
- **Headers:** CSP (self + jsDelivr + Google Fonts), Permissions-Policy, COOP; GSAP scripts pinned with SRI `integrity` hashes.
- **npm audit fix:** express 4.22.3 / body-parser 1.20.8 / qs 6.16.0. `deno.lock` still pins old versions — must be regenerated with Deno at go-live.
- **Anti site-ripper:** 403 for downloader/scraper user-agents (HTTrack, Wget, SiteSucker, WebCopy, python-requests, …) + empty UAs; 429 burst throttle at 300 req/min/IP; `robots.txt` disallows ripper bots.

**Important finding:** the free preview `oxfordblock-v2.financenexus.deno.net` serves the repo as STATIC files — `server.js` does not run there, so `/api/partner` 405s, headers are absent, and `/server.js`/docs are publicly readable. Full go-live checklist (real domain + Supabase migration) is in `AGENTS.md` → "GO-LIVE CHECKLIST".

## Sep 29 — Developer credit + Cobra Combat production data

- Footer credit on both pages: **"Desenvolvido por Nexus OS · Ez Eldin Al Ali"** — Nexus OS links to https://os-nexus.com.br (new tab); `<meta name="author">` added. A "Contato" link was tried and removed — the site link carries the contact info.
- Cobra Combat went to real production data; placeholder photos (`products/*.jpg`) and the MBC video were removed.
- **Sets so far:**
  - CJ3659 Army Assault Unit — box front + `cobra-combat-army.mp4`
  - CJ36511 Air Force Combat Wing — box front + `cobra-combat-air-force.mp4`
  - CJ36513 Artillery Brigade — box front + back + `cobra-combat-artillery.mp4`
  - CJ36515 Marine Recon Unit — box front + back + `cobra-combat-marine.mp4`
  - `cobra-combat-demo.mp4` — intro clip (no box photos)
- **Cover slideshow:** the card cover auto-crossfades through its photos every 3s while on screen; hover pauses + scrubs; staggered per card; off for `prefers-reduced-motion`. Gives mobile users (no hover) all cover photos.

## Sep 30 — Deck ordering + PT-BR nav

- **Per-model grouping:** deck items are grouped by filename stem — `assets/<slug>.mp4` pairs with `assets/<slug>-front.webp`/`-back.webp`. Order: each model's **photos then its video**; a video with no photos is slotted between photos of a multi-photo model so **two videos are never adjacent** (including the wrap). Army assets renamed `team-army`→`army`, `front`→`army-front`.
- **Navigation labels:** `‹`/`›` arrows → PT-BR pill buttons **"‹ Voltar"** / **"Próximo ›"** + hint "Arraste o card ou use os botões".
- Deck navigation is **circular** (Voltar on item 1 goes to the last item) — confirmed as intended behavior with the owner.

## Workflow rules established

- **Never commit or push without an explicit order** (AGENTS.md → Git rules).
- Dev loop: edit `~/oxfordblock-local` → verify in a real browser (Playwright) → sync to the Windows repo at `/mnt/Windows_Drive/Users/Nexus-Dev/Downloads/oxfordblock` → commit/push on order.
- NTFS drive gotchas: disappears when unmounted; "volume is dirty" = Windows fast-startup — fix with `ntfsfix -d` or a clean Windows shutdown.
- Repo pushes once happened from a fresh `gh` clone in `/tmp` while the drive was down — gh auth has repo scope.

## Pending / open items

- `deno.lock` regeneration (`deno install`) — still pins qs 6.15.3.
- LGPD privacy policy + consent checkbox on `parceiro.html`.
- Persistent rate limit for `/api/partner` (Supabase/Deno KV, not in-memory).
- Deno Deploy must run `server.js` (entrypoint) instead of static hosting — see GO-LIVE CHECKLIST.
- Crayon Shin-chan, Patrimônio Cultural Coreano, Heróis — Yi Sun-sin: awaiting real photos/videos (deck + grouping rules already support them).
- `assets/mbc-helicopter.mp4` + poster: unused, kept on disk in case needed.

## Commit log (GitHub financenexus/oxfordblock-v2, branch main)

```
cee4b1a  Marine Recon set + per-model deck order + Voltar/Próximo nav
e960cb0  Air Force + Artillery sets, auto cover slideshow
3445752  Cobra Combat production assets + developer credit
663d613  security: field whitelist + headers + SRI + audit fix
37959ff  no-loop videos + anti site-ripper guards
b6e01c0  video replay/click-pause (Rever later removed)
637691f  deck gallery standard + shot CTA pill
3fdcaec  deck standard + docs (interrupted commit, same work)
bf488d6  multi-gallery modes + CTA removal
285ee0e  Merkava photo card + video
afccc07  King Tiger photo card + sound toggle + card standard
4c142c3  merge PR #1 geo-fixes
```

_(Earlier history: content overhaul, cursor fixes, GEO/SEO foundations, partner flow, hero rework — see `git log` and COMPLETE_PROJECT_DOCUMENTATION.md.)_
