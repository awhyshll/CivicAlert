/**
 * alertSound.js — Generates attention-grabbing beeps via the Web Audio API.
 *
 * No external audio files are used. An OscillatorNode creates a loud,
 * pulsing tone pattern that repeats every 5 seconds while the alert is active.
 *
 * IMPORTANT: Call initAudio() from a user gesture (e.g. the "Start Monitoring"
 * button click) so the browser allows audio playback.
 *
 * Exports:
 *   initAudio()   — create the AudioContext (call once on user gesture)
 *   startAlert()  — begin the repeating beep pattern
 *   stopAlert()   — silence the alert
 *   setMuted(b)   — mute/unmute without stopping the alert loop
 *   isMuted()     — current mute state
 */

let audioCtx = null;
let gainNode = null;
let alertInterval = null;
let muted = false;

// ------------------------------------------------------------------
// Initialise the AudioContext — must be called from a user gesture
// ------------------------------------------------------------------
export function initAudio() {
  if (audioCtx) return; // already initialised
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = muted ? 0 : 1;
  audioCtx.resume();
}

// ------------------------------------------------------------------
// Play a single beep burst (3 rapid tones)
// ------------------------------------------------------------------
function playBeepBurst() {
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  // Three rapid beeps: 880 Hz → 1100 Hz → 880 Hz
  const frequencies = [880, 1100, 880];
  const beepDuration = 0.15; // each beep lasts 150 ms
  const gap = 0.08;          // 80 ms gap between beeps

  frequencies.forEach((freq, i) => {
    const start = now + i * (beepDuration + gap);

    const osc = audioCtx.createOscillator();
    const env = audioCtx.createGain();

    osc.type = "square";       // harsh / attention-grabbing
    osc.frequency.value = freq;

    // Envelope: quick attack, sustain, quick release
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(0.6, start + 0.01);   // attack
    env.gain.setValueAtTime(0.6, start + beepDuration - 0.02);
    env.gain.linearRampToValueAtTime(0, start + beepDuration); // release

    osc.connect(env);
    env.connect(gainNode);

    osc.start(start);
    osc.stop(start + beepDuration);
  });
}

// ------------------------------------------------------------------
// Start the repeating alert — beep burst every 5 seconds
// ------------------------------------------------------------------
export function startAlert() {
  if (alertInterval) return; // already running

  // Play immediately, then repeat every 5 s
  playBeepBurst();
  alertInterval = setInterval(playBeepBurst, 5000);
}

// ------------------------------------------------------------------
// Stop the alert completely
// ------------------------------------------------------------------
export function stopAlert() {
  if (alertInterval) {
    clearInterval(alertInterval);
    alertInterval = null;
  }
}

// ------------------------------------------------------------------
// Mute / Unmute (keeps the alert loop running, just silences output)
// ------------------------------------------------------------------
export function setMuted(value) {
  muted = value;
  if (gainNode) {
    gainNode.gain.value = muted ? 0 : 1;
  }
}

export function isMuted() {
  return muted;
}
