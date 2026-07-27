import React, { useState } from 'react';
import { GraduationCap, MapPin, Sparkles, Award, Compass, Store, ShoppingBag, Mountain, BookOpen, ChevronRight } from 'lucide-react';
import { TERROIR_ATLAS } from '../data/brewData';

export default function UniversityHub({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const origins = TERROIR_ATLAS[trackMode] || TERROIR_ATLAS.coffee;
  const [activeOriginId, setActiveOriginId] = useState(origins[0]?.id || 'ethiopia');

  const activeOrigin = origins.find((o) => o.id === activeOriginId) || origins[0];

  return (
    <section className="mt-12 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <GraduationCap className="w-4 h-4 animate-pulse" />
            <span>BrewCraft University • Terroir, Agronomy & Brand Atlas</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            {isCoffee ? 'Coffee Origins, Terroirs & Sourced Brands' : 'Specialty Tea Terroirs & Sourced Tea Houses'}
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            {isCoffee
              ? 'An enthusiast guide to volcanic geology, elevation diurnal swings, botanical cultivars, and iconic roasters'
              : 'An enthusiast guide to mountain tea gardens, shading chemistry, leaf cultivars, and historic tea houses'}
          </p>
        </div>

        <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border shadow-inner ${
          isCoffee 
            ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/40 shadow-amber-gold/10' 
            : 'bg-sage-500/20 text-sage-300 border-sage-500/40 shadow-sage-500/10'
        }`}>
          {isCoffee ? '6 Arabica Terroirs' : '5 Famous Tea Terroirs'}
        </span>
      </div>

      {/* Origin Country Selection Grid */}
      <div className="mb-8">
        <label className="block text-xs uppercase tracking-widest font-extrabold text-cream-soft/70 mb-3.5 flex items-center justify-between">
          <span>Select Growing Origin / Nation:</span>
          <span className="text-[11px] font-mono text-amber-gold">Click Country to Change Origin</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {origins.map((origin) => {
            const isSelected = origin.id === activeOrigin.id;
            return (
              <button
                key={origin.id}
                onClick={() => setActiveOriginId(origin.id)}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 shadow-lg ${
                  isSelected
                    ? isCoffee
                      ? 'btn-tactile-amber text-espresso-950 scale-105 font-extrabold ring-2 ring-amber-gold'
                      : 'btn-tactile-sage text-cream-light scale-105 font-extrabold ring-2 ring-sage-400'
                    : 'bg-espresso-900/80 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-3xl mb-1">{origin.flag}</div>
                <div className="text-xs font-extrabold tracking-wide drop-shadow">{origin.country}</div>
                <div className={`text-[10px] mt-1 truncate ${isSelected ? 'opacity-90 font-bold' : 'text-cream-soft/60'}`}>
                  {isCoffee ? origin.regions.split(',')[0] : (origin.famousTeas ? origin.famousTeas[0].split(' ')[0] : '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Origin Detailed Master Showcase Card */}
      {activeOrigin && (
        <div className="p-6 md:p-8 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl relative overflow-hidden">
          
          {/* 1. Top Title & Elevation Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
            <div className="flex items-center space-x-3.5">
              <span className="text-5xl">{activeOrigin.flag}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light tracking-wide">
                    {activeOrigin.country}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 text-[10px] font-mono font-bold">
                    Specialty Grade
                  </span>
                </div>
                <div className="text-xs text-amber-gold font-bold flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Key Microclimates & Regions: {activeOrigin.regions}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/15 text-cream-light flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-amber-gold" />
                <span>{isCoffee ? `Elevation: ${activeOrigin.altitude}` : `Steep: ${activeOrigin.steepStyle}`}</span>
              </span>
            </div>
          </div>

          {/* 2. PROMINENT FAMOUS BRANDS & SPECIALTY ROASTERS GRID (MOVED HIGH FOR INSTANT VISIBILITY) */}
          <div className="p-5 md:p-6 rounded-2xl bg-black/60 border border-amber-gold/40 shadow-2xl mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 text-sm uppercase font-extrabold tracking-wider text-amber-gold">
                <Store className="w-5 h-5 text-amber-gold" />
                <span>Famous Brands & Specialty Roasters Sourced From {activeOrigin.country}:</span>
              </div>
              <span className="text-[11px] font-mono text-cream-soft/60">
                {isCoffee ? 'Curated Specialty Roasters' : 'Curated Specialty Tea Houses'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrigin.sourcedBrands.map((brand, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-gold/50 hover:bg-white/10 transition-all duration-300 flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-extrabold text-cream-light group-hover:text-amber-gold transition-colors">
                        {brand.name}
                      </span>
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-gold/80" />
                    </div>
                    
                    <div className="text-xs font-bold text-amber-gold/90 mb-2">
                      {brand.offering}
                    </div>

                    <p className="text-[11px] text-cream-soft/80 font-medium leading-relaxed">
                      {brand.note}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-cream-soft/50">
                    <span>Direct Single-Origin Sourcing</span>
                    <span className="text-amber-gold font-bold flex items-center gap-1">
                      <span>Featured</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Flavor Notes & Sensory Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            
            {/* Box 1: Signature Flavor Notes */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-gold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-gold" />
                <span>Signature Flavor Notes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeOrigin.flavorNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-gold/15 text-amber-gold border border-amber-gold/30 text-xs font-extrabold shadow-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 2: Agronomy Genetics & Processing */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{isCoffee ? 'Genetics & Processing:' : 'Famous Tea Varieties:'}</span>
              </div>
              
              {isCoffee ? (
                <div className="space-y-1.5 text-xs text-cream-soft/90 font-medium">
                  <div><strong className="text-cream-light">Cultivars:</strong> {activeOrigin.genetics}</div>
                  <div><strong className="text-cream-light">Processing:</strong> {activeOrigin.processing}</div>
                </div>
              ) : (
                <div className="space-y-1.5 text-xs text-cream-soft/90 font-medium">
                  <div><strong className="text-cream-light">Botanical Bush:</strong> {activeOrigin.botanicals}</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {activeOrigin.famousTeas.map((tea, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-sage-500/20 text-sage-300 border border-sage-500/30 text-[11px] font-semibold">
                        {tea}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Box 3: Extraction Pairing & Acidity */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner flex flex-col justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Extraction & Acid Profile:</span>
                </div>
                <div className="text-sm font-extrabold text-cream-light">
                  {activeOrigin.recommendedMethod}
                </div>
                <div className="text-xs text-amber-gold font-mono font-bold mt-1">
                  {isCoffee ? activeOrigin.acidProfile : activeOrigin.soilType}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-cream-soft/60 font-medium">
                {isCoffee ? `Ideal Roast: ${activeOrigin.roastPairing}` : `Processing: ${activeOrigin.processing}`}
              </div>
            </div>

          </div>

          {/* 4. Deep Agronomy, Soil Geology & Terroir Science Note */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/15 text-xs text-cream-soft/90 font-medium leading-relaxed shadow-inner">
            <div className="flex items-center space-x-2 text-amber-gold font-extrabold uppercase tracking-wider mb-2 text-xs">
              <BookOpen className="w-4 h-4" />
              <span>Deep Terroir & Agronomy Science Insight:</span>
            </div>
            <p className="mb-2 text-cream-soft leading-relaxed">
              {activeOrigin.agronomyDeepDive || activeOrigin.terroirOverview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/10 text-[11px]">
              <div>
                <strong className="text-cream-light font-bold">Soil Geology: </strong>
                <span>{activeOrigin.soilType}</span>
              </div>
              <div>
                <strong className="text-cream-light font-bold">{isCoffee ? 'Microclimate Diurnal Swings: ' : 'Harvest Method: '}</strong>
                <span>{isCoffee ? activeOrigin.climate : activeOrigin.steepStyle}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
