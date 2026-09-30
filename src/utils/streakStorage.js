/**
 * The Brew App • Brew Streaks & Achievements Engine
 * Tracks daily brew frequency, consecutive day streaks, and specialty barista achievements.
 */

import { trackEvent } from './analytics.js';

export const STREAK_STORAGE_KEY = 'the_brew_app_streaks_v1';
export const STREAK_UPDATED_EVENT = 'thebrewapp_streak_updated';

export const BADGE_DEFINITIONS = [
  {
    id: 'first_pour',
    title: 'First Pour',
    description: 'Completed your first dialed-in brew session.',
    icon: '☕',
    tier: 'bronze'
  },
  {
    id: 'streak_3',
    title: 'Dial-In Fire',
    description: 'Brewed 3 consecutive days in a row.',
    icon: '🔥',
    tier: 'silver'
  },
  {
    id: 'streak_7',
    title: 'Week of Clarity',
    description: 'Maintained a 7-day specialty brew streak.',
    icon: '⚡',
    tier: 'gold'
  },
  {
    id: 'origin_explorer',
    title: 'Origin Explorer',
    description: 'Explored 3 or more distinct coffee origins or roasters.',
    icon: '🧭',
    tier: 'silver'
  },
  {
    id: 'method_master',
    title: 'Method Master',
    description: 'Brewed with 3 or more distinct brewing methods.',
    icon: '👑',
    tier: 'gold'
  },
  {
    id: 'community_sharer',
    title: 'Community Curator',
    description: 'Shared a public brew card or tasting journal note.',
    icon: '🌐',
    tier: 'bronze'
  }
];

/**
 * Returns streak data and unlocked achievements from localStorage.
 */
export function getStreakData() {
  if (typeof window === 'undefined') {
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastBrewDate: null,
      totalBrews: 0,
      unlockedBadges: [],
      methodsUsed: [],
      roastersUsed: []
    };
  }

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      return {
        currentStreak: 0,
        maxStreak: 0,
        lastBrewDate: null,
        totalBrews: 0,
        unlockedBadges: [],
        methodsUsed: [],
        roastersUsed: []
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read streak data:', err);
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastBrewDate: null,
      totalBrews: 0,
      unlockedBadges: [],
      methodsUsed: [],
      roastersUsed: []
    };
  }
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
function toDateString(d) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Records a completed brew session for streak calculation and evaluates badges.
 * @param {Object} brewInfo
 * @returns {Object} Updated streak data and newly unlocked badge IDs
 */
export function recordBrewForStreak(brewInfo = {}) {
  const currentData = getStreakData();
  const today = new Date();
  const todayStr = toDateString(today);

  let newStreak = currentData.currentStreak || 0;
  const lastDateStr = currentData.lastBrewDate;

  if (!lastDateStr) {
    // First brew ever
    newStreak = 1;
  } else if (lastDateStr === todayStr) {
    // Already brewed today, keep streak
    newStreak = Math.max(1, newStreak);
  } else {
    // Check if last brew was yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = toDateString(yesterday);

    if (lastDateStr === yesterdayStr) {
      newStreak += 1;
    } else {
      // Missed a day: reset streak to 1
      newStreak = 1;
    }
  }

  const maxStreak = Math.max(currentData.maxStreak || 0, newStreak);
  const totalBrews = (currentData.totalBrews || 0) + 1;

  // Track unique methods and roasters
  const methodsUsed = Array.from(new Set([
    ...(currentData.methodsUsed || []),
    brewInfo.methodId || brewInfo.methodName || 'pour_over'
  ]));

  const roastersUsed = Array.from(new Set([
    ...(currentData.roastersUsed || []),
    brewInfo.roaster || 'Specialty Roaster'
  ]));

  // Evaluate badge unlocks
  const existingBadges = new Set(currentData.unlockedBadges || []);
  const newlyUnlocked = [];

  if (!existingBadges.has('first_pour') && totalBrews >= 1) {
    existingBadges.add('first_pour');
    newlyUnlocked.push('first_pour');
  }

  if (!existingBadges.has('streak_3') && newStreak >= 3) {
    existingBadges.add('streak_3');
    newlyUnlocked.push('streak_3');
  }

  if (!existingBadges.has('streak_7') && newStreak >= 7) {
    existingBadges.add('streak_7');
    newlyUnlocked.push('streak_7');
  }

  if (!existingBadges.has('origin_explorer') && roastersUsed.length >= 3) {
    existingBadges.add('origin_explorer');
    newlyUnlocked.push('origin_explorer');
  }

  if (!existingBadges.has('method_master') && methodsUsed.length >= 3) {
    existingBadges.add('method_master');
    newlyUnlocked.push('method_master');
  }

  if (brewInfo.isPublic && !existingBadges.has('community_sharer')) {
    existingBadges.add('community_sharer');
    newlyUnlocked.push('community_sharer');
  }

  const updatedData = {
    currentStreak: newStreak,
    maxStreak,
    lastBrewDate: todayStr,
    totalBrews,
    unlockedBadges: Array.from(existingBadges),
    methodsUsed,
    roastersUsed
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT, { 
        detail: { streakData: updatedData, newlyUnlocked } 
      }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save streak data:', err);
    }
  }

  trackEvent('brew_streak_recorded', {
    currentStreak: newStreak,
    totalBrews,
    unlockedCount: updatedData.unlockedBadges.length
  });

  return {
    streakData: updatedData,
    newlyUnlocked
  };
}
