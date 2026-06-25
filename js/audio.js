// ════════════════════════════════════════════════════════════════════════════
// AUDIO — Web Audio API countdown beeps. Must be unlocked by a user gesture.
// ════════════════════════════════════════════════════════════════════════════

let audioCtx = null;

export function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { /* unsupported */ }
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

export function beep(freq = 880, dur = 0.08) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur);
  } catch (e) {}
}
