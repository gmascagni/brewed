import React from 'react';
import {
  Tag,
  Sparkles,
  QrCode,
  Printer,
  Palette,
  Sliders,
  Download,
  CheckCircle2,
  Copy,
  ExternalLink,
  Store,
  FileText
} from 'lucide-react';

export default function RoasterStickerStudioTab({
  registeredCoffees = [],
  selectedCoffeeForSticker,
  setSelectedCoffeeForSticker,
  qrLayout,
  setQrLayout,
  qrColor,
  setQrColor,
  qrEcc,
  setQrEcc,
  stickerRef,
  roasterName,
  location,
  roastLevel,
  beanName,
  origin,
  process,
  elevation,
  tastingNotesInput,
  qrDataUrl,
  recommendedRatio,
  tempF,
  brewMethod,
  recommendedGrind,
  upc,
  handleDownloadBrotherQlMinimalPng,
  handleDownloadBrotherQlPng,
  handleDownloadFullStickerPng,
  handlePrintSticker,
  handleDownloadQrSvg,
  handleDownloadQrPng,
  handleCopyLink,
  copySuccess,
  handleOpenLinkInNewTab,
  handleNavigateToPortfolio,
  activeTargetUrl,
  getResolvedTargetUrl
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Studio Control Header */}
      <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-mono text-amber-gold font-bold uppercase block text-[10px]">
              Smart Bag QR Packaging Studio
            </span>
            <p className="text-cream-soft/80 text-xs mt-0.5">
              Generate authentic high-resolution QR stickers, packaging badges, or vector SVGs for your coffee bags.
            </p>
          </div>

          {/* Coffee Selector */}
          {registeredCoffees.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-cream-soft/60 text-[11px] font-mono">Coffee:</span>
              <select
                value={selectedCoffeeForSticker?.id || ''}
                onChange={(e) => {
                  const found = registeredCoffees.find((c) => c.id === e.target.value);
                  if (found) setSelectedCoffeeForSticker(found);
                }}
                className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
              >
                {registeredCoffees.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.roaster} — {c.beanName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* QR Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-cream-soft/60 text-[11px] mr-1">Label Layout:</span>
            <button
              type="button"
              onClick={() => setQrLayout('thermal')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold cursor-pointer ${
                qrLayout === 'thermal'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'bg-white/[0.06] text-cream-soft hover:text-white'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Artisan Thermal Sticker (2"x3")</span>
            </button>

            <button
              type="button"
              onClick={() => setQrLayout('badge')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold cursor-pointer ${
                qrLayout === 'badge'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'bg-white/[0.06] text-cream-soft hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Luxury Roaster Badge</span>
            </button>

            <button
              type="button"
              onClick={() => setQrLayout('minimal')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold cursor-pointer ${
                qrLayout === 'minimal'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'bg-white/[0.06] text-cream-soft hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Minimal Square (2"x2")</span>
            </button>

            <button
              type="button"
              onClick={() => setQrLayout('brother_ql_minimal')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold cursor-pointer ${
                qrLayout === 'brother_ql_minimal'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'bg-white/[0.06] text-cream-soft hover:text-white'
              }`}
              title="Brother QL DK-1202 Minimal High-Contrast Label (2.4in x 3.9in / 62mm x 100mm)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Brother QL Minimal (DK-1202)</span>
            </button>

            <button
              type="button"
              onClick={() => setQrLayout('brother_ql')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold cursor-pointer ${
                qrLayout === 'brother_ql'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'bg-white/[0.06] text-cream-soft hover:text-white'
              }`}
              title="Brother QL-600 / QL-800 / QL-1100 thermal roll label (DK-1202: 2.4in x 3.9in / 62mm x 100mm)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Brother QL Full (DK-1202)</span>
            </button>
          </div>

          {/* QR Customization Options */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-gold" />
              <select
                value={qrColor}
                onChange={(e) => setQrColor(e.target.value)}
                className="px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-cream-light font-mono text-[11px] focus:outline-none focus:border-amber-gold"
                title="QR Code Color Theme"
              >
                <option value="black">Classic Black / White</option>
                <option value="espresso">Espresso Brown / White</option>
                <option value="gold">Amber Gold / Dark</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-gold" />
              <select
                value={qrEcc}
                onChange={(e) => setQrEcc(e.target.value)}
                className="px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-cream-light font-mono text-[11px] focus:outline-none focus:border-amber-gold"
                title="Error Correction Level (Resilience against wear & smudges)"
              >
                <option value="H">Level H (30% Damage Recovery)</option>
                <option value="Q">Level Q (25% Recovery)</option>
                <option value="M">Level M (15% Recovery)</option>
                <option value="L">Level L (7% Recovery)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* The Live Physical Label Previews */}
      <div className="flex flex-col items-center justify-center p-6 bg-stone-900/60 rounded-3xl border border-dashed border-white/20 gap-4">

        {/* LAYOUT 1: ARTISAN THERMAL STICKER (2" x 3") */}
        {qrLayout === 'thermal' && (
          <div 
            ref={stickerRef}
            className="w-full max-w-sm rounded-2xl bg-white text-stone-950 p-6 shadow-2xl border-2 border-stone-800 text-center space-y-3 font-sans relative overflow-hidden"
          >
            {/* Roaster Name & Roast Level */}
            <div className="border-b border-stone-300 pb-2 text-left flex justify-between items-baseline">
              <h3 className="font-serif text-xl font-black tracking-tight text-stone-900 leading-tight truncate">
                {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
              </h3>
              <div className="text-right shrink-0">
                <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                  {selectedCoffeeForSticker?.roastLevel || roastLevel}
                </span>
              </div>
            </div>

            {/* Coffee Profile */}
            <div className="text-left space-y-0.5 pt-0.5">
              <h4 className="font-serif text-lg sm:text-xl font-black text-stone-950 leading-tight">
                {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
              </h4>
              <p className="text-xs text-stone-600 font-mono font-medium">
                {selectedCoffeeForSticker?.origin || origin || 'Single Origin'} • {selectedCoffeeForSticker?.process || process || 'Washed'}
              </p>
              {(selectedCoffeeForSticker?.tastingNotes?.length > 0 || tastingNotesInput) && (
                <p className="text-xs text-amber-900 font-serif italic pt-0.5 truncate">
                  Notes: {(selectedCoffeeForSticker?.tastingNotes || tastingNotesInput.split(',').map(s => s.trim())).slice(0, 4).join(', ')}
                </p>
              )}
            </div>

            {/* Real High-Resolution QR Code */}
            <div className="p-2.5 bg-white border-2 border-stone-800 rounded-2xl flex flex-col items-center justify-center shadow-sm mx-auto w-fit">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Smart Bag QR Code"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-stone-400 font-mono text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Dial-in Parameters */}
            <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-xl bg-stone-100 border border-stone-300 text-center font-mono">
              <div>
                <span className="text-stone-500 font-bold block text-[8px] uppercase">Ratio</span>
                <span className="font-black text-amber-900 text-xs">
                  1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[8px] uppercase">Temp</span>
                <span className="font-black text-stone-900 text-xs">
                  {selectedCoffeeForSticker?.tempF || tempF}°F
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[8px] uppercase">Method</span>
                <span className="font-bold text-stone-900 capitalize text-[11px] truncate block">
                  {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ').split(' ')[0]}
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-bold block text-[8px] uppercase">Grind</span>
                <span className="font-bold text-stone-900 text-[11px] truncate block">
                  {(selectedCoffeeForSticker?.recommendedGrind || recommendedGrind || 'Med-Fine').split(' ')[0]}
                </span>
              </div>
            </div>

            {/* FULL-WIDTH BOTTOM BANNER: SCAN FOR RECIPE */}
            <div className="w-full bg-stone-950 text-white font-black text-center py-2.5 rounded-xl text-xs sm:text-sm tracking-wider uppercase shadow-md mt-1">
              SCAN FOR RECIPE
            </div>
          </div>
        )}

        {/* LAYOUT 2: LUXURY ROASTER BADGE (Espresso & Gold) */}
        {qrLayout === 'badge' && (
          <div 
            ref={stickerRef}
            className="w-full max-w-sm rounded-3xl bg-[#1A120B] border-2 border-amber-gold/60 p-6 shadow-2xl text-center space-y-4 text-cream-light relative overflow-hidden"
          >
            <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-gold" />
            <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-gold" />
            <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-gold" />
            <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-gold" />

            <div>
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-gold/90 block">
                DIALED-IN EXTRACTION RECIPE
              </span>
              <h3 className="font-serif text-xl font-bold text-cream-light mt-0.5 tracking-wide">
                {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
              </h3>
              <p className="text-xs text-amber-200/80 font-serif italic">
                {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-md mx-auto w-fit">
              {/* Prominent "Scan Me for Recipe" Badge */}
              <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#1A120B] text-amber-gold font-mono text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-gold/40 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
                <span>Scan Me for Recipe</span>
              </div>

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Smart Bag QR Code"
                  className="w-44 h-44 object-contain"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-stone-400 font-mono text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.06] border border-white/10 text-[10px] font-mono">
              <div>
                <span className="text-cream-soft/60 block text-[8px] uppercase">Ratio</span>
                <span className="font-bold text-amber-gold">
                  1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                </span>
              </div>
              <div>
                <span className="text-cream-soft/60 block text-[8px] uppercase">Temp</span>
                <span className="font-bold text-cream-light">
                  {selectedCoffeeForSticker?.tempF || tempF}°F
                </span>
              </div>
              <div>
                <span className="text-cream-soft/60 block text-[8px] uppercase">Method</span>
                <span className="font-bold text-cream-light capitalize">
                  {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[9px] font-mono text-cream-soft/70">
                Scan with camera to open The Brew App timer & water calculator
              </p>
              <span className="text-[8px] font-mono text-amber-gold/70 block uppercase tracking-wider">
                thebrew.app • Smart Bag Certified
              </span>
            </div>
          </div>
        )}

        {/* LAYOUT 3: MINIMAL SQUARE STICKER (2" x 2") */}
        {qrLayout === 'minimal' && (
          <div 
            ref={stickerRef}
            className="w-72 h-72 rounded-3xl bg-white text-stone-900 p-5 shadow-2xl border-2 border-stone-800 text-center flex flex-col justify-between"
          >
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900 leading-tight">
                {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
              </h4>
              <p className="text-[11px] text-stone-600 font-medium truncate">
                {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              {/* Prominent "Scan Me for Recipe" Badge */}
              <div className="flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Scan Me for Recipe</span>
              </div>

              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Smart Bag QR Code"
                  className="w-36 h-36 object-contain"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-stone-600 flex justify-between items-center border-t border-stone-200 pt-1.5">
              <span>1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}</span>
              <span>{selectedCoffeeForSticker?.tempF || tempF}°F</span>
              <span className="font-bold text-stone-800">thebrew.app</span>
            </div>
          </div>
        )}

        {/* LAYOUT 4: BROTHER QL MULTIPURPOSE THERMAL LABEL (2.4" x 3.9" / 100mm x 62mm / DK-1202) */}
        {qrLayout === 'brother_ql' && (
          <div 
            ref={stickerRef}
            className="w-full max-w-xl rounded-xl bg-white text-stone-900 p-4 shadow-2xl border-2 border-stone-800 flex flex-col justify-between relative overflow-hidden select-none"
          >
            {/* Top & Middle: Left Details + Right Maximized QR */}
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-black text-stone-950 truncate leading-tight">
                    {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
                  </h4>
                  <p className="text-lg text-stone-900 font-black truncate font-serif mt-0.5">
                    {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                  </p>
                  <p className="text-xs text-stone-600 font-mono font-bold uppercase tracking-wider truncate mt-0.5">
                    {(selectedCoffeeForSticker?.roastLevel || roastLevel || 'Light').replace(/\s*roast\s*/i, '').trim()} ROAST • {selectedCoffeeForSticker?.origin || origin || 'SINGLE ORIGIN'}
                  </p>
                  <p className="text-xs text-amber-900 font-serif italic truncate mt-0.5">
                    {tastingNotesInput ? `Notes: ${tastingNotesInput}` : 'Notes: Peach, Jasmine, Honey'}
                  </p>
                </div>

                {/* 4-Card Dial-In Matrix */}
                <div className="grid grid-cols-2 gap-1.5 py-1.5 my-1">
                  <div className="bg-stone-100 rounded-lg p-2 border border-stone-300">
                    <span className="text-stone-500 block text-[9px] uppercase font-mono font-bold leading-none mb-1">Water Ratio</span>
                    <span className="font-mono font-black text-amber-900 text-sm sm:text-base block truncate">
                      1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                    </span>
                  </div>
                  <div className="bg-stone-100 rounded-lg p-2 border border-stone-300">
                    <span className="text-stone-500 block text-[9px] uppercase font-mono font-bold leading-none mb-1">Brew Temp</span>
                    <span className="font-mono font-black text-stone-950 text-sm sm:text-base block truncate">
                      {selectedCoffeeForSticker?.tempF || tempF}°F
                    </span>
                  </div>
                  <div className="bg-stone-100 rounded-lg p-2 border border-stone-300">
                    <span className="text-stone-500 block text-[9px] uppercase font-mono font-bold leading-none mb-1">Method</span>
                    <span className="font-sans font-bold text-stone-900 capitalize truncate block text-xs sm:text-sm">
                      {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="bg-stone-100 rounded-lg p-2 border border-stone-300">
                    <span className="text-stone-500 block text-[9px] uppercase font-mono font-bold leading-none mb-1">Grind Size</span>
                    <span className="font-sans font-bold text-stone-900 truncate block text-xs sm:text-sm">
                      {(selectedCoffeeForSticker?.recommendedGrind || recommendedGrind || 'Med-Fine').split('(')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right QR Column: Maximized Full-Height QR Code */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-xl border-2 border-stone-800 w-36 h-36 sm:w-44 sm:h-44 my-auto">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Brother QL Smart Bag QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-xs">
                    Generating...
                  </div>
                )}
              </div>
            </div>

            {/* FULL-WIDTH BOTTOM BANNER: SCAN FOR RECIPE (In Big Bold Letters) */}
            <div className="w-full bg-stone-950 text-white font-black text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base tracking-wider uppercase shadow-sm mt-2">
              SCAN FOR RECIPE
            </div>
          </div>
        )}

        {/* LAYOUT 5: BROTHER QL DK-1202 MINIMAL HIGH-CONTRAST LABEL */}
        {qrLayout === 'brother_ql_minimal' && (
          <div 
            ref={stickerRef}
            className="w-full max-w-xl rounded-xl bg-white text-stone-900 p-4 shadow-2xl border-2 border-stone-800 flex flex-col justify-between relative overflow-hidden select-none"
          >
            {/* Top & Middle: Left Details + Right Maximized QR */}
            <div className="flex items-stretch justify-between gap-4">
              <div className="flex-1 flex flex-col justify-between min-w-0 pr-1">
                <div>
                  <h4 className="font-serif text-xl sm:text-2xl font-black text-stone-950 truncate leading-tight">
                    {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roastery'}
                  </h4>
                  <h3 className="font-serif text-lg sm:text-xl font-black text-stone-950 leading-tight tracking-tight mt-0.5">
                    {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                  </h3>
                  <p className="text-xs text-stone-600 font-mono font-bold uppercase tracking-wider truncate mt-0.5">
                    {selectedCoffeeForSticker?.origin || origin || 'SINGLE ORIGIN'} • {(selectedCoffeeForSticker?.roastLevel || roastLevel || 'Light').toUpperCase()}
                  </p>
                </div>

                {/* Dial-In Formula Box */}
                <div className="bg-stone-100 border border-stone-300 rounded-lg p-2.5 my-1.5 space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono font-black text-stone-900">
                    <span className="text-amber-900">RATIO 1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}</span>
                    <span>{selectedCoffeeForSticker?.tempF || tempF}°F</span>
                    <span className="capitalize">{(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                  </div>
                  <div className="text-[11px] font-mono text-stone-600 flex justify-between pt-1 border-t border-stone-200">
                    <span>GRIND: {(selectedCoffeeForSticker?.recommendedGrind || recommendedGrind || 'Med-Fine').split('(')[0]}</span>
                    <span>140 TDS WATER</span>
                  </div>
                </div>

                {/* Flavor Notes */}
                <p className="text-xs font-serif italic text-stone-700 truncate">
                  Notes: {tastingNotesInput ? tastingNotesInput : 'Peach, Jasmine, Honey'}
                </p>
              </div>

              {/* Right QR Column: Giant High-Contrast QR Code */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-xl border-2 border-stone-800 w-36 h-36 sm:w-44 sm:h-44 my-auto">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Brother QL Minimal QR Code"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-xs">
                    Generating...
                  </div>
                )}
              </div>
            </div>

            {/* FULL-WIDTH BOTTOM BANNER: SCAN FOR RECIPE (In Big Bold Letters) */}
            <div className="w-full bg-stone-950 text-white font-black text-center py-2.5 sm:py-3 rounded-lg text-sm sm:text-base tracking-wider uppercase shadow-sm mt-2">
              SCAN FOR RECIPE
            </div>
          </div>
        )}

        {/* Brother QL Driver & Print Instructions Notice */}
        {(qrLayout === 'brother_ql' || qrLayout === 'brother_ql_minimal') && (
          <div className="w-full max-w-xl mx-auto p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-200 text-left space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Printer className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Brother QL-600 / QL-800 / QL-1100 Direct Thermal Instructions:</span>
            </div>
            <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
              1. In your Brother printer or browser print dialog, select <strong>Paper size: 62mm x 100mm (2.4" x 3.9" / DK-1202)</strong>.<br />
              2. Set <strong>Orientation: Landscape</strong> (or Brother QL automatic cut).<br />
              3. Set <strong>Margins: None</strong>.<br />
              4. The larger DK-1202 format provides 2.5x more surface area than DK-1209, accommodating full dial-in metrics and an oversized scannable QR code.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons for QR Studio */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={
            qrLayout === 'brother_ql_minimal'
              ? handleDownloadBrotherQlMinimalPng
              : qrLayout === 'brother_ql'
              ? handleDownloadBrotherQlPng
              : handleDownloadFullStickerPng
          }
          className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          title={
            qrLayout === 'brother_ql_minimal'
              ? 'Download 300 DPI Brother QL Minimal (DK-1202: 100mm x 62mm / 3.94" x 2.44") thermal label PNG'
              : qrLayout === 'brother_ql'
              ? 'Download 300 DPI Brother QL Full (DK-1202: 100mm x 62mm / 3.94" x 2.44") thermal label PNG'
              : 'Download complete 300 DPI composite packaging sticker PNG ready to email or upload to your printer'
          }
        >
          <Download className="w-4 h-4 text-espresso-950" />
          <span>
            {qrLayout === 'brother_ql_minimal'
              ? 'Download Brother QL Minimal (PNG)'
              : qrLayout === 'brother_ql'
              ? 'Download Brother QL Full (PNG)'
              : 'Download Complete Sticker (PNG)'}
          </span>
        </button>

        <button
          onClick={handlePrintSticker}
          className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-amber-gold" />
          <span>Print Label Direct</span>
        </button>

        <button
          onClick={handleDownloadQrSvg}
          className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95 cursor-pointer"
          title="Download scalable vector SVG for commercial bag packaging printers"
        >
          <Download className="w-4 h-4 text-amber-gold" />
          <span>Vector QR (SVG)</span>
        </button>

        <button
          onClick={handleDownloadQrPng}
          className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95 cursor-pointer"
          title="Download ultra-crisp 1200px PNG"
        >
          <Download className="w-4 h-4 text-amber-gold" />
          <span>Standalone QR (PNG)</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95 cursor-pointer"
          title="Copy the direct recipe and dial-in link to clipboard"
        >
          {copySuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">URL Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-amber-gold" />
              <span>Copy Recipe URL</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOpenLinkInNewTab}
          className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95 cursor-pointer"
          title="Open the generated link in a new tab to test customer experience"
        >
          <ExternalLink className="w-4 h-4 text-amber-gold" />
          <span>Test Link</span>
        </button>

        <button
          type="button"
          onClick={handleNavigateToPortfolio}
          className="px-4 py-2.5 rounded-xl bg-amber-gold/20 hover:bg-amber-gold/30 text-amber-gold font-mono text-xs font-bold flex items-center gap-2 border border-amber-gold/40 transition active:scale-95 cursor-pointer"
          title="Open this roaster's profile and recipe page directly in the app"
        >
          <Store className="w-4 h-4 text-amber-gold" />
          <span>View Portfolio Page</span>
        </button>
      </div>

      {/* Direct Recipe & Showcase URL Box */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <span className="text-cream-soft/60 uppercase text-[10px] shrink-0 font-bold">Live Target URL:</span>
          <input
            type="text"
            readOnly
            value={activeTargetUrl || getResolvedTargetUrl()}
            className="w-full bg-black/60 border border-white/15 px-3 py-1.5 rounded-lg text-cream-light font-mono text-[11px] truncate focus:outline-none focus:border-amber-gold"
            onClick={(e) => e.target.select()}
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-bold flex items-center gap-1.5 border border-white/15 transition active:scale-95 text-[11px] cursor-pointer"
          >
            {copySuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-gold" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenLinkInNewTab}
            className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-bold flex items-center gap-1.5 border border-white/15 transition active:scale-95 text-[11px] cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-gold" />
            <span>Open New Tab</span>
          </button>
          <button
            type="button"
            onClick={handleNavigateToPortfolio}
            className="px-3 py-1.5 rounded-lg bg-amber-gold text-espresso-950 font-bold flex items-center gap-1.5 transition active:scale-95 text-[11px] cursor-pointer"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View In-App</span>
          </button>
        </div>
      </div>

      {/* Printer Handoff Guidance Banner */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs font-mono text-cream-soft/80">
        <FileText className="w-4 h-4 text-amber-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-cream-light block">
            Where Files Save & Handoff to Your Packaging Printer:
          </span>
          <p className="text-[11px] leading-relaxed">
            When you click <strong>"Download Complete Sticker (PNG)"</strong> or <strong>"Vector QR (SVG)"</strong>, your browser saves the high-resolution file directly into your device's default <strong>Downloads</strong> folder (e.g. <code>Downloads/smart_bag_sticker_*.png</code>).
          </p>
          <p className="text-[11px] leading-relaxed text-amber-gold/90">
            You can email the 300-DPI PNG directly to your label printer for thermal sticker rolls (Avery, Zebra, Rollo, Dymo), or provide the vector SVG to your bag packaging manufacturer. The sticker includes the prominent <strong>"Scan Me for Recipe"</strong> callout so customers can instantly scan it on retail shelves.
          </p>
        </div>
      </div>
    </div>
  );
}
