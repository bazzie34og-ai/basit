// Site behaviour: scroll progress, header, reveal, menu, form, geolocation, map, GA4 events.
const track = (name, params = {}) => {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
};

// Scroll progress + header tighten
const header = document.querySelector('.header');
const bar = document.querySelector('.progress span');
let ticking = false;
const onScroll = () => {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  if (bar) bar.style.setProperty('--p', max > 0 ? (h.scrollTop / max).toFixed(4) : 0);
  if (header) header.classList.toggle('is-scrolled', h.scrollTop > 24);
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// Reveal on scroll
const els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
} else {
  els.forEach((el) => el.classList.add('is-in'));
}

// Mobile menu
const mnav = document.getElementById('mnav');
const openBtn = document.querySelector('[data-menu-open]');
const closeMenu = () => {
  if (!mnav) return;
  mnav.hidden = true;
  document.body.style.overflow = '';
  openBtn?.setAttribute('aria-expanded', 'false');
  openBtn?.focus();
};
openBtn?.addEventListener('click', () => {
  mnav.hidden = false;
  document.body.style.overflow = 'hidden';
  openBtn.setAttribute('aria-expanded', 'true');
  mnav.querySelector('[data-menu-close]')?.focus();
});
mnav?.querySelector('[data-menu-close]')?.addEventListener('click', closeMenu);
mnav?.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && mnav && !mnav.hidden) closeMenu(); });

// Call / text click tracking
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="tel:"], a[href^="sms:"]');
  if (!a) return;
  const isCall = a.getAttribute('href').startsWith('tel:');
  track(isCall ? 'call_click' : 'text_click', { link_location: a.closest('header, footer, .actionbar, .hero, .cta') ?.className.split(' ')[0] || 'body', page_path: location.pathname });
});

// Request form: validation + geolocation
document.querySelectorAll('[data-request-form]').forEach((form) => {
  const field = (name) => form.elements[name];
  const setErr = (el, bad) => {
    el.closest('.field').classList.toggle('has-error', bad);
    el.setAttribute('aria-invalid', bad ? 'true' : 'false');
  };
  const digits = (v) => {
    let d = v.replace(/\D/g, '');
    if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
    return d;
  };
  const checks = {
    name: (v) => v.trim().length >= 2,
    phone: (v) => digits(v).length === 10,
    service: (v) => v !== '',
    location: (v) => v.trim().length >= 3,
  };
  const validate = (name) => {
    const el = field(name);
    const ok = checks[name](el.value);
    setErr(el, !ok);
    return ok;
  };
  Object.keys(checks).forEach((name) => {
    const el = field(name);
    el.addEventListener('blur', () => { if (el.value) validate(name); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validate(name); });
  });
  field('phone').addEventListener('blur', (e) => {
    const d = digits(e.target.value);
    if (d.length === 10) e.target.value = `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  });
  const errBox = form.querySelector('.form-error');
  const submitBtn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async (e) => {
    const results = Object.keys(checks).map(validate);
    if (results.includes(false)) {
      e.preventDefault();
      form.querySelector('.has-error input, .has-error select')?.focus();
      return;
    }
    if (form.elements['bot-field']?.value) { e.preventDefault(); return; }
    track('form_submit', { form_name: 'roadside-request', service: field('service').value, page_path: location.pathname });
    // Send in the background and go to the thank-you page; without JS the form posts normally.
    if (!form.dataset.ajax || !window.fetch) return;
    e.preventDefault();
    errBox.hidden = true;
    submitBtn.disabled = true;
    const label = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    try {
      // Netlify Forms takes URL-encoded posts; any 2xx means the request was stored.
      const res = await fetch(form.dataset.ajax, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
      if (!res.ok) throw new Error(res.status);
      location.href = '/thank-you/';
    } catch (err) {
      errBox.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
  });

  const geoBtn = form.querySelector('[data-geo]');
  const status = form.querySelector('.loc-status');
  geoBtn?.addEventListener('click', () => {
    const loc = field('location');
    if (!('geolocation' in navigator)) {
      status.textContent = 'Location isn’t available on this device. Please type a street, exit or landmark.';
      return;
    }
    status.textContent = 'Finding your location…';
    geoBtn.disabled = true;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        loc.value = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        status.textContent = `Got it — location added (accurate to about ${Math.round(accuracy)} m). Add a landmark in Notes if you can.`;
        geoBtn.disabled = false;
        validate('location');
      },
      (err) => {
        geoBtn.disabled = false;
        status.textContent = err.code === err.PERMISSION_DENIED
          ? 'Location permission was blocked. No problem — type your street, highway exit or a nearby landmark.'
          : 'We couldn’t get your location. Please type a street, highway exit or nearby landmark.';
        loc.focus();
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });
});

// Map: load the interactive Google map only when asked (keeps pages fast)
document.querySelectorAll('[data-map-load]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const box = btn.closest('.map');
    const f = document.createElement('iframe');
    f.src = box.dataset.src;
    f.title = 'Map of the LaCaze Roadside Assistance service area';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.allowFullscreen = true;
    box.appendChild(f);
    btn.remove();
  });
});
