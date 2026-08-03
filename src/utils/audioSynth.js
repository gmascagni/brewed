// Audio Chime & Windows Fanfare Player for The Brew App

let activeAudioElement = null;
let currentCompletionTimeout = null;

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
 * Stop any playing completion sound or 10-second timer
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
 * Play user's tada_original.wav file, repeating over 10 full seconds
 */
export function playCompletionChime(isMuted = false) {
  if (isMuted) return;
  
  // Stop any previous playing audio
  stopCompletionChime();

  try {
    const audio = new Audio('./tada_original.wav');
    audio.loop = true;
    audio.volume = 0.85;

    activeAudioElement = audio;

    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio element play failed, falling back to Web Audio:', err);
      });
    }

    // Stop automatically after 10 full seconds (10,000 ms)
    currentCompletionTimeout = setTimeout(() => {
      stopCompletionChime();
    }, 10000);

  } catch (e) {
    console.error('Failed to play tada_original.wav:', e);
  }
}
