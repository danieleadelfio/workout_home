// ════════════════════════════════════════════════════════════════════════════
// ONBOARDING — first-launch profile setup: equipment + goals.
// Obligatory the first time; re-openable later to edit the profile.
// ════════════════════════════════════════════════════════════════════════════

import {
  EQUIPMENT, SELECTABLE_EQUIPMENT, GOALS, conflictingGoals,
  goalLabel, goalShort, equipmentLabel,
} from './data/taxonomy.js';
import { getProfile, setProfile, setConfig } from './store.js';
import { generatePlan } from './recommend.js';
import { showScreen } from './navigation.js';
import { t } from './i18n.js';
import { $ } from './util.js';

let draft = { equipment: [], goals: [] };
let onComplete = null;

export function openOnboarding(onDone) {
  const p = getProfile();
  draft = { equipment: [...(p.equipment || [])], goals: [...(p.goals || [])] };
  onComplete = onDone || null;
  render();
  showScreen('onboarding');
}

function toggle(list, id) {
  const i = list.indexOf(id);
  if (i >= 0) list.splice(i, 1); else list.push(id);
}

function render() {
  const blocked = conflictingGoals(draft.goals);

  const equipChips = SELECTABLE_EQUIPMENT.map(id => {
    const e = EQUIPMENT[id];
    const on = draft.equipment.includes(id);
    return `<button class="chip-big ${on ? 'on' : ''}" data-equip="${id}" type="button"
      style="${on ? `border-color:${e.color};box-shadow:0 0 0 1px ${e.color}` : ''}">
      <span class="chip-ico">${e.icon}</span><span>${equipmentLabel(id)}</span>
    </button>`;
  }).join('');

  const goalChips = Object.values(GOALS).map(g => {
    const on = draft.goals.includes(g.id);
    const dis = !on && blocked.has(g.id);
    return `<button class="chip-big ${on ? 'on' : ''} ${dis ? 'disabled' : ''}" data-goal="${g.id}" type="button"
      ${dis ? 'disabled' : ''}
      style="${on ? `border-color:${g.color};box-shadow:0 0 0 1px ${g.color}` : ''}">
      <span class="chip-ico">${g.icon}</span>
      <span>${goalLabel(g.id)}</span>
      <small>${goalShort(g.id)}</small>
    </button>`;
  }).join('');

  $('onboardBody').innerHTML = `
    <div class="onb-block">
      <h3>${t('onb.equipQ')}</h3>
      <p class="muted">${t('onb.equipHelp')}</p>
      <div class="chip-grid">${equipChips}</div>
    </div>
    <div class="onb-block">
      <h3>${t('onb.goalQ')}</h3>
      <p class="muted">${t('onb.goalHelp')}</p>
      <div class="chip-grid">${goalChips}</div>
    </div>`;

  const ready = draft.goals.length > 0;
  const btn = $('onboardSave');
  btn.disabled = !ready;
  btn.textContent = ready ? t('onb.start') : t('onb.chooseGoal');
}

export function initOnboarding() {
  $('onboardBody').addEventListener('click', (e) => {
    const eq = e.target.closest('[data-equip]');
    const go = e.target.closest('[data-goal]');
    if (eq) { toggle(draft.equipment, eq.dataset.equip); render(); }
    else if (go && !go.disabled) { toggle(draft.goals, go.dataset.goal); render(); }
  });

  $('onboardSave').addEventListener('click', () => {
    if (draft.goals.length === 0) return;
    const profile = { equipment: [...draft.equipment], goals: [...draft.goals], onboarded: true };
    setProfile(profile);
    // Generate a workout tailored to the chosen equipment + goals.
    setConfig(generatePlan(profile));
    if (onComplete) onComplete();
    else showScreen('home');
  });

  const skip = $('onboardSkip');
  if (skip) skip.addEventListener('click', () => showScreen('home'));
}
