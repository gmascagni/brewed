import React from 'react';
import { Thermometer, Clock, CheckCircle2, ChevronRight, Sparkles, Coffee, Leaf, Gauge } from 'lucide-react';

export default function MethodSelectorGrid({ trackMode, setTrackMode, methods, activeMethod, setActiveMethod, onNextStep, unitSystem }) {
  const isCoffee = trackMode === 'coffee';
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
      {/* Step Header with Radial Ambient Glow */}
      <div className="p-8 md:p-10 lg:p-12 rounded-3xl glass-panel-amber relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold mb-3">
          <Sparkles className="w-4 h-4 animate-pulse text-amber-gold" />
          <span>Step 01 of 04 • Atelier Selection</span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-extrabold text-cream-light mb-3 leading-tight drop-shadow">
          Master the Craft of Coffee & Tea Extraction
        </h2>
        
        <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed font-normal mb-8">
          Precision specialty coffee ratio calculator, fine tea steeping timers, micron-level grind sizing, and troubleshooting guide. Select your brewing path below:
        </p>

        {/* Dual-Path Entry Buttons: The Coffee Lab vs The Tea Room */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTrackMode && setTrackMode('coffee')}
            className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer active:scale-95 group ${
              isCoffee
                ? 'btn-tactile-amber text-espresso-950 ring-2 ring-amber-gold/50 shadow-2xl scale-[1.02]'
                : 'bg-black/50 border-white/10 text-stone-300 opacity-70 hover:opacity-100 hover:border-amber-gold/50 hover:bg-black/70'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-colors ${
                isCoffee ? 'bg-black/30 text-current border border-current/20' : 'bg-amber-gold/20 text-amber-gold border border-amber-gold/30'
              }`}>
                <Coffee className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-serif text-lg font-bold ${isCoffee ? 'text-espresso-950' : 'text-cream-light group-hover:text-amber-gold transition-colors'}`}>
                  The Coffee Lab
                </h3>
                <p className={`text-[11px] ${isCoffee ? 'text-espresso-950/80 font-medium' : 'text-stone-400'}`}>
                  SCA Ratios, Burr Grinders & Pour Over
                </p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTrackMode && setTrackMode('tea')}
            className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer active:scale-95 group ${
              !isCoffee
                ? 'btn-tactile-sage text-cream-light ring-2 ring-sage-400/50 shadow-2xl scale-[1.02]'
                : 'bg-black/50 border-white/10 text-stone-300 opacity-70 hover:opacity-100 hover:border-sage-400/50 hover:bg-black/70'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl transition-colors ${
                !isCoffee ? 'bg-black/30 text-current border border-current/20' : 'bg-sage-500/20 text-sage-300 border border-sage-500/30'
              }`}>
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className={`font-serif text-lg font-bold ${!isCoffee ? 'text-cream-light' : 'text-cream-light group-hover:text-sage-300 transition-colors'}`}>
                  The Tea Room
                </h3>
                <p className={`text-[11px] ${!isCoffee ? 'text-cream-light/80 font-medium' : 'text-stone-400'}`}>
                  Gongfu Gaiwan, Steeping Presets & Terroirs
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Grid of Devices / Teas */}
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
                  ? isCoffee
                    ? 'bg-amber-500/15 border-amber-400/60 text-cream-light ring-1 ring-amber-400/40 shadow-[0_15px_40px_-10px_rgba(212,140,70,0.25)] backdrop-blur-xl'
                    : 'bg-emerald-500/15 border-emerald-400/60 text-cream-light ring-1 ring-emerald-400/40 shadow-[0_15px_40px_-10px_rgba(143,168,153,0.25)] backdrop-blur-xl'
                  : 'bg-[#14110E]/80 border-white/[0.08] text-stone-300 hover:bg-[#1C1814] hover:border-white/20'
              }`}
            >
              {/* Method Card Header */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl transition-all ${
                    isSelected
                      ? isCoffee
                        ? 'bg-amber-gold text-espresso-950 shadow-[0_0_15px_rgba(212,140,70,0.5)] font-bold'
                        : 'bg-sage-300 text-slate-950 shadow-[0_0_15px_rgba(143,168,153,0.5)] font-bold'
                      : 'bg-white/[0.06] text-amber-gold border border-white/[0.08]'
                  }`}>
                    {isCoffee ? <Coffee className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                  </div>

                  {isSelected && (
                    <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-gold text-[10px] font-mono tracking-[0.15em] font-extrabold uppercase border border-amber-400/30 flex items-center gap-1.5 shadow-inner">
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
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">Ratio Target:</span>
                  <span className="font-bold text-cream-light">{isCoffee ? `1 : ${method.ratio}` : `1g / ${method.ratio}mL`}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">Water Temp:</span>
                  <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                    <Thermometer className="w-3.5 h-3.5 opacity-80" />
                    {tempStr}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-stone-400">{isCoffee ? 'Brew Duration:' : 'Steep Duration:'}</span>
                  <span className="flex items-center gap-1.5 font-bold text-cream-light">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    {totalDurationStr}
                  </span>
                </div>

                {isCoffee && method.grind && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] uppercase font-mono tracking-[0.15em] text-amber-gold/90">Grind Size:</span>
                    <span className="flex items-center gap-1.5 font-bold text-amber-gold">
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

      {/* Step Navigation Action Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-white/[0.08]">
        <div className="text-xs text-stone-400 font-medium">
          Active Selection: <strong className="text-cream-light font-serif font-bold text-sm ml-1">{activeMethod?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="py-4 px-9 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Step 02: Ratio & Scaler</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
