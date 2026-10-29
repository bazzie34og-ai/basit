import biz from '../data/business.json';

export { biz };

const env = (import.meta as any).env ?? {};
/** PREVIEW_MODE env var (set in netlify.toml) overrides business.json */
export const previewMode: boolean =
  env.PREVIEW_MODE !== undefined ? String(env.PREVIEW_MODE) === 'true' : biz.flags.previewMode;
export const isDev: boolean = !!env.DEV;
export const siteUrl: string = (env.SITE_URL || biz.siteUrl).replace(/\/$/, '');

export const tel = `tel:${biz.phone.e164}`;
export const sms = (body = "Hi Vanessa, I'd like to ask about care for my dog.") =>
  `sms:${biz.phone.e164}?&body=${encodeURIComponent(body)}`;

/** Page-aware WhatsApp prefill */
export function whatsapp(service = 'daycare or boarding') {
  const forPet = /cat|small animal/i.test(service) ? 'my cat' : 'my dog';
  const msg = `Hi Vanessa, I found Paws 2 Purrs online. I'd love to ask about ${service} for ${forPet}.`;
  return `https://wa.me/${biz.whatsappNumber}?text=${encodeURIComponent(msg)}`;
}

export const hasEmail = !!biz.email;
export const mail = (subject = 'Enquiry from website', body = "Hi Vanessa,\n\nI'd like to ask about care for my dog.\n\nMy dog's name:\nService needed:\nDates:\n\nThanks!") =>
  hasEmail ? `mailto:${biz.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : '';

export const meetGreet = biz.flags.freeMeetAndGreet ? 'free meet & greet' : 'meet & greet';
export const meetGreetTitle = biz.flags.freeMeetAndGreet ? 'Book a free meet & greet' : 'Book a meet & greet';

export const licenceLine = `Licensed by ${biz.licence.authority}${biz.flags.fiveStarLicence ? ` (${biz.licence.starRating}-star)` : ''} · Fully insured`;
export const fbProof = `${biz.facebook.recommend} on Facebook`;

export const nav = [
  { label: 'Daycare', href: '/dog-daycare-arnold-nottingham/' },
  { label: 'Boarding', href: '/dog-boarding-arnold-nottingham/' },
  { label: 'Walks & Pop-ins', href: '/dog-walking-arnold-nottingham/' },
  { label: 'Cats', href: '/cat-sitting-arnold-nottingham/' },
  { label: 'About', href: '/about/' },
  { label: 'Reviews', href: '/reviews/' },
  { label: 'FAQ', href: '/faq/' },
];

export const services = [
  {
    key: 'daycare', name: 'Doggy daycare', href: '/dog-daycare-arnold-nottingham/',
    wa: 'daycare', form: 'Daycare',
    blurb: 'A small pack, woodland and adventure walks, play and enrichment. Drop off around 7:30am, collect a tired, happy dog around 5pm.',
  },
  {
    key: 'boarding', name: 'Home boarding', href: '/dog-boarding-arnold-nottingham/',
    wa: 'boarding', form: 'Boarding',
    blurb: 'Overnights, weekends and holidays in a real home. Sofa cuddles, their usual sleeping spot, and daytime adventures with the pack.',
  },
  {
    key: 'walks', name: 'Dog walks', href: '/dog-walking-arnold-nottingham/',
    wa: 'dog walks', form: 'Walks',
    blurb: 'Group adventure walks with pick-up and drop-off, so your dog gets out even on your busiest days.',
  },
  {
    key: 'popins', name: 'Dog pop-ins', href: '/dog-walking-arnold-nottingham/#pop-ins',
    wa: 'dog pop-ins', form: 'Pop-ins',
    blurb: 'A friendly visit at home for a wee break, a fuss and fresh water while you are out.',
  },
  {
    key: 'cats', name: 'Cat visits & small animal feeds', href: '/cat-sitting-arnold-nottingham/',
    wa: 'cat visits', form: 'Cat visits',
    blurb: 'The "Purrs" in Paws 2 Purrs. Cat pop-ins and small animal feeds while you are away.',
  },
];

export const areaPages = [
  { name: 'Mapperley', href: '/dog-daycare-mapperley/', anchor: 'dog daycare & boarding near Mapperley' },
  { name: 'Woodthorpe & Sherwood', href: '/dog-daycare-woodthorpe-sherwood/', anchor: 'dog daycare for Woodthorpe & Sherwood' },
  { name: 'Redhill, Bestwood & Daybrook', href: '/dog-daycare-redhill-bestwood/', anchor: 'dog care in Redhill, Bestwood & Daybrook' },
  { name: 'Gedling & Carlton', href: '/dog-daycare-gedling-carlton/', anchor: 'dog daycare near Gedling & Carlton' },
];

/** Image helper data */
import photos from '../data/photos.json';
import dims from '../data/photo-dims.json';
export type PhotoKey = keyof typeof photos;
export function photo(key: PhotoKey) {
  const p = (photos as any)[key];
  const d = (dims as any)[key];
  return { ...p, ...d, key };
}
export const photoUrl = (key: PhotoKey, abs = false) => {
  const p = photo(key);
  const path = `/images/${p.slug}-${p.widths[p.widths.length - 1]}.jpg`;
  return abs ? siteUrl + path : path;
};
