// ════════════════════════════════════════════════════════════════════════════
// WORKOUT TEMPLATES
// Each template references exercises by slug and carries metadata used for
// recommendation (goals + zone + required equipment + suggested level).
// Model: { id, name, desc, goals, zone, equipment, level, rounds, restBetweenEx,
//          restBetweenRounds, warmup[], circuit[], cooldown[] }
//   equipment : array of equipment ids required to run it (['none'] = bodyweight)
//   level     : suggested fitness level ('base' | 'intermediate' | 'advanced')
// ════════════════════════════════════════════════════════════════════════════

import { LEVEL_RANK } from './taxonomy.js';

export const TEMPLATES = [

  // ─────────────────────────── CORPO LIBERO ───────────────────────────
  {
    id: 'bw-fullbody-fatloss',
    name: 'Full Body Brucia Grassi',
    desc: 'Circuito ad alta intensità a corpo libero per massimizzare il dispendio calorico.',
    goals: ['fat-loss', 'endurance'], zone: 'full-body', equipment: ['none'], level: 'intermediate',
    rounds: 4, restBetweenEx: 15, restBetweenRounds: 60,
    warmup: ['high-knees', 'jumping-jack', 'world-greatest-stretch'],
    circuit: ['squat-jump', 'pushup', 'mountain-climber', 'lunges', 'burpee'],
    cooldown: ['quad-stretch', 'hamstring-stretch', 'deep-breathing'],
  },
  {
    id: 'bw-fullbody-strength',
    name: 'Full Body Forza a corpo libero',
    desc: 'Pochi esercizi fondamentali, serie controllate per costruire forza ovunque.',
    goals: ['strength', 'hypertrophy'], zone: 'full-body', equipment: ['none'], level: 'intermediate',
    rounds: 3, restBetweenEx: 30, restBetweenRounds: 90,
    warmup: ['jumping-jack', 'cat-cow', 'world-greatest-stretch'],
    circuit: ['squat', 'pushup', 'lunges', 'pike-pushup', 'plank'],
    cooldown: ['chest-stretch', 'quad-stretch', 'deep-breathing'],
  },
  {
    id: 'bw-core',
    name: 'Core di Acciaio',
    desc: 'Allenamento mirato per addominali e stabilità del tronco.',
    goals: ['tone', 'strength'], zone: 'core', equipment: ['none'], level: 'intermediate',
    rounds: 3, restBetweenEx: 20, restBetweenRounds: 60,
    warmup: ['cat-cow', 'world-greatest-stretch'],
    circuit: ['plank', 'crunch', 'bicycle-crunch', 'leg-raise', 'side-plank', 'hollow-body'],
    cooldown: ['cat-cow', 'deep-breathing'],
  },
  {
    id: 'bw-glutes',
    name: 'Glutei al Top (corpo libero)',
    desc: 'Attivazione e tonificazione dei glutei senza attrezzi.',
    goals: ['tone'], zone: 'glutes', equipment: ['none'], level: 'intermediate',
    rounds: 3, restBetweenEx: 20, restBetweenRounds: 60,
    warmup: ['lateral-lunges', 'world-greatest-stretch'],
    circuit: ['glute-bridge', 'single-leg-glute-bridge', 'squat-sumo', 'lunges', 'step-up'],
    cooldown: ['quad-stretch', 'hamstring-stretch'],
  },
  {
    id: 'bw-lower',
    name: 'Gambe a corpo libero',
    desc: 'Volume sulle gambe usando solo il peso corporeo.',
    goals: ['tone', 'endurance', 'strength'], zone: 'lower', equipment: ['none'], level: 'base',
    rounds: 3, restBetweenEx: 20, restBetweenRounds: 70,
    warmup: ['high-knees', 'lateral-lunges'],
    circuit: ['squat', 'lunges', 'squat-sumo', 'wall-sit', 'calf-raise'],
    cooldown: ['quad-stretch', 'hamstring-stretch', 'deep-breathing'],
  },
  {
    id: 'bw-mobility',
    name: 'Mobilità & Recupero',
    desc: 'Sessione dolce di mobilità articolare e allungamento. Perfetta nei giorni di riposo.',
    goals: ['mobility'], zone: 'full-body', equipment: ['none'], level: 'base',
    rounds: 1, restBetweenEx: 10, restBetweenRounds: 30,
    warmup: ['cat-cow'],
    circuit: ['world-greatest-stretch', 'quad-stretch', 'hamstring-stretch', 'chest-stretch', 'shoulder-stretch'],
    cooldown: ['deep-breathing'],
  },

  // ─────────────────────────── MANUBRI ───────────────────────────
  {
    id: 'db-fullbody-hypertrophy',
    name: 'Full Body Massa · Manubri',
    desc: 'Stimolo ipertrofico completo con i soli manubri.',
    goals: ['hypertrophy', 'strength'], zone: 'full-body', equipment: ['dumbbell'], level: 'intermediate',
    rounds: 4, restBetweenEx: 45, restBetweenRounds: 90,
    warmup: ['jumping-jack', 'world-greatest-stretch'],
    circuit: ['db-goblet-squat', 'db-bench-press', 'db-row', 'db-shoulder-press', 'db-romanian-deadlift'],
    cooldown: ['chest-stretch', 'hamstring-stretch'],
  },
  {
    id: 'db-upper-hypertrophy',
    name: 'Upper Body Massa · Manubri',
    desc: 'Petto, schiena, spalle e braccia con i manubri.',
    goals: ['hypertrophy', 'tone'], zone: 'upper', equipment: ['dumbbell'], level: 'intermediate',
    rounds: 4, restBetweenEx: 40, restBetweenRounds: 80,
    warmup: ['band-pull-apart', 'shoulder-stretch'],
    circuit: ['db-bench-press', 'db-row', 'db-shoulder-press', 'db-lateral-raise', 'db-bicep-curl', 'db-tricep-extension'],
    cooldown: ['chest-stretch', 'shoulder-stretch'],
  },
  {
    id: 'db-lower-tone',
    name: 'Gambe & Glutei · Manubri',
    desc: 'Tonificazione di gambe e glutei con carico aggiuntivo.',
    goals: ['tone', 'hypertrophy'], zone: 'lower', equipment: ['dumbbell'], level: 'base',
    rounds: 4, restBetweenEx: 35, restBetweenRounds: 80,
    warmup: ['lateral-lunges', 'high-knees'],
    circuit: ['db-goblet-squat', 'db-lunges', 'db-romanian-deadlift', 'glute-bridge', 'calf-raise'],
    cooldown: ['quad-stretch', 'hamstring-stretch'],
  },

  // ─────────────────────────── BILANCIERE ───────────────────────────
  {
    id: 'bb-strength-fullbody',
    name: 'Forza 5x5 · Bilanciere',
    desc: 'I fondamentali del bilanciere per costruire forza pura.',
    goals: ['strength', 'hypertrophy'], zone: 'full-body', equipment: ['barbell'], level: 'advanced',
    rounds: 5, restBetweenEx: 60, restBetweenRounds: 120,
    warmup: ['jumping-jack', 'world-greatest-stretch', 'band-pull-apart'],
    circuit: ['bb-back-squat', 'bb-bench-press', 'bb-row', 'bb-overhead-press'],
    cooldown: ['chest-stretch', 'hamstring-stretch'],
  },
  {
    id: 'bb-glutes-power',
    name: 'Glutei Potenti · Bilanciere',
    desc: 'Hip thrust e stacchi per glutei forti e voluminosi.',
    goals: ['hypertrophy', 'strength'], zone: 'glutes', equipment: ['barbell'], level: 'advanced',
    rounds: 4, restBetweenEx: 50, restBetweenRounds: 100,
    warmup: ['lateral-lunges', 'glute-bridge'],
    circuit: ['bb-hip-thrust', 'bb-deadlift', 'bb-back-squat', 'single-leg-glute-bridge'],
    cooldown: ['quad-stretch', 'hamstring-stretch'],
  },

  // ─────────────────────────── KETTLEBELL ───────────────────────────
  {
    id: 'kb-fatloss-conditioning',
    name: 'Kettlebell Brucia Grassi',
    desc: 'Swing e movimenti dinamici per un condizionamento metabolico intenso.',
    goals: ['fat-loss', 'endurance', 'strength'], zone: 'full-body', equipment: ['kettlebell'], level: 'intermediate',
    rounds: 4, restBetweenEx: 20, restBetweenRounds: 70,
    warmup: ['jumping-jack', 'world-greatest-stretch'],
    circuit: ['kb-swing', 'kb-goblet-squat', 'kb-clean-press', 'kb-deadlift', 'mountain-climber'],
    cooldown: ['hamstring-stretch', 'deep-breathing'],
  },

  // ─────────────────────────── ELASTICI ───────────────────────────
  {
    id: 'band-glutes',
    name: 'Glutei con Elastici',
    desc: 'Attivazione e tono dei glutei con resistenza elastica.',
    goals: ['tone'], zone: 'glutes', equipment: ['band'], level: 'base',
    rounds: 3, restBetweenEx: 20, restBetweenRounds: 60,
    warmup: ['lateral-lunges', 'band-lateral-walk'],
    circuit: ['band-squat', 'band-glute-kickback', 'band-lateral-walk', 'glute-bridge', 'single-leg-glute-bridge'],
    cooldown: ['quad-stretch', 'hamstring-stretch'],
  },
  {
    id: 'band-upper-tone',
    name: 'Upper Tonico con Elastici',
    desc: 'Schiena e spalle definite con i soli elastici.',
    goals: ['tone', 'mobility'], zone: 'upper', equipment: ['band'], level: 'intermediate',
    rounds: 3, restBetweenEx: 20, restBetweenRounds: 60,
    warmup: ['band-pull-apart', 'shoulder-stretch'],
    circuit: ['band-row', 'band-pull-apart', 'pushup', 'pike-pushup'],
    cooldown: ['chest-stretch', 'shoulder-stretch'],
  },

  // ─────────────────────────── SBARRA ───────────────────────────
  {
    id: 'bar-upper-strength',
    name: 'Tirata alla Sbarra',
    desc: 'Trazioni e lavoro alla sbarra per una schiena forte e ampia.',
    goals: ['strength', 'hypertrophy'], zone: 'upper', equipment: ['pullupbar'], level: 'advanced',
    rounds: 4, restBetweenEx: 45, restBetweenRounds: 100,
    warmup: ['dead-hang', 'shoulder-stretch'],
    circuit: ['pullup', 'chinup', 'hanging-leg-raise', 'dead-hang'],
    cooldown: ['shoulder-stretch', 'chest-stretch'],
  },
];

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));

// Evaluate a template against a user profile (equipment + goals + level).
// Returns a breakdown used both to bucket templates in the gallery and to
// decide whether a template can actually be run.
//   canRun    : the user owns every piece of equipment the template needs
//   goalMatch : the template targets at least one of the user's goals
//   levelOk   : the template is not harder than the user's chosen level
//   score     : ranking weight (higher = better match), only meaningful if canRun
export function evalTemplate(tpl, profile) {
  const ownedEquip = new Set(['none', ...(profile.equipment || [])]);
  const canRun = tpl.equipment.every(e => ownedEquip.has(e));

  const userGoals = new Set(profile.goals || []);
  const goalMatch = tpl.goals.some(g => userGoals.has(g));

  const userRank = LEVEL_RANK[profile.level] || LEVEL_RANK.intermediate;
  const tplRank = LEVEL_RANK[tpl.level] || LEVEL_RANK.intermediate;
  const levelOk = tplRank <= userRank;

  let score = 0;
  tpl.goals.forEach(g => { if (userGoals.has(g)) score += 10; });
  tpl.equipment.forEach(e => { if (e !== 'none' && ownedEquip.has(e)) score += 3; });
  if (levelOk) score += 4;

  return { canRun, goalMatch, levelOk, score };
}
