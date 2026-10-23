// Generates a 1200x630 Open Graph image for every built page:
// iron background, the gold logo, the page title, "Mobile · Telford".
// Runs after `astro build` (see package.json "build").
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
process.env.FONTCONFIG_FILE = path.join(here, 'fonts', 'fonts.conf');
process.env.FONTCONFIG_PATH = path.join(here, 'fonts');
const { default: sharp } = await import('sharp');

const DIST = path.resolve(here, '..', 'dist');
const LOGO = path.resolve(here, '..', 'assets', 'logos', 'smith-and-shine-gold-logo-on-dark.png');

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!['_astro', 'og'].includes(e.name)) yield* htmlFiles(p); }
    else if (e.name.endsWith('.html')) yield p;
  }
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, '’').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max && line) { lines.push(line); line = w; }
    else line = (line + ' ' + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}

const logo = await sharp(LOGO).resize({ width: 340 }).png().toBuffer();
const logoMeta = await sharp(logo).metadata();
await mkdir(path.join(DIST, 'og'), { recursive: true });

let n = 0;
for await (const file of htmlFiles(DIST)) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  const urlPath = rel === 'index.html' ? '/' : rel.endsWith('/index.html') ? `/${rel.slice(0, -'index.html'.length)}` : `/${rel.replace(/\.html$/, '')}`;
  const slug = urlPath === '/' ? 'home' : urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const html = await readFile(file, 'utf8');
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const title = h1 ? decode(h1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()) : 'Smith & Shine';
  const size = title.length > 44 ? 58 : 68;
  const lines = wrap(title, size === 58 ? 32 : 27).slice(0, 3);
  const lh = size * 1.12;
  const top = 300 + (lines.length === 1 ? lh * 0.6 : 0);
  const lx = 80, ly = 64, lw = logoMeta.width, lhgt = logoMeta.height;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#B8892F"/><stop offset=".45" stop-color="#F1D27E"/><stop offset="1" stop-color="#B8892F"/></linearGradient>
    <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#26282D"/><stop offset="1" stop-color="#1E1F23"/></linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#C9A24B" stroke-opacity=".45"/>
  ${[[40, 40], [1160, 40], [40, 590], [1160, 590]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#4a4c52"/>`).join('')}
  <rect x="${lx - 10}" y="${ly - 10}" width="${lw + 20}" height="${lhgt + 20}" fill="#000" stroke="#C9A24B" stroke-opacity=".6"/>
  <g fill="none" stroke="#C9A24B" stroke-opacity=".3" stroke-width="2.2" transform="translate(690 420) scale(.42)">
    <path d="M40 64 H1160 M40 72 H1160 M40 50 H1160"/>
    <path d="M365 300 A235 235 0 0 1 835 300 M386 300 A214 214 0 0 1 814 300 M418 300 A182 182 0 0 1 782 300"/>
    <path d="M418 72 V151 M462 72 V110 M506 72 V85 M694 72 V85 M738 72 V110 M782 72 V151 M330 72 V300 M345 72 V300 M855 72 V300 M870 72 V300"/>
    <circle cx="378" cy="112" r="30"/><circle cx="822" cy="112" r="30"/>
  </g>
  ${lines.map((l, i) => `<text x="80" y="${top + i * lh}" font-family="Fraunces OG" font-size="${size}" fill="#F6F1E7">${esc(l)}</text>`).join('\n  ')}
  <rect x="80" y="520" width="120" height="3" fill="url(#g)"/>
  <text x="80" y="566" font-family="Manrope OG" font-weight="700" font-size="26" letter-spacing="2" fill="#E9C877">MOBILE · TELFORD</text>
</svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: lx, top: ly }])
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(path.join(DIST, 'og', `${slug}.png`));
  n++;
}
console.log(`OG images: ${n} written to dist/og/`);
