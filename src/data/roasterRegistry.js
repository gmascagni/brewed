// Roaster Registry & Smart Bag Packaging Code Generator
// Manages verified partner roasters, custom bean profiles, and packaging QR generation.

import QRCode from 'qrcode';

const STORAGE_KEY = 'thebrewapp_roaster_registry_v1';

/**
 * Retrieve all registered coffees (built-in verified catalog + user/roaster registered)
 */
export function getRegisteredCoffees(builtinCatalog = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customList = raw ? JSON.parse(raw) : [];
    return [...customList, ...builtinCatalog];
  } catch (err) {
    console.warn('Error reading roaster registry from localStorage:', err);
    return [...builtinCatalog];
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return record;
}

/**
 * Delete a custom coffee from the Roaster Registry
 */
export function deleteRoasterCoffee(id) {
  const existing = getCustomRoasterCoffees();
  const filtered = existing.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

/**
 * Generate a deep-link URL for a coffee profile that opens The Brew App with dial-in parameters pre-set
 */
export function generateSmartBagUrl(coffee, baseUrl = 'https://thebrew.app') {
  if (!coffee) return baseUrl;
  const params = new URLSearchParams();
  if (coffee.roaster) params.set('roaster', coffee.roaster);
  if (coffee.beanName) params.set('bean', coffee.beanName);
  if (coffee.brewMethod) params.set('method', coffee.brewMethod);
  if (coffee.recommendedRatio) params.set('ratio', coffee.recommendedRatio.toString());
  if (coffee.tempF) params.set('tempF', coffee.tempF.toString());
  if (coffee.recommendedGrind) params.set('grind', coffee.recommendedGrind);
  if (coffee.upc) params.set('upc', coffee.upc);

  return `${baseUrl}/?${params.toString()}`;
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
