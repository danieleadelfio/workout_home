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
import { initLibrary } from './library.js';
import { initFavorites, openFavorites } from './favorites.js';
import { initEditor, openEditor } from './editor.js';
import { startWorkout, skipStep, togglePause, showStopModal, hideStopModal, confirmStop } from './workout.js';
import { updateHome } from './ui.js';
import { $ } from './util.js';

function refreshHome() { updateHome(); }

function boot() {
  // Init feature modules
  initVideoDelegation();
  initOnboarding();
  initTemplates();
  initLibrary();
  initFavorites();
  initEditor();

  // Navigation hooks
  onShow('home', refreshHome);

  // Home buttons
  $('btnStart').addEventListener('click', () => { initAudio(); startWorkout(); });
  $('btnEdit').addEventListener('click', () => openEditor(refreshHome));
  $('btnTemplates').addEventListener('click', () => openTemplates(refreshHome));
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
  $('favBack').addEventListener('click', () => showScreen('home'));

  // First launch → onboarding, otherwise home
  const p = getProfile();
  refreshHome();
  if (!p.onboarded) {
    openOnboarding(() => { refreshHome(); showScreen('home'); });
  } else {
    showScreen('home');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
