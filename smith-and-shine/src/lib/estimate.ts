import { activeServices, monthlyPlan, type ServiceId, type SizeId } from '../config/site.ts';

export type Estimate =
  | { kind: 'fixed'; amount: number; label: string }
  | { kind: 'from'; amount: number; label: string }
  | { kind: 'quote'; amount: null; label: string }
  | { kind: 'invalid'; amount: null; label: string };

/**
 * Live price estimate for the booking form and the booking email.
 * Uses only prices from config: the monthly plan has a fixed price per size,
 * everything else is the published "from" price, ceramic/PPF are on quote.
 */
export function estimate(serviceId: ServiceId | string, sizeId: SizeId | string): Estimate {
  const service = activeServices.find((s) => s.id === serviceId);
  if (!service) return { kind: 'invalid', amount: null, label: 'Pick a service' };
  if (!sizeId) return { kind: 'invalid', amount: null, label: 'Pick a size' };
  if (!service.forSizes.includes(sizeId as SizeId)) {
    return { kind: 'invalid', amount: null, label: `${service.name} isn’t available for that vehicle` };
  }
  if (service.id === 'monthly') {
    const row = monthlyPlan.prices.find((p) => p.size === sizeId);
    if (!row) return { kind: 'quote', amount: null, label: 'Price on quote' };
    return { kind: 'fixed', amount: row.price, label: `£${row.price} per visit` };
  }
  if (service.from === null) return { kind: 'quote', amount: null, label: 'Price on quote: send us a photo' };
  return { kind: 'from', amount: service.from, label: `From £${service.from}` };
}

/** Number used in email subject lines: "est. £70" or "est. £quote" */
export function estimateShort(e: Estimate): string {
  return e.amount === null ? 'quote' : String(e.amount);
}

/** Services that make sense for a given vehicle size */
export function servicesForSize(sizeId: SizeId | string) {
  return activeServices.filter((s) => s.forSizes.includes(sizeId as SizeId));
}
