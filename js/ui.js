// ════════════════════════════════════════════════════════════════════════════
// UI — home screen rendering (stats, profile summary) + done screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, getProfile } from './store.js';
import { GOALS, EQUIPMENT, goalLabel, equipmentLabel } from './data/taxonomy.js';
import { stepName, localizedConfigName } from './data/i18n-content.js';
import { t } from './i18n.js';
import { esc, $ } from './util.js';

// Which home phases are currently expanded (kept across re-renders).
const expandedPhases = new Set();

export function updateHome() {
  const cfg = getConfig();
  const ws = cfg.warmup.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.warmup.length - 1) * cfg.restBetweenEx;
  const cpr = cfg.circuit.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.circuit.length - 1) * cfg.restBetweenEx;
  const ct = cpr * cfg.rounds + Math.max(0, cfg.rounds - 1) * cfg.restBetweenRounds;
  const cs = cfg.cooldown.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.cooldown.length - 1) * cfg.restBetweenEx;
  const tot = Math.round((ws + ct + cs) / 60);

  $('homeWorkoutName').textContent = localizedConfigName(cfg) || t('common.workout');
  $('statDur').textContent = tot + "'";
  $('statRounds').textContent = cfg.rounds;
  $('statEx').textContent = cfg.circuit.length;
  $('homeSub').textContent = t('home.sub', { rounds: cfg.rounds, n: cfg.circuit.length });

  renderPhases(cfg, ws, ct, cs);
  renderProfileSummary();
}

// Format the per-set target for one exercise step. Rounds are the sets, so we
// show just the reps (strength) or the duration (timed/hold), never "sets ×".
function exMeta(s) {
  if (s.reps > 0) return t('unit.reps', { n: s.reps });
  return t('unit.secs', { n: s.secs });
}

function phaseExercises(list) {
  return list.map(s => `
    <div class="phase-ex">
      <span class="phase-ex-name">${esc(stepName(s))}</span>
      <span class="phase-ex-meta">${esc(exMeta(s))}</span>
    </div>`).join('');
}

function renderPhases(cfg, ws, ct, cs) {
  const el = $('homePhases');
  if (!el) return;
  const phases = [
    { key: 'warmup', name: t('phase.warmup'), color: 'var(--accent2)', list: cfg.warmup,
      sub: t('phase.warmupSub', { n: cfg.warmup.length, m: Math.round(ws / 60) }), dur: Math.round(ws / 60), note: '' },
    { key: 'circuit', name: t('phase.circuit'), color: 'var(--accent)', list: cfg.circuit,
      sub: t('phase.circuitSub', { rounds: cfg.rounds, n: cfg.circuit.length }), dur: Math.round(ct / 60),
      note: t('phase.circuitNote', { rounds: cfg.rounds }) },
    { key: 'cooldown', name: t('phase.cooldown'), color: 'var(--success)', list: cfg.cooldown,
      sub: t('phase.cooldownSub', { n: cfg.cooldown.length }), dur: Math.round(cs / 60), note: '' },
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
        ${phaseExercises(p.list)}
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
    ? `<div class="psum-row">${goals}</div><div class="psum-row">${equip}</div>`
    : `<div class="muted">${t('home.noProfile')}</div>`;
}
