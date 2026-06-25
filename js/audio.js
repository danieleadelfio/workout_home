// ════════════════════════════════════════════════════════════════════════════
// AUDIO — Web Audio API countdown beeps. Must be unlocked by a user gesture.
// ════════════════════════════════════════════════════════════════════════════

let audioCtx = null;
let unlocked = false;

// Must be called from inside a user gesture (e.g. the Start button tap).
// On iOS the AudioContext starts suspended and stays silent until we both
// resume() it AND play a (silent) buffer within that same gesture.
export function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { /* unsupported */ }
  }
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (!unlocked) {
    try {
      const buf = audioCtx.createBuffer(1, 1, 22050);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      src.connect(audioCtx.destination);
      src.start(0);
      unlocked = true;
    } catch (e) {}
  }
}

export function beep(freq = 880, dur = 0.08) {
  if (!audioCtx) return;
  // Safari/iOS can suspend the context when backgrounded; resume defensively.
  if (audioCtx.state === 'suspended') audioCtx.resume();
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
