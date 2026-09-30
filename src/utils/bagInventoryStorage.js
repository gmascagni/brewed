/**
 * Coffee Bag Inventory & Stash Storage System
 * Manages user coffee bags, roast date freshness estimation,
 * bag-to-brew linking, and Firestore cloud sync.
 */

import { getCoffeeProvenance } from './roasterVerification.js';
import { trackEvent } from './analytics.js';

export const INVENTORY_STORAGE_KEY = 'the_brew_app_inventory_v1';
export const INVENTORY_UPDATED_EVENT = 'thebrewapp_inventory_updated';

/**
 * Calculates bean freshness status and extraction dynamics from roast date.
 * Grounded in specialty coffee degassing science:
 * - Days 0-3: High CO2 degassing -> needs extended bloom (45-60s)
 * - Days 4-14: Peak aromatic window -> standard calibrated bloom & temp
 * - Days 15-30: Mature window -> smooth extraction
 * - Days 31+: Aging -> increase water temp (+2°F / 1°C) to compensate for loss of solubility
 * 
 * @param {string|Date|number} roastDateInput 
 * @returns {Object} Freshness status & guidance
 */
export function calculateBagFreshness(roastDateInput) {
  if (!roastDateInput) {
    return {
      daysSinceRoast: null,
      status: 'unspecified',
      label: 'Roast Date Unknown',
      badgeColor: 'stone',
      description: 'No roast date stamped. Freshness estimated based on standard retail rotation.',
      bloomAdjustmentSec: 0,
      tempAdjustmentF: 0,
      recommendation: 'Use standard 45s bloom and calibrated brew temperature.'
    };
  }

  const roastDate = new Date(roastDateInput);
  if (isNaN(roastDate.getTime())) {
    return {
      daysSinceRoast: null,
      status: 'unspecified',
      label: 'Roast Date Unknown',
      badgeColor: 'stone',
      description: 'Invalid date format.',
      bloomAdjustmentSec: 0,
      tempAdjustmentF: 0,
      recommendation: 'Use standard calibrated parameters.'
    };
  }

  const now = new Date();
  const diffTime = now.getTime() - roastDate.getTime();
  const daysSinceRoast = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  if (daysSinceRoast <= 3) {
    return {
      daysSinceRoast,
      status: 'resting',
      label: `${daysSinceRoast}d • Resting / Degassing`,
      badgeColor: 'amber',
      description: 'Coffee is actively degassing high levels of CO2. Bubbles can cause channeling if bloom is too short.',
      bloomAdjustmentSec: 15, // Extend bloom to 55-60s
      tempAdjustmentF: 0,
      recommendation: 'Extend bloom to 55–60s with gentle swirl to fully release trapped CO2.'
    };
  }

  if (daysSinceRoast <= 16) {
    return {
      daysSinceRoast,
      status: 'peak',
      label: `${daysSinceRoast}d • Peak Flavor Window`,
      badgeColor: 'emerald',
      description: 'Optimal balance of aromatics, organic acids, and solubility. Highest cup score potential.',
      bloomAdjustmentSec: 0,
      tempAdjustmentF: 0,
      recommendation: 'Optimal extraction window. Follow benchmark recipe ratios & temps exactly.'
    };
  }

  if (daysSinceRoast <= 35) {
    return {
      daysSinceRoast,
      status: 'mature',
      label: `${daysSinceRoast}d • Mature Extraction`,
      badgeColor: 'blue',
      description: 'CO2 has stabilized completely. Extraction is gentle and forgiving.',
      bloomAdjustmentSec: 0,
      tempAdjustmentF: 0,
      recommendation: 'Consistent and stable. Standard 40–45s bloom is ideal.'
    };
  }

  return {
    daysSinceRoast,
    status: 'aging',
    label: `${daysSinceRoast}d • Aging Profile`,
    badgeColor: 'amber-dark',
    description: 'Aromatic volatiles are dissipating. Solubility may decrease slightly.',
    bloomAdjustmentSec: -5,
    tempAdjustmentF: 2,
    recommendation: 'Raise water temp +2°F (1°C) and grind 1 click finer to maximize remaining aromatics.'
  };
}

/**
 * Retrieves all coffee bags in inventory from localStorage.
 * @returns {Array<Object>}
 */
export function getInventoryBags() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read inventory from localStorage:', err);
    return [];
  }
}

/**
 * Saves a new bag to inventory (or updates existing by ID / UPC).
 * @param {Object} bagData 
 * @param {Object|null} currentUser 
 * @returns {Object} Saved bag entry
 */
export function saveBagToInventory(bagData, currentUser = null) {
  if (!bagData) return null;
  const existing = getInventoryBags();

  const provenance = getCoffeeProvenance(bagData, bagData.roasterProfile || null, currentUser);
  const nowIso = new Date().toISOString();

  // Check if bag with same UPC or ID already exists
  const existingIndex = existing.findIndex(b => 
    (bagData.id && b.id === bagData.id) || 
    (bagData.upc && b.upc === bagData.upc)
  );

  const cleanBag = {
    id: bagData.id || `bag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    upc: bagData.upc || '',
    beanName: bagData.beanName || 'Specialty Coffee Lot',
    roaster: bagData.roaster || 'Specialty Roaster',
    roasterSlug: bagData.roasterSlug || '',
    origin: bagData.origin || 'Single-Origin',
    region: bagData.region || '',
    process: bagData.process || 'washed',
    processLabel: bagData.processLabel || bagData.process || 'Washed',
    roastLevel: bagData.roastLevel || 'Medium-Light',
    elevation: bagData.elevation || '1,800+ MASL',
    varietal: bagData.varietal || '',
    tastingNotes: Array.isArray(bagData.tastingNotes) ? bagData.tastingNotes : [],
    roastDate: bagData.roastDate || new Date().toISOString().split('T')[0],
    purchaseDate: bagData.purchaseDate || new Date().toISOString().split('T')[0],
    initialGrams: Number(bagData.initialGrams) || 340, // standard 12oz = 340g
    remainingGrams: Number(bagData.remainingGrams !== undefined ? bagData.remainingGrams : (bagData.initialGrams || 340)),
    recommendedRatio: Number(bagData.recommendedRatio) || 16,
    recommendedGrind: bagData.recommendedGrind || 'Medium-Fine',
    tempF: Number(bagData.tempF) || 202,
    tempC: Number(bagData.tempC) || 94,
    suggestedRecipes: bagData.suggestedRecipes || null,
    provenanceTier: provenance.tier,
    provenanceLabel: provenance.label,
    isClaimed: Boolean(bagData.isClaimed),
    claimedByUserId: currentUser?.uid || null,
    status: bagData.status || 'active', // 'active' | 'finished' | 'archived'
    updatedAt: nowIso,
    createdAt: bagData.createdAt || nowIso
  };

  let updatedList;
  if (existingIndex >= 0) {
    updatedList = [...existing];
    updatedList[existingIndex] = { ...existing[existingIndex], ...cleanBag, updatedAt: nowIso };
  } else {
    updatedList = [cleanBag, ...existing];
  }

  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent(INVENTORY_UPDATED_EVENT, { detail: { bag: cleanBag, count: updatedList.length } }));
  } catch (err) {
    console.error('Failed to write inventory to localStorage:', err);
  }

  // Sync to Cloud Firestore if signed in
  if (currentUser && currentUser.uid) {
    syncBagToCloud(cleanBag, currentUser.uid).catch(e => console.warn('Firestore bag sync deferred:', e));
  }

  trackEvent('inventory_bag_saved', {
    roaster: cleanBag.roaster,
    beanName: cleanBag.beanName,
    origin: cleanBag.origin,
    process: cleanBag.process
  });

  return cleanBag;
}

/**
 * Deducts dose grams after completing a brew session.
 * @param {string} bagId 
 * @param {number} doseGrams 
 * @returns {Object|null}
 */
export function deductDoseFromBag(bagId, doseGrams) {
  if (!bagId || !doseGrams) return null;
  const existing = getInventoryBags();
  const idx = existing.findIndex(b => b.id === bagId);
  if (idx < 0) return null;

  const current = existing[idx];
  const newRemaining = Math.max(0, Math.round((current.remainingGrams - Number(doseGrams)) * 10) / 10);
  const updatedBag = {
    ...current,
    remainingGrams: newRemaining,
    status: newRemaining <= 0 ? 'finished' : current.status,
    lastBrewedAt: new Date().toISOString()
  };

  existing[idx] = updatedBag;
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent(INVENTORY_UPDATED_EVENT, { detail: { bag: updatedBag, count: existing.length } }));
  } catch (err) {
    console.error('Failed to deduct dose from inventory bag:', err);
  }

  return updatedBag;
}

/**
 * Removes a bag from inventory.
 * @param {string} bagId 
 */
export function removeBagFromInventory(bagId) {
  if (!bagId) return;
  const existing = getInventoryBags();
  const filtered = existing.filter(b => b.id !== bagId);
  try {
    localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent(INVENTORY_UPDATED_EVENT, { detail: { bagId, count: filtered.length } }));
  } catch (err) {
    console.error('Failed to remove bag from inventory:', err);
  }
}

/**
 * Optional Cloud Firestore sync
 */
async function syncBagToCloud(bag, uid) {
  try {
    const { getFirestore, doc, setDoc } = await import('firebase/firestore');
    const { getApp } = await import('firebase/app');
    const db = getFirestore(getApp());
    const bagRef = doc(db, 'users', uid, 'inventory', bag.id);
    await setDoc(bagRef, bag, { merge: true });
  } catch (e) {
    // Suppress if offline or firestore not initialized
  }
}
