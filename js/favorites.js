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
  const ws = cfg.warmup.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.warmup.length - 1) * cfg.restBetweenEx;
  const cpr = cfg.circuit.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.circuit.length - 1) * cfg.restBetweenEx;
  const ct = cpr * cfg.rounds + Math.max(0, cfg.rounds - 1) * cfg.restBetweenRounds;
  const cs = cfg.cooldown.reduce((a, s) => a + s.secs, 0) + Math.max(0, cfg.cooldown.length - 1) * cfg.restBetweenEx;
  return Math.round((ws + ct + cs) / 60);
}

function favCard(f) {
  const c = f.config;
  return `<div class="fav-card">
    <div class="fav-info">
      <div class="fav-name">${esc(f.name)}</div>
      <div class="fav-meta">${t('fav.meta', { min: estMinutes(c), rounds: c.rounds, ex: c.circuit.length })}</div>
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
