/** Small HTML helpers shared by page copy. */

const terms = [
  { href: '/', name: 'Bond clean', text: 'What most renters and the RTA call it. The deposit you get back is the bond.' },
  { href: '/end-of-lease-cleaning-brisbane/', name: 'End of lease clean', text: 'The same clean, named for when it happens: the lease is ending.' },
  { href: '/vacate-cleaning-brisbane/', name: 'Vacate or exit clean', text: 'The words many property managers use on their checklist and emails.' },
  { href: '/move-out-cleaning-brisbane/', name: 'Move-out clean', text: 'What you search when you are in the middle of moving week.' },
];

/** "Same job, four names" cards, linking to the synonym pages. */
export const fourNames = (current: string) =>
  `<div class="term-cards">${terms
    .map((t) =>
      t.href === current
        ? `<div class="term-card"><strong>${t.name}</strong><p>${t.text} <em>(this page)</em></p></div>`
        : `<div class="term-card"><strong><a href="${t.href}">${t.name}</a></strong><p>${t.text}</p></div>`
    )
    .join('')}</div>`;

export const ticks = (items: string[]) => `<ul class="ticks">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

export const callout = (html: string, mint = false) =>
  `<div class="callout${mint ? ' callout--mint' : ''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v5.5M12 7.5h.01"/></svg><div><p>${html}</p></div></div>`;

export const RTA_CLEAN = 'https://www.rta.qld.gov.au/ending-a-tenancy/vacating-a-property/cleaning';
export const RTA_CARPET = 'https://www.rta.qld.gov.au/ending-a-tenancy/vacating-a-property/carpet-cleaning-and-pest-control';
export const RTA_END = 'https://www.rta.qld.gov.au/ending-a-tenancy';
export const rta = (href: string, label: string) => `<a href="${href}" rel="noopener" target="_blank">${label}</a>`;
