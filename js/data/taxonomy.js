// ════════════════════════════════════════════════════════════════════════════
// TAXONOMY — equipment, goals, muscle zones. Single source of truth.
// ════════════════════════════════════════════════════════════════════════════

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

export function goalLabel(id) { return GOALS[id]?.label || id; }
export function equipmentLabel(id) { return EQUIPMENT[id]?.label || id; }
export function zoneLabel(id) { return ZONES[id]?.label || id; }

// Given a set of selected goals, return the set of goals that must be disabled.
export function conflictingGoals(selected) {
  const blocked = new Set();
  selected.forEach(g => (GOAL_CONFLICTS[g] || []).forEach(c => blocked.add(c)));
  return blocked;
}
