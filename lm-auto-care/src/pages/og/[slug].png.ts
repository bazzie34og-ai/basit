// Build-time Open Graph images, 1200×630: job-sheet paper, granite speckle,
// the logo, the page title in Archivo Expanded, and the price promise.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { pages } from '../../config/pages.ts';

const slugFor = (path: string) => (path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '--'));
const clean = (t: string) => t.replace(/\s*\|.*$/, '');

export const getStaticPaths: GetStaticPaths = async () => {
  const fixed = Object.entries(pages).map(([path, m]) => ({ slug: slugFor(path), title: path === '/' ? 'Mobile Car Valeting in Aberdeen. We Come to You.' : clean(m.title) }));
  const guides = (await getCollection('guides')).map((g) => ({ slug: slugFor(`/guides/${g.id}/`), title: g.data.h1 }));
  const areas = (await getCollection('areas')).map((a) => ({ slug: slugFor(`/areas/${a.id}/`), title: a.data.h1 }));
  return [...fixed, ...guides, ...areas].map((p) => ({ params: { slug: p.slug }, props: { title: p.title } }));
};

const root = process.cwd();
const font = (f: string) => readFileSync(join(root, 'src/og-fonts', f));
const fonts = [
  { name: 'Archivo Expanded', data: font('archivo-expanded-800-italic.ttf'), weight: 800 as const, style: 'italic' as const },
  { name: 'Archivo Expanded', data: font('archivo-expanded-800-normal.ttf'), weight: 800 as const, style: 'normal' as const },
  { name: 'Plex Mono', data: font('ibm-plex-mono-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
];
const logo = `data:image/png;base64,${readFileSync(join(root, 'src/assets/logos/lm-auto-care-logo-circle-transparent.png')).toString('base64')}`;

// A granite speckle, made once: sparse dark flecks on transparent.
let speckle: string | null = null;
async function getSpeckle() {
  if (speckle) return speckle;
  const w = 1200, h = 630;
  const px = Buffer.alloc(w * h * 4);
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < w * h; i++) {
    const r = rand();
    if (r > 0.93) {
      const dark = rand() > 0.35;
      px[i * 4] = dark ? 20 : 140;
      px[i * 4 + 1] = dark ? 22 : 136;
      px[i * 4 + 2] = dark ? 26 : 128;
      px[i * 4 + 3] = Math.round(10 + rand() * 18);
    }
  }
  const png = await sharp(px, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  speckle = `data:image/png;base64,${png.toString('base64')}`;
  return speckle;
}

const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) => ({ type, props: { style, children, ...extra } });

export const GET: APIRoute = async ({ props }) => {
  const title = String(props.title);
  const size = title.length > 60 ? 54 : title.length > 38 ? 62 : 74;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', background: '#F3F1EC', position: 'relative', fontFamily: 'Archivo Expanded' }, [
    h('img', { position: 'absolute', top: 0, left: 0, width: 1200, height: 630 }, undefined, { src: await getSpeckle(), width: 1200, height: 630 }),
    h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '44px 64px 0', fontFamily: 'Plex Mono', fontSize: 20, letterSpacing: 1.5, color: '#0B5FC2' }, [
      h('div', { display: 'flex' }, 'LM AUTO CARE · MOBILE VALETING · ABERDEEN'),
      h('div', { display: 'flex', width: 120, height: 120, borderRadius: 60, background: '#1B1E22', alignItems: 'center', justifyContent: 'center' }, [
        h('img', { width: 112, height: 112 }, undefined, { src: logo, width: 112, height: 112 }),
      ]),
    ]),
    h('div', { display: 'flex', flexGrow: 1, alignItems: 'center', padding: '0 64px', marginTop: -10 }, [
      h('div', { display: 'flex', fontSize: size, fontStyle: 'italic', fontWeight: 800, lineHeight: 1.02, color: '#121417', letterSpacing: -1, maxWidth: 1020 }, title),
    ]),
    h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 64px', padding: '22px 0 40px', borderTop: '2px solid #121417', fontFamily: 'Plex Mono', fontSize: 26, color: '#121417' }, [
      h('div', { display: 'flex' }, [h('span', { color: '#0B5FC2' }, 'From £10'), h('span', { marginLeft: 16 }, '· We come to you')]),
      h('div', { display: 'flex', fontSize: 20, color: '#5d626a' }, '07936 060804'),
    ]),
    h('div', { position: 'absolute', bottom: 0, left: 0, width: 1200, height: 14, background: '#1E90FF' }),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
