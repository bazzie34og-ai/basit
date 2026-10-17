/**
 * Tiny event tracker. Pushes to window.dataLayer always; sends to GA4 only
 * when PUBLIC_GA4_ID is set AND the visitor said yes. In preview mode every
 * event is also logged to the console so it can be checked by eye.
 */
import { get, set } from './storage.ts';

type Params = Record<string, string | number | boolean | undefined>;
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

window.dataLayer = window.dataLayer || [];
const body = document.body;
const PREVIEW = body.dataset.preview === 'true';
const GA_ID = body.dataset.ga || '';

export function track(event: string, params: Params = {}): void {
  window.dataLayer.push({ event, ...params });
  if (window.gtag) window.gtag('event', event, params);
  if (PREVIEW) console.info('[track]', event, params);
}

// ── first-touch attribution, kept for the session and passed into the form ──
const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const;
export type Attribution = Partial<Record<(typeof ATTR_KEYS)[number] | 'landing' | 'referrer', string>>;

function captureFirstTouch(): void {
  if (get('session', 'lm_ft')) return;
  const q = new URLSearchParams(location.search);
  const attr: Attribution = { landing: location.pathname, referrer: document.referrer || '' };
  for (const k of ATTR_KEYS) {
    const v = q.get(k);
    if (v) attr[k] = v.slice(0, 200);
  }
  set('session', 'lm_ft', JSON.stringify(attr));
}

export function attribution(): Attribution {
  try {
    return JSON.parse(get('session', 'lm_ft') || '{}');
  } catch {
    return {};
  }
}

captureFirstTouch();

// ── clicks: anything marked data-track, plus any bare wa.me / tel: link ──
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest?.('a, button') as HTMLAnchorElement | HTMLButtonElement | null;
  if (!el) return;
  let name = el.dataset.track;
  const href = el instanceof HTMLAnchorElement ? el.href : '';
  if (!name && href.startsWith('https://wa.me/')) name = 'whatsapp_click';
  if (!name && href.startsWith('tel:')) name = 'call_click';
  if (name) track(name, { page: location.pathname, label: (el.textContent || '').trim().slice(0, 60) });
});

// ── price_view: someone actually looked at the tariff ──
const tariff = document.querySelector('[data-price-view]');
if (tariff && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((en) => en.isIntersecting)) {
        track('price_view', { page: location.pathname });
        io.disconnect();
      }
    },
    { threshold: 0.3 },
  );
  io.observe(tariff);
}

// ── GA4, only with consent ──
function loadGA(): void {
  if (!GA_ID || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(s);
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

if (GA_ID) {
  const choice = get('local', 'lm_consent');
  const bar = document.getElementById('consent');
  if (choice === 'granted') loadGA();
  else if (!choice && bar) bar.hidden = false;
  bar?.addEventListener('click', (e) => {
    const b = (e.target as Element).closest('[data-consent]') as HTMLElement | null;
    if (!b) return;
    const v = b.dataset.consent!;
    set('local', 'lm_consent', v);
    bar.hidden = true;
    if (v === 'granted') loadGA();
  });
}
