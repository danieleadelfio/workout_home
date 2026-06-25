// ════════════════════════════════════════════════════════════════════════════
// TEMPLATES UI — gallery of predefined workouts, sorted by relevance to the
// user's profile. "Usa questo template" loads it into the current config.
// ════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, scoreTemplate } from './data/templates.js';
import { GOALS, EQUIPMENT, ZONES } from './data/taxonomy.js';
import { getProfile, setConfig } from './store.js';
import { configFromTemplate } from './state.js';
import { showScreen } from './navigation.js';
import { esc, $ } from './util.js';

let onApply = null;

export function openTemplates(onApplyCb) {
  onApply = onApplyCb || null;
  render();
  showScreen('templates');
}

function badge(text, color) {
  return `<span class="tpl-badge" style="border-color:${color};color:${color}">${esc(text)}</span>`;
}

function card(tpl, recommended) {
  const goalBadges = tpl.goals.map(g => {
    const go = GOALS[g];
    return go ? badge(go.label, go.color) : '';
  }).join('');
  const eqLabel = tpl.equipment.map(e => EQUIPMENT[e]?.label || e).join(' · ');
  const zone = ZONES[tpl.zone];
  const totalEx = tpl.circuit.length;

  return `<div class="tpl-card ${recommended ? 'tpl-reco' : ''}">
    ${recommended ? '<div class="tpl-flag">Consigliato per te</div>' : ''}
    <div class="tpl-head">
      <h3>${esc(tpl.name)}</h3>
      ${zone ? `<span class="tpl-zone">${zone.icon} ${zone.label}</span>` : ''}
    </div>
    <p class="tpl-desc">${esc(tpl.desc)}</p>
    <div class="tpl-badges">${goalBadges}</div>
    <div class="tpl-meta">
      <span>🔁 ${tpl.rounds} giri</span>
      <span>🏃 ${totalEx} esercizi</span>
      <span>🧰 ${esc(eqLabel)}</span>
    </div>
    <button class="btn btn-accent tpl-use" data-tpl="${tpl.id}" type="button">Usa questo template</button>
  </div>`;
}

function render() {
  const profile = getProfile();
  const scored = TEMPLATES
    .map(t => ({ t, s: scoreTemplate(t, profile) }))
    .sort((a, b) => b.s - a.s);

  const reco = scored.filter(x => x.s > 0);
  const others = scored.filter(x => x.s <= 0 && x.s !== -1);
  const locked = scored.filter(x => x.s === -1);

  let html = '';
  if (reco.length) {
    html += `<h2 class="tpl-section">⭐ Consigliati per te</h2>
      <div class="tpl-grid">${reco.map(x => card(x.t, true)).join('')}</div>`;
  }
  if (others.length) {
    html += `<h2 class="tpl-section">Altri allenamenti</h2>
      <div class="tpl-grid">${others.map(x => card(x.t, false)).join('')}</div>`;
  }
  if (locked.length) {
    html += `<h2 class="tpl-section">🔒 Richiedono altri attrezzi</h2>
      <div class="tpl-grid tpl-grid-locked">${locked.map(x => card(x.t, false)).join('')}</div>`;
  }
  $('templatesBody').innerHTML = html;
}

export function initTemplates() {
  $('templatesBody').addEventListener('click', (e) => {
    const btn = e.target.closest('.tpl-use');
    if (!btn) return;
    const tpl = TEMPLATES.find(t => t.id === btn.dataset.tpl);
    if (!tpl) return;
    setConfig(configFromTemplate(tpl));
    if (onApply) onApply();
    showScreen('home');
  });
}
