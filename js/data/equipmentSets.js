// ════════════════════════════════════════════════════════════════════════════
// EQUIPMENT SETS — curated pools of exercises for each piece of equipment,
// grouped by movement category (lower / glutes / push / pull / arms / core /
// cardio). The plan generator draws from these sets based on the equipment the
// user owns, then picks the best circuit for the chosen goal.
//
// Slugs must exist in data/exercises.js. Exercises that need more than one
// attrezzo (es. panca + manubri) compaiono nei rispettivi set ma vengono usati
// solo se l'utente possiede TUTTI gli attrezzi richiesti (filtro nel generator).
// ════════════════════════════════════════════════════════════════════════════

export const EQUIPMENT_SETS = {

  // ─────────────────────────── CORPO LIBERO ───────────────────────────
  none: {
    lower:  ['squat', 'squat-sumo', 'lunges', 'lateral-lunges', 'step-up', 'wall-sit'],
    glutes: ['glute-bridge', 'single-leg-glute-bridge'],
    push:   ['pushup', 'diamond-pushup', 'pike-pushup', 'dips', 'incline-pushup'],
    pull:   ['superman'],
    core:   ['plank', 'side-plank', 'crunch', 'reverse-crunch', 'bicycle-crunch', 'hollow-body', 'leg-raise'],
    cardio: ['burpee', 'squat-jump', 'mountain-climber', 'jumping-jack', 'high-knees'],
  },

  // ─────────────────────────── MANUBRI ───────────────────────────
  dumbbell: {
    lower: ['db-goblet-squat', 'db-lunges', 'db-romanian-deadlift'],
    push:  ['db-bench-press', 'db-floor-press', 'db-shoulder-press', 'db-lateral-raise'],
    pull:  ['db-row'],
    arms:  ['db-bicep-curl', 'db-tricep-extension'],
  },

  // ─────────────────────────── KETTLEBELL ───────────────────────────
  kettlebell: {
    lower:  ['kb-goblet-squat', 'kb-deadlift'],
    pull:   ['kb-swing'],
    push:   ['kb-clean-press'],
    cardio: ['kb-swing', 'kb-clean-press'],
  },

  // ─────────────────────────── BILANCIERE ───────────────────────────
  barbell: {
    lower:  ['bb-back-squat', 'bb-hip-thrust'],
    pull:   ['bb-deadlift', 'bb-row'],
    push:   ['bb-bench-press', 'bb-overhead-press'],
    glutes: ['bb-hip-thrust'],
  },

  // ─────────────────────────── ELASTICI ───────────────────────────
  band: {
    lower:  ['band-squat', 'band-lateral-walk'],
    glutes: ['band-glute-kickback'],
    pull:   ['band-row', 'band-pull-apart'],
  },

  // ─────────────────────────── SBARRA ───────────────────────────
  pullupbar: {
    pull: ['pullup', 'chinup'],
    core: ['hanging-leg-raise'],
  },

  // ─────────────────────────── PANCA (modificatore) ───────────────────────────
  bench: {
    push:  ['db-bench-press', 'bb-bench-press'],
    lower: ['bb-hip-thrust', 'step-up'],
  },
};
