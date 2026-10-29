// "Why owners trust Vanessa": real owner worries, answered only with confirmed facts and reviews.
export interface Promise_ { id: string; worry: string; promise: string; proof: string; icon: string }
export const promises: Promise_[] = [
  { id: 'legit', icon: 'shield', worry: 'Is it legit and safe?', promise: 'Licensed by Gedling Borough Council and fully insured.', proof: "And 10 years' experience caring for other people's dogs." },
  { id: 'kennel', icon: 'sofa', worry: 'Will my dog be stuck in a kennel?', promise: 'A real home, not kennels.', proof: 'Sofas, their usual sleeping spot and a big enclosed garden.' },
  { id: 'exercise', icon: 'tree', worry: 'Will they get proper exercise?', promise: 'Woodland, farm-field and lakeside adventures.', proof: 'Off lead or on long lines where it’s safe, with ball play on the way.' },
  { id: 'updates', icon: 'camera', worry: 'Will I know they’re OK?', promise: 'Photo and video updates.', proof: 'Kate: “Vanessa always sends me videos or photos of her having fun…”' },
  { id: 'nervous', icon: 'heart', worry: 'My dog is nervous.', promise: 'Nervous dogs find their feet here.', proof: 'Jill: “Within a couple of visits he was running up the drive to be with his friends each day.”' },
  { id: 'medication', icon: 'pill', worry: 'My dog needs medication.', promise: 'Owners trust Vanessa with it.', proof: 'Claire: “Loki also has to take medication and I am confident in Vanessa’s care when he is with her.”' },
  { id: 'size', icon: 'ruler', worry: 'Big, boisterous breed?', promise: 'No size limit. Huskies are her favourites.', proof: 'Vanessa: “I love Huskies”. Small dogs are just as welcome.' },
  { id: 'reliable', icon: 'calendar', worry: 'Is it consistent and reliable?', promise: 'Dogs stay for years.', proof: 'Gracie 5+ years, Loki about 6, Reign about 4, Lola 3+. Two owners use the word “reliable”.' },
  { id: 'collect', icon: 'car', worry: 'Can you collect my dog?', promise: 'Pick-up and drop-off on walks.', proof: 'So your dog still gets out on your busiest days.' },
  { id: 'cat', icon: 'cat', worry: 'What about the cat while I’m away?', promise: 'Cat pop-ins and small animal feeds.', proof: 'Paws and purrs, all looked after.' },
  { id: 'christmas', icon: 'gift', worry: 'Christmas and holidays?', promise: 'Christmas boarding, limited spaces.', proof: 'And the 2027 diary is open now.' },
];
export const promiseIds = (ids: string[]) => ids.map((id) => promises.find((p) => p.id === id)!).filter(Boolean);
