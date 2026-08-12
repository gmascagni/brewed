import React, { useState } from 'react';
import { Thermometer, Gauge, Sparkles, Droplets, HeartHandshake, Lightbulb } from 'lucide-react';
import V60ProTipModal from './V60ProTipModal';

export default function HeroBanner({ trackMode, activeMethod, unitSystem }) {
  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';
  const isBeer = trackMode === 'beer';
  const isPourOver = activeMethod?.id === 'pour_over' || activeMethod?.id === 'chemex' || activeMethod?.id === 'classic_pour_over';
  const [isProTipOpen, setIsProTipOpen] = useState(false);

  const heroImage = activeMethod?.heroImage || (isCoffee ? './coffee_setup.jpg' : isBeer ? './drip_brewer.jpg' : './tea_kettle.jpg');

  const isMetric = unitSystem === 'metric';
  const tempDisplay = isMetric 
    ? `${activeMethod?.tempC || 90}°C` 
    : `${activeMethod?.tempF || 194}°F`;

  return (
    <section className={`relative overflow-hidden rounded-3xl mb-10 transition-all duration-700 shadow-2xl border ${
      isBeer ? 'glass-panel-beer border-amber-500/35' : isCoffee ? 'glass-panel-coffee border-[#A66E38]/35' : 'glass-panel-tea border-sage-500/35'
    } group`}>
      {/* Dynamic Background Image inside Hero Container */}
      <div className="absolute inset-0 z-0">
        <img
          key={heroImage}
          src={heroImage}
          alt={activeMethod?.name || 'Brewing Method'}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.7] contrast-110 group-hover:scale-100 transition-transform duration-1000"
        />
        <div className={`absolute inset-0 ${
          isBeer
            ? 'bg-gradient-to-r from-[#171107] via-[#171107]/85 to-transparent'
            : isCoffee 
            ? 'bg-gradient-to-r from-[#140D09] via-[#140D09]/85 to-transparent' 
            : 'bg-gradient-to-r from-[#0B130E] via-[#0B130E]/85 to-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-transparent opacity-90" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-8 md:p-12 lg:p-14 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl text-xs uppercase tracking-widest font-extrabold text-cream-light border border-white/20 shadow-lg">
            <Sparkles className={`w-3.5 h-3.5 ${isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'}`} />
            <span>{isBeer ? 'Method Specifications & Craft Hop Bill' : isCoffee ? 'Method Specifications & Preferred Beans' : 'Method Specifications & Preferred Leaves'}</span>
          </div>

          {/* Pro Tip Button for Pour-Over */}
          {isPourOver && (
            <button
              onClick={() => setIsProTipOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full btn-tactile-coffee text-[#140C08] font-extrabold text-xs uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all animate-pulse"
              title="Open 1-Cup V60 Pro Tip Technique & Temperature Guide"
            >
              <Lightbulb className="w-3.5 h-3.5 fill-current text-[#140C08]" />
              <span>Pro Tip 💡</span>
            </button>
          )}
        </div>

        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold text-cream-light tracking-wide mb-4 leading-tight drop-shadow-lg flex items-center justify-between">
          <span>{activeMethod?.name || 'Specialty Extraction'}</span>
        </h2>

        <p className="text-sm md:text-base text-cream-soft/90 leading-relaxed mb-6 max-w-xl font-medium drop-shadow-md">
          {activeMethod?.description || 'Precision extraction guide and scaling parameters.'}
        </p>

        {/* Quick Specs Raised Glass Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          
          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl shadow-inner ${
              isBeer ? 'bg-amber-500/25 text-amber-300 border border-amber-400/30' : isCoffee ? 'bg-[#A66E38]/25 text-[#D2A06E] border border-[#A66E38]/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'
            }`}>
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">Target Temp</div>
              <div className="text-base font-extrabold text-cream-light font-mono">{tempDisplay}</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl shadow-inner ${
              isBeer ? 'bg-amber-500/25 text-amber-300 border border-amber-400/30' : isCoffee ? 'bg-[#A66E38]/25 text-[#D2A06E] border border-[#A66E38]/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'
            }`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">{isBeer ? 'IBU Bitterness' : isCoffee ? 'Grind Size' : 'Leaf Style'}</div>
              <div className="text-sm font-bold text-cream-light">{isBeer ? (activeMethod?.ibuRange || '50 IBU') : isCoffee ? (activeMethod?.grind || 'Medium-Fine') : (activeMethod?.leafGrade || 'Whole Leaf')}</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 hover:-translate-y-1 transition-all duration-300 col-span-2 sm:col-span-1">
            <div className={`p-3 rounded-xl shadow-inner ${
              isBeer ? 'bg-amber-500/25 text-amber-300 border border-amber-400/30' : isCoffee ? 'bg-[#A66E38]/25 text-[#D2A06E] border border-[#A66E38]/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'
            }`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">Ratio</div>
              <div className="text-base font-extrabold text-cream-light font-mono">{isBeer ? `${activeMethod?.ratio} qt/lb` : `1 : ${activeMethod?.ratio || 15}`}</div>
            </div>
          </div>

        </div>

      </div>

      {/* V60 Pro Tip Masterclass Modal Popup */}
      <V60ProTipModal
        isOpen={isProTipOpen}
        onClose={() => setIsProTipOpen(false)}
      />

    </section>
  );
}
