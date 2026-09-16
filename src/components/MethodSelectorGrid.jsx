import React from 'react';
import { Thermometer, Clock, CheckCircle2, ChevronRight, Sparkles, Coffee, Gauge } from 'lucide-react';
import { getAssetUrl } from '../utils/assetUrl';

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
    <div className="space-y-8 animate-fade-in">
      {/* Step Header: Warm and welcoming cafe atmosphere */}
      <div className="p-6 sm:p-8 md:p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EFE8] border border-[#ECE6DC] shadow-sm">
        {/* Transparent Background Image of Selected Brewer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            key={activeMethod?.id || 'default_hero'}
            src={getAssetUrl(activeMethod?.heroImage || '/pour_over_hero.jpg')}
            alt={activeMethod?.name || 'Selected Brewer'}
            className="w-full h-full object-cover object-center transform scale-105 filter saturate-105 contrast-100 transition-all duration-700 opacity-25 sm:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFFDF9]/88 via-[#FFFDF9]/78 to-[#FAF7F2]/72 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-sans font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Step 1 • Pick your brewer</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] leading-tight">
            How would you like to brew today?
          </h2>
          
          <p className="text-sm text-[#5C524B] leading-relaxed font-sans">
            Select your favorite method below. We'll automatically calculate the exact coffee dose, water volume, grind size, and step-by-step timer for your cup.
          </p>

          <div className="inline-flex items-center gap-2 pt-1 text-xs text-[#766A62] font-sans">
            <Coffee className="w-4 h-4 text-[#C88A4B]" />
            <span className="font-medium text-[#2A2421]">{methods?.length || 9} Easy Brewing Guides</span>
            <span className="text-[#DFD7CB]">•</span>
            <span>Tested for beginner & experienced coffee lovers</span>
          </div>
        </div>
      </div>

      {/* Grid of Extraction Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => {
          const isSelected = activeMethod?.id === method.id;
          const totalDurationStr = getTotalDurationString(method.phases);
          const tempStr = isMetric ? `${method.tempC}°C` : `${method.tempF}°F`;

          return (
            <button
              key={method.id}
              onClick={() => setActiveMethod(method)}
              className={`p-6 sm:p-7 rounded-2xl border text-left transition-all duration-300 relative flex flex-col justify-between group shadow-sm hover:shadow-md cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-[#FFFDF9] border-[#C88A4B] ring-2 ring-[#C88A4B]/25 text-[#14110F] -translate-y-1'
                  : 'bg-white border-[#ECE6DC] text-[#2A2421] hover:border-[#D69550] hover:bg-[#FAF7F2]'
              }`}
            >
              {/* Transparent background watermark of the method on selected card */}
              {isSelected && method.heroImage && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none rounded-2xl">
                  <img
                    src={getAssetUrl(method.heroImage)}
                    alt={method.name}
                    className="w-full h-full object-cover object-center opacity-30 filter saturate-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9]/90 via-[#FFFDF9]/70 to-transparent" />
                </div>
              )}

              {/* Method Card Header */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-[#C88A4B] text-white shadow-sm'
                      : 'bg-[#FAF7F2] text-[#A8622D] border border-[#ECE6DC] group-hover:border-[#D69550]'
                  }`}>
                    <Coffee className="w-5 h-5" />
                  </div>

                  {isSelected && (
                    <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold border flex items-center gap-1.5 bg-[#FAF0E6] text-[#A25A24] border-[#ECD4BD]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C88A4B]" />
                      <span>Selected</span>
                    </span>
                  )}
                </div>

                <h3 className="font-editorial text-2xl font-bold mb-2 text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                  {method.name}
                </h3>
                
                <p className="text-xs text-[#5C524B] leading-relaxed mb-5 font-sans">
                  {method.description}
                </p>
              </div>

              {/* Specs Row */}
              <div className={`relative z-10 pt-4 border-t ${isSelected ? 'border-[#ECD4BD]' : 'border-[#ECE6DC]'} space-y-2 text-xs font-sans`}>
                <div className="flex items-center justify-between">
                  <span className="text-[#766A62]">Ratio target:</span>
                  <span className="font-semibold text-[#14110F]">1 : {method.ratio}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#766A62]">Water temp:</span>
                  <span className="flex items-center gap-1 font-semibold text-[#14110F]">
                    <Thermometer className="w-3.5 h-3.5 text-[#C88A4B]" />
                    {tempStr}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#766A62]">Brew time:</span>
                  <span className="flex items-center gap-1 font-semibold text-[#14110F]">
                    <Clock className="w-3.5 h-3.5 text-[#C88A4B]" />
                    {totalDurationStr}
                  </span>
                </div>

                {method.grind && (
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#ECE6DC]">
                    <span className="text-[#766A62]">Grind size:</span>
                    <span className="flex items-center gap-1 font-semibold text-[#A8622D]">
                      <Gauge className="w-3.5 h-3.5" />
                      {method.grind}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Contextual Paper Filter Callout */}
      {(activeMethod?.id === 'pour_over' || activeMethod?.id === 'classic_pour_over' || activeMethod?.id === 'chemex') && (
        <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#ECD4BD] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[#5C524B] font-sans">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-[#C88A4B]" />
            <span>For clean, bright flavor, we recommend oxygen-cleansed paper filters (Hario V60 Size 02 or Chemex Bonded).</span>
          </div>
          <a
            href="https://www.amazon.com/dp/B001U7EOYA/?tag=thebrewapp13-20"
            target="_blank"
            rel="nofollow sponsored noopener"
            data-product-name="Hario V60 Paper Filters Size 02"
            data-link-id="hario_v60_filters"
            data-context="step1_method_filter_pick"
            className="px-4 py-2 rounded-xl border font-semibold text-xs transition-all whitespace-nowrap flex-shrink-0 bg-[#FAF0E6] text-[#A25A24] hover:bg-[#F3E2CF] border-[#ECD4BD] shadow-xs active:scale-95"
          >
            Check filters on Amazon ↗
          </a>
        </div>
      )}

      {/* Step Navigation Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#ECE6DC]">
        <div className="text-xs text-[#5C524B] font-sans">
          Selected brewer: <strong className="text-[#14110F] font-editorial font-bold text-base ml-1">{activeMethod?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="w-full sm:w-auto py-3 px-8 rounded-2xl font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-card hover:shadow-elevated active:scale-95 transition-all bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] cursor-pointer"
        >
          <span>Continue to Step 02: Coffee Selection</span>
          <ChevronRight className="w-4 h-4 text-[#E8AF72]" />
        </button>
      </div>
    </div>
  );
}
