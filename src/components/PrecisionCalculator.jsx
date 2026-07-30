import React from 'react';
import { CupSoda, Scale, Sliders, CheckCircle2, Sparkles, Thermometer, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

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
  unitSystem,
  onPrevStep,
  onNextStep
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

  return (
    <div className={`p-7 rounded-3xl ${isCoffee ? 'glass-panel-amber' : 'glass-panel-sage'} shadow-2xl transition-all duration-500`}>
      
      {/* 1. Header Bar with Device Switcher Pills */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Step 02 of 04 • {isCoffee ? 'Coffee Ratio & Cup Scaler' : 'Tea Steeping & Mug Scaler'}</span>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full text-cream-light border border-white/15">
            Active: {activeMethod?.name}
          </span>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
          {isCoffee ? 'Precision Coffee Ratio & Dose Scaler' : 'Precision Tea Infusion Scaler'}
        </h3>
        <p className="text-xs text-cream-soft/70 mt-1">
          {isCoffee
            ? 'Calculates exact dry coffee ground weight (oz/g) and hot water volume (fl oz/mL) based on target cups.'
            : 'Calculates exact tea leaf weight (oz/g) and hot water volume (fl oz/mL) for ideal steep strength.'}
        </p>

        {/* Horizontal Scroll Method Picker Quick Tabs */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <label className="block text-[10px] uppercase font-mono tracking-widest font-extrabold text-cream-soft/70 mb-2">
            Switch Method:
          </label>
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {methods.map((method) => {
              const isSelected = activeMethod?.id === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? isCoffee
                        ? 'bg-amber-gold text-espresso-950 border-amber-gold font-extrabold shadow-md'
                        : 'bg-sage-400 text-slate-950 border-sage-400 font-extrabold shadow-md'
                      : 'bg-black/30 text-cream-soft/70 border-white/10 hover:bg-white/10 hover:text-cream-light'
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Cup Quantity & Mug Size Stepper Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-black/40 p-5 rounded-2xl border border-white/10 shadow-inner">
        
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
                    : 'bg-black/50 border-white/10 text-cream-soft hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {vol.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Output Display Cards (Dry Grounds with Integrated Ratio Slider & Water Volume) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
        
        {/* Dry Dose Output Card with Integrated Fine-Tune Ratio Slider */}
        <div className="p-6 rounded-2xl bg-espresso-950/90 border border-amber-gold/40 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-2">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>{isCoffee ? 'Dry Coffee Grounds' : 'Tea Leaves'}</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Dose Weight</span>
            </div>

            <div className="text-3xl lg:text-4xl font-extrabold font-mono text-cream-light drop-shadow-md my-1">
              {doseDisplay}
            </div>
          </div>

          {/* Integrated Fine-Tune Ratio Slider */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] text-cream-soft/80 font-medium mb-1.5">
              <span className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-amber-gold" />
                <span>Target Ratio: <strong className="text-amber-gold font-mono">{isCoffee ? `1 : ${currentRatio}` : `1g / ${currentRatio}mL`}</strong></span>
              </span>
              {customRatio && (
                <button
                  onClick={() => setCustomRatio(null)}
                  className="text-[10px] text-amber-gold font-bold underline hover:text-cream-light"
                >
                  Reset Default
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min={isCoffee ? "10" : "20"}
                max={isCoffee ? "20" : "70"}
                step="1"
                value={currentRatio}
                onChange={(e) => setCustomRatio(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Water Volume Output Card */}
        <div className="p-6 rounded-2xl bg-espresso-950/90 border border-amber-gold/40 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-cyan-400 mb-2">
              <span className="flex items-center gap-1.5">
                <CupSoda className="w-4 h-4" />
                <span>Total Hot Water</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Target Liquid</span>
            </div>

            <div className="text-3xl lg:text-4xl font-extrabold font-mono text-cream-light drop-shadow-md my-1">
              {waterDisplay}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-cream-soft/70 font-medium flex items-center justify-between">
            <span>Ideal brew temperature:</span>
            <strong className="text-cyan-400 font-mono text-xs">{isMetric ? `${activeMethod?.tempC || 90}°C` : `${activeMethod?.tempF || 194}°F`}</strong>
          </div>
        </div>

      </div>

      {/* Step Navigation Controls */}
      {onPrevStep && onNextStep && (
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <button
            onClick={onPrevStep}
            className="py-3 px-6 rounded-2xl bg-white/10 text-cream-light font-extrabold text-xs flex items-center gap-2 hover:bg-white/20 transition-all border border-white/15"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step 01: Choose Method</span>
          </button>

          <button
            onClick={onNextStep}
            className="py-3.5 px-8 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Step 03: Grind & Beans</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
