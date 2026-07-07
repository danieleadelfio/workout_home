// ════════════════════════════════════════════════════════════════════════════
// MAIN — bootstrap: wire every module, register navigation hooks, start app.
// ════════════════════════════════════════════════════════════════════════════

import { getProfile, setConfig } from './store.js';
import { generatePlan } from './recommend.js';
import { showScreen, onShow } from './navigation.js';
import { initAudio } from './audio.js';
import { initVideoDelegation } from './video.js';
import { initOnboarding, openOnboarding } from './onboarding.js';
import { initTemplates, openTemplates } from './templatesUI.js';
import { initPrograms, openPrograms } from './programsUI.js';
import { initLibrary } from './library.js';
import { initFavorites, openFavorites } from './favorites.js';
import { initEditor, openEditor } from './editor.js';
import { startWorkout, skipStep, togglePause, showStopModal, hideStopModal, confirmStop } from './workout.js';
import { updateHome } from './ui.js';
import { initI18n, getLang, setLang, subscribe } from './i18n.js';
import { startTour, maybeAutoStartTour } from './tour.js';
import { $ } from './util.js';

function refreshHome() { updateHome(); }

// Reflect the active language in the home toggle.
function updateLangToggle() {
  document.querySelectorAll('#langToggle .lang-opt').forEach(b => {
    b.classList.toggle('on', b.dataset.lang === getLang());
  });
}

// Re-render dynamic content of the currently visible screen after a language
// change (static [data-i18n] nodes are handled by i18n.applyStatic).
function reRenderActive() {
  updateLangToggle();
  updateHome();
  const id = document.querySelector('.screen.active')?.id;
  if (id === 'screen-templates') openTemplates(refreshHome);
  else if (id === 'screen-programs') openPrograms(refreshHome);
  else if (id === 'screen-favorites') openFavorites(refreshHome);
  else if (id === 'screen-editor') openEditor(refreshHome);
}

function boot() {
  // Internationalisation must run first so static text + <html lang> are set
  // before any dynamic screen is rendered.
  initI18n();
  updateLangToggle();
  subscribe(reRenderActive);

  // Init feature modules
  initVideoDelegation();
  initOnboarding();
  initTemplates();
  initPrograms();
  initLibrary();
  initFavorites();
  initEditor();

  // Navigation hooks
  onShow('home', refreshHome);

  // Language toggle + help
  $('langToggle').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });
  $('btnHelp').addEventListener('click', () => startTour());

  // Home buttons
  $('btnStart').addEventListener('click', () => { initAudio(); startWorkout(); });
  $('btnEdit').addEventListener('click', () => openEditor(refreshHome));
  $('btnTemplates').addEventListener('click', () => openTemplates(refreshHome));
  $('btnPrograms').addEventListener('click', () => openPrograms(refreshHome));
  $('btnFavorites').addEventListener('click', () => openFavorites(refreshHome));
  $('btnProfile').addEventListener('click', () => openOnboarding(() => { refreshHome(); showScreen('home'); }));
  $('btnGenerate').addEventListener('click', () => {
    setConfig(generatePlan(getProfile()));
    refreshHome();
  });

  // Workout controls
  $('btnSkip').addEventListener('click', skipStep);
  $('pauseBtn').addEventListener('click', togglePause);
  $('stopBtn').addEventListener('click', showStopModal);
  $('stopCancel').addEventListener('click', hideStopModal);
  $('stopConfirm').addEventListener('click', confirmStop);

  // Done / editor back
  $('btnDoneHome').addEventListener('click', () => showScreen('home'));
  $('edBack').addEventListener('click', () => { refreshHome(); showScreen('home'); });
  $('tplBack').addEventListener('click', () => showScreen('home'));
  $('progBack').addEventListener('click', () => showScreen('home'));
  $('favBack').addEventListener('click', () => showScreen('home'));

  // First launch → onboarding, otherwise home
  const p = getProfile();
  refreshHome();
  if (!p.onboarded) {
    openOnboarding(() => { refreshHome(); showScreen('home'); maybeAutoStartTour(); });
  } else {
    showScreen('home');
    maybeAutoStartTour();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
