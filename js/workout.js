// ════════════════════════════════════════════════════════════════════════════
// WORKOUT ENGINE — builds the step list, runs the timer, renders the screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig } from './store.js';
import { initAudio, beep } from './audio.js';
import { openVideo } from './video.js';
import { showScreen } from './navigation.js';
import { t } from './i18n.js';
import { stepName, stepTip } from './data/i18n-content.js';
import { esc, fmtTime, vib, exerciseDetail, $ } from './util.js';

const RING_CIRC = 2 * Math.PI * 70;   // ring radius = 70

// Cached DOM refs (filled on first run) ──────────────────────────────────────
let dom = null;
function cacheDom() {
  dom = {
    phaseLabel: $('phaseLabel'), stepInfo: $('stepInfo'),
    timerDigits: $('timerDigits'), timerUnit: $('timerUnit'),
    ringFg: $('ringFg'), progressFill: $('progressFill'),
    exName: $('exName'), exDetail: $('exDetail'), exTip: $('exTip'),
    setDots: $('setDots'), exAnim: $('exAnim'),
    pauseBtn: $('pauseBtn'), videoBtn: $('videoBtn'),
  };
}

// Runtime state ──────────────────────────────────────────────────────────────
let steps = [], cur = 0, timeLeft = 0, elapsed = 0, totalSecs = 0;
let paused = false, ticker = null, currentStep = null;

function modeColor(m) {
  return m === 'warmup' ? '#ff9a00'
       : m === 'work'   ? '#ff5f2e'
       : m === 'rest'   ? '#4e9fff'
       : '#32d583';
}

export function buildSteps(cfg) {
  const s = [];
  const restEx = (phase, mode, tip) =>
    ({ name: t('wk.rest'), secs: cfg.restBetweenEx, phase, mode, isRest: true, tip });

  cfg.warmup.forEach((ex, i) => {
    s.push({ ...ex, phase: t('wk.warmup'), mode: 'warmup' });
    if (i < cfg.warmup.length - 1) s.push(restEx(t('wk.warmup'), 'warmup', t('wk.tip.breatheSlow')));
  });

  for (let r = 0; r < cfg.rounds; r++) {
    const ph = t('wk.round', { r: r + 1, n: cfg.rounds });
    cfg.circuit.forEach((ex, i) => {
      s.push({ ...ex, phase: ph, mode: 'work', round: r });
      if (i < cfg.circuit.length - 1) s.push(restEx(ph, 'work', t('wk.tip.water')));
    });
    if (r < cfg.rounds - 1)
      s.push({ name: t('wk.restRounds'), secs: cfg.restBetweenRounds, phase: t('wk.restPhase'), mode: 'rest', isRest: true, tip: t('wk.tip.shake') });
  }

  cfg.cooldown.forEach((ex, i) => {
    s.push({ ...ex, phase: t('wk.cooldown'), mode: 'cooldown' });
    if (i < cfg.cooldown.length - 1) s.push(restEx(t('wk.cooldown'), 'cooldown', t('wk.tip.breathe')));
  });

  return s;
}

// Straight-sets builder (used by program days / schede). Each circuit exercise
// is performed for all of its sets in a row. Rep-based sets are UNTIMED — the
// timer waits until you press "Next". A short rest follows each set, and a
// longer rest follows all the sets of an exercise.
export function buildStepsSets(cfg) {
  const s = [];
  const restSet = cfg.restBetweenSets ?? 30;
  const restExV = cfg.restBetweenEx ?? 60;
  const rest = (secs, phase, mode, tip) => ({ name: t('wk.rest'), secs, phase, mode, isRest: true, tip });

  cfg.warmup.forEach((ex, i) => {
    s.push({ ...ex, phase: t('wk.warmup'), mode: 'warmup' });
    if (i < cfg.warmup.length - 1) s.push(rest(restSet, t('wk.warmup'), 'warmup', t('wk.tip.breatheSlow')));
  });

  cfg.circuit.forEach((ex, ei) => {
    const sets = Math.max(1, ex.sets || 1);
    const untimed = ex.reps > 0;   // rep-based sets are untimed (press Next)
    for (let si = 0; si < sets; si++) {
      s.push({ ...ex, phase: t('wk.set', { s: si + 1, n: sets }), mode: 'work', set: si, setsTotal: sets, untimed });
      if (si < sets - 1) s.push(rest(restSet, t('wk.restPhase'), 'rest', t('wk.tip.restSet')));
    }
    if (ei < cfg.circuit.length - 1) s.push(rest(restExV, t('wk.restPhase'), 'rest', t('wk.tip.restEx')));
  });

  cfg.cooldown.forEach((ex, i) => {
    s.push({ ...ex, phase: t('wk.cooldown'), mode: 'cooldown' });
    if (i < cfg.cooldown.length - 1) s.push(rest(restSet, t('wk.cooldown'), 'cooldown', t('wk.tip.breathe')));
  });

  return s;
}

function render() {
  const step = steps[cur];
  currentStep = step;
  const col = modeColor(step.mode);
  const cfg = getConfig();
  const untimed = !!step.untimed && !step.isRest;

  dom.phaseLabel.style.color = col;
  dom.phaseLabel.textContent = step.phase;
  dom.stepInfo.textContent = `${cur + 1} / ${steps.length}`;
  dom.timerDigits.style.color = col;
  dom.ringFg.style.stroke = col;
  dom.progressFill.style.width = (elapsed / totalSecs * 100) + '%';
  dom.exName.textContent = stepName(step);
  dom.exTip.textContent = stepTip(step) || '';

  if (untimed) {
    // Rep-based set: no countdown, the ring stays full and the user presses Next.
    dom.timerDigits.textContent = String(step.reps);
    dom.timerUnit.textContent = t('wk.repsUnit');
    dom.ringFg.style.strokeDashoffset = 0;
    dom.exDetail.textContent = t('wk.repsGoal', { n: step.reps });
  } else {
    const offset = RING_CIRC * (1 - (step.secs > 0 ? timeLeft / step.secs : 0));
    dom.timerDigits.textContent = fmtTime(timeLeft);
    dom.timerUnit.textContent = step.secs >= 60 ? t('wk.minsec') : t('wk.sec');
    dom.ringFg.style.strokeDashoffset = offset;
    dom.exDetail.textContent = exerciseDetail(step);
  }

  // Progress dots: set progress (schede) or round progress (circuit)
  if (!step.isRest && step.setsTotal !== undefined) {
    dom.setDots.innerHTML = Array.from({ length: step.setsTotal }, (_, i) => {
      const bg = i < step.set ? 'var(--accent)' : i === step.set ? 'var(--accent2)' : 'var(--border)';
      return `<div class="set-dot" style="background:${bg}"></div>`;
    }).join('');
  } else if (!step.isRest && step.round !== undefined) {
    dom.setDots.innerHTML = Array.from({ length: cfg.rounds }, (_, i) => {
      const bg = i < step.round ? 'var(--accent)' : i === step.round ? 'var(--accent2)' : 'var(--border)';
      return `<div class="set-dot" style="background:${bg}"></div>`;
    }).join('');
  } else {
    dom.setDots.innerHTML = '';
  }

  // Video example button (only when the exercise has a video and is not a rest)
  if (step.video && !step.isRest) {
    dom.videoBtn.style.display = '';
    dom.videoBtn.onclick = () => {
      const wasPaused = paused;
      if (!paused) togglePause();
      openVideo(step.video, stepName(step), () => { if (!wasPaused && paused) togglePause(); });
    };
  } else {
    dom.videoBtn.style.display = 'none';
  }
}

function nextStep() {
  cur++;
  if (cur >= steps.length) { finish(); return; }
  timeLeft = steps[cur].secs;
  render();
}

function tick() {
  if (paused) return;
  // Untimed rep-based sets have no countdown — wait for the user to press Next.
  if (currentStep && currentStep.untimed && !currentStep.isRest) return;
  timeLeft--; elapsed++;
  render();
  if (timeLeft >= 1 && timeLeft <= 5) beep(880, 0.08);
  if (timeLeft <= 0) { vib([80, 60, 80]); nextStep(); }
  else if (timeLeft <= 3) vib([30]);
}

export function startWorkout() {
  if (!dom) cacheDom();
  initAudio();
  const cfg = getConfig();
  steps = cfg.straightSets ? buildStepsSets(cfg) : buildSteps(cfg);
  totalSecs = steps.reduce((a, s) => a + s.secs, 0);
  cur = 0; elapsed = 0; paused = false; timeLeft = steps[0].secs;
  showScreen('workout');
  render();
  vib([100, 50, 100]);
  clearInterval(ticker);
  ticker = setInterval(tick, 1000);
}

export function skipStep() { elapsed += timeLeft; nextStep(); }

export function togglePause() {
  paused = !paused;
  dom.pauseBtn.textContent = paused ? t('wk.resume') : t('wk.pause');
}

export function isPaused() { return paused; }

function finish() {
  clearInterval(ticker);
  const cfg = getConfig();
  const ws = steps.filter(s => !s.isRest && s.mode === 'work');
  const tr = ws.reduce((a, s) => a + (s.reps > 0 ? s.reps : 0), 0);
  $('doneMin').textContent = Math.round(totalSecs / 60);
  $('doneSeries').textContent = ws.length;
  $('doneReps').textContent = tr > 0 ? '~' + tr : '-';
  // Second stat: rounds for circuits, exercise count for straight-sets schede.
  const roundsLbl = $('doneRounds').nextElementSibling;
  if (cfg.straightSets) {
    $('doneRounds').textContent = cfg.circuit.length;
    if (roundsLbl) roundsLbl.textContent = t('done.exercises');
  } else {
    $('doneRounds').textContent = cfg.rounds;
    if (roundsLbl) roundsLbl.textContent = t('done.rounds');
  }
  showScreen('done');
  vib([200, 100, 200, 100, 400]);
}

// ─── Stop modal ──────────────────────────────────────────────────────────────
export function showStopModal() {
  if (!paused) { paused = true; dom.pauseBtn.textContent = t('wk.resume'); }
  $('stopModal').classList.add('open');
}
export function hideStopModal() {
  $('stopModal').classList.remove('open');
  paused = false; dom.pauseBtn.textContent = t('wk.pause');
}
export function confirmStop() {
  $('stopModal').classList.remove('open');
  clearInterval(ticker);
  showScreen('home');
}
