// Audio Chime & Windows Fanfare Player for The Brew App

let activeAudioElement = null;
let currentCompletionTimeout = null;
let activeSpeechUtterance = null;

/**
 * Play a rich, authentic mechanical barista / kitchen timer bell chime.
 * Features a sharp physical striker impact click + resonant C6 harmonic bell decay.
 */
export function playTimerStartChime(isMuted = false) {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
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
 * Stop any active speech announcement
 */
export function stopSpeechAnnouncement() {
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
 * Announce phase name and duration via Web Speech API before countdown begins
 * Example: "Bloom Phase, 45 seconds."
 */
export function announcePhase(phaseName = 'Bloom Phase', durationSec = 45, isMuted = false, onComplete) {
  if (isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    return;
  }

  try {
    stopSpeechAnnouncement();

    // Standardize phrase so it cleanly says "Bloom Phase" or "[Name] Phase"
    let cleanName = (phaseName || '').trim();
    if (cleanName.toLowerCase() === 'bloom') {
      cleanName = 'Bloom Phase';
    } else if (
      !cleanName.toLowerCase().includes('phase') && 
      !cleanName.toLowerCase().includes('infusion') && 
      !cleanName.toLowerCase().includes('pour') && 
      !cleanName.toLowerCase().includes('steep')
    ) {
      cleanName = `${cleanName} Phase`;
    }

    const secondsText = `${durationSec} second${durationSec === 1 ? '' : 's'}`;
    const textToSpeak = `${cleanName}, ${secondsText}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    activeSpeechUtterance = utterance;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best natural English voice (prefer high-clarity British or US female voice)
    const voices = window.speechSynthesis.getVoices() || [];
    const chosenVoice = voices.find(v => v.lang.startsWith('en') && (
      v.name.includes('Natural') || 
      v.name.includes('Sonia') || 
      v.name.includes('Female') || 
      v.name.includes('Samantha') || 
      v.name.includes('Google UK English Female') || 
      v.name.includes('Victoria')
    )) || voices.find(v => v.lang.startsWith('en')) || null;

    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    let completed = false;
    const handleFinish = () => {
      if (!completed) {
        completed = true;
        activeSpeechUtterance = null;
        if (onComplete) onComplete();
      }
    };

    utterance.onend = handleFinish;
    utterance.onerror = handleFinish;

    // Safety fallback timeout in case browser speech engine stalls
    setTimeout(handleFinish, 2200);

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech announcement failed:', err);
    if (onComplete) onComplete();
  }
}

/**
 * Play a crisp chime for phase transitions
 */
export function playPhaseChime(isMuted = false) {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

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
 * Play user's tada_original.wav file, repeating exactly 3 times
 */
export function playCompletionChime(isMuted = false) {
  if (isMuted) return;
  
  // Stop any previous playing audio
  stopCompletionChime();

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
        audio.play().catch((err) => {
          console.warn('Repeat audio play failed:', err);
        });
      } else {
        stopCompletionChime();
      }
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio element play failed:', err);
      });
    }

  } catch (e) {
    console.error('Failed to play tada_original.wav:', e);
  }
}
