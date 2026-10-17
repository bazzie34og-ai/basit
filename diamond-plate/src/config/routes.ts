/**
 * Page metadata registry. Every static page reads its <title>, meta
 * description and H1 from here, so OG images and audits share one list.
 * Guides live in src/content/guides and carry their own metadata.
 */
import { money, priceFrom, warrantyYears } from './site';

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  h1: string;
  noindex?: boolean;
}

const from = money(priceFrom);

export const routes = {
  home: {
    path: '/',
    title: 'Ceramic Coating Brisbane | Diamond Plate Ceramic Coating',
    description: `Graphene ceramic coating in Brisbane, applied at your home or work. Fixed prices from ${from}, ${warrantyYears}-year national warranty, Australian made.`,
    h1: 'Ceramic Coating Brisbane, Done at Your Place',
  },
  prices: {
    path: '/ceramic-coating-prices/',
    title: `Ceramic Coating Prices Brisbane, From ${from} | Diamond Plate`,
    description: `Fixed, published ceramic coating prices in Brisbane: ${from} to $1,695. See exactly what each package includes, with a ${warrantyYears}-year warranty.`,
    h1: 'Ceramic Coating Prices in Brisbane',
  },
  graphene: {
    path: '/graphene-ceramic-coating/',
    title: 'Graphene Ceramic Coating Brisbane | Diamond Plate',
    description: 'Graphene Ceramic 9H+ is made in Australia by Diamond Plate’s own R&D team. How graphene ceramic compares with standard ceramic, and what it costs.',
    h1: 'Graphene Ceramic Coating, Made in Australia',
  },
  newCar: {
    path: '/new-car-paint-protection/',
    title: 'New Car Paint Protection Brisbane | Diamond Plate',
    description: `Protect new car paint in Brisbane in the first weeks, before the sun and bird droppings get to it. A dealer paint protection alternative from ${from}.`,
    h1: 'New Car Paint Protection in Brisbane',
  },
  mobile: {
    path: '/mobile-ceramic-coating/',
    title: 'Mobile Ceramic Coating Brisbane: We Come to You',
    description: 'Mobile ceramic coating across Brisbane, Logan and the Redlands. A trained applicator coats your car in your driveway or at work. Fixed prices.',
    h1: 'Mobile Ceramic Coating Across Brisbane',
  },
  fourWd: {
    path: '/4wd-ute-ceramic-coating/',
    title: '4WD & Ute Ceramic Coating Brisbane | Diamond Plate',
    description: 'Ceramic coating for Prados, LandCruisers, Hiluxes, Rangers and Patrols in Brisbane. Mud, red dirt and bug splatter wash off more easily. We come to you.',
    h1: '4WD and Ute Ceramic Coating Brisbane',
  },
  ev: {
    path: '/ev-tesla-ceramic-coating/',
    title: 'Tesla & EV Ceramic Coating Brisbane | Diamond Plate',
    description: 'Ceramic coating for Tesla Model Y, Model 3, BYD and Kia EVs in Brisbane. Protect soft factory paint, applied at home while your car charges.',
    h1: 'Tesla and EV Ceramic Coating in Brisbane',
  },
  interior: {
    path: '/interior-and-wheel-protection/',
    title: 'Car Interior & Wheel Protection Brisbane | Diamond Plate',
    description: 'Fabric and leather stain protection, vinyl UV protection and alloy wheel protection in Brisbane. Included in Diamond Package Plus and Ultimate Plus.',
    h1: 'Interior, Leather and Wheel Protection',
  },
  warranty: {
    path: '/warranty/',
    title: `${warrantyYears}-Year Ceramic Coating Warranty | Diamond Plate`,
    description: `The Diamond Plate ${warrantyYears}-year national warranty explained: no annual inspections, no reapplication, no capped payments. What it covers and what it doesn’t.`,
    h1: `The ${warrantyYears}-Year National Warranty, Explained`,
  },
  areas: {
    path: '/service-areas/',
    title: 'Brisbane Service Areas | Diamond Plate Ceramic Coating',
    description: 'Mobile ceramic coating near you: every Brisbane, Logan and Redlands suburb we cover, from our Murarrie base. Find your suburb and get a fixed price.',
    h1: 'Ceramic Coating Across Brisbane',
  },
  'area-eastern-suburbs-bayside': {
    path: '/service-areas/eastern-suburbs-bayside/',
    title: 'Ceramic Coating Murarrie, Wynnum & Bayside | Diamond Plate',
    description: 'Mobile ceramic coating in Murarrie, Cannon Hill, Carindale, Wynnum, Manly and Brisbane’s east. Protection against bay salt air and port road grime.',
    h1: 'Ceramic Coating in Brisbane’s East and Bayside',
  },
  'area-northside': {
    path: '/service-areas/northside/',
    title: 'Ceramic Coating Northside Brisbane | Diamond Plate',
    description: 'Mobile ceramic coating on Brisbane’s northside: Chermside, Aspley, Albany Creek, Nundah, Hamilton and North Lakes. We come to your home or work.',
    h1: 'Ceramic Coating on Brisbane’s Northside',
  },
  'area-southside-logan': {
    path: '/service-areas/southside-logan/',
    title: 'Ceramic Coating Southside Brisbane & Logan | Diamond Plate',
    description: 'Mobile ceramic coating on the southside and in Logan: Mount Gravatt, Sunnybank, Springwood, Shailer Park and Browns Plains. Fixed prices, we come to you.',
    h1: 'Ceramic Coating on the Southside and Logan',
  },
  'area-redlands': {
    path: '/service-areas/redlands/',
    title: 'Ceramic Coating Redlands & Capalaba | Diamond Plate', // brief's 62-char title trimmed to fit 60
    description: 'Mobile ceramic coating in the Redlands: Capalaba, Birkdale, Wellington Point, Cleveland, Victoria Point and Redland Bay. Protection from coastal salt.',
    h1: 'Ceramic Coating in the Redlands',
  },
  reviews: {
    path: '/reviews/',
    title: 'Reviews | Diamond Plate Ceramic Coating Brisbane',
    description: 'What Diamond Plate customers say about the coating, the applicators and the service, word for word. 96% recommend us on Facebook.',
    h1: 'Diamond Plate Reviews',
  },
  faq: {
    path: '/faq/',
    title: 'Ceramic Coating FAQs: Brisbane | Diamond Plate',
    description: 'Is ceramic coating worth it? How long does it last in Queensland? Straight answers on prices, the warranty, washing, car washes and what coating can’t do.',
    h1: 'Ceramic Coating FAQs',
  },
  about: {
    path: '/about/',
    title: 'About Diamond Plate Ceramic Coating, Australian Made',
    description: 'Diamond Plate Australia makes its own ceramic and graphene ceramic coatings and trains its own applicators. Meet the Brisbane team based in Murarrie.',
    h1: 'About Diamond Plate',
  },
  quote: {
    path: '/get-a-quote/',
    title: 'Get a Ceramic Coating Quote, Brisbane | Diamond Plate',
    description: `Get your fixed ceramic coating price in Brisbane. Tell us your car and suburb and we reply within 1 business hour, Mon–Fri. Packages from ${from}.`,
    h1: 'Get Your Fixed Price',
  },
  guides: {
    path: '/guides/',
    title: 'Ceramic Coating Guides | Diamond Plate Brisbane',
    description: 'Honest guides to ceramic coating in Queensland: costs, whether it’s worth it, dealer protection, PPF, graphene, aftercare and car washes.',
    h1: 'Ceramic Coating Guides',
  },
  thanks: {
    path: '/thank-you/',
    title: 'Thanks, We’ve Got It | Diamond Plate Ceramic Coating',
    description: 'Your quote request has been received. Here’s what happens next.',
    h1: 'Thanks, we’ve got it',
    noindex: true,
  },
  privacy: {
    path: '/privacy/',
    title: 'Privacy Policy | Diamond Plate Ceramic Coating Brisbane',
    description: 'How Diamond Plate Ceramic Coating Brisbane collects, uses and stores the details you send through this website.',
    h1: 'Privacy Policy',
  },
  terms: {
    path: '/terms/',
    title: 'Website Terms | Diamond Plate Ceramic Coating Brisbane',
    description: 'The terms of use for the Diamond Plate Ceramic Coating Brisbane website, including prices, quotes and warranty information.',
    h1: 'Website Terms',
  },
  notFound: {
    path: '/404/',
    title: 'Page Not Found | Diamond Plate Ceramic Coating',
    description: 'That page has moved or never existed. Get a fixed ceramic coating price or call 1300 995 100.',
    h1: 'That page has driven off',
    noindex: true,
  },
} satisfies Record<string, RouteMeta>;

export type RouteKey = keyof typeof routes;

/** "/" -> "home", "/service-areas/northside/" -> "service-areas-northside" */
export const ogSlug = (path: string) => path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home';
