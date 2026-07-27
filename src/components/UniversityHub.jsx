import React, { useState } from 'react';
import { GraduationCap, Globe, MapPin, Sparkles, Flame, CheckCircle2, ChevronRight, Award, Compass } from 'lucide-react';
import { TERROIR_ATLAS } from '../data/brewData';

export default function UniversityHub({ trackMode, onSelectRecommendedMethod }) {
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
            <span>BrewCraft University • Terroir & Origin Atlas</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            {isCoffee ? 'Coffee Growing Origins & Flavor Terroirs' : 'Specialty Tea Growing Origins & Leaf Profiles'}
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            {isCoffee
              ? 'Explore high-altitude volcanic origins, processing styles, and signature flavor profiles'
              : 'Explore historic mountain tea gardens, shading techniques, and cup characteristics'}
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
          <span className="text-[11px] font-mono text-amber-gold">Interactive Atlas</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {origins.map((origin) => {
            const isSelected = origin.id === activeOrigin.id;
            return (
              <button
                key={origin.id}
                onClick={() => setActiveOriginId(origin.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-0.5 ${
                  isSelected
                    ? isCoffee
                      ? 'btn-tactile-amber text-espresso-950 scale-105 font-bold'
                      : 'btn-tactile-sage text-cream-light scale-105 font-bold'
                    : 'bg-espresso-900/70 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20 shadow-md'
                }`}
              >
                <div className="text-2xl mb-1">{origin.flag}</div>
                <div className="text-xs font-extrabold tracking-wide drop-shadow">{origin.country}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? 'opacity-90 font-semibold' : 'text-cream-soft/60'}`}>
                  {isCoffee ? origin.regions.split(',')[0] : (origin.famousTeas ? origin.famousTeas[0].split(' ')[0] : '')}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Origin Detailed 3D Showcase Card */}
      {activeOrigin && (
        <div className="p-6 md:p-8 rounded-3xl bg-espresso-950/95 border border-amber-gold/40 shadow-2xl relative overflow-hidden">
          
          {/* Top Title Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center space-x-3.5">
              <span className="text-4xl">{activeOrigin.flag}</span>
              <div>
                <h4 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light tracking-wide">
                  {activeOrigin.country}
                </h4>
                <div className="text-xs text-amber-gold font-bold flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Key Regions: {activeOrigin.regions}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1.5 rounded-xl border border-white/15 text-cream-light">
                {isCoffee ? `Elevation: ${activeOrigin.altitude}` : `Steep: ${activeOrigin.steepStyle}`}
              </span>
            </div>
          </div>

          {/* Grid Layout: Terroir Notes & Characteristics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            {/* Column 1: Flavor Profile Badges */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-amber-gold mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Signature Flavor Notes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeOrigin.flavorNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-amber-gold/15 text-amber-gold border border-amber-gold/30 text-xs font-bold shadow-sm"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Column 2: Famous Teas or Coffee Varieties */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
              <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{isCoffee ? 'Processing & Cultivars:' : 'Famous Tea Varieties:'}</span>
              </div>
              
              {isCoffee ? (
                <div className="space-y-1.5 text-xs text-cream-soft/90 font-medium">
                  <div><strong className="text-cream-light">Processing:</strong> {activeOrigin.processing}</div>
                  <div><strong className="text-cream-light">Ideal Roast:</strong> {activeOrigin.roastPairing}</div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {activeOrigin.famousTeas.map((tea, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-sage-500/20 text-sage-300 border border-sage-500/30 text-xs font-semibold">
                      {tea}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Column 3: Recommended Brew Method Pairing */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner flex flex-col justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-cream-soft/80 mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Recommended Extraction:</span>
                </div>
                <div className="text-sm font-extrabold text-cream-light">
                  {activeOrigin.recommendedMethod}
                </div>
              </div>

              <div className="mt-3">
                <span className="text-[11px] text-cream-soft/60 block font-medium">
                  {isCoffee ? 'Paired for highest flavor acidity & body' : 'Paired for optimal leaf release'}
                </span>
              </div>
            </div>

          </div>

          {/* Terroir Master Overview Note */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-cream-soft/90 font-medium leading-relaxed shadow-inner">
            <strong className="text-amber-gold block uppercase tracking-wider mb-1 font-extrabold">
              Terroir & Cultivation Insights:
            </strong>
            {activeOrigin.terroirOverview}
          </div>

        </div>
      )}

    </section>
  );
}
