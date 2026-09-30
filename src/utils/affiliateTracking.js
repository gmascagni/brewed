/**
 * The Brew App • Marketplace Affiliate & Outbound Purchase Tracking
 * Supports Amazon ASIN equipment tags and direct partner roaster webshop referrals.
 */

import { trackEvent } from './analytics.js';

export const AMAZON_AFFILIATE_TAG = 'thebrewapp-20';
export const AFFILIATE_CLICKS_STORAGE_KEY = 'the_brew_app_affiliate_clicks_v1';

/**
 * Builds a tracked outbound referral or affiliate URL.
 * 
 * @param {string} url - Target store or product URL
 * @param {string} brandOrRoaster - Name of the roaster, brand, or merchant
 * @param {string} context - Source context (e.g. 'roaster_showcase', 'discovery_feed', 'gear_catalog')
 * @returns {string} Tracked URL
 */
export function buildAffiliateUrl(url, brandOrRoaster = 'Specialty Roaster', context = 'marketplace') {
  if (!url || typeof url !== 'string') return '#';

  const clean = url.trim();

  // 1. Amazon Equipment & Gear Affiliate Links
  if (clean.includes('amazon.com') || clean.includes('amzn.to')) {
    try {
      const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
      parsed.searchParams.set('tag', AMAZON_AFFILIATE_TAG);
      return parsed.toString();
    } catch {
      return clean.includes('?') 
        ? `${clean}&tag=${AMAZON_AFFILIATE_TAG}` 
        : `${clean}?tag=${AMAZON_AFFILIATE_TAG}`;
    }
  }

  // 2. Direct Specialty Coffee Roaster Webshops
  try {
    const parsed = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    parsed.searchParams.set('utm_source', 'thebrewapp');
    parsed.searchParams.set('utm_medium', 'marketplace');
    parsed.searchParams.set('utm_campaign', 'bag_purchase');
    parsed.searchParams.set('ref', 'thebrewapp');
    return parsed.toString();
  } catch {
    const sep = clean.includes('?') ? '&' : '?';
    return `${clean}${sep}utm_source=thebrewapp&utm_medium=marketplace&utm_campaign=bag_purchase&ref=thebrewapp`;
  }
}

/**
 * Tracks an outbound purchase click in analytics and local telemetry.
 */
export function trackOutboundPurchaseClick(roaster, coffee, rawUrl, context = 'marketplace') {
  const trackedUrl = buildAffiliateUrl(rawUrl, roaster?.name || roaster, context);

  // Analytics event
  trackEvent('marketplace_buy_click', {
    roaster: typeof roaster === 'string' ? roaster : (roaster?.name || 'Specialty Roaster'),
    coffeeName: coffee?.beanName || coffee?.name || 'Whole Bean Coffee',
    url: trackedUrl,
    context
  });

  // Local telemetry log
  if (typeof window !== 'undefined') {
    try {
      const existingRaw = localStorage.getItem(AFFILIATE_CLICKS_STORAGE_KEY);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      list.unshift({
        id: `click_${Date.now()}`,
        roaster: typeof roaster === 'string' ? roaster : (roaster?.name || 'Specialty Roaster'),
        coffeeName: coffee?.beanName || coffee?.name || 'Whole Bean Coffee',
        url: trackedUrl,
        timestamp: new Date().toISOString(),
        context
      });
      localStorage.setItem(AFFILIATE_CLICKS_STORAGE_KEY, JSON.stringify(list.slice(0, 50)));
    } catch (e) {
      console.warn('Failed to record affiliate click locally:', e);
    }
  }

  return trackedUrl;
}

/**
 * Retrieves local history of outbound affiliate/purchase clicks.
 */
export function getAffiliateClicks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AFFILIATE_CLICKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
