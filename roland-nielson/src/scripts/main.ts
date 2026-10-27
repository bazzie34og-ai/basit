// The only client JS on the site: nav, header state, reveal, form enhancement,
// video facades, map loader and GA4 events (events fire only when GA4 is configured).

type Gtag = (...args: unknown[]) => void;
const gtag = (): Gtag | undefined => (window as unknown as { gtag?: Gtag }).gtag;
const pageType = document.body.dataset.pageType || 'page'; // service, area, hub, question, blog, home, page
const track = (event: string, params: Record<string, unknown> = {}) =>
  gtag()?.('event', event, { page_path: location.pathname, page_type: pageType, ...params });

// --- Header dropdowns (<details>): one open at a time; close on outside click or Escape --
const drops = Array.from(document.querySelectorAll<HTMLDetailsElement>('[data-drop]'));
drops.forEach((d) => d.addEventListener('toggle', () => { if (d.open) drops.forEach((o) => o !== d && (o.open = false)); }));
document.addEventListener('click', (e) => drops.forEach((d) => { if (d.open && !d.contains(e.target as Node)) d.open = false; }));
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = drops.find((d) => d.open);
  if (open) { open.open = false; open.querySelector('summary')?.focus(); }
});

// --- Mobile menu --------------------------------------------------------------
const header = document.querySelector<HTMLElement>('[data-header]');
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-btn]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const setMenu = (open: boolean) => {
  if (!menuBtn || !menu || !header) return;
  menuBtn.setAttribute('aria-expanded', String(open));
  menu.hidden = !open;
  header.classList.toggle('open', open);
};
menuBtn?.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuBtn?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuBtn.focus();
  }
});

// --- Header gains a background on scroll --------------------------------------
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// --- Slow fade-and-rise on scroll ---------------------------------------------
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }),
    { rootMargin: '0px 0px -8% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// --- UTM capture (first touch, kept for the session) --------------------------
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const params = new URLSearchParams(location.search);
const store = {
  get: (k: string) => { try { return sessionStorage.getItem(k) ?? ''; } catch { return ''; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};
UTM_KEYS.forEach((k) => { const v = params.get(k); if (v && !store.get(k)) store.set(k, v); });

// --- Forms: hidden fields, inline validation, lead event ----------------------
const messages: Record<string, string> = {
  name: 'Please add your name.',
  phone: 'Please add a phone number with area code, like (402) 555-0123.',
  email: 'Please add an email address, like name@example.com.',
  consent: 'Please check this box so we both know what coaching is and is not.',
};
document.querySelectorAll<HTMLFormElement>('[data-lead-form]').forEach((form) => {
  form.noValidate = true;
  const src = form.querySelector<HTMLInputElement>('[data-source]');
  if (src) src.value = location.pathname;
  form.querySelectorAll<HTMLInputElement>('[data-utm]').forEach((i) => { i.value = store.get(i.dataset.utm!) || params.get(i.dataset.utm!) || ''; });

  const check = (el: HTMLInputElement | HTMLTextAreaElement) => {
    const field = el.closest('.field');
    const err = field?.querySelector('.error');
    let msg = '';
    if (el instanceof HTMLInputElement && el.name === 'phone' && el.value.replace(/\D/g, '').length < 10 && el.value.trim()) msg = messages.phone;
    if (!el.validity.valid) msg = messages[el.name] ?? 'Please check this field.';
    if (err) err.textContent = msg;
    if (msg) { field?.setAttribute('data-invalid', ''); el.setAttribute('aria-invalid', 'true'); }
    else { field?.removeAttribute('data-invalid'); el.removeAttribute('aria-invalid'); }
    return !msg;
  };
  const fields = () => Array.from(form.querySelectorAll<HTMLInputElement>('input[required], input[type=email], input[type=tel]'));
  // Re-check while typing (not on blur): clearing an error on blur shifts the layout
  // under the pointer and can swallow the click on the submit button.
  fields().forEach((el) => {
    const recheck = () => el.closest('.field')?.hasAttribute('data-invalid') && check(el);
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });
  form.addEventListener('submit', (e) => {
    const bad = fields().filter((el) => !check(el));
    if (bad.length) {
      e.preventDefault();
      bad[0].focus();
      return;
    }
    track('generate_lead', { form_name: 'coaching-inquiry', form_type: form.querySelector<HTMLInputElement>('[name=form_type]')?.value, transport_type: 'beacon' });
  });
});

// Contact page: "Stuck on what to say?" starters fill the message box.
document.querySelectorAll<HTMLButtonElement>('[data-starter]').forEach((b) =>
  b.addEventListener('click', () => {
    const box = document.querySelector<HTMLTextAreaElement>('#contact-message');
    if (!box) return;
    box.value = b.dataset.starter ?? '';
    box.focus();
    box.setSelectionRange(box.value.length, box.value.length);
  }),
);

// --- Lite YouTube facade --------------------------------------------------------
document.querySelectorAll<HTMLButtonElement>('[data-yt]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${btn.dataset.yt}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = btn.dataset.title ?? 'YouTube video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    btn.replaceWith(iframe);
    iframe.focus();
    track('video_play', { video_title: btn.dataset.title, video_provider: 'youtube' });
  }),
);

// --- Self-hosted video --------------------------------------------------------
document.querySelectorAll<HTMLVideoElement>('video[data-video]').forEach((v) =>
  v.addEventListener('play', () => track('video_play', { video_title: v.dataset.video, video_provider: 'self' }), { once: true }),
);

// --- Google Map on demand -----------------------------------------------------
document.querySelectorAll<HTMLButtonElement>('[data-map-load]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const card = btn.closest('[data-map]');
    const svg = card?.querySelector('svg');
    const iframe = document.createElement('iframe');
    iframe.src = btn.dataset.mapLoad!;
    iframe.title = 'Google Map of the Omaha, NE service area';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    svg?.replaceWith(iframe);
    btn.remove();
  }),
);

// --- Click events: call, text, email, Calendly --------------------------------
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest('a');
  if (!a) return;
  const href = a.getAttribute('href') ?? '';
  if (href.startsWith('tel:')) track('click_call', { link_url: href });
  else if (href.startsWith('sms:')) track('click_text', { link_url: href });
  else if (href.startsWith('mailto:')) track('click_email', { link_url: href });
  else if (href.includes('calendly.com')) track('click_calendly', { link_url: href });
});

// --- Consent notice (only rendered when GA4 is configured) --------------------
const bar = document.querySelector<HTMLElement>('[data-consent]');
if (bar) {
  let saved: string | null = null;
  try { saved = localStorage.getItem('rn-consent'); } catch { /* ignore */ }
  if (!saved) bar.hidden = false;
  bar.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((b) =>
    b.addEventListener('click', () => {
      const v = b.dataset.consentChoice!;
      try { localStorage.setItem('rn-consent', v); } catch { /* ignore */ }
      gtag()?.('consent', 'update', { analytics_storage: v });
      bar.hidden = true;
    }),
  );
}
