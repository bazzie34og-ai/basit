// Paws 2 Purrs: all site behaviour in one small vanilla module (no libraries).
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const store = {
  get(k: string, session = false) { try { return (session ? sessionStorage : localStorage).getItem(k); } catch { return null; } },
  set(k: string, v: string, session = false) { try { (session ? sessionStorage : localStorage).setItem(k, v); } catch { /* storage blocked */ } },
};
const pageService = document.body.dataset.waService || '';

/* ---------- Click tracking (GA4, only if gtag exists) ---------- */
function track(event: string, params: Record<string, string> = {}) {
  const g = (window as any).gtag;
  if (typeof g === 'function') g('event', event, { service: pageService, page_path: location.pathname, ...params });
}
document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest<HTMLAnchorElement>('a[href]');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  let ev = a.dataset.track;
  if (!ev) {
    if (href.startsWith('tel:')) ev = 'call_click';
    else if (href.includes('wa.me/')) ev = 'whatsapp_click';
    else if (href.startsWith('sms:')) ev = 'sms_click';
    else if (href.startsWith('mailto:')) ev = 'email_click';
  }
  if (ev) track(ev, { link_location: a.closest('[data-track-area]')?.getAttribute('data-track-area') || a.closest('header,footer,nav,section')?.className.split(' ')[0] || '' });
});

/* ---------- Header + paw progress ---------- */
const header = $('[data-header]');
const progress = $('[data-paw-progress]');
let ticking = false;
function onScroll() {
  ticking = false;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 24);
  if (progress) {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? Math.min(1, y / max) : 0;
    progress.style.clipPath = `inset(0 ${(100 - pct * 100).toFixed(2)}% 0 0)`;
  }
  updateTrail();
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
addEventListener('resize', () => { layoutTrail(); onScroll(); });

/* ---------- Announcement ---------- */
$('[data-announce-close]')?.addEventListener('click', () => {
  const bar = $('[data-announce]');
  if (!bar) return;
  store.set('p2p-ann', bar.dataset.announce || '1');
  document.documentElement.classList.add('ann-off');
});

/* ---------- Mobile menu sheet ---------- */
const sheet = $('#menu-sheet');
const openBtn = $('[data-menu-open]');
function closeMenu() {
  if (!sheet || sheet.hidden) return;
  sheet.hidden = true; sheet.classList.remove('is-open');
  document.body.style.overflow = '';
  openBtn?.setAttribute('aria-expanded', 'false');
  openBtn?.focus();
}
openBtn?.addEventListener('click', () => {
  if (!sheet) return;
  sheet.hidden = false; sheet.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  openBtn.setAttribute('aria-expanded', 'true');
  $<HTMLButtonElement>('[data-menu-close]', sheet)?.focus();
});
$('[data-menu-close]')?.addEventListener('click', closeMenu);
sheet?.addEventListener('click', (e) => { if ((e.target as Element).closest('a')) closeMenu(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  if (e.key === 'Tab' && sheet && !sheet.hidden) {
    const f = $$<HTMLElement>('a, button', sheet);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  }
});

/* ---------- Reveal on scroll ---------- */
const reveals = $$('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('is-in'));

/* ---------- Enquiry form ---------- */
const form = $<HTMLFormElement>('form[data-enquiry]');
const bar = $('[data-mobile-bar]');

// Hide the sticky bar while typing in the form
document.addEventListener('focusin', (e) => {
  if ((e.target as Element).matches('input, textarea, select')) bar?.classList.add('is-hidden');
});
document.addEventListener('focusout', () => {
  setTimeout(() => { if (!(document.activeElement as Element)?.matches?.('input, textarea, select')) bar?.classList.remove('is-hidden'); }, 120);
});

function selectService(value: string | null) {
  if (!form || !value) return;
  const radio = $$<HTMLInputElement>('input[name="service"]', form).find((r) => r.value.toLowerCase() === value.toLowerCase());
  if (radio) radio.checked = true;
}

// Enquire links scroll to the form if this page has one
$$<HTMLAnchorElement>('a[data-enquire]').forEach((a) => {
  a.addEventListener('click', (e) => {
    if (!form) return;
    e.preventDefault();
    const svc = new URL(a.href, location.href).searchParams.get('service');
    selectService(svc);
    const target = $('#enquire') || form;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => $<HTMLElement>('input, textarea', form)?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
  });
});

if (form) {
  const params = new URLSearchParams(location.search);
  selectService(params.get('service') || form.dataset.defaultService || null);
  const steps = $$<HTMLFieldSetElement>('[data-step]', form);
  const dots = $$('[data-step-dot]', form);
  form.classList.add('is-stepped');

  const showStep = (n: number, focus = true) => {
    steps.forEach((s, i) => { s.hidden = i !== n; });
    dots.forEach((d, i) => { d.classList.toggle('is-active', i === n); d.classList.toggle('is-done', i < n); });
    if (focus) {
      const first = $<HTMLElement>('input:not([type=hidden]), textarea', steps[n]);
      first?.focus({ preventScroll: true });
      form.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };
  showStep(0, false);

  const ukMobile = (v: string) => /^(?:\+44|0044|0)7\d{9}$/.test(v.replace(/[\s\-().]/g, ''));
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

  function setError(field: HTMLElement, msg: string) {
    const wrap = field.closest('.field, .chips-field') as HTMLElement;
    const err = wrap?.querySelector('.field-error') as HTMLElement;
    if (err) err.textContent = msg;
    wrap?.classList.toggle('has-error', !!msg);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function validateStep(n: number) {
    let firstBad: HTMLElement | null = null;
    const fail = (el: HTMLElement, msg: string) => { setError(el, msg); if (!firstBad) firstBad = el; };
    const s = steps[n];
    if (n === 0) {
      const svc = $<HTMLInputElement>('input[name="service"]:checked', form);
      const svcFirst = $<HTMLInputElement>('input[name="service"]', form)!;
      if (!svc) fail(svcFirst, 'Pick the service you need, or "Not sure" is fine.'); else setError(svcFirst, '');
      const dog = form.elements.namedItem('dog_name') as HTMLInputElement;
      if (!dog.value.trim()) fail(dog, "What's your dog's name? (Or your cat's!)"); else setError(dog, '');
    } else {
      const name = form.elements.namedItem('name') as HTMLInputElement;
      if (!name.value.trim()) fail(name, 'Please tell Vanessa your name.'); else setError(name, '');
      const mob = form.elements.namedItem('mobile') as HTMLInputElement;
      if (!mob.value.trim()) fail(mob, 'A mobile number helps Vanessa get back to you quickly.');
      else if (!ukMobile(mob.value)) fail(mob, 'That doesn\'t look like a UK mobile. Try something like 07700 900123.');
      else setError(mob, '');
      const em = form.elements.namedItem('email') as HTMLInputElement;
      const wantsEmail = ($<HTMLInputElement>('input[name="contact_method"]:checked', form)?.value || '') === 'Email';
      if (em.value.trim() && !emailOk(em.value.trim())) fail(em, 'Please check the email address.');
      else if (wantsEmail && !em.value.trim()) fail(em, 'Add your email so Vanessa can reply that way.');
      else setError(em, '');
    }
    if (firstBad) (firstBad as HTMLElement).focus();
    return !firstBad && s;
  }

  // Live clear errors as people fix them
  form.addEventListener('input', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('.has-error')) setError(t, '');
  });
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLElement;
    if (t.closest('.has-error')) setError(t, '');
  });

  $('[data-next]', form)?.addEventListener('click', () => { if (validateStep(0)) showStep(1); });
  $('[data-back]', form)?.addEventListener('click', () => showStep(0));

  // "Anything we should know?" prompt chips
  $$<HTMLButtonElement>('[data-prompt]', form).forEach((b) => b.addEventListener('click', () => {
    const ta = form.elements.namedItem('notes') as HTMLTextAreaElement;
    const txt = b.dataset.prompt!;
    ta.value = ta.value.trim() ? `${ta.value.trim()}\n${txt}` : txt;
    b.setAttribute('aria-pressed', 'true');
    ta.focus();
  }));

  form.addEventListener('submit', (e) => {
    const onStep1 = !steps[0].hidden && steps.length > 1;
    if (onStep1) {
      e.preventDefault();
      if (validateStep(0)) showStep(1);
      return;
    }
    if (!validateStep(0) || !validateStep(1)) {
      e.preventDefault();
      if (!validateStep(0)) showStep(0);
      return;
    }
    const fd = new FormData(form);
    const g = (k: string) => String(fd.get(k) || '').trim();
    const lines = [
      `Hi Vanessa, I've just sent an enquiry on the Paws 2 Purrs website.`,
      `Service: ${g('service')}`,
      g('dates') && `When: ${g('dates')}`,
      g('start_date') && `Start date: ${g('start_date')}`,
      `Pet: ${g('dog_name')}${g('breed') ? `, ${g('breed')}` : ''}${g('age') ? `, ${g('age')}` : ''}`,
      g('notes') && `Notes: ${g('notes')}`,
      `From: ${g('name')}${g('area') ? ` (${g('area')})` : ''}`,
      `Mobile: ${g('mobile')}`,
      g('contact_method') && `Best way to reach me: ${g('contact_method')}`,
    ].filter(Boolean);
    store.set('p2p-enquiry', JSON.stringify({ text: lines.join('\n'), name: g('name'), dog: g('dog_name') }), true);
    track('form_submit', { service: g('service') });
    const btn = $<HTMLButtonElement>('button[type="submit"]', form);
    if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent || ''; btn.textContent = 'Sending…'; }
  });
  // If the browser restores the page from cache after Back, re-enable the button
  addEventListener('pageshow', () => {
    const btn = $<HTMLButtonElement>('button[type="submit"]', form);
    if (btn?.disabled) { btn.disabled = false; btn.textContent = btn.dataset.label || 'Send to Vanessa'; }
  });
}

/* ---------- Thank-you page: WhatsApp summary ---------- */
const waSummary = $<HTMLAnchorElement>('[data-wa-summary]');
if (waSummary) {
  const raw = store.get('p2p-enquiry', true);
  if (raw) {
    try {
      const d = JSON.parse(raw);
      const num = waSummary.dataset.number;
      waSummary.href = `https://wa.me/${num}?text=${encodeURIComponent(d.text)}`;
      const box = $('[data-wa-summary-box]');
      if (box) box.hidden = false;
      const pre = $('[data-wa-preview]');
      if (pre) pre.textContent = d.text;
      const hi = $('[data-thanks-name]');
      if (hi && d.name) hi.textContent = `, ${d.name.split(' ')[0]}`;
    } catch { /* ignore */ }
  }
}

/* ---------- Map: click to load ---------- */
$$<HTMLButtonElement>('[data-map-load]').forEach((btn) => btn.addEventListener('click', () => {
  const holder = btn.closest('[data-map]') as HTMLElement;
  const iframe = document.createElement('iframe');
  iframe.src = holder.dataset.map!;
  iframe.title = 'Map of Arnold, Nottingham and nearby areas';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  iframe.allowFullscreen = true;
  holder.querySelector('.map__frame')?.replaceChildren(iframe);
  holder.classList.add('is-loaded');
}));

/* ---------- Gallery: filters + lightbox ---------- */
const chips = $$<HTMLButtonElement>('[data-filter]');
const items = $$<HTMLElement>('[data-tags]');
chips.forEach((c) => c.addEventListener('click', () => {
  const f = c.dataset.filter!;
  chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
  items.forEach((it) => { it.hidden = f !== 'all' && !it.dataset.tags!.split(' ').includes(f); });
}));

const lb = $<HTMLDialogElement>('[data-lightbox]');
let lbIndex = 0;
const lbTriggers = $$<HTMLButtonElement>('[data-lb-open]');
function visibleTriggers() { return lbTriggers.filter((t) => !(t.closest('[data-tags]') as HTMLElement)?.hidden); }
function renderLightbox() {
  if (!lb) return;
  const list = visibleTriggers();
  const t = list[lbIndex];
  if (!t) return;
  const src = t.querySelector('picture')!.cloneNode(true) as HTMLElement;
  src.querySelector('img')?.setAttribute('loading', 'eager');
  $('.lb__img', lb)!.replaceChildren(src);
  $('.lb__cap', lb)!.textContent = t.dataset.caption || '';
  $('.lb__count', lb)!.textContent = `${lbIndex + 1} / ${list.length}`;
}
function openLightbox(i: number) {
  if (!lb) return;
  lbIndex = i; renderLightbox();
  if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (lb?.open) { lb.close(); }
}
lb?.addEventListener('close', () => { document.body.style.overflow = ''; });
function stepLightbox(d: number) {
  const n = visibleTriggers().length;
  lbIndex = (lbIndex + d + n) % n; renderLightbox();
}
lbTriggers.forEach((t) => t.addEventListener('click', () => openLightbox(visibleTriggers().indexOf(t))));
if (lb) {
  $('[data-lb-prev]', lb)?.addEventListener('click', () => stepLightbox(-1));
  $('[data-lb-next]', lb)?.addEventListener('click', () => stepLightbox(1));
  $('[data-lb-close]', lb)?.addEventListener('click', closeLightbox);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
  let x0: number | null = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) stepLightbox(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

/* ---------- "A day in the pack": paw trail that walks along the path ---------- */
const trail = $('[data-trail]');
const trailPath = trail ? $<SVGPathElement>('[data-trail-path]', trail) : null;
const trailDraw = trail ? $<SVGPathElement>('[data-trail-draw]', trail) : null;
const trailPaws: HTMLElement[] = [];
let trailLen = 0;
function layoutTrail() {
  if (!trail || !trailPath || !trailDraw) return;
  if (getComputedStyle(trail).display === 'none') return;
  trailLen = trailPath.getTotalLength();
  trailDraw.style.strokeDasharray = `${trailLen}`;
  const svg = trailPath.ownerSVGElement!;
  const vb = svg.viewBox.baseVal;
  const count = 22;
  if (!trailPaws.length) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'trail-paw';
      trail.appendChild(p);
      trailPaws.push(p);
    }
  }
  trailPaws.forEach((p, i) => {
    const at = ((i + 0.5) / count) * trailLen;
    const pt = trailPath.getPointAtLength(at);
    const pt2 = trailPath.getPointAtLength(Math.min(trailLen, at + 2));
    const ang = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI + 90;
    const side = i % 2 ? 9 : -9; // alternate left / right feet
    const rad = ((ang) * Math.PI) / 180;
    const ox = Math.cos(rad) * side, oy = Math.sin(rad) * side;
    p.style.left = `${((pt.x + ox) / vb.width) * 100}%`;
    p.style.top = `${((pt.y + oy) / vb.height) * svg.clientHeight}px`;
    p.style.setProperty('--r', `${ang}deg`);
    p.dataset.at = String(at / trailLen);
  });
}
function updateTrail() {
  if (!trail || !trailDraw || !trailLen) return;
  const r = trail.getBoundingClientRect();
  const start = innerHeight * 0.85, end = innerHeight * 0.35;
  let pct = (start - r.top) / (r.height + start - end);
  pct = reduceMotion ? 1 : Math.max(0, Math.min(1, pct));
  trailDraw.style.strokeDashoffset = String(trailLen * (1 - pct));
  trailPaws.forEach((p) => p.classList.toggle('is-on', Number(p.dataset.at) <= pct));
}
layoutTrail();
onScroll();
