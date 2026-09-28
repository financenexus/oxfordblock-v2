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
- Photo cards omit `.catMore`; text-only cards keep it.
- Expand area: media only — the "Solicitar catálogo"/"WhatsApp" buttons were removed by owner decision (Sep 28). WhatsApp stays available via the floating `waBubble`.
- Cards with `photos:[]` and/or 2+ `videos:[]` render the DECK gallery (approved standard — Cobra Combat, Crayon Shin-chan, Patrimônio Cultural Coreano, Heróis — Yi Sun-sin): `.gDeckStage` shows the top item (video muted-autoplay or photo), `.gDeckStack` is a swipeable/arrow card fan; all items cycle through the stage, clicked stage photos open the lightbox at that index.
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

## Git rules
- **NEVER commit or push without an explicit order from the owner.** Make changes, verify them locally, and wait to be told to sync/commit/push.

## Environment notes
- Repo dir is on an NTFS mount (currently `/mnt/Windows_Drive/Users/Nexus-Dev/Downloads/oxfordblock`, previously `/run/media/...`); its `node_modules` holds Windows junction links — broken on Linux. Reinstall with `npm install` on whatever OS runs it.
- Local preview copy lives at `~/oxfordblock-local`; sync files back to the repo after edits when the drive is mounted.
- If `assets/` is read-only from Linux, new asset files must be copied in on the Windows side before deploying.
