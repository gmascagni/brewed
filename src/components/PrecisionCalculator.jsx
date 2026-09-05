import React, { useState } from 'react';
import { CupSoda, Scale, Sliders, CheckCircle2, Sparkles, Thermometer, Clock, ChevronRight, ChevronLeft, Volume2, VolumeX, Lightbulb, Gauge, RotateCcw } from 'lucide-react';
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
  const isTea = trackMode === 'tea';
  const isMetric = unitSystem === 'metric';
  const isPourOver = activeMethod?.id === 'classic_pour_over' || activeMethod?.id === 'pour_over' || activeMethod?.id === 'chemex';
  const [isProTipOpen, setIsProTipOpen] = useState(false);

  // Math Calculations for Coffee & Tea
  const totalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
  const currentRatio = customRatio || activeMethod?.ratio || (isCoffee ? 15 : 50);
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
    if (customWaterMl !== null) setCustomWaterMl(null);
  };

  const handleCupMlChange = (ml) => {
    setCupMl(ml);
    if (customWaterMl !== null) setCustomWaterMl(null);
  };

  const handleAdjustWater = (deltaMl) => {
    const current = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
    const updated = Math.max(50, Math.min(3000, current + deltaMl));
    setCustomWaterMl(updated);
  };

  const handleWaterInputChange = (valStr) => {
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      if (isMetric) {
        setCustomWaterMl(Math.round(num));
      } else {
        setCustomWaterMl(Math.round(num * 29.5735));
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Card with Embedded Unit (oz/g) & Audio Preferences */}
      <div className={`p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl border transition-all duration-500 ${
        isCoffee ? 'glass-panel-coffee border-[#A66E38]/40' : 'glass-panel-tea border-sage-500/40'
      }`}>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className={`inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Step 02 of 04 • Precision Scaler & Ratio Matrix</span>
          </div>

          {/* Embedded Preferences Control Bar: Imperial/Metric Unit Toggle & Audio */}
          <div className="flex items-center space-x-2 text-xs font-mono font-bold">
            {isPourOver && (
              <button
                onClick={() => setIsProTipOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl btn-tactile-coffee text-[#140C08] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all animate-pulse"
                title="Open Pour Over Pro Tip Masterclass Guide"
              >
                <Lightbulb className="w-3.5 h-3.5 fill-current text-[#140C08]" />
                <span>Pro Tip 💡</span>
              </button>
            )}

            {setUnitSystem && (
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/15 text-xs font-mono font-bold shadow-md">
                <button
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg transition-all active:scale-95 ${
                    unitSystem === 'imperial'
                      ? isCoffee
                        ? 'btn-tactile-coffee text-[#140C08] font-extrabold shadow-sm scale-102'
                        : 'btn-tactile-tea text-white font-extrabold shadow-sm scale-102'
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
                      ? isCoffee
                        ? 'btn-tactile-coffee text-[#140C08] font-extrabold shadow-sm scale-102'
                        : 'btn-tactile-tea text-white font-extrabold shadow-sm scale-102'
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
                className="p-1.5 px-2.5 rounded-xl bg-black/60 border border-white/15 text-stone-200 hover:border-white/40 transition-all shadow-md active:scale-95"
                title={isMuted ? "Unmute Audio Alerts" : "Mute Audio Alerts"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className={`w-3.5 h-3.5 ${
                  isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
                }`} />}
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
          <label className={`block text-[10px] uppercase font-mono tracking-[0.2em] font-extrabold mb-2.5 ${
            isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
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
                        ? 'btn-tactile-coffee text-[#140C08] font-extrabold shadow-[0_0_15px_rgba(166,110,56,0.4)]'
                        : 'btn-tactile-tea text-white font-extrabold shadow-[0_0_15px_rgba(81,158,100,0.4)]'
                      : 'bg-black/40 text-stone-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-cream-light'
                  }`}
                >
                  {method.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive Quantity & Size Stepper Card */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 p-6 md:p-8 rounded-3xl border shadow-inner ${
        isCoffee ? 'bg-[#140E0A]/80 border-[#A66E38]/20' : 'bg-[#0B150F]/80 border-sage-500/20'
      }`}>
        
        {/* Cup Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <label className="text-xs uppercase tracking-[0.15em] font-mono font-extrabold text-stone-300 flex items-center gap-2">
              <CupSoda className={`w-4 h-4 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
              <span>Target Serving ({cupCount} {cupCount === 1 ? 'Cup' : 'Cups'})</span>
            </label>
            <span className={`text-sm font-extrabold font-mono text-cream-light px-3.5 py-1 rounded-xl border shadow ${
              isCoffee
                ? 'bg-[#A66E38]/20 border-[#A66E38]/30 text-[#D2A06E]'
                : 'bg-sage-500/20 border-sage-500/30 text-sage-300'
            }`}>
              {cupCount}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={cupCount}
            onChange={(e) => handleCupCountChange(parseInt(e.target.value))}
            className="w-full h-3 bg-black/60 rounded-xl appearance-none cursor-pointer mb-3.5"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-mono font-medium">
            <span>1 Cup</span>
            <span>3 Cups</span>
            <span>5 Cups</span>
            <span>8 Cups</span>
            <span>10 Cups</span>
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
                      ? 'bg-[#A66E38]/25 border-[#C48B56] text-[#D2A06E] font-extrabold shadow-[0_0_20px_rgba(166,110,56,0.2)]'
                      : 'bg-sage-500/25 border-sage-400 text-sage-300 font-extrabold shadow-[0_0_20px_rgba(81,158,100,0.2)]'
                    : 'bg-black/40 border-white/[0.08] text-stone-400 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                {vol.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Output Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        
        {/* Dry Dose Card */}
        <div className={`p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border shadow-2xl relative overflow-hidden group flex flex-col justify-between ${
          isCoffee ? 'border-[#A66E38]/40' : 'border-sage-500/40'
        }`}>
          <div>
            <div className={`flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono mb-2.5 ${
              isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
            }`}>
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

          {/* Ratio Slider */}
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium mb-2.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Sliders className={`w-3.5 h-3.5 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
                <span>Extraction Ratio: 1 : {currentRatio}</span>
              </span>

              {isCoffee && (currentRatio === 16 || currentRatio === 16.0) && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-mono font-extrabold uppercase tracking-wider flex items-center gap-1 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                  <span>SCA Golden Ratio (1:16) ⭐</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="range"
                min={isCoffee ? "10" : "20"}
                max={isCoffee ? "20" : "70"}
                step="1"
                value={currentRatio}
                onChange={(e) => setCustomRatio(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Quick Ratio Preset Pills Bar */}
            <div className="flex items-center space-x-2 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold mr-1 flex-shrink-0">Presets:</span>
              {isCoffee ? (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(15)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 ${
                      currentRatio === 15 ? 'bg-amber-gold/30 text-amber-gold border-amber-gold' : 'bg-black/40 text-stone-400 border-white/10 hover:text-cream-light'
                    }`}
                  >
                    1:15 (Intense)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(16)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 flex items-center gap-1 ${
                      currentRatio === 16 ? 'bg-amber-400 text-espresso-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                    }`}
                  >
                    <span>1:16 (Golden Ratio ⭐)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(17)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 ${
                      currentRatio === 17 ? 'bg-amber-gold/30 text-amber-gold border-amber-gold' : 'bg-black/40 text-stone-400 border-white/10 hover:text-cream-light'
                    }`}
                  >
                    1:17 (Mellow)
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(30)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 ${
                      currentRatio === 30 ? 'bg-sage-300 text-slate-950 border-sage-300' : 'bg-black/40 text-stone-400 border-white/10 hover:text-cream-light'
                    }`}
                  >
                    1:30 (Gongfu)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(50)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 ${
                      currentRatio === 50 ? 'bg-sage-300 text-slate-950 border-sage-300' : 'bg-black/40 text-stone-400 border-white/10 hover:text-cream-light'
                    }`}
                  >
                    1:50 (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomRatio(60)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold border transition-all flex-shrink-0 ${
                      currentRatio === 60 ? 'bg-sage-300 text-slate-950 border-sage-300' : 'bg-black/40 text-stone-400 border-white/10 hover:text-cream-light'
                    }`}
                  >
                    1:60 (Light)
                  </button>
                </>
              )}
            </div>

          </div>
        </div>

        {/* Water Volume Output Card */}
        <div className={`p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border shadow-2xl relative overflow-hidden group flex flex-col justify-between ${
          isCoffee ? 'border-[#A66E38]/40' : 'border-sage-500/40'
        }`}>
          <div>
            <div className={`flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono mb-2.5 ${
              isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
            }`}>
              <span className="flex items-center gap-2">
                <CupSoda className="w-4 h-4" />
                <span>Total Hot Water</span>
              </span>
              <div className="flex items-center gap-2">
                {customWaterMl !== null && (
                  <button
                    type="button"
                    onClick={() => setCustomWaterMl(null)}
                    className="flex items-center gap-1 text-[10px] font-mono text-amber-400 hover:text-amber-300 transition-colors"
                    title="Reset to cup calculations"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Cups</span>
                  </button>
                )}
                <span className="text-[10px] font-mono opacity-80">Target Liquid</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-3 my-2">
              <div className="text-4xl lg:text-5xl font-extrabold font-mono text-cream-light drop-shadow-md">
                {waterDisplay}
              </div>
              {customWaterMl !== null && (
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isCoffee ? 'bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/30' : 'bg-sage-500/20 text-sage-300 border-sage-500/30'
                }`}>
                  Custom Volume
                </span>
              )}
            </div>
          </div>

          {/* Water Fine-Tuning Controls */}
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium mb-2.5">
              <span className="flex items-center gap-1.5 font-bold">
                <Sliders className={`w-3.5 h-3.5 ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
                <span>Fine-Tune Volume:</span>
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {isMetric ? '±10 / ±50 mL' : '±0.5 / ±2 fl oz'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <button
                type="button"
                onClick={() => handleAdjustWater(isMetric ? -50 : -59)}
                className="py-1 px-2 rounded-lg bg-black/50 hover:bg-white/10 text-stone-300 border border-white/10 text-[10px] font-mono font-bold transition-all active:scale-95"
                title={isMetric ? "Decrease 50 mL" : "Decrease ~2 fl oz"}
              >
                {isMetric ? '-50' : '-2oz'}
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWater(isMetric ? -10 : -15)}
                className="py-1 px-2 rounded-lg bg-black/50 hover:bg-white/10 text-stone-300 border border-white/10 text-[10px] font-mono font-bold transition-all active:scale-95"
                title={isMetric ? "Decrease 10 mL" : "Decrease ~0.5 fl oz"}
              >
                {isMetric ? '-10' : '-0.5oz'}
              </button>

              <div className="flex-1 flex items-center bg-black/70 border border-white/15 rounded-lg px-2 py-1 focus-within:border-amber-gold/50">
                <input
                  type="number"
                  min="50"
                  max="3000"
                  step={isMetric ? "5" : "0.5"}
                  value={isMetric ? totalWaterMl : totalWaterOz}
                  onChange={(e) => handleWaterInputChange(e.target.value)}
                  className="w-full bg-transparent text-cream-light font-mono font-bold text-xs text-center focus:outline-none"
                  title="Directly enter target water volume"
                />
                <span className="text-[10px] font-mono text-stone-400 ml-1">
                  {isMetric ? 'mL' : 'oz'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleAdjustWater(isMetric ? 10 : 15)}
                className="py-1 px-2 rounded-lg bg-black/50 hover:bg-white/10 text-stone-300 border border-white/10 text-[10px] font-mono font-bold transition-all active:scale-95"
                title={isMetric ? "Increase 10 mL" : "Increase ~0.5 fl oz"}
              >
                {isMetric ? '+10' : '+0.5oz'}
              </button>
              <button
                type="button"
                onClick={() => handleAdjustWater(isMetric ? 50 : 59)}
                className="py-1 px-2 rounded-lg bg-black/50 hover:bg-white/10 text-stone-300 border border-white/10 text-[10px] font-mono font-bold transition-all active:scale-95"
                title={isMetric ? "Increase 50 mL" : "Increase ~2 fl oz"}
              >
                {isMetric ? '+50' : '+2oz'}
              </button>
            </div>

            <div className="pt-2 border-t border-white/[0.06] text-xs font-mono text-stone-300 flex items-center justify-between">
              <span className={`font-bold ${isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`}>
                Recommended Water Temp: 
              </span>
              <span> {isMetric ? `${activeMethod?.tempC || 93}°C` : `${activeMethod?.tempF || 200}°F`}</span>
            </div>
          </div>
        </div>

      </div>

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
            className={`py-4 px-9 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all ${
              isCoffee ? 'btn-tactile-coffee text-[#140C08]' : 'btn-tactile-tea text-white'
            }`}
          >
            <span>Step 03: Grind & Specs</span>
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
