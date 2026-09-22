import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Download,
  Printer,
  Copy,
  Maximize2,
  Check,
  Tag,
  Coffee,
  X
} from 'lucide-react';
import QRCode from 'qrcode';
import { generateSmartBagUrl } from '../../data/roasterRegistry';
import {
  downloadCompleteStickerPng,
  downloadBrotherQlStickerPng,
  downloadBrotherQlMinimalStickerPng
} from '../../services/packagingAssetPipeline';
import { printBrotherQlCoffee, printThermalSticker, printHtmlElementIsolated } from '../../utils/printLabel';

// Module-level permanent memory cache for packaging QR data URLs
const ROASTER_LABEL_QR_CACHE = new Map();

/**
 * Hook to asynchronously generate and cache crisp scannable QR codes for all coffees.
 * Uses a stable string cacheKey and in-memory cache to eliminate redundant canvas rendering and prevent infinite re-renders.
 */
export function useCoffeeLabelQrCodes(coffees = [], roaster = null) {
  const [qrMap, setQrMap] = useState(() => {
    const initial = {};
    if (Array.isArray(coffees)) {
      for (const c of coffees) {
        if (!c || !c.id) continue;
        if (ROASTER_LABEL_QR_CACHE.has(c.id)) {
          initial[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
        }
      }
    }
    return initial;
  });

  const cacheKey = useMemo(() => {
    const ids = Array.isArray(coffees) ? coffees.map(c => c?.id).filter(Boolean).join(',') : '';
    return `${ids}:::${roaster?.name || ''}`;
  }, [coffees, roaster?.name]);

  useEffect(() => {
    let isCancelled = false;
    const list = Array.isArray(coffees) ? coffees : [];
    
    const uncached = list.filter(c => c && c.id && !ROASTER_LABEL_QR_CACHE.has(c.id));
    if (uncached.length === 0) {
      const fullMap = {};
      list.forEach(c => {
        if (c && c.id && ROASTER_LABEL_QR_CACHE.has(c.id)) {
          fullMap[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
        }
      });
      setQrMap(prev => {
        const hasDiff = list.some(c => c?.id && !prev[c.id]);
        return hasDiff ? fullMap : prev;
      });
      return;
    }

    async function generateUncached() {
      for (const coffee of uncached) {
        if (isCancelled || !coffee || !coffee.id) continue;
        try {
          const url = generateSmartBagUrl({
            ...coffee,
            roaster: roaster?.name || coffee.roaster || 'Specialty Roaster'
          }, null, { compact: true });
          const dataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 800,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          ROASTER_LABEL_QR_CACHE.set(coffee.id, { qrDataUrl: dataUrl, url });
        } catch (err) {
          console.warn('Failed to generate packaging QR for coffee:', coffee.id, err);
        }
      }

      if (!isCancelled) {
        const fullMap = {};
        list.forEach(c => {
          if (c && c.id && ROASTER_LABEL_QR_CACHE.has(c.id)) {
            fullMap[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
          }
        });
        setQrMap(fullMap);
      }
    }

    generateUncached();

    return () => {
      isCancelled = true;
    };
  }, [cacheKey]);

  return qrMap;
}

/**
 * Realistic retail barcode stripes renderer
 */
export function BarcodeStripes({ value = '850029384012' }) {
  const str = String(value || '850029384012');
  return (
    <div className="flex flex-col items-center justify-center space-y-1 py-1 select-none">
      <div className="flex items-end justify-center h-7 sm:h-8 gap-[1.5px] px-2 bg-white w-full max-w-[190px]">
        {Array.from(str).flatMap((char, i) => {
          const n = parseInt(char, 10) || (i % 5) + 1;
          const w1 = (n % 3) + 1;
          const w2 = ((n + 1) % 2) + 1;
          return [
            <div key={`b1-${i}`} style={{ width: `${w1}px` }} className="h-6 sm:h-7 bg-stone-900 shrink-0" />,
            <div key={`g-${i}`} style={{ width: '1px' }} className="h-6 sm:h-7 bg-transparent shrink-0" />,
            <div key={`b2-${i}`} style={{ width: `${w2}px` }} className="h-7 sm:h-8 bg-stone-900 shrink-0" />
          ];
        })}
      </div>
      <div className="text-[10px] font-mono tracking-[0.22em] text-stone-700 font-bold">
        {str}
      </div>
    </div>
  );
}

/**
 * High-contrast tactile packaging label sticker component
 */
export function CoffeePackagingLabel({
  coffee,
  roaster,
  qrDataUrl,
  smartBagUrl,
  layout = 'thermal', // 'thermal' | 'badge' | 'brother_ql' | 'brother_ql_minimal'
  onEnlarge,
  onBrewCoffee,
  isEnlarged = false
}) {
  const labelRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (smartBagUrl && navigator.clipboard) {
      navigator.clipboard.writeText(smartBagUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      if (layout === 'brother_ql_minimal') {
        await downloadBrotherQlMinimalStickerPng({
          ...coffee,
          roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
        });
      } else if (layout === 'brother_ql') {
        await downloadBrotherQlStickerPng({
          ...coffee,
          roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
        });
      } else {
        await downloadCompleteStickerPng({
          ...coffee,
          roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
        });
      }
    } catch (err) {
      console.error('Download sticker error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async (e) => {
    e.stopPropagation();
    if (layout === 'brother_ql_minimal') {
      await printBrotherQlCoffee({
        ...coffee,
        roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
      }, { minimal: true, layout: 'brother_ql_minimal' });
    } else if (layout === 'brother_ql') {
      await printBrotherQlCoffee({
        ...coffee,
        roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
      });
    } else if (onEnlarge) {
      onEnlarge(coffee);
    } else if (labelRef.current) {
      await printHtmlElementIsolated(labelRef.current, {
        width: '3in',
        height: '3in',
        title: `${coffee.beanName || 'Coffee'} Thermal Label`
      });
    } else {
      await printBrotherQlCoffee({
        ...coffee,
        roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
      }, { minimal: true, layout: 'brother_ql_minimal' });
    }
  };

  const roastText = (coffee.roastLevel || 'Light').toUpperCase();
  const upc = coffee.upc || `LOT-${(coffee.beanName || 'COFFEE').slice(0, 5).toUpperCase()}-2026`;

  // Thermal White Sticker Layout (3" x 3")
  if (layout === 'thermal') {
    return (
      <div 
        ref={labelRef}
        className={`w-full max-w-sm mx-auto flex flex-col justify-between rounded-3xl bg-white text-stone-900 p-5 sm:p-6 border-2 border-stone-800 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/20 group ${isEnlarged ? 'scale-100' : ''}`}
      >
        <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>

        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                SPECIALTY ROASTERY • SMART BAG
              </span>
              <h4 className="font-serif text-sm font-bold text-stone-900 leading-tight">
                {roaster?.name || coffee.roaster || 'Specialty Roastery'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
              {roastText}
            </span>
          </div>

          <div>
            <h3 className="font-serif text-base sm:text-lg font-black text-stone-950 leading-snug">
              {coffee.beanName}
            </h3>
            <p className="text-[11px] font-mono text-stone-600 mt-0.5 truncate">
              {coffee.origin || 'Specialty Origin'} • {coffee.process || 'Washed'}
            </p>
          </div>

          {coffee.tastingNotes && coffee.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {coffee.tastingNotes.slice(0, 3).map((note, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[10px] font-mono text-stone-700 font-medium">
                  {note}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-col items-center justify-center p-2.5 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Scan Me for Recipe</span>
            </div>

            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Smart Bag QR for ${coffee.beanName}`}
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg p-1 bg-white border border-stone-200"
              />
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
                Generating QR...
              </div>
            )}

            <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider mt-1.5 font-bold">
              Aim phone camera to load timer
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-stone-100 border border-stone-200 text-center font-mono">
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Ratio</span>
              <span className="text-[11px] font-bold text-amber-900">1:{coffee.recommendedRatio || 16.5}</span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Temp</span>
              <span className="text-[11px] font-bold text-stone-900">{coffee.tempF || 202}°F</span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Method</span>
              <span className="text-[10px] font-bold text-stone-900 truncate block capitalize">
                {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ').split(' ')[0]}
              </span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Grind</span>
              <span className="text-[10px] font-bold text-stone-900 truncate block">
                {(coffee.recommendedGrind || 'Med-Fine').split(' ')[0]}
              </span>
            </div>
          </div>

          <BarcodeStripes value={upc} />
        </div>

        <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
            title="Download 300 DPI composite sticker PNG"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Print label direct"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Copy scannable recipe URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          {onEnlarge && (
            <button
              type="button"
              onClick={() => onEnlarge(coffee)}
              className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Enlarge label proof"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Brother QL Minimal Thermal Label (2.4" x 3.9" / 100mm x 62mm / DK-1202)
  if (layout === 'brother_ql_minimal') {
    return (
      <div className={`w-full max-w-md mx-auto flex flex-col justify-between rounded-2xl bg-white text-stone-900 p-3.5 border-2 border-stone-800 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/20 group ${isEnlarged ? 'scale-100' : ''}`}>
        <div className="flex items-stretch justify-between gap-3 h-full">
          <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[7.5px] font-mono uppercase tracking-wider font-black bg-stone-900 text-white px-1.5 py-0.5 rounded">
                  THEBREW.APP
                </span>
                <span className="text-[7.5px] font-mono text-stone-600 uppercase tracking-tight truncate font-bold">
                  {coffee.origin || 'SMART BAG'}
                </span>
              </div>
              <h3 className="font-serif text-base sm:text-lg font-black text-stone-950 truncate leading-tight tracking-tight">
                {coffee.beanName}
              </h3>
              <p className="text-[10.5px] text-stone-600 font-bold truncate font-mono uppercase tracking-wider mt-0.5">
                {roaster?.name || coffee.roaster || 'Specialty Roastery'}
              </p>
            </div>

            <div className="bg-stone-100 border border-stone-300 rounded-md px-2 py-1 my-1">
              <span className="text-[8.5px] font-mono font-black text-stone-900 tracking-tight block">
                RATIO 1:{coffee.recommendedRatio || 16.5} • {coffee.tempF || 202}°F • {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ').toUpperCase()} • 140 TDS
              </span>
            </div>

            <div>
              {coffee.tastingNotes && coffee.tastingNotes.length > 0 && (
                <p className="text-[9px] font-serif italic text-stone-700 truncate mb-0.5">
                  Notes: {coffee.tastingNotes.slice(0, 3).join(', ')}
                </p>
              )}
              <div className="flex items-center justify-between text-[7px] font-mono text-stone-600 pt-1 border-t border-stone-200">
                <span className="font-extrabold text-stone-900 uppercase">⚡ SCAN TO BREW</span>
                <span className="truncate">{upc}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-lg border-2 border-stone-800 h-full aspect-square w-28 h-28 sm:w-32 sm:h-32 shadow-sm">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Smart Bag QR for ${coffee.beanName}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-[9px]">
                Generating...
              </div>
            )}
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-stone-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
            title="Download Brother QL DK-1202 Minimal 300 DPI label PNG"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Print label direct"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Copy scannable recipe URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          {onEnlarge && (
            <button
              type="button"
              onClick={() => onEnlarge(coffee)}
              className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Enlarge label proof"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Brother QL Multipurpose Thermal Label (2.4" x 3.9" / 100mm x 62mm / DK-1202)
  if (layout === 'brother_ql') {
    return (
      <div className={`w-full max-w-md mx-auto flex flex-col justify-between rounded-2xl bg-white text-stone-900 p-3.5 border-2 border-stone-800 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/20 group ${isEnlarged ? 'scale-100' : ''}`}>
        <div className="flex items-stretch justify-between gap-2.5 h-full">
          <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[7px] font-mono uppercase tracking-wider font-extrabold bg-stone-900 text-white px-1.5 py-0.5 rounded">
                  THEBREW.APP
                </span>
                <span className="text-[7px] font-mono text-stone-500 uppercase tracking-tight truncate">
                  {roastText} Roast
                </span>
                <span className="text-[7px] font-mono text-stone-400 uppercase tracking-tight truncate ml-auto font-semibold">
                  DK-1202 • 100×62mm
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-stone-950 truncate leading-tight">
                {roaster?.name || coffee.roaster || 'Specialty Roaster'}
              </h4>
              <p className="text-[11px] text-stone-700 font-medium truncate font-sans">
                {coffee.beanName}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 py-1 px-1.5 bg-stone-100 rounded-md border border-stone-200 text-[7.5px] font-mono my-1">
              <div>
                <span className="text-stone-500 block text-[6.5px] uppercase leading-none">Ratio</span>
                <span className="font-bold text-amber-800">1:{coffee.recommendedRatio || 16.5}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[6.5px] uppercase leading-none">Temp</span>
                <span className="font-bold text-stone-900">{coffee.tempF || 202}°F</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[6.5px] uppercase leading-none">Water</span>
                <span className="font-bold text-cyan-800">140 TDS</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[6.5px] uppercase leading-none">Method</span>
                <span className="font-bold text-stone-900 capitalize truncate block">
                  {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ')}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block text-[6.5px] uppercase leading-none">Grind</span>
                <span className="font-bold text-stone-900 truncate block">
                  {(coffee.recommendedGrind || 'Med-Fine').split('(')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[7px] font-mono text-stone-500 pt-0.5 border-t border-stone-200">
              <span className="truncate">{upc}</span>
              <span className="font-bold text-stone-800 uppercase">⚡ Scan Recipe</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-lg border border-stone-300 h-full aspect-square w-28 h-28 sm:w-32 sm:h-32">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Smart Bag QR for ${coffee.beanName}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-[9px]">
                Generating...
              </div>
            )}
          </div>
        </div>

        <div className="pt-2.5 mt-2.5 border-t border-stone-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
            title="Download Brother QL DK-1202 Full 300 DPI label PNG"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Print label direct"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Copy scannable recipe URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          {onEnlarge && (
            <button
              type="button"
              onClick={() => onEnlarge(coffee)}
              className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Enlarge label proof"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Luxury Roaster Badge Layout (Espresso & Gold)
  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col justify-between rounded-3xl bg-[#1A120B] text-cream-light p-5 sm:p-6 border-2 border-amber-gold/60 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/30 group ${isEnlarged ? 'scale-100' : ''}`}>
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-gold" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-gold" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-gold" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-gold" />

      <div className="space-y-3">
        <div className="text-center border-b border-white/10 pb-2">
          <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-amber-gold/90 block">
            DIALED-IN EXTRACTION RECIPE
          </span>
          <h4 className="font-serif text-base font-bold text-cream-light mt-0.5 tracking-wide">
            {roaster?.name || coffee.roaster || 'Specialty Roastery'}
          </h4>
          <p className="text-xs text-amber-200/80 font-serif italic">
            {coffee.beanName}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-md mx-auto w-fit">
          <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A120B] text-amber-gold font-mono text-[9px] font-bold uppercase tracking-wider mb-2 border border-amber-gold/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-gold" />
            <span>Scan Me for Recipe</span>
          </div>

          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Smart Bag QR Code"
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
            />
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
              Generating QR...
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.06] border border-white/10 text-[10px] font-mono text-center">
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Ratio</span>
            <span className="font-bold text-amber-gold">1:{coffee.recommendedRatio || 16.5}</span>
          </div>
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Temp</span>
            <span className="font-bold text-cream-light">{coffee.tempF || 202}°F</span>
          </div>
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Method</span>
            <span className="font-bold text-cream-light capitalize truncate block">
              {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[8px] font-mono text-amber-gold/70 block uppercase tracking-wider">
            thebrew.app • Smart Bag Certified • {upc}
          </span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-1.5 px-2 rounded-lg btn-tactile-amber text-espresso-950 font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
        >
          <Printer className="w-3 h-3 text-amber-gold" />
          <span>Print</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-gold" />}
        </button>

        {onEnlarge && (
          <button
            type="button"
            onClick={() => onEnlarge(coffee)}
            className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-amber-gold" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * High-Resolution Packaging Label Modal Proof with Layout Switcher
 */
export default function PackagingLabelProofModal({
  coffee,
  roaster,
  qrDataUrl,
  smartBagUrl,
  onClose,
  onBrewCoffee
}) {
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem('the_brew_app_label_layout') || 'brother_ql';
    } catch {
      return 'brother_ql';
    }
  });

  const handleSelectLayout = (newLayout) => {
    setLayout(newLayout);
    try {
      localStorage.setItem('the_brew_app_label_layout', newLayout);
    } catch {}
  };
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!coffee) return null;

  const coffeePayload = {
    ...coffee,
    roaster: roaster?.name || coffee.roaster || 'Specialty Roaster'
  };

  const handlePrintModal = async () => {
    setIsPrinting(true);
    try {
      if (layout === 'brother_ql_minimal') {
        await printBrotherQlCoffee(coffeePayload, { minimal: true, layout: 'brother_ql_minimal' });
      } else if (layout === 'brother_ql') {
        await printBrotherQlCoffee(coffeePayload);
      } else {
        await printThermalSticker(coffeePayload);
      }
    } catch (err) {
      console.error('Modal print error:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadModal = async () => {
    setIsSaving(true);
    try {
      if (layout === 'brother_ql_minimal') {
        await downloadBrotherQlMinimalStickerPng(coffeePayload);
      } else if (layout === 'brother_ql') {
        await downloadBrotherQlStickerPng(coffeePayload);
      } else {
        await downloadCompleteStickerPng(coffeePayload);
      }
    } catch (err) {
      console.error('Modal download error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="min-h-full flex items-start justify-center p-4 pt-12 sm:pt-16 pb-16">
        <div className="relative max-w-lg w-full bg-[#120B08] border border-amber-gold/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-gold flex items-center justify-center border border-amber-gold/40">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-cream-light">
                Physical Packaging Label Proof
              </h3>
              <p className="text-[11px] font-mono text-cream-soft/70">
                Live scannable label for {coffee.beanName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-soft hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => handleSelectLayout('brother_ql_minimal')}
            className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'brother_ql_minimal'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
            title="Brother QL DK-1202 Minimal High-Contrast (100mm x 62mm / 3.94in x 2.44in)"
          >
            <span>QL Minimal</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectLayout('brother_ql')}
            className={`flex-1 min-w-[110px] py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'brother_ql'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
            title="Brother QL-600 / QL-800 / QL-1100 full-spec thermal roll label (DK-1202: 100mm x 62mm / 3.94in x 2.44in)"
          >
            <span>QL Full Spec</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectLayout('thermal')}
            className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'thermal'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>3"x3" Thermal</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectLayout('badge')}
            className={`flex-1 min-w-[90px] py-1.5 px-2 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'badge'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>Luxury Badge</span>
          </button>
        </div>

        {/* Live Label Proof */}
        <div className="py-2 flex items-center justify-center">
          <CoffeePackagingLabel
            coffee={coffee}
            roaster={roaster}
            qrDataUrl={qrDataUrl}
            smartBagUrl={smartBagUrl}
            layout={layout}
            isEnlarged={true}
          />
        </div>

        {/* Brother QL Driver & Print Instructions Notice */}
        {(layout === 'brother_ql' || layout === 'brother_ql_minimal') && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-200 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Printer className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Brother QL-600 / QL-800 / QL-1100 Direct Print Instructions:</span>
            </div>
            <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
              1. In your browser print dialog, set <strong>Paper size: 62mm x 100mm (2.4" x 3.9" / DK-1202)</strong>.<br />
              2. Set <strong>Orientation: Landscape</strong>.<br />
              3. Set <strong>Margins: None</strong>.<br />
              4. If you had a previous printer size error, cancel any stuck jobs in Windows before reprinting.
            </p>
          </div>
        )}

        {/* Smartphone Camera Scanning Tip */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-cream-soft text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-gold shrink-0" />
          <span>Point phone camera directly at the QR code to test instant dial-in sync!</span>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handlePrintModal}
            disabled={isPrinting}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-gold hover:bg-amber-400 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
            title="Print label directly to your Brother QL thermal printer"
          >
            <Printer className="w-4 h-4" />
            <span>{isPrinting ? 'Opening Print Dialog...' : 'Print Label Direct'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadModal}
            disabled={isSaving}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            title="Save 300 DPI high-resolution label PNG"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isSaving ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBrewCoffee) {
                onBrewCoffee({
                  ...coffee,
                  roaster: roaster?.name || 'Specialty Roaster'
                });
              }
            }}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Coffee className="w-4 h-4 text-amber-gold" />
            <span>Brew</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
