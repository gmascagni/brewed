import React, { useState } from 'react';
import { GraduationCap, MapPin, Sparkles, Award, Compass, Store, ShoppingBag, Mountain, Globe, Dna, Sun, BookOpen } from 'lucide-react';
import { TERROIR_ATLAS, COFFEE_BELT_OVERVIEW, BOTANICAL_COMPARISON } from '../data/brewData';

export default function UniversityHub() {
  const origins = TERROIR_ATLAS.coffee || [];
  const [activeOriginId, setActiveOriginId] = useState(origins[0]?.id || 'ethiopia');

  const activeOrigin = origins.find((o) => o.id === activeOriginId) || origins[0];

  return (
    <section className="mt-8 p-6 md:p-8 rounded-3xl shadow-sm transition-all duration-500 border border-[#ECE6DC] bg-[#FAF7F2] text-[#14110F]">
      
      {/* 1. Section Main Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#ECE6DC]">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest mb-1.5 text-[#A8622D]">
            <GraduationCap className="w-4 h-4" />
            <span>The Brew App University • Specialty Coffee Belt & Species Atlas</span>
          </div>

          <h3 className="font-editorial text-2xl md:text-3xl font-bold text-[#14110F]">
            The Global Coffee Belt, Agronomy & Sourced Roasters
          </h3>

          <p className="text-xs md:text-sm text-[#766A62] mt-1 max-w-3xl leading-relaxed">
            An enthusiast guide to the Coffee Belt (Tropics of Cancer & Capricorn), Arabica vs Robusta botanical genetics, volcanic soil terroir science, and famous roasters.
          </p>
        </div>

        <span className="text-xs font-mono font-bold px-3.5 py-1.5 rounded-full border border-[#D8CFC4] bg-[#F7F4EE] text-[#A8622D] shadow-xs whitespace-nowrap">
          12 Global Growing Origins
        </span>
      </div>

      {/* 2. THE COFFEE BELT OVERVIEW BANNER */}
      <div className="mb-8 p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#ECE6DC]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#FAF0E6] text-[#A8622D]">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-editorial text-lg font-bold text-[#14110F]">
                {COFFEE_BELT_OVERVIEW.title}
              </h4>
              <p className="text-xs text-[#766A62]">
                {COFFEE_BELT_OVERVIEW.geographicBand}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#766A62] bg-[#FAF7F2] px-3 py-1.5 rounded-lg border border-[#ECE6DC]">
            <Sun className="w-4 h-4 text-[#D69550]" />
            <span>Microclimates: {COFFEE_BELT_OVERVIEW.idealClimate}</span>
          </div>
        </div>

        <p className="text-xs md:text-sm text-[#574C45] leading-relaxed mb-6 font-sans">
          {COFFEE_BELT_OVERVIEW.geologicalSignificance}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {COFFEE_BELT_OVERVIEW.keyFactors.map((f, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
              <div className="text-xs font-bold text-[#A8622D] uppercase tracking-wider mb-1">
                {f.factor}
              </div>
              <div className="text-[11px] text-[#766A62] leading-snug">
                {f.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ARABICA VS ROBUSTA BOTANICAL SCIENCE */}
      <div className="mb-8 p-6 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4 text-[#A8622D]">
          <Dna className="w-5 h-5" />
          <h4 className="font-editorial text-lg font-bold text-[#14110F]">
            Botanical Genetics: Coffea Arabica vs Coffea Canephora
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-editorial text-base font-bold text-[#14110F]">Coffea Arabica</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF0E6] text-[#A8622D] border border-[#ECD4BD] font-bold">44 Chromosomes (Self-Pollinating)</span>
            </div>
            <p className="text-xs text-[#766A62] leading-relaxed mb-3">
              Grown at high altitudes (1,000 - 2,200m). Produces complex citric, malic, and phosphoric acidity, floral aromatics, and layered sugar sweetness.
            </p>
            <div className="text-[11px] font-mono text-[#574C45] space-y-1">
              <div>• Caffeine: ~1.2 - 1.5%</div>
              <div>• Sugars & Lipids: High Sucrose (6-9%), 15-17% Lipids</div>
              <div>• Sensory: Jasmine, peach, bergamot, berry, cacao</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-editorial text-base font-bold text-[#14110F]">Coffea Canephora (Robusta)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EAE5DC] text-[#574C45] border border-[#D8CFC4] font-bold">22 Chromosomes (Cross-Pollinating)</span>
            </div>
            <p className="text-xs text-[#766A62] leading-relaxed mb-3">
              Grown at low altitudes (0 - 800m). Resilient to pests, heat, and rust fungi. Delivers heavy body, dense persistent crema, and dark bitter notes.
            </p>
            <div className="text-[11px] font-mono text-[#574C45] space-y-1">
              <div>• Caffeine: ~2.2 - 2.7% (Natural pesticide)</div>
              <div>• Sugars & Lipids: Lower Sugars (3-5%), 10-12% Lipids</div>
              <div>• Sensory: Dark chocolate, toasted walnut, woody, crema</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Origin Country Selection Grid */}
      <div className="mb-8">
        <label className="block text-xs uppercase tracking-wider font-bold text-[#766A62] mb-3 flex items-center justify-between">
          <span>Select Growing Origin / Nation:</span>
          <span className="text-[11px] font-mono text-[#A8622D]">Click Country to Explore</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {origins.map((origin) => {
            const isSelected = origin.id === activeOrigin?.id;
            return (
              <button
                key={origin.id}
                onClick={() => setActiveOriginId(origin.id)}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 hover:-translate-y-0.5 shadow-xs ${
                  isSelected
                    ? 'bg-white border-[#D69550] shadow-md ring-2 ring-[#D69550]/20'
                    : 'bg-white border-[#ECE6DC] text-[#766A62] hover:border-[#D8CFC4]'
                }`}
              >
                <div className="text-2xl mb-1">{origin.flag}</div>
                <div className={`text-xs font-bold tracking-wide truncate ${isSelected ? 'text-[#14110F]' : 'text-[#574C45]'}`}>
                  {origin.country ? origin.country.split(' ')[0] : 'Origin'}
                </div>
                <div className="text-[9px] mt-0.5 truncate text-[#A89F91]">
                  {origin.macroRegion ? origin.macroRegion.split(' ')[0] : 'Coffee'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Selected Origin Detailed Master Showcase Card */}
      {activeOrigin && (
        <div className="p-6 md:p-8 rounded-2xl border border-[#ECE6DC] bg-white shadow-xs relative overflow-hidden">
          
          {/* Top Title & Elevation Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#ECE6DC]">
            <div className="flex items-center space-x-3.5">
              <span className="text-5xl">{activeOrigin.flag}</span>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-editorial text-2xl md:text-3xl font-bold text-[#14110F]">
                    {activeOrigin.country}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border bg-[#FAF0E6] text-[#A8622D] border-[#ECD4BD]">
                    {activeOrigin.macroRegion || 'Specialty Grade'}
                  </span>
                </div>
                <div className="text-xs font-semibold flex items-center gap-1.5 mt-1 text-[#766A62]">
                  <MapPin className="w-3.5 h-3.5 text-[#A8622D]" />
                  <span>Key Microclimates & Regions: {activeOrigin.regions}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold bg-[#FAF7F2] px-3.5 py-1.5 rounded-xl border border-[#ECE6DC] text-[#14110F] flex items-center gap-1.5">
                <Mountain className="w-4 h-4 text-[#A8622D]" />
                <span>Elevation: {activeOrigin.altitude}</span>
              </span>
            </div>
          </div>

          {/* FAMOUS BRANDS & SPECIALTY ROASTERS GRID */}
          <div className="p-5 md:p-6 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] shadow-xs mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#ECE6DC]">
              <div className="flex items-center space-x-2 text-sm uppercase font-bold tracking-wider text-[#A8622D]">
                <Store className="w-5 h-5" />
                <span>Famous Specialty Roasters Sourced From {activeOrigin.country}:</span>
              </div>
              <span className="text-[11px] font-mono text-[#766A62]">
                Curated Specialty Roasters
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(activeOrigin.sourcedBrands || []).map((brand, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-[#ECE6DC] hover:border-[#D69550] transition-all duration-200 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs text-[#14110F]">{brand.name}</span>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#A8622D]" />
                    </div>
                    <div className="text-[11px] font-semibold text-[#A8622D] mb-1.5">
                      {brand.offering}
                    </div>
                    <p className="text-[11px] text-[#766A62] leading-snug">
                      {brand.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agronomy Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Box 1: Signature Flavor Notes */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A8622D] mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Signature Flavor Notes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(activeOrigin.flavorNotes || []).map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border bg-white text-[#14110F] border-[#ECE6DC] shadow-2xs"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 2: Agronomy Genetics & Processing */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A8622D] mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#2D8B55]" />
                <span>Genetics & Processing:</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#574C45]">
                <div><strong className="text-[#14110F]">Cultivars:</strong> {activeOrigin.genetics}</div>
                <div><strong className="text-[#14110F]">Processing:</strong> {activeOrigin.processing}</div>
              </div>
            </div>

            {/* Box 3: Extraction Pairing & Acidity */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#A8622D] mb-1.5 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#357ABD]" />
                  <span>Extraction & Acid Profile:</span>
                </div>
                <div className="text-sm font-bold text-[#14110F]">
                  {activeOrigin.recommendedMethod}
                </div>
                <div className="text-xs font-mono font-bold mt-1 text-[#A8622D]">
                  {activeOrigin.acidProfile}
                </div>
              </div>

              <div className="mt-3 text-[11px] text-[#766A62]">
                Ideal Roast: {activeOrigin.roastPairing}
              </div>
            </div>
          </div>

          {/* Deep Agronomy, Soil Geology & Terroir Science Note */}
          <div className="p-5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-xs text-[#574C45] leading-relaxed">
            <div className="flex items-center space-x-2 font-bold uppercase tracking-wider mb-2 text-xs text-[#A8622D]">
              <BookOpen className="w-4 h-4" />
              <span>Deep Terroir & Agronomy Science Insight:</span>
            </div>
            <p className="mb-2 leading-relaxed text-[#574C45]">
              {activeOrigin.agronomyDeepDive || activeOrigin.terroirOverview}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#ECE6DC] text-[11px]">
              <div>
                <strong className="text-[#14110F]">Soil Geology: </strong>
                <span>{activeOrigin.soilType}</span>
              </div>
              <div>
                <strong className="text-[#14110F]">Microclimate & Climate: </strong>
                <span>{activeOrigin.climate}</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
