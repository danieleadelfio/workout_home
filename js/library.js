// ════════════════════════════════════════════════════════════════════════════
// LIBRARY — exercise picker modal. Tabs: Corpo libero / Pesi.
// Filters by goal and (for weights) equipment. Marks exercises that need
// equipment the user doesn't own. Each card has a YouTube preview thumbnail.
// ════════════════════════════════════════════════════════════════════════════

import { EXERCISE_LIBRARY } from './data/exercises.js';
import { GOALS, EQUIPMENT, MUSCLES } from './data/taxonomy.js';
import { getProfile } from './store.js';
import { thumbnailButton } from './video.js';
import { esc, exerciseDetail, $ } from './util.js';

let tab = 'bodyweight';       // 'bodyweight' | 'weights'
let goalFilter = '';          // '' = all
let equipFilter = '';         // '' = all (weights only)
let onPick = null;            // callback(exercise) when "Aggiungi" tapped

export function openLibrary(onPickCb) {
  onPick = onPickCb;
  tab = 'bodyweight'; goalFilter = ''; equipFilter = '';
  render();
  $('libraryModal').classList.add('open');
}

export function closeLibrary() {
  $('libraryModal').classList.remove('open');
}

function ownsEquipment(ex) {
  const owned = new Set(['none', ...(getProfile().equipment || [])]);
  return ex.equipment.every(e => owned.has(e));
}

function filtered() {
  return EXERCISE_LIBRARY.filter(ex => {
    if (ex.type !== tab) return false;
    if (goalFilter && !ex.goals.includes(goalFilter)) return false;
    if (tab === 'weights' && equipFilter && !ex.equipment.includes(equipFilter)) return false;
    return true;
  });
}

function card(ex) {
  const owned = ownsEquipment(ex);
  const missing = ex.equipment.filter(e => e !== 'none' && !new Set(getProfile().equipment || []).has(e));
  const muscleTags = ex.muscles.map(m => `<span class="lib-tag">${MUSCLES[m] || m}</span>`).join('');
  return `<div class="lib-card ${owned ? '' : 'lib-locked'}">
    ${thumbnailButton(ex.video, ex.name, { small: true })}
    <div class="lib-info">
      <div class="lib-name">${esc(ex.name)}</div>
      <div class="lib-detail">${exerciseDetail({ ...ex, isRest: false })}</div>
      <div class="lib-tags">${muscleTags}</div>
      ${!owned ? `<div class="lib-missing">Richiede: ${missing.map(e => EQUIPMENT[e]?.label || e).join(', ')}</div>` : ''}
    </div>
    <button class="lib-add" data-slug="${ex.slug}" type="button" title="Aggiungi">+</button>
  </div>`;
}

function render() {
  // Tabs
  $('libTabBody').classList.toggle('on', tab === 'bodyweight');
  $('libTabWeights').classList.toggle('on', tab === 'weights');

  // Goal filter chips
  const goalChips = ['', ...Object.keys(GOALS)].map(g => {
    const label = g === '' ? 'Tutti' : GOALS[g].label;
    const on = goalFilter === g;
    return `<button class="filter-chip ${on ? 'on' : ''}" data-goal="${g}" type="button">${label}</button>`;
  }).join('');
  $('libGoalFilters').innerHTML = goalChips;

  // Equipment filter (weights tab only)
  const equipWrap = $('libEquipFilters');
  if (tab === 'weights') {
    equipWrap.style.display = '';
    const used = [...new Set(EXERCISE_LIBRARY.filter(e => e.type === 'weights')
      .flatMap(e => e.equipment).filter(e => e !== 'none'))];
    equipWrap.innerHTML = ['', ...used].map(eq => {
      const label = eq === '' ? 'Tutti gli attrezzi' : (EQUIPMENT[eq]?.label || eq);
      const on = equipFilter === eq;
      return `<button class="filter-chip ${on ? 'on' : ''}" data-equip="${eq}" type="button">${label}</button>`;
    }).join('');
  } else {
    equipWrap.style.display = 'none';
    equipFilter = '';
  }

  const list = filtered();
  $('libList').innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="muted" style="padding:24px;text-align:center">Nessun esercizio con questi filtri.</p>';
}

export function initLibrary() {
  $('libTabBody').addEventListener('click', () => { tab = 'bodyweight'; render(); });
  $('libTabWeights').addEventListener('click', () => { tab = 'weights'; render(); });
  $('libGoalFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-goal]'); if (!b) return;
    goalFilter = b.dataset.goal; render();
  });
  $('libEquipFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-equip]'); if (!b) return;
    equipFilter = b.dataset.equip; render();
  });
  $('libList').addEventListener('click', (e) => {
    const b = e.target.closest('.lib-add'); if (!b) return;
    const ex = EXERCISE_LIBRARY.find(x => x.slug === b.dataset.slug);
    if (ex && onPick) onPick(ex);
    // brief visual feedback
    b.textContent = '✓'; b.classList.add('added');
    setTimeout(() => { b.textContent = '+'; b.classList.remove('added'); }, 700);
  });
  $('libClose').addEventListener('click', closeLibrary);
  $('libraryModal').addEventListener('click', (e) => {
    if (e.target.id === 'libraryModal') closeLibrary();
  });
}
