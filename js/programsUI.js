// ════════════════════════════════════════════════════════════════════════════
// PROGRAMS UI (SCHEDE) — gallery of multi-day structured training plans, sorted
// by relevance to the user's profile. Each program card expands to reveal its
// days; picking a day loads it into the current config, like a template.
// ════════════════════════════════════════════════════════════════════════════

import { PROGRAMS, evalProgram } from './data/programs.js';
import { GOALS, LEVELS, goalLabel, equipmentLabel, levelLabel } from './data/taxonomy.js';
import { getProfile, setConfig } from './store.js';
import { configFromProgramDay } from './state.js';
import { showScreen } from './navigation.js';
import { progName, progDesc, dayName, dayFocus, stepName } from './data/i18n-content.js';
import { t } from './i18n.js';
import { esc, $ } from './util.js';

let onApply = null;
// Track which program/day panels are expanded across re-renders.
const expandedPrograms = new Set();
const expandedDays = new Set();

export function openPrograms(onApplyCb) {
  onApply = onApplyCb || null;
  render();
  showScreen('programs');
}

function badge(text, color) {
  return `<span class="tpl-badge" style="border-color:${color};color:${color}">${esc(text)}</span>`;
}

function dayExercises(list) {
  return list.map(s => {
    const base = s.reps > 0 ? t('unit.reps', { n: s.reps }) : t('unit.secs', { n: s.secs });
    const meta = (s.sets || 1) > 1 ? `${s.sets} × ${base}` : base;
    return `
    <div class="phase-ex">
      <span class="phase-ex-name">${esc(stepName(s))}</span>
      <span class="phase-ex-meta">${esc(meta)}</span>
    </div>`;
  }).join('');
}

function dayPanel(prog, day, i, locked) {
  const key = prog.id + ':' + i;
  const total = day.circuit.length;
  const useBtn = locked
    ? `<button class="btn btn-ghost tpl-locked" type="button" disabled>${t('tpl.needEquip')}</button>`
    : `<button class="btn btn-accent prog-day-use" data-prog="${prog.id}" data-day="${i}" type="button">${t('prog.trainDay')}</button>`;

  return `<div class="prog-day${expandedDays.has(key) ? ' open' : ''}" data-day-key="${key}">
    <button class="prog-day-hd" type="button">
      <div class="prog-day-num">${i + 1}</div>
      <div class="prog-day-text">
        <div class="prog-day-name">${esc(dayName(prog, i))}</div>
        <div class="prog-day-sub">${t('prog.exercises', { n: total })} · ${esc(dayFocus(prog, i))}</div>
      </div>
      <div class="prog-day-caret">▾</div>
    </button>
    <div class="prog-day-detail">
      ${dayExercises(day.circuit)}
      ${useBtn}
    </div>
  </div>`;
}

function card(prog, evalRes, recommended) {
  const goalBadges = prog.goals.map(g => {
    const go = GOALS[g];
    return go ? badge(goalLabel(g), go.color) : '';
  }).join('');
  const lv = LEVELS[prog.level];
  const levelBadge = lv ? `<span class="tpl-badge" style="border-color:${lv.color};color:${lv.color}">${lv.icon} ${esc(levelLabel(prog.level))}</span>` : '';
  const eqLabel = prog.equipment.map(e => equipmentLabel(e)).join(' · ');
  const locked = !evalRes.canRun;
  const isOpen = expandedPrograms.has(prog.id);

  return `<div class="tpl-card ${recommended ? 'tpl-reco' : ''}" data-prog-card="${prog.id}">
    ${recommended ? `<div class="tpl-flag">${t('tpl.flag')}</div>` : ''}
    <div class="tpl-head">
      <h3>${esc(progName(prog))}</h3>
      <span class="tpl-zone">📅 ${t('prog.days', { n: prog.daysPerWeek })}</span>
    </div>
    <p class="tpl-desc">${esc(progDesc(prog))}</p>
    <div class="tpl-badges">${levelBadge}${goalBadges}</div>
    <div class="tpl-meta">
      <span>🗓️ ${t('prog.perWeek', { n: prog.daysPerWeek })}</span>
      <span>🧰 ${esc(eqLabel)}</span>
    </div>
    <button class="btn btn-ghost prog-toggle" data-prog="${prog.id}" type="button">
      ${isOpen ? t('prog.hideDays') : t('prog.showDays')}
    </button>
    <div class="prog-days${isOpen ? ' open' : ''}">
      ${prog.days.map((d, i) => dayPanel(prog, d, i, locked)).join('')}
    </div>
  </div>`;
}

function render() {
  const profile = getProfile();
  const scored = PROGRAMS
    .map(prog => ({ p: prog, e: evalProgram(prog, profile) }))
    .sort((a, b) => b.e.score - a.e.score);

  const reco = scored.filter(x => x.e.canRun && x.e.goalMatch && x.e.levelOk);
  const others = scored.filter(x => x.e.canRun && !(x.e.goalMatch && x.e.levelOk));
  const locked = scored.filter(x => !x.e.canRun);

  let html = '';
  if (reco.length) {
    html += `<h2 class="tpl-section">${t('tpl.recommended')}</h2>
      <div class="tpl-grid">${reco.map(x => card(x.p, x.e, true)).join('')}</div>`;
  }
  if (others.length) {
    html += `<h2 class="tpl-section">${t('tpl.others')}</h2>
      <div class="tpl-grid">${others.map(x => card(x.p, x.e, false)).join('')}</div>`;
  }
  if (locked.length) {
    html += `<h2 class="tpl-section">${t('tpl.locked')}</h2>
      <div class="tpl-grid tpl-grid-locked">${locked.map(x => card(x.p, x.e, false)).join('')}</div>`;
  }
  $('programsBody').innerHTML = html || `<p class="muted" style="padding:24px;text-align:center">${t('prog.empty')}</p>`;
}

export function initPrograms() {
  const body = $('programsBody');
  if (!body) return;

  body.addEventListener('click', (e) => {
    // Expand / collapse the whole program
    const toggle = e.target.closest('.prog-toggle');
    if (toggle) {
      const id = toggle.dataset.prog;
      if (expandedPrograms.has(id)) expandedPrograms.delete(id);
      else expandedPrograms.add(id);
      render();
      return;
    }

    // Expand / collapse a single day
    const dayHd = e.target.closest('.prog-day-hd');
    if (dayHd) {
      const wrap = dayHd.closest('.prog-day');
      const key = wrap.dataset.dayKey;
      if (expandedDays.has(key)) expandedDays.delete(key);
      else expandedDays.add(key);
      wrap.classList.toggle('open');
      return;
    }

    // Load a day as the current workout
    const useBtn = e.target.closest('.prog-day-use');
    if (useBtn) {
      const prog = PROGRAMS.find(p => p.id === useBtn.dataset.prog);
      if (!prog) return;
      const dayIndex = parseInt(useBtn.dataset.day, 10);
      setConfig(configFromProgramDay(prog, dayIndex));
      if (onApply) onApply();
      showScreen('home');
    }
  });
}
