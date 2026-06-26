// ════════════════════════════════════════════════════════════════════════════
// UTIL — shared helpers.
// ════════════════════════════════════════════════════════════════════════════

import { t } from './i18n.js';

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function fmtTime(s) {
  if (s >= 60) return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  return String(s).padStart(2, '0');
}

export function vib(p) { if (navigator.vibrate) navigator.vibrate(p); }

// Human-readable target for an exercise step. In this circuit app each round is
// one set, so we never multiply by "sets" — we just state the per-set target:
// the rep count for strength moves, or the duration for timed/hold moves.
export function exerciseDetail(step) {
  if (step.isRest) return '';
  if (step.reps > 0) return t('detail.reps', { n: step.reps });
  return t('detail.secs', { n: step.secs });
}

export function $(id) { return document.getElementById(id); }
