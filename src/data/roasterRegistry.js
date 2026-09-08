// Roaster Registry & Smart Bag Packaging Code Generator
// Manages verified partner roasters, custom bean profiles, and packaging QR generation.

import QRCode from 'qrcode';
import { doc, setDoc, deleteDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { deduplicateCoffees, normalizeRoasterKey } from './roasterShowcaseData.js';

const STORAGE_KEY = 'thebrewapp_roaster_registry_v1';

/**
 * Retrieve all registered coffees (built-in verified catalog + user/roaster registered)
 */
export function getRegisteredCoffees(builtinCatalog = []) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const customList = raw ? JSON.parse(raw) : [];
    return deduplicateCoffees([...customList, ...builtinCatalog]);
  } catch (err) {
    console.warn('Error reading roaster registry from localStorage:', err);
    return deduplicateCoffees([...builtinCatalog]);
  }
}

/**
 * Get only custom coffees registered via the Roaster Portal
 */
export function getCustomRoasterCoffees() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Error reading custom roaster coffees:', err);
    return [];
  }
}

/**
 * Save or update a coffee in the Roaster Registry
 */
export function saveRoasterCoffee(coffee) {
  if (!coffee || !coffee.beanName) {
    throw new Error('Bean name is required to register a coffee profile.');
  }

  const existing = getCustomRoasterCoffees();
  const id = coffee.id || `roaster_${Date.now()}`;
  const record = {
    ...coffee,
    id,
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
 * Delete a custom coffee from the Roaster Registry
 */
export function deleteRoasterCoffee(id) {
  const existing = getCustomRoasterCoffees();
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
export function saveCustomRoasterProfile(profile) {
  if (!profile || !profile.name) return null;
  const existing = getCustomRoasters();
  const slug = (profile.slug || profile.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const record = {
    ...profile,
    id: slug,
    slug,
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
 * Generate a deep-link URL for a coffee profile that opens the Roaster's Portfolio page with dial-in parameters
 */
export function generateSmartBagUrl(coffee, baseUrl) {
  const origin = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://thebrew.app');
  if (!coffee) return `${origin}/roasters`;

  const roasterSlug = (coffee.roaster || 'roasters')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const params = new URLSearchParams();
  if (coffee.beanName) params.set('bean', coffee.beanName);
  if (coffee.id) params.set('coffeeId', coffee.id);
  if (coffee.brewMethod) params.set('method', coffee.brewMethod);
  if (coffee.recommendedRatio) params.set('ratio', coffee.recommendedRatio.toString());
  if (coffee.tempF) params.set('tempF', coffee.tempF.toString());
  if (coffee.recommendedGrind) params.set('grind', coffee.recommendedGrind);
  if (coffee.upc) params.set('upc', coffee.upc);

  return `${origin}/roasters/${roasterSlug}?${params.toString()}`;
}

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
