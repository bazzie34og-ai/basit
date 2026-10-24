/**
 * Quote request model, shared by the browser form and the /api/quote function,
 * so the email, the CSV and the WhatsApp summary always say the same thing.
 */
export interface ItemDef { id: string; label: string; unit: string; units: string; max: number }

export const ITEMS: ItemDef[] = [
  { id: 'carpet_rooms', label: 'Carpets', unit: 'room', units: 'rooms', max: 12 },
  { id: 'stairs', label: 'Stairs & landing', unit: 'flight', units: 'flights', max: 4 },
  { id: 'rugs', label: 'Rugs', unit: 'rug', units: 'rugs', max: 8 },
  { id: 'sofa_seats', label: 'Sofa', unit: 'seat', units: 'seats', max: 12 },
  { id: 'armchairs', label: 'Armchairs', unit: 'armchair', units: 'armchairs', max: 8 },
  { id: 'mattress', label: 'Mattresses', unit: 'mattress', units: 'mattresses', max: 6 },
  { id: 'tenancy', label: 'End of tenancy', unit: 'bedroom', units: 'bedrooms', max: 8 },
];

export const MATTRESS_SIZES = ['Single', 'Double', 'King', 'Super king', 'Cot'];
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Any day'];
export const HEARD = ['Facebook ad', 'Facebook page', 'Instagram', 'Google', 'Friend or family', 'Flyer', 'Other'];

export const LIMITS = { name: 80, phone: 30, email: 120, postcode: 10, other: 200, notes: 1000, heard: 40, photos: 4, photoBytes: 3_500_000, totalBytes: 5_500_000 };

export interface QuoteItem { id: string; qty: number; size?: string }
export interface Quote {
  items: QuoteItem[];
  other: string;
  name: string;
  phone: string;
  email: string;
  postcode: string;
  days: string[];
  notes: string;
  heard: string;
  touch?: Record<string, string>;
}

const POSTCODE_FULL = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})$/;
const POSTCODE_OUT = /^([A-Z]{1,2}\d[A-Z\d]?)$/;

/** Normalises a UK postcode ("cf243aa" → "CF24 3AA"). Outward code alone ("CF24") is accepted. */
export function normalisePostcode(raw: string): string | null {
  const s = raw.toUpperCase().replace(/\s+/g, ' ').trim();
  const full = s.replace(/\s/g, '').match(POSTCODE_FULL);
  if (full) return `${full[1]} ${full[2]}`;
  if (POSTCODE_OUT.test(s)) return s;
  return null;
}

/** True when the postcode is in a core area (CF/NP). Others are flagged, never rejected. */
export function inArea(postcode: string, prefixes = ['CF', 'NP']): boolean {
  const area = postcode.match(/^[A-Z]+/)?.[0] ?? '';
  return prefixes.includes(area);
}

export function normalisePhone(raw: string): string | null {
  const d = raw.replace(/[^\d+]/g, '');
  let n = d.startsWith('+44') ? '0' + d.slice(3) : d.startsWith('0044') ? '0' + d.slice(4) : d.startsWith('44') && d.length === 12 ? '0' + d.slice(2) : d;
  n = n.replace(/^0+(?=0)/, '');
  if (!/^0\d{9,10}$/.test(n)) return null;
  return n;
}
export const phoneE164 = (p: string) => '44' + p.replace(/^0/, '');

export const stripLinks = (s: string) => s.replace(/\b(?:https?:\/\/|www\.)\S+/gi, '[link removed]').replace(/<[^>]*>/g, '');
const clean = (s: unknown, max: number) => stripLinks(String(s ?? '')).replace(/[\u0000-\u0008\u000B-\u001F]/g, '').trim().slice(0, max);

export function itemText(it: QuoteItem): string {
  const def = ITEMS.find((d) => d.id === it.id);
  if (!def) return '';
  const unit = it.qty === 1 ? def.unit : def.units;
  if (def.id === 'carpet_rooms') return `Carpets: ${it.qty} ${unit}`;
  if (def.id === 'mattress') return `${it.qty} ${unit}${it.size ? ` (${it.size})` : ''}`;
  if (def.id === 'tenancy') return `End of tenancy: ${it.qty} ${unit}`;
  if (def.id === 'sofa_seats') return `Sofa: ${it.qty} ${unit}`;
  return `${def.label}: ${it.qty} ${unit}`;
}

export function summary(q: Pick<Quote, 'items' | 'other'>): string {
  const parts = q.items.map(itemText).filter(Boolean);
  if (q.other) parts.push(`Other: ${q.other}`);
  return parts.join(', ') || 'Not specified';
}

export function whatsappText(q: Quote): string {
  const lines = [
    `Hi, I'd like a quote for: ${summary(q)}.`,
    q.postcode && `Postcode: ${q.postcode}`,
    q.days.length ? `Best days: ${q.days.join(', ')}` : '',
    q.notes && `Notes: ${q.notes}`,
    q.name && `Name: ${q.name}`,
    "I'll send my photos in this chat 📷",
  ];
  return lines.filter(Boolean).join('\n');
}

export interface Parsed { quote: Quote; errors: Record<string, string> }

/** Parses and validates a raw field map (from FormData or JSON). */
export function parseQuote(get: (k: string) => string | null, getAll: (k: string) => string[]): Parsed {
  const errors: Record<string, string> = {};
  const items: QuoteItem[] = [];
  const chosen = new Set(getAll('items'));
  for (const def of ITEMS) {
    if (!chosen.has(def.id)) continue;
    const qty = Math.min(def.max, Math.max(1, parseInt(get(`qty_${def.id}`) ?? '1', 10) || 1));
    const size = def.id === 'mattress' ? MATTRESS_SIZES.find((s) => s === get('mattress_size')) : undefined;
    items.push({ id: def.id, qty, ...(size ? { size } : {}) });
  }
  const other = chosen.has('other') ? clean(get('other'), LIMITS.other) : '';
  if (!items.length && !other) errors.items = 'Choose at least one thing to clean.';

  const name = clean(get('name'), LIMITS.name);
  if (name.length < 2) errors.name = 'Please tell us your name.';
  const phone = normalisePhone(clean(get('phone'), LIMITS.phone));
  if (!phone) errors.phone = 'Please enter a UK phone number, like 07700 900123.';
  const emailRaw = clean(get('email'), LIMITS.email);
  const email = emailRaw && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw) ? emailRaw : '';
  if (emailRaw && !email) errors.email = 'That email address doesn’t look right.';
  const postcode = normalisePostcode(clean(get('postcode'), LIMITS.postcode));
  if (!postcode) errors.postcode = 'Please enter a UK postcode, like CF24 3AA.';
  const days = getAll('days').filter((d) => DAYS.includes(d));
  const notes = clean(get('notes'), LIMITS.notes);
  const heardRaw = clean(get('heard'), LIMITS.heard);
  const heard = HEARD.includes(heardRaw) ? heardRaw : '';

  let touch: Record<string, string> | undefined;
  try {
    const t = JSON.parse(get('touch') || 'null');
    if (t && typeof t === 'object') {
      touch = {};
      for (const k of ['landing', 'ref', 'at', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']) {
        if (typeof t[k] === 'string') touch[k] = clean(t[k], 200);
      }
    }
  } catch { /* ignore bad attribution */ }

  return { quote: { items, other, name, phone: phone ?? '', email, postcode: postcode ?? '', days, notes, heard, touch }, errors };
}
