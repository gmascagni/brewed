import React, { useState } from 'react';
import { CupSoda, Scale, Sliders, CheckCircle2, Sparkles, Thermometer, Clock, ChevronRight, ChevronLeft, Volume2, VolumeX, Lightbulb } from 'lucide-react';
import V60ProTipModal from './V60ProTipModal';

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
  setUnitSystem,
  isMuted,
  setIsMuted,
  onPrevStep,
  onNextStep
}) {
  const isCoffee = trackMode === 'coffee';
  const isMetric = unitSystem === 'metric';
  const isPourOver = activeMethod?.id === 'classic_pour_over' || activeMethod?.id === 'pour_over' || activeMethod?.id === 'chemex';
  const [isProTipOpen, setIsProTipOpen] = useState(false);

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
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Card with Embedded Unit (oz/g) & Audio Preferences */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-amber relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-gold" />
            <span>Step 02 of 04 • Precision Scaler & Ratio Matrix</span>
          </div>

          {/* Embedded Preferences Control Bar: Imperial/Metric Unit Toggle, Mute Speaker & Pro Tip */}
          <div className="flex items-center space-x-2 text-xs font-mono font-bold">
            {isPourOver && (
              <button
                onClick={() => setIsProTipOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-gold text-espresso-950 hover:bg-amber-gold/90 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
                title="Open Pour Over Pro Tip Masterclass Guide"
              >
                <Lightbulb className="w-3.5 h-3.5 fill-current text-espresso-950" />
                <span>Pro Tip 💡</span>
              </button>
            )}

            {setUnitSystem && (
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold shadow-md">
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 ${
                    unitSystem === 'imperial'
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-sm scale-102'
                      : 'text-stone-400 hover:text-cream-light'
                  }`}
                  title="Switch to Imperial Units (oz/°F)"
                >
                  <Scale className="w-3 h-3 text-current" />
                  <span>Imperial (oz/°F)</span>
                </button>

                <button
                  onClick={() => setUnitSystem('metric')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 ${
                    unitSystem === 'metric'
                      ? 'btn-tactile-amber text-espresso-950 font-extrabold shadow-sm scale-102'
                      : 'text-stone-400 hover:text-cream-light'
                  }`}
                  title="Switch to Metric Units (g/mL/°C)"
                >
                  <Scale className="w-3 h-3 text-current" />
                  <span>Metric (g/mL/°C)</span>
                </button>
              </div>
            )}

            {setIsMuted && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 px-2.5 rounded-xl bg-black/60 border border-white/15 text-stone-200 hover:border-amber-gold/60 transition-all shadow-md active:scale-95"
                title={isMuted ? "Unmute Audio Alerts" : "Mute Audio Alerts"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-gold" />}
              </button>
            )}
          </div>
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

      {/* 4. Golden Ratio & Quick Method Ratios Educational Callout Box */}
      {isCoffee ? (
        <div className="mt-6 space-y-4">
          {/* Preset Method Ratio Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-black/40 p-3 rounded-2xl border border-white/[0.08]">
            <span className="text-xs font-mono font-bold text-amber-gold uppercase tracking-wider mr-2">Quick Ratios:</span>
            <button
              onClick={() => setCustomRatio(16)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${currentRatio === 16 ? 'bg-amber-gold text-espresso-950 shadow-md' : 'bg-white/[0.06] text-stone-300 hover:bg-white/10'}`}
            >
              Pour Over (1:16)
            </button>
            <button
              onClick={() => setCustomRatio(15)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${currentRatio === 15 ? 'bg-amber-gold text-espresso-950 shadow-md' : 'bg-white/[0.06] text-stone-300 hover:bg-white/10'}`}
            >
              French Press (1:15)
            </button>
            <button
              onClick={() => setCustomRatio(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${currentRatio === 2 ? 'bg-amber-gold text-espresso-950 shadow-md' : 'bg-white/[0.06] text-stone-300 hover:bg-white/10'}`}
            >
              Espresso (1:2)
            </button>
            <button
              onClick={() => setCustomRatio(8)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${currentRatio === 8 ? 'bg-amber-gold text-espresso-950 shadow-md' : 'bg-white/[0.06] text-stone-300 hover:bg-white/10'}`}
            >
              Cold Brew (1:8)
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-[#181412]/90 border border-amber-gold/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

          {/* Contextual Amazon Affiliate Recommendation Box */}
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-stone-300">
              <Scale className="w-4 h-4 text-amber-gold flex-shrink-0" />
              <span>To achieve 0.1g extraction accuracy, a digital scale with auto-timer is essential.</span>
            </div>
            <a
              href="https://www.amazon.com/s?k=Mini+Precision+Digital+Gram+Scale+0.01g+Accuracy&tag=thebrewapp13-20"
              target="_blank"
              rel="nofollow sponsored noopener"
              data-product-name="Mini Precision Digital Scale 0.01g"
              data-link-id="pocket_gram_scale"
              data-context="ratio_calculator"
              className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-gold hover:bg-amber-400/30 border border-amber-400/40 font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0"
            >
              Check Scale on Amazon ↗
            </a>
          </div>
        </div>
      ) : (
        /* Tea Steeping Ratios & Contextual Kettle Affiliate Callout */
        <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-sage-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-stone-300">
            <Thermometer className="w-4 h-4 text-sage-300 flex-shrink-0" />
            <span>Tea extraction relies on variable water temperature control (160°F - 212°F).</span>
          </div>
          <a
            href="https://www.amazon.com/s?k=Fellow+Stagg+EKG+Electric+Gooseneck+Kettle&tag=thebrewapp13-20"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-product-name="Fellow Stagg EKG Gooseneck Kettle"
            data-link-id="fellow_stagg_ekg"
            data-context="tea_ratio_calculator"
            className="px-4 py-2 rounded-xl bg-sage-500/20 text-sage-300 hover:bg-sage-500/30 border border-sage-500/40 font-extrabold text-[11px] uppercase tracking-wider transition-all whitespace-nowrap flex-shrink-0"
          >
            Check Kettle on Amazon ↗
          </a>
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

      {/* 1-Cup V60 / Pour Over Pro Tip Masterclass Modal */}
      <V60ProTipModal
        isOpen={isProTipOpen}
        onClose={() => setIsProTipOpen(false)}
      />

    </div>
  );
}
