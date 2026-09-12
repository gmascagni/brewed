/**
 * Screen Wake Lock API Utility
 * Prevents mobile devices (iOS 16.4+ & Android Chrome) from dimming or sleeping
 * while the barista is hands-on brewing with the multi-phase countdown timer.
 */

let wakeLockSentinel = null;
let isRequested = false;

export async function requestScreenWakeLock() {
  if (typeof window === 'undefined' || !('wakeLock' in navigator)) {
    return false;
  }

  isRequested = true;

  try {
    if (!wakeLockSentinel || wakeLockSentinel.released) {
      wakeLockSentinel = await navigator.wakeLock.request('screen');
      
      wakeLockSentinel.addEventListener('release', () => {
        wakeLockSentinel = null;
      });
      
      return true;
    }
  } catch (err) {
    // Non-fatal (e.g. low battery mode or tab in background)
    console.warn('Screen WakeLock request declined:', err.message);
    return false;
  }
  return true;
}

export async function releaseScreenWakeLock() {
  isRequested = false;
  if (wakeLockSentinel && !wakeLockSentinel.released) {
    try {
      await wakeLockSentinel.release();
    } catch (e) {}
    wakeLockSentinel = null;
  }
}

// Re-acquire wake lock if tab visibility changes while timer is active
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', async () => {
    if (isRequested && document.visibilityState === 'visible') {
      await requestScreenWakeLock();
    }
  });
}
