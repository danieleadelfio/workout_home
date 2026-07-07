// ════════════════════════════════════════════════════════════════════════════
// STATE — persistence of user profile and current workout config.
// Each browser/device keeps its own copy (localStorage). Nothing is shared.
// ════════════════════════════════════════════════════════════════════════════

import { EXERCISE_BY_SLUG } from './data/exercises.js';

const PROFILE_KEY = 'workoutProfile';
const CONFIG_KEY  = 'workoutConfig';
const FAVORITES_KEY = 'workoutFavorites';

// ─── Default workout (bodyweight full body) ─────────────────────────────────
export const DEFAULT_CONFIG = {
  name: 'Allenamento corpo libero',
  rounds: 3,
  restBetweenEx: 20,
  restBetweenRounds: 75,
  warmup: [
    exFromLib('high-knees', { secs: 60, sets: 0, reps: 0 }),
    exFromLib('shoulder-stretch', { name: 'Rotazioni spalle e collo', secs: 60 }),
    exFromLib('lateral-lunges', { name: 'Leg swing', secs: 60, sets: 0, reps: 0 }),
    exFromLib('squat', { name: 'Squat lentissimi', secs: 60, sets: 0, reps: 0 }),
    exFromLib('jumping-jack', { name: 'Jumping jack leggeri', secs: 60 }),
  ],
  circuit: [
    exFromLib('squat'),
    exFromLib('pushup'),
    exFromLib('lunges'),
    exFromLib('plank'),
    exFromLib('glute-bridge'),
  ],
  cooldown: [
    exFromLib('quad-stretch'),
    exFromLib('hamstring-stretch', { name: 'Stretching polpacci' }),
    exFromLib('chest-stretch'),
    exFromLib('shoulder-stretch'),
    exFromLib('deep-breathing', { name: 'Respirazione profonda' }),
  ],
};

// Build a config exercise object from a library slug, with optional overrides.
function exFromLib(slug, overrides = {}) {
  const e = EXERCISE_BY_SLUG[slug];
  const base = e
    ? { name: e.name, sets: e.sets, reps: e.reps, secs: e.secs, tip: e.tip, video: e.video, slug: e.slug }
    : { name: slug, sets: 0, reps: 0, secs: 40, tip: '', video: '', slug };
  return { ...base, ...overrides };
}

export { exFromLib };

// ─── Profile ────────────────────────────────────────────────────────────────
// { equipment: string[], goals: string[], level: string, onboarded: boolean }
export function loadProfile() {
  try {
    const s = localStorage.getItem(PROFILE_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return { equipment: [], goals: [], level: 'base', onboarded: false };
}

export function saveProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) {}
}

// ─── Config ──────────────────────────────────────────────────────────────────
export function loadConfig() {
  try {
    const s = localStorage.getItem(CONFIG_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return deepClone(DEFAULT_CONFIG);
}

export function saveConfig(config) {
  try { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); } catch (e) {}
}

export function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

// ─── Favorites ───────────────────────────────────────────────────────────────
// [{ id, name, config, createdAt }]
export function loadFavorites() {
  try {
    const s = localStorage.getItem(FAVORITES_KEY);
    if (s) return JSON.parse(s);
  } catch (e) {}
  return [];
}

export function saveFavorites(list) {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(list)); } catch (e) {}
}

// Build a runnable config from a template definition.
export function configFromTemplate(tpl) {
  const map = arr => arr.map(slug => exFromLib(slug));
  return {
    name: tpl.name,
    templateId: tpl.id,
    rounds: tpl.rounds,
    restBetweenEx: tpl.restBetweenEx,
    restBetweenRounds: tpl.restBetweenRounds,
    warmup: map(tpl.warmup),
    circuit: map(tpl.circuit),
    cooldown: map(tpl.cooldown),
  };
}

// Build a runnable config from one day of a program (scheda). Program days
// already carry fully-formed exercise objects (built with exFromLib), so we
// simply clone them and record the program + day for localized naming.
export function configFromProgramDay(program, dayIndex) {
  const day = program.days[dayIndex];
  const clone = arr => (arr || []).map(x => ({ ...x }));
  return {
    name: `${program.name} · ${day.name}`,
    programId: program.id,
    programDay: dayIndex,
    rounds: day.rounds,
    restBetweenEx: day.restBetweenEx,
    restBetweenRounds: day.restBetweenRounds,
    warmup: clone(day.warmup),
    circuit: clone(day.circuit),
    cooldown: clone(day.cooldown),
  };
}

