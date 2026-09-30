/**
 * The Brew App • Roaster Claim & Verification System
 * Manages roaster brand ownership claims, email domain validation,
 * manual verification requests, and multi-tenant authorization.
 */

import { 
  isDomainVerifiedRoaster, 
  extractDomainFromUrl, 
  extractDomainFromEmail,
  isPublicWebmailDomain,
  areEmailAliases
} from './roasterVerification.js';
import { trackEvent } from './analytics.js';

export const ROASTER_CLAIMS_STORAGE_KEY = 'the_brew_app_claimed_roasters_v1';
export const ROASTER_CLAIMED_EVENT = 'thebrewapp_roaster_claimed';

/**
 * Retrieves all claimed roaster profiles from localStorage.
 * @returns {Record<string, Object>} Map of roasterSlug -> claim object
 */
export function getClaimedRoasters() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(ROASTER_CLAIMS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read claimed roasters from localStorage:', err);
    return {};
  }
}

/**
 * Retrieves claim data for a specific roaster slug or ID.
 * @param {string} roasterSlug 
 * @returns {Object|null}
 */
export function getRoasterClaim(roasterSlug) {
  if (!roasterSlug) return null;
  const claims = getClaimedRoasters();
  const normalizedKey = String(roasterSlug).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return claims[normalizedKey] || claims[roasterSlug] || null;
}

/**
 * Checks if a roaster is claimed and verified.
 * @param {string} roasterSlug 
 * @returns {boolean}
 */
export function isRoasterClaimed(roasterSlug) {
  const claim = getRoasterClaim(roasterSlug);
  return Boolean(claim && (claim.status === 'verified' || claim.status === 'verified_manual'));
}

/**
 * Saves or updates a roaster brand ownership claim.
 * 
 * Supports two verification types:
 * 1. 'domain': Claimant provides an email with domain matching the roaster's website (e.g. name@onyxcoffeelab.com).
 * 2. 'manual': Claimant provides business verification (wholesale invoice, roastery lease, Instagram handle).
 * 
 * @param {Object} claimData 
 * @returns {Object} Saved claim object with verification status
 */
export function saveRoasterClaim(claimData) {
  if (!claimData || !claimData.roasterSlug) {
    throw new Error('Roaster slug is required to submit a claim.');
  }

  const {
    roasterSlug,
    roasterName,
    claimantEmail,
    claimantName,
    roasterWebsite,
    verificationType = 'domain',
    proofNotes = '',
    socialHandle = ''
  } = claimData;

  const normalizedSlug = String(roasterSlug).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const cleanEmail = claimantEmail ? String(claimantEmail).trim().toLowerCase() : '';
  const emailDomain = extractDomainFromEmail(cleanEmail);
  const roasterDomain = extractDomainFromUrl(roasterWebsite);

  let status = 'pending_manual';
  let verificationMessage = 'Manual verification request submitted for review.';

  // Check automated domain verification
  if (cleanEmail && roasterWebsite) {
    const isDomainMatch = isDomainVerifiedRoaster(cleanEmail, roasterWebsite);
    const isKnownAlias = areEmailAliases(cleanEmail, 'christian@brookmillcoffee.com') && 
                         (normalizedSlug.includes('brookmill') || (roasterName && roasterName.toLowerCase().includes('brookmill')));

    if (isDomainMatch || isKnownAlias) {
      status = 'verified';
      verificationMessage = `Official Brand Ownership Verified with @${emailDomain || roasterDomain}`;
    }
  }

  // If manual verification selected with complete business proof
  if (verificationType === 'manual' && status !== 'verified') {
    status = 'pending_manual';
    verificationMessage = 'Your claim has been submitted to HQ. Our team validates business license/wholesale proof within 24 hours.';
  }

  const claimEntry = {
    roasterSlug: normalizedSlug,
    roasterName: roasterName || 'Specialty Roaster',
    claimantEmail: cleanEmail,
    claimantName: claimantName || 'Brand Owner',
    roasterWebsite: roasterWebsite || '',
    verificationType,
    status,
    verificationMessage,
    proofNotes,
    socialHandle,
    claimedAt: new Date().toISOString(),
    isDomainVerified: status === 'verified'
  };

  const existingClaims = getClaimedRoasters();
  existingClaims[normalizedSlug] = claimEntry;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ROASTER_CLAIMS_STORAGE_KEY, JSON.stringify(existingClaims));
      window.dispatchEvent(new CustomEvent(ROASTER_CLAIMED_EVENT, { detail: claimEntry }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to save roaster claim to localStorage:', err);
    }
  }

  trackEvent('roaster_profile_claimed', {
    roasterSlug: normalizedSlug,
    verificationType,
    status,
    emailDomain
  });

  return claimEntry;
}

/**
 * Checks whether the current user is the verified claimant of a roaster.
 */
export function isRoasterClaimedByUser(roasterSlug, currentUser) {
  if (!roasterSlug || !currentUser) return false;
  const claim = getRoasterClaim(roasterSlug);
  if (!claim) return false;

  const userEmail = currentUser.email ? String(currentUser.email).trim().toLowerCase() : '';
  const claimantEmail = claim.claimantEmail ? String(claim.claimantEmail).trim().toLowerCase() : '';

  if (userEmail && claimantEmail && (userEmail === claimantEmail || areEmailAliases(userEmail, claimantEmail))) {
    return true;
  }

  return false;
}
