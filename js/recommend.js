// ════════════════════════════════════════════════════════════════════════════
// RECOMMEND — build a personalised workout from the user's profile
// (owned equipment + selected goals). Draws exercises from the curated
// per-equipment sets (data/equipmentSets.js), prefers the user's actual
// equipment, fills balanced movement slots, and sets volume/rest by goal.
// ════════════════════════════════════════════════════════════════════════════

import { EXERCISE_BY_SLUG, exDifficulty } from './data/exercises.js';
import { EQUIPMENT_SETS } from './data/equipmentSets.js';
import { GOAL_CONFLICTS } from './data/taxonomy.js';
import { exFromLib } from './state.js';
import { planName } from './data/i18n-content.js';

// Goal that dictates volume/rest scheme when several are selected.
const GOAL_PRIORITY = ['strength', 'hypertrophy', 'fat-loss', 'tone', 'endurance', 'mobility'];

const GOAL_PARAMS = {
  'strength':    { rounds: 4, restEx: 30, restRounds: 90 },
  'hypertrophy': { rounds: 4, restEx: 25, restRounds: 75 },
  'fat-loss':    { rounds: 4, restEx: 15, restRounds: 45 },
  'endurance':   { rounds: 3, restEx: 15, restRounds: 45 },
  'tone':        { rounds: 3, restEx: 20, restRounds: 60 },
  'mobility':    { rounds: 2, restEx: 20, restRounds: 45 },
};

// Fitness level → exercise difficulty cap + volume/intensity modifiers.
//   rank      : max exercise difficulty allowed (and preferred target)
//   roundsΔ   : adjustment to the goal's round count (clamped to >= 2)
//   volumeMul : scales reps / hold time per exercise
//   restMul   : scales rest (more recovery for beginners, less for advanced)
//   exercises : target number of exercises in the main circuit
const LEVEL_PARAMS = {
  base:         { rank: 1, roundsDelta: -1, volumeMul: 0.8, restMul: 1.25, exercises: 4 },
  intermediate: { rank: 2, roundsDelta: 0,  volumeMul: 1.0, restMul: 1.0,  exercises: 5 },
  advanced:     { rank: 3, roundsDelta: 1,  volumeMul: 1.2, restMul: 0.8,  exercises: 6 },
};

function levelParams(level) {
  return LEVEL_PARAMS[level] || LEVEL_PARAMS.base;
}

// Scale a library exercise's volume to the chosen level (circuit only).
function scaleVolume(ex, lp) {
  const out = {};
  if (ex.reps > 0) {
    out.reps = Math.max(4, Math.round(ex.reps * lp.volumeMul));
    if (ex.secs > 0) out.secs = Math.max(20, Math.round(ex.secs * lp.volumeMul / 5) * 5);
  } else if (ex.secs > 0) {
    out.secs = Math.max(15, Math.round(ex.secs * lp.volumeMul / 5) * 5);
  }
  return out;
}

// Sequence of movement categories to fill, per goal (repeats allowed).
// Ordered most-essential first: a shorter beginner circuit keeps the leading
// balanced slots, while higher levels also fill the trailing ones.
const SLOTS = {
  'strength':    ['lower', 'push', 'pull', 'core', 'lower'],
  'hypertrophy': ['lower', 'push', 'pull', 'core', 'arms'],
  'fat-loss':    ['lower', 'push', 'cardio', 'core', 'pull'],
  'endurance':   ['cardio', 'lower', 'push', 'core', 'pull'],
  'tone':        ['lower', 'glutes', 'push', 'core', 'pull'],
  'mobility':    ['mobility', 'mobility', 'mobility', 'mobility', 'mobility'],
};

const WARMUP = ['high-knees', 'jumping-jack', 'world-greatest-stretch'];
const COOLDOWN = ['quad-stretch', 'hamstring-stretch', 'chest-stretch', 'deep-breathing'];

function primaryGoal(goals) {
  return GOAL_PRIORITY.find(g => goals.includes(g)) || 'tone';
}

export function generatePlan(profile) {
  const equipment = profile.equipment || [];
  const owned = new Set(['none', ...equipment]);
  const goals = (profile.goals && profile.goals.length) ? profile.goals : ['tone'];
  const pg = primaryGoal(goals);
  const params = GOAL_PARAMS[pg];
  const hasEquip = equipment.length > 0;
  const level = LEVEL_PARAMS[profile.level] ? profile.level : 'base';
  const lp = levelParams(level);
  const allowed = ex => exDifficulty(ex.slug) <= lp.rank;

  // Build category → usable exercises from the owned equipment sets.
  // Equipment sets first, bodyweight last → weighted variants are preferred.
  const sources = [...equipment, 'none'];
  const byCat = {};
  for (const eq of sources) {
    const set = EQUIPMENT_SETS[eq];
    if (!set) continue;
    for (const cat of Object.keys(set)) {
      for (const slug of set[cat]) {
        const ex = EXERCISE_BY_SLUG[slug];
        if (!ex) continue;
        if (!ex.equipment.every(e => owned.has(e))) continue;   // user must own every required attrezzo
        byCat[cat] = byCat[cat] || [];
        if (!byCat[cat].some(e => e.slug === slug)) byCat[cat].push(ex);
      }
    }
  }

  const matchesGoal = ex => ex.goals.some(g => goals.includes(g));

  // Goal coherence: drop exercises that serve a goal conflicting with the user's
  // selection without serving any selected goal (e.g. mass-only moves in a
  // fat-loss plan, or cardio-only moves in a mass plan). Only the fat-loss ↔
  // hypertrophy pair conflicts, so this is a no-op for every other goal.
  const conflicts = new Set();
  goals.forEach(g => (GOAL_CONFLICTS[g] || []).forEach(c => conflicts.add(c)));
  const goalCoherent = ex => matchesGoal(ex) || !ex.goals.some(g => conflicts.has(g));

  // Within a slot: prefer the user's equipment, then the level's difficulty
  // (hardest allowed for advanced, simplest for base), then goal match.
  const sortSlot = arr => arr.slice().sort((a, b) => {
    const aw = (hasEquip && a.type === 'weights') ? 1 : 0;
    const bw = (hasEquip && b.type === 'weights') ? 1 : 0;
    if (aw !== bw) return bw - aw;
    const ad = Math.abs(exDifficulty(a.slug) - lp.rank);
    const bd = Math.abs(exDifficulty(b.slug) - lp.rank);
    if (ad !== bd) return ad - bd;
    const ag = matchesGoal(a) ? 1 : 0;
    const bg = matchesGoal(b) ? 1 : 0;
    if (ag !== bg) return bg - ag;
    return 0;
  });

  const slots = SLOTS[pg] || SLOTS.tone;
  const used = new Set();
  const circuit = [];
  const target = lp.exercises;

  // First pass: fill each slot with a level- and goal-appropriate exercise, up
  // to the level's target count (a beginner gets a shorter circuit).
  for (const cat of slots) {
    if (circuit.length >= target) break;
    const pick = sortSlot((byCat[cat] || []).filter(e => !used.has(e.slug) && allowed(e) && goalCoherent(e)))[0];
    if (pick) { used.add(pick.slug); circuit.push(pick); }
  }

  // Top-up the circuit to the target count from all categories, relaxing the
  // constraints in priority order: keep level + goal, then drop goal, then
  // (last resort) drop the level cap so the circuit is never too short.
  const topUp = (filter) => {
    if (circuit.length >= target) return;
    for (const ex of sortSlot(Object.values(byCat).flat().filter(filter))) {
      if (circuit.length >= target) break;
      if (!used.has(ex.slug)) { used.add(ex.slug); circuit.push(ex); }
    }
  };
  topUp(e => !used.has(e.slug) && allowed(e) && goalCoherent(e));
  topUp(e => !used.has(e.slug) && allowed(e));
  topUp(e => !used.has(e.slug));

  return {
    name: planName(pg, equipment),
    nameMeta: { goal: pg, equipment: [...equipment] },
    level,
    rounds: Math.max(2, params.rounds + lp.roundsDelta),
    restBetweenEx: Math.round(params.restEx * lp.restMul),
    restBetweenRounds: Math.round(params.restRounds * lp.restMul),
    warmup: WARMUP.map(s => exFromLib(s)),
    circuit: circuit.map(ex => exFromLib(ex.slug, scaleVolume(EXERCISE_BY_SLUG[ex.slug], lp))),
    cooldown: COOLDOWN.map(s => exFromLib(s)),
  };
}
