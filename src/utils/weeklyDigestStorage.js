/**
 * The Brew App • Weekly Barista Digest & Retention Engine
 * Generates personalized weekly brew digests and manages subscription preferences.
 */

import { trackEvent } from './analytics.js';
import { getJournalLogs } from './journalStorage.js';
import { getStreakData } from './streakStorage.js';
import { getFollowedRoasters } from './followRoasterStorage.js';

export const DIGEST_STORAGE_KEY = 'the_brew_app_digest_prefs_v1';
export const DIGEST_UPDATED_EVENT = 'thebrewapp_digest_prefs_updated';

/**
 * Retrieves weekly digest subscription settings.
 */
export function getDigestPreferences() {
  if (typeof window === 'undefined') {
    return {
      isSubscribed: false,
      email: '',
      frequency: 'weekly',
      receivePush: false,
      topics: ['new_recipes', 'weekly_insights', 'roaster_drops']
    };
  }

  try {
    const raw = localStorage.getItem(DIGEST_STORAGE_KEY);
    if (!raw) {
      return {
        isSubscribed: false,
        email: '',
        frequency: 'weekly',
        receivePush: false,
        topics: ['new_recipes', 'weekly_insights', 'roaster_drops']
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read digest preferences:', err);
    return {
      isSubscribed: false,
      email: '',
      frequency: 'weekly',
      receivePush: false,
      topics: ['new_recipes', 'weekly_insights', 'roaster_drops']
    };
  }
}

/**
 * Saves weekly digest subscription settings.
 * @param {Object} prefs 
 */
export function saveDigestPreferences(prefs) {
  const current = getDigestPreferences();
  const updated = { ...current, ...prefs, updatedAt: new Date().toISOString() };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DIGEST_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(DIGEST_UPDATED_EVENT, { detail: updated }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save digest preferences:', err);
    }
  }

  trackEvent('weekly_digest_preferences_saved', {
    isSubscribed: updated.isSubscribed,
    receivePush: updated.receivePush,
    topicCount: updated.topics?.length || 0
  });

  return updated;
}

/**
 * Generates a dynamic, real personalized weekly digest for the user based on real logs.
 */
export function generateWeeklyDigestSummary(currentUser = null) {
  const logs = getJournalLogs();
  const streak = getStreakData();
  const followed = getFollowedRoasters();

  // Filter logs from past 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentLogs = logs.filter(l => (l.timestamp || Date.now()) >= sevenDaysAgo);

  // Calculate top brew method
  const methodCount = {};
  recentLogs.forEach(l => {
    const m = l.methodName || 'Pour Over';
    methodCount[m] = (methodCount[m] || 0) + 1;
  });

  let topMethod = 'Pour Over';
  let maxCount = 0;
  Object.entries(methodCount).forEach(([m, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topMethod = m;
    }
  });

  // Calculate suggestion for "Try This Method Next"
  const allSuggestedMethods = [
    { name: 'AeroPress Inverted', reason: 'High-intensity sweetness and forgiving extraction' },
    { name: 'Kalita Wave 185', reason: 'Flat-bed consistency and chocolate/caramel balance' },
    { name: 'Chemex 6-Cup', reason: 'Extra-clean bonded filters for floral single origins' },
    { name: 'Classic French Press', reason: 'Velvety full-body immersion on quiet mornings' }
  ];
  const suggestedMethod = allSuggestedMethods.find(m => m.name !== topMethod) || allSuggestedMethods[0];

  return {
    weekRange: 'Past 7 Days',
    totalBrewsThisWeek: recentLogs.length,
    currentStreak: streak.currentStreak || 0,
    topMethod: recentLogs.length > 0 ? topMethod : 'Pour Over (Get started!)',
    favoriteRoaster: recentLogs[0]?.roaster || (followed[0]?.name) || 'Methodical Coffee',
    suggestedMethod,
    followedRoastersCount: followed.length,
    newRecipesAvailable: 3,
    digestEmail: currentUser?.email || getDigestPreferences().email || 'your-email@example.com'
  };
}
