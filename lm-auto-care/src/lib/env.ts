// Build-time settings. Read once here so pages never touch process.env directly.
const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;

/** Preview is the default until someone deliberately sets PREVIEW_MODE=false. */
export const PREVIEW_MODE = (env.PREVIEW_MODE ?? 'true').toLowerCase() !== 'false';

// TODO-CONFIRM: the live domain. lmautocare.co.uk is taken; lmautocare.uk or lmvaleting.co.uk suggested.
export const SITE_URL = (env.SITE_URL || env.URL || 'https://lm-auto-care-preview.netlify.app').replace(/\/$/, '');

export const GA4_ID = env.PUBLIC_GA4_ID || '';
export const TURNSTILE_SITE_KEY = env.PUBLIC_TURNSTILE_SITE_KEY || '';
