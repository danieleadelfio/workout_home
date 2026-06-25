// ════════════════════════════════════════════════════════════════════════════
// WORKOUT ENGINE — builds the step list, runs the timer, renders the screen.
// ════════════════════════════════════════════════════════════════════════════

import { getConfig } from './store.js';
import { initAudio, beep } from './audio.js';
import { openVideo } from './video.js';
import { showScreen } from './navigation.js';
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
    ({ name: 'Riposo', secs: cfg.restBetweenEx, phase, mode, isRest: true, tip });

  cfg.warmup.forEach((ex, i) => {
    s.push({ ...ex, phase: 'RISCALDAMENTO', mode: 'warmup' });
    if (i < cfg.warmup.length - 1) s.push(restEx('RISCALDAMENTO', 'warmup', 'Respira lentamente.'));
  });

  for (let r = 0; r < cfg.rounds; r++) {
    const ph = `GIRO ${r + 1} / ${cfg.rounds}`;
    cfg.circuit.forEach((ex, i) => {
      s.push({ ...ex, phase: ph, mode: 'work', round: r });
      if (i < cfg.circuit.length - 1) s.push(restEx(ph, 'work', "Bevi un sorso d'acqua."));
    });
    if (r < cfg.rounds - 1)
      s.push({ name: 'Riposo tra i giri', secs: cfg.restBetweenRounds, phase: 'RIPOSO', mode: 'rest', isRest: true, tip: 'Scuoti braccia e gambe, respira profondo.' });
  }

  cfg.cooldown.forEach((ex, i) => {
    s.push({ ...ex, phase: 'DEFATICAMENTO', mode: 'cooldown' });
    if (i < cfg.cooldown.length - 1) s.push(restEx('DEFATICAMENTO', 'cooldown', 'Respira profondo.'));
  });

  return s;
}

function render() {
  const step = steps[cur];
  currentStep = step;
  const col = modeColor(step.mode);
  const offset = RING_CIRC * (1 - (step.secs > 0 ? timeLeft / step.secs : 0));
  const cfg = getConfig();

  dom.phaseLabel.style.color = col;
  dom.phaseLabel.textContent = step.phase;
  dom.stepInfo.textContent = `${cur + 1} / ${steps.length}`;
  dom.timerDigits.style.color = col;
  dom.timerDigits.textContent = fmtTime(timeLeft);
  dom.timerUnit.textContent = step.secs >= 60 ? 'MIN:SEC' : 'SEC';
  dom.ringFg.style.stroke = col;
  dom.ringFg.style.strokeDashoffset = offset;
  dom.progressFill.style.width = (elapsed / totalSecs * 100) + '%';
  dom.exName.textContent = step.name;
  dom.exDetail.textContent = exerciseDetail(step);
  dom.exTip.textContent = step.tip || '';

  // Round dots
  if (step.round !== undefined && !step.isRest) {
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
      openVideo(step.video, step.name, () => { if (!wasPaused && paused) togglePause(); });
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
  steps = buildSteps(cfg);
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
  dom.pauseBtn.textContent = paused ? 'Riprendi' : 'Pausa';
}

export function isPaused() { return paused; }

function finish() {
  clearInterval(ticker);
  const cfg = getConfig();
  const ws = steps.filter(s => !s.isRest && s.mode === 'work');
  const tr = ws.reduce((a, s) => a + (s.reps > 0 ? s.reps * (s.sets || 1) : 0), 0);
  $('doneMin').textContent = Math.round(totalSecs / 60);
  $('doneRounds').textContent = cfg.rounds;
  $('doneSeries').textContent = ws.length;
  $('doneReps').textContent = tr > 0 ? '~' + tr : '-';
  showScreen('done');
  vib([200, 100, 200, 100, 400]);
}

// ─── Stop modal ──────────────────────────────────────────────────────────────
export function showStopModal() {
  if (!paused) { paused = true; dom.pauseBtn.textContent = 'Riprendi'; }
  $('stopModal').classList.add('open');
}
export function hideStopModal() {
  $('stopModal').classList.remove('open');
  paused = false; dom.pauseBtn.textContent = 'Pausa';
}
export function confirmStop() {
  $('stopModal').classList.remove('open');
  clearInterval(ticker);
  showScreen('home');
}
