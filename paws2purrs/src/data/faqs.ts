// FAQ answers use ONLY confirmed facts. Items with `todo: true` are hidden in the
// production build (shown in `npm run dev` so Vanessa's answers can be dropped in).
export interface Faq { id: string; q: string; a: string; todo?: boolean }

export const faqs: Faq[] = [
  {
    id: 'licensed',
    q: 'Are you licensed and insured?',
    a: "Yes. Paws 2 Purrs is licensed by Gedling Borough Council and fully insured, and Vanessa has 10 years' experience looking after other people's dogs. Ask her anything about it at your meet & greet.",
  },
  {
    id: 'times',
    q: 'What time is drop-off and collection?',
    a: 'Daycare dogs arrive around 7:30am and are collected around 5pm, tired and happy. If your hours are a bit different, just mention it when you get in touch.',
  },
  {
    id: 'nervous',
    q: 'Do you take nervous dogs?',
    a: "Yes. Tell Vanessa about your dog's worries when you get in touch, and meet her first at a meet & greet. Jill wrote on Google that her dog IO is \"a nervous dog who doesn't like being without us. Within a couple of visits he was running up the drive to be with his friends each day.\"",
  },
  {
    id: 'medication',
    q: 'Can you give my dog medication?',
    a: "Tell Vanessa exactly what your dog needs when you enquire, and she'll talk it through with you. Loki's owner Claire says: \"Loki also has to take medication and I am confident in Vanessa's care when he is with her.\"",
  },
  {
    id: 'size',
    q: 'Is there a size limit?',
    a: "No, there's no size limit. Big, bouncy breeds are welcome, and huskies are Vanessa's favourites. Small dogs are very welcome too.",
  },
  {
    id: 'updates',
    q: 'Do I get updates?',
    a: 'Yes. Vanessa sends photo and video updates so you can see what your dog is up to. Owners mention the daily updates and photos in their Google reviews.',
  },
  {
    id: 'pickup',
    q: 'Do you collect and drop off?',
    a: 'Yes, pick-up and drop-off is part of the dog walking service. For daycare, dogs come to Vanessa in Arnold around 7:30am. If getting there is tricky, ask and she\'ll tell you what she can do.',
  },
  {
    id: 'cats',
    q: 'Do you look after cats?',
    a: "Yes. That's the \"Purrs\" in Paws 2 Purrs. Vanessa does cat pop-ins and small animal feeds while you're away.",
  },
  {
    id: 'minimum',
    q: "What's the minimum stay?",
    a: 'One day. Book a single daycare day, one night of boarding, or a longer holiday stay.',
  },
  {
    id: 'christmas',
    q: 'Do you have Christmas availability?',
    a: 'There is limited Christmas boarding availability, so ask early. The 2027 diary is open now too.',
  },
  {
    id: 'cost',
    q: 'How much does it cost?',
    a: 'Prices depend on the service and dates. Message Vanessa for a quick quote.',
  },
  {
    id: 'kennels',
    q: 'Will my dog be in a kennel?',
    a: "No. Paws 2 Purrs is home boarding, not kennels. Dogs live as part of the household: they share the sofa, sleep where they normally would, and have a large enclosed garden to play in.",
  },
  {
    id: 'offlead',
    q: 'Do the dogs go off lead?',
    a: 'Most dogs are off lead or on long lines, depending on the dog and the place. Groups go to the woods, farm fields and water spots, with ball play on the way.',
  },
  {
    id: 'where',
    q: 'Where are you based?',
    a: "Arnold, Nottingham NG5, in Gedling borough. The exact address is shared when you book. Vanessa looks after dogs from Arnold and nearby areas such as Mapperley, Woodthorpe, Redhill and Gedling.",
  },
  {
    id: 'vaccinations',
    q: 'What vaccinations are needed?',
    a: 'TODO: confirm with Vanessa (e.g. annual boosters, kennel cough, flea and worming).',
    todo: true,
  },
  {
    id: 'puppies',
    q: 'Do you take puppies or unneutered dogs?',
    a: 'TODO: confirm with Vanessa.',
    todo: true,
  },
];

export const faq = (ids: string[]) => ids.map((id) => faqs.find((f) => f.id === id)!).filter(Boolean);
