import { activeServices, sizes, howHeardOptions } from '../config/site.ts';

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  postcode: 10,
  vehicle: 80,
  preferredDay: 60,
  notes: 1000,
  howHeard: 40,
  photos: 3,
  photoBytes: 6 * 1024 * 1024, // per photo, after browser compression they're ~300KB
};

/** Postcode areas we cover; others are flagged in the email, never rejected */
export const LOCAL_POSTCODE_AREAS = ['TF', 'SY', 'WV'];

const UK_POSTCODE = /^([A-Z]{1,2}[0-9][A-Z0-9]?) ?([0-9][A-Z]{2})$/;

export function normalisePostcode(raw: string): string {
  const s = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (s.length < 5) return s;
  return `${s.slice(0, -3)} ${s.slice(-3)}`;
}

export function isUkPostcode(raw: string): boolean {
  return UK_POSTCODE.test(normalisePostcode(raw));
}

export function isLocalPostcode(raw: string): boolean {
  const m = normalisePostcode(raw).match(/^([A-Z]{1,2})/);
  return !!m && LOCAL_POSTCODE_AREAS.includes(m[1]);
}

/** Returns 07xxx xxxxxx style digits (national format) or null if not a UK number */
export function normaliseUkPhone(raw: string): string | null {
  let d = raw.replace(/[^\d+]/g, '');
  if (d.startsWith('+44')) d = '0' + d.slice(3);
  else if (d.startsWith('0044')) d = '0' + d.slice(4);
  else if (d.startsWith('44') && d.length === 12) d = '0' + d.slice(2);
  if (/^0[1-37]\d{8,9}$/.test(d) && (d.length === 11 || (d.length === 10 && /^01/.test(d)))) return d;
  return null;
}

/** 07433723029 -> 447433723029 for wa.me */
export function ukPhoneToWhatsapp(national: string): string {
  return '44' + national.replace(/^0/, '');
}

export function stripLinks(text: string): string {
  return text
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[link removed]')
    .replace(/\b[a-z0-9-]+\.(?:com|net|org|ru|xyz|top|info|biz|io|co)(?:\/\S*)?\b/gi, '[link removed]');
}

const clean = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);

export interface BookingInput {
  name: string;
  phone: string;
  postcode: string;
  vehicle: string;
  size: string;
  service: string;
  email?: string;
  preferredDay?: string;
  notes?: string;
  howHeard?: string;
}

export interface CleanBooking {
  name: string;
  phone: string;
  postcode: string;
  postcodeLocal: boolean;
  vehicle: string;
  size: string;
  sizeLabel: string;
  service: string;
  serviceLabel: string;
  email: string;
  preferredDay: string;
  notes: string;
  howHeard: string;
}

export type FieldErrors = Partial<Record<keyof BookingInput, string>>;

export function validateBooking(input: Record<string, unknown>):
  | { ok: true; data: CleanBooking }
  | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = clean(input.name, LIMITS.name);
  const phoneRaw = clean(input.phone, LIMITS.phone + 10);
  const postcodeRaw = clean(input.postcode, LIMITS.postcode + 4);
  const vehicle = clean(input.vehicle, LIMITS.vehicle);
  const size = clean(input.size, 20);
  const service = clean(input.service, 40);
  const email = clean(input.email, LIMITS.email);
  const preferredDay = clean(input.preferredDay, LIMITS.preferredDay);
  const notes = stripLinks(clean(input.notes, LIMITS.notes));
  const howHeard = clean(input.howHeard, LIMITS.howHeard);

  if (name.length < 2) errors.name = 'Please tell us your name.';
  const phone = normaliseUkPhone(phoneRaw);
  if (!phone) errors.phone = 'Please enter a UK phone number, like 07123 456789.';
  if (!isUkPostcode(postcodeRaw)) errors.postcode = 'Please enter a full UK postcode, like TF1 1AA.';
  if (vehicle.length < 2) errors.vehicle = 'What’s the make and model? e.g. Ford Focus.';
  const sizeRow = sizes.find((s) => s.id === size);
  if (!sizeRow) errors.size = 'Please pick a vehicle size.';
  const serviceRow = activeServices.find((s) => s.id === service);
  if (!serviceRow) errors.service = 'Please pick a service.';
  else if (sizeRow && !serviceRow.forSizes.includes(sizeRow.id)) {
    errors.service = `${serviceRow.formLabel} isn’t available for that vehicle. Pick another, or “Not sure”.`;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'That email doesn’t look right.';
  if (howHeard && !howHeardOptions.includes(howHeard)) errors.howHeard = 'Please pick an option.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      name,
      phone: phone!,
      postcode: normalisePostcode(postcodeRaw),
      postcodeLocal: isLocalPostcode(postcodeRaw),
      vehicle,
      size,
      sizeLabel: sizeRow!.label,
      service,
      serviceLabel: serviceRow!.formLabel,
      email,
      preferredDay,
      notes,
      howHeard,
    },
  };
}

/** The same summary for the email, the WhatsApp fallback and the thank-you page */
export function bookingSummaryText(b: {
  name: string; vehicle: string; sizeLabel: string; serviceLabel: string; postcode: string;
  preferredDay?: string; notes?: string; estimateLabel?: string;
}): string {
  const lines = [
    `Hi Chris, I’d like to book with Smith & Shine.`,
    ``,
    `Name: ${b.name}`,
    `Service: ${b.serviceLabel}`,
    `Vehicle: ${b.vehicle} (${b.sizeLabel})`,
    `Postcode: ${b.postcode}`,
  ];
  if (b.preferredDay) lines.push(`Preferred day: ${b.preferredDay}`);
  if (b.estimateLabel) lines.push(`Website estimate: ${b.estimateLabel}`);
  if (b.notes) lines.push(``, `Notes: ${b.notes}`);
  return lines.join('\n');
}
