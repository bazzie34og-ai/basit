// Tiny event tracker. Sends to GA4 only if it has been loaded (ID set + consent).
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void }
}

export function track(event: string, params: Params = {}) {
  try {
    const page = location.pathname;
    if (typeof window.gtag === 'function') window.gtag('event', event, { page_path: page, ...params });
    (window.dataLayer ||= []).push({ event, page_path: page, ...params });
  } catch {
    /* tracking must never break the page */
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];

/** First-touch UTMs, kept for the session so the booking form can send them */
export function captureUtms() {
  try {
    if (sessionStorage.getItem('ss_utm')) return;
    const q = new URLSearchParams(location.search);
    const found: Record<string, string> = {};
    for (const k of UTM_KEYS) { const v = q.get(k); if (v) found[k] = v.slice(0, 100); }
    found.landing = location.pathname;
    found.referrer = document.referrer.slice(0, 200);
    sessionStorage.setItem('ss_utm', JSON.stringify(found));
  } catch { /* storage blocked: fine */ }
}

export function readUtms(): Record<string, string> {
  try { return JSON.parse(sessionStorage.getItem('ss_utm') || '{}'); } catch { return {}; }
}
