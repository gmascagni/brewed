/**
 * The Brew App — Isolated Label Printing Service
 * 
 * Solves the browser multi-page print bug where window.print() paginates
 * the whole page DOM (causing 30+ pages). Prints through an isolated,
 * hidden <iframe> with exact @page dimensions matching the physical roll.
 */

import { generateBrotherQlStickerCanvas, generateBrotherQlMinimalStickerCanvas, generateCompositeStickerCanvas } from '../services/packagingAssetPipeline';

/**
 * Prints a Brother QL-600 / QL-800 / QL-1100 (DK-1202, 2.4" x 3.9" / 62mm x 100mm) thermal label.
 * Supports both full spec and minimal QR layouts.
 * Renders the 300-DPI high-contrast canvas to an isolated iframe to guarantee
 * Chrome previews and prints exactly 1 sheet of paper with zero margins.
 * 
 * @param {Object} rawCoffee - Coffee profile object
 * @param {Object} options - Print options { minimal: boolean, layout: string }
 * @returns {Promise<void>}
 */
export async function printBrotherQlCoffee(rawCoffee = {}, options = {}) {
  const isMinimal = options.minimal || options.layout === 'brother_ql_minimal';
  // 1. Generate the 300-DPI high-contrast pixel-perfect canvas
  const canvas = isMinimal
    ? await generateBrotherQlMinimalStickerCanvas(rawCoffee)
    : await generateBrotherQlStickerCanvas(rawCoffee);
  const dataUrl = canvas.toDataURL('image/png');

  return new Promise((resolve) => {
    // 2. Create an isolated hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '100mm';
    iframe.style.height = '62mm';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.title = 'Thermal Label Print Frame';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error('Failed to access iframe document for printing');
      iframe.remove();
      resolve();
      return;
    }

    // 3. Write isolated document with strict 100mm x 62mm @page size, empty title to suppress browser headers/footers
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title></title>
        <style>
          @page {
            size: 100mm 62mm;
            margin: 0 !important;
          }
          @media print {
            @page {
              size: 100mm 62mm;
              margin: 0 !important;
            }
            *, *:before, *:after {
              box-sizing: border-box !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100mm !important;
              height: 62mm !important;
              overflow: hidden !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            img {
              width: 100mm !important;
              height: 62mm !important;
              max-width: 100mm !important;
              max-height: 62mm !important;
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              object-fit: fill !important;
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100mm;
            height: 62mm;
            overflow: hidden;
            background: #ffffff;
          }
          img {
            width: 100mm;
            height: 62mm;
            display: block;
            object-fit: fill;
          }
        </style>
      </head>
      <body>
        <img id="label-img" src="${dataUrl}" alt="Brother QL DK-1202 Label" />
      </body>
      </html>
    `);
    doc.close();

    const img = doc.getElementById('label-img');
    const triggerPrint = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.error('Print trigger error:', err);
        } finally {
          const handleAfterPrint = () => {
            iframe.remove();
            resolve();
          };
          if (iframe.contentWindow) {
            iframe.contentWindow.onafterprint = handleAfterPrint;
          }
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              iframe.remove();
            }
            resolve();
          }, 30000);
        }
      }, 100);
    };

    if (img && !img.complete) {
      img.onload = triggerPrint;
      img.onerror = () => {
        console.error('Failed to load label image for print');
        iframe.remove();
        resolve();
      };
    } else {
      triggerPrint();
    }
  });
}

/**
 * Prints a 3" x 3" square thermal label (1200 x 1200 px at 400 DPI / 3in x 3in).
 * Renders the high-contrast canvas to an isolated iframe with strict @page dimensions.
 * 
 * @param {Object} rawCoffee - Coffee profile object
 * @returns {Promise<void>}
 */
export async function printThermalSticker(rawCoffee = {}) {
  const canvas = await generateCompositeStickerCanvas(rawCoffee);
  const dataUrl = canvas.toDataURL('image/png');

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '3in';
    iframe.style.height = '3in';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.title = 'Thermal 3x3 Label Print Frame';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error('Failed to access iframe document for printing');
      iframe.remove();
      resolve();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title></title>
        <style>
          @page {
            size: 3in 3in;
            margin: 0 !important;
          }
          @media print {
            @page {
              size: 3in 3in;
              margin: 0 !important;
            }
            *, *:before, *:after {
              box-sizing: border-box !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 3in !important;
              height: 3in !important;
              overflow: hidden !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            img {
              width: 3in !important;
              height: 3in !important;
              max-width: 3in !important;
              max-height: 3in !important;
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              object-fit: fill !important;
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 3in;
            height: 3in;
            overflow: hidden;
            background: #ffffff;
          }
          img {
            width: 3in;
            height: 3in;
            display: block;
            object-fit: fill;
          }
        </style>
      </head>
      <body>
        <img id="label-img" src="${dataUrl}" alt="Thermal 3x3 Label" />
      </body>
      </html>
    `);
    doc.close();

    const img = doc.getElementById('label-img');
    const triggerPrint = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (err) {
          console.error('Print trigger error:', err);
        } finally {
          const handleAfterPrint = () => {
            iframe.remove();
            resolve();
          };
          if (iframe.contentWindow) {
            iframe.contentWindow.onafterprint = handleAfterPrint;
          }
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              iframe.remove();
            }
            resolve();
          }, 30000);
        }
      }, 100);
    };

    if (img && !img.complete) {
      img.onload = triggerPrint;
      img.onerror = () => {
        console.error('Failed to load label image for print');
        iframe.remove();
        resolve();
      };
    } else {
      triggerPrint();
    }
  });
}

/**
 * Prints an arbitrary DOM element inside an isolated iframe,
 * copying active stylesheet links so formatting remains intact
 * without page overflow.
 * 
 * @param {HTMLElement} element - Target DOM node to print
 * @param {Object} options - Print options (width, height, title)
 * @returns {Promise<void>}
 */
export async function printHtmlElementIsolated(element, options = {}) {
  if (!element) {
    console.warn('printHtmlElementIsolated: No element provided');
    return;
  }

  const {
    width = '3in',
    height = '3in',
    title = 'Packaging Label'
  } = options;

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = width;
    iframe.style.height = height;
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.title = 'Label Print Frame';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      resolve();
      return;
    }

    const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(tag => tag.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title></title>
        ${styleTags}
        <style>
          @page {
            size: ${width} ${height};
            margin: 0 !important;
          }
          @media print {
            @page {
              size: ${width} ${height};
              margin: 0 !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: ${width} !important;
              height: ${height} !important;
              overflow: hidden !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-wrapper {
              width: ${width} !important;
              height: ${height} !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              overflow: hidden !important;
            }
          }
          html, body {
            margin: 0;
            padding: 0;
            width: ${width};
            height: ${height};
            background: #ffffff;
          }
          .print-wrapper {
            width: ${width};
            height: ${height};
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div class="print-wrapper">
          ${element.outerHTML}
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('Print trigger error:', err);
      } finally {
        const handleAfterPrint = () => {
          iframe.remove();
          resolve();
        };
        if (iframe.contentWindow) {
          iframe.contentWindow.onafterprint = handleAfterPrint;
        }
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            iframe.remove();
          }
          resolve();
        }, 30000);
      }
    }, 250);
  });
}
