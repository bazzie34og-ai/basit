import { parseQuote, summary, whatsappText, LIMITS } from '../lib/quote';

const MAX_EDGE = 1600;

type W = Window & { scsTrack?: (e: string, p?: Record<string, unknown>) => void };
const track = (e: string, p?: Record<string, unknown>) => (window as W).scsTrack?.(e, p);

async function compress(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' } as ImageBitmapOptions);
    const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
    bmp.close?.();
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/jpeg', 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file; // e.g. HEIC on a browser that can't decode it: send the original
  }
}

export function initQuoteForm() {
  const form = document.querySelector<HTMLFormElement>('[data-quote]');
  if (!form) return;
  const steps = [...form.querySelectorAll<HTMLFieldSetElement>('.qf__step')];
  const progress = form.querySelector<HTMLElement>('[data-progress]')!;
  const errBox = form.querySelector<HTMLElement>('[data-errors]')!;
  const fileInput = form.querySelector<HTMLInputElement>('#photos')!;
  const thumbs = form.querySelector<HTMLUListElement>('[data-thumbs]')!;
  const summaryBox = form.querySelector<HTMLElement>('[data-summary]')!;
  const summaryText = form.querySelector<HTMLElement>('[data-summary-text]')!;
  const waAlt = form.querySelector<HTMLElement>('[data-wa-alt]')!;
  const waLinkEl = form.querySelector<HTMLAnchorElement>('[data-wa-build]')!;
  const waNumber = form.dataset.wa!;

  form.querySelector<HTMLInputElement>('[data-ts]')!.value = String(Date.now());
  try { form.querySelector<HTMLInputElement>('[data-touch]')!.value = sessionStorage.getItem('scs_touch') || ''; } catch { /* ignore */ }

  // ---------- Steps ----------
  let current = 0;
  form.classList.add('is-stepped');
  const show = (i: number, focus = true) => {
    current = i;
    steps.forEach((s, n) => (s.hidden = n !== i));
    progress.hidden = false;
    progress.textContent = `Step ${i + 1} of ${steps.length}`;
    if (focus) steps[i].querySelector<HTMLElement>('legend')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (focus) steps[i].querySelector<HTMLElement>('input:not([type=hidden]):not([tabindex="-1"]), select, textarea')?.focus({ preventScroll: true });
  };
  form.querySelectorAll<HTMLElement>('[data-nav]').forEach((n) => (n.hidden = false));
  form.querySelectorAll<HTMLElement>('[data-back]').forEach((b) => { b.hidden = false; b.addEventListener('click', () => show(Math.max(0, current - 1))); });
  form.querySelectorAll<HTMLElement>('[data-next]').forEach((b) => b.addEventListener('click', () => {
    if (current === 0 && !validate(['items'])) return;
    show(Math.min(steps.length - 1, current + 1));
  }));
  show(0, false);

  // ---------- Field errors ----------
  const fd = () => new FormData(form);
  const read = () => { const d = fd(); return parseQuote((k) => (d.get(k) as string) ?? null, (k) => d.getAll(k).map(String)); };
  function setErrors(errors: Record<string, string>, keys?: string[]) {
    form!.querySelectorAll<HTMLElement>('[data-err]').forEach((el) => {
      const k = el.dataset.err!;
      if (keys && !keys.includes(k)) return;
      const msg = errors[k];
      el.hidden = !msg;
      el.textContent = msg || '';
      const input = form!.querySelector<HTMLElement>(`#${k}`) ?? form!.querySelector<HTMLElement>(`[data-field="${k}"]`);
      if (input) {
        if (msg) { input.setAttribute('aria-invalid', 'true'); el.id = `err-${k}`; input.setAttribute('aria-describedby', `err-${k}`); }
        else { input.removeAttribute('aria-invalid'); }
      }
    });
  }
  function validate(keys: string[]) {
    const { errors } = read();
    setErrors(errors, keys);
    const first = keys.find((k) => errors[k]);
    if (first) {
      (form!.querySelector<HTMLElement>(`#${first}`) ?? form!.querySelector<HTMLElement>(`[data-field="${first}"] input`))?.focus();
      return false;
    }
    return true;
  }

  // ---------- Started ----------
  let started = false;
  form.addEventListener('input', () => { if (!started) { started = true; track('quote_start'); } update(); });
  form.addEventListener('change', update);

  // ---------- Photos ----------
  const photos: { blob: Blob; url: string; name: string }[] = [];
  const photoErr = form.querySelector<HTMLElement>('[data-err="photos"]')!;
  function renderThumbs() {
    thumbs.innerHTML = '';
    photos.forEach((p, i) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      img.src = p.url; img.alt = `Photo ${i + 1}`;
      const rm = document.createElement('button');
      rm.type = 'button'; rm.textContent = '×'; rm.setAttribute('aria-label', `Remove photo ${i + 1}`);
      rm.addEventListener('click', () => { URL.revokeObjectURL(p.url); photos.splice(i, 1); renderThumbs(); update(); });
      li.append(img, rm);
      thumbs.append(li);
    });
  }
  fileInput.addEventListener('change', async () => {
    const files = [...(fileInput.files ?? [])].filter((f) => f.type.startsWith('image/'));
    fileInput.value = '';
    photoErr.hidden = true;
    for (const f of files) {
      if (photos.length >= LIMITS.photos) { photoErr.hidden = false; photoErr.textContent = `Up to ${LIMITS.photos} photos. Send more on WhatsApp after.`; break; }
      const blob = await compress(f);
      if (blob.size > LIMITS.photoBytes) { photoErr.hidden = false; photoErr.textContent = `${f.name} is too large. Try another photo.`; continue; }
      photos.push({ blob, url: URL.createObjectURL(blob), name: f.name.replace(/\.[^.]+$/, '') + '.jpg' });
      track('photo_added', { count: photos.length });
    }
    renderThumbs();
    update();
  });

  // ---------- Live summary + WhatsApp ----------
  function update() {
    const { quote } = read();
    const has = quote.items.length || quote.other;
    summaryBox.hidden = !has;
    waAlt.hidden = !has;
    const lines = [summary(quote)];
    if (quote.postcode) lines.push(`Postcode: ${quote.postcode}`);
    if (quote.days.length) lines.push(`Days: ${quote.days.join(', ')}`);
    if (photos.length) lines.push(`${photos.length} photo${photos.length > 1 ? 's' : ''}`);
    summaryText.textContent = lines.join('\n');
    waLinkEl.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappText(quote))}`;
  }
  waLinkEl.addEventListener('click', () => track('whatsapp_click', { where: 'quote_summary' }));
  update();

  // ---------- Submit ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { errors } = read();
    setErrors(errors);
    if (Object.keys(errors).length) {
      if (errors.items) { show(0); validate(['items']); return; }
      validate(['name', 'phone', 'postcode', 'email']);
      return;
    }
    const data = fd();
    data.delete('photos');
    photos.forEach((p) => data.append('photos', p.blob, p.name));
    form.classList.add('is-sending');
    const btn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
    const label = btn.textContent;
    btn.textContent = 'Sending…';
    errBox.hidden = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        track('quote_submit', { items: json.items });
        location.href = json.redirect || '/thank-you/';
        return;
      }
      if (json.errors) setErrors(json.errors);
      errBox.textContent = json.message || 'Something went wrong sending your request. Please try again, or send it on WhatsApp instead.';
    } catch {
      errBox.textContent = 'We couldn’t send that. Check your connection and try again, or send it on WhatsApp instead.';
    }
    errBox.hidden = false;
    errBox.focus();
    form.classList.remove('is-sending');
    btn.textContent = label;
  });
}
