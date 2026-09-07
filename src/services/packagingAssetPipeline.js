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
  ctx.fillText((coffee.extraction.method || 'pour_over').replace(/_/g, ' '), 100 + colW * 2, colY + 42);

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
