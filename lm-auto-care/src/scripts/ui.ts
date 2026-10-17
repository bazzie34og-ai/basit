import { get, set } from './storage.ts';

// Things that draw themselves (ticks, strikes, map lines, labels, the stamp). Once only.
const drawables = document.querySelectorAll<HTMLElement>('[data-draw]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('is-drawn');
          io.unobserve(en.target);
        }
      }
    },
    { threshold: 0.35, rootMargin: '0px 0px -8% 0px' },
  );
  drawables.forEach((el) => io.observe(el));
} else {
  drawables.forEach((el) => el.classList.add('is-drawn'));
}

// The preview ribbon remembers being dismissed.
const ribbon = document.getElementById('preview-ribbon');
if (ribbon) {
  if (get('local', 'lm_ribbon') === 'off') ribbon.hidden = true;
  ribbon.querySelector('[data-dismiss-ribbon]')?.addEventListener('click', () => {
    ribbon.hidden = true;
    set('local', 'lm_ribbon', 'off');
  });
}

// Close the mobile menu after following an in-page link.
document.querySelectorAll<HTMLDetailsElement>('details.menu').forEach((d) => {
  d.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) d.open = false;
  });
});
