/**
 * The Brew App — Isolated Label Printing Service
 * 
 * Solves the browser multi-page print bug where window.print() paginates
 * the whole page DOM (causing 30+ pages). Prints through an isolated,
 * hidden <iframe> with exact @page dimensions matching the physical roll.
 */

import { generateBrotherQlStickerCanvas } from '../services/packagingAssetPipeline';

/**
 * Prints a Brother QL-600 (DK-1209, 1.1" x 2.4" / 29mm x 62mm) thermal label.
 * Renders the 300-DPI high-contrast canvas to an isolated iframe to guarantee
 * Chrome previews and prints exactly 1 sheet of paper.
 * 
 * @param {Object} rawCoffee - Coffee profile object
 * @returns {Promise<void>}
 */
export async function printBrotherQlCoffee(rawCoffee = {}) {
  // 1. Generate the 300-DPI high-contrast pixel-perfect canvas
  const canvas = await generateBrotherQlStickerCanvas(rawCoffee);
  const dataUrl = canvas.toDataURL('image/png');

  return new Promise((resolve) => {
    // 2. Create an isolated hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    iframe.title = 'Thermal Label Print Frame';

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      console.error('Failed to access iframe document for printing');
      iframe.remove();
      resolve();
      return;
    }

    const title = `${rawCoffee.beanName || 'Coffee'} - Brother QL-600 Label`;

    // 3. Write isolated document with strict 2.4" x 1.1" @page size and zero margins
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: 2.4in 1.1in;
            margin: 0mm;
          }
          @media print {
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 2.4in !important;
              height: 1.1in !important;
              overflow: hidden !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            img {
              width: 2.4in !important;
              height: 1.1in !important;
              max-width: 2.4in !important;
              max-height: 1.1in !important;
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              object-fit: contain !important;
              image-rendering: -webkit-optimize-contrast !important;
              image-rendering: crisp-edges !important;
            }
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 2.4in;
            height: 1.1in;
            overflow: hidden;
            background: #ffffff;
          }
          img {
            width: 2.4in;
            height: 1.1in;
            display: block;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img id="label-img" src="${dataUrl}" alt="Brother QL Label" />
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
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
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
        <title>${title}</title>
        ${styleTags}
        <style>
          @page {
            size: ${width} ${height};
            margin: 0mm;
          }
          @media print {
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
