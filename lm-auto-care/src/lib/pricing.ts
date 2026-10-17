import { services, sizes, extras } from '../config/site.ts';

export interface Quote {
  serviceId: string;
  sizeId: string;
  extraIds: string[];
  min: number;
  max: number;
  /** "£70" or "£15–£25" */
  label: string;
  lines: { label: string; amount: string }[];
}

export const gbp = (n: number) => `£${n}`;

export function priceLabel(min: number, max: number): string {
  return min === max ? gbp(min) : `${gbp(min)}–${gbp(max)}`;
}

/**
 * Service price + size supplement + extras. The size supplement applies to
 * every service (their price list: "applies to all services"). The Basic
 * Exterior Wash is a £10–£20 range, so its quote is a range too.
 */
export function quote(serviceId: string, sizeId: string, extraIds: string[] = []): Quote {
  const service = services.find((s) => s.id === serviceId);
  const size = sizes.find((s) => s.id === sizeId);
  if (!service) throw new Error(`Unknown service: ${serviceId}`);
  if (!size) throw new Error(`Unknown size: ${sizeId}`);
  const chosen = extras.filter((e) => extraIds.includes(e.id));
  const extrasTotal = chosen.reduce((sum, e) => sum + e.price, 0);
  const min = service.priceMin + size.supplement + extrasTotal;
  const max = service.priceMax + size.supplement + extrasTotal;
  const lines = [
    { label: service.name, amount: priceLabel(service.priceMin, service.priceMax) },
    { label: `Size: ${size.short}`, amount: size.supplement ? `+${gbp(size.supplement)}` : '+£0' },
    ...chosen.map((e) => ({ label: e.name, amount: `+${gbp(e.price)}` })),
  ];
  return { serviceId, sizeId, extraIds: chosen.map((e) => e.id), min, max, label: priceLabel(min, max), lines };
}
