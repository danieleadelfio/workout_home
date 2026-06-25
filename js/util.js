// ════════════════════════════════════════════════════════════════════════════
// UTIL — shared helpers.
// ════════════════════════════════════════════════════════════════════════════

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

// Human-readable "sets x reps" / time detail for an exercise step.
export function exerciseDetail(step) {
  if (step.isRest) return '';
  if (step.sets > 1 && step.reps > 0)   return `${step.sets} × ${step.reps} rip.`;
  if (step.sets > 1 && step.reps === 0) return `${step.sets} × ${step.secs}s`;
  if (step.sets === 1 && step.reps > 0) return `${step.reps} rip.`;
  return `${step.secs} sec`;
}

export function $(id) { return document.getElementById(id); }
