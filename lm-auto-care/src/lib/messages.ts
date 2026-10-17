// WhatsApp message builders, shared by the calculator, the booking form and the tests.
import { services, sizes, extras } from '../config/site.ts';
import type { Quote } from './pricing.ts';

const nameOf = (id: string) => services.find((s) => s.id === id)?.name ?? id;

export function calcMessage(q: Quote): string {
  const size = sizes.find((z) => z.id === q.sizeId)!;
  const ex = extras.filter((e) => q.extraIds.includes(e.id));
  return [
    "Hi LM Auto Care, I'd like to book this:",
    `Service: ${nameOf(q.serviceId)}`,
    `Size: ${size.short}${size.supplement ? ` (+£${size.supplement})` : ''}`,
    `Extras: ${ex.length ? ex.map((e) => `${e.name} (+£${e.price})`).join(', ') : 'none'}`,
    `Total: ${q.label}`,
    'Car: ___',
    'Postcode: ___',
  ].join('\n');
}

export interface BookingSummary {
  name?: string;
  phone?: string;
  email?: string;
  makeModel?: string;
  registration?: string;
  service?: string;
  vehicleSize?: string;
  extras?: string[];
  serviceType?: string;
  postcode?: string;
  preferredDay?: string;
  preferredTime?: string;
  notes?: string;
  quotedTotal?: string;
}

/** The "send these details on WhatsApp instead" message: everything, nothing to retype. */
export function bookingMessage(b: BookingSummary): string {
  const size = sizes.find((z) => z.id === b.vehicleSize);
  const ex = extras.filter((e) => (b.extras ?? []).includes(e.id));
  const rows: [string, string | undefined][] = [
    ['Name', b.name],
    ['Car', [b.makeModel, b.registration && `(${b.registration.toUpperCase()})`].filter(Boolean).join(' ')],
    ['Service', b.service ? nameOf(b.service) : undefined],
    ['Size', size?.short],
    ['Extras', ex.length ? ex.map((e) => e.name).join(', ') : 'none'],
    ['Type', b.serviceType === 'drop-off' ? 'Drop-off' : 'Mobile, at my location'],
    ['Postcode', b.postcode?.toUpperCase()],
    ['When', [b.preferredDay, b.preferredTime].filter(Boolean).join(', ')],
    ['Quoted', b.quotedTotal],
    ['Phone', b.phone],
    ['Email', b.email],
    ['Notes', b.notes],
  ];
  return ["Hi LM Auto Care, I'd like to book a valet.", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join('\n');
}
