import React from 'react';
import {
  Coffee,
  QrCode,
  Bookmark,
  Tag,
  Layers,
  Award,
  ExternalLink,
  Maximize2,
  Eye
} from 'lucide-react';
import { CoffeePackagingLabel } from './PackagingLabelProofModal';
import { buildAffiliateUrl, trackOutboundPurchaseClick } from '../../utils/affiliateTracking';

export default function RoasterOfferingsGrid({
  roaster,
  activeScannedCoffee,
  coffeeViewMode,
  setCoffeeViewMode,
  qrCodeMap = {},
  cardLabelFlipMap = {},
  handleToggleCardFlip,
  savedToJournalId,
  handleSaveToJournal,
  setActiveLabelModalCoffee,
  onBrewCoffee,
  orchestrator,
  isBrandOwner,
  onOpenRoasterPortalWithBean
}) {
  if (!roaster) return null;

  const coffees = roaster.coffees || [];

  return (
    <div id="certified-coffees" className="space-y-8 animate-fade-in scroll-mt-24">
      <div className="space-y-8 animate-fade-in">
        
        {/* Scanned Bag Notification Banner (rendered when arriving from a bag barcode scan) */}
        {activeScannedCoffee && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-black/80 to-amber-950/40 border-2 border-emerald-500/60 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <QrCode className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/50">
                    ✨ Scanned Barcode Recipe
                  </span>
                  <span className="text-xs font-mono text-cream-soft">
                    Matched from packaging barcode
                  </span>
                </div>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-cream-light mt-0.5">
                  {activeScannedCoffee.beanName}
                </h4>
                <p className="text-xs text-cream-soft font-sans">
                  Roaster golden ratio 1:{activeScannedCoffee.recommendedRatio || 16.5} • {activeScannedCoffee.tempF || 202}°F • {activeScannedCoffee.recommendedGrind || 'Medium-Fine'} grind
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  const payload = { ...activeScannedCoffee, roaster: roaster.name || 'Specialty Roaster' };
                  if (onBrewCoffee) {
                    onBrewCoffee(payload);
                  }
                  if (orchestrator) {
                    orchestrator.brew(payload);
                  }
                }}
                className="px-5 py-3 rounded-2xl bg-amber-gold hover:bg-amber-300 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <Coffee className="w-4 h-4" />
                <span>Select & Brew Recipe</span>
              </button>
              <button
                onClick={() => handleSaveToJournal(activeScannedCoffee)}
                className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-cream-light transition cursor-pointer"
                title="Save this bag to your personal coffee cellar"
              >
                <Bookmark className={`w-4 h-4 ${savedToJournalId === activeScannedCoffee.id ? 'text-amber-gold fill-amber-gold' : 'text-cream-soft'}`} />
              </button>
            </div>
          </div>
        )}

        {/* View Switcher Header: Recipe Specs vs Retail Bag Labels vs Split View */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-transparent border border-amber-500/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-gold animate-ping" />
              <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                Roaster-Certified Dial-In & Packaging Labels
              </h3>
            </div>
            <p className="text-xs text-cream-soft font-sans">
              Every certified recipe below includes a real scannable packaging label with roaster golden ratio, water temperature, grind setting, and live QR code.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono shrink-0">
            <button
              type="button"
              onClick={() => setCoffeeViewMode('specs')}
              className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                coffeeViewMode === 'specs'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light'
              }`}
              title="View standard recipe and dial-in extraction cards"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Recipe Specs</span>
            </button>

            <button
              type="button"
              onClick={() => setCoffeeViewMode('labels')}
              className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                coffeeViewMode === 'labels'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light'
              }`}
              title="View exact physical retail packaging labels for each recipe"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Bag Labels ({coffees.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setCoffeeViewMode('split')}
              className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                coffeeViewMode === 'split'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light'
              }`}
              title="View recipe details and packaging labels side-by-side"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: BAG LABELS ONLY */}
        {coffeeViewMode === 'labels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {coffees.map((coffee) => {
              const qr = qrCodeMap[coffee.id];
              return (
                <div
                  key={`label-${coffee.id}`}
                  className="rounded-3xl bg-black/40 border border-white/10 p-6 flex flex-col justify-between gap-5 shadow-xl hover:border-amber-gold/40 transition group"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-gold font-mono text-[10px] font-bold border border-amber-500/30">
                      🏷️ Retail Bag Sticker Proof
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveLabelModalCoffee(coffee)}
                      className="text-[11px] font-mono text-amber-gold hover:underline flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Enlarge</span>
                    </button>
                  </div>

                  <CoffeePackagingLabel
                    coffee={coffee}
                    roaster={roaster}
                    qrDataUrl={qr?.qrDataUrl}
                    smartBagUrl={qr?.url}
                    layout="brother_ql"
                    onEnlarge={setActiveLabelModalCoffee}
                    onBrewCoffee={onBrewCoffee}
                  />

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => {
                        const payload = { ...coffee, roaster: roaster.name || 'Specialty Roastery' };
                        if (onBrewCoffee) onBrewCoffee(payload);
                        if (orchestrator) orchestrator.brew(payload);
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Dial-In & Brew Recipe</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_compact')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackOutboundPurchaseClick(buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_compact'), roaster.name, coffee.beanName, coffee.price)}
                        className="py-2 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1 transition font-bold"
                      >
                        <ExternalLink className="w-3 h-3 text-amber-gold shrink-0" />
                        <span className="truncate">Buy Beans</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleToggleCardFlip(coffee.id)}
                        className="py-2 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1 transition font-bold cursor-pointer"
                      >
                        <Coffee className="w-3 h-3 text-amber-gold shrink-0" />
                        <span className="truncate">Recipe Specs</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 2: SPLIT SIDE-BY-SIDE (RECIPE SPECS + PACKAGING LABEL) */}
        {coffeeViewMode === 'split' && (
          <div className="space-y-8 animate-fade-in">
            {coffees.map((coffee) => {
              const qr = qrCodeMap[coffee.id];
              const isThisCoffeeScanned = activeScannedCoffee && activeScannedCoffee.id === coffee.id;
              return (
                <div
                  key={`split-${coffee.id}`}
                  className={`rounded-3xl bg-black/40 border p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-xl relative overflow-hidden ${
                    isThisCoffeeScanned
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/10'
                      : 'border-white/10 hover:border-amber-gold/40'
                  }`}
                >
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                        isThisCoffeeScanned
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                          : 'bg-amber-500/20 text-amber-gold border-amber-500/30'
                      }`}>
                        {isThisCoffeeScanned ? '✨ Scanned from Your Bag' : `${coffee.badge || 'Roaster Spec'} • Certified Dial-In`}
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>SCA {coffee.cuppingScore || 87.5}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
                        {coffee.beanName}
                      </h4>
                      <p className="text-xs font-mono text-cream-soft/70 mt-1">
                        {coffee.origin || 'Specialty Origin'} • {coffee.process || 'Washed'} • {coffee.elevation || '1,800+ MASL'}
                      </p>
                    </div>

                    <p className="text-sm text-cream-soft font-sans leading-relaxed">
                      {coffee.description || `Artisan craft roast by ${roaster.name || 'Specialty Roastery'}.`}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {(coffee.tastingNotes || []).map((note, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-mono text-cream-light font-bold"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                        <span>Dial-In Parameters:</span>
                        <span className="capitalize">{String(coffee?.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Ratio</span>
                          <strong className="text-cream-light font-bold">1:{coffee.recommendedRatio || 16.5}</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Water Temp</span>
                          <strong className="text-amber-gold font-bold">{coffee.tempF || 202}°F</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Grind</span>
                          <strong className="text-cream-light font-bold truncate block">
                            {(coffee.recommendedGrind || 'Medium-Fine').split(' ')[0]}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Time</span>
                          <strong className="text-cream-light font-bold">{coffee.brewTime || '3m 15s'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          const payload = { ...coffee, roaster: roaster.name || 'Specialty Roastery' };
                          if (onBrewCoffee) onBrewCoffee(payload);
                          if (orchestrator) orchestrator.brew(payload);
                        }}
                        className="px-6 py-3 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <Coffee className="w-4 h-4" />
                        <span>Dial-In & Brew Recipe</span>
                      </button>

                      <a
                        href={buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_detail')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackOutboundPurchaseClick(buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_detail'), roaster.name, coffee.beanName, coffee.price)}
                        className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center gap-1.5 transition font-bold"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-gold shrink-0" />
                        <span>Buy Beans ({coffee.price || '$22.00'})</span>
                      </a>

                      <button
                        onClick={() => handleSaveToJournal(coffee)}
                        className={`py-3 px-4 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition font-bold cursor-pointer ${
                          savedToJournalId === coffee.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-cream-light'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 shrink-0 ${savedToJournalId === coffee.id ? 'text-emerald-400 fill-emerald-400' : 'text-amber-gold'}`} />
                        <span>{savedToJournalId === coffee.id ? 'Saved in Cellar!' : 'Save to Cellar'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between w-full max-w-sm px-1">
                      <span className="font-mono text-xs font-bold text-amber-gold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Retail Packaging Label Proof</span>
                      </span>
                      <span className="font-mono text-[10px] text-cream-soft/60">
                        Scannable with Camera
                      </span>
                    </div>

                    <CoffeePackagingLabel
                      coffee={coffee}
                      roaster={roaster}
                      qrDataUrl={qr?.qrDataUrl}
                      smartBagUrl={qr?.url}
                      layout="brother_ql"
                      onEnlarge={setActiveLabelModalCoffee}
                      onBrewCoffee={onBrewCoffee}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW MODE 3: STANDARD RECIPE SPECS CARDS (WITH INLINE LABEL FLIP & MINI PREVIEW) */}
        {coffeeViewMode === 'specs' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {coffees.map((coffee) => {
              const qr = qrCodeMap[coffee.id];
              const isThisCoffeeScanned = activeScannedCoffee && activeScannedCoffee.id === coffee.id;
              const isFlippedToLabel = Boolean(cardLabelFlipMap[coffee.id]);

              return (
                <div
                  key={coffee.id}
                  className={`rounded-3xl bg-black/40 border p-6 flex flex-col justify-between gap-6 transition-all duration-300 shadow-xl group hover:shadow-2xl relative overflow-hidden ${
                    isThisCoffeeScanned
                      ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/10'
                      : 'border-white/10 hover:border-amber-gold/50 hover:shadow-amber-gold/5'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                        isThisCoffeeScanned
                          ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                          : 'bg-amber-500/20 text-amber-gold border-amber-500/30'
                      }`}>
                        {isThisCoffeeScanned ? '✨ Scanned from Your Bag' : `${coffee.badge || 'Roaster Spec'} • Dial-In Ready`}
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" />
                          <span>SCA {coffee.cuppingScore || 87.5}</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggleCardFlip(coffee.id)}
                          className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            isFlippedToLabel
                              ? 'bg-amber-gold text-espresso-950 border-amber-gold shadow'
                              : 'bg-white/[0.08] text-cream-soft hover:text-white border-white/15'
                          }`}
                          title={isFlippedToLabel ? "View recipe specs" : "View physical retail bag label"}
                        >
                          <Tag className="w-3 h-3" />
                          <span>{isFlippedToLabel ? 'Recipe Specs' : 'Bag Label'}</span>
                        </button>
                      </div>
                    </div>

                    {isFlippedToLabel ? (
                      <div className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between text-xs font-mono text-amber-gold">
                          <span className="font-bold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Packaging Label Proof</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveLabelModalCoffee(coffee)}
                            className="text-[10px] text-cream-soft hover:text-white underline cursor-pointer"
                          >
                            Enlarge Proof
                          </button>
                        </div>

                        <CoffeePackagingLabel
                          coffee={coffee}
                          roaster={roaster}
                          qrDataUrl={qr?.qrDataUrl}
                          smartBagUrl={qr?.url}
                          layout="brother_ql"
                          onEnlarge={setActiveLabelModalCoffee}
                          onBrewCoffee={onBrewCoffee}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <h4 className="font-serif text-xl font-bold text-cream-light group-hover:text-amber-gold transition leading-snug">
                            {coffee.beanName}
                          </h4>
                          <p className="text-xs font-mono text-cream-soft/70 mt-1">
                            {coffee.origin || 'Specialty Origin'}
                          </p>
                        </div>

                        <p className="text-xs text-cream-soft font-sans leading-relaxed">
                          {coffee.description || `Artisan craft roast by ${roaster.name || 'Specialty Roastery'}.`}
                        </p>

                        <div className="flex flex-wrap gap-1.5">
                          {(coffee.tastingNotes || []).map((note, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-mono text-cream-light"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#140C08] border border-white/5 space-y-1.5 text-xs font-mono">
                          <div className="flex justify-between text-cream-soft">
                            <span>Process:</span>
                            <span className="text-cream-light font-bold">{coffee.process || 'Washed'}</span>
                          </div>
                          <div className="flex justify-between text-cream-soft">
                            <span>Varietal:</span>
                            <span className="text-cream-light">{coffee.varietal || 'Specialty Lot'}</span>
                          </div>
                          <div className="flex justify-between text-cream-soft">
                            <span>Elevation:</span>
                            <span className="text-amber-gold">{coffee.elevation || '1,800+ MASL'}</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                            <span>Dial-In Parameters:</span>
                            <span className="capitalize">{String(coffee?.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Ratio</span>
                              <strong className="text-cream-light font-bold">1:{coffee.recommendedRatio || 16.5}</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Water Temp</span>
                              <strong className="text-amber-gold font-bold">{coffee.tempF || 202}°F</strong>
                            </div>
                            <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Time</span>
                              <strong className="text-cream-light font-bold">{coffee.brewTime || '3m 15s'}</strong>
                            </div>
                          </div>

                          <div className="text-[11px] font-mono text-cream-soft/80 flex items-center justify-between pt-1">
                            <span>Grind Setting:</span>
                            <span className="text-cream-light font-bold">{coffee.recommendedGrind || 'Medium-Fine'}</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {qr?.qrDataUrl ? (
                              <img
                                src={qr.qrDataUrl}
                                alt="Packaging QR Thumbnail"
                                className="w-10 h-10 rounded-lg p-0.5 bg-white border border-stone-300 object-contain shrink-0 cursor-pointer hover:scale-105 transition"
                                onClick={() => setActiveLabelModalCoffee(coffee)}
                                title="Click to view full packaging sticker"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-gold shrink-0">
                                <QrCode className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <span className="font-mono text-[11px] font-bold text-cream-light flex items-center gap-1">
                                <Tag className="w-3 h-3 text-amber-gold" />
                                <span>Bag Packaging Label</span>
                              </span>
                              <p className="text-[10px] font-mono text-cream-soft/60">
                                Scannable 300 DPI thermal sticker
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleCardFlip(coffee.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-gold/40 text-amber-gold font-mono text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View Label</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Customer Actions Bar */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        const payload = {
                          ...coffee,
                          roaster: roaster.name || 'Specialty Roastery'
                        };
                        if (onBrewCoffee) {
                          onBrewCoffee(payload);
                        }
                        if (orchestrator) {
                          orchestrator.brew(payload);
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Dial-In & Brew ({coffee.dryDoseGrams || 18}g : {coffee.waterGrams || Math.round(18 * (coffee.recommendedRatio || 16.5))}g)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_split')}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackOutboundPurchaseClick(buildAffiliateUrl(coffee.directUrl || roaster.shopUrl, roaster.name, 'roaster_offerings_split'), roaster.name, coffee.beanName, coffee.price)}
                        className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1.5 transition font-bold"
                        title="Purchase directly on roaster's website"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-amber-gold shrink-0" />
                        <span className="truncate">Buy Beans ({coffee.price || '$22.00'})</span>
                      </a>

                      <button
                        onClick={() => handleSaveToJournal(coffee)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition font-bold cursor-pointer ${
                          savedToJournalId === coffee.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-cream-light'
                        }`}
                        title="Save this lot to your personal coffee cellar"
                      >
                        <Bookmark className={`w-3.5 h-3.5 shrink-0 ${savedToJournalId === coffee.id ? 'text-emerald-400 fill-emerald-400' : 'text-amber-gold'}`} />
                        <span className="truncate">{savedToJournalId === coffee.id ? 'Saved in Cellar!' : 'Save to Cellar'}</span>
                      </button>
                    </div>

                    {isBrandOwner && onOpenRoasterPortalWithBean && (
                      <button
                        onClick={() => onOpenRoasterPortalWithBean(coffee)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-gold/40 text-amber-gold font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Generate Packaging Barcode for this Lot</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
