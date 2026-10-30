import type { ServiceContent } from '../../lib/types';
import { coreA } from './core-a';
import { coreB } from './core-b';
import { carpet } from './carpet';
import { addons } from './addons';

export const serviceContent: Record<string, ServiceContent> = Object.fromEntries(
  [...coreA, ...coreB, ...carpet, ...addons].map((s) => [s.slug, s])
);
export const serviceShort: Record<string, string> = Object.fromEntries(
  Object.values(serviceContent).map((s) => [s.slug, s.short])
);
