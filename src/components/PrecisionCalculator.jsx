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
  customWaterMl,
  setCustomWaterMl,
  unitSystem,
  onPrevStep,
  onNextStep
}) {
  const isCoffee = trackMode === 'coffee';
  const isMetric = unitSystem === 'metric';

  // Math Calculations
  const totalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
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

  const handleCupCountChange = (count) => {
    setCupCount(count);
    if (customWaterMl !== null) setCustomWaterMl(null); // snap back to cup calculation
  };

  const handleCupMlChange = (ml) => {
    setCupMl(ml);
    if (customWaterMl !== null) setCustomWaterMl(null); // snap back to cup calculation
  };

  return (
    <div className={`p-8 md:p-10 lg:p-12 rounded-3xl ${isCoffee ? 'glass-panel-amber' : 'glass-panel-sage'} shadow-2xl transition-all duration-500`}>
      
      {/* 1. Header Bar with Device Switcher Pills */}
      <div className="mb-8 pb-6 border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Step 02 of 04 • Dose & Volumetric Scaler</span>
          </div>
          <span className="text-xs font-mono font-bold bg-white/[0.06] px-3.5 py-1 rounded-full text-cream-light border border-white/[0.12] shadow-inner">
            Active: {activeMethod?.name}
          </span>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md">
          {isCoffee ? 'Precision Coffee Ratio & Dose Scaler' : 'Precision Tea Infusion Scaler'}
        </h3>
        <p className="text-xs md:text-sm text-stone-300 mt-1.5 leading-relaxed font-normal">
          {isCoffee
            ? 'Calculates exact dry coffee ground weight (oz/g) and hot water volume (fl oz/mL). Adjust cup count, mug size, or fine-tune water volume directly below.'
            : 'Calculates exact tea leaf weight (oz/g) and hot water volume (fl oz/mL). Adjust cup count, mug size, or fine-tune water volume directly below.'}
        </p>

        {/* Horizontal Scroll Method Picker Quick Tabs */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <label className="block text-[10px] uppercase font-mono tracking-[0.2em] font-extrabold text-amber-gold/90 mb-2.5">
            Switch Extraction Method:
          </label>
          <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 no-scrollbar">
            {methods.map((method) => {
              const isSelected = activeMethod?.id === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setActiveMethod(method)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? isCoffee
                        ? 'bg-amber-gold text-espresso-950 border-amber-gold font-extrabold shadow-[0_0_15px_rgba(212,140,70,0.4)]'
                        : 'bg-sage-300 text-slate-950 border-sage-300 font-extrabold shadow-[0_0_15px_rgba(143,168,153,0.4)]'
                      : 'bg-black/30 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#0F0D0C]/80 p-6 md:p-8 rounded-3xl border border-white/[0.08] shadow-inner">
        
        {/* Cup Slider */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <label className="text-xs uppercase tracking-[0.15em] font-mono font-extrabold text-stone-300 flex items-center gap-2">
              <CupSoda className="w-4 h-4 text-amber-gold" />
              <span>Target Serving ({cupCount} {cupCount === 1 ? 'Cup' : 'Cups'})</span>
            </label>
            <span className="text-sm font-extrabold font-mono text-cream-light bg-amber-400/20 px-3.5 py-1 rounded-xl border border-amber-400/30 shadow">
              {cupCount}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="6"
            step="1"
            value={cupCount}
            onChange={(e) => handleCupCountChange(parseInt(e.target.value))}
            className="w-full h-3 bg-[#1A1613] rounded-xl appearance-none cursor-pointer mb-3.5"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-mono font-medium">
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
          <label className="block text-xs uppercase tracking-[0.15em] font-mono font-extrabold text-stone-300 mb-3.5">
            Mug Volume Capacity:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CUP_VOLUMES.map((vol) => (
              <button
                key={vol.ml}
                onClick={() => handleCupMlChange(vol.ml)}
                className={`px-3.5 py-3 rounded-2xl text-xs font-bold border transition-all active:scale-95 ${
                  cupMl === vol.ml && customWaterMl === null
                    ? isCoffee
                      ? 'bg-amber-500/25 border-amber-400 text-amber-gold font-extrabold shadow-[0_0_20px_rgba(212,140,70,0.2)]'
                      : 'bg-emerald-500/25 border-sage-300 text-sage-300 font-extrabold shadow-[0_0_20px_rgba(143,168,153,0.2)]'
                    : 'bg-black/40 border-white/[0.08] text-stone-400 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                {vol.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Output Display Cards (Dry Grounds with Integrated Ratio Slider & Water Volume with Integrated Manual Water Slider) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        
        {/* Dry Dose Output Card with Integrated Fine-Tune Ratio Slider */}
        <div className="p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border border-amber-gold/30 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono text-amber-gold mb-2.5">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>{isCoffee ? 'Dry Coffee Grounds' : 'Tea Leaves'}</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Dose Weight</span>
            </div>

            <div className="text-4xl lg:text-5xl font-extrabold font-mono text-cream-light drop-shadow-md my-2">
              {doseDisplay}
            </div>
          </div>

          {/* Integrated Fine-Tune Ratio Slider */}
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-gold" />
                <span>Extraction Ratio: <strong className="text-amber-gold font-mono">{isCoffee ? `1 : ${currentRatio}` : `1g / ${currentRatio}mL`}</strong></span>
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
                className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Water Volume Output Card with Integrated Manual Water Volume Slider */}
        <div className="p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border border-cyan-400/30 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono text-cyan-400 mb-2.5">
              <span className="flex items-center gap-2">
                <CupSoda className="w-4 h-4" />
                <span>Total Hot Water</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Target Liquid</span>
            </div>

            <div className="text-4xl lg:text-5xl font-extrabold font-mono text-cream-light drop-shadow-md my-2">
              {waterDisplay}
            </div>
          </div>

          {/* Integrated Manual Water Volume Fine-Tune Slider */}
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Manual Water Adjustment:</span>
              </span>
              {customWaterMl !== null && (
                <button
                  onClick={() => setCustomWaterMl(null)}
                  className="text-[10px] text-cyan-400 font-bold underline hover:text-cream-light"
                >
                  Reset to Cups
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="100"
                max="1500"
                step="10"
                value={totalWaterMl}
                onChange={(e) => setCustomWaterMl(parseInt(e.target.value))}
                className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Golden Ratio Educational Callout Box (SCA Standard: 1 : 16) */}
      {isCoffee && (
        <div className="mt-6 p-6 rounded-3xl bg-[#181412]/90 border border-amber-gold/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-gold border border-amber-400/30 flex-shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5 mb-1">
                <span className="font-serif text-lg font-bold text-cream-light">
                  The Golden Ratio Standard (1 : 16)
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/30 font-extrabold">
                  SCA Golden Cup Benchmark
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-2xl font-normal">
                The Specialty Coffee Association (SCA) defines the <strong>Golden Ratio</strong> as <strong>1g coffee to 16 mL water</strong> (approx. 60g per 1 Liter / ~2 tbsp per 6 fl oz). This ratio dissolves 18% - 22% of soluble coffee compounds, yielding peak caramel sweetness and crisp citric acidity without bitter over-extraction.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCustomRatio(16)}
            className="py-3 px-5 rounded-2xl bg-amber-gold/20 text-amber-gold hover:bg-amber-gold hover:text-espresso-950 font-extrabold text-xs uppercase tracking-wider border border-amber-400/40 shadow-lg transition-all whitespace-nowrap active:scale-95 flex-shrink-0"
          >
            Snap to Golden Ratio (1 : 16)
          </button>
        </div>
      )}

      {/* Step Navigation Controls */}
      {onPrevStep && onNextStep && (
        <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/[0.08]">
          <button
            onClick={onPrevStep}
            className="py-4 px-8 rounded-2xl bg-white/[0.08] text-cream-light font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 hover:bg-white/[0.15] transition-all border border-white/[0.12]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Step 01: Choose Method</span>
          </button>

          <button
            onClick={onNextStep}
            className="py-4 px-9 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Step 03: Grind & Beans</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
