/**
 * The Brew App • Café Check-In & "Brewed Here" Social Signal System
 * Allows baristas to log visits, check-ins, and brews at artisan cafes and roastery labs.
 */

import { trackEvent } from './analytics.js';

export const CAFE_CHECKINS_STORAGE_KEY = 'the_brew_app_cafe_checkins_v1';
export const CAFE_CHECKIN_EVENT = 'thebrewapp_cafe_checked_in';

/**
 * Retrieves all cafe check-ins from localStorage.
 * @returns {Array<Object>} List of check-in records
 */
export function getAllCafeCheckIns() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CAFE_CHECKINS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read cafe check-ins from localStorage:', err);
    return [];
  }
}

/**
 * Retrieves check-ins for a specific cafe ID.
 * @param {string} cafeId 
 * @returns {Array<Object>}
 */
export function getCafeCheckIns(cafeId) {
  if (!cafeId) return [];
  const all = getAllCafeCheckIns();
  return all.filter(c => c.cafeId === cafeId);
}

/**
 * Checks if current user/guest has checked in to a cafe.
 * @param {string} cafeId 
 * @param {Object|null} currentUser 
 * @returns {boolean}
 */
export function hasUserCheckedIn(cafeId, currentUser = null) {
  if (!cafeId) return false;
  const checkIns = getCafeCheckIns(cafeId);
  const userIdentifier = currentUser?.uid || currentUser?.email || 'guest';
  return checkIns.some(c => c.userId === userIdentifier);
}

/**
 * Records a new check-in / "Brewed Here" social signal for a cafe.
 * 
 * @param {Object} checkInData 
 * @param {Object|null} currentUser 
 * @returns {Object} Saved check-in record
 */
export function recordCafeCheckIn(checkInDataOrId, cafeNameOrUser = null, options = {}) {
  let cafeId = '';
  let cafeName = 'Specialty Coffee Bar';
  let city = '';
  let brewMethod = 'pour_over';
  let tastingNote = 'Craft extraction on bar';
  let rating = 5;
  let currentUser = null;

  if (typeof checkInDataOrId === 'object' && checkInDataOrId !== null) {
    cafeId = checkInDataOrId.cafeId;
    cafeName = checkInDataOrId.cafeName || 'Specialty Coffee Bar';
    city = checkInDataOrId.city || '';
    brewMethod = checkInDataOrId.brewMethod || 'pour_over';
    tastingNote = checkInDataOrId.tastingNote || 'Craft extraction on bar';
    rating = checkInDataOrId.rating || 5;
    currentUser = cafeNameOrUser;
  } else {
    cafeId = String(checkInDataOrId);
    if (typeof cafeNameOrUser === 'string') {
      cafeName = cafeNameOrUser;
    }
    if (typeof options === 'object' && options !== null) {
      currentUser = options.user || options.currentUser || null;
      city = options.city || '';
      brewMethod = options.brewMethod || 'pour_over';
      tastingNote = options.tastingNote || 'Craft extraction on bar';
      rating = options.rating || 5;
    }
  }

  if (!cafeId) {
    throw new Error('Cafe ID is required to record check-in.');
  }

  const userIdentifier = currentUser?.uid || currentUser?.email || 'guest';
  const userName = currentUser?.displayName || currentUser?.username || 'Barista Guest';

  const newRecord = {
    id: `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    cafeId,
    cafeName,
    city,
    userId: userIdentifier,
    userName,
    userRole: currentUser?.role || 'barista',
    timestamp: new Date().toISOString(),
    brewMethod,
    tastingNote,
    rating
  };

  const existing = getAllCafeCheckIns();
  const updated = [newRecord, ...existing];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(CAFE_CHECKINS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(CAFE_CHECKIN_EVENT, { detail: newRecord }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save cafe check-in to localStorage:', err);
    }
  }

  trackEvent('cafe_brewed_here_checkin', {
    cafeId,
    cafeName,
    city,
    brewMethod
  });

  return newRecord;
}

/**
 * Computes social stats for a cafe (total check-ins, recent visit, etc.)
 * @param {string} cafeId 
 * @param {number} baseCuratedCount - initial social seed for curated showcase cafes
 * @returns {Object}
 */
export function getCafeSocialStats(cafeId, baseCuratedCount = 12) {
  const localCheckIns = getCafeCheckIns(cafeId);
  const totalCount = baseCuratedCount + localCheckIns.length;
  const latestLocal = localCheckIns[0] || null;

  return {
    totalCheckIns: totalCount,
    localCheckInsCount: localCheckIns.length,
    latestCheckIn: latestLocal,
    hasCheckedIn: localCheckIns.length > 0
  };
}
