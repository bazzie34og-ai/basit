import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('/src/assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

const byKey: Record<string, ImageMetadata> = {};
for (const [p, img] of Object.entries(files)) {
  byKey[p.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, '')] = img;
}

export function photo(key: string): ImageMetadata | undefined {
  return byKey[key];
}

/**
 * Caption tags are small caps. Areas are TODO-CONFIRM, so no town is added until the
 * owner tells us where each job was.
 */
export const catalogue = {
  lounge: { key: 'carpet-lounge-grey-extraction-wand', caption: 'Lounge · hot water extraction', alt: 'A grey lounge carpet mid-clean, with fan-shaped stripes left by the extraction wand' },
  hallwayDrying: { key: 'hallway-carpet-drying-air-movers', caption: 'Hallway · after extraction', alt: 'A freshly cleaned hallway carpet drying with air movers in place' },
  sofaGrey: { key: 'sofa-grey-corner-footstool-after', caption: 'Corner sofa & footstool · after', alt: 'A grey fabric corner sofa and round footstool after cleaning' },
  sofaLight: { key: 'sofa-light-grey-corner-after', caption: 'Corner sofa · after', alt: 'A light grey corner sofa with chaise after cleaning' },
  rug: { key: 'bedroom-rug-flat-after', caption: 'Bedroom rug · after', alt: 'A cream textured rug in a bedroom after cleaning' },
} as const;

export interface Pair { before: string; after: string; caption: string; alt: string; }

export const pairs: Record<string, Pair> = {
  hallway: { before: 'hallway-carpet-before', after: 'hallway-carpet-after', caption: 'Hallway carpet', alt: 'hallway carpet' },
  stairs1: { before: 'stairs-carpet-1-before', after: 'stairs-carpet-1-after', caption: 'Stair carpet', alt: 'stair carpet' },
  stairs2: { before: 'stairs-carpet-2-before', after: 'stairs-carpet-2-after', caption: 'Stairs & landing', alt: 'stairs and landing carpet' },
  patio: { before: 'patio-path-before', after: 'patio-path-after', caption: 'Patio path', alt: 'patio path' },
  skylight: { before: 'skylight-glass-before', after: 'skylight-glass-after', caption: 'Skylight glass', alt: 'skylight glass' },
};

export const hasPair = (p: Pair) => Boolean(photo(p.before) && photo(p.after));
