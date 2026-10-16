// Real client feedback only. Add an entry only with the client's written permission.
// The Testimonials component renders nothing while this list is empty.
// Never add Review or AggregateRating schema for the business from these.
export type Testimonial = {
  quote: string;
  name: string; // first name + last initial, or "Client, Omaha" if they prefer
  context?: string; // e.g. "Father of two, Papillion"
  source?: 'google' | 'direct';
};

export const testimonials: Testimonial[] = [];
