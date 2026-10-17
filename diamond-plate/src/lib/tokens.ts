/** {{token}} placeholders for Markdown guides, so prices and facts still come from site.ts. */
import { addOns, business, money, packages, priceFrom, priceTo, processInfo, replyPromise, warrantyYears } from '../config/site';

const byId = Object.fromEntries(packages.map((p) => [p.id, money(p.price)]));

export const tokens: Record<string, string> = {
  'price.single': byId['single'],
  'price.diamondPlus': byId['diamond-plus'],
  'price.double': byId['double'],
  'price.ultimate': byId['ultimate-plus'],
  'price.wheel': money(addOns[0].price),
  priceFrom: money(priceFrom),
  priceTo: money(priceTo),
  warrantyYears: String(warrantyYears),
  'perYear.single': money(Math.round(priceFrom / warrantyYears)),
  replyPromise,
  phone: business.phone.display,
  noWashDays: String(processInfo.noWashDays),
  touchDryMinutes: String(processInfo.touchDryMinutes),
};

export const fill = (s: string) =>
  s.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => {
    if (!(k in tokens)) throw new Error(`Unknown token ${m}`);
    return tokens[k];
  });

/** Remark plugin: fill tokens in text, link URLs and raw HTML nodes. */
export function remarkTokens() {
  const walk = (node: any) => {
    if (typeof node.value === 'string') node.value = fill(node.value);
    if (typeof node.url === 'string') node.url = fill(node.url);
    node.children?.forEach(walk);
  };
  return (tree: any) => walk(tree);
}
