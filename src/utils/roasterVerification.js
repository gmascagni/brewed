/**
 * Roaster Domain Verification & Coffee Provenance Classification Engine
 * 
 * Provides authentic, transparent cryptographic & domain-based verification
 * to separate official roaster-certified recipes from on-device AI extractions,
 * curated showcase profiles, and community self-registered roasters.
 */

// Public consumer webmail providers that cannot automatically claim a commercial brand domain
export const PUBLIC_WEBMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'live.com',
  'outlook.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'aim.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'fastmail.com',
  'tutanota.com',
  'yandex.com',
  'yandex.ru'
]);

/**
 * Normalizes a website URL to its root domain
 * e.g. 'https://methodicalcoffee.com/collections/coffee' -> 'methodicalcoffee.com'
 */
export function extractDomainFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim().toLowerCase();
  try {
    const withProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
      ? trimmed 
      : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, '').replace(/:\d+$/, '');
  } catch {
    // Regex fallback
    const match = trimmed.replace(/^https?:\/\//, '').split('/')[0].split('?')[0].split(':')[0];
    return match ? match.replace(/^www\./, '') : null;
  }
}

/**
 * Extracts the email domain from an email address
 * e.g. 'alex@methodicalcoffee.com' -> 'methodicalcoffee.com'
 */
export function extractDomainFromEmail(email) {
  if (!email || typeof email !== 'string') return null;
  const parts = email.trim().toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : null;
}

/**
 * Checks if a domain is a generic public webmail provider
 */
export function isPublicWebmailDomain(domain) {
  if (!domain) return false;
  return PUBLIC_WEBMAIL_DOMAINS.has(domain.trim().toLowerCase());
}

/**
 * Authenticates whether a user's email verifies ownership of a roaster's official website domain
 * e.g. 'marco@methodicalcoffee.com' + 'https://methodicalcoffee.com' -> true
 * e.g. 'clpicke@live.com' + 'https://methodicalcoffee.com' -> false (live.com is public webmail)
 */
export function isDomainVerifiedRoaster(userEmail, roasterWebsite) {
  if (!userEmail || !roasterWebsite) return false;
  
  const emailDomain = extractDomainFromEmail(userEmail);
  const roasterDomain = extractDomainFromUrl(roasterWebsite);

  if (!emailDomain || !roasterDomain) return false;
  if (isPublicWebmailDomain(emailDomain)) return false;

  // Exact domain match (e.g. methodicalcoffee.com === methodicalcoffee.com)
  if (emailDomain === roasterDomain) return true;

  // Subdomain match (e.g. roaster.methodicalcoffee.com ends with .methodicalcoffee.com)
  if (emailDomain.endsWith(`.${roasterDomain}`)) return true;

  return false;
}

/**
 * Determines whether the current logged-in user is the legitimate brand owner of a given roaster profile.
 * Enforces strict multi-tenant authorization:
 * 1. User is the creator of the specific custom roaster (ownerEmail or ownerUid match).
 * 2. User possesses a corporate email domain matching the roaster's official website.
 * NEVER allows a generic role='roaster' to hijack third-party showcase profiles!
 */
export function checkRoasterBrandOwnership(roaster, currentUser) {
  if (!roaster || !currentUser) return false;

  const userEmail = currentUser.email ? String(currentUser.email).trim().toLowerCase() : '';
  const userUid = currentUser.uid || currentUser.id || '';

  // 1. Explicit creator of this custom roaster record
  if (roaster.ownerEmail && userEmail && roaster.ownerEmail.toLowerCase() === userEmail) {
    return true;
  }
  if (roaster.ownerUid && userUid && roaster.ownerUid === userUid) {
    return true;
  }
  if (roaster.isCustomRoaster && currentUser.roasterSlug && roaster.slug && currentUser.roasterSlug === roaster.slug) {
    return true;
  }

  // 2. Strict domain verification matching roaster's website
  if (userEmail && roaster.website && isDomainVerifiedRoaster(userEmail, roaster.website)) {
    return true;
  }

  return false;
}

/**
 * 4-Tier Provenance Taxonomy Constants
 */
export const PROVENANCE_TIERS = {
  TIER_1_ROASTER_CERTIFIED: 'roaster_certified',
  TIER_2_CURATED_SHOWCASE: 'curated_showcase',
  TIER_3_AI_VISION: 'ai_vision',
  TIER_4_RETAIL_MATCH: 'retail_match',
  TIER_COMMUNITY_ARTISAN: 'community_artisan'
};

/**
 * Computes the transparent provenance classification for any coffee or recipe
 */
export function getCoffeeProvenance(coffee, roaster = null, currentUser = null) {
  if (!coffee) {
    return {
      tier: PROVENANCE_TIERS.TIER_2_CURATED_SHOWCASE,
      label: 'Showcase Benchmark',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      description: 'Curated specialty coffee profile.'
    };
  }

  // 1. AI Bag Vision Extraction (On-device OCR)
  if (coffee.isAiExtracted || coffee.provenanceTier === PROVENANCE_TIERS.TIER_3_AI_VISION || (coffee.id && String(coffee.id).startsWith('ocr_'))) {
    return {
      tier: PROVENANCE_TIERS.TIER_3_AI_VISION,
      label: 'AI Bag Vision (Unverified)',
      shortBadge: 'AI Bag Vision',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      pillColor: 'bg-purple-500/15 text-purple-200 border-purple-500/30',
      accentColor: '#C084FC',
      description: 'Extraction parameters mathematically derived by on-device computer vision based on printed altitude and processing method. Not verified by the roaster.',
      isAiDerived: true,
      isDomainVerified: false
    };
  }

  // 2. Retail Barcode Match (Open Food Facts commercial packaging)
  if (coffee.isOffMatch || coffee.provenanceTier === PROVENANCE_TIERS.TIER_4_RETAIL_MATCH || (coffee.id && String(coffee.id).startsWith('off_'))) {
    return {
      tier: PROVENANCE_TIERS.TIER_4_RETAIL_MATCH,
      label: 'Retail Barcode Match',
      shortBadge: 'Retail Barcode',
      badgeColor: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/40',
      pillColor: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
      accentColor: '#A1A1AA',
      description: 'Matched via global retail barcode database. Product name confirmed from packaging; brew parameters are baseline defaults.',
      isAiDerived: false,
      isDomainVerified: false
    };
  }

  // 3. Official Roaster Certified (Domain-verified brand owner or direct authenticated creator)
  const isOwner = currentUser && roaster ? checkRoasterBrandOwnership(roaster, currentUser) : false;
  const isRoasterDomainVerified = roaster && roaster.ownerEmail && roaster.website 
    ? isDomainVerifiedRoaster(roaster.ownerEmail, roaster.website) 
    : false;

  if (isOwner || isRoasterDomainVerified || coffee.isDomainVerified) {
    return {
      tier: PROVENANCE_TIERS.TIER_1_ROASTER_CERTIFIED,
      label: 'Roaster Certified',
      shortBadge: 'Official Roaster Certified',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      pillColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      accentColor: '#34D399',
      description: 'Officially certified barista dial-in parameters submitted directly by the domain-verified roaster.',
      isAiDerived: false,
      isDomainVerified: true
    };
  }

  // 4. Community Self-Registered Artisan Roaster
  if (coffee.isCustom || (roaster && roaster.isCustomRoaster)) {
    return {
      tier: PROVENANCE_TIERS.TIER_COMMUNITY_ARTISAN,
      label: 'Artisan Roaster (Self-Registered)',
      shortBadge: 'Artisan Roaster',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      pillColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      accentColor: '#38BDF8',
      description: 'Independent artisan coffee lot registered directly through the Roaster Portal.',
      isAiDerived: false,
      isDomainVerified: false
    };
  }

  // 5. Curated Showcase Benchmark (Methodical, Onyx, Black & White, Brookmill benchmark lots)
  return {
    tier: PROVENANCE_TIERS.TIER_2_CURATED_SHOWCASE,
    label: 'Curated Benchmark',
    shortBadge: 'Curated Benchmark',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    pillColor: 'bg-amber-500/15 text-amber-200 border-amber-500/30',
    accentColor: '#F59E0B',
    description: 'Benchmark specialty profile curated from the roaster’s published barista dial-in guides and cupping cards.',
    isAiDerived: false,
    isDomainVerified: false
  };
}
