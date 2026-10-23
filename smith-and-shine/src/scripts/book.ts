import { estimate, estimateShort } from '../lib/estimate.ts';
import { validateBooking, bookingSummaryText, type FieldErrors } from '../lib/booking.ts';
import { sizes, activeServices, whatsappHref } from '../config/site.ts';
import { track, readUtms } from './track.ts';

const form = document.getElementById('book-form') as HTMLFormElement | null;
if (form) init(form);

function init(form: HTMLFormElement) {
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('.step'));
  const progress = Array.from(form.querySelectorAll<HTMLLIElement>('.progress li'));
  const formError = document.getElementById('form-error')!;
  const estAmt = document.getElementById('est-amt')!;
  const estNote = document.getElementById('est-note')!;
  const estSum = document.getElementById('est-sum')!;
  const serviceSel = form.elements.namedItem('service') as HTMLSelectElement;
  const photosInput = form.elements.namedItem('photos') as HTMLInputElement;
  const maxPhotos = Number(form.dataset.maxPhotos || 3);
  let current = 0;
  let started = false;
  let estimateTracked = false;
  let photos: File[] = [];

  const val = (name: string) => {
    const el = form.elements.namedItem(name) as HTMLInputElement | RadioNodeList | null;
    if (!el) return '';
    return ('value' in el ? el.value : '').trim();
  };
  const setHidden = (name: string, v: string) => {
    const el = form.elements.namedItem(name) as HTMLInputElement | null;
    if (el) el.value = v;
  };

  // Time-trap starts when the page is actually opened
  setHidden('ts', String(Date.now()));
  setHidden('pageUrl', location.pathname + location.search);
  const utm = readUtms();
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'landing', 'referrer']) {
    if (utm[k]) setHidden(k, utm[k]);
  }

  // Preselect from ?service=&size=
  const q = new URLSearchParams(location.search);
  const qSize = q.get('size');
  const qService = q.get('service');
  if (qSize) {
    const r = form.querySelector<HTMLInputElement>(`input[name="size"][value="${CSS.escape(qSize)}"]`);
    if (r) r.checked = true;
  } else if (qService) {
    const s = activeServices.find((x) => x.id === qService);
    if (s && s.forSizes.length === 1) {
      const r = form.querySelector<HTMLInputElement>(`input[name="size"][value="${s.forSizes[0]}"]`);
      if (r) r.checked = true;
    }
  }
  if (qService && activeServices.some((s) => s.id === qService)) serviceSel.value = qService;

  form.addEventListener('focusin', () => {
    if (!started) { started = true; track('book_start', { label: 'form' }); }
  });

  // ---- steps ----
  function show(i: number, focus = true) {
    current = i;
    steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
    progress.forEach((p, n) => {
      p.classList.toggle('is-current', n === i);
      p.classList.toggle('is-done', n < i);
    });
    if (focus) {
      const legend = steps[i].querySelector('legend');
      legend?.setAttribute('tabindex', '-1');
      legend?.focus();
      steps[i].scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }
  show(0, false);

  const stepFields: (keyof FieldErrors)[][] = [['vehicle', 'size', 'service'], ['postcode'], ['name', 'phone', 'email']];

  function collect(): Record<string, string> {
    const fd = new FormData(form);
    const o: Record<string, string> = {};
    fd.forEach((v, k) => { if (typeof v === 'string') o[k] = v; });
    return o;
  }

  function showErrors(errors: FieldErrors, only?: (keyof FieldErrors)[]) {
    const keys = only ?? (Object.keys(errors) as (keyof FieldErrors)[]);
    const all: (keyof FieldErrors)[] = only ?? ['vehicle', 'size', 'service', 'postcode', 'name', 'phone', 'email', 'howHeard'];
    let firstBad: HTMLElement | null = null;
    for (const k of all) {
      const msg = errors[k] || '';
      const errEl = document.getElementById(`${k}-err`);
      if (errEl) errEl.textContent = msg;
      const input = k === 'size'
        ? form.querySelector<HTMLElement>('[role="radiogroup"]')
        : (form.elements.namedItem(k) as HTMLElement | null);
      if (input) {
        if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
      }
      if (msg && !firstBad && keys.includes(k)) {
        firstBad = k === 'size' ? form.querySelector<HTMLElement>('input[name="size"]') : (form.elements.namedItem(k) as HTMLElement);
      }
    }
    return firstBad as HTMLElement | null;
  }

  function validateStep(i: number): boolean {
    const r = validateBooking(collect());
    const errors = r.ok ? {} : r.errors;
    const bad = showErrors(errors, stepFields[i]);
    if (bad) { bad.focus(); return false; }
    return true;
  }

  form.querySelectorAll('[data-next]').forEach((b) => b.addEventListener('click', () => {
    if (validateStep(current)) show(Math.min(current + 1, steps.length - 1));
  }));
  form.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => show(Math.max(current - 1, 0))));

  // ---- live estimate ----
  function filterServices() {
    const size = val('size');
    for (const opt of Array.from(serviceSel.options)) {
      if (!opt.value) continue;
      const ok = !size || (opt.dataset.sizes || '').split(',').includes(size);
      opt.disabled = !ok;
      opt.hidden = !ok;
    }
    if (serviceSel.selectedOptions[0]?.disabled) serviceSel.value = '';
  }

  function updateEstimate() {
    const size = val('size');
    const service = val('service');
    const e = estimate(service, size);
    const sizeLabel = sizes.find((s) => s.id === size)?.label;
    const svc = activeServices.find((s) => s.id === service);
    if (!size || !service) {
      estAmt.textContent = !size ? 'Pick a size' : 'Pick a service';
      estAmt.classList.remove('is-price');
    } else {
      estAmt.textContent = e.label;
      estAmt.classList.toggle('is-price', e.amount !== null);
    }
    estNote.textContent = e.kind === 'quote'
      ? 'Send a photo or two in step 2 and Chris will give you a fixed price.'
      : e.kind === 'from'
        ? '“From” is the starting price. Chris confirms the final price before he starts.'
        : e.kind === 'fixed'
          ? 'Per visit, every month. Same 12-point clean each time.'
          : 'Prices come straight from our price list.';
    setHidden('estimate', e.amount === null ? (e.kind === 'quote' ? 'quote' : '') : String(e.amount));
    const rows: [string, string][] = [];
    if (val('vehicle')) rows.push(['Vehicle', val('vehicle')]);
    if (sizeLabel) rows.push(['Size', sizeLabel]);
    if (svc) rows.push(['Service', svc.formLabel]);
    if (val('postcode')) rows.push(['Postcode', val('postcode').toUpperCase()]);
    estSum.replaceChildren(...rows.map(([k, v]) => {
      const li = document.createElement('li');
      const a = document.createElement('span'); a.textContent = k;
      const b = document.createElement('span'); b.textContent = v;
      li.append(a, b);
      return li;
    }));
    if (!estimateTracked && (e.kind === 'from' || e.kind === 'fixed' || e.kind === 'quote')) {
      estimateTracked = true;
      track('estimate_used', { label: `${service}/${size}`, value: estimateShort(e) });
    }
  }

  form.addEventListener('change', (ev) => {
    if ((ev.target as HTMLInputElement).name === 'size') filterServices();
    updateEstimate();
  });
  form.addEventListener('input', updateEstimate);
  filterServices();
  updateEstimate();

  // ---- photos: compress in the browser to ~1600px JPEG ----
  const thumbs = document.getElementById('thumbs')!;
  const photosErr = document.getElementById('photos-err')!;
  photosInput.addEventListener('change', async () => {
    photosErr.textContent = '';
    const files = Array.from(photosInput.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length > maxPhotos) photosErr.textContent = `We’ll take the first ${maxPhotos} photos.`;
    photos = [];
    thumbs.replaceChildren();
    for (const f of files.slice(0, maxPhotos)) {
      try {
        const small = await compress(f);
        photos.push(small);
        const li = document.createElement('li');
        const img = document.createElement('img');
        img.alt = '';
        img.src = URL.createObjectURL(small);
        li.append(img);
        thumbs.append(li);
      } catch {
        photosErr.textContent = 'One photo couldn’t be read. Try a JPEG or PNG.';
      }
    }
  });

  // ---- WhatsApp summary instead ----
  const waLink = form.querySelector<HTMLAnchorElement>('[data-wa-summary]');
  waLink?.addEventListener('click', () => {
    const data = collect();
    const size = sizes.find((s) => s.id === data.size);
    const svc = activeServices.find((s) => s.id === data.service);
    const e = estimate(data.service, data.size);
    const text = bookingSummaryText({
      name: data.name || '',
      vehicle: data.vehicle || '…',
      sizeLabel: size?.label || '…',
      serviceLabel: svc?.formLabel || '…',
      postcode: (data.postcode || '…').toUpperCase(),
      preferredDay: data.preferredDay,
      notes: data.notes,
      estimateLabel: e.amount !== null || e.kind === 'quote' ? e.label : undefined,
    });
    // The link's href is swapped before the browser follows it.
    waLink.href = whatsappHref(text);
    track('whatsapp_click', { label: 'form-summary' });
  });

  // ---- submit ----
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    formError.hidden = true;
    const r = validateBooking(collect());
    if (!r.ok) {
      const firstStep = stepFields.findIndex((f) => f.some((k) => r.errors[k]));
      if (firstStep >= 0 && firstStep !== current) show(firstStep, false);
      showErrors(r.errors)?.focus();
      return;
    }
    const btn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    btn.disabled = true;
    const label = btn.textContent;
    btn.textContent = 'Sending…';
    try {
      const fd = new FormData(form);
      fd.delete('photos');
      photos.forEach((p, i) => fd.append('photos', p, `photo-${i + 1}.jpg`));
      const res = await fetch(form.action, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        track('book_submit', { label: r.data.service, value: val('estimate') });
        try {
          sessionStorage.setItem('ss_last_booking', JSON.stringify({
            name: r.data.name, summary: bookingSummaryText({
              name: r.data.name, vehicle: r.data.vehicle, sizeLabel: r.data.sizeLabel, serviceLabel: r.data.serviceLabel,
              postcode: r.data.postcode, preferredDay: r.data.preferredDay, notes: r.data.notes,
              estimateLabel: estimate(r.data.service, r.data.size).label,
            }),
          }));
        } catch {}
        location.href = json.redirect || '/thank-you/';
        return;
      }
      if (json.errors) {
        const firstStep = stepFields.findIndex((f) => f.some((k) => json.errors[k]));
        if (firstStep >= 0) show(firstStep, false);
        showErrors(json.errors)?.focus();
      }
      formError.textContent = json.message || 'Sorry, that didn’t send. Please try again, or WhatsApp us instead.';
      formError.hidden = false;
      formError.focus();
    } catch {
      formError.textContent = 'No connection. Please try again, or use “Send on WhatsApp instead”.';
      formError.hidden = false;
    } finally {
      btn.disabled = false;
      btn.textContent = label;
    }
  });
}

async function compress(file: File, max = 1600, quality = 0.8): Promise<File> {
  let bmp: ImageBitmap | HTMLImageElement;
  try {
    bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    bmp = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }
  const w = 'naturalWidth' in bmp ? bmp.naturalWidth : bmp.width;
  const h = 'naturalHeight' in bmp ? bmp.naturalHeight : bmp.height;
  const scale = Math.min(1, max / Math.max(w, h));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', quality));
  if (!blob) throw new Error('compress failed');
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}
