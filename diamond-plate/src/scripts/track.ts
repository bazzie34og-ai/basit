/**
 * Tiny tracking layer: pushes events to dataLayer (GA4 picks them up when it is
 * loaded after consent). In preview mode every event is also logged to the console.
 */
type Payload = Record<string, unknown>;
declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void; __dpPreview?: boolean }
}

window.dataLayer = window.dataLayer || [];

export function track(event: string, data: Payload = {}) {
  const payload = { event, page_path: location.pathname, ...data };
  window.dataLayer.push(payload);
  if (window.gtag) window.gtag('event', event, { page_path: location.pathname, ...data });
  if (window.__dpPreview) console.info('[track]', event, payload);
}

const ATTR_KEY = 'dp_attr';
const ATTR_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid'] as const;

/** Store first-visit UTM parameters, gclid and referrer for this session. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const q = new URLSearchParams(location.search);
    const attr: Record<string, string> = { referrer: document.referrer || '', landing: location.pathname };
    ATTR_FIELDS.forEach((k) => (attr[k] = q.get(k) || ''));
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {
    /* storage blocked: attribution is best effort */
  }
}

export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || '{}');
  } catch {
    const q = new URLSearchParams(location.search);
    const attr: Record<string, string> = { referrer: document.referrer || '' };
    ATTR_FIELDS.forEach((k) => (attr[k] = q.get(k) || ''));
    return attr;
  }
}

/** Delegated click tracking for [data-track] links. */
export function bindClickTracking() {
  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track!, { link_url: (el as HTMLAnchorElement).href || '' });
  });
}
