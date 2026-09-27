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
- Expand area: video + "Solicitar catálogo" + "WhatsApp" (pre-selects the line in `waSheet`).

## Media assets
- Photos: WebP ≤1600px, q82 — `sharp(src).resize({width:1600}).webp({quality:82})`.
- Videos: h264 mp4 WITH audio track — muted by default, user toggles via "Ativar som".
- `<video>` uses `muted loop playsinline preload="metadata"`.
- Names: `assets/<slug>.webp` / `assets/<slug>.mp4`.

## Environment notes
- Repo dir is on an NTFS mount; its `node_modules` holds Windows junction links — broken on Linux. Reinstall with `npm install` on whatever OS runs it.
- Local preview copy lives at `~/oxfordblock-local`; sync `index.html` back to the repo after edits.
- The NTFS `assets/` dir is read-only from Linux — new asset files must be copied in on the Windows side before deploying.
