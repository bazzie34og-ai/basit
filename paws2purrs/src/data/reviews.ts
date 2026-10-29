// Real Google reviews, copied WORD FOR WORD from Vanessa's Google Business Profile.
// Do not correct spelling or complete the truncated ones (ending in "…").
export interface Review {
  id: string;
  dog: string;          // headline, Lora italic
  tenure?: string;
  author: string;       // first name + last initial only
  initials: string;
  text: string;
  truncated: boolean;
  reply?: string;
  tags: ('daycare' | 'boarding' | 'walks' | 'nervous' | 'medication' | 'husky' | 'updates' | 'longterm')[];
}

export const reviews: Review[] = [
  {
    id: 'loki',
    dog: 'Loki',
    tenure: 'around 6 years with Vanessa',
    author: 'Claire K.',
    initials: 'CK',
    text: "Loki had been going to Vanessa's for around 6 years now and loves his time with his paw friends. Loki also has to take medication and I am confident in Vanessa's care when he is with her. I love the daily updates and photos, it's great to …",
    truncated: true,
    tags: ['daycare', 'medication', 'updates', 'longterm'],
  },
  {
    id: 'io',
    dog: 'IO',
    tenure: 'a few years with Vanessa',
    author: 'Jill F.',
    initials: 'JF',
    text: "My dog has been going to Paws to Purrs for a few years now. He's a nervous dog who doesn't like being without us. Within a couple of visits he was running up the drive to be with his friends each day. He's so happy to go each day and …",
    truncated: true,
    reply: "Oh thank you for your review. I adore IO he's so gentle and kind,he just fits and plods along and is just a happy chappy , especially when he talks to me 😂",
    tags: ['daycare', 'nervous', 'longterm'],
  },
  {
    id: 'gracie',
    dog: 'Gracie',
    tenure: 'over 5 years with Vanessa',
    author: 'Michelle N.',
    initials: 'MN',
    text: 'Gracie has been going to Vanessa for over 5 years and she loves it. She is treated like a member of the family, given plenty of attention and exercise.',
    truncated: false,
    reply: "Thank you for your review. Gracie is the longest serving dog I'm my daycare and has been with me from the start more or less and is great at teaching the newbies the ropes . X",
    tags: ['daycare', 'longterm'],
  },
  {
    id: 'husky',
    dog: 'A boisterous husky',
    tenure: 'daycare & boarding',
    author: 'Google reviewer',
    initials: '',
    text: 'If you ever need a trustworthy and reliable dog sitter and dog boarder, do not hesitate to contact Paws2Purrs.\nVanessa is a proper dog whisperer, and my boy (a boisterous husky) absolutely …',
    truncated: true,
    reply: "Thank you so much , I love Huskies,but he he has melted my heart ❤️ And he's come on so well 😁 it gives me great pleasure seeing dogs thrive .x",
    tags: ['boarding', 'husky', 'daycare'],
  },
  {
    id: 'lexi',
    dog: 'Lexi',
    tenure: 'springer spaniel, boards with Vanessa',
    author: 'Kate M.',
    initials: 'KM',
    text: 'My springer spaniel absolutely loves her stays, she boards whenever I go away and loves the long daily walks in the woods and different places with the other dogs. Vanessa always sends me videos or photos of her having fun and doing the …',
    truncated: true,
    reply: 'Thank you Kate we love Lexi. Miss Springer x',
    tags: ['boarding', 'updates'],
  },
  {
    id: 'reign',
    dog: 'Reign',
    tenure: 'about 4 years with Vanessa',
    author: 'Priv B.',
    initials: 'PB',
    text: "Vanessa has taken care of my dog for a few years now- both daycare and boarding. My pet loves going to Vanessa's and I often get picture updates of their adventures! Vanessa is flexible and takes good care of my pet.",
    truncated: false,
    reply: "Thank you for your review. I love Reign to bits, I think it's been about 4 years since she first came and she is a beautiful dog with Great owners 😊",
    tags: ['daycare', 'boarding', 'updates', 'longterm'],
  },
  {
    id: 'lola',
    dog: 'Lola',
    tenure: 'Labrador, 3+ years with Vanessa',
    author: 'Marianne H.',
    initials: 'MH',
    text: "Lola our Labrador has been going to Vanessa's for over 3 years and she loves it, always excited to go to daycare, we also use the overnights and weekend services too, I would 100% recommend paws2purrs daycare and boarding, a great way to …",
    truncated: true,
    tags: ['daycare', 'boarding', 'longterm'],
  },
  {
    id: 'walks',
    dog: 'Walked by Vanessa & her son',
    tenure: 'dog walks',
    author: 'Karena W.',
    initials: 'KW',
    text: 'This lady & her son walk our dog,they are a lovely team & very reliable,our dog loves his walk & is always happy to go with them.',
    truncated: false,
    reply: 'Thank you . Your so kind . My son and I think highly of you both x',
    tags: ['walks'],
  },
];

export const byTag = (tag: Review['tags'][number]) => reviews.filter((r) => r.tags.includes(tag));
export const byIds = (ids: string[]) => ids.map((id) => reviews.find((r) => r.id === id)!).filter(Boolean);
