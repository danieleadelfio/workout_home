// ════════════════════════════════════════════════════════════════════════════
// UI — home screen rendering (stats, profile summary) + done screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, getProfile } from './store.js';
import { GOALS, EQUIPMENT, LEVELS, goalLabel, equipmentLabel, levelLabel } from './data/taxonomy.js';
import { stepName, localizedConfigName } from './data/i18n-content.js';
import { t } from './i18n.js';
import { esc, $ } from './util.js';

// Which home phases are currently expanded (kept across re-renders).
const expandedPhases = new Set();

export function updateHome() {
  const cfg = getConfig();
  const ss = !!cfg.straightSets;
  const restSet = ss ? (cfg.restBetweenSets ?? 30) : cfg.restBetweenEx;

  const ws = cfg.warmup.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.warmup.length - 1) * restSet;
  const cs = cfg.cooldown.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.cooldown.length - 1) * restSet;

  let ct;
  if (ss) {
    // Straight sets: each exercise = sets × work + rests between sets, then a
    // longer rest before the next exercise.
    ct = 0;
    cfg.circuit.forEach((s, i) => {
      const sets = Math.max(1, s.sets || 1);
      ct += sets * s.secs + Math.max(0, sets - 1) * restSet;
      if (i < cfg.circuit.length - 1) ct += cfg.restBetweenEx;
    });
  } else {
    const cpr = cfg.circuit.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.circuit.length - 1) * cfg.restBetweenEx;
    ct = cpr * cfg.rounds + Math.max(0, cfg.rounds - 1) * cfg.restBetweenRounds;
  }
  const tot = Math.round((ws + ct + cs) / 60);
  const totalSets = cfg.circuit.reduce((a, s) => a + Math.max(1, s.sets || 1), 0);

  $('homeWorkoutName').textContent = localizedConfigName(cfg) || t('common.workout');
  $('statDur').textContent = tot + "'";
  $('statRounds').textContent = ss ? totalSets : cfg.rounds;
  $('statEx').textContent = cfg.circuit.length;
  const roundsLbl = $('statRounds').nextElementSibling;
  if (roundsLbl) roundsLbl.textContent = ss ? t('home.stat.sets') : t('home.stat.rounds');
  $('homeSub').textContent = ss
    ? t('home.subSets', { sets: totalSets, n: cfg.circuit.length })
    : t('home.sub', { rounds: cfg.rounds, n: cfg.circuit.length });

  renderPhases(cfg, ws, ct, cs, ss);
  renderProfileSummary();
}

// Format the per-set target for one exercise step. In circuit mode each round is
// a set, so we show just the reps/duration. In straight-sets mode we prefix the
// number of sets (e.g. "4 × 10 rip").
function exMeta(s, sets) {
  const base = s.reps > 0 ? t('unit.reps', { n: s.reps }) : t('unit.secs', { n: s.secs });
  if (sets && (s.sets || 1) > 1) return `${s.sets} × ${base}`;
  return base;
}

function phaseExercises(list, sets) {
  return list.map(s => `
    <div class="phase-ex">
      <span class="phase-ex-name">${esc(stepName(s))}</span>
      <span class="phase-ex-meta">${esc(exMeta(s, sets))}</span>
    </div>`).join('');
}

function renderPhases(cfg, ws, ct, cs, ss) {
  const el = $('homePhases');
  if (!el) return;
  const circuitSub = ss
    ? t('phase.circuitSetsSub', { n: cfg.circuit.length })
    : t('phase.circuitSub', { rounds: cfg.rounds, n: cfg.circuit.length });
  const circuitNote = ss ? t('phase.setsNote') : t('phase.circuitNote', { rounds: cfg.rounds });
  const phases = [
    { key: 'warmup', name: t('phase.warmup'), color: 'var(--accent2)', list: cfg.warmup,
      sub: t('phase.warmupSub', { n: cfg.warmup.length, m: Math.round(ws / 60) }), dur: Math.round(ws / 60), note: '', sets: false },
    { key: 'circuit', name: t('phase.circuit'), color: 'var(--accent)', list: cfg.circuit,
      sub: circuitSub, dur: Math.round(ct / 60), note: circuitNote, sets: ss },
    { key: 'cooldown', name: t('phase.cooldown'), color: 'var(--success)', list: cfg.cooldown,
      sub: t('phase.cooldownSub', { n: cfg.cooldown.length }), dur: Math.round(cs / 60), note: '', sets: false },
  ];

  el.innerHTML = phases.map(p => `
    <div class="phase${expandedPhases.has(p.key) ? ' open' : ''}" data-phase="${p.key}">
      <button class="phase-item" type="button">
        <div class="phase-dot" style="background:${p.color}"></div>
        <div class="phase-text">
          <div class="phase-name">${p.name}</div>
          <div class="phase-sub">${esc(p.sub)}</div>
        </div>
        <div class="phase-dur">${p.dur}'</div>
        <div class="phase-caret">▾</div>
      </button>
      <div class="phase-detail">
        ${p.note ? `<div class="phase-rounds">🔁 ${esc(p.note)}</div>` : ''}
        ${phaseExercises(p.list, p.sets)}
      </div>
    </div>`).join('');

  el.querySelectorAll('.phase-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.phase');
      const key = wrap.dataset.phase;
      if (expandedPhases.has(key)) expandedPhases.delete(key);
      else expandedPhases.add(key);
      wrap.classList.toggle('open');
    });
  });
}


function renderProfileSummary() {
  const p = getProfile();
  const lvId = LEVELS[p.level] ? p.level : 'base';
  const lv = LEVELS[lvId];
  const levelChip = `<span class="psum-chip" style="border-color:${lv.color};color:${lv.color}">${lv.icon} ${levelLabel(lvId)}</span>`;
  const goals = (p.goals || []).map(g => {
    const go = GOALS[g];
    return go ? `<span class="psum-chip" style="border-color:${go.color};color:${go.color}">${go.icon} ${goalLabel(g)}</span>` : '';
  }).join('');
  const equip = ['none', ...(p.equipment || [])].map(e => {
    const eq = EQUIPMENT[e];
    return eq ? `<span class="psum-chip psum-eq">${eq.icon} ${equipmentLabel(e)}</span>` : '';
  }).join('');
  const el = $('profileSummary');
  if (!el) return;
  el.innerHTML = goals || equip
    ? `<div class="psum-row">${levelChip}${goals}</div><div class="psum-row">${equip}</div>`
    : `<div class="muted">${t('home.noProfile')}</div>`;
}
