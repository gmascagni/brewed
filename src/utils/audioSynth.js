// Web Audio API Synthesizer for The Brew App

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a high-pitched soft chime for phase completion
 */
export function playPhaseChime(isMuted = false) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 tone
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15); // E6 tone

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  } catch (e) {
    console.error('Audio chime error:', e);
  }
}

/**
 * Play a vintage old clock ringing sound for 5 full seconds on brew completion
 */
export function playCompletionChime(isMuted = false) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const duration = 5.0; // Rings for 5 full seconds
    const startTime = ctx.currentTime;

    // Twin brass bell frequencies of a classic mechanical alarm clock
    const bellFreqs = [1850, 2250];

    bellFreqs.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const tremolo = ctx.createOscillator();
      const tremoloGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      // Rapid mechanical clapper strike (18 strikes per second)
      tremolo.type = 'square';
      tremolo.frequency.setValueAtTime(18, startTime);

      tremoloGain.gain.setValueAtTime(0.4, startTime);
      tremolo.connect(gain.gain);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.setValueAtTime(0.2, startTime + duration - 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      tremolo.start(startTime);
      osc.start(startTime);

      tremolo.stop(startTime + duration);
      osc.stop(startTime + duration);
    });

    // Sub-harmonic warm gong tone under the clapper ring
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(440, startTime);

    subGain.gain.setValueAtTime(0.15, startTime);
    subGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(startTime);
    subOsc.stop(startTime + duration);
  } catch (e) {
    console.error('Completion alarm clock chime error:', e);
  }
}
