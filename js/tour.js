// ════════════════════════════════════════════════════════════════════════════
// TOUR — a lightweight spotlight onboarding tour for the home screen. Highlights
// real elements with a dimmed cut-out and a tooltip card (Back / Next / Skip).
// Replayable from the "?" button; auto-starts once after first onboarding.
// ════════════════════════════════════════════════════════════════════════════

import { t } from './i18n.js';
import { showScreen } from './navigation.js';

const SEEN_KEY = 'tourSeen';
const PAD = 8;   // highlight padding around the target

const STEPS = [
  { target: null,            title: 'tour.welcome.title',  body: 'tour.welcome.body' },
  { target: '.profile-card', title: 'tour.profile.title',  body: 'tour.profile.body' },
  { target: '#btnGenerate',  title: 'tour.generate.title', body: 'tour.generate.body' },
  { target: '#homePhases',   title: 'tour.stages.title',   body: 'tour.stages.body' },
  { target: '.home-actions', title: 'tour.actions.title',  body: 'tour.actions.body' },
  { target: '#btnPrograms',  title: 'tour.programs.title', body: 'tour.programs.body' },
  { target: '#btnStart',     title: 'tour.start.title',    body: 'tour.start.body' },
  { target: '#btnHelp',      title: 'tour.help.title',     body: 'tour.help.body' },
];

let idx = 0;
let active = false;
let els = null;   // { root, highlight, tip }

function build() {
  const root = document.createElement('div');
  root.className = 'tour-root';
  root.innerHTML = `
    <div class="tour-highlight"></div>
    <div class="tour-tip" role="dialog" aria-modal="true">
      <div class="tour-progress"></div>
      <h3 class="tour-title"></h3>
      <p class="tour-body"></p>
      <div class="tour-actions">
        <button class="tour-skip" type="button"></button>
        <div class="tour-nav">
          <button class="tour-back" type="button"></button>
          <button class="tour-next btn btn-accent" type="button"></button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(root);

  els = {
    root,
    highlight: root.querySelector('.tour-highlight'),
    tip: root.querySelector('.tour-tip'),
    progress: root.querySelector('.tour-progress'),
    title: root.querySelector('.tour-title'),
    body: root.querySelector('.tour-body'),
    skip: root.querySelector('.tour-skip'),
    back: root.querySelector('.tour-back'),
    next: root.querySelector('.tour-next'),
  };

  els.skip.addEventListener('click', end);
  els.back.addEventListener('click', () => go(idx - 1));
  els.next.addEventListener('click', () => {
    if (idx >= STEPS.length - 1) end();
    else go(idx + 1);
  });
  root.addEventListener('click', (e) => { if (e.target === root) { /* ignore backdrop clicks */ } });
  window.addEventListener('resize', reposition);
  window.addEventListener('scroll', reposition, true);
}

function teardown() {
  window.removeEventListener('resize', reposition);
  window.removeEventListener('scroll', reposition, true);
  els?.root.remove();
  els = null;
}

function renderText() {
  const step = STEPS[idx];
  els.progress.textContent = t('tour.step', { i: idx + 1, n: STEPS.length });
  els.title.textContent = t(step.title);
  els.body.textContent = t(step.body);
  els.skip.textContent = t('tour.skip');
  els.back.textContent = t('tour.back');
  els.back.style.visibility = idx === 0 ? 'hidden' : 'visible';
  els.next.textContent = idx >= STEPS.length - 1 ? t('tour.done') : t('tour.next');
}

function reposition() {
  if (!active || !els) return;
  const step = STEPS[idx];
  const el = step.target ? document.querySelector(step.target) : null;
  const hl = els.highlight;
  const tip = els.tip;

  if (!el) {
    hl.style.opacity = '0';
    hl.style.width = hl.style.height = '0px';
    tip.style.left = '50%';
    tip.style.top = '50%';
    tip.style.transform = 'translate(-50%, -50%)';
    return;
  }

  const r = el.getBoundingClientRect();
  hl.style.opacity = '1';
  hl.style.left = (r.left - PAD) + 'px';
  hl.style.top = (r.top - PAD) + 'px';
  hl.style.width = (r.width + PAD * 2) + 'px';
  hl.style.height = (r.height + PAD * 2) + 'px';

  // Place the tooltip below the target if there's room, otherwise above.
  const tipH = tip.offsetHeight || 180;
  const vh = window.innerHeight;
  const below = r.bottom + 12 + tipH < vh;
  tip.style.transform = 'none';
  tip.style.left = '50%';
  tip.style.marginLeft = '-' + Math.min(190, window.innerWidth / 2 - 12) + 'px';
  if (below) {
    tip.style.top = (r.bottom + 12) + 'px';
  } else {
    tip.style.top = Math.max(12, r.top - 12 - tipH) + 'px';
  }
}

function go(i) {
  idx = Math.max(0, Math.min(STEPS.length - 1, i));
  const step = STEPS[idx];
  const el = step.target ? document.querySelector(step.target) : null;
  if (el) el.scrollIntoView({ block: 'center', behavior: 'auto' });
  renderText();
  requestAnimationFrame(reposition);
}

export function startTour() {
  showScreen('home');
  if (!els) build();
  active = true;
  els.root.classList.add('on');
  // Wait a frame so the home screen layout settles before measuring.
  requestAnimationFrame(() => go(0));
}

function end() {
  active = false;
  try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {}
  teardown();
}

// Auto-start the tour the first time only.
export function maybeAutoStartTour() {
  let seen = false;
  try { seen = localStorage.getItem(SEEN_KEY) === '1'; } catch (e) {}
  if (seen) return;
  // Defer slightly so the home screen is rendered and measurable.
  setTimeout(startTour, 350);
}
