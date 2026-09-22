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

  // 4. Header Tag
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px -apple-system, monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SPECIALTY COFFEE ROASTERY • SMART BAG CERTIFIED', 70, 105);

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
  ctx.font = 'bold 32px -apple-system, monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✨  SCAN ME FOR RECIPE  ✨', 600, bannerY + 49);

  // 11. Centered High-Res QR Code
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: 700,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, 250, 560, 700, 700);

  // 12. Callout Subtitle below QR
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('AIM PHONE CAMERA TO DIAL-IN & BREW', 600, 1315);

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

  // 14. Footer
  ctx.fillStyle = '#A8A29E';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('thebrew.app dial-in', 70, 1660);
  ctx.textAlign = 'right';
  ctx.fillText(`LOT: ${coffee.packaging.upc || 'CERTIFIED-LOT'}`, 1130, 1660);

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

  // 2362 x 1464 px (Exact 2x 300 DPI high-resolution rendering of Brother DK-1202: 100mm x 62mm / 3.94" x 2.44")
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

  // LEFT COLUMN: ROASTERY & RECIPE METADATA (Occupies x = 60 to 1460)
  const leftX = 64;

  // Header Subtitle Badge Pill
  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(leftX, 50, 480, 52, 10);
    ctx.fill();
  } else {
    ctx.fillRect(leftX, 50, 480, 52);
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('THEBREW.APP • SMART BAG™ DIAL-IN', leftX + 20, 85);

  // Roaster Brand Title
  ctx.fillStyle = '#0C0A09';
  ctx.font = 'bold 56px Georgia, "Times New Roman", serif';
  const roasterText = coffee.roaster || 'Specialty Roaster';
  ctx.fillText(roasterText.length > 30 ? `${roasterText.slice(0, 28)}…` : roasterText, leftX, 170);

  // Bean Name
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 50px Georgia, serif';
  const beanText = coffee.beanName || 'Single Origin Lot';
  ctx.fillText(beanText.length > 32 ? `${beanText.slice(0, 30)}…` : beanText, leftX, 236);

  // Terroir & Roast Details
  ctx.fillStyle = '#57534E';
  ctx.font = '600 28px -apple-system, sans-serif';
  const roastPill = (coffee.roastLevel || 'LIGHT').toUpperCase();
  const originLine = `${roastPill} • ${coffee.origin || 'Single Origin'} • ${coffee.process || 'Washed'}`;
  ctx.fillText(originLine.length > 46 ? `${originLine.slice(0, 44)}…` : originLine, leftX, 290);

  // Tasting Notes
  const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(', ');
  if (notesStr) {
    ctx.fillStyle = '#92400E';
    ctx.font = 'italic 28px Georgia, serif';
    ctx.fillText(`Notes: ${notesStr}`, leftX, 338);
  }

  // Divider Line
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(leftX, 370);
  ctx.lineTo(1460, 370);
  ctx.stroke();

  // Extraction Specification Box (Left Side, Middle/Bottom)
  const boxY = 400;
  const boxH = 680;
  const boxW = 1400;
  ctx.fillStyle = '#F5F5F4';
  ctx.fillRect(leftX, boxY, boxW, boxH);
  ctx.strokeStyle = '#D6D3D1';
  ctx.lineWidth = 3;
  ctx.strokeRect(leftX, boxY, boxW, boxH);

  // Subheader
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 24px monospace, sans-serif';
  ctx.fillText('BARISTA EXTRACTION & WATER CHEMISTRY SPECIFICATIONS', leftX + 32, boxY + 54);

  // Grid of 5 Parameters
  const colW = (boxW - 64) / 5;
  const pY = boxY + 130;

  // Col 1: Ratio
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('RATIO', leftX + 32, pY);
  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 52px monospace, sans-serif';
  ctx.fillText(`1:${coffee.extraction?.ratio || '16.5'}`, leftX + 32, pY + 68);

  // Col 2: Temp
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('TEMP', leftX + 32 + colW, pY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 52px monospace, sans-serif';
  ctx.fillText(`${coffee.extraction?.tempF || '202'}°F`, leftX + 32 + colW, pY + 68);

  // Col 3: Method
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('METHOD', leftX + 32 + colW * 2, pY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 36px -apple-system, sans-serif';
  const methodStr = String(coffee?.extraction?.method || 'pour_over').replace(/_/g, ' ');
  ctx.fillText(methodStr.length > 11 ? `${methodStr.slice(0, 10)}…` : methodStr, leftX + 32 + colW * 2, pY + 65);

  // Col 4: Grind
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('GRIND SIZE', leftX + 32 + colW * 3, pY);
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 34px -apple-system, sans-serif';
  const grindStr = (coffee.extraction?.grind || 'Med-Fine').split('(')[0].trim();
  ctx.fillText(grindStr, leftX + 32 + colW * 3, pY + 65);

  // Col 5: Water Spec
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('WATER TDS', leftX + 32 + colW * 4, pY);
  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 50px monospace, sans-serif';
  ctx.fillText('140 TDS', leftX + 32 + colW * 4, pY + 68);

  // Secondary Dose & Brew Time Guidance Line
  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftX + 32, boxY + 280);
  ctx.lineTo(leftX + boxW - 32, boxY + 280);
  ctx.stroke();

  ctx.fillStyle = '#44403C';
  ctx.font = '600 28px -apple-system, sans-serif';
  ctx.fillText('Recommended Dose: 18.0g Dry → 297g Water • Target Extraction Time: 3m 30s', leftX + 32, boxY + 340);

  ctx.fillStyle = '#78716C';
  ctx.font = 'italic 26px Georgia, serif';
  ctx.fillText('Scan QR code with phone camera to launch live guided multi-phase timer & recipe auto-dial.', leftX + 32, boxY + 410);

  // Water chemistry sub-note
  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('Optimal Water Chemistry: 70 GH • 30 KH • pH 7.0 (Lotus / DIY Formula Ready)', leftX + 32, boxY + 475);

  // Footer Tagline & Lot Code
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 26px monospace, sans-serif';
  ctx.fillText('thebrew.app/roasters', leftX, 1370);
  ctx.textAlign = 'right';
  ctx.fillText(`BROTHER DK-1202 SPEC • LOT: ${coffee.packaging?.upc || 'CERTIFIED-LOT'}`, 1460, 1370);

  // RIGHT COLUMN: MAXIMIZED HIGH-RESOLUTION QR CODE (780 x 780 px)
  const qrSize = 780;
  const qrX = 1530;
  const qrY = 160;

  const errorLevel = targetUrl.length > 55 ? 'M' : 'H';

  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: qrSize,
    margin: 2,
    errorCorrectionLevel: errorLevel,
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Human-readable short link directly beneath QR code
  ctx.fillStyle = '#57534E';
  ctx.font = 'bold 30px monospace, sans-serif';
  ctx.textAlign = 'center';
  const displayShort = targetUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  const formattedLink = displayShort.length > 30 ? `${displayShort.slice(0, 28)}…` : displayShort;
  ctx.fillText(formattedLink, qrX + qrSize / 2, qrY + qrSize + 50);

  // Scan Action Callout
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 28px monospace, sans-serif';
  ctx.fillText('⚡ SCAN CAMERA FOR SMART BAG™ RECIPE', qrX + qrSize / 2, qrY + qrSize + 100);

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

  // 2362 x 1464 px (Exact 2x 300 DPI high-resolution rendering of Brother DK-1202: 100mm x 62mm / 3.94" x 2.44")
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

  // LEFT COLUMN: MINIMALIST BRAND & RECIPE IDENTIFIER (Occupies x = 64 to 1440)
  const leftX = 64;

  // Header Badge Pill (Top Left)
  ctx.fillStyle = '#1C1917';
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(leftX, 60, 440, 56, 12);
    ctx.fill();
  } else {
    ctx.fillRect(leftX, 60, 440, 56);
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px monospace, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('THEBREW.APP • SMART BAG', leftX + 24, 98);

  // Secondary Origin Tagline
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 26px monospace, sans-serif';
  const roastPill = (coffee.roastLevel || 'LIGHT').toUpperCase();
  const originTag = `${roastPill} • ${(coffee.origin || 'SINGLE ORIGIN').toUpperCase()}`;
  ctx.fillText(originTag.length > 34 ? `${originTag.slice(0, 32)}…` : originTag, leftX + 470, 98);

  // Bean Name (Prominent & Elegant)
  ctx.fillStyle = '#0C0A09';
  ctx.font = 'bold 64px Georgia, "Times New Roman", serif';
  const beanText = coffee.beanName || 'Single Origin Lot';
  ctx.fillText(beanText.length > 28 ? `${beanText.slice(0, 26)}…` : beanText, leftX, 200);

  // Roaster Brand Subtitle
  ctx.fillStyle = '#44403C';
  ctx.font = 'bold 38px -apple-system, sans-serif';
  const roasterText = coffee.roaster || 'Specialty Roaster';
  ctx.fillText(roasterText.length > 34 ? `${roasterText.slice(0, 32)}…` : roasterText, leftX, 260);

  // High-Contrast Recipe Formula Pill (Inverted Light Box for Instant Glanceability)
  const pillY = 320;
  const pillH = 180;
  const pillW = 1380;
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

  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 22px monospace, sans-serif';
  ctx.fillText('RATIO', leftX + 40, pillY + 54);
  ctx.fillText('WATER TEMP', leftX + 440, pillY + 54);
  ctx.fillText('BREWER METHOD', leftX + 880, pillY + 54);

  ctx.fillStyle = '#92400E';
  ctx.font = 'bold 64px monospace, sans-serif';
  ctx.fillText(specRatio, leftX + 40, pillY + 130);

  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 64px monospace, sans-serif';
  ctx.fillText(specTemp, leftX + 440, pillY + 130);

  ctx.font = 'bold 44px -apple-system, sans-serif';
  ctx.fillText(specMethod.length > 15 ? `${specMethod.slice(0, 13)}…` : specMethod, leftX + 880, pillY + 125);

  // Tasting Notes (Italic Serif)
  const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(' • ');
  if (notesStr) {
    ctx.fillStyle = '#78716C';
    ctx.font = 'italic 34px Georgia, serif';
    ctx.fillText(`Flavor Profile: ${notesStr}`, leftX, 570);
  }

  // Extra Details Box for DK-1202
  ctx.fillStyle = '#44403C';
  ctx.font = '500 28px -apple-system, sans-serif';
  ctx.fillText(`Grind Size: ${coffee.extraction?.grind || 'Medium-Fine'} • Water Spec: 140 TDS • Dose: 1:16.5 Golden Ratio`, leftX, 630);

  // Footer Information
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 32px monospace, sans-serif';
  ctx.fillText('⚡ SCAN TO BREW WITH GUIDED TIMER', leftX, 1370);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#78716C';
  ctx.font = 'bold 26px monospace, sans-serif';
  ctx.fillText(`DK-1202 • ${coffee.packaging?.upc || 'LOT-749038'}`, 1440, 1370);

  // RIGHT COLUMN: GIANT HIGH-CONTRAST QR CODE (840 x 840 px)
  const qrSize = 840;
  const qrX = 1480;
  const qrY = 240;

  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, targetUrl, {
    width: qrSize,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#000000', light: '#FFFFFF' }
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Short URL underneath
  ctx.fillStyle = '#57534E';
  ctx.font = 'bold 28px monospace, sans-serif';
  ctx.textAlign = 'center';
  const displayShort = targetUrl.replace(/^https?:\/\//i, '').replace(/\/$/, '');
  ctx.fillText(displayShort, qrX + qrSize / 2, qrY + qrSize + 60);

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
