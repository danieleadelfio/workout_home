// ════════════════════════════════════════════════════════════════════════════
// EDITOR — customise the current workout: general settings + per-phase
// exercise lists with inline editing, reordering (touch drag) and an
// editable YouTube video field per exercise.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig, persistConfig } from './store.js';
import { DEFAULT_CONFIG, deepClone } from './state.js';
import { setConfig } from './store.js';
import { openLibrary } from './library.js';
import { thumbnailButton, parseYouTubeId } from './video.js';
import { stepName, stepTip } from './data/i18n-content.js';
import { t } from './i18n.js';
import { esc, $ } from './util.js';
import { showScreen } from './navigation.js';

let onChange = null;          // callback to refresh home stats

// Per-phase accent colour + i18n key for the section title.
const SEC_META = {
  warmup:   { key: 'phase.warmup',   color: 'var(--accent2)' },
  circuit:  { key: 'editor.circuit', color: 'var(--accent)'  },
  cooldown: { key: 'phase.cooldown', color: 'var(--success)' },
};

export function openEditor(onChangeCb) {
  onChange = onChangeCb || null;
  render();
  showScreen('editor');
}

function notify() { persistConfig(); if (onChange) onChange(); }

function render() {
  const cfg = getConfig();
  const body = $('edBody');
  body.innerHTML = '';

  // General settings
  const gl = document.createElement('div');
  gl.className = 'ed-section';
  gl.innerHTML = `<div class="ed-sec-hd" data-toggle>
      <div class="ed-sec-dot" style="background:#888"></div>
      <div class="ed-sec-title">${t('editor.general')}</div>
      <div class="ed-sec-caret open">&#9650;</div></div>
    <div class="ed-sec-body open">
      <div class="ed-frow"><div class="ed-flbl">${t('editor.name')}</div>
        <input class="ed-finp" type="text" value="${esc(cfg.name || '')}" data-gname></div>
      <div class="ed-globals">
        <div class="ed-global"><div class="ed-global-lbl">${t('editor.rounds')}</div>
          <input class="ed-global-inp" type="number" min="1" max="10" value="${cfg.rounds}" data-g="rounds">
          <div class="ed-global-unit">${t('editor.roundsUnit')}</div></div>
        <div class="ed-global"><div class="ed-global-lbl">${t('editor.restEx')}</div>
          <input class="ed-global-inp" type="number" min="5" max="120" value="${cfg.restBetweenEx}" data-g="restBetweenEx">
          <div class="ed-global-unit">${t('unit.sec')}</div></div>
        <div class="ed-global" style="grid-column:span 2"><div class="ed-global-lbl">${t('editor.restRounds')}</div>
          <input class="ed-global-inp" type="number" min="10" max="300" value="${cfg.restBetweenRounds}" data-g="restBetweenRounds">
          <div class="ed-global-unit">${t('unit.sec')}</div></div>
      </div></div>`;
  body.appendChild(gl);

  ['warmup', 'circuit', 'cooldown'].forEach(phase => {
    const meta = SEC_META[phase];
    const sec = document.createElement('div');
    sec.className = 'ed-section';
    sec.innerHTML = `<div class="ed-sec-hd" data-toggle>
        <div class="ed-sec-dot" style="background:${meta.color}"></div>
        <div class="ed-sec-title">${t(meta.key)}</div>
        <div class="ed-sec-count" id="count-${phase}"></div>
        <div class="ed-sec-caret">&#9650;</div></div>
      <div class="ed-sec-body">
        <div class="ed-list" id="list-${phase}"></div>
        <button class="ed-add" data-add="${phase}">${t('editor.addExercise')}</button></div>`;
    body.appendChild(sec);
    renderExList(phase);
  });
}

function detail(ex) {
  return ex.reps > 0
    ? `${t('unit.reps', { n: ex.reps })} · ${t('unit.secs', { n: ex.secs })}`
    : t('unit.secs', { n: ex.secs });
}

function renderExList(phase) {
  const cfg = getConfig();
  const listEl = $('list-' + phase);
  if (!listEl) return;
  const count = $('count-' + phase);
  if (count) count.textContent = cfg[phase].length;
  listEl.innerHTML = '';

  cfg[phase].forEach((ex, idx) => {
    const item = document.createElement('div');
    item.className = 'ed-item';
    item.dataset.idx = idx;
    item.dataset.phase = phase;
    item.innerHTML = `<div class="ed-item-row">
        <div class="drag-h" data-phase="${phase}" data-idx="${idx}">&#8942;</div>
        ${thumbnailButton(ex.video, stepName(ex), { small: true })}
        <div class="ed-item-info">
          <div class="ed-item-name">${esc(stepName(ex))}</div>
          <div class="ed-item-meta">${esc(detail(ex))}</div>
        </div>
        <button class="ed-item-edit" data-edit="${phase}:${idx}">&#9998;</button>
        <button class="ed-item-del" data-del="${phase}:${idx}">&times;</button>
      </div>
      <div class="ed-form" id="form-${phase}-${idx}">
        <div class="ed-frow"><div class="ed-flbl">${t('editor.name')}</div>
          <input class="ed-finp" type="text" value="${esc(stepName(ex))}" data-f="${phase}:${idx}:name"></div>
        <div class="ed-frow">
          <div class="ed-flbl">${t('editor.reps')}</div>
          <input class="ed-finp ed-finp-sm" type="number" min="0" max="200" value="${ex.reps}" data-f="${phase}:${idx}:reps">
          <div class="ed-flbl" style="width:60px">${t('editor.time')}</div>
          <input class="ed-finp ed-finp-sm" type="number" min="5" max="600" value="${ex.secs}" data-f="${phase}:${idx}:secs">
          <div class="ed-flbl" style="width:auto;flex:1">${t('unit.sec')}</div>
        </div>
        <div class="ed-frow"><div class="ed-flbl">${t('editor.tip')}</div>
          <input class="ed-finp" type="text" value="${esc(stepTip(ex) || '')}" data-f="${phase}:${idx}:tip"></div>
        <div class="ed-frow"><div class="ed-flbl">${t('editor.video')}</div>
          <input class="ed-finp" type="text" placeholder="${t('editor.videoPh')}" value="${esc(ex.video || '')}" data-f="${phase}:${idx}:video"></div>
      </div>`;
    listEl.appendChild(item);
  });
  initDnD(listEl, phase);
}

// ─── Drag & drop (touch) ─────────────────────────────────────────────────────
const dnd = { active: false, ghost: null, item: null, phase: null, fromIdx: -1, toIdx: -1, offsetY: 0 };

function initDnD(listEl, phase) {
  listEl.querySelectorAll('.drag-h').forEach(h => {
    h.addEventListener('touchstart', onDndStart, { passive: false });
    h.addEventListener('mousedown', onDndStartMouse);
  });
}

function startDrag(item, phase, idx, clientY) {
  const rect = item.getBoundingClientRect();
  const ghost = item.cloneNode(true);
  Object.assign(ghost.style, {
    position: 'fixed', left: rect.left + 'px', top: rect.top + 'px',
    width: rect.width + 'px', opacity: '0.9', zIndex: '999', pointerEvents: 'none',
    boxShadow: '0 8px 28px rgba(0,0,0,.6)', transform: 'scale(1.02)',
    borderRadius: '12px', background: '#2a2a38', border: '1px solid var(--accent)',
  });
  document.body.appendChild(ghost);
  item.style.opacity = '0.3';
  Object.assign(dnd, { active: true, ghost, item, phase, fromIdx: idx, toIdx: idx, offsetY: clientY - rect.top });
}

function onDndStart(e) {
  e.preventDefault();
  const h = e.currentTarget;
  startDrag(h.closest('.ed-item'), h.dataset.phase, +h.dataset.idx, e.touches[0].clientY);
}
function onDndStartMouse(e) {
  e.preventDefault();
  const h = e.currentTarget;
  startDrag(h.closest('.ed-item'), h.dataset.phase, +h.dataset.idx, e.clientY);
}

function onMove(clientY) {
  if (!dnd.active) return;
  dnd.ghost.style.top = (clientY - dnd.offsetY) + 'px';
  const listEl = $('list-' + dnd.phase);
  if (!listEl) return;
  let target = dnd.fromIdx;
  [...listEl.querySelectorAll('.ed-item')].forEach((el, i) => {
    const r = el.getBoundingClientRect();
    if (clientY > r.top + r.height * 0.5) target = i;
  });
  dnd.toIdx = target;
}

function onEnd() {
  if (!dnd.active) return;
  dnd.ghost.remove();
  dnd.item.style.opacity = '';
  if (dnd.toIdx !== dnd.fromIdx && dnd.toIdx >= 0) {
    const arr = getConfig()[dnd.phase];
    const [moved] = arr.splice(dnd.fromIdx, 1);
    arr.splice(dnd.toIdx, 0, moved);
    notify();
    renderExList(dnd.phase);
  }
  Object.assign(dnd, { active: false, ghost: null, item: null });
}

// ─── Wiring ──────────────────────────────────────────────────────────────────
export function initEditor() {
  document.addEventListener('touchmove', (e) => { if (dnd.active) { e.preventDefault(); onMove(e.touches[0].clientY); } }, { passive: false });
  document.addEventListener('mousemove', (e) => { if (dnd.active) onMove(e.clientY); });
  document.addEventListener('touchend', onEnd);
  document.addEventListener('mouseup', onEnd);

  const body = $('edBody');

  // Toggle sections / forms, add, edit, delete
  body.addEventListener('click', (e) => {
    const toggle = e.target.closest('[data-toggle]');
    if (toggle) {
      const b = toggle.nextElementSibling;
      const caret = toggle.querySelector('.ed-sec-caret');
      caret.classList.toggle('open', b.classList.toggle('open'));
      return;
    }
    const add = e.target.closest('[data-add]');
    if (add) { openLibraryFor(add.dataset.add); return; }

    const edit = e.target.closest('[data-edit]');
    if (edit) {
      const [phase, idx] = edit.dataset.edit.split(':');
      $('form-' + phase + '-' + idx)?.classList.toggle('open');
      return;
    }
    const del = e.target.closest('[data-del]');
    if (del) {
      const [phase, idx] = del.dataset.del.split(':');
      getConfig()[phase].splice(+idx, 1);
      notify();
      renderExList(phase);
      return;
    }
  });

  // Field changes
  body.addEventListener('change', (e) => {
    const gname = e.target.closest('[data-gname]');
    if (gname) {
      const cfg = getConfig();
      cfg.name = gname.value;
      delete cfg.nameMeta; delete cfg.templateId;   // custom name overrides auto-localization
      notify();
      return;
    }

    const g = e.target.closest('[data-g]');
    if (g) {
      const key = g.dataset.g;
      const min = key === 'rounds' ? 1 : key === 'restBetweenEx' ? 5 : 10;
      const def = key === 'rounds' ? 3 : key === 'restBetweenEx' ? 20 : 75;
      const v = Math.max(min, +g.value || def);
      getConfig()[key] = v; g.value = v; notify();
      return;
    }

    const f = e.target.closest('[data-f]');
    if (f) {
      const [phase, idx, key] = f.dataset.f.split(':');
      let val = f.value;
      if (key === 'sets' || key === 'reps' || key === 'secs') val = +val;
      if (key === 'video') val = parseYouTubeId(val) || val.trim();
      getConfig()[phase][+idx][key] = val;
      notify();
      // refresh row summary
      const item = document.querySelector(`#list-${phase} [data-idx="${idx}"]`);
      if (item) {
        const ex = getConfig()[phase][+idx];
        item.querySelector('.ed-item-meta').textContent = `${detail(ex)}`;
        if (key === 'name') item.querySelector('.ed-item-name').textContent = ex.name;
      }
    }
  });

  $('edReset').addEventListener('click', () => {
    if (confirm(t('editor.resetConfirm'))) {
      setConfig(deepClone(DEFAULT_CONFIG));
      render();
      if (onChange) onChange();
    }
  });
}

let libTargetPhase = 'circuit';
function openLibraryFor(phase) {
  libTargetPhase = phase;
  openLibrary((ex) => {
    getConfig()[libTargetPhase].push({
      name: ex.name, sets: ex.sets, reps: ex.reps, secs: ex.secs,
      tip: ex.tip, video: ex.video, slug: ex.slug,
    });
    notify();
    renderExList(libTargetPhase);
  });
}
