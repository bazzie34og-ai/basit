import { getAttribution, track } from './track';

const loadedAt = performance.now();

export function initQuoteForms() {
  document.querySelectorAll<HTMLFormElement>('form[data-quote-form]').forEach((form) => {
    if (form.dataset.bound) return;
    form.dataset.bound = '1';
    form.noValidate = true;
    const attr = getAttribution();
    const set = (name: string, value: string) => {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      if (el && !el.value) el.value = value;
    };
    ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'referrer'].forEach((k) => set(k, attr[k] || ''));
    const wanted = new URLSearchParams(location.search).get('package');
    if (wanted) {
      const opt = form.querySelector<HTMLOptionElement>(`select[name=package] option[data-id="${CSS.escape(wanted)}"]`);
      if (opt) opt.selected = true;
    }
    const page = form.elements.namedItem('pageUrl') as HTMLInputElement;
    page.value = location.href.split('#')[0];

    let started = false;
    form.addEventListener('focusin', () => {
      if (started) return;
      started = true;
      track('quote_start', { form_variant: form.dataset.variant });
    });

    const status = form.querySelector<HTMLElement>('[data-status]')!;
    const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;

    const clearErrors = () => {
      status.textContent = '';
      form.querySelectorAll<HTMLElement>('[data-err]').forEach((p) => (p.textContent = ''));
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    };

    const showErrors = (errors: Record<string, string>) => {
      let first: HTMLElement | null = null;
      for (const [name, msg] of Object.entries(errors)) {
        const p = form.querySelector<HTMLElement>(`[data-err="${name}"]`);
        if (p) p.textContent = msg;
        const field = form.elements.namedItem(name);
        const el = (field instanceof RadioNodeList ? field[0] : field) as HTMLElement | null;
        if (el) {
          el.setAttribute('aria-invalid', 'true');
          first ??= el;
        }
      }
      const n = Object.keys(errors).length;
      status.textContent = n === 1 ? 'Please fix the highlighted field.' : `Please fix the ${n} highlighted fields.`;
      first?.focus();
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();
      (form.elements.namedItem('elapsed') as HTMLInputElement).value = String(Math.round(performance.now() - loadedAt));
      (form.elements.namedItem('submittedAt') as HTMLInputElement).value = new Date().toISOString();
      const data = Object.fromEntries(new FormData(form).entries());
      button.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.ok) {
          track('quote_submit', { package: data.package || '', vehicle_age: data.vehicleAge || '' });
          try { sessionStorage.setItem('dp_quote_done', '1'); } catch { /* ignore */ }
          setTimeout(() => location.assign('/thank-you/'), 150);
          return;
        }
        if (json.errors) showErrors(json.errors);
        else status.textContent = json.message || 'Something went wrong. Please call us instead.';
      } catch {
        status.textContent = 'We could not send that. Check your connection, or call us instead.';
      }
      button.disabled = false;
    });
  });
}
