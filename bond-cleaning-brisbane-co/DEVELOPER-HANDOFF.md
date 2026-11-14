# Developer handoff: UI/UX changes only

You're changing the **design and user experience** of the Bond Cleaning Brisbane Co. website. **The content must not change**: page copy, headings, titles, meta descriptions, FAQs, keywords, links and alt text were written and checked for local SEO. Please keep every word, heading level (H1/H2/H3) and link as it is.

## Run it

Needs Node 22.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

The stack is Astro 7 (static output) with plain CSS and a small amount of vanilla TypeScript. There's no framework, Tailwind or jQuery.

## Safe to change (design and UX)

| What | Where |
|---|---|
| Colours, fonts, spacing, radius, shadows (design tokens) | `src/styles/global.css` → `:root` at the top |
| All component and layout styling | `src/styles/global.css` |
| Page layouts and section order/markup | `src/components/templates/ServicePage.astro`, `AreaPage.astro`, `src/pages/*.astro` |
| Header, mega-menus, mobile menu | `src/components/Header.astro` |
| Footer | `src/components/Footer.astro` |
| Quote form layout and steps | `src/components/QuoteForm.astro` (keep every field `name` exactly the same) |
| Before/after slider, photo grid, lightbox | `src/components/BeforeAfter.astro`, `PhotoGrid.astro`, `PhotoFigure.astro`, `Lightbox.astro` |
| Mobile sticky bar | `src/components/MobileBar.astro` |
| Icons | `src/components/Icon.astro` |
| Interactions (menus, form steps, scroll effects) | `src/scripts/site.ts` |
| Hidden style guide page for reference | `/styleguide/` |

## Do not change (content and SEO)

| What | Where |
|---|---|
| Business facts, prices, promises, placeholders like `[PHONE]` | `src/config/site.ts` (the client fills these in) |
| Service page copy | `src/content/services/*.ts` |
| Suburb page copy | `src/content/areas/*.ts` |
| FAQs | `src/data/faqs.ts` |
| Blog posts | `src/content/blog.ts` |
| Titles, H1s, meta descriptions, URLs, keywords | `src/data/site-data.json` |
| Photo alt text and captions | `src/data/photos.ts` |
| Structured data (schema) | `src/lib/schema.ts` |
| Copy text written inside `.astro` files | Keep the wording; move or restyle it freely |

## Rules to keep while redesigning

- **One H1 per page**, and keep headings at their current level (H2 stays H2).
- **In-content links stay blue (`#1A56DB`) and underlined.** This is a client requirement.
- **Brand palette:** navy `#12304A` / `#0B1F31`, mint `#3DDC97` as an accent only (never mint text on white), fonts Poppins 700 for headings and Inter for body. Logos are in `public/images/brand/`.
- **No stock or AI images** of people or "our work". Use only the supplied photos in `src/assets/photos/`.
- **No reviews, star ratings, review counts or "years in business"** anywhere.
- **Forms:** keep `data-netlify="true"`, the hidden `form-name`, the honeypot and every field `name`, or Netlify will stop receiving quotes. `public/__forms.html` must match the live form fields.
- **Tracking hooks:** keep `data-track="call_click"` / `"whatsapp_click"` on call and WhatsApp buttons.
- **Accessibility:** tap targets at least 44px, visible focus rings, labels on every input, `prefers-reduced-motion` respected.
- **Performance:** keep Lighthouse mobile at 95+. Don't add heavy libraries, carousels, pop-ups or autoplay.

## Before you hand it back

```bash
npm run build
npm run audit    # needs python3 + beautifulsoup4; must report "PROBLEMS: 0"
```

The audit checks that titles, H1s, metas, keywords, links and alt text are unchanged and correct. If it reports problems, content has been changed by mistake.

Please also check the site at 360px, 768px, 1024px and 1440px wide with no sideways scrolling.

## Deployment

Netlify builds the site from `netlify.toml` (base folder `bond-cleaning-brisbane-co`, command `npm run build`, publish `dist`). See `README.md` for the full setup and go-live steps.
