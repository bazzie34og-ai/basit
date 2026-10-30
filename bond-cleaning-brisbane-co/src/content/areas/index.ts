import type { AreaContent } from '../../lib/types';
import { inner } from './inner';
import { eastWest } from './east-west';
import { north } from './north';

export const areaContent: Record<string, AreaContent> = Object.fromEntries(
  [...inner, ...eastWest, ...north].map((a) => [a.slug, a])
);
