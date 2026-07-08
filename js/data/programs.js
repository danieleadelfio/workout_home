// ════════════════════════════════════════════════════════════════════════════
// PROGRAMS (SCHEDE) — structured multi-day training plans. Unlike a single
// template, a program groups several DAYS, each of which is a full runnable
// session (warm-up · circuit · cool-down). Picking a day loads it as the
// current workout, exactly like a template.
// Model: { id, name, desc, goals, level, equipment, daysPerWeek, days[] }
//   equipment : array of equipment ids required to run it (['none'] = bodyweight)
//   level     : suggested fitness level ('base' | 'intermediate' | 'advanced')
//   days[]    : { id, name, focus, restBetweenSets, restBetweenEx,
//                 warmup[], circuit[], cooldown[] } — same shape as a config.
// A program day runs as STRAIGHT SETS: each circuit exercise is performed for
// all of its sets in a row (rep-based sets are untimed — you press Next when you
// finish the reps), with a short rest between sets and a longer rest before the
// next exercise.
// ════════════════════════════════════════════════════════════════════════════

import { LEVEL_RANK } from './taxonomy.js';
import { exFromLib } from '../state.js';

export const PROGRAMS = [

  {
    id: 'prog-4day-upperlower-core',
    name: 'Scheda 4 Giorni · Upper/Lower + Core',
    desc: 'Split settimanale su 4 giorni: due sedute per la parte alta (spinta e trazione), una dedicata alle gambe in mantenimento e una full body metabolica. Core e cardio in ogni allenamento.',
    goals: ['hypertrophy', 'tone', 'fat-loss'],
    level: 'intermediate',
    equipment: ['gym', 'dumbbell', 'barbell'],
    daysPerWeek: 4,
    days: [

      // ─── GIORNO 1 · UPPER PUSH + CORE ───
      {
        id: 'd1',
        name: 'Giorno 1 · Upper Push + Core',
        focus: 'Spinta parte alta',
        restBetweenSets: 30, restBetweenEx: 60,
        warmup: [
          exFromLib('high-knees', { secs: 60 }),
          exFromLib('world-greatest-stretch', { secs: 50 }),
          exFromLib('shoulder-stretch', { secs: 45 }),
        ],
        circuit: [
          exFromLib('bb-bench-press', { sets: 4, reps: 10, secs: 60 }),
          exFromLib('db-shoulder-press', { sets: 3, reps: 10, secs: 55 }),
          exFromLib('cable-fly', { sets: 3, reps: 12, secs: 50 }),
          exFromLib('cable-tricep-pushdown', { sets: 3, reps: 12, secs: 45 }),
          exFromLib('plank', { sets: 3, reps: 0, secs: 45 }),
          exFromLib('cable-crunch', { sets: 3, reps: 15, secs: 45 }),
        ],
        cooldown: [
          exFromLib('cardio-steady', { secs: 1080 }),
          exFromLib('chest-stretch'),
          exFromLib('shoulder-stretch'),
          exFromLib('deep-breathing'),
        ],
      },

      // ─── GIORNO 2 · UPPER PULL + CORE ───
      {
        id: 'd2',
        name: 'Giorno 2 · Upper Pull + Core',
        focus: 'Trazione parte alta',
        restBetweenSets: 30, restBetweenEx: 60,
        warmup: [
          exFromLib('high-knees', { secs: 60 }),
          exFromLib('world-greatest-stretch', { secs: 50 }),
          exFromLib('shoulder-stretch', { secs: 45 }),
        ],
        circuit: [
          exFromLib('lat-pulldown', { sets: 4, reps: 10, secs: 55 }),
          exFromLib('db-row', { sets: 3, reps: 10, secs: 55 }),
          exFromLib('seated-cable-row', { sets: 3, reps: 12, secs: 55 }),
          exFromLib('db-bicep-curl', { sets: 3, reps: 12, secs: 45 }),
          exFromLib('russian-twist', { sets: 3, reps: 15, secs: 45 }),
          exFromLib('mountain-climber', { sets: 3, reps: 0, secs: 30 }),
        ],
        cooldown: [
          exFromLib('cardio-steady', { secs: 1080 }),
          exFromLib('hamstring-stretch'),
          exFromLib('shoulder-stretch'),
          exFromLib('deep-breathing'),
        ],
      },

      // ─── GIORNO 3 · GAMBE (MANTENIMENTO) + CORE ───
      {
        id: 'd3',
        name: 'Giorno 3 · Gambe + Core',
        focus: 'Gambe (mantenimento)',
        restBetweenSets: 30, restBetweenEx: 60,
        warmup: [
          exFromLib('high-knees', { secs: 60 }),
          exFromLib('lateral-lunges', { secs: 60 }),
          exFromLib('world-greatest-stretch', { secs: 50 }),
        ],
        circuit: [
          exFromLib('bb-back-squat', { sets: 3, reps: 8, secs: 60 }),
          exFromLib('db-romanian-deadlift', { sets: 3, reps: 10, secs: 55 }),
          exFromLib('leg-curl', { sets: 2, reps: 12, secs: 50 }),
          exFromLib('bb-hip-thrust', { sets: 3, reps: 12, secs: 60 }),
          exFromLib('sit-up', { sets: 3, reps: 15, secs: 45 }),
        ],
        cooldown: [
          exFromLib('cardio-steady', { secs: 1200 }),
          exFromLib('quad-stretch'),
          exFromLib('hamstring-stretch'),
          exFromLib('deep-breathing'),
        ],
      },

      // ─── GIORNO 4 · FULL BODY METABOLICO + CORE ───
      {
        id: 'd4',
        name: 'Giorno 4 · Full Body Metabolico + Core',
        focus: 'Circuito metabolico',
        restBetweenSets: 30, restBetweenEx: 60,
        warmup: [
          exFromLib('jumping-jack', { secs: 45 }),
          exFromLib('world-greatest-stretch', { secs: 50 }),
        ],
        circuit: [
          exFromLib('db-goblet-squat', { sets: 4, reps: 15, secs: 45 }),
          exFromLib('pushup', { sets: 4, reps: 12, secs: 40 }),
          exFromLib('db-row', { sets: 4, reps: 12, secs: 40 }),
          exFromLib('db-lunges', { sets: 4, reps: 12, secs: 45 }),
          exFromLib('plank', { sets: 4, reps: 0, secs: 45 }),
          exFromLib('ab-wheel', { sets: 3, reps: 12, secs: 45 }),
        ],
        cooldown: [
          exFromLib('cardio-hiit', { secs: 1200 }),
          exFromLib('quad-stretch'),
          exFromLib('chest-stretch'),
          exFromLib('deep-breathing'),
        ],
      },

    ],
  },

];

export const PROGRAM_BY_ID = Object.fromEntries(PROGRAMS.map(p => [p.id, p]));

// Evaluate a program against a user profile (equipment + goals + level).
// Mirrors evalTemplate so the schede gallery can bucket / lock programs the
// same way the templates gallery does.
//   canRun    : the user owns every piece of equipment the program needs
//   goalMatch : the program targets at least one of the user's goals
//   levelOk   : the program is not harder than the user's chosen level
//   score     : ranking weight (higher = better match), only meaningful if canRun
export function evalProgram(prog, profile) {
  const ownedEquip = new Set(['none', ...(profile.equipment || [])]);
  const canRun = prog.equipment.every(e => ownedEquip.has(e));

  const userGoals = new Set(profile.goals || []);
  const goalMatch = prog.goals.some(g => userGoals.has(g));

  const userRank = LEVEL_RANK[profile.level] || LEVEL_RANK.intermediate;
  const progRank = LEVEL_RANK[prog.level] || LEVEL_RANK.intermediate;
  const levelOk = progRank <= userRank;

  let score = 0;
  prog.goals.forEach(g => { if (userGoals.has(g)) score += 10; });
  prog.equipment.forEach(e => { if (e !== 'none' && ownedEquip.has(e)) score += 3; });

  return { canRun, goalMatch, levelOk, score };
}
