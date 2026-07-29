import React from 'react';
import { CupSoda, Scale, Sliders, CheckCircle2, Sparkles, Thermometer, Clock } from 'lucide-react';

export default function PrecisionCalculator({
  trackMode,
  methods,
  activeMethod,
  setActiveMethod,
  cupCount,
  setCupCount,
  cupMl,
  setCupMl,
  customRatio,
  setCustomRatio,
  unitSystem
}) {
  const isCoffee = trackMode === 'coffee';
  const isMetric = unitSystem === 'metric';

  // Math Calculations
  const totalWaterMl = cupCount * cupMl;
  const currentRatio = customRatio || activeMethod?.ratio || 15;
  const dryDoseGrams = totalWaterMl / currentRatio;

  // Conversion helpers for Imperial
  const totalWaterOz = (totalWaterMl / 29.5735).toFixed(1);
  const dryDoseOz = (dryDoseGrams / 28.3495).toFixed(2);

  const waterDisplay = isMetric ? `${totalWaterMl} mL` : `${totalWaterOz} fl oz`;
  const doseDisplay = isMetric ? `${dryDoseGrams.toFixed(1)} g` : `${dryDoseOz} oz (${dryDoseGrams.toFixed(1)}g)`;

  const CUP_VOLUMES = [
    { label: isMetric ? 'Small Cup (200 mL)' : 'Small Cup (6.7 fl oz)', ml: 200 },
    { label: isMetric ? 'Standard Mug (240 mL)' : 'Standard Mug (8 fl oz)', ml: 240 },
    { label: isMetric ? 'Large Mug (300 mL)' : 'Large Mug (10.1 fl oz)', ml: 300 },
    { label: isMetric ? 'Travel Tumbler (360 mL)' : 'Travel Tumbler (12.2 fl oz)', ml: 360 }
  ];

  // Helper to format total duration of a method's phases
  const getTotalDurationString = (phases = []) => {
    const totalSec = phases.reduce((acc, p) => acc + (p.durationSec || 0), 0);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
  };

  return (
    <div className={`p-7 rounded-3xl ${isCoffee ? 'glass-panel-amber' : 'glass-panel-sage'} shadow-2xl transition-all duration-500`}>
      
      {/* Title Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center gap-2.5 drop-shadow-md">
            <Scale className={`w-6 h-6 ${isCoffee ? 'text-amber-gold' : 'text-sage-300'}`} />
            <span>{isCoffee ? 'Coffee Ratio & Cup Scaler' : 'Tea Steeping & Ratio Scaler'}</span>
          </h3>
          <p className="text-xs text-cream-soft/70 mt-0.5">
            {isCoffee 
              ? 'Calculates dry ground weight & water volume for your target cup count' 
              : 'Select tea type for specific steeping temperatures, infusion times & ratios'}
          </p>
        </div>
        <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-inner ${
          isCoffee 
            ? 'bg-amber-gold/20 text-amber-gold border border-amber-gold/40 shadow-amber-gold/10' 
            : 'bg-sage-500/20 text-sage-300 border border-sage-500/40 shadow-sage-500/10'
        }`}>
          {isCoffee ? 'Coffee Grounds' : 'Tea Leaf Categories'}
        </span>
      </div>

      {/* 1. Method / Tea Type Selector Grid (NO Featured Badges) */}
      <div className="mb-8">
        <label className="block text-xs uppercase tracking-widest font-extrabold text-cream-soft/70 mb-3.5 flex items-center justify-between">
          <span>{isCoffee ? 'Select Coffee Method:' : 'Select Tea Type & Leaf Category:'}</span>
          <span className="text-[11px] font-mono text-amber-gold">
            {methods.length} {isCoffee ? 'Methods Available' : 'Tea Types Available'}
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {methods.map((method) => {
            const isSelected = activeMethod.id === method.id;
            const totalDurationStr = getTotalDurationString(method.phases);
            const tempStr = isMetric ? `${method.tempC}°C` : `${method.tempF}°F`;

            return (
              <button
                key={method.id}
                onClick={() => {
                  setActiveMethod(method);
                  setCustomRatio(null);
                }}
                className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  isSelected
                    ? isCoffee
                      ? 'btn-tactile-amber text-espresso-950 scale-105 font-bold'
                      : 'btn-tactile-sage text-cream-light scale-105 font-bold'
                    : 'bg-espresso-900/70 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20 shadow-md'
                }`}
              >
                <div className="pr-2">
                  <div className="text-sm font-bold flex items-center gap-1.5">
                    {method.name}
                  </div>
                  <div className={`text-xs mt-1 space-y-0.5 ${isSelected ? 'opacity-95 font-semibold' : 'text-cream-soft/70'}`}>
                    <div>
                      Ratio: {isCoffee ? `1 : ${method.ratio}` : `1g / ${method.ratio}mL`}
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="flex items-center gap-0.5">
                        <Thermometer className="w-3 h-3" />
                        {tempStr}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" />
                        {totalDurationStr}
                      </span>
                    </div>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 flex-shrink-0 drop-shadow ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Cup Quantity & Mug Size Stepper Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-black/40 p-5 rounded-2xl border border-white/10 shadow-inner">
        
        {/* Cup Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-wider font-extrabold text-cream-soft/80 flex items-center gap-1.5">
              <CupSoda className="w-4 h-4 text-amber-gold" />
              <span>Cup Quantity ({cupCount} {cupCount === 1 ? 'Cup' : 'Cups'})</span>
            </label>
            <span className="text-sm font-extrabold font-mono text-cream-light bg-amber-gold/20 px-3 py-1 rounded-xl border border-amber-gold/30 shadow">
              {cupCount}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={cupCount}
            onChange={(e) => setCupCount(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-900 rounded-xl appearance-none cursor-pointer mb-3"
          />

          <div className="flex justify-between text-[11px] text-cream-soft/60 font-mono font-medium">
            <span>1 Cup</span>
            <span>2 Cups</span>
            <span>3 Cups</span>
            <span>4 Cups</span>
            <span>5 Cups</span>
            <span>6 Cups</span>
          </div>
        </div>

        {/* Mug Capacity Selector */}
        <div>
          <label className="block text-xs uppercase tracking-wider font-extrabold text-cream-soft/80 mb-3">
            Mug Volume Capacity:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {CUP_VOLUMES.map((vol) => (
              <button
                key={vol.ml}
                onClick={() => setCupMl(vol.ml)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  cupMl === vol.ml
                    ? isCoffee
                      ? 'bg-amber-gold/30 border-amber-gold text-amber-gold font-extrabold shadow-lg shadow-amber-gold/10'
                      : 'bg-sage-500/30 border-sage-300 text-sage-300 font-extrabold shadow-lg shadow-sage-500/10'
                    : 'bg-slate-800/80 border-white/10 text-cream-soft/70 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {vol.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Real-time Calculation Result Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Required Dry Dose */}
        <div className="p-5 rounded-2xl bg-espresso-950/90 border border-amber-gold/40 relative overflow-hidden shadow-2xl group hover:border-amber-gold transition-colors">
          <div className="flex items-center justify-between text-xs text-cream-soft/70 uppercase font-extrabold mb-1">
            <span>Required {isCoffee ? 'Coffee Beans' : 'Tea Leaves'}</span>
            <Sparkles className="w-4 h-4 text-amber-gold animate-pulse" />
          </div>
          <div className="text-3xl md:text-4xl font-extrabold font-mono text-amber-gold tracking-tight drop-shadow-md">
            {doseDisplay}
          </div>
          <div className="text-[11px] text-cream-soft/60 mt-1.5 font-medium">
            Weighed dry on scale ({isCoffee ? `1:${currentRatio}` : `1g / ${currentRatio}mL`})
          </div>
        </div>

        {/* Total Water Target */}
        <div className="p-5 rounded-2xl bg-espresso-950/90 border border-white/20 relative overflow-hidden shadow-2xl group hover:border-white/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-cream-soft/70 uppercase font-extrabold mb-1">
            <span>Total Water Volume</span>
            <span className="text-[11px] text-cream-soft/60 font-mono">Temp: {activeMethod.tempC}°C</span>
          </div>
          <div className="text-3xl md:text-4xl font-extrabold font-mono text-cream-light tracking-tight drop-shadow-md">
            {waterDisplay}
          </div>
          <div className="text-[11px] text-cream-soft/60 mt-1.5 font-medium">
            {isCoffee ? 'Pour-over/batch kettle volume' : 'Hot water steep volume'}
          </div>
        </div>

      </div>

      {/* Optional Fine-Tune Ratio Slider */}
      <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-cream-soft/80">
          <Sliders className="w-4 h-4 text-amber-gold" />
          <span className="font-semibold">Fine-Tune Ratio Target:</span>
          <span className="font-extrabold text-cream-light font-mono text-sm bg-white/10 px-2 py-0.5 rounded border border-white/10">
            {isCoffee ? `1 : ${currentRatio}` : `1g / ${currentRatio}mL`}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="range"
            min={isCoffee ? "10" : "20"}
            max={isCoffee ? "20" : "70"}
            step="1"
            value={currentRatio}
            onChange={(e) => setCustomRatio(parseInt(e.target.value))}
            className="w-28 sm:w-40 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
          />
          {customRatio && (
            <button
              onClick={() => setCustomRatio(null)}
              className="text-xs text-amber-gold font-bold underline hover:text-cream-light"
            >
              Reset
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
