/**
 * The Brew App • Follow Favorite Roasters System
 * Allows baristas to follow artisan roasters to receive notification flags
 * and prioritized showcase feeds.
 */

import { trackEvent } from './analytics.js';

export const FOLLOWED_ROASTERS_KEY = 'the_brew_app_followed_roasters_v1';
export const FOLLOWED_ROASTERS_EVENT = 'thebrewapp_followed_roasters_updated';

/**
 * Retrieves the list of followed roasters.
 * @returns {Array<Object>} List of { id, name, followedAt }
 */
export function getFollowedRoasters() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FOLLOWED_ROASTERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read followed roasters:', err);
    return [];
  }
}

/**
 * Checks if a roaster is currently followed.
 * @param {string} roasterId 
 * @returns {boolean}
 */
export function isFollowingRoaster(roasterId) {
  if (!roasterId) return false;
  const list = getFollowedRoasters();
  const normalizedId = String(roasterId).toLowerCase();
  return list.some(r => String(r.id).toLowerCase() === normalizedId || String(r.slug).toLowerCase() === normalizedId);
}

/**
 * Toggles follow state for a roaster.
 * @param {string} roasterId 
 * @param {Object} roasterData 
 * @returns {boolean} True if now following, false if unfollowed
 */
export function toggleFollowRoaster(roasterId, roasterData = {}) {
  if (!roasterId) return false;
  const list = getFollowedRoasters();
  const normalizedId = String(roasterId).toLowerCase();
  const isCurrentlyFollowing = list.some(r => String(r.id).toLowerCase() === normalizedId || String(r.slug).toLowerCase() === normalizedId);

  let updatedList;
  let nowFollowing;

  if (isCurrentlyFollowing) {
    updatedList = list.filter(r => String(r.id).toLowerCase() !== normalizedId && String(r.slug).toLowerCase() !== normalizedId);
    nowFollowing = false;
  } else {
    const entry = {
      id: roasterId,
      slug: roasterData.slug || roasterId,
      name: roasterData.name || roasterId,
      city: roasterData.city || '',
      state: roasterData.state || '',
      logoImage: roasterData.logoImage || '',
      monogram: roasterData.monogram || (roasterData.name ? roasterData.name.charAt(0) : 'R'),
      brandColor: roasterData.brandColor || '#C88A4B',
      followedAt: new Date().toISOString()
    };
    updatedList = [entry, ...list];
    nowFollowing = true;
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FOLLOWED_ROASTERS_KEY, JSON.stringify(updatedList));
      window.dispatchEvent(new CustomEvent(FOLLOWED_ROASTERS_EVENT, { 
        detail: { roasterId, nowFollowing, list: updatedList } 
      }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save followed roasters:', err);
    }
  }

  trackEvent('roaster_follow_toggled', {
    roasterId,
    nowFollowing,
    totalFollowed: updatedList.length
  });

  return nowFollowing;
}
