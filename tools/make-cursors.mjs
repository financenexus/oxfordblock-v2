/* Generates the Oxford red native cursor PNGs from inline SVG.
   Run: node tools/make-cursors.mjs  */
import sharp from 'sharp';

const RED = '#D42B24';
const DEEP = '#9B1A14';

/* Each shape is drawn twice: once as a fat white silhouette (outline),
   then filled red on top — gives a clean seamless border like an OS cursor. */
function layered(viewBox, w, h, shapes, detail = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${w}" height="${h}">
    <defs><g id="s">${shapes}</g></defs>
    <use href="#s" fill="#fff" stroke="#fff" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
    <use href="#s" fill="${RED}" stroke="${DEEP}" stroke-width=".6" stroke-linejoin="round"/>
    ${detail}
  </svg>`;
}

const arrow = layered('0 0 22 28', 19, 24,
  '<path d="M1.6 1.4L1.6 23.2L6.9 17.9L11.7 26.6L14.9 25.1L10.2 16.6L16.8 15.6Z"/>');

const hand = layered('0 0 22 28', 19, 24, [
  '<rect x="6.5" y="2" width="4.2" height="13" rx="2.1"/>',
  '<rect x="10.2" y="6.5" width="4.2" height="9" rx="2.1"/>',
  '<rect x="13.6" y="7.5" width="4.2" height="8" rx="2.1"/>',
  '<rect x="17" y="9" width="4.2" height="7" rx="2.1"/>',
  '<rect x="6.5" y="10.5" width="14.7" height="14" rx="5"/>',
  '<rect x="1.5" y="13.5" width="9" height="5.5" rx="2.75" transform="rotate(-28 6 16)"/>',
].join(''),
  '<g stroke="#fff" stroke-width="1.1" stroke-linecap="round">'
  + '<path d="M10.4 5v7.5"/>'
  + '<path d="M13.9 6.8v6.2"/>'
  + '<path d="M17.3 8.3v5.2"/>'
  + '</g>');

for (const [name, svg] of [['cursor-arrow', arrow], ['cursor-hand', hand]]) {
  await sharp(Buffer.from(svg), { density: 288 }).resize(19, 24).png().toFile(`assets/${name}.png`);
  console.log('wrote assets/' + name + '.png');
}
