// ════════════════════════════════════════════════════════════════════════════
// FAVORITES — save the current workout and reuse saved ones. Uses an inline
// name field (no prompt(), which is blocked in iOS standalone PWAs).
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, setConfig, getFavorites, addFavorite, removeFavorite } from './store.js';
import { deepClone } from './state.js';
import { showScreen } from './navigation.js';
import { localizedConfigName } from './data/i18n-content.js';
import { t } from './i18n.js';
import { esc, $ } from './util.js';

let onApply = null;

export function openFavorites(onApplyCb) {
  onApply = onApplyCb || null;
  render();
  showScreen('favorites');
}

function estMinutes(cfg) {
  const ss = !!cfg.straightSets;
  const restSet = ss ? (cfg.restBetweenSets ?? 30) : cfg.restBetweenEx;
  const ws = cfg.warmup.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.warmup.length - 1) * restSet;
  const cs = cfg.cooldown.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.cooldown.length - 1) * restSet;
  let ct;
  if (ss) {
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
  return Math.round((ws + ct + cs) / 60);
}

function favCard(f) {
  const c = f.config;
  const meta = c.straightSets
    ? t('fav.metaSets', { min: estMinutes(c), sets: c.circuit.reduce((a, s) => a + Math.max(1, s.sets || 1), 0), ex: c.circuit.length })
    : t('fav.meta', { min: estMinutes(c), rounds: c.rounds, ex: c.circuit.length });
  return `<div class="fav-card">
    <div class="fav-info">
      <div class="fav-name">${esc(f.name)}</div>
      <div class="fav-meta">${meta}</div>
    </div>
    <button class="fav-use" data-use="${f.id}" type="button">${t('common.use')}</button>
    <button class="fav-del" data-del="${f.id}" type="button" title="${t('common.delete')}">🗑</button>
  </div>`;
}

function render() {
  const cfg = getConfig();
  $('favName').value = localizedConfigName(cfg) || t('common.workout');

  const favs = getFavorites();
  $('favList').innerHTML = favs.length
    ? favs.map(favCard).join('')
    : `<p class="muted" style="padding:24px 8px;text-align:center">${t('fav.empty')}</p>`;
}

export function initFavorites() {
  $('favSave').addEventListener('click', () => {
    const name = $('favName').value.trim();
    addFavorite(name, getConfig());
    render();
    const btn = $('favSave');
    const prev = btn.textContent;
    btn.textContent = t('fav.saved');
    setTimeout(() => { btn.textContent = prev; }, 1100);
  });

  $('favList').addEventListener('click', (e) => {
    const use = e.target.closest('[data-use]');
    if (use) {
      const f = getFavorites().find(x => x.id === use.dataset.use);
      if (f) {
        setConfig(deepClone(f.config));
        if (onApply) onApply();
        showScreen('home');
      }
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      removeFavorite(del.dataset.del);
      render();
    }
  });
}
