import React, { useState } from 'react';
import { CupSoda, Scale, Sliders, CheckCircle2, Sparkles, Thermometer, Clock, ChevronRight, ChevronLeft, Volume2, VolumeX, Lightbulb, Beer, Gauge } from 'lucide-react';
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
  const isBeer = trackMode === 'beer';
  const isMetric = unitSystem === 'metric';
  const isPourOver = activeMethod?.id === 'classic_pour_over' || activeMethod?.id === 'pour_over' || activeMethod?.id === 'chemex';
  const [isProTipOpen, setIsProTipOpen] = useState(false);

  // Math Calculations for Coffee & Tea
  const totalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
  const currentRatio = customRatio || activeMethod?.ratio || (isBeer ? 1.35 : isCoffee ? 15 : 50);
  const dryDoseGrams = totalWaterMl / currentRatio;

  // Conversion helpers for Imperial
  const totalWaterOz = (totalWaterMl / 29.5735).toFixed(1);
  const dryDoseOz = (dryDoseGrams / 28.3495).toFixed(2);

  const waterDisplay = isMetric ? `${totalWaterMl} mL` : `${totalWaterOz} fl oz`;
  const doseDisplay = isMetric ? `${dryDoseGrams.toFixed(1)} g` : `${dryDoseOz} oz (${dryDoseGrams.toFixed(1)}g)`;

  // Beer Math Calculations
  // Batch Size in Gallons or Liters
  const batchGallons = cupCount; // 1 to 6 gallons
  const batchLiters = (batchGallons * 3.78541).toFixed(1);
  const mashRatioQtLb = currentRatio; // e.g. 1.35 qt/lb
  // Grain Weight (lbs) ~ estimated 2.2 lbs per gallon for 1.055 OG
  const grainWeightLbs = (batchGallons * 2.2).toFixed(1);
  const grainWeightKg = (grainWeightLbs * 0.453592).toFixed(1);
  // Strike Water (Quarts) = Grain Weight * Mash Ratio
  const strikeWaterQt = (grainWeightLbs * mashRatioQtLb).toFixed(1);
  const strikeWaterGal = (strikeWaterQt / 4).toFixed(1);
  const strikeWaterLiters = (strikeWaterQt * 0.946353).toFixed(1);

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

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Header Card with Embedded Unit (oz/g) & Audio Preferences */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel-amber relative overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-gold" />
            <span>Step 02 of 04 • {isBeer ? 'Beer Mash & ABV Scaler' : 'Precision Scaler & Ratio Matrix'}</span>
          </div>

          {/* Embedded Preferences Control Bar: Imperial/Metric Unit Toggle & Audio */}
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
                  <span>Imperial ({isBeer ? 'Gal/lbs/°F' : 'oz/°F'})</span>
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
                  <span>Metric ({isBeer ? 'L/kg/°C' : 'g/mL/°C'})</span>
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
          {isBeer ? 'Craft Beer Mash Water & Grain Bill Scaler' : isCoffee ? 'Precision Coffee Ratio & Dose Scaler' : 'Precision Tea Infusion Scaler'}
        </h3>
        <p className="text-xs md:text-sm text-stone-300 mt-1.5 leading-relaxed font-normal">
          {isBeer
            ? 'Calculates total grain bill weight (lbs/kg), mash strike water volume (gallons/liters), and target serving parameters for homebrewing.'
            : isCoffee
            ? 'Calculates exact dry coffee ground weight (oz/g) and hot water volume (fl oz/mL). Adjust cup count, mug size, or fine-tune water volume directly below.'
            : 'Calculates exact tea leaf weight (oz/g) and hot water volume (fl oz/mL). Adjust cup count, mug size, or fine-tune water volume directly below.'}
        </p>

        {/* Horizontal Scroll Method Picker Quick Tabs */}
        <div className="mt-6 pt-5 border-t border-white/[0.08]">
          <label className="block text-[10px] uppercase font-mono tracking-[0.2em] font-extrabold text-amber-gold/90 mb-2.5">
            Switch Extraction Method / Beer Style:
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
                      ? isBeer
                        ? 'bg-amber-500 text-espresso-950 border-amber-500 font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : isCoffee
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

      {/* 2. Interactive Quantity & Size Stepper Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#0F0D0C]/80 p-6 md:p-8 rounded-3xl border border-white/[0.08] shadow-inner">
        
        {/* Cup / Batch Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <label className="text-xs uppercase tracking-[0.15em] font-mono font-extrabold text-stone-300 flex items-center gap-2">
              {isBeer ? <Beer className="w-4 h-4 text-amber-500" /> : <CupSoda className="w-4 h-4 text-amber-gold" />}
              <span>{isBeer ? `Batch Size (${batchGallons} Gal / ${batchLiters} L)` : `Target Serving (${cupCount} ${cupCount === 1 ? 'Cup' : 'Cups'})`}</span>
            </label>
            <span className="text-sm font-extrabold font-mono text-cream-light bg-amber-400/20 px-3.5 py-1 rounded-xl border border-amber-400/30 shadow">
              {isBeer ? `${batchGallons} Gal` : cupCount}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={cupCount}
            onChange={(e) => handleCupCountChange(parseInt(e.target.value))}
            className="w-full h-3 bg-[#1A1613] rounded-xl appearance-none cursor-pointer mb-3.5"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-mono font-medium">
            <span>{isBeer ? '1 Gal' : '1 Cup'}</span>
            <span>{isBeer ? '3 Gal' : '3 Cups'}</span>
            <span>{isBeer ? '5 Gal (Std)' : '5 Cups'}</span>
            <span>{isBeer ? '8 Gal' : '8 Cups'}</span>
            <span>{isBeer ? '10 Gal' : '10 Cups'}</span>
          </div>
        </div>

        {/* Mug Capacity Selector / Beer Serving Info */}
        {!isBeer ? (
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
        ) : (
          <div className="space-y-3">
            <label className="block text-xs uppercase tracking-[0.15em] font-mono font-extrabold text-amber-300 mb-1">
              Beer Style Parameters:
            </label>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-cream-light">
                <span className="text-[10px] text-amber-400 block uppercase font-bold">Target ABV Range</span>
                <span className="font-extrabold text-sm">{activeMethod?.abvRange || '5.5% - 7.5%'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-cream-light">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Bitterness Index</span>
                <span className="font-extrabold text-sm">{activeMethod?.ibuRange || '40 IBU'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-cream-light">
                <span className="text-[10px] text-yellow-400 block uppercase font-bold">SRM Color Index</span>
                <span className="font-extrabold text-sm">{activeMethod?.srmColor || '6 SRM'}</span>
              </div>
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cream-light">
                <span className="text-[10px] text-cyan-400 block uppercase font-bold">Glassware Pairing</span>
                <span className="font-extrabold text-sm">{activeMethod?.glassware || 'Nonic Pint'}</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. Output Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        
        {/* Grain Bill / Dry Dose Card */}
        <div className="p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border border-amber-gold/30 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono text-amber-gold mb-2.5">
              <span className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                <span>{isBeer ? 'Total Grain Bill Weight' : isCoffee ? 'Dry Coffee Grounds' : 'Tea Leaves'}</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">{isBeer ? 'Malt Weight' : 'Dose Weight'}</span>
            </div>

            <div className="text-4xl lg:text-5xl font-extrabold font-mono text-cream-light drop-shadow-md my-2">
              {isBeer ? (isMetric ? `${grainWeightKg} kg` : `${grainWeightLbs} lbs`) : doseDisplay}
            </div>
          </div>

          {/* Mash Ratio Slider */}
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[11px] text-stone-300 font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-gold" />
                <span>{isBeer ? `Mash Thickness Ratio: ${mashRatioQtLb} qt/lb` : `Extraction Ratio: 1 : ${currentRatio}`}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min={isBeer ? "1.00" : isCoffee ? "10" : "20"}
                max={isBeer ? "2.00" : isCoffee ? "20" : "70"}
                step={isBeer ? "0.05" : "1"}
                value={currentRatio}
                onChange={(e) => setCustomRatio(parseFloat(e.target.value))}
                className="w-full h-2.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Water Volume Output Card */}
        <div className="p-7 md:p-8 rounded-3xl bg-[#14110E]/90 border border-cyan-400/30 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.15em] font-mono text-cyan-400 mb-2.5">
              <span className="flex items-center gap-2">
                <CupSoda className="w-4 h-4" />
                <span>{isBeer ? 'Mash Strike Water Volume' : 'Total Hot Water'}</span>
              </span>
              <span className="text-[10px] font-mono opacity-80">Target Liquid</span>
            </div>

            <div className="text-4xl lg:text-5xl font-extrabold font-mono text-cream-light drop-shadow-md my-2">
              {isBeer ? (isMetric ? `${strikeWaterLiters} Liters` : `${strikeWaterGal} Gal (${strikeWaterQt} qt)`) : waterDisplay}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/[0.08] text-xs font-mono text-stone-300">
            <span className="text-cyan-300 font-bold">Mash Strike Temperature Target: </span>
            <span>{isMetric ? `${((activeMethod?.tempC || 66) + 4)}°C` : `${((activeMethod?.tempF || 151) + 8)}°F`} (Strike water heating offset)</span>
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
            className="py-4 px-9 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-2xl hover:scale-105 active:scale-95 transition-all"
          >
            <span>Step 03: {isBeer ? 'Malt & Hops' : 'Grind & Beans'}</span>
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
