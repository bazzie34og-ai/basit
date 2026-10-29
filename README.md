# Primo Partners — Agency Website

A one-page website for a digital marketing agency. It's a single `index.html` with no build step and no dependencies.

**Preview:** open `index.html` in a browser.

**Sections:** Hero · Client logos · Services · Stats · Process · Case studies · Testimonials · Pricing · FAQ · Contact form · Footer

## Customizing
- **Name/brand:** search & replace `Primo Partners` and the `P` logo mark.
- **Colors:** edit the CSS variables at the top of the `<style>` block (`--brand`, `--brand-2`, `--accent`).
- **Contact email:** change `CONTACT_EMAIL` in the `<script>` at the bottom, plus the `mailto:` links. Also change the phone and address in the Contact section.
- **Content:** client logos, case studies, testimonials, stats and prices are sample placeholders. Replace them with your real ones before launch.
- **Social links:** set the `href="#"` values in the footer.

## Contact form
By default, the form opens the visitor's email app with the message already filled in. To collect submissions without that step, connect a form service (e.g. Formspree or Netlify Forms) to the form.

## Deploy
Upload `index.html` to any static host, such as GitHub Pages, Netlify, Vercel or Cloudflare Pages.

---

## Paws 2 Purrs site
This repo also contains the **Paws 2 Purrs Dog Daycare & Boarding** website (Astro) in [`paws2purrs/`](paws2purrs/README.md).
