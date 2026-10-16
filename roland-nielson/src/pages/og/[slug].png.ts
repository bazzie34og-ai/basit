// Page-specific Open Graph images (1200×630), rendered at build time in the brand style.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
import { allEntries, ogSlug } from '../../lib/registry';
import { site } from '../../config/site';
import type { PageMeta } from '../../data/pages';

export async function getStaticPaths() {
  const entries = await allEntries();
  return entries.map((e) => ({ params: { slug: ogSlug(e.path) }, props: { entry: e } }));
}

const font = (p: string) => readFileSync(join(root, 'node_modules', p));
const fonts = [
  { name: 'Fraunces', data: font('@fontsource/fraunces/files/fraunces-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Manrope', data: font('@fontsource/manrope/files/manrope-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
];
const photo = `data:image/jpeg;base64,${readFileSync(join(root, 'src/assets/og-photo.jpg')).toString('base64')}`;
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}) => ({ type, props: { style, children, ...extra } });

export async function GET({ props }: { props: { entry: PageMeta } }) {
  const { eyebrow, headline } = props.entry.og;
  const size = headline.length > 48 ? 58 : headline.length > 30 ? 68 : 80;
  const tree = h('div', { display: 'flex', width: 1200, height: 630, background: '#0E1B2C', color: '#F5F1EA', fontFamily: 'Manrope' }, [
    h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 760, padding: '64px 56px 56px 72px' }, [
      h('div', { display: 'flex', alignItems: 'center', gap: 16 }, [
        h('div', { display: 'flex', alignItems: 'flex-end', fontFamily: 'Fraunces', fontSize: 56, lineHeight: 1, color: '#F5F1EA' }, [
          h('span', {}, 'R'),
          h('div', { width: 10, height: 10, borderRadius: 99, background: '#3B5F86', marginLeft: 2, marginBottom: 9 }),
        ]),
        h('div', { display: 'flex', fontSize: 20, letterSpacing: 6, color: '#F5F1EA' }, 'ROLAND NIELSON'),
      ]),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { display: 'flex', fontSize: 20, letterSpacing: 4, color: '#D2B483', textTransform: 'uppercase', marginBottom: 22 }, eyebrow),
        h('div', { display: 'flex', fontFamily: 'Fraunces', fontSize: size, lineHeight: 1.05, letterSpacing: -1.5 }, headline),
        h('div', { display: 'flex', width: 120, height: 2, background: '#B08D57', marginTop: 30 }),
      ]),
      h('div', { display: 'flex', fontSize: 20, color: '#B9C2CF' }, `${site.locality} · ${site.phone.display} · rolandnielson.com`),
    ]),
    h('div', { display: 'flex', width: 440, height: 630, position: 'relative' }, [
      h('img', { width: 440, height: 630, objectFit: 'cover' }, undefined, { src: photo, width: 440, height: 630 }),
      h('div', { position: 'absolute', left: 0, top: 0, width: 440, height: 630, background: 'linear-gradient(90deg, #0E1B2C 0%, rgba(14,27,44,0) 30%)' }),
    ]),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  const png = new Resvg(svg).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
