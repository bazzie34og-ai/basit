// Main FAQ. First sentence answers the question directly (voice + AI answers).
// Answers stay 40–80 words. Items marked scope: true are the "what this is not" disclaimers.
import { site, POLICY, areaNames } from '../config/site';

export type FaqItem = { q: string; a: string; scope?: boolean; home?: boolean };

const policy = POLICY
  ? POLICY
  : "The Founding Client rate is a 3-month commitment. For the other plans, we go over cancellation and rescheduling terms on the free call, before you pay anything or pick a plan. Ask whatever you want about it. You should know exactly what you are agreeing to before we start working together.";

export const faqs: FaqItem[] = [
  {
    q: 'What does a life coach do?',
    a: "A life coach helps you get clear on what you want, build a simple plan and stick to it. With me that means weekly sessions, honest questions and accountability. We look at where your days go, what keeps knocking you off track and what to do on a bad day. You do the work. I help you keep showing up for it.",
    home: true,
  },
  {
    q: 'How much does a life coach cost in Omaha?',
    a: "My coaching costs $149 to $399 a month. Starter is $149 for two 45-minute sessions, Core Coaching is $249 for four, and Focused Support is $399 for four 60-minute sessions. The first three Founding Clients get Core Coaching for $199 a month for three months. In-person sessions add $40 to cover the room. The first call is free. <a href=\"/pricing/\">See full pricing</a>.",
    home: true,
  },
  {
    q: 'Do I need a life coach or a therapist?',
    a: "You need a therapist if you are dealing with a mental health condition, trauma that is taking over, or thoughts of harming yourself. A coach helps a stable man build structure, habits and follow-through. I am a non-clinical coach, not a therapist. Many men do both. If I think you need more than coaching, I will tell you and point you to licensed help.",
    scope: true,
    home: true,
  },
  {
    q: 'Is life coaching legit if the coach is not certified?',
    a: "Yes, coaching is not a licensed field, and certification is optional. I am not certified. I bring lived experience: I grew up in North Omaha, rebuilt my life starting in 2011 and raise four boys. Judge me on the free call, not a certificate. If it does not feel useful after 20 minutes, you walk away and owe nothing.",
    scope: true,
  },
  {
    q: 'What happens on the free discovery call?',
    a: "The free call is 20 minutes on the phone. You tell me what keeps happening, what you have tried and what you want different. I ask a few straight questions and tell you honestly whether I can help. If it is a fit, we pick a plan and a start date. If not, I will point you somewhere better. No pressure either way.",
    home: true,
  },
  {
    q: 'What happens in the first coaching session?',
    a: "In the first session we map your week and pick what matters most. We look at sleep, work, family, money, anger, habits, whatever is pulling you under. Then we set two or three small commitments you can keep before the next session. You leave with a plan you can follow on a bad day, not a list of 40 goals.",
  },
  {
    q: 'Where do in-person sessions happen in Omaha?',
    a: "In-person sessions happen at your location or a private meeting space in Omaha, by appointment. Some men like a walk-and-talk on the Keystone Trail or around Zorinsky Lake. In-person sessions add $40 each to cover room costs. Video and phone sessions have no extra fee. <a href=\"/omaha-life-coach/\">See the areas I serve</a>.",
  },
  {
    q: 'Do you offer evening and Saturday sessions?',
    a: `Yes. I coach Tuesday to Friday from 5:00 to 8:00 PM and Saturday from 11:00 AM to 1:00 PM, Central time. Sunday and Monday are closed. Evenings and Saturdays exist on purpose: most men I work with have jobs and kids, and they cannot leave work at 2 PM to talk about their life.`,
    home: true,
  },
  {
    q: 'Can we meet by video or phone instead?',
    a: "Yes. Video and phone sessions work the same as in person and cost nothing extra. Plenty of men take calls from the truck, the garage or a walk around the block. Video works anywhere in Nebraska and beyond, so moving or traveling for work does not have to break the routine.",
  },
  {
    q: 'Is coaching confidential?',
    a: "Yes. What you tell me stays between us. I do not share it with your wife, parents, boss or anyone else without your permission. The exceptions are if someone is at risk of serious harm or the law requires it. Coaching does not carry legal privilege the way some professions do, and I will explain that plainly on the first call.",
  },
  {
    q: 'How long does it take to see results?',
    a: "Most men notice something small within the first few weeks: a calmer evening, a kept promise, a better morning. Bigger change takes months of showing up. I do not promise results, because the work is yours. I promise to be honest, to be prepared and to hold you to what you said you would do.",
  },
  {
    q: 'Is there a commitment or cancellation policy?',
    a: policy,
  },
  {
    q: 'Can my wife or parent book a call for me?',
    a: "Yes, a wife, partner or parent can book the free call or reach out for you. But coaching only works if you choose it. On the call I will talk with you directly, and you decide. Families can pay for coaching, and I still keep what you share private. <a href=\"/for-families/\">More for families</a>.",
  },
  {
    q: 'Do you work with men in recovery?',
    a: "Yes. Some of the men I work with are rebuilding after addiction or a hard stretch. I bring lived experience, not a program. Coaching helps with structure, routine, accountability and rebuilding trust. It is not a replacement for meetings, sponsors or professional care. It works alongside them. <a href=\"/rebuilding-after-addiction/\">Coaching for men rebuilding after addiction</a>.",
  },
  {
    q: "What don't you do?",
    a: "I do not diagnose, provide therapy or psychotherapy, give medical advice, manage medication or handle crisis situations. I am a non-clinical life coach. If you need any of that, I will help you find licensed professionals. If you are in crisis right now, call or text 988. For local services and resources, call 211.",
    scope: true,
  },
  {
    q: 'What areas do you serve?',
    a: `I coach men across the Omaha metro: ${areaNames.join(', ')}. In-person sessions happen by appointment anywhere in that area. Video and phone sessions work from anywhere, including the rest of Nebraska and western Iowa.`,
  },
  {
    q: 'Who is coaching with Roland for?',
    a: "It is for men, mostly 30 to 55, who are tired of living the same day. Fathers who want to be present. Working men who are stretched thin. Men rebuilding after addiction, divorce or a setback. Men who start strong and slip. If you are willing to be honest and do the work, we will get along fine.",
  },
  {
    q: 'Is a life coach worth it?',
    a: "A life coach is worth it if you will use the help. Coaching costs less than many habits that are costing you now: lost work, lost sleep, arguments at home. The value is in showing up every week and keeping small promises. Start with the free call and decide after you have talked to me, not before.",
  },
  {
    q: "I've tried programs and meetings before. Why would this be different?",
    a: "Maybe it will not be, and I will not pretend otherwise. I do not believe one program, meeting or method works for everybody. We look at your actual life and use what helps. Men often slip because nobody checks in on a bad Tuesday. That check-in is a big part of what I do.",
  },
];

export const homeFaqs = faqs.filter((f) => f.home);
export const bookingNote = site.bookingLabel;
