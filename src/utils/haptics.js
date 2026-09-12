/**
 * Mobile Sensory Haptics Engine
 * Provides subtle tactile feedback on mobile operations (Android & supported mobile browsers).
 */

export function canVibrate() {
  return typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function';
}

/**
 * Subtle tap click (15ms)
 */
export function hapticTap() {
  if (canVibrate()) {
    try {
      navigator.vibrate(15);
    } catch (e) {}
  }
}

/**
 * Confident timer start / pause trigger (40ms)
 */
export function hapticStart() {
  if (canVibrate()) {
    try {
      navigator.vibrate(40);
    } catch (e) {}
  }
}

/**
 * Dual pulse on timer phase advancement (e.g. bloom complete -> start pour)
 */
export function hapticPhaseChange() {
  if (canVibrate()) {
    try {
      navigator.vibrate([50, 40, 60]);
    } catch (e) {}
  }
}

/**
 * Celebration rhythmic pulse upon brew completion
 */
export function hapticComplete() {
  if (canVibrate()) {
    try {
      navigator.vibrate([100, 50, 150, 50, 250]);
    } catch (e) {}
  }
}

/**
 * Camera barcode / Smart Bag QR decode confirmation (50ms)
 */
export function hapticScan() {
  if (canVibrate()) {
    try {
      navigator.vibrate(50);
    } catch (e) {}
  }
}
