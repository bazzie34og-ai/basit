// Personal Patterns Assessment: progress, validation, scoring, Netlify Forms
// submission and on-screen results. Analytics events carry no names, contact
// details, answers or scores (team brief §6, §11).
import { CATEGORIES, QUESTIONS, MAX_MOTIVATORS, score, band } from '../data/assessment.mjs';

type Gtag = (...args: unknown[]) => void;
const track = (event: string, params: Record<string, unknown> = {}) =>
  (window as unknown as { gtag?: Gtag }).gtag?.('event', event, { page_path: location.pathname, ...params });

const form = document.querySelector<HTMLFormElement>('[data-ppa-form]');
if (form) init(form);

function init(form: HTMLFormElement) {
  track('assessment_view');

  const countEl = document.querySelector('[data-ppa-count]')!;
  const barEl = document.querySelector<HTMLElement>('[data-ppa-bar]')!;
  const errorBox = document.querySelector<HTMLElement>('[data-ppa-errors]')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-ppa-submit]')!;
  const results = document.querySelector<HTMLElement>('[data-ppa-results]')!;
  const motivatorBoxes = Array.from(form.querySelectorAll<HTMLInputElement>('[data-motivator]'));
  const motivatorHint = form.querySelector('[data-motivator-hint]')!;

  // UTM + source (first touch kept for the session by main.ts; fall back to URL).
  const params = new URLSearchParams(location.search);
  form.querySelectorAll<HTMLInputElement>('[data-utm]').forEach((i) => {
    let v = '';
    try { v = sessionStorage.getItem(i.dataset.utm!) ?? ''; } catch { /* ignore */ }
    i.value = v || params.get(i.dataset.utm!) || '';
  });

  const answers = () => Object.fromEntries(QUESTIONS.map((q) => [q.id, (form.elements.namedItem(q.id) as RadioNodeList)?.value ?? '']));

  // Progress + start event.
  let started = false;
  const updateProgress = () => {
    const done = Object.values(answers()).filter(Boolean).length;
    countEl.textContent = String(done);
    barEl.style.width = `${(done / QUESTIONS.length) * 100}%`;
  };
  form.addEventListener('change', (e) => {
    if (!started) { started = true; track('assessment_start'); }
    const t = e.target as HTMLInputElement;
    if (t.type === 'radio') {
      const fs = t.closest('fieldset');
      fs?.removeAttribute('data-invalid');
      const err = fs?.querySelector('.error'); if (err) err.textContent = '';
    }
    updateProgress();
  });
  document.querySelector('[data-ppa-start-link]')?.addEventListener('click', () => {
    if (!started) { started = true; track('assessment_start'); }
  });

  // Motivators: max three.
  const syncMotivators = () => {
    const chosen = motivatorBoxes.filter((b) => b.checked);
    motivatorBoxes.forEach((b) => { b.disabled = !b.checked && chosen.length >= MAX_MOTIVATORS; });
    motivatorHint.textContent = `${chosen.length} of ${MAX_MOTIVATORS} selected`;
    (form.elements.namedItem('motivators') as HTMLInputElement).value = chosen.map((b) => b.value).join(', ');
  };
  motivatorBoxes.forEach((b) => b.addEventListener('change', syncMotivators));

  // Validation.
  const setErr = (key: string, msg: string) => {
    const el = form.querySelector(`[data-err="${key}"]`);
    if (el) el.textContent = msg;
  };
  const validate = () => {
    const problems: { el: HTMLElement; msg: string }[] = [];
    const { missing } = score(answers());
    for (const id of missing) {
      const fs = form.querySelector<HTMLElement>(`[data-q="${id}"]`)!;
      fs.setAttribute('data-invalid', '');
      setErr(id, 'Please pick a number from 1 to 5.');
      problems.push({ el: fs, msg: `Statement ${id.slice(1)} needs an answer` });
    }
    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;
    const checks: [string, boolean, string][] = [
      ['name', field('name').value.trim().length > 0, 'Please add your name.'],
      ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field('email').value.trim()), 'Please add an email address, like name@example.com.'],
      ['phone', field('phone').value.replace(/\D/g, '').length >= 10, 'Please add a phone number with area code, like (402) 555-0123.'],
    ];
    for (const [name, ok, msg] of checks) {
      setErr(name, ok ? '' : msg);
      field(name).toggleAttribute('aria-invalid', !ok);
      if (!ok) problems.push({ el: field(name), msg });
    }
    return problems;
  };

  // Submit → Netlify Forms (AJAX) → results on screen.
  let submitting = false;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitting) return;
    if ((form.elements.namedItem('bot-field') as HTMLInputElement).value) return;
    const problems = validate();
    if (problems.length) {
      errorBox.hidden = false;
      errorBox.textContent = problems.length === 1
        ? problems[0].msg
        : `${problems.length} things need attention before you can see your results. The first one is highlighted.`;
      problems[0].el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (problems[0].el.querySelector('input') ?? problems[0].el).focus({ preventScroll: true });
      return;
    }
    errorBox.hidden = true;
    submitting = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Scoring…';

    const { scores } = score(answers());
    for (const c of CATEGORIES) (form.elements.namedItem(`score_${c.key}`) as HTMLInputElement).value = String(scores[c.key as keyof typeof scores]);
    syncMotivators();

    let saved = false;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });
      saved = res.ok;
    } catch { saved = false; }
    if (saved) track('assessment_complete');

    showResults(scores, saved);
    submitBtn.textContent = 'Results ready';
  });

  function showResults(scores: Record<string, number>, saved: boolean) {
    const bars = results.querySelector('[data-ppa-bars]')!;
    bars.replaceChildren(...CATEGORIES.map((c) => {
      const s = scores[c.key];
      const wrap = document.createElement('div'); wrap.className = 'bar';
      const h = document.createElement('h3'); h.textContent = c.name;
      const val = document.createElement('span'); val.textContent = `${s} / 25`; h.append(val);
      const track_ = document.createElement('div'); track_.className = 'track';
      track_.setAttribute('role', 'img'); track_.setAttribute('aria-label', `${c.name}: ${s} out of 25`);
      const fill = document.createElement('div'); fill.className = 'fill'; fill.style.width = `${(s / 25) * 100}%`;
      track_.append(fill);
      const b = document.createElement('p'); b.className = 'band'; b.textContent = band(s);
      const p = document.createElement('p'); p.textContent = `What this explores: ${c.explores}`;
      wrap.append(h, track_, b, p);
      return wrap;
    }));

    const extras = results.querySelector('[data-ppa-extras]')!;
    const blocks: [string, string][] = [];
    const mot = (form.elements.namedItem('motivators') as HTMLInputElement).value;
    if (mot) blocks.push(['What motivates you', mot]);
    const improve = (form.elements.namedItem('improve_area') as HTMLTextAreaElement).value.trim();
    const obstacle = (form.elements.namedItem('obstacle') as HTMLTextAreaElement).value.trim();
    if (improve) blocks.push(['The area you most want to improve', improve]);
    if (obstacle) blocks.push(['What keeps getting in your way', obstacle]);
    extras.replaceChildren(...blocks.map(([t, v]) => {
      const d = document.createElement('div');
      const h = document.createElement('h3'); h.textContent = t;
      const p = document.createElement('p'); p.textContent = v;
      d.append(h, p); return d;
    }));

    const status = results.querySelector('[data-ppa-status]')!;
    const optIn = form.elements.namedItem('results_email') as HTMLInputElement | null;
    const emailOptIn = optIn?.type === 'checkbox' && optIn.checked;
    status.textContent = saved
      ? `Your answers were sent to Roland privately.${emailOptIn ? ' A copy of your results is on its way to your email.' : ''}`
      : `Your results are below, but your answers did not reach Roland. Check your connection and try again, or call or text ${results.dataset.phone}.`;
    if (!saved) { submitting = false; submitBtn.disabled = false; submitBtn.textContent = 'Try sending again'; }

    results.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    results.focus({ preventScroll: true });
    track('results_view');
  }

  // Booking clicks (hero + results). The global click handler also fires click_calendly.
  document.querySelectorAll<HTMLAnchorElement>('[data-ppa-book]').forEach((a) =>
    a.addEventListener('click', () => track('booking_click', { cta_location: a.dataset.ppaBook, source: 'assessment' })),
  );
  // Save My Results: print view (Save as PDF on phones and computers).
  document.querySelector('[data-ppa-save]')?.addEventListener('click', () => window.print());

  updateProgress();
}
