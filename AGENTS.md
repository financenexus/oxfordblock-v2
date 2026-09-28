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

- Data: `{t, tag, d, photo?, videos?}` — plain object, PT-BR copy.
- Layout: `.catBody` flex row — text left, `.catShot` photo right (240px, `object-fit:contain`, framed). Mobile: stacked, photo on top.
- The photo shows the FULL image — contain, never cropped, no overlay badges.
- Click card → `.is-open` → `.catExpand` drops the video down + autoplays MUTED. One card open at a time.
- Sound is opt-in: `.vMute` pill on the video ("Ativar som"/"Desativar som") toggles mute — owner decision, no fullscreen button.
- Photo cards omit `.catMore`; text-only cards keep it.
- Expand area: video only — the "Solicitar catálogo"/"WhatsApp" buttons were removed by owner decision (Sep 28). WhatsApp stays available via the floating `waBubble`.
- Cards may add `photos:[]` and multiple `videos:[]` — the gallery is built to scale to 20+ videos per line (Crayon Shin-chan, Yi Sun-sin, Cobra Combat). NEVER create more than ~2 live `<video>` elements: extra videos stay as lazy badges (`data-vsrc`) and the real element is injected only on focus/top/selection, then reverted.
- Gallery has 4 TEST modes switched by the `?g=` param / `.galSwitch` bar (bento / deck / film / classic, + hover-scrub toggle) — TEMPORARY until the owner picks one; then delete the losers and the switcher.
- Bento caps at hero + 8 tiles; overflow becomes a `+N Ver tudo` tile (`.gMore`) that opens the lightbox.
- Lightbox `openPortModal({n,c,photos,videos}, true, idx)` takes a `videos:[]` array — video items come first (idx 0..n-1), photos after; `true` bypasses `HIDE_PORTFOLIO_PHOTOS`.
- `.catItem:before`/`:after` overlays are `pointer-events:none` — decorative only; children (shot, thumbs, video bar) must receive clicks.

## Media assets
- Photos: WebP ≤1600px, q82 — `sharp(src).resize({width:1600}).webp({quality:82})`.
- Videos: h264 mp4 WITH audio track — muted by default, user toggles via "Ativar som".
- `<video>` uses `muted loop playsinline preload="metadata"` + a `poster` frame.
- Every video needs a poster at `assets/<slug>-poster.webp` (auto-derived by `vidPoster()`): `ffmpeg -i <slug>.mp4 -frames:v 1 -vf scale=640:-1 -quality 82 <slug>-poster.webp`. Badges/thumbs fall back to a plain ▶ badge if the poster 404s.
- Names: `assets/<slug>.webp` / `assets/<slug>.mp4`.

## Environment notes
- Repo dir is on an NTFS mount; its `node_modules` holds Windows junction links — broken on Linux. Reinstall with `npm install` on whatever OS runs it.
- Local preview copy lives at `~/oxfordblock-local`; sync `index.html` back to the repo after edits.
- The NTFS `assets/` dir is read-only from Linux — new asset files must be copied in on the Windows side before deploying.
