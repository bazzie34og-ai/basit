import { track, captureUtms } from './track.ts';

captureUtms();

// --- Tracking: WhatsApp, call, book and upsell clicks ---
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a, button') as HTMLElement | null;
  if (!a) return;
  const explicit = a.dataset.track;
  const href = a.getAttribute('href') || '';
  const event = explicit || (href.startsWith('https://wa.me') ? 'whatsapp_click' : href.startsWith('tel:') ? 'call_click' : '');
  if (event) track(event, { label: a.dataset.trackLabel || a.textContent?.trim().slice(0, 60) });
});

// --- Fade-and-rise and the bridge drawing itself, once each ---
const els = document.querySelectorAll('.reveal, .draw');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
} else {
  els.forEach((el) => el.classList.add('is-in'));
}

// --- Close dropdowns on outside click / Escape ---
const dds = Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-dd]'));
document.addEventListener('click', (e) => {
  for (const d of dds) if (d.open && !d.contains(e.target as Node)) d.open = false;
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  for (const d of dds) if (d.open) { d.open = false; d.querySelector('summary')?.focus(); }
});
dds.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) for (const o of dds) if (o !== d) o.open = false;
}));

// --- Preview ribbon ---
const ribbon = document.getElementById('preview-ribbon');
if (ribbon) {
  try { if (sessionStorage.getItem('ss_ribbon') === '0') ribbon.hidden = true; } catch {}
  ribbon.querySelector('[data-dismiss-ribbon]')?.addEventListener('click', () => {
    ribbon.hidden = true;
    try { sessionStorage.setItem('ss_ribbon', '0'); } catch {}
  });
}

// --- GA4: only with an ID and the visitor's consent ---
const gaId = document.documentElement.dataset.ga;
if (gaId) {
  const load = () => {
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', gaId, { anonymize_ip: true });
  };
  let choice: string | null = null;
  try { choice = localStorage.getItem('ss_consent'); } catch {}
  if (choice === 'yes') load();
  else if (choice !== 'no') {
    const bar = document.getElementById('consent');
    if (bar) {
      bar.hidden = false;
      bar.addEventListener('click', (e) => {
        const v = (e.target as HTMLElement).closest('button')?.dataset.consent;
        if (!v) return;
        try { localStorage.setItem('ss_consent', v); } catch {}
        bar.hidden = true;
        if (v === 'yes') load();
      });
    }
  }
}

// upsell clicks get their own event
document.querySelectorAll<HTMLElement>('[data-upsell]').forEach((el) =>
  el.addEventListener('click', () => track('upsell_click', { label: el.dataset.upsell })),
);
