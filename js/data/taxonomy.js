// ════════════════════════════════════════════════════════════════════════════
// TAXONOMY — equipment, goals, muscle zones. Single source of truth.
// IT labels live inline on each entry; EN labels live in the *_EN maps below.
// The label helpers are language-aware (see getLang()).
// ════════════════════════════════════════════════════════════════════════════

import { getLang } from '../i18n.js';

export const EQUIPMENT = {
  none:       { id: 'none',       label: 'Corpo libero',  icon: '🤸', color: '#32d583' },
  dumbbell:   { id: 'dumbbell',   label: 'Manubri',       icon: '🏋️', color: '#ff5f2e' },
  barbell:    { id: 'barbell',    label: 'Bilanciere',    icon: '➖', color: '#ff9a00' },
  kettlebell: { id: 'kettlebell', label: 'Kettlebell',    icon: '🔔', color: '#e040fb' },
  band:       { id: 'band',       label: 'Elastici',      icon: '🎗️', color: '#4e9fff' },
  bench:      { id: 'bench',      label: 'Panca',         icon: '🛋️', color: '#7a7a8a' },
  pullupbar:  { id: 'pullupbar',  label: 'Sbarra',        icon: '🚪', color: '#00bcd4' },
};

// Equipment the user can SELECT in onboarding (everyone always has bodyweight)
export const SELECTABLE_EQUIPMENT = ['dumbbell', 'barbell', 'kettlebell', 'band', 'bench', 'pullupbar'];

export const GOALS = {
  'fat-loss':    { id: 'fat-loss',    label: 'Dimagrimento',  short: 'Brucia grassi',        icon: '🔥', color: '#ff5f2e' },
  'strength':    { id: 'strength',    label: 'Forza',         short: 'Più forte',            icon: '💪', color: '#ff9a00' },
  'hypertrophy': { id: 'hypertrophy', label: 'Massa',         short: 'Ipertrofia',           icon: '🧱', color: '#e040fb' },
  'tone':        { id: 'tone',        label: 'Tonificazione', short: 'Definizione',          icon: '✨', color: '#4e9fff' },
  'endurance':   { id: 'endurance',   label: 'Resistenza',    short: 'Cardio',               icon: '🫀', color: '#32d583' },
  'mobility':    { id: 'mobility',    label: 'Mobilità',      short: 'Flessibilità',         icon: '🧘', color: '#00bcd4' },
};

// Fitness levels — drive exercise complexity, volume and overall intensity.
// base         : never trained / getting back into movement → simple, low impact
// intermediate : trains regularly, fairly athletic → standard volume & complexity
// advanced     : very trained and athletic → hardest variants, max intensity
export const LEVELS = {
  base:         { id: 'base',         label: 'Base',      short: 'Riparti con calma',   icon: '🌱', color: '#32d583' },
  intermediate: { id: 'intermediate', label: 'Intermedio', short: 'Mediamente allenato', icon: '🔥', color: '#ff9a00' },
  advanced:     { id: 'advanced',     label: 'Avanzato',   short: 'Al limite',           icon: '⚡', color: '#ff5f2e' },
};
export const LEVEL_ORDER = ['base', 'intermediate', 'advanced'];

// Numeric rank for comparing levels (exercise difficulty / template demand).
export const LEVEL_RANK = { base: 1, intermediate: 2, advanced: 3 };

// Goals that cannot coexist (opposite physiological demands).
// When one is selected, the conflicting ones get disabled in the UI.
export const GOAL_CONFLICTS = {
  'fat-loss':    ['hypertrophy'],
  'hypertrophy': ['fat-loss'],
};

export const ZONES = {
  'full-body': { id: 'full-body', label: 'Full body',  icon: '🔄', color: '#ff5f2e' },
  'upper':     { id: 'upper',     label: 'Upper body', icon: '🙌', color: '#ff9a00' },
  'lower':     { id: 'lower',     label: 'Gambe',      icon: '🦵', color: '#4e9fff' },
  'core':      { id: 'core',      label: 'Core',       icon: '🎯', color: '#e040fb' },
  'glutes':    { id: 'glutes',    label: 'Glutei',     icon: '🍑', color: '#32d583' },
};

// Muscle group labels (for exercise cards)
export const MUSCLES = {
  legs:      'Gambe',
  glutes:    'Glutei',
  chest:     'Petto',
  back:      'Schiena',
  shoulders: 'Spalle',
  arms:      'Braccia',
  core:      'Core',
  cardio:    'Cardio',
  mobility:  'Mobilità',
  fullbody:  'Full body',
};

// Helpers ---------------------------------------------------------------------

// English labels keyed by id (IT labels live on the objects above).
const EQUIPMENT_EN = {
  none: 'Bodyweight', dumbbell: 'Dumbbells', barbell: 'Barbell',
  kettlebell: 'Kettlebell', band: 'Bands', bench: 'Bench', pullupbar: 'Pull-up bar',
};
const GOALS_EN = {
  'fat-loss':    { label: 'Fat loss',   short: 'Fat burn' },
  'strength':    { label: 'Strength',   short: 'Stronger' },
  'hypertrophy': { label: 'Muscle',     short: 'Hypertrophy' },
  'tone':        { label: 'Toning',     short: 'Definition' },
  'endurance':   { label: 'Endurance',  short: 'Cardio' },
  'mobility':    { label: 'Mobility',   short: 'Flexibility' },
};
const LEVELS_EN = {
  base:         { label: 'Beginner',     short: 'Ease back in' },
  intermediate: { label: 'Intermediate', short: 'Fairly trained' },
  advanced:     { label: 'Advanced',     short: 'To the limit' },
};
const ZONES_EN = {
  'full-body': 'Full body', 'upper': 'Upper body', 'lower': 'Legs',
  'core': 'Core', 'glutes': 'Glutes',
};
const MUSCLES_EN = {
  legs: 'Legs', glutes: 'Glutes', chest: 'Chest', back: 'Back', shoulders: 'Shoulders',
  arms: 'Arms', core: 'Core', cardio: 'Cardio', mobility: 'Mobility', fullbody: 'Full body',
};

const isEn = () => getLang() === 'en';

export function goalLabel(id) { return (isEn() && GOALS_EN[id]?.label) || GOALS[id]?.label || id; }
export function goalShort(id) { return (isEn() && GOALS_EN[id]?.short) || GOALS[id]?.short || id; }
export function equipmentLabel(id) { return (isEn() && EQUIPMENT_EN[id]) || EQUIPMENT[id]?.label || id; }
export function zoneLabel(id) { return (isEn() && ZONES_EN[id]) || ZONES[id]?.label || id; }
export function muscleLabel(id) { return (isEn() && MUSCLES_EN[id]) || MUSCLES[id] || id; }
export function levelLabel(id) { return (isEn() && LEVELS_EN[id]?.label) || LEVELS[id]?.label || id; }
export function levelShort(id) { return (isEn() && LEVELS_EN[id]?.short) || LEVELS[id]?.short || id; }

// Given a set of selected goals, return the set of goals that must be disabled.
export function conflictingGoals(selected) {
  const blocked = new Set();
  selected.forEach(g => (GOAL_CONFLICTS[g] || []).forEach(c => blocked.add(c)));
  return blocked;
}
