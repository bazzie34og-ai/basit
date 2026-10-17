import business from '../data/business.json';

// PREVIEW_MODE=true (default) adds <meta name="robots" content="noindex"> site-wide
// and shows dev-only TODO notes. Set PREVIEW_MODE=false at launch (see README).
export const PREVIEW_MODE = String(process.env.PREVIEW_MODE ?? 'true').toLowerCase() !== 'false';

export const b = business;
export const tel = `tel:${business.phoneE164}`;
export const sms = `sms:${business.phoneE164}?&body=${encodeURIComponent(business.smsBody)}`;
export const mailto = `mailto:${business.email}`;

export const googleReviewsUrl =
  business.googleProfileUrl ||
  'https://www.google.com/search?q=' + encodeURIComponent('LaCaze Roadside Assistance Spring TX reviews');

export const abs = (path) => new URL(path, business.siteUrl).href;

export const services = [
  { key: 'jumpStart', slug: '/jump-start-spring-tx/', name: 'Jump starts', short: 'Jump start', icon: 'battery',
    blurb: 'Dead battery in a parking lot, driveway or on the shoulder? We bring the power and get you started.' },
  { key: 'lockout', slug: '/car-lockout-spring-tx/', name: 'Vehicle lockouts', short: 'Car lockout', icon: 'key',
    blurb: 'Keys locked inside, or kids and pets waiting? We open your car carefully and get you back in.' },
  { key: 'fuelDelivery', slug: '/fuel-delivery-spring-tx/', name: 'Fuel delivery', short: 'Fuel delivery', icon: 'fuel',
    blurb: 'Ran out of gas on the road? We bring enough fuel to get you to the next station.' },
];

export const towns = [
  { slug: '/roadside-assistance-the-woodlands-tx/', name: 'The Woodlands', short: 'The Woodlands' },
  { slug: '/roadside-assistance-tomball-tx/', name: 'Tomball', short: 'Tomball' },
  { slug: '/roadside-assistance-conroe-tx/', name: 'Conroe', short: 'Conroe' },
  { slug: '/roadside-assistance-magnolia-tx/', name: 'Magnolia', short: 'Magnolia' },
  { slug: '/roadside-assistance-klein-cypress-tx/', name: 'Klein & Cypress', short: 'Klein & Cypress' },
  { slug: '/roadside-assistance-north-houston/', name: 'North Houston', short: 'North Houston' },
];

export const priceLabel = (key) => {
  const p = business.prices[key];
  return p == null ? null : `From $${p}`;
};
