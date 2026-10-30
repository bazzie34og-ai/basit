/* Sitewide behaviour. Small, dependency-free, progressive enhancement only. */
type DL = Record<string, unknown>;
const w = window as unknown as { dataLayer: DL[] };
w.dataLayer = w.dataLayer || [];
const track = (event: string, data: DL = {}) => w.dataLayer.push({ event, page_path: location.pathname, ...data });

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

/* ---------- Click tracking: call_click, whatsapp_click ---------- */
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('[data-track]');
  if (el) track(el.dataset.track!, { location: el.dataset.trackLocation || '' });
});

/* ---------- Quote links: jump to the on-page form when there is one ---------- */
const pageQuote = document.getElementById('quote');
if (pageQuote) $$<HTMLAnchorElement>('[data-quote-link]').forEach((a) => (a.href = '#quote'));

/* ---------- Header shrink ---------- */
const header = $('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mega menus ---------- */
const toggles = $$<HTMLButtonElement>('[data-mega-toggle]');
const closeMegas = (except?: HTMLButtonElement) =>
  toggles.forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    document.getElementById(b.getAttribute('aria-controls')!)?.classList.remove('is-open');
  });
toggles.forEach((btn) => {
  const panel = document.getElementById(btn.getAttribute('aria-controls')!);
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeMegas(btn);
    btn.setAttribute('aria-expanded', String(open));
    panel?.classList.toggle('is-open', open);
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const openBtn = toggles.find((b) => b.getAttribute('aria-expanded') === 'true');
  closeMegas();
  openBtn?.focus();
  closeMenu();
});
document.addEventListener('click', (e) => {
  if (!(e.target as Element).closest('[data-mega], [data-mega-toggle]')) closeMegas();
});

/* ---------- Mobile menu ---------- */
const menu = $('[data-menu]');
const openBtn = $<HTMLButtonElement>('[data-menu-open]');
function closeMenu() {
  if (!menu?.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  document.body.style.overflow = '';
  openBtn?.setAttribute('aria-expanded', 'false');
  openBtn?.focus();
}
openBtn?.addEventListener('click', () => {
  menu?.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  openBtn.setAttribute('aria-expanded', 'true');
  $<HTMLButtonElement>('[data-menu-close]', menu!)?.focus();
});
$('[data-menu-close]')?.addEventListener('click', closeMenu);
menu?.addEventListener('click', (e) => {
  if ((e.target as Element).closest('a')) closeMenu();
});
menu?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const f = $$<HTMLElement>('a, button, summary', menu).filter((x) => x.offsetParent !== null);
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

/* ---------- Reveal on scroll ---------- */
const reveals = $$('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('is-visible'));

/* ---------- Mobile bar hides while a quote form is on screen ---------- */
const bar = $('[data-mobile-bar]');
const cards = $$('[data-quote-card]');
if (bar && cards.length && 'IntersectionObserver' in window) {
  const visible = new Set<Element>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
    bar.classList.toggle('is-hidden', visible.size > 0);
  }, { threshold: 0.25 });
  cards.forEach((c) => io.observe(c));
}

/* ---------- UTM capture (first landing in this session) ---------- */
const params = new URLSearchParams(location.search);
const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
let utm: Record<string, string> = {};
try {
  utm = JSON.parse(sessionStorage.getItem('bcbc_utm') || '{}');
  if (utmKeys.some((k) => params.get(k))) {
    utm = Object.fromEntries(utmKeys.map((k) => [k, params.get(k) || '']));
    sessionStorage.setItem('bcbc_utm', JSON.stringify(utm));
  }
} catch { utmKeys.forEach((k) => (utm[k] = params.get(k) || '')); }

/* ---------- Quote forms ---------- */
$$<HTMLFormElement>('[data-quote-form]').forEach((form) => {
  const card = form.closest('[data-quote-card]')!;
  const progress = $('[data-progress]', form)!;
  const bar = $('[data-progress-bar]', form)!;
  const guideText = $('[data-guide-text]', form)!;
  const guide = form.dataset.guide ? JSON.parse(form.dataset.guide) : null;

  $<HTMLInputElement>('[data-page-url]', form)!.value = location.href;
  $$<HTMLInputElement>('[data-utm]', form).forEach((i) => (i.value = utm[i.dataset.utm!] || ''));

  const val = (name: string) => (form.elements.namedItem(name) as RadioNodeList | HTMLInputElement | null)?.value || '';

  const setError = (field: HTMLInputElement | HTMLSelectElement, msg: string) => {
    const wrap = field.closest('.field');
    wrap?.classList.toggle('has-error', !!msg);
    const out = wrap?.querySelector('[data-error]');
    if (out) out.textContent = msg;
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  };

  const showStep = (n: 1 | 2, focus = true) => {
    form.classList.toggle('on-step-2', n === 2);
    progress.textContent = `Step ${n} of 2`;
    bar.style.width = n === 1 ? '50%' : '100%';
    if (focus) (n === 2 ? $<HTMLInputElement>('input[name="name"]', form) : $<HTMLSelectElement>('select[name="suburb"]', form))?.focus();
  };

  const priceGuide = () => {
    if (!guide) return;
    const bed = val('bedrooms'), bath = val('bathrooms');
    const key = bed === '1' ? 'b1' : bed === '2' ? (bath === '1' ? 'b2' : 'b2b2') : bed === '3' ? 'b3' : bed === '4' ? 'b4' : '';
    const base = key ? guide.prices[key] : null;
    if (typeof base !== 'number') return;
    const hi = Math.round((base * (1 + guide.spread)) / 10) * 10;
    guideText.textContent = `Bond cleans like yours usually cost $${base}–$${hi}. We'll confirm your fixed price in writing.`;
  };

  $('[data-next]', form)!.addEventListener('click', () => {
    const suburb = $<HTMLSelectElement>('select[name="suburb"]', form)!;
    if (!suburb.value) { setError(suburb, 'Choose your suburb, or "Other".'); suburb.focus(); return; }
    setError(suburb, '');
    priceGuide();
    track('quote_step1', { suburb: suburb.value, bedrooms: val('bedrooms'), bathrooms: val('bathrooms'), carpets: val('carpets'), location: form.dataset.location });
    showStep(2);
    card.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  $('[data-back]', form)!.addEventListener('click', () => showStep(1));

  form.addEventListener('submit', (e) => {
    let ok = true;
    const name = $<HTMLInputElement>('input[name="name"]', form)!;
    const mobile = $<HTMLInputElement>('input[name="mobile"]', form)!;
    const email = $<HTMLInputElement>('input[name="email"]', form)!;
    const consent = $<HTMLInputElement>('input[name="consent"]', form)!;
    const digits = mobile.value.replace(/\D/g, '');
    setError(name, name.value.trim() ? '' : 'Tell us your name.');
    setError(mobile, digits.length >= 8 ? '' : 'Enter a mobile number so we can text your price.');
    setError(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) ? '' : 'Enter an email address for your quote and photo report.');
    const cErr = $('[data-consent-error]', form)!;
    cErr.textContent = consent.checked ? '' : 'Tick the box so we can contact you about this quote.';
    const files = $$<HTMLInputElement>('input[type="file"]', form).reduce((n, i) => n + (i.files?.[0]?.size || 0), 0);
    const fErr = $('[data-file-error]', form)!;
    fErr.textContent = files > 8 * 1024 * 1024 ? 'Photos are over 8 MB in total. Remove one or send them on WhatsApp instead.' : '';
    ok = !!name.value.trim() && digits.length >= 8 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) && consent.checked && files <= 8 * 1024 * 1024;
    if (!$<HTMLSelectElement>('select[name="suburb"]', form)!.value) { ok = false; showStep(1); return e.preventDefault(); }
    if (!ok) {
      e.preventDefault();
      ($('[aria-invalid="true"]', form) as HTMLElement | null)?.focus();
      return;
    }
    track('quote_submit', { suburb: val('suburb'), bedrooms: val('bedrooms'), location: form.dataset.location });
  });
});

/* ---------- Before/after slider ---------- */
$$('[data-ba]').forEach((el) => {
  const range = $<HTMLInputElement>('input[type="range"]', el)!;
  const hint = $('[data-ba-hint]', el);
  const set = () => { el.style.setProperty('--pos', `${range.value}%`); range.setAttribute('aria-valuetext', `${range.value}% after`); };
  range.addEventListener('input', () => { set(); hint?.remove(); });
  set();
});

/* ---------- Lightbox ---------- */
const lb = $<HTMLDialogElement>('[data-lightbox]');
if (lb) {
  const img = $<HTMLImageElement>('img', lb)!;
  const cap = $('p', lb)!;
  $$<HTMLButtonElement>('[data-lightbox-src]').forEach((btn) =>
    btn.addEventListener('click', () => {
      img.src = btn.dataset.lightboxSrc!;
      img.alt = btn.dataset.lightboxAlt || '';
      cap.textContent = btn.dataset.lightboxCaption || '';
      lb.showModal();
    })
  );
  $('[data-lightbox-close]', lb)?.addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
}
