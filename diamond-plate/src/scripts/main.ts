import { bindClickTracking, captureAttribution, track } from './track';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const cfg = (document.getElementById('dp-config')?.dataset ?? {}) as { ga4?: string; preview?: string };
window.__dpPreview = cfg.preview === 'true';

captureAttribution();
bindClickTracking();

/* ---------- Scroll reveal, gloss pass, beading, count-up ---------- */
const once = (els: NodeListOf<Element> | Element[], fn: (el: Element) => void, rootMargin = '0px 0px -10% 0px') => {
  if (!('IntersectionObserver' in window)) return Array.from(els).forEach(fn);
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); } }),
    { rootMargin },
  );
  els.forEach((el) => io.observe(el));
};

if (!reduced) {
  root.classList.add('reveal-ready');
  document.querySelectorAll<HTMLElement>('[data-reveal-group]').forEach((g) =>
    g.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', String(i))),
  );
  once(document.querySelectorAll('[data-reveal]'), (el) => el.classList.add('is-in'));
  once(document.querySelectorAll('[data-gloss]'), (el) => el.classList.add('is-in'), '0px 0px -30% 0px');
}
once(document.querySelectorAll('[data-bead]'), (el) => el.classList.add('is-beading'), '0px 0px -25% 0px');

const countUp = (el: HTMLElement) => {
  const target = Number(el.dataset.count);
  const prefix = el.dataset.prefix ?? '';
  const suffix = el.dataset.suffix ?? '';
  const fmt = (n: number) => prefix + Math.round(n).toLocaleString('en-AU') + suffix;
  if (reduced || !target) return;
  const dur = 1200;
  const t0 = performance.now();
  const step = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
once(document.querySelectorAll<HTMLElement>('[data-count]'), (el) => countUp(el as HTMLElement), '0px 0px -15% 0px');

/* ---------- price_view ---------- */
once(document.querySelectorAll('[data-price-view]'), () => track('price_view'), '0px 0px -40% 0px');

/* ---------- Services dropdown (keyboard + touch) ---------- */
document.querySelectorAll<HTMLButtonElement>('.menu-btn').forEach((btn) => {
  const li = btn.parentElement!;
  const set = (open: boolean) => { li.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); };
  btn.addEventListener('click', () => set(!li.classList.contains('open')));
  li.addEventListener('keydown', (e) => { if (e.key === 'Escape') { set(false); btn.focus(); } });
  document.addEventListener('click', (e) => { if (!li.contains(e.target as Node)) set(false); });
});

/* ---------- Before/after slider ---------- */
document.querySelectorAll<HTMLElement>('[data-ba]').forEach((ba) => {
  const range = ba.querySelector<HTMLInputElement>('input[type=range]')!;
  const update = () => {
    ba.style.setProperty('--pos', range.value + '%');
    range.setAttribute('aria-valuetext', `${range.value}% after`);
  };
  range.addEventListener('input', update);
  update();
});

/* ---------- Map facade: click to load ---------- */
document.querySelectorAll<HTMLButtonElement>('[data-map-src]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = btn.dataset.mapSrc!;
    iframe.title = btn.dataset.mapTitle || 'Map';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    const box = btn.closest('.map')!;
    box.querySelector('.map-facade')?.replaceWith(iframe);
    iframe.focus();
  });
});

/* ---------- Preview ribbon ---------- */
const ribbon = document.querySelector<HTMLElement>('[data-ribbon]');
if (ribbon) {
  try { if (localStorage.getItem('dp_ribbon') === 'hide') ribbon.hidden = true; } catch { /* ignore */ }
  ribbon.querySelector('button')?.addEventListener('click', () => {
    ribbon.hidden = true;
    try { localStorage.setItem('dp_ribbon', 'hide'); } catch { /* ignore */ }
  });
}

/* ---------- Consent + GA4 (only when PUBLIC_GA4_ID is set) ---------- */
const loadGA = (id: string) => {
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
};
if (cfg.ga4) {
  let choice: string | null = null;
  try { choice = localStorage.getItem('dp_consent'); } catch { /* ignore */ }
  const banner = document.querySelector<HTMLElement>('[data-consent]');
  if (choice === 'yes') loadGA(cfg.ga4);
  else if (!choice && banner) {
    banner.hidden = false;
    banner.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('button[data-choice]');
      if (!btn) return;
      const yes = btn.dataset.choice === 'yes';
      try { localStorage.setItem('dp_consent', yes ? 'yes' : 'no'); } catch { /* ignore */ }
      banner.hidden = true;
      if (yes) loadGA(cfg.ga4!);
    });
  }
}

/* ---------- Thank-you page conversion ---------- */
if (document.body.dataset.conversion === 'lead') {
  // Only count a real submission (flag set by the form), not a direct visit or reload.
  let fire = false;
  try { fire = sessionStorage.getItem('dp_quote_done') === '1'; sessionStorage.removeItem('dp_quote_done'); } catch { /* ignore */ }
  if (fire) track('generate_lead', { currency: 'AUD' });
}
