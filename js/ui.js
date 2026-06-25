// ════════════════════════════════════════════════════════════════════════════
// UI — home screen rendering (stats, profile summary) + done screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, getProfile } from './store.js';
import { GOALS, EQUIPMENT } from './data/taxonomy.js';
import { esc, $ } from './util.js';

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
  $('phWarmupSub').textContent = `${cfg.warmup.length} esercizi · ~${Math.round(ws / 60)} min`;
  $('phCircuitSub').textContent = `${cfg.rounds} giri × ${cfg.circuit.length} esercizi`;
  $('phCooldownSub').textContent = `${cfg.cooldown.length} esercizi · stretching`;
  $('phWarmupDur').textContent = Math.round(ws / 60) + "'";
  $('phCircuitDur').textContent = Math.round(ct / 60) + "'";
  $('phCooldownDur').textContent = Math.round(cs / 60) + "'";

  renderProfileSummary();
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
