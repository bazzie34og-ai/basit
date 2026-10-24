import { business } from '../../src/config/site.ts';
import { summary, itemText, phoneE164, type Quote } from '../../src/lib/quote.ts';

export const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const btn = (href: string, label: string, bg: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:#F4F1E8;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:6px;margin:0 8px 8px 0;font-family:Arial,sans-serif;font-size:15px">${esc(label)}</a>`;

export function ownerEmail(q: Quote, opts: { id: string; outOfArea: boolean; photoCount: number }) {
  const first = q.name.split(' ')[0];
  const waReply = `https://wa.me/${phoneE164(q.phone)}?text=${encodeURIComponent(`Hi ${first}, it's ${business.shortName}. Thanks for your quote request for ${summary(q).toLowerCase()}. `)}`;
  const rows: [string, string][] = [
    ['Name', q.name],
    ['Phone', q.phone],
    ['Email', q.email || '(not given)'],
    ['Postcode', q.postcode + (opts.outOfArea ? '  ⚠ OUTSIDE CF/NP: check you cover this' : '')],
    ['What', q.items.map(itemText).concat(q.other ? [`Other: ${q.other}`] : []).join('\n') || '(not specified)'],
    ['Days', q.days.join(', ') || '(any)'],
    ['Access notes', q.notes || '(none)'],
    ['Heard via', q.heard || '(not given)'],
    ['Photos', opts.photoCount ? `${opts.photoCount} attached` : 'None. Ask them to WhatsApp some.'],
  ];
  if (q.touch) {
    const t = q.touch;
    const src = [t.utm_source, t.utm_medium, t.utm_campaign, t.utm_content].filter(Boolean).join(' / ');
    rows.push(['Came from', [src, t.fbclid ? 'Facebook click' : '', t.landing ? `landed on ${t.landing}` : ''].filter(Boolean).join(' · ') || 'direct']);
  }
  rows.push(['Reference', opts.id]);
  const table = rows.map(([k, v]) => `<tr><th align="left" valign="top" style="padding:10px 14px;border-bottom:1px solid #E6ECE1;color:#56645B;font-weight:600;width:130px;font-family:Arial,sans-serif;font-size:14px">${esc(k)}</th><td style="padding:10px 14px;border-bottom:1px solid #E6ECE1;font-family:Arial,sans-serif;font-size:15px;color:#13201A;white-space:pre-line">${esc(v)}</td></tr>`).join('');
  const html = `<div style="background:#F4F1E8;padding:24px"><div style="max-width:620px;margin:0 auto;background:#FBFAF6;border-top:3px solid #124932;padding:24px">
<p style="font-family:Georgia,serif;font-size:24px;color:#13201A;margin:0 0 4px">New quote request</p>
<p style="font-family:Arial,sans-serif;color:#56645B;margin:0 0 20px">${esc(summary(q))} · ${esc(q.postcode)}</p>
<p>${btn(waReply, `WhatsApp ${first}`, '#124932')}${btn(`tel:+${phoneE164(q.phone)}`, `Call ${first}`, '#0B2A1E')}</p>
<table cellspacing="0" cellpadding="0" style="width:100%;border-collapse:collapse;margin-top:12px">${table}</table>
</div></div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nWhatsApp: ${waReply}\nCall: +${phoneE164(q.phone)}`;
  return { subject: `New quote request: ${summary(q)} · ${q.postcode}`.slice(0, 200), html, text };
}

export function customerEmail(q: Quote) {
  const first = q.name.split(' ')[0];
  const text = [
    `Hi ${first},`,
    '',
    `Thanks for your quote request for ${summary(q).toLowerCase()}. It’s with us.`,
    '',
    `What happens next: we’ll look at your details and photos and reply with a fixed price, ${business.replyTime}. Once you pick a day, we’ll confirm by message the day before and call when we’re on the way.`,
    '',
    `If you’d like to add photos or ask anything, WhatsApp us on ${business.phones.whatsapp.display} or call ${business.phones.call.display}.`,
    '',
    business.name,
    business.taglines.primary,
  ].join('\n');
  const html = `<div style="background:#F4F1E8;padding:24px"><div style="max-width:560px;margin:0 auto;background:#FBFAF6;border-top:3px solid #124932;padding:24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#13201A">${text.split('\n').map((l) => (l ? `<p style="margin:0 0 4px">${esc(l)}</p>` : '<br>')).join('')}</div></div>`;
  return { subject: `We’ve got your quote request · ${business.shortName}`, html, text };
}

export async function sendResend(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, error: `${res.status} ${(await res.text()).slice(0, 300)}` };
  return { ok: true };
}
