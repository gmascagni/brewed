/**
 * The Brew App — Shared Packaging & Asset Pipeline Service
 * 
 * Centralized engine for generating all physical packaging assets:
 * - 300-DPI composite sticker images ready for commercial printers (Avery, Zebra, Rollo, Dymo)
 * - Scalable vector SVGs for packaging die-lines
 * - Standalone high-res QR codes
 * - Universal deep links
 */

import QRCode from 'qrcode';
import { createCoffeeProfile, slugify } from '../models/coffeeProfile';
import { generateSmartBagUrl } from '../data/roasterRegistry';

/**
 * Generates the full 300-DPI composite packaging sticker canvas.
 * 
 * @param {Object} rawCoffee - Coffee profile or raw bean object
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateCompositeStickerCanvas(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const targetUrl = coffee.packaging?.customUrl?.trim() || generateSmartBagUrl(coffee);

  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1800;
  const ctx = canvas.getContext('2d');

  // 1. Clean white card background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 1200, 1800);

  // 2. Outer printer bleed & border
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 10;
  ctx.strokeRect(30, 30, 1140, 1740);

  // 3. Inner hairline frame
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 2;
  ctx.strokeRect(45, 45, 1110, 1710);

  // 5. Roast Level Pill Badge
  const roastText = (coffee.roastLevel || 'LIGHT').toUpperCase();
  ctx.font = 'bold 22px monospace, sans-serif';
  const badgeW = ctx.measureText(roastText).width + 36;
  ctx.fillStyle = '#1C1917';
  ctx.fillRect(1200 - 70 - badgeW, 78, badgeW, 42);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(roastText, 1200 - 70 - badgeW + 18, 107);

  // 6. Roaster Title & Location
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 52px Georgia, "Times New Roman", serif';
  ctx.fillText(coffee.roaster, 70, 180);

  ctx.fillStyle = '#57534E';
  ctx.font = '28px -apple-system, sans-serif';
  ctx.fillText(coffee.location || 'Artisan Small Batch', 70, 225);

  // 7. Dividing Rule
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(70, 255);
  ctx.lineTo(1130, 255);
  ctx.stroke();

  // 8. Coffee Lot Name & Terroir
  ctx.fillStyle = '#0C0A09';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.fillText(coffee.beanName, 70, 315);

  ctx.fillStyle = '#44403C';
  ctx.font = '500 26px -apple-system, sans-serif';
  const originStr = `${coffee.origin} • ${coffee.process} • ${coffee.elevation}`;
  ctx.fillText(originStr, 70, 360);

  // 9. Tasting Notes
  const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(', ');
  if (notesStr) {
    ctx.fillStyle = '#92400E';
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillText(`Notes: ${notesStr}`, 70, 405);
  }

  // 10. Prominent "SCAN ME FOR RECIPE" Banner
  const bannerY = 460;
  const bannerH = 75;
  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(140, bannerY, 920, bannerH, 37);
    ctx.fill();
  } else {
    ctx.fillRect(140, bannerY, 920, bannerH);
  }

  ctx.fillStyle = '#F59E0B'; // Amber Gold
  ctx.font = 'bold 42px -apple-system, monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨  SCAN ME FOR RECIPE  ✨', 600, bannerY + 52);

  // 11. Centered High-Res QR Code
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: 700,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, 250, 560, 700, 700);

  // 13. Extraction Parameter Box
  ctx.fillStyle = '#F5F5F4';
  ctx.fillRect(70, 1360, 1060, 230);
  ctx.strokeStyle = '#D6D3D1';
  ctx.lineWidth = 2;
  ctx.strokeRect(70, 1360, 1060, 230);

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 20px monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('BARISTA DIAL-IN SPECIFICATIONS', 100, 1400);

  const colW = 1060 / 4;
  const colY = 1455;

  // Col 1: Ratio
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 18px monospace, sans-serif';
  ctx.fillText('WATER RATIO', 100, colY);
  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 36px monospace, sans-serif';
  ctx.fillText(`1:${coffee.extraction.ratio}`, 100, colY + 45);

  // Col 2: Water Temp
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 18px monospace, sans-serif';
  ctx.fillText('WATER TEMP', 100 + colW, colY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 36px monospace, sans-serif';
  ctx.fillText(`${coffee.extraction.tempF}°F`, 100 + colW, colY + 45);

  // Col 3: Method
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 18px monospace, sans-serif';
  ctx.fillText('BREW METHOD', 100 + colW * 2, colY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 28px -apple-system, sans-serif';
  ctx.fillText(String(coffee?.extraction?.method || 'pour_over').replace(/_/g, ' '), 100 + colW * 2, colY + 42);

  // Col 4: Grind
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 18px monospace, sans-serif';
  ctx.fillText('GRIND SIZE', 100 + colW * 3, colY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 26px -apple-system, sans-serif';
  ctx.fillText((coffee.extraction.grind || 'Medium-Fine').split('(')[0].trim(), 100 + colW * 3, colY + 42);

  // 14. Full-width bottom banner
  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(70, 1615, 1060, 105, 16);
    ctx.fill();
  } else {
    ctx.fillRect(70, 1615, 1060, 105);
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN FOR RECIPE', 600, 1686);

  return canvas;
}

/**
 * Generates a 300-DPI composite label for Brother QL-600 / QL-800 / QL-1100 (DK-1202, 2.4" x 3.9" / 62mm x 100mm).
 * 
 * @param {Object} rawCoffee - Coffee profile or raw bean object
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateBrotherQlStickerCanvas(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const targetUrl = coffee.packaging?.customUrl?.trim() || generateSmartBagUrl(coffee, null, { compact: true });

  // 2362 x 1464 px (Exact 300 DPI high-resolution rendering of Brother DK-1202: 100mm x 62mm / 3.94" x 2.44")
  const canvas = document.createElement('canvas');
  canvas.width = 2362;
  canvas.height = 1464;
  const ctx = canvas.getContext('2d');

  // 1. Clean white thermal label background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 2362, 1464);

  // 2. Outer thermal boundary (clean hairline)
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 2322, 1424);

  // LEFT COLUMN: ROASTERY & RECIPE METADATA (Occupies x = 64 to 1220)
  const leftX = 64;

  // Roaster Brand Title (Enlarged for instant recognition)
  ctx.fillStyle = '#0C0A09';
  ctx.font = 'bold 84px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'left';
  const roasterText = coffee.roaster || 'Specialty Roaster';
  ctx.fillText(roasterText.length > 28 ? `${roasterText.slice(0, 26)}…` : roasterText, leftX, 130);

  // Bean Name (Maximized prominent serif headline)
  ctx.fillStyle = '#1C1917';
  ctx.font = '900 94px Georgia, serif';
  const beanText = coffee.beanName || 'Single Origin Lot';
  ctx.fillText(beanText.length > 26 ? `${beanText.slice(0, 24)}…` : beanText, leftX, 235);

  // Terroir & Roast Details
  ctx.fillStyle = '#57534E';
  ctx.font = 'bold 44px -apple-system, sans-serif';
  const roastPill = (coffee.roastLevel || 'LIGHT').toUpperCase();
  const originLine = `${roastPill} • ${coffee.origin || 'Specialty Single Origin'} • ${coffee.process || 'Washed'}`;
  ctx.fillText(originLine.length > 38 ? `${originLine.slice(0, 36)}…` : originLine, leftX, 305);

  // Tasting Notes
  const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(', ');
  if (notesStr) {
    ctx.fillStyle = '#92400E';
    ctx.font = 'italic 40px Georgia, serif';
    ctx.fillText(`Notes: ${notesStr.length > 40 ? `${notesStr.slice(0, 38)}…` : notesStr}`, leftX, 365);
  }

  // Divider Line
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(leftX, 400);
  ctx.lineTo(1220, 400);
  ctx.stroke();

  // Helper to draw clean high-contrast parameter cards
  const drawParamCard = (x, y, w, h, label, value, subtext, valColor = '#1C1917', valFont = '900 84px monospace, sans-serif') => {
    ctx.fillStyle = '#F5F5F4';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 16);
      ctx.fill();
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = '#D6D3D1';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
    }
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 30px monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 30, y + 54);

    ctx.fillStyle = valColor;
    ctx.font = valFont;
    ctx.fillText(value, x + 30, y + 170);

    ctx.fillStyle = '#57534E';
    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.fillText(subtext, x + 30, y + 260);
  };

  // 4-Card Dial-in Specifications Grid (2 rows x 2 columns)
  const cardW = 560;
  const cardH = 340;
  const cardGapX = 30;
  const cardGapY = 30;
  const row1Y = 430;
  const row2Y = row1Y + cardH + cardGapY;
  const col1X = leftX;
  const col2X = leftX + cardW + cardGapX;

  const ratioVal = `1:${coffee.extraction?.ratio || '16.5'}`;
  const tempVal = `${coffee.extraction?.tempF || '202'}°F`;
  const rawMethod = String(coffee?.extraction?.method || 'Pour Over').replace(/_/g, ' ').toUpperCase();
  const methodVal = rawMethod.length > 11 ? `${rawMethod.slice(0, 9)}…` : rawMethod;
  const rawGrind = (coffee.extraction?.grind || 'Med-Fine').split('(')[0].trim().toUpperCase();
  const grindVal = rawGrind.length > 13 ? `${rawGrind.slice(0, 11)}…` : rawGrind;

  // Card 1: Ratio
  drawParamCard(col1X, row1Y, cardW, cardH, 'WATER RATIO', ratioVal, 'Recommended Ratio', '#92400E', '900 84px monospace, sans-serif');

  // Card 2: Temp
  drawParamCard(col2X, row1Y, cardW, cardH, 'BREW TEMP', tempVal, 'Ideal Extraction', '#1C1917', '900 84px monospace, sans-serif');

  // Card 3: Method
  drawParamCard(col1X, row2Y, cardW, cardH, 'BREW METHOD', methodVal, 'Dialed-In Profile', '#1C1917', 'bold 64px -apple-system, sans-serif');

  // Card 4: Grind Size
  drawParamCard(col2X, row2Y, cardW, cardH, 'GRIND SIZE', grindVal, 'Even Extraction', '#1C1917', 'bold 58px -apple-system, sans-serif');

  // RIGHT COLUMN: GIANT HIGH-RESOLUTION SCANNABLE QR CODE (1040 x 1040 px)
  const qrSize = 1040;
  const qrX = 1260;
  const qrY = 70;

  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // -------------------------------------------------------------
  // FULL-WIDTH BOTTOM BANNER: SCAN FOR RECIPE (In Big Bold Letters)
  // -------------------------------------------------------------
  const bannerX = 64;
  const bannerY = 1195;
  const bannerW = 2234;
  const bannerH = 215;

  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 20);
    ctx.fill();
  } else {
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN FOR RECIPE', bannerX + bannerW / 2, bannerY + 138);

  return canvas;
}

/**
 * Generates a 300-DPI Minimal QR label for Brother QL-600 / QL-800 / QL-1100 (DK-1202, 2.4" x 3.9" / 62mm x 100mm).
 * Optimized specifically for high-contrast scanability, generous quiet zone, and clean bag branding.
 * 
 * @param {Object} rawCoffee - Coffee profile or raw bean object
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateBrotherQlMinimalStickerCanvas(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const targetUrl = coffee.packaging?.customUrl?.trim() || generateSmartBagUrl(coffee, null, { compact: true });

  // 2362 x 1464 px (Exact 300 DPI high-resolution rendering of Brother DK-1202: 100mm x 62mm / 3.94" x 2.44")
  const canvas = document.createElement('canvas');
  canvas.width = 2362;
  canvas.height = 1464;
  const ctx = canvas.getContext('2d');

  // 1. Crisp white thermal background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 2362, 1464);

  // 2. Clean outer hairline boundary
  ctx.strokeStyle = '#1C1917';
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 2322, 1424);

  // LEFT COLUMN: MINIMALIST BRAND & RECIPE IDENTIFIER (Occupies x = 64 to 1220)
  const leftX = 64;

  // Roaster Brand Subtitle
  ctx.fillStyle = '#0C0A09';
  ctx.font = 'bold 84px Georgia, "Times New Roman", serif';
  ctx.textAlign = 'left';
  const roasterText = coffee.roaster || 'Specialty Roaster';
  ctx.fillText(roasterText.length > 28 ? `${roasterText.slice(0, 26)}…` : roasterText, leftX, 130);

  // Bean Name (Prominent & Elegant)
  ctx.fillStyle = '#1C1917';
  ctx.font = '900 94px Georgia, serif';
  const beanText = coffee.beanName || 'Single Origin Lot';
  ctx.fillText(beanText.length > 26 ? `${beanText.slice(0, 24)}…` : beanText, leftX, 235);

  // Terroir & Roast
  ctx.fillStyle = '#57534E';
  ctx.font = 'bold 44px -apple-system, sans-serif';
  const roastPill = (coffee.roastLevel || 'LIGHT').toUpperCase();
  const originTag = `${roastPill} • ${(coffee.origin || 'SINGLE ORIGIN').toUpperCase()} • ${(coffee.process || 'WASHED').toUpperCase()}`;
  ctx.fillText(originTag.length > 38 ? `${originTag.slice(0, 36)}…` : originTag, leftX, 305);

  // Tasting Notes
  const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(', ');
  if (notesStr) {
    ctx.fillStyle = '#92400E';
    ctx.font = 'italic 40px Georgia, serif';
    ctx.fillText(`Flavor Profile: ${notesStr}`, leftX, 365);
  }

  // Divider Line
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(leftX, 400);
  ctx.lineTo(1220, 400);
  ctx.stroke();

  // Formula Card (Inverted Light Box for Instant Glanceability)
  const pillY = 430;
  const pillH = 710;
  const pillW = 1150;
  ctx.fillStyle = '#F5F5F4';
  ctx.strokeStyle = '#D6D3D1';
  ctx.lineWidth = 4;
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(leftX, pillY, pillW, pillH, 20);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(leftX, pillY, pillW, pillH);
    ctx.strokeRect(leftX, pillY, pillW, pillH);
  }

  // 3 Primary Specs inside Formula Box: RATIO, TEMP, METHOD
  const specRatio = `1:${coffee.extraction?.ratio || '16.5'}`;
  const specTemp = `${coffee.extraction?.tempF || '202'}°F`;
  const specMethod = String(coffee.extraction?.method || 'Pour Over').replace(/_/g, ' ').toUpperCase();
  const specGrind = String(coffee.extraction?.grind || 'Medium-Fine').split('(')[0].trim().toUpperCase();

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 32px monospace, sans-serif';
  ctx.fillText('WATER RATIO', leftX + 50, pillY + 90);
  ctx.fillStyle = '#92400E';
  ctx.font = '900 110px monospace, sans-serif';
  ctx.fillText(specRatio, leftX + 50, pillY + 200);

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 32px monospace, sans-serif';
  ctx.fillText('WATER TEMP', leftX + 620, pillY + 90);
  ctx.fillStyle = '#1C1917';
  ctx.font = '900 110px monospace, sans-serif';
  ctx.fillText(specTemp, leftX + 620, pillY + 200);

  // Method & Grind Row
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftX + 40, pillY + 310);
  ctx.lineTo(leftX + pillW - 40, pillY + 310);
  ctx.stroke();

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 32px monospace, sans-serif';
  ctx.fillText('BREWER METHOD', leftX + 50, pillY + 390);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 72px -apple-system, sans-serif';
  ctx.fillText(specMethod.length > 13 ? `${specMethod.slice(0, 11)}…` : specMethod, leftX + 50, pillY + 480);

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 32px monospace, sans-serif';
  ctx.fillText('GRIND SIZE', leftX + 620, pillY + 390);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 72px -apple-system, sans-serif';
  ctx.fillText(specGrind.length > 13 ? `${specGrind.slice(0, 11)}…` : specGrind, leftX + 620, pillY + 480);

  ctx.fillStyle = '#57534E';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  ctx.fillText('Optimal Water Spec: 140 TDS • Target Time: 3m 30s', leftX + 50, pillY + 620);

  // RIGHT COLUMN: GIANT HIGH-CONTRAST QR CODE (1040 x 1040 px)
  const qrSize = 1040;
  const qrX = 1260;
  const qrY = 70;

  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: qrSize,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // -------------------------------------------------------------
  // FULL-WIDTH BOTTOM BANNER: SCAN FOR RECIPE (In Big Bold Letters)
  // -------------------------------------------------------------
  const bannerX = 64;
  const bannerY = 1195;
  const bannerW = 2234;
  const bannerH = 215;

  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(bannerX, bannerY, bannerW, bannerH, 20);
    ctx.fill();
  } else {
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN FOR RECIPE', bannerX + bannerW / 2, bannerY + 138);

  return canvas;
}

/**
 * Downloads the Brother QL (DK-1202: 62mm x 100mm / 2.4" x 3.9") label as a 300-DPI PNG file.
 * 
 * @param {Object} rawCoffee
 */
export async function downloadBrotherQlStickerPng(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const canvas = await generateBrotherQlStickerCanvas(coffee);
  const slug = slugify(coffee.beanName || 'coffee');

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `smart_bag_brother_ql_dk1202_${slug}_300dpi.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads the Brother QL Minimal QR (DK-1202: 62mm x 100mm / 2.4" x 3.9") label as a 300-DPI PNG file.
 * 
 * @param {Object} rawCoffee
 */
export async function downloadBrotherQlMinimalStickerPng(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const canvas = await generateBrotherQlMinimalStickerCanvas(coffee);
  const slug = slugify(coffee.beanName || 'coffee');

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `smart_bag_brother_ql_dk1202_minimal_${slug}_300dpi.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads the 300-DPI composite packaging sticker as a PNG file.
 * 
 * @param {Object} rawCoffee
 */
export async function downloadCompleteStickerPng(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const canvas = await generateCompositeStickerCanvas(coffee);
  const slug = slugify(coffee.beanName || 'coffee');

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `smart_bag_sticker_${slug}_print_ready_300dpi.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Downloads a scalable vector SVG of the coffee lot's Smart Bag QR code.
 * 
 * @param {Object} rawCoffee
 */
export async function downloadVectorQrSvg(rawCoffee = {}) {
  const coffee = createCoffeeProfile(rawCoffee);
  const targetUrl = coffee.packaging?.customUrl?.trim() || generateSmartBagUrl(coffee);

  const svgString = await QRCode.toString(targetUrl, {
    type: 'svg',
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const slug = slugify(coffee.beanName || 'coffee');

  const a = document.createElement('a');
  a.href = url;
  a.download = `smart_bag_qr_${slug}_vector.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Downloads an ultra-high-resolution standalone QR code PNG.
 * 
 * @param {Object} rawCoffee
 * @param {number} width - Default 1200px
 */
export async function downloadHighResQrPng(rawCoffee = {}, width = 1200) {
  const coffee = createCoffeeProfile(rawCoffee);
  const targetUrl = coffee.packaging?.customUrl?.trim() || generateSmartBagUrl(coffee);

  const dataUrl = await QRCode.toDataURL(targetUrl, {
    width,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });

  const slug = slugify(coffee.beanName || 'coffee');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `smart_bag_qr_${slug}_${width}px.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
