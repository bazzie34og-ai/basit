// Build-time settings. Only import this from .astro frontmatter or endpoints,
// never from browser scripts.
const read = (key: string): string | undefined =>
  (typeof process !== 'undefined' ? process.env[key] : undefined) ??
  (import.meta.env?.[key] as string | undefined);

/** Preview builds are noindex, disallow-all and show the ribbon. Default: true. */
export const PREVIEW_MODE = (read('PREVIEW_MODE') ?? 'true').toLowerCase() !== 'false';
export const SITE_URL = (read('SITE_URL') || read('URL') || 'https://smith-and-shine-telford.netlify.app').replace(/\/$/, '');
export const GA4_ID = read('PUBLIC_GA4_ID') || '';
export const TURNSTILE_SITE_KEY = read('PUBLIC_TURNSTILE_SITE_KEY') || '';
