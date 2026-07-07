// ════════════════════════════════════════════════════════════════════════════
// NAVIGATION — show/hide top-level screens. Screens are <section class="screen">
// with ids: home, workout, done, editor, templates, library, onboarding.
// ════════════════════════════════════════════════════════════════════════════

const SCREENS = ['onboarding', 'home', 'workout', 'done', 'editor', 'templates', 'programs', 'favorites', 'library'];
const hooks = {};

// Register a callback to run whenever a screen becomes visible.
export function onShow(screen, cb) { hooks[screen] = cb; }

export function showScreen(name) {
  SCREENS.forEach(s => {
    const el = document.getElementById('screen-' + s);
    if (el) el.classList.toggle('active', s === name);
  });
  window.scrollTo(0, 0);
  if (hooks[name]) hooks[name]();
}
