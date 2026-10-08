// Roaster Registry & Smart Bag Packaging Code Generator
// Manages verified partner roasters, custom bean profiles, and packaging QR generation.

import QRCode from 'qrcode';
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { deduplicateCoffees, normalizeRoasterKey, SHOWCASE_ROASTERS, getAllShowcaseRoasters } from './roasterShowcaseData.js';
import { checkRoasterBrandOwnership, areEmailAliases } from '../utils/roasterVerification.js';

const STORAGE_KEY = 'thebrewapp_roaster_registry_v1';

/**
 * Extract all coffees from built-in showcase roasters
 */
function getBuiltinShowcaseCoffees() {
  const showcaseCoffees = [];
  if (Array.isArray(SHOWCASE_ROASTERS)) {
    SHOWCASE_ROASTERS.forEach((roaster) => {
      (roaster.coffees || []).forEach((coffee) => {
        showcaseCoffees.push({
          ...coffee,
          roaster: coffee.roaster || roaster.name,
          roasterSlug: roaster.slug || roaster.id,
          isDemoExample: Boolean(roaster.isDemoExample),
          demoNotice: roaster.demoNotice || '',
          roasterInfo: roaster
        });
      });
    });
  }
  return showcaseCoffees;
}

/**
 * Retrieve all registered coffees (built-in verified catalog + showcase roasters + user/roaster registered)
 */
export function getRegisteredCoffees(builtinCatalog = []) {
  const showcaseCoffees = getBuiltinShowcaseCoffees();
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const customList = raw ? JSON.parse(raw) : [];
    return deduplicateCoffees([...customList, ...showcaseCoffees, ...builtinCatalog]);
  } catch (err) {
    console.warn('Error reading roaster registry from localStorage:', err);
    return deduplicateCoffees([...showcaseCoffees, ...builtinCatalog]);
  }
}

/**
 * Resolves all roaster brands and lots/coffees owned by the specified user session.
 * Connects showcase roasters (e.g. Brookmill Coffee Roasters) and custom roaster profiles
 * with all associated default and custom coffee lots.
 */
export function getRoasterOwnedBrandsAndCoffees(currentUser) {
  if (!currentUser) {
    return { ownedRoasters: [], primaryRoaster: null, ownedCoffees: [] };
  }

  // 1. Gather all potential roasters: builtins + custom
  const allShowcase = typeof getAllShowcaseRoasters === 'function' ? getAllShowcaseRoasters() : (SHOWCASE_ROASTERS || []);
  const allCustom = getCustomRoasters();

  const roasterMap = new Map();
  [...allShowcase, ...allCustom].forEach((r) => {
    if (!r) return;
    const key = r.slug || r.id || r.name;
    if (key && !roasterMap.has(key)) {
      roasterMap.set(key, r);
    }
  });

  const allRoasters = Array.from(roasterMap.values());

  // 2. Identify roasters owned by currentUser
  const ownedRoasters = allRoasters.filter((r) => {
    if (checkRoasterBrandOwnership(r, currentUser)) return true;
    if (currentUser.roasterSlug && (r.slug === currentUser.roasterSlug || r.id === currentUser.roasterSlug)) return true;
    if (currentUser.roasterName && r.name && r.name.toLowerCase() === currentUser.roasterName.toLowerCase()) return true;
    return false;
  });

  // Fallback: If user has roaster credentials but no matching record found, synthesize profile
  if (ownedRoasters.length === 0 && (currentUser.role === 'roaster' || currentUser.isVerifiedRoaster)) {
    const fallbackName = currentUser.roasterName || currentUser.displayName || 'Specialty Roastery';
    const fallbackSlug = currentUser.roasterSlug || fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    ownedRoasters.push({
      id: fallbackSlug,
      slug: fallbackSlug,
      name: fallbackName,
      location: currentUser.location || 'Specialty Coffee Roastery',
      ownerEmail: currentUser.email,
      ownerUsername: currentUser.username,
      coffees: []
    });
  }

  const primaryRoaster = ownedRoasters[0] || null;

  // 3. Gather coffees for owned roasters
  let customCoffees = [];
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    customCoffees = raw ? JSON.parse(raw) : [];
  } catch {}

  const ownedCoffeesMap = new Map();

  // First add all default coffees belonging to owned roasters
  ownedRoasters.forEach((roaster) => {
    (roaster.coffees || []).forEach((coffee) => {
      const coffeeId = coffee.id || `coffee_${coffee.beanName}`;
      ownedCoffeesMap.set(coffeeId, {
        ...coffee,
        id: coffeeId,
        roaster: coffee.roaster || roaster.name,
        roasterSlug: coffee.roasterSlug || roaster.slug,
        ownerEmail: roaster.ownerEmail || currentUser.email,
        ownerUid: roaster.ownerUid || currentUser.uid || currentUser.username
      });
    });
  });

  // Next, merge/override with custom coffees saved by this user or for this roaster
  const userEmail = currentUser.email ? String(currentUser.email).trim().toLowerCase() : '';
  const ownedSlugs = new Set(ownedRoasters.map((r) => r.slug));
  const ownedNames = new Set(ownedRoasters.map((r) => r.name.toLowerCase()));

  customCoffees.forEach((c) => {
    const cEmail = c.ownerEmail ? String(c.ownerEmail).trim().toLowerCase() : '';
    const matchesEmail = userEmail && (cEmail === userEmail || areEmailAliases(cEmail, userEmail));
    const matchesSlug = c.roasterSlug && ownedSlugs.has(c.roasterSlug);
    const matchesName = c.roaster && ownedNames.has(c.roaster.toLowerCase());

    if (matchesEmail || matchesSlug || matchesName) {
      ownedCoffeesMap.set(c.id, {
        ...c,
        roaster: c.roaster || primaryRoaster?.name || 'Specialty Roastery',
        roasterSlug: c.roasterSlug || primaryRoaster?.slug || 'specialty-roastery',
        ownerEmail: matchesSlug || matchesName || areEmailAliases(cEmail, userEmail) ? (currentUser.email || c.ownerEmail) : c.ownerEmail
      });
    }
  });

  const ownedCoffees = Array.from(ownedCoffeesMap.values());

  return {
    ownedRoasters,
    primaryRoaster,
    ownedCoffees
  };
}

/**
 * Get custom and owned coffees registered via the Roaster Portal.
 * Optionally filtered by ownerEmail for authenticated roaster multi-tenant security.
 */
export function getCustomRoasterCoffees(filterOwnerEmail = null, currentUser = null) {
  try {
    if (currentUser && (currentUser.role === 'roaster' || currentUser.isVerifiedRoaster)) {
      const { ownedCoffees } = getRoasterOwnedBrandsAndCoffees(currentUser);
      if (ownedCoffees.length > 0) return ownedCoffees;
    }

    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const list = raw ? JSON.parse(raw) : [];

    if (filterOwnerEmail) {
      const cleanEmail = String(filterOwnerEmail).trim().toLowerCase();
      // If the email matches a known roaster owner in showcase, include their coffees
      const showcase = typeof getAllShowcaseRoasters === 'function' ? getAllShowcaseRoasters() : SHOWCASE_ROASTERS;
      const matchingRoasters = (showcase || []).filter(
        (r) =>
          (r.ownerEmail && r.ownerEmail.toLowerCase() === cleanEmail) ||
          (Array.isArray(r.ownerEmails) && r.ownerEmails.map((e) => e.toLowerCase()).includes(cleanEmail))
      );

      const combined = new Map();
      matchingRoasters.forEach((r) => {
        (r.coffees || []).forEach((c) => {
          combined.set(c.id, { ...c, roaster: r.name, roasterSlug: r.slug, ownerEmail: cleanEmail });
        });
      });
      list
        .filter((c) => c.ownerEmail && c.ownerEmail.toLowerCase() === cleanEmail)
        .forEach((c) => {
          combined.set(c.id, c);
        });

      if (combined.size > 0) return Array.from(combined.values());

      return list.filter(
        (c) => c.ownerEmail && String(c.ownerEmail).trim().toLowerCase() === cleanEmail
      );
    }
    return list;
  } catch (err) {
    console.warn('Error reading custom roaster coffees:', err);
    return [];
  }
}

/**
 * Save or update a coffee in the Roaster Registry.
 * Enforces ownership: only the authenticated roaster can create or modify recipes for their brand.
 */
export function saveRoasterCoffee(coffee, currentUser = null) {
  if (!coffee || !coffee.beanName) {
    throw new Error('Bean name is required to register a coffee profile.');
  }

  const existing = getCustomRoasterCoffees();
  const id = coffee.id || `roaster_${Date.now()}`;
  const existingCoffee = existing.find((c) => c.id === id);

  const ownerEmail = currentUser?.email 
    ? String(currentUser.email).trim().toLowerCase() 
    : coffee.ownerEmail 
    ? String(coffee.ownerEmail).trim().toLowerCase() 
    : null;

  const ownerUid = currentUser?.uid || currentUser?.username || coffee.ownerUid || null;

  // Authorization Guard: Prevent tampering with another roaster's recipe
  if (existingCoffee && existingCoffee.ownerEmail && ownerEmail) {
    if (existingCoffee.ownerEmail.toLowerCase() !== ownerEmail.toLowerCase()) {
      const isAlias = areEmailAliases(existingCoffee.ownerEmail, ownerEmail);
      const isBrandOwner = currentUser && checkRoasterBrandOwnership(
        { slug: existingCoffee.roasterSlug, name: existingCoffee.roaster, ownerEmail: existingCoffee.ownerEmail },
        currentUser
      );
      if (!isAlias && !isBrandOwner) {
        throw new Error(`Unauthorized: This recipe is registered to "${existingCoffee.ownerEmail}". Only the owner can modify it.`);
      }
    }
  }

  const rSlug = coffee.roasterSlug || slugify(coffee.roaster || 'specialty-roaster');
  const cSlug = coffee.coffeeSlug || coffee.beanSlug || slugify(coffee.beanName || 'single-origin');

  const record = {
    ...coffee,
    id,
    ownerEmail: ownerEmail || existingCoffee?.ownerEmail || null,
    ownerUid: ownerUid || existingCoffee?.ownerUid || null,
    roasterSlug: rSlug,
    coffeeSlug: cSlug,
    slug: cSlug,
    farm: coffee.farm || '',
    region: coffee.region || '',
    doseGrams: coffee.doseGrams !== undefined ? coffee.doseGrams : (coffee.dryDoseGrams || 18),
    waterGrams: coffee.waterGrams !== undefined ? coffee.waterGrams : 297,
    bloom: coffee.bloom || '',
    brewTime: coffee.brewTime || '3m 15s',
    about: coffee.about || coffee.originStory || '',
    instagram: coffee.instagram || '',
    shopLink: coffee.shopLink || coffee.directUrl || '',
    updatedAt: new Date().toISOString(),
    isCustom: true
  };

  const filtered = existing.filter((c) => c.id !== id);
  const updated = [record, ...filtered];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Storage quota exceeded in saveRoasterCoffee; falling back to lightweight record without oversized image:', err);
    try {
      const lightweight = updated.map((c) => ({
        ...c,
        logoImage: c.logoImage && c.logoImage.length > 50000 ? '' : c.logoImage
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight));
    } catch (fallbackErr) {
      console.error('Failed to save coffee to localStorage:', fallbackErr);
    }
  }

  // Asynchronous Cloud Firestore Persistence
  try {
    if (db) {
      const cloudRecord = { ...record };
      if (cloudRecord.logoImage && cloudRecord.logoImage.length > 50000) delete cloudRecord.logoImage;
      setDoc(doc(db, 'coffees', id), cloudRecord, { merge: true }).catch(e => {
        console.warn('Firestore coffee sync error:', e);
      });
      if (record.upc) {
        setDoc(doc(db, 'coffees', `upc_${record.upc}`), cloudRecord, { merge: true }).catch(() => {});
      }
    }
  } catch (syncErr) {
    console.warn('Firestore sync failed:', syncErr);
  }

  return record;
}

/**
 * Delete a custom coffee from the Roaster Registry.
 * Enforces ownership: only the authenticated owner can delete their registered coffee.
 */
export function deleteRoasterCoffee(id, currentUser = null) {
  const existing = getCustomRoasterCoffees();
  const target = existing.find((c) => c.id === id);

  if (target && target.ownerEmail && currentUser?.email) {
    const userEmail = String(currentUser.email).trim().toLowerCase();
    const targetEmail = target.ownerEmail.toLowerCase();
    if (targetEmail !== userEmail) {
      const isAlias = areEmailAliases(targetEmail, userEmail);
      const isBrandOwner = currentUser && checkRoasterBrandOwnership(
        { slug: target.roasterSlug, name: target.roaster, ownerEmail: target.ownerEmail },
        currentUser
      );
      if (!isAlias && !isBrandOwner) {
        throw new Error(`Unauthorized: This coffee is owned by "${target.ownerEmail}". You cannot delete another roaster's coffee.`);
      }
    }
  }

  const filtered = existing.filter((c) => c.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete coffee from localStorage:', err);
  }

  try {
    if (db) {
      deleteDoc(doc(db, 'coffees', id)).catch(() => {});
    }
  } catch (e) {}

  return filtered;
}

const ROASTER_PROFILES_KEY = 'thebrewapp_custom_roasters_v1';

/**
 * Get custom roasters registered via the Roaster Portal
 */
export function getCustomRoasters() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ROASTER_PROFILES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading custom roasters from localStorage:', err);
    return [];
  }
}

/**
 * Save or update a custom roaster profile (including uploaded logoImage)
 */
export function saveCustomRoasterProfile(profile, currentUser = null) {
  if (!profile || !profile.name) return null;
  const existing = getCustomRoasters();
  const slug = String(profile.slug || profile.name || 'specialty-roaster')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const ownerEmail = currentUser?.email 
    ? String(currentUser.email).trim().toLowerCase() 
    : profile.ownerEmail 
    ? String(profile.ownerEmail).trim().toLowerCase() 
    : null;

  const headRoaster = profile.headRoaster || profile.founderName || '';
  const founders = Array.isArray(profile.founders) && profile.founders.length > 0
    ? profile.founders
    : (headRoaster ? headRoaster.split(',').map(s => s.trim()).filter(Boolean) : []);

  const record = {
    ...profile,
    id: slug,
    slug,
    headRoaster,
    founders,
    ownerEmail,
    ownerUid: currentUser?.uid || currentUser?.username || profile.ownerUid || null,
    updatedAt: new Date().toISOString()
  };
  const filtered = existing.filter((r) => r.id !== slug && r.slug !== slug);
  const updated = [record, ...filtered];
  try {
    localStorage.setItem(ROASTER_PROFILES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Storage quota exceeded in saveCustomRoasterProfile; falling back to lightweight record:', err);
    try {
      const lightweight = updated.map((r) => ({
        ...r,
        logoImage: r.logoImage && r.logoImage.length > 50000 ? '' : r.logoImage,
        backgroundImage: r.backgroundImage && r.backgroundImage.length > 50000 ? '' : r.backgroundImage
      }));
      localStorage.setItem(ROASTER_PROFILES_KEY, JSON.stringify(lightweight));
    } catch (fallbackErr) {
      console.error('Failed to save roaster profile to localStorage:', fallbackErr);
    }
  }

  // Asynchronous Cloud Firestore Persistence
  try {
    if (db) {
      const cloudProfile = { ...record };
      if (cloudProfile.logoImage && cloudProfile.logoImage.length > 50000) delete cloudProfile.logoImage;
      if (cloudProfile.backgroundImage && cloudProfile.backgroundImage.length > 50000) delete cloudProfile.backgroundImage;
      setDoc(doc(db, 'roasters', slug), cloudProfile, { merge: true }).catch(e => {
        console.warn('Firestore roaster profile sync error:', e);
      });
    }
  } catch (syncErr) {
    console.warn('Firestore roaster sync failed:', syncErr);
  }

  return record;
}

/**
 * Asynchronously query Cloud Firestore for a coffee by UPC barcode or coffee ID
 */
export async function fetchRemoteCoffeeByCode(code) {
  if (!code || !db) return null;
  const cleanCode = String(code).trim();
  try {
    // 1. Direct O(1) alias check (upc_...)
    const aliasRef = doc(db, 'coffees', `upc_${cleanCode}`);
    const aliasSnap = await getDoc(aliasRef);
    if (aliasSnap.exists()) return aliasSnap.data();

    // 2. Direct ID check
    const directRef = doc(db, 'coffees', cleanCode);
    const directSnap = await getDoc(directRef);
    if (directSnap.exists()) return directSnap.data();

    // 3. Query by upc field
    const q = query(collection(db, 'coffees'), where('upc', '==', cleanCode));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      return qSnap.docs[0].data();
    }
  } catch (err) {
    console.warn('Error fetching coffee from Firestore:', err);
  }
  return null;
}

/**
 * Sync Cloud Firestore catalog with local cache
/**
 * Purge stale duplicate roasters and duplicate coffees from local storage
 */
export function cleanupLocalRegistry() {
  if (typeof window === 'undefined') return;
  try {
    // 1. Clean Roaster Profiles (filter out built-in showcase roasters and deduplicate custom ones)
    const rawRoasters = localStorage.getItem(ROASTER_PROFILES_KEY);
    if (rawRoasters) {
      const roasters = JSON.parse(rawRoasters);
      const seen = new Set(['methodical', 'onyx', 'black-white']);
      const cleaned = [];
      for (const r of roasters) {
        if (!r) continue;
        const k = normalizeRoasterKey(r.id || r.slug || r.name);
        if (k && !seen.has(k)) {
          seen.add(k);
          cleaned.push(r);
        }
      }
      localStorage.setItem(ROASTER_PROFILES_KEY, JSON.stringify(cleaned));
    }

    // 2. Clean Coffees (deduplicate all custom coffees)
    const rawCoffees = localStorage.getItem(STORAGE_KEY);
    if (rawCoffees) {
      const coffees = JSON.parse(rawCoffees);
      const cleanedCoffees = deduplicateCoffees(coffees);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedCoffees));
    }
  } catch (err) {
    console.warn('Error during local registry cleanup:', err);
  }
}

/**
 * Sync Cloud Firestore catalog with local cache (with strict deduplication)
 */
export async function syncCloudCatalog() {
  if (!db || typeof window === 'undefined') return;
  cleanupLocalRegistry();
  try {
    // 1. Sync Roasters
    const roasterSnap = await getDocs(collection(db, 'roasters'));
    if (!roasterSnap.empty) {
      const remoteRoasters = roasterSnap.docs.map(d => d.data());
      const localRoasters = getCustomRoasters();
      const seenBuiltins = new Set(['methodical', 'onyx', 'black-white']);
      const roasterMap = new Map();

      // Only save non-builtin custom roasters into the local custom storage
      [...remoteRoasters, ...localRoasters].forEach(r => {
        if (!r) return;
        const k = normalizeRoasterKey(r.id || r.slug || r.name);
        if (k && !seenBuiltins.has(k) && !roasterMap.has(k)) {
          roasterMap.set(k, r);
        }
      });
      localStorage.setItem(ROASTER_PROFILES_KEY, JSON.stringify(Array.from(roasterMap.values())));
    }

    // 2. Sync Coffees
    const coffeeSnap = await getDocs(collection(db, 'coffees'));
    if (!coffeeSnap.empty) {
      const remoteCoffees = coffeeSnap.docs
        .filter(d => !d.id.startsWith('upc_'))
        .map(d => d.data());
      const localCoffees = getCustomRoasterCoffees();
      const merged = deduplicateCoffees([...remoteCoffees, ...localCoffees]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch (err) {
    console.warn('Background Cloud Firestore sync error:', err);
  }
}

/**
 * Resolves the canonical base URL for Smart Bag deep links and packaging QR codes.
 * Always returns https://thebrew.app so that physical packaging stickers printed for coffee bags
 * consistently encode the official custom domain and never fail with 404 errors on smartphone scanners.
 */
export function getSmartBagBaseUrl() {
  return 'https://thebrew.app';
}

/**
 * URL-safe slugify helper (e.g. "Onyx Coffee Lab" -> "onyx-coffee-lab", "Ethiopia Guji Natural" -> "ethiopia-guji-natural")
 */
export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate a unique customer-facing webpage URL for a coffee:
 * Structure: https://thebrew.app/[roaster-name]/[coffee-name]
 */
export function getCoffeeCustomerUrl(coffee, baseUrl) {
  const base = (baseUrl || getSmartBagBaseUrl()).replace(/\/+$/, '');
  if (!coffee) return `${base}/`;

  let rSlug = coffee.roasterSlug || slugify(coffee.roaster || 'specialty-roaster');
  if (rSlug.includes('brookmill')) rSlug = 'brookmill-roaster';

  const cSlug = coffee.coffeeSlug || coffee.slug || coffee.beanSlug || slugify(coffee.beanName || 'single-origin');
  return `${base}/${rSlug}/${cSlug}`;
}

/**
 * Generate a destination URL for a coffee's Smart Bag QR code.
 * Directs customers to https://thebrew.app/[roaster-name]/[coffee-name]
 */
export function generateSmartBagUrl(coffee, baseUrl, options = {}) {
  const base = (baseUrl || getSmartBagBaseUrl()).replace(/\/+$/, '');
  if (!coffee) return `${base}/`;

  const customerUrl = getCoffeeCustomerUrl(coffee, base);

  // Return clean customer URL unless explicit query params format is requested
  if (!options.asQueryParams) {
    return customerUrl;
  }

  // Fallback / legacy query param payload
  let roasterSlug = String(coffee.roasterSlug || coffee.roaster || 'methodical')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (roasterSlug.includes('brookmill')) {
    roasterSlug = 'brookmill-roaster';
  }

  const params = new URLSearchParams();
  params.set('recipe', '1');
  params.set('roaster', roasterSlug);

  const roasterDisplayName = coffee.roaster || (roasterSlug.includes('brookmill') ? 'Brookmill Coffee Roasters' : roasterSlug);
  if (roasterDisplayName && roasterDisplayName !== roasterSlug) {
    params.set('roasterName', roasterDisplayName);
  }
  if (coffee.beanName) params.set('bean', coffee.beanName);
  if (coffee.id) params.set('coffeeId', coffee.id);

  const method = coffee.brewMethod || coffee.extraction?.method || 'pour_over';
  const ratio = coffee.recommendedRatio || coffee.extraction?.ratio || 16.5;
  const tempF = coffee.tempF || coffee.extraction?.tempF || 202;
  const grind = coffee.recommendedGrind || coffee.extraction?.grind || 'Medium-Fine';

  params.set('method', method);
  params.set('ratio', ratio.toString());
  params.set('tempF', tempF.toString());
  params.set('grind', grind);
  if (coffee.upc) params.set('upc', coffee.upc);

  return `${base}/?${params.toString()}`;
}

/**
 * Find a coffee profile by roasterSlug and coffeeSlug
 */
export function findCoffeeBySlugs(roasterSlugInput, coffeeSlugInput) {
  if (!roasterSlugInput) return null;
  const targetRoasterSlug = slugify(roasterSlugInput);
  const targetCoffeeSlug = coffeeSlugInput ? slugify(coffeeSlugInput) : '';

  // 1. Search Showcase Roasters
  const showcaseRoasters = typeof getAllShowcaseRoasters === 'function' ? getAllShowcaseRoasters() : SHOWCASE_ROASTERS;
  const matchedRoaster = (showcaseRoasters || []).find((r) => {
    const s = slugify(r.slug || r.id || r.name || r.shortName || '');
    return s === targetRoasterSlug || targetRoasterSlug.includes(s) || s.includes(targetRoasterSlug);
  });

  if (matchedRoaster && targetCoffeeSlug) {
    const matchedCoffee = (matchedRoaster.coffees || []).find((c) => {
      const cSlug = slugify(c.slug || c.beanSlug || c.beanName || c.id || '');
      if (cSlug === targetCoffeeSlug) return true;
      if (c.id === targetCoffeeSlug) return true;
      if (Array.isArray(c.aliases) && c.aliases.some((a) => slugify(a) === targetCoffeeSlug)) return true;
      if (targetCoffeeSlug.length >= 6 && (cSlug.includes(targetCoffeeSlug) || targetCoffeeSlug.includes(cSlug))) return true;
      return false;
    });

    if (matchedCoffee) {
      return {
        ...matchedCoffee,
        roaster: matchedRoaster.name,
        roasterSlug: matchedRoaster.slug,
        roasterInfo: matchedRoaster
      };
    }
  }

  // 2. Search Custom / Registered Coffees in local storage and registry
  const customCoffees = getCustomRoasterCoffees();
  const customMatch = (customCoffees || []).find((c) => {
    const rSlug = slugify(c.roasterSlug || c.roaster || '');
    const cSlug = slugify(c.coffeeSlug || c.slug || c.beanSlug || c.beanName || c.id || '');
    const roasterMatches = rSlug === targetRoasterSlug || targetRoasterSlug.includes(rSlug) || rSlug.includes(targetRoasterSlug);
    if (!roasterMatches) return false;
    if (!targetCoffeeSlug) return true;
    return cSlug === targetCoffeeSlug || c.id === targetCoffeeSlug || cSlug.includes(targetCoffeeSlug) || targetCoffeeSlug.includes(cSlug);
  });

  if (customMatch) {
    const allCustomRoasters = getCustomRoasters();
    const roasterObj = allCustomRoasters.find((r) => slugify(r.slug || r.name || '') === targetRoasterSlug) || matchedRoaster;
    return {
      ...customMatch,
      roaster: customMatch.roaster || roasterObj?.name || targetRoasterSlug,
      roasterSlug: targetRoasterSlug,
      roasterInfo: roasterObj || null
    };
  }

  // 3. Fallback: if roaster found but specific coffee was not found, return first roaster coffee
  if (matchedRoaster && !targetCoffeeSlug && matchedRoaster.coffees?.length > 0) {
    return {
      ...matchedRoaster.coffees[0],
      roaster: matchedRoaster.name,
      roasterSlug: matchedRoaster.slug,
      roasterInfo: matchedRoaster
    };
  }

  return null;
}

/**
 * Simplified Roaster Monetization Plans (Free vs Pro)
 */
export const ROASTER_PLANS = {
  free: {
    id: 'free',
    name: 'Free Partner',
    price: '$0',
    period: 'Forever',
    lotLimit: 3,
    badge: 'Founding Partner Tier',
    description: 'Designed to make it extremely easy for a specialty roaster to participate and provide customers with coffee-specific brewing guidance.',
    features: [
      'Roaster profile & story',
      '1–3 coffee lots',
      'Basic brewing recipe & dial-in parameters',
      'Instant QR code generation',
      'Link back to roaster',
      'Listed in the Roaster Hub'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro Partner',
    price: '$24',
    period: '/ month',
    annualPrice: '$199 / year',
    lotLimit: 20,
    badge: 'Extended Lot Capacity',
    description: 'Target up to 20 coffee lots with custom QR codes, multiple brew recipes, analytics, and featured placement.',
    features: [
      'Up to 20 coffee lots',
      'Custom QR codes & label formats',
      'Multiple brewing recipes per coffee',
      'Custom branded landing pages',
      'Analytics & click-through tracking',
      'Featured placement in Roaster Hub',
      'Customer feedback & community ratings',
      '"Buy This Coffee" direct shop links'
    ]
  }
};


/**
 * Generate a high-resolution QR code Data URL for printing packaging stickers
 */
export async function generateQrCodeDataUrl(text, options = {}) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
      margin: options.margin !== undefined ? options.margin : 2,
      width: options.width || 800,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code data URL:', err);
    return null;
  }
}

/**
 * Generate a pure vector SVG QR code string for packaging printers
 */
export async function generateQrCodeSvg(text, options = {}) {
  try {
    return await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: options.errorCorrectionLevel || 'H',
      margin: options.margin !== undefined ? options.margin : 2,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF'
      }
    });
  } catch (err) {
    console.error('Failed to generate QR code SVG:', err);
    return null;
  }
}

/**
 * Export the roaster's coffees as a portable JSON file
 */
export function exportRoasterCatalogJson() {
  const coffees = getCustomRoasterCoffees();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(coffees, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `thebrewapp_roaster_catalog_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
