// Web Audio API Synthesizer for The Brew App

let audioCtx = null;
let currentCompletionTimeout = null;

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
 * Play a crisp chime for phase transitions
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
 * Helper to play 1 instance of the Windows Fanfare "Tada!" sound motif
 */

export function stopCompletionChime() {
  if (currentCompletionTimeout) {
    clearTimeout(currentCompletionTimeout);
    currentCompletionTimeout = null;
  }
}

export function playTadaMotif(ctx, startTime) {
  // Fanfare Arpeggio: C4 -> E4 -> G4 -> C5 -> Held Triumphant Chord (C5, E5, G5, C6)
  const arpeggioNotes = [
    { freq: 261.63, timeOffset: 0.00, dur: 0.08 }, // C4
    { freq: 329.63, timeOffset: 0.08, dur: 0.08 }, // E4
    { freq: 392.00, timeOffset: 0.16, dur: 0.08 }, // G4
    { freq: 523.25, timeOffset: 0.24, dur: 0.08 }  // C5
  ];

  // Quick Staccato Arpeggio
  arpeggioNotes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.freq, startTime + note.timeOffset);

    gain.gain.setValueAtTime(0.25, startTime + note.timeOffset);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.timeOffset + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime + note.timeOffset);
    osc.stop(startTime + note.timeOffset + note.dur + 0.02);
  });

  // Triumphant Held Brass Fanfare Chord (C5, E5, G5, C6) starting at 0.32s
  const chordFreqs = [523.25, 659.25, 783.99, 1046.50];
  const chordStart = startTime + 0.30;
  const chordDuration = 1.1;

  chordFreqs.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();

    // Brass Sawtooth/Triangle Blend
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, chordStart);

    // Warm Fanfare Vibrato
    vibrato.type = 'sine';
    vibrato.frequency.setValueAtTime(6, chordStart); // 6 Hz vibrato
    vibratoGain.gain.setValueAtTime(4, chordStart);
    vibrato.connect(osc.frequency);

    // Volume Envelope: Triumphant attack, sustained swell, elegant decay
    gain.gain.setValueAtTime(0.001, chordStart);
    gain.gain.linearRampToValueAtTime(0.18, chordStart + 0.06);
    gain.gain.setValueAtTime(0.18, chordStart + chordDuration - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, chordStart + chordDuration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    vibrato.start(chordStart);
    osc.start(chordStart);

    vibrato.stop(chordStart + chordDuration);
    osc.stop(chordStart + chordDuration);
  });
}

/**
 * Play the Windows Fanfare "Tada!" sound repeating over 10 full seconds on brew completion
 */
export function playCompletionChime(isMuted = false) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopCompletionChime();

    const repeatIntervalSec = 1.6; // Time between Tada fanfares
    const totalDurationSec = 10.0; // Rings & repeats for 10 full seconds
    const repetitions = Math.floor(totalDurationSec / repeatIntervalSec);

    for (let i = 0; i < repetitions; i++) {
      const motifStartTime = ctx.currentTime + (i * repeatIntervalSec);
      playTadaMotif(ctx, motifStartTime);
    }
  } catch (e) {
    console.error('Windows Tada Fanfare audio error:', e);
  }
}
