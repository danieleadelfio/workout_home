// ════════════════════════════════════════════════════════════════════════════
// RECOMMEND — build a personalised workout from the user's profile
// (owned equipment + selected goals). Draws exercises from the curated
// per-equipment sets (data/equipmentSets.js), prefers the user's actual
// equipment, fills balanced movement slots, and sets volume/rest by goal.
// ════════════════════════════════════════════════════════════════════════════

import { EXERCISE_BY_SLUG } from './data/exercises.js';
import { EQUIPMENT_SETS } from './data/equipmentSets.js';
import { exFromLib } from './state.js';
import { goalLabel, equipmentLabel } from './data/taxonomy.js';

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

// Sequence of movement categories to fill, per goal (repeats allowed).
const SLOTS = {
  'strength':    ['lower', 'push', 'pull', 'lower', 'core'],
  'hypertrophy': ['lower', 'push', 'pull', 'arms', 'core'],
  'fat-loss':    ['lower', 'push', 'cardio', 'pull', 'core'],
  'endurance':   ['cardio', 'lower', 'push', 'core', 'pull'],
  'tone':        ['lower', 'glutes', 'push', 'pull', 'core'],
  'mobility':    ['lower', 'core', 'push', 'pull'],
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

  // Within a slot: prefer the user's equipment, then goal match.
  const sortSlot = arr => arr.slice().sort((a, b) => {
    const aw = (hasEquip && a.type === 'weights') ? 1 : 0;
    const bw = (hasEquip && b.type === 'weights') ? 1 : 0;
    if (aw !== bw) return bw - aw;
    const ag = matchesGoal(a) ? 1 : 0;
    const bg = matchesGoal(b) ? 1 : 0;
    if (ag !== bg) return bg - ag;
    return 0;
  });

  const slots = SLOTS[pg] || SLOTS.tone;
  const used = new Set();
  const circuit = [];

  for (const cat of slots) {
    const pick = sortSlot((byCat[cat] || []).filter(e => !used.has(e.slug)))[0];
    if (pick) { used.add(pick.slug); circuit.push(pick); }
  }

  // Guarantee at least 5 exercises, filling from all categories by preference.
  if (circuit.length < 5) {
    const all = Object.values(byCat).flat();
    for (const ex of sortSlot(all)) {
      if (circuit.length >= 5) break;
      if (!used.has(ex.slug)) { used.add(ex.slug); circuit.push(ex); }
    }
  }

  const equipNames = equipment.length
    ? equipment.map(equipmentLabel).join(' & ')
    : 'Corpo libero';

  return {
    name: `Piano ${goalLabel(pg)} · ${equipNames}`,
    rounds: params.rounds,
    restBetweenEx: params.restEx,
    restBetweenRounds: params.restRounds,
    warmup: WARMUP.map(s => exFromLib(s)),
    circuit: circuit.map(ex => exFromLib(ex.slug)),
    cooldown: COOLDOWN.map(s => exFromLib(s)),
  };
}
