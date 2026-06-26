// ════════════════════════════════════════════════════════════════════════════
// UI — home screen rendering (stats, profile summary) + done screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, getProfile } from './store.js';
import { GOALS, EQUIPMENT } from './data/taxonomy.js';
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

  $('homeWorkoutName').textContent = cfg.name || 'Allenamento';
  $('statDur').textContent = tot + "'";
  $('statRounds').textContent = cfg.rounds;
  $('statEx').textContent = cfg.circuit.length;
  $('homeSub').textContent = `${cfg.rounds} giri · ${cfg.circuit.length} esercizi · a casa tua`;

  renderPhases(cfg, ws, ct, cs);
  renderProfileSummary();
}

// Format the "3×12 · 50s" line for a single exercise step.
function exMeta(s) {
  const parts = [];
  if (s.sets && s.reps) parts.push(`${s.sets}×${s.reps}`);
  else if (s.reps) parts.push(`${s.reps} rip`);
  if (s.secs) parts.push(`${s.secs}s`);
  return parts.join(' · ');
}

function phaseExercises(list) {
  return list.map(s => `
    <div class="phase-ex">
      <span class="phase-ex-name">${esc(s.name)}</span>
      <span class="phase-ex-meta">${esc(exMeta(s))}</span>
    </div>`).join('');
}

function renderPhases(cfg, ws, ct, cs) {
  const el = $('homePhases');
  if (!el) return;
  const phases = [
    { key: 'warmup', name: 'Riscaldamento', color: 'var(--accent2)', list: cfg.warmup,
      sub: `${cfg.warmup.length} esercizi · ~${Math.round(ws / 60)} min`, dur: Math.round(ws / 60), note: '' },
    { key: 'circuit', name: 'Circuito principale', color: 'var(--accent)', list: cfg.circuit,
      sub: `${cfg.rounds} giri × ${cfg.circuit.length} esercizi`, dur: Math.round(ct / 60),
      note: `Da ripetere per ${cfg.rounds} giri` },
    { key: 'cooldown', name: 'Defaticamento', color: 'var(--success)', list: cfg.cooldown,
      sub: `${cfg.cooldown.length} esercizi · stretching`, dur: Math.round(cs / 60), note: '' },
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
    return go ? `<span class="psum-chip" style="border-color:${go.color};color:${go.color}">${go.icon} ${go.label}</span>` : '';
  }).join('');
  const equip = ['none', ...(p.equipment || [])].map(e => {
    const eq = EQUIPMENT[e];
    return eq ? `<span class="psum-chip psum-eq">${eq.icon} ${eq.label}</span>` : '';
  }).join('');
  const el = $('profileSummary');
  if (!el) return;
  el.innerHTML = goals || equip
    ? `<div class="psum-row">${goals}</div><div class="psum-row">${equip}</div>`
    : '<div class="muted">Profilo non impostato</div>';
}
