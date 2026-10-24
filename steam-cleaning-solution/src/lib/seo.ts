import { SITE_URL } from '../config/site';

/** OG image path for a page path: "/" → /og/home.png, "/guides/x/" → /og/guides/x.png */
export function ogPath(path: string): string {
  const clean = path.replace(/^\/|\/$/g, '');
  return `/og/${clean || 'home'}.png`;
}
export const canonical = (path: string) => `${SITE_URL}${path}`;
