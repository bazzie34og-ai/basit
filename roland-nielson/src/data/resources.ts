// Omaha-area resources. {{VERIFY}}: every link and phone number must be checked by the owner
// before launch and once a year after. Set verified: true once checked.
export type Resource = { name: string; url: string; phone?: string; text: string; verified: boolean };
export type ResourceGroup = { id: string; title: string; intro: string; items: Resource[] };

export const resourceGroups: ResourceGroup[] = [
  {
    id: 'crisis',
    title: 'Right now: crisis and urgent help',
    intro: 'If you or someone else is in danger, call 911. These lines are free, confidential and open 24/7.',
    items: [
      { name: '988 Suicide & Crisis Lifeline', url: 'https://988lifeline.org/', phone: '988', text: 'Call or text 988, or chat online, any time. For anyone in emotional distress or worried about someone else.', verified: false },
      { name: 'Veterans Crisis Line', url: 'https://www.veteranscrisisline.net/', phone: '988, then press 1', text: 'For veterans, service members and their families. Text 838255 also works.', verified: false },
      { name: 'Boys Town National Hotline', url: 'https://www.boystown.org/hotline', phone: '1-800-448-3000', text: 'Based in Omaha. Free, 24/7 support for kids, teens and parents in any kind of trouble.', verified: false },
      { name: 'Nebraska Family Helpline', url: 'https://dhhs.ne.gov/Pages/Nebraska-Family-Helpline.aspx', phone: '1-888-866-8660', text: 'For Nebraska parents and families worried about a child or family member. Answered 24/7.', verified: false },
    ],
  },
  {
    id: 'local-services',
    title: 'Local services and basic needs',
    intro: 'Housing, food, utilities, jobs and legal help. 211 is the best first call when you are not sure where to start.',
    items: [
      { name: '211 Nebraska', url: 'https://ne211.org/', phone: '211', text: 'Free, confidential referrals to local help in Omaha and across Nebraska: rent, food, utilities, transport and more.', verified: false },
      { name: '211 Iowa (Council Bluffs)', url: 'https://www.211iowa.org/', phone: '211', text: 'The same kind of local referral line for Council Bluffs and the rest of Iowa.', verified: false },
      { name: 'Heartland Family Service', url: 'https://www.heartlandfamilyservice.org/', text: 'Omaha and Council Bluffs nonprofit offering family support, housing, recovery and mental health programs.', verified: false },
      { name: 'Siena Francis House', url: 'https://sienafrancis.org/', text: 'Omaha shelter and recovery programs for people experiencing homelessness.', verified: false },
      { name: 'Open Door Mission', url: 'https://opendoormission.org/', text: 'Omaha shelter, meals and long-term recovery programs for men and families.', verified: false },
      { name: 'Legal Aid of Nebraska', url: 'https://www.legalaidofnebraska.org/', text: 'Free civil legal help for low-income Nebraskans, including family and custody issues.', verified: false },
      { name: 'Heartland Workforce Solutions', url: 'https://www.hws-ne.org/', text: 'Omaha-area job centers: job search help, training and resume support.', verified: false },
    ],
  },
  {
    id: 'recovery',
    title: 'Recovery meetings and groups',
    intro: "Different things work for different men. Try a few. Coaching can work alongside any of these.",
    items: [
      { name: 'Alcoholics Anonymous – Omaha Area Intergroup', url: 'https://www.omahaaa.org/', text: 'Meeting lists and contact info for AA meetings across the Omaha area.', verified: false },
      { name: 'Narcotics Anonymous meeting search', url: 'https://www.na.org/meetingsearch/', text: 'Find NA meetings in Omaha, Council Bluffs and nearby by zip code.', verified: false },
      { name: 'SMART Recovery meetings', url: 'https://meetings.smartrecovery.org/', text: 'Science-based, self-empowering recovery meetings, in person in the metro and online.', verified: false },
      { name: 'Celebrate Recovery', url: 'https://www.celebraterecovery.com/', text: 'Faith-based recovery groups. Many Omaha-area churches host weekly meetings.', verified: false },
      { name: 'SAMHSA National Helpline', url: 'https://www.samhsa.gov/find-help/helplines/national-helpline', phone: '1-800-662-4357', text: 'Free, confidential, 24/7 information and referrals for substance use and mental health.', verified: false },
    ],
  },
  {
    id: 'families',
    title: 'For wives, partners and parents',
    intro: "Loving someone who struggles is hard work. You deserve support whether or not he changes.",
    items: [
      { name: 'Al-Anon Family Groups', url: 'https://al-anon.org/', text: "For people affected by someone else's drinking. Find Omaha-area and online meetings.", verified: false },
      { name: 'Nar-Anon Family Groups', url: 'https://www.nar-anon.org/', text: "For families and friends of someone who uses drugs. Online and local meetings.", verified: false },
      { name: 'NAMI Nebraska', url: 'https://naminebraska.org/', text: 'Free support groups and classes for people living with mental illness and their families.', verified: false },
    ],
  },
  {
    id: 'men',
    title: "Men's groups and staying active",
    intro: 'Isolation makes everything harder. A regular place to show up with other men helps.',
    items: [
      { name: 'F3 Nation (free men’s workouts)', url: 'https://f3nation.com/', text: 'Free, peer-led outdoor workouts for men. Check the site for Omaha-area groups.', verified: false },
      { name: 'Omaha Public Library events', url: 'https://omahalibrary.org/', text: 'Free classes and events across Omaha branches, including job and computer help.', verified: false },
    ],
  },
];
