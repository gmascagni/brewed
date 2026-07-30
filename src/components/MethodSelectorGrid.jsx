import React from 'react';
import { Thermometer, Clock, CheckCircle2, ChevronRight, Sparkles, Coffee, Leaf, Gauge } from 'lucide-react';

export default function MethodSelectorGrid({ trackMode, methods, activeMethod, setActiveMethod, onNextStep, unitSystem }) {
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
    <div className="space-y-8 animate-fade-in">
      {/* Step Header */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel shadow-2xl relative overflow-hidden">
        <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-2">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Step 01 of 04 • {isCoffee ? 'Coffee Device Selection' : 'Specialty Tea Selection'}</span>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light mb-2">
          {isCoffee ? 'Choose Your Coffee Extraction Device' : 'Choose Your Specialty Tea Type'}
        </h2>
        <p className="text-xs md:text-sm text-cream-soft/80 max-w-2xl leading-relaxed">
          {isCoffee
            ? 'Select a brewing method below to customize your water ratio, grind coarseness, roast recommendations, and step-by-step extraction timer.'
            : 'Select a tea category below to customize steeping temperatures, vessel preheating, and leaf-to-water infusion ratios.'}
        </p>
      </div>

      {/* Grid of Devices / Teas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => {
          const isSelected = activeMethod?.id === method.id;
          const totalDurationStr = getTotalDurationString(method.phases);
          const tempStr = isMetric ? `${method.tempC}°C` : `${method.tempF}°F`;

          return (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method)}
              className={`p-6 rounded-3xl border text-left transition-all duration-500 relative flex flex-col justify-between group shadow-xl hover:-translate-y-1.5 ${
                isSelected
                  ? isCoffee
                    ? 'btn-tactile-amber text-espresso-950 scale-102 ring-2 ring-amber-gold'
                    : 'btn-tactile-sage text-cream-light scale-102 ring-2 ring-sage-400'
                  : 'bg-espresso-900/80 border-white/15 text-cream-soft hover:bg-white/10 hover:border-white/30'
              }`}
            >
              {/* Method Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${
                    isSelected
                      ? 'bg-black/20 text-current'
                      : 'bg-white/10 text-amber-gold'
                  }`}>
                    {isCoffee ? <Coffee className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                  </div>

                  {isSelected && (
                    <span className="px-3 py-1 rounded-full bg-black/30 text-current text-xs font-extrabold flex items-center gap-1 border border-current/20 shadow-inner">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-xl font-extrabold mb-2 leading-snug drop-shadow">
                  {method.name}
                </h3>
                <p className={`text-xs leading-relaxed mb-6 font-medium ${
                  isSelected ? 'opacity-95' : 'text-cream-soft/70'
                }`}>
                  {method.description}
                </p>
              </div>

              {/* Specs Pills Row */}
              <div className={`pt-4 border-t ${isSelected ? 'border-current/20' : 'border-white/10'} space-y-2 text-xs font-mono font-extrabold`}>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 uppercase text-[10px]">Ratio:</span>
                  <span>{isCoffee ? `1 : ${method.ratio}` : `1g / ${method.ratio}mL`}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 uppercase text-[10px]">Target Temp:</span>
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 opacity-80" />
                    {tempStr}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="opacity-70 uppercase text-[10px]">{isCoffee ? 'Brew Time:' : 'Steep Time:'}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 opacity-80" />
                    {totalDurationStr}
                  </span>
                </div>
                {isCoffee && method.grind && (
                  <div className="flex items-center justify-between pt-1 border-t border-current/10">
                    <span className="opacity-70 uppercase text-[10px]">Grind Type:</span>
                    <span className="flex items-center gap-1 font-bold">
                      <Gauge className="w-3.5 h-3.5 opacity-80" />
                      {method.grind}
                    </span>
                  </div>
                )}
                {!isCoffee && method.leafGrade && (
                  <div className="flex items-center justify-between pt-1 border-t border-current/10">
                    <span className="opacity-70 uppercase text-[10px]">Leaf Style:</span>
                    <span className="flex items-center gap-1 font-bold">
                      {method.leafGrade}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Step Navigation Action Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <div className="text-xs text-cream-soft/70 font-medium">
          Selected: <strong className="text-cream-light font-bold">{activeMethod?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="py-3.5 px-8 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <span>Step 02: Ratio & Scaler</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
