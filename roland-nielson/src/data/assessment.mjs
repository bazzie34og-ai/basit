// Personal Patterns Assessment: questions, motivators and scoring.
// Single source of truth for the page (client scoring + results) and the
// submission-created function (server-side validation + re-scoring).
// Wording follows the October 2026 team brief exactly. Change VERSION when wording changes.

export const VERSION = 'ppa-v1-2026-10';
export const FORM_NAME = 'personal-patterns-assessment';

export const SCALE = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

export const CATEGORIES = [
  {
    key: 'action',
    name: 'Action & Initiative',
    explores: 'How you respond when something unfamiliar or hard shows up: whether you move toward it, decide on your own and recover when a plan falls apart.',
    questions: [
      'I take action when I face an unfamiliar problem.',
      'I feel comfortable making decisions without everyone’s approval.',
      'I address difficult situations rather than avoid them.',
      'I prefer taking responsibility for solving problems.',
      'I recover quickly when a plan fails.',
    ],
  },
  {
    key: 'connection',
    name: 'Connection & Communication',
    explores: 'How you show up with people: starting conversations, saying what you think and feel, listening and asking for support.',
    questions: [
      'I find it easy to start conversations with new people.',
      'I openly express my thoughts and feelings.',
      'I feel energized after meaningful interactions.',
      'I actively seek to understand other people’s perspectives.',
      'I feel comfortable asking for support when I need it.',
    ],
  },
  {
    key: 'consistency',
    name: 'Consistency & Follow-Through',
    explores: 'What happens after the motivation fades: keeping commitments, holding routines and staying steady when progress is slow or the week is stressful.',
    questions: [
      'I follow through on commitments even when my motivation drops.',
      'I maintain routines that support my goals.',
      'I finish important tasks before starting new projects.',
      'I stay consistent when progress is slow.',
      'I make time for responsibilities even during stressful weeks.',
    ],
  },
  {
    key: 'structure',
    name: 'Structure & Decision-Making',
    explores: 'How you organize your life and your choices: planning ahead, checking details, tracking commitments and adjusting when the facts change.',
    questions: [
      'I prefer to have a clear plan before beginning a project.',
      'I review important details before making decisions.',
      'I track deadlines, appointments, and commitments.',
      'I adjust my plans when new evidence challenges my assumptions.',
      'I use systems or tools to keep myself organized.',
    ],
  },
];

export const MOTIVATORS = [
  'Helping others',
  'Financial security',
  'Personal freedom',
  'Learning and growth',
  'Strong relationships',
  'Stability and peace',
  'Recognition and achievement',
  'Creativity and self-expression',
];
export const MAX_MOTIVATORS = 3;

export const BANDS = [
  { min: 5, max: 13, label: 'Less frequently expressed behaviors' },
  { min: 14, max: 19, label: 'Situational or mixed behaviors' },
  { min: 20, max: 25, label: 'Frequently expressed behaviors' },
];

// Flat list: q1…q20 in category order.
export const QUESTIONS = CATEGORIES.flatMap((c, ci) =>
  c.questions.map((text, i) => ({ id: `q${ci * 5 + i + 1}`, n: ci * 5 + i + 1, text, category: c.key })),
);

export const band = (score) => BANDS.find((b) => score >= b.min && score <= b.max)?.label ?? '';

/**
 * Scores answers. `answers` maps q1…q20 → 1..5 (numbers or numeric strings).
 * Returns { valid, missing, scores: { action, connection, consistency, structure } }.
 * Each category is the sum of its five answers (5–25). No reverse scoring, no overall score.
 */
export function score(answers) {
  const missing = [];
  const scores = {};
  for (const c of CATEGORIES) scores[c.key] = 0;
  for (const q of QUESTIONS) {
    const v = Number(answers?.[q.id]);
    if (!Number.isInteger(v) || v < 1 || v > 5) { missing.push(q.id); continue; }
    scores[q.category] += v;
  }
  return { valid: missing.length === 0, missing, scores };
}
