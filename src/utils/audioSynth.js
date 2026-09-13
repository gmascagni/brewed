// Audio Chime & Barista Audio Synthesizer for The Brew App
import { getAssetUrl } from './assetUrl';

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
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch (e) {}
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
 * Dual-engine: plays direct WAV sample + Web Audio synthesization for guaranteed sound.
 */
export function playMechanicalClick(isMuted = false) {
  if (isMuted) return;
  
  // 1. Direct HTML5 audio playback (immune to AudioContext suspension)
  try {
    const audio = new Audio(getAssetUrl('/audio/timer/mechanical_click.wav'));
    audio.volume = 0.9;
    const p = audio.play();
    if (p !== undefined) p.catch(() => {});
  } catch (e) {}

  // 2. Web Audio micro-switch synthesis fallback
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

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
  } catch (e) {}
}

let tickAudioInstance = null;
let isSpeakingAnnouncement = false;
let announcementTimeout = null;

/**
 * Returns whether speech announcement is currently active.
 */
export function isAnnouncementActive() {
  return isSpeakingAnnouncement;
}

/**
 * Play authentic clockwork ticking sound for every second of countdown.
 * Dual-engine: plays direct WAV sample + Web Audio escapement pulse.
 * As the time is clicking, speech audio plays smoothly over speakers concurrently.
 */
export function playClockTick(isMuted = false, tickNumber = 0) {
  if (isMuted) return;

  // 1. Direct HTML5 audio tick playback
  // CRITICAL MOBILE STABILITY: When a voice instruction is currently speaking aloud,
  // do NOT call tickAudioInstance.play(). On iOS Safari & Android Chrome, triggering a second
  // HTMLAudioElement immediately aborts the active speech stream!
  // Instead, the Web Audio escapement pulse below continues ticking smoothly without interruption.
  if (!isSpeakingAnnouncement) {
    try {
      if (!tickAudioInstance) {
        tickAudioInstance = new Audio(getAssetUrl('/audio/timer/clock_tick.wav'));
      }
      tickAudioInstance.currentTime = 0;
      tickAudioInstance.volume = 0.85;
      const p = tickAudioInstance.play();
      if (p !== undefined) p.catch(() => {});
    } catch (e) {}
  }

  // 2. Web Audio escapement pulse (Always runs concurrently, never interrupts or cancels speech)
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const isEven = (tickNumber % 2) === 0;
    const clickFreq = isEven ? 2600 : 1950;

    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(clickFreq, now);
    clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.007);

    // Subtle gain ducking while voice is speaking so instruction is 100% crystal clear
    const gainLevel = isSpeakingAnnouncement ? 0.16 : 0.26;
    clickGain.gain.setValueAtTime(gainLevel, now);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    clickOsc.start(now);
    clickOsc.stop(now + 0.01);
  } catch (e) {}
}

/**
 * Play a rich, authentic mechanical barista / kitchen timer bell chime.
 * Dual-engine: plays high-definition timer_chime.wav + Web Audio C6 harmonic bell.
 */
export function playTimerStartChime(isMuted = false) {
  if (isMuted) return;

  // 1. Direct HTML5 audio playback (Guaranteed on mobile phone & computer speakers)
  try {
    const audio = new Audio(getAssetUrl('/audio/timer/timer_chime.wav'));
    audio.volume = 1.0;
    const p = audio.play();
    if (p !== undefined) p.catch(() => {});
  } catch (e) {}

  // 2. Web Audio brass bell strike synthesis
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const playBell = () => {
      try {
        const now = ctx.currentTime;
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.85, now);
        masterGain.connect(ctx.destination);

        const bellPartials = [
          { freq: 1046.5, gain: 0.40, decay: 1.6, type: 'sine' },
          { freq: 1051.0, gain: 0.30, decay: 1.4, type: 'sine' },
          { freq: 1318.5, gain: 0.22, decay: 1.1, type: 'sine' },
          { freq: 1568.0, gain: 0.18, decay: 0.9, type: 'sine' },
          { freq: 2093.0, gain: 0.15, decay: 0.7, type: 'sine' },
          { freq: 2793.8, gain: 0.10, decay: 0.45, type: 'sine' },
          { freq: 4186.0, gain: 0.05, decay: 0.25, type: 'triangle' }
        ];

        bellPartials.forEach(({ freq, gain, decay, type }) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(gain, now + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, now + decay);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + decay + 0.05);
        });
      } catch (err) {}
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(playBell).catch(() => {});
    } else {
      playBell();
    }
  } catch (e) {}
}

/**
 * Lookup map of pre-rendered studio instruction audio files and their hardcoded duration in seconds.
 * Extracted from /audio/timer/instructions/manifest.json.
 * If an active phase's durationSec does not match the pre-rendered audio, the MP3 must NOT be played,
 * as doing so would cause the audio voice to announce an incorrect duration (e.g. 45s when timer is 55s).
 */
export const INSTRUCTION_AUDIO_DURATIONS = {
  classic_pour_over_0: 45,
  classic_pour_over_1: 45,
  classic_pour_over_2: 45,
  classic_pour_over_3: 60,
  pour_over_0: 45,
  pour_over_1: 60,
  pour_over_2: 75,
  chemex_0: 45,
  chemex_1: 90,
  chemex_2: 105,
  french_press_0: 240,
  french_press_1: 30,
  french_press_2: 300,
  drip_brewer_0: 30,
  drip_brewer_1: 180,
  drip_brewer_2: 60,
  moka_pot_0: 30,
  moka_pot_1: 180,
  moka_pot_2: 45,
  espresso_0: 8,
  espresso_1: 25,
  aeropress_0: 60,
  aeropress_1: 30,
  aeropress_2: 30,
  darjeeling_tea_0: 15,
  darjeeling_tea_1: 180,
  darjeeling_tea_2: 30,
  chai_masala_0: 240,
  chai_masala_1: 120,
  chai_masala_2: 30,
  english_breakfast_0: 15,
  english_breakfast_1: 240,
  english_breakfast_2: 30,
  earl_grey_0: 15,
  earl_grey_1: 210,
  earl_grey_2: 30,
  green_tea_0: 15,
  green_tea_1: 120,
  green_tea_2: 90,
  matcha_tea_0: 20,
  matcha_tea_1: 15,
  matcha_tea_2: 45,
  oolong_tea_0: 10,
  oolong_tea_1: 45,
  oolong_tea_2: 60,
  ceylon_tea_0: 15,
  ceylon_tea_1: 210,
  ceylon_tea_2: 30,
  white_tea_0: 15,
  white_tea_1: 180,
  white_tea_2: 30,
  turmeric_tea_0: 15,
  turmeric_tea_1: 300,
  turmeric_tea_2: 30
};

let activeSpeechTimeout = null;

/**
 * Stop any active voice announcement or audio element
 */
export function stopSpeechAnnouncement() {
  if (announcementTimeout) {
    clearTimeout(announcementTimeout);
    announcementTimeout = null;
  }
  if (activeSpeechTimeout) {
    clearTimeout(activeSpeechTimeout);
    activeSpeechTimeout = null;
  }
  isSpeakingAnnouncement = false;
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  activeSpeechUtterance = null;
}

/**
 * Announce phase name, duration, and the Active Extraction Instruction clearly.
 * Prioritizes pre-rendered studio British female voice MP3s (/audio/timer/instructions/<method>_phase_<idx>.mp3)
 * ONLY when durationSec matches the recorded duration in the audio file.
 * When durationSec is scaled (e.g. 55s bloom for large doses, 35s for small doses) or custom,
 * dynamically synthesizes using Web Speech API to guarantee voice matches the visual timer countdown 100%.
 * NEVER blocks timer countdown or UI execution.
 * Example: "Bloom Phase, 55 seconds. Saturate grounds evenly with 165g water..."
 */
export function announcePhase(
  phaseName = 'Bloom Phase', 
  durationSec = 45, 
  isMuted = false, 
  onComplete,
  instruction = '',
  methodId = '',
  phaseIdx = 0
) {
  if (isMuted || typeof window === 'undefined') {
    if (onComplete) onComplete();
    return;
  }

  // Clean up any ongoing announcement
  stopSpeechAnnouncement();

  const rawName = (phaseName || '').trim();
  const rawInstruction = (instruction || '').trim();
  const slug = rawName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

  let finished = false;
  const safeFinish = () => {
    if (!finished) {
      finished = true;
      if (activeSpeechTimeout) {
        clearTimeout(activeSpeechTimeout);
        activeSpeechTimeout = null;
      }
      isSpeakingAnnouncement = false;
      activeAudioElement = null;
      activeSpeechUtterance = null;
      if (onComplete) onComplete();
    }
  };

  // Format duration text dynamically
  let durText;
  if (durationSec >= 60 && durationSec % 60 === 0) {
    const mins = Math.floor(durationSec / 60);
    durText = mins === 1 ? '1 minute' : `${mins} minutes`;
  } else {
    durText = `${durationSec} second${durationSec === 1 ? '' : 's'}`;
  }

  // Full spoken phrase with Active Extraction Instruction
  const textToSpeak = rawInstruction
    ? `${rawName}, ${durText}. ${rawInstruction}`
    : `${rawName}, ${durText}.`;

  isSpeakingAnnouncement = true;

  // Check if there is an exact matching pre-recorded studio instruction MP3
  const instructionKey = (methodId && phaseIdx !== undefined && phaseIdx !== null)
    ? `${methodId}_${phaseIdx}`
    : '';
  const recordedDuration = instructionKey ? INSTRUCTION_AUDIO_DURATIONS[instructionKey] : undefined;
  const isExactDurationMatch = (recordedDuration !== undefined) && (Number(durationSec) === Number(recordedDuration));

  // Fallback Web Speech Synthesizer implementation for scaled/custom durations
  const fallbackToSpeech = () => {
    if (!('speechSynthesis' in window)) {
      playTitleAudioOnly();
      return;
    }

    try {
      try { window.speechSynthesis.resume(); } catch (e) {}

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

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

      // Timeout scaled by length of spoken text (allows long instructions to finish)
      const maxMs = Math.max(6000, textToSpeak.length * 90);
      activeSpeechTimeout = setTimeout(safeFinish, maxMs);

      activeSpeechUtterance = utterance;

      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setTimeout(() => {
          try { window.speechSynthesis.speak(utterance); } catch { playTitleAudioOnly(); }
        }, 50);
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      playTitleAudioOnly();
    }
  };

  const playTitleAudioOnly = () => {
    // Only play title MP3 if available (e.g. /audio/timer/bloom_phase.mp3), which has no duration numbers
    const titleUrl = getAssetUrl(`/audio/timer/${slug}.mp3`);
    try {
      const audio = new Audio(titleUrl);
      audio.volume = 1.0;
      activeAudioElement = audio;
      audio.onended = safeFinish;
      audio.onerror = safeFinish;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(safeFinish);
      }
    } catch (err) {
      safeFinish();
    }
  };

  // 280ms pleasant stagger: allows the brass bell chime to ding first,
  // then speaks the Active Extraction Instruction clearly over speakers without audio engine collisions.
  announcementTimeout = setTimeout(() => {
    announcementTimeout = null;

    if (isExactDurationMatch) {
      // The studio MP3 matches the countdown timer duration down to the second!
      const candidateUrl = getAssetUrl(`/audio/timer/instructions/${methodId}_phase_${phaseIdx}.mp3`);
      try {
        const audio = new Audio(candidateUrl);
        audio.volume = 1.0;
        activeAudioElement = audio;

        audio.onended = safeFinish;
        audio.onerror = () => {
          fallbackToSpeech();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('[AudioSynth] Studio instruction MP3 failed, falling back to speech:', err);
            fallbackToSpeech();
          });
        }
      } catch (err) {
        fallbackToSpeech();
      }
    } else {
      // Dynamic duration (e.g. 55s bloom for large doses, 35s for small doses, custom roaster recipes).
      // Speak the exact duration dynamically so voice matches the countdown timer 100%!
      fallbackToSpeech();
    }
  }, 280);
}

/**
 * Replay or speak the Active Extraction Instruction on demand.
 */
export function speakActiveInstruction(instruction, phaseName = '', isMuted = false, onComplete) {
  if (isMuted || !instruction || typeof window === 'undefined') {
    if (onComplete) onComplete();
    return;
  }
  stopSpeechAnnouncement();

  const textToSpeak = phaseName ? `${phaseName}. ${instruction}` : instruction;
  if (!('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }

  try {
    try { window.speechSynthesis.resume(); } catch (e) {}

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 1.02;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const chosenVoice = voices.find(v => v.lang && v.lang.startsWith('en') && (
      v.name.includes('Natural') || 
      v.name.includes('Sonia') || 
      v.name.includes('Female')
    )) || null;

    if (chosenVoice) utterance.voice = chosenVoice;

    utterance.onend = () => {
      activeSpeechUtterance = null;
      if (onComplete) onComplete();
    };
    utterance.onerror = () => {
      activeSpeechUtterance = null;
      if (onComplete) onComplete();
    };

    activeSpeechUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    if (onComplete) onComplete();
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
