// Booking validation, shared by the browser and netlify/functions/book.mjs so the rules can't drift.
import { services, sizes, extras, howHeardOptions } from '../config/site.ts';
import { quote } from './pricing.ts';

export const LIMITS: Record<string, number> = {
  name: 80,
  phone: 20,
  email: 120,
  makeModel: 80,
  registration: 10,
  service: 40,
  vehicleSize: 20,
  serviceType: 12,
  postcode: 10,
  preferredDay: 20,
  preferredTime: 40,
  notes: 1000,
  howHeard: 20,
  pageUrl: 300,
  referrer: 300,
  utm_source: 100,
  utm_medium: 100,
  utm_campaign: 150,
  utm_term: 150,
  utm_content: 150,
  gclid: 200,
};

export const PREFERRED_TIMES = ['Weekday morning', 'Weekday afternoon', 'Weekend evening', "I'm flexible"];
export const SERVICE_TYPES = ['mobile', 'drop-off'];

export interface Booking {
  name: string;
  phone: string;
  email: string;
  makeModel: string;
  registration: string;
  service: string;
  vehicleSize: string;
  extras: string[];
  serviceType: string;
  postcode: string;
  preferredDay: string;
  preferredTime: string;
  notes: string;
  howHeard: string;
  quotedTotal: string;
  outsideAB: boolean;
  pageUrl: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  gclid: string;
}

export type Raw = Record<string, string | string[] | undefined>;

const str = (v: unknown) => (Array.isArray(v) ? String(v[0] ?? '') : v == null ? '' : String(v)).trim();

/** UK postcode, normalised to "AB10 1AA". Returns null if it doesn't look like one. */
export function normalisePostcode(input: string): string | null {
  const m = input.toUpperCase().replace(/\s+/g, '').match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
  return m ? `${m[1]} ${m[2]}` : null;
}

/** UK mobile or landline. Returns "07936 060804"-style national format, or null. */
export function normalisePhone(input: string): string | null {
  let d = input.replace(/[\s\-().]/g, '');
  if (d.startsWith('+44')) d = '0' + d.slice(3);
  else if (d.startsWith('0044')) d = '0' + d.slice(4);
  else if (d.startsWith('44') && d.length === 12) d = '0' + d.slice(2);
  if (d.startsWith('0(0)')) d = '0' + d.slice(4);
  if (!/^0[1-37]\d{8,9}$/.test(d)) return null;
  return d.length === 11 ? `${d.slice(0, 5)} ${d.slice(5)}` : d;
}

/** Turn a UK national number into the digits wa.me wants (447...). */
export function waNumber(nationalPhone: string): string {
  return '44' + nationalPhone.replace(/\D/g, '').replace(/^0/, '');
}

export function stripUrls(text: string): string {
  return text.replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[link removed]').replace(/\b[\w-]+\.(?:com|net|org|ru|xyz|info|biz|io|co)\/\S*/gi, '[link removed]');
}

export const FIELD_STEP: Record<string, number> = {
  makeModel: 1,
  registration: 1,
  vehicleSize: 1,
  service: 2,
  extras: 2,
  serviceType: 3,
  postcode: 4,
  preferredDay: 5,
  preferredTime: 5,
  photos: 6,
  name: 7,
  phone: 7,
  email: 7,
  notes: 7,
  howHeard: 7,
};

export function validateBooking(raw: Raw): { ok: true; booking: Booking } | { ok: false; errors: Record<string, string> } {
  const e: Record<string, string> = {};
  const v = (k: string) => str(raw[k]).slice(0, LIMITS[k] ?? 200);

  // length limits are enforced by truncation above, but tell people if they wildly overshoot
  for (const [k, max] of Object.entries(LIMITS)) {
    if (str(raw[k]).length > max * 1.5) e[k] = `That's too long. Please keep it under ${max} characters.`;
  }

  const name = v('name');
  if (!name) e.name = 'Please tell us your name.';

  const phoneRaw = v('phone');
  const phone = normalisePhone(phoneRaw);
  if (!phoneRaw) e.phone = 'We need a phone number so we can message you on WhatsApp.';
  else if (!phone) e.phone = "That doesn't look like a UK mobile or landline. Try 07… or 01…";

  const email = v('email');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) e.email = "That email doesn't look right. It's optional, so you can leave it blank.";

  const makeModel = v('makeModel');
  if (!makeModel) e.makeModel = 'What car is it? Make and model is plenty, e.g. Ford Focus.';

  const registration = v('registration').toUpperCase();
  if (registration && !/^[A-Z0-9 ]{2,10}$/.test(registration)) e.registration = 'Letters and numbers only, or leave it blank.';

  const service = v('service');
  if (!services.some((s) => s.id === service)) e.service = 'Pick a service.';

  const vehicleSize = v('vehicleSize');
  if (!sizes.some((z) => z.id === vehicleSize)) e.vehicleSize = 'Pick the size that fits your car best.';

  const rawExtras = raw.extras == null ? [] : Array.isArray(raw.extras) ? raw.extras : String(raw.extras).split(',');
  const chosenExtras = rawExtras.map((x) => String(x).trim()).filter((x) => extras.some((ex) => ex.id === x));

  const serviceType = v('serviceType') || 'mobile';
  if (!SERVICE_TYPES.includes(serviceType)) e.serviceType = 'Choose mobile or drop-off.';

  const pcRaw = v('postcode');
  const postcode = normalisePostcode(pcRaw);
  if (!pcRaw) e.postcode = 'We need your postcode to check we cover you.';
  else if (!postcode) e.postcode = "That doesn't look like a UK postcode. Something like AB10 1AA.";

  const preferredDay = v('preferredDay');
  if (preferredDay && !/^\d{4}-\d{2}-\d{2}$/.test(preferredDay)) e.preferredDay = 'Pick a date, or leave it blank.';
  const preferredTime = v('preferredTime');
  if (preferredTime && !PREFERRED_TIMES.includes(preferredTime)) e.preferredTime = 'Pick one of the options.';

  const howHeard = v('howHeard');
  if (howHeard && !howHeardOptions.includes(howHeard)) e.howHeard = 'Pick one of the options.';

  if (Object.keys(e).length) return { ok: false, errors: e };

  const q = quote(service, vehicleSize, chosenExtras);
  return {
    ok: true,
    booking: {
      name,
      phone: phone!,
      email,
      makeModel,
      registration,
      service,
      vehicleSize,
      extras: q.extraIds,
      serviceType,
      postcode: postcode!,
      preferredDay,
      preferredTime,
      notes: stripUrls(v('notes')),
      howHeard,
      // Always recalculated here, never trusted from the browser.
      quotedTotal: q.label,
      outsideAB: !postcode!.startsWith('AB'),
      pageUrl: v('pageUrl'),
      referrer: v('referrer'),
      utm_source: v('utm_source'),
      utm_medium: v('utm_medium'),
      utm_campaign: v('utm_campaign'),
      utm_term: v('utm_term'),
      utm_content: v('utm_content'),
      gclid: v('gclid'),
    },
  };
}
