import React from 'react';
import { Thermometer, Clock, CheckCircle2, ChevronRight, Sparkles, Coffee, Gauge } from 'lucide-react';

export default function MethodSelectorGrid({ methods, activeMethod, setActiveMethod, onNextStep, unitSystem }) {
  const isMetric = unitSystem === 'metric';

  // Helper to format total duration of a method's phases
  const getTotalDurationString = (phases) => {
    if (!phases || phases.length === 0) return '3m 00s';
    const totalSec = phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="space-y-10 md:space-y-12 animate-fade-in">
      {/* Step Header with Extraction Method Background Image */}
      <div className="p-8 md:p-10 lg:p-12 rounded-3xl relative overflow-hidden shadow-2xl border transition-all duration-500 glass-panel-coffee border-[#A66E38]/40">
        {/* Background Extraction Image Overlay */}
        <div className="absolute inset-0 z-0 opacity-35 pointer-events-none">
          <img
            key={activeMethod?.heroImage || 'coffee_hero'}
            src={(activeMethod?.heroImage && activeMethod.heroImage !== '/') ? activeMethod.heroImage : '/pour_over_hero.jpg'}
            alt="Extraction Background"
            className="w-full h-full object-cover object-center transform scale-105 filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#140D09] via-[#140D09]/85 to-[#140D09]/50" />
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] mb-3 text-[#D2A06E]">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Step 01 of 04 • Atelier Selection</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-cream-light mb-3 leading-tight drop-shadow-lg">
            Master the Craft of Coffee Extraction
          </h2>
          
          <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed font-normal mb-6 drop-shadow">
            Precision specialty coffee ratio calculator, SCA golden cup standards, burr grinder dial-in targets, and real-time pour-over timers. Select your brewing equipment below:
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2A1C12]/70 border border-[#A66E38]/40 text-[#D2A06E] font-mono text-xs">
            <Coffee className="w-4 h-4 text-amber-gold" />
            <span className="font-bold">The Coffee Lab</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-300">8 Curated Specialty Extraction Profiles</span>
          </div>
        </div>
      </div>

      {/* Grid of Extraction Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {methods.map((method) => {
          const isSelected = activeMethod?.id === method.id;
          const totalDurationStr = getTotalDurationString(method.phases);
          const tempStr = isMetric ? `${method.tempC}°C` : `${method.tempF}°F`;

          return (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method)}
              className={`p-8 md:p-9 rounded-3xl border text-left transition-all duration-300 relative flex flex-col justify-between group shadow-xl hover:-translate-y-1.5 ${
                isSelected
                  ? 'bg-[#A66E38]/20 border-[#C48B56]/70 text-cream-light ring-1 ring-[#C48B56]/40 shadow-[0_15px_40px_-10px_rgba(166,110,56,0.35)] backdrop-blur-xl'
                  : 'bg-[#18120D]/80 border-white/[0.08] text-stone-300 hover:bg-[#221B14] hover:border-[#A66E38]/30'
              }`}
            >
              {/* Method Card Header */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-[#C48B56] text-[#140C08] shadow-[0_0_15px_rgba(166,110,56,0.5)] font-bold'
                      : 'bg-white/[0.06] text-[#D2A06E] border border-white/[0.08]'
                  }`}>
                    <Coffee className="w-6 h-6" />
                  </div>

                  {isSelected && (
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-mono tracking-[0.15em] font-extrabold uppercase border flex items-center gap-1.5 shadow-inner bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl font-bold mb-2.5 leading-snug drop-shadow text-cream-light">
                  {method.name}
                </h3>
                
                <p className="text-xs text-stone-400 leading-relaxed mb-6 font-normal">
                  {method.description}
                </p>
              </div>

              {/* Specs Pills Row */}
              <div className={`pt-5 border-t ${isSelected ? 'border-white/15' : 'border-white/[0.08]'} space-y-2.5 text-xs font-mono font-medium`}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">
                    Ratio Target:
                  </span>
                  <span className="font-bold text-cream-light">
                    1 : {method.ratio}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">
                    Water Temp:
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Thermometer className="w-3.5 h-3.5 opacity-80" />
                    {tempStr}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">
                    Brew Duration:
                  </span>
                  <span className="flex items-center gap-1.5 font-bold text-cream-light">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    {totalDurationStr}
                  </span>
                </div>

                {method.grind && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-[#D2A06E]">Grind Size:</span>
                    <span className="flex items-center gap-1.5 font-bold text-[#D2A06E]">
                      <Gauge className="w-3.5 h-3.5 opacity-80" />
                      {method.grind}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Contextual Amazon Affiliate Paper Filter Callout for Pour-Over Methods */}
      {(activeMethod?.id === 'pour_over' || activeMethod?.id === 'classic_pour_over' || activeMethod?.id === 'chemex') && (
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-300">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-[#D2A06E]" />
            <span>Pristine pour-over clarity and flow rate require high-density oxygen-bleached micro-pore paper filters (Hario V60 Size 02, Chemex Bonded).</span>
          </div>
          <a
            href="https://www.amazon.com/dp/B001U7EOYA/?tag=thebrewapp13-20"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-product-name="Hario V60 Paper Filters Size 02"
            data-link-id="hario_v60_filters"
            data-context="step1_method_filter_pick"
            className="px-4 py-2 rounded-xl border font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0 bg-[#A66E38]/20 text-[#D2A06E] hover:bg-[#A66E38]/30 border-[#A66E38]/40 shadow-xs active:scale-95"
          >
            Check V60 Paper Filters on Amazon ↗
          </a>
        </div>
      )}

      {/* Step Navigation Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.08]">
        <div className="text-xs text-stone-400 font-medium">
          Active Selection: <strong className="text-cream-light font-serif font-bold text-base ml-1">{activeMethod?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="w-full sm:w-auto py-4 px-10 rounded-2xl font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(200,138,75,0.4)] hover:scale-105 active:scale-95 transition-all btn-tactile-coffee text-[#140C08]"
        >
          <span>Step 02: Ratio & Scaler</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
