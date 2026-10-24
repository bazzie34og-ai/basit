// Site-wide behaviour. Kept tiny: reveal + wand-line draw, tracking, first-touch attribution, consent.

// ---------- Draw-in / reveal, once ----------
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const targets = document.querySelectorAll<Element>('[data-wand], [data-reveal]');
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add(e.target.hasAttribute('data-wand') ? 'is-drawn' : 'is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.15 });
  targets.forEach((t) => io.observe(t));
} else {
  targets.forEach((t) => t.classList.add('is-drawn', 'is-in'));
}

// ---------- Storage (can throw in private modes) ----------
const store = {
  get(k: string, session = false) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch { return null; } },
  set(k: string, v: string, session = false) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch { /* ignore */ } },
};

// ---------- First-touch attribution (Facebook ads matter) ----------
try {
  if (!sessionStorage.getItem('scs_touch')) {
    const q = new URLSearchParams(location.search);
    const touch: Record<string, string> = { landing: location.pathname, ref: document.referrer.slice(0, 200), at: new Date().toISOString() };
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']) {
      const v = q.get(k);
      if (v) touch[k] = v.slice(0, 200);
    }
    sessionStorage.setItem('scs_touch', JSON.stringify(touch));
  }
} catch { /* storage blocked: attribution is optional */ }

// ---------- Tracking ----------
type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; scsTrack?: (e: string, p?: Record<string, unknown>) => void };
const w = window as W;
w.dataLayer = w.dataLayer || [];
w.scsTrack = (event, params = {}) => {
  const payload = { page: location.pathname, ...params };
  w.dataLayer!.push({ event, ...payload });
  if (typeof w.gtag === 'function') w.gtag('event', event, payload);
};
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (a) w.scsTrack!(a.dataset.track!, { where: a.dataset.where || '' });
});

// ---------- GA4: only with an ID AND consent ----------
const ga = document.body.dataset.ga4;
function loadGa(id: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  w.gtag = function () { w.dataLayer!.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', id, { anonymize_ip: true });
}
if (ga) {
  const choice = store.get('scs_consent');
  if (choice === 'yes') loadGa(ga);
  else if (choice !== 'no') {
    const bar = document.querySelector<HTMLElement>('[data-consent]');
    if (bar) {
      bar.hidden = false;
      bar.querySelector('[data-consent-yes]')?.addEventListener('click', () => { store.set('scs_consent', 'yes'); bar.hidden = true; loadGa(ga); });
      bar.querySelector('[data-consent-no]')?.addEventListener('click', () => { store.set('scs_consent', 'no'); bar.hidden = true; });
    }
  }
}

// ---------- Preview ribbon ----------
const ribbon = document.querySelector<HTMLElement>('[data-ribbon]');
if (ribbon) {
  if (store.get('scs_ribbon', true) === 'off') ribbon.hidden = true;
  const btn = ribbon.querySelector<HTMLButtonElement>('[data-ribbon-close]');
  if (btn) {
    btn.hidden = false;
    btn.addEventListener('click', () => { ribbon.hidden = true; store.set('scs_ribbon', 'off', true); });
  }
}
