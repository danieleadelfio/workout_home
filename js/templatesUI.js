// ════════════════════════════════════════════════════════════════════════════
// TEMPLATES UI — gallery of predefined workouts, sorted by relevance to the
// user's profile. "Usa questo template" loads it into the current config.
// ════════════════════════════════════════════════════════════════════════════

import { TEMPLATES, scoreTemplate } from './data/templates.js';
import { GOALS, EQUIPMENT, ZONES, goalLabel, equipmentLabel, zoneLabel } from './data/taxonomy.js';
import { getProfile, setConfig } from './store.js';
import { configFromTemplate } from './state.js';
import { showScreen } from './navigation.js';
import { tplName, tplDesc } from './data/i18n-content.js';
import { t } from './i18n.js';
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
    return go ? badge(goalLabel(g), go.color) : '';
  }).join('');
  const eqLabel = tpl.equipment.map(e => equipmentLabel(e)).join(' · ');
  const zone = ZONES[tpl.zone];
  const totalEx = tpl.circuit.length;

  return `<div class="tpl-card ${recommended ? 'tpl-reco' : ''}">
    ${recommended ? `<div class="tpl-flag">${t('tpl.flag')}</div>` : ''}
    <div class="tpl-head">
      <h3>${esc(tplName(tpl))}</h3>
      ${zone ? `<span class="tpl-zone">${zone.icon} ${zoneLabel(tpl.zone)}</span>` : ''}
    </div>
    <p class="tpl-desc">${esc(tplDesc(tpl))}</p>
    <div class="tpl-badges">${goalBadges}</div>
    <div class="tpl-meta">
      <span>${t('tpl.rounds', { n: tpl.rounds })}</span>
      <span>${t('tpl.exercises', { n: totalEx })}</span>
      <span>🧰 ${esc(eqLabel)}</span>
    </div>
    <button class="btn btn-accent tpl-use" data-tpl="${tpl.id}" type="button">${t('tpl.use')}</button>
  </div>`;
}

function render() {
  const profile = getProfile();
  const scored = TEMPLATES
    .map(tpl => ({ t: tpl, s: scoreTemplate(tpl, profile) }))
    .sort((a, b) => b.s - a.s);

  const reco = scored.filter(x => x.s > 0);
  const others = scored.filter(x => x.s <= 0 && x.s !== -1);
  const locked = scored.filter(x => x.s === -1);

  let html = '';
  if (reco.length) {
    html += `<h2 class="tpl-section">${t('tpl.recommended')}</h2>
      <div class="tpl-grid">${reco.map(x => card(x.t, true)).join('')}</div>`;
  }
  if (others.length) {
    html += `<h2 class="tpl-section">${t('tpl.others')}</h2>
      <div class="tpl-grid">${others.map(x => card(x.t, false)).join('')}</div>`;
  }
  if (locked.length) {
    html += `<h2 class="tpl-section">${t('tpl.locked')}</h2>
      <div class="tpl-grid tpl-grid-locked">${locked.map(x => card(x.t, false)).join('')}</div>`;
  }
  $('templatesBody').innerHTML = html;
}

export function initTemplates() {
  $('templatesBody').addEventListener('click', (e) => {
    const btn = e.target.closest('.tpl-use');
    if (!btn) return;
    const tpl = TEMPLATES.find(x => x.id === btn.dataset.tpl);
    if (!tpl) return;
    setConfig(configFromTemplate(tpl));
    if (onApply) onApply();
    showScreen('home');
  });
}
