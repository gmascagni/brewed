// Audio Chime & Barista Audio Synthesizer for The Brew App

let sharedAudioCtx = null;
let activeAudioElement = null;
let currentCompletionTimeout = null;
let activeSpeechUtterance = null;

/**
 * Get or lazily create a shared Web Audio AudioContext singleton.
 * Automatically handles mobile browser suspension and unlocks on user gesture.
 */
export function getAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
      sharedAudioCtx = new AudioContextClass();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch (e) {
    console.warn('AudioContext initialization failed:', e);
    return null;
  }
}

/**
 * Proactively unlock Web Audio on touch / click (critical for iOS Safari & Android Chrome)
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

/**
 * Ensure AudioContext is actively resumed and running before scheduling nodes.
 */
export async function ensureAudioContextRunning() {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch (e) {
      console.warn('AudioContext resume error:', e);
    }
  }
  return ctx;
}

/**
 * Play an authentic tactile mechanical micro-switch click on button / dial interactions.
 * Simulates physical click-wheel and spring switch feedback.
 */
export function playMechanicalClick(isMuted = false) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // High transient snap (plastic/metal switch contact)
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(4200, now);
    snapOsc.frequency.exponentialRampToValueAtTime(300, now + 0.008);

    snapGain.gain.setValueAtTime(0.35, now);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);

    snapOsc.start(now);
    snapOsc.stop(now + 0.012);

    // Subtle switch body thud
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(480, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(90, now + 0.015);

    bodyGain.gain.setValueAtTime(0.20, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    bodyOsc.start(now);
    bodyOsc.stop(now + 0.02);
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Play authentic clockwork ticking sound for every second of countdown.
 * Simulates the mechanical escapement wheel of a high-end physical kitchen/barista timer.
 * Alternates frequency slightly (tick-tock) for realistic clockwork rhythm.
 */
export function playClockTick(isMuted = false, tickNumber = 0) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const isEven = (tickNumber % 2) === 0;
    const clickFreq = isEven ? 2600 : 1950;
    const bodyFreq = isEven ? 360 : 300;

    // Escapement pallet click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(clickFreq, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.007);

    clickGain.gain.setValueAtTime(0.26, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.01);

    // Mechanical escapement body resonance
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(bodyFreq, now);
    thudOsc.frequency.exponentialRampToValueAtTime(70, now + 0.018);

    thudGain.gain.setValueAtTime(0.18, now);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);

    thudOsc.start(now);
    thudOsc.stop(now + 0.022);
  } catch (e) {
    // Non-blocking
  }
}

/**
 * Play a rich, authentic mechanical barista / kitchen timer bell chime.
 * Features a sharp physical striker impact click + resonant C6 harmonic bell decay.
 */
export function playTimerStartChime(isMuted = false) {
  if (isMuted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Master output bus
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    masterGain.connect(ctx.destination);

    // Harmonic bell partials (C6 fundamental ~1046.5 Hz with authentic inharmonic metal overtones)
    const bellPartials = [
      { freq: 1046.5, gain: 0.40, decay: 1.6, type: 'sine' },      // Fundamental strike (C6)
      { freq: 1051.0, gain: 0.30, decay: 1.4, type: 'sine' },      // Acoustic beating shimmer
      { freq: 1318.5, gain: 0.22, decay: 1.1, type: 'sine' },      // Tierce / Major third (E6)
      { freq: 1568.0, gain: 0.18, decay: 0.9, type: 'sine' },      // Quint / Perfect fifth (G6)
      { freq: 2093.0, gain: 0.15, decay: 0.7, type: 'sine' },      // Nominal / Octave (C7)
      { freq: 2793.8, gain: 0.10, decay: 0.45, type: 'sine' },     // High overtone (F7)
      { freq: 4186.0, gain: 0.05, decay: 0.25, type: 'triangle' }  // Top chime sparkle (C8)
    ];

    bellPartials.forEach(({ freq, gain, decay, type }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Rapid attack, realistic exponential metal ring-out
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gain, now + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(g);
      g.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.05);
    });

    // Mechanical hammer striker click (simulates the physical spring striker hitting brass)
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(3400, now);
    clickOsc.frequency.exponentialRampToValueAtTime(250, now + 0.025);

    clickGain.gain.setValueAtTime(0.35, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    clickOsc.connect(clickGain);
    clickGain.connect(masterGain);

    clickOsc.start(now);
    clickOsc.stop(now + 0.03);

  } catch (e) {
    console.warn('Real timer chime error:', e);
  }
}

/**
 * Stop any active voice announcement or audio element
 */
export function stopSpeechAnnouncement() {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      // ignore
    }
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
  activeSpeechUtterance = null;
}

/**
 * Announce phase name and duration clearly.
 * Prioritizes pre-rendered studio British female voice MP3s (/audio/timer/<slug>.mp3)
 * with robust, resilient fallback to Web Speech API (with Chromium resume() fix).
 * NEVER blocks timer countdown or UI execution.
 * Example: "Bloom Phase, 45 seconds."
 */
export function announcePhase(phaseName = 'Bloom Phase', durationSec = 45, isMuted = false, onComplete) {
  if (isMuted || typeof window === 'undefined') {
    if (onComplete) onComplete();
    return;
  }

  // Clean up any ongoing announcement
  stopSpeechAnnouncement();

  let cleanName = (phaseName || '').trim();
  if (cleanName.toLowerCase() === 'bloom') {
    cleanName = 'Bloom Phase';
  } else if (
    !cleanName.toLowerCase().includes('phase') && 
    !cleanName.toLowerCase().includes('infusion') && 
    !cleanName.toLowerCase().includes('pour') && 
    !cleanName.toLowerCase().includes('steep') &&
    !cleanName.toLowerCase().includes('rest') &&
    !cleanName.toLowerCase().includes('simmer') &&
    !cleanName.toLowerCase().includes('preheat') &&
    !cleanName.toLowerCase().includes('complete')
  ) {
    cleanName = `${cleanName} Phase`;
  }

  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  let finished = false;
  const safeFinish = () => {
    if (!finished) {
      finished = true;
      activeAudioElement = null;
      activeSpeechUtterance = null;
      if (onComplete) onComplete();
    }
  };

  // Fallback Web Speech Synthesizer implementation
  const fallbackToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      safeFinish();
      return;
    }

    try {
      // Unstick Chrome speech synthesis queue if paused
      try { window.speechSynthesis.resume(); } catch (e) {}

      const secondsText = `${durationSec} second${durationSec === 1 ? '' : 's'}`;
      const textToSpeak = `${cleanName}, ${secondsText}.`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select best voice (prefer British or US female voice)
      const voices = window.speechSynthesis.getVoices() || [];
      const chosenVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (
        v.name.includes('Natural') || 
        v.name.includes('Sonia') || 
        v.name.includes('Female') || 
        v.name.includes('Samantha') || 
        v.name.includes('Google UK English Female') || 
        v.name.includes('Victoria')
      )) || voices.find(v => v.lang && v.lang.startsWith('en')) || null;

      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onend = safeFinish;
      utterance.onerror = safeFinish;

      // Safety timeout: ensure callback always fires even if engine hangs
      setTimeout(safeFinish, 2800);

      activeSpeechUtterance = utterance;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch {
            safeFinish();
          }
        }, 50);
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      safeFinish();
    }
  };

  // 1. First attempt: Load and play pre-rendered studio voice MP3
  try {
    const mp3Path = `/audio/timer/${slug}.mp3`;
    const audio = new Audio(mp3Path);
    audio.volume = 1.0;
    activeAudioElement = audio;

    audio.onended = safeFinish;
    audio.onerror = () => {
      // If MP3 fails to load, gracefully fall back to speech synthesis
      fallbackToSpeech();
    };

    // Failsafe timeout in case audio takes too long
    setTimeout(() => {
      if (!finished && audio && audio.paused) {
        fallbackToSpeech();
      }
    }, 1200);

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((e) => {
        // Autoplay policy or format error -> fall back to speech
        fallbackToSpeech();
      });
    }
  } catch (err) {
    fallbackToSpeech();
  }
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
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);

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
 * Stop any playing completion sound
 */
export function stopCompletionChime() {
  if (currentCompletionTimeout) {
    clearTimeout(currentCompletionTimeout);
    currentCompletionTimeout = null;
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {
      console.error('Error stopping audio:', e);
    }
    activeAudioElement = null;
  }
}

/**
 * Play extraction celebration sound.
 * Uses Web Audio API synthesization (guaranteed on mobile iOS/Android) alongside tada_original.wav.
 */
export function playCompletionChime(isMuted = false) {
  if (isMuted) return;
  
  // Stop any previous playing audio
  stopCompletionChime();

  // 1. Synthesize resonant triumphant chord via Web Audio API (Guaranteed on mobile devices)
  try {
    const ctx = getAudioContext();
    if (ctx) {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 1.2 },  // C5
        { freq: 659.25, time: 0.12, dur: 1.2 }, // E5
        { freq: 783.99, time: 0.24, dur: 1.4 }, // G5
        { freq: 1046.50, time: 0.36, dur: 2.5 } // C6 (High ringing chime)
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        g.gain.setValueAtTime(0.0001, now + time);
        g.gain.exponentialRampToValueAtTime(0.25, now + time + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);

        osc.connect(g);
        g.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });
    }
  } catch (e) {
    console.warn('Web Audio completion fanfare error:', e);
  }

  // 2. Play HTML5 Audio file tada_original.wav with repeat logic
  try {
    const audio = new Audio('/tada_original.wav');
    audio.loop = false;
    audio.volume = 0.85;

    activeAudioElement = audio;

    let playCount = 0;
    const MAX_REPEATS = 3;

    audio.addEventListener('ended', () => {
      playCount += 1;
      if (playCount < MAX_REPEATS) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        stopCompletionChime();
      }
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Expected on iOS mobile if backgrounded without immediate gesture
      });
    }
  } catch (e) {
    // Handled by Web Audio synthesis
  }
}
