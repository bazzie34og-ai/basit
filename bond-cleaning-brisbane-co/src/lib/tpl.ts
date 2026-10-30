/**
 * Copy templating. Every string of page copy goes through t() so facts and
 * promises come from src/config/site.ts.
 *
 *   {phone} {email} {hours} {replyTime} {cutOff} {pestPartner} {insurance}
 *   {reclean}        → "within [24 hours]" (or "as fast as we can" if the window flag is null)
 *   {guaranteeDays}  → "[7 days]"
 *   {carpet}         → "[free with every full bond clean]" or "an add-on from [$] per room"
 *   {price:b2}       → "$330" or "[$]"
 *   {cancel}         → "[up to 48 hours before]"
 *   {?flag}…{/flag}  → kept only when the flag is on
 *   {!flag}…{/flag}  → kept only when the flag is off
 */
import { business, flags, confirmed, prices } from '../config/site';

type FlagKey = keyof typeof flags;

/** Wraps unconfirmed wording in [brackets]. */
export const b = (key: string, text: string) => (confirmed[key] ? text : `[${text}]`);

export const flagOn = (key: string): boolean => {
  const v = (flags as Record<string, unknown>)[key];
  return v !== false && v !== null && v !== undefined;
};

export const price = (key: string): string => {
  const v = prices[key];
  return typeof v === 'number' ? `$${v.toLocaleString('en-AU')}` : '[$]';
};

export const hasPrices = (): boolean => typeof prices.b1 === 'number' && typeof prices.b2 === 'number';

export const recleanWindow = (): string =>
  flags.reCleanWindowHours ? `within ${b('reCleanWindow', `${flags.reCleanWindowHours} hours`)}` : 'as fast as we can';

export const guaranteeDays = (): string =>
  flags.guaranteeDays ? b('guaranteeDays', `${flags.guaranteeDays} days`) : 'the agreed period';

export const carpetText = (): string =>
  flags.freeCarpet ? b('freeCarpet', 'free with every full bond clean') : `an add-on from ${price('carpetRoom')} per room`;

export const insuranceText = (): string =>
  flags.insuranceAmount ? `${b('insurance', flags.insuranceAmount)} public liability insured` : 'Public liability insured';

const vars: Record<string, () => string> = {
  phone: () => business.phone,
  email: () => business.email,
  hours: () => business.hours,
  replyTime: () => business.replyTime,
  cutOff: () => business.cutOff,
  pestPartner: () => business.pestPartner,
  insurance: insuranceText,
  reclean: recleanWindow,
  guaranteeDays,
  carpet: carpetText,
  cancel: () => (flags.freeCancellationHours ? b('cancellation', `up to ${flags.freeCancellationHours} hours before`) : ''),
  name: () => business.name,
};

export function t(input: string | undefined | null): string {
  if (!input) return '';
  let s = input;
  // Conditionals (repeat to allow different flags nested inside each other)
  for (let i = 0; i < 3; i++) {
    s = s.replace(/\{([?!])(\w+)\}([\s\S]*?)\{\/\2\}/g, (_m, mode: string, key: string, body: string) => {
      const on = flagOn(key as FlagKey);
      return (mode === '?' ? on : !on) ? body : '';
    });
  }
  s = s.replace(/\{price:(\w+)\}/g, (_m, key: string) => price(key));
  s = s.replace(/\{(\w+)\}/g, (m, key: string) => (vars[key] ? vars[key]() : m));
  return s.replace(/ {2,}/g, ' ');
}

/** Plain text for schema and meta tags. */
export function plain(input: string): string {
  return t(input)
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export const telHref = () => `tel:${business.phoneE164}`;
export const waHref = (msg = "Hi, I'd like a bond clean quote for a [x] bed in [suburb]") =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(msg)}`;
export const mailHref = () => `mailto:${business.email}`;
