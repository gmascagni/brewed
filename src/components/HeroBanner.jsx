import React from 'react';
import { Thermometer, Gauge, Sparkles, Droplets, HeartHandshake } from 'lucide-react';

export default function HeroBanner({ trackMode, activeMethod, unitSystem }) {
  const isCoffee = trackMode === 'coffee';
  const heroImage = activeMethod?.heroImage || (isCoffee ? './coffee_setup.jpg' : './tea_kettle.jpg');

  const isMetric = unitSystem === 'metric';
  const tempDisplay = isMetric 
    ? `${activeMethod?.tempC || 90}°C` 
    : `${activeMethod?.tempF || 194}°F`;

  return (
    <section className={`relative overflow-hidden rounded-3xl mb-10 transition-all duration-700 shadow-2xl border ${
      isCoffee ? 'glass-panel-amber border-amber-gold/30' : 'glass-panel-sage border-sage-500/35'
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
          isCoffee 
            ? 'bg-gradient-to-r from-espresso-950 via-espresso-950/85 to-transparent' 
            : 'bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent'
        }`} />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950 via-transparent to-transparent opacity-90" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 p-8 md:p-12 lg:p-14 max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-xl text-xs uppercase tracking-widest font-extrabold mb-4 text-cream-light border border-white/20 shadow-lg">
          <Sparkles className={`w-3.5 h-3.5 ${isCoffee ? 'text-amber-gold' : 'text-sage-300'}`} />
          <span>{isCoffee ? 'Method Specifications & Preferred Beans' : 'Method Specifications & Preferred Leaves'}</span>
        </div>

        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-extrabold text-cream-light tracking-wide mb-4 leading-tight drop-shadow-lg">
          {activeMethod?.name || 'Specialty Extraction'}
        </h2>

        <p className="text-sm md:text-base text-cream-soft/90 leading-relaxed mb-6 max-w-xl font-medium drop-shadow-md">
          {activeMethod?.description || 'Precision extraction guide and scaling parameters.'}
        </p>

        {/* Quick Specs Raised Glass Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          
          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl shadow-inner ${isCoffee ? 'bg-amber-gold/25 text-amber-gold border border-amber-gold/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'}`}>
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">Target Temp</div>
              <div className="text-base font-extrabold text-cream-light font-mono">{tempDisplay}</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl shadow-inner ${isCoffee ? 'bg-amber-gold/25 text-amber-gold border border-amber-gold/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'}`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">{isCoffee ? 'Grind Size' : 'Leaf Style'}</div>
              <div className="text-sm font-bold text-cream-light">{isCoffee ? (activeMethod?.grind || 'Medium-Fine') : (activeMethod?.leafGrade || 'Whole Leaf')}</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center space-x-3.5 col-span-2 sm:col-span-1 hover:-translate-y-1 transition-all duration-300">
            <div className={`p-3 rounded-xl shadow-inner ${isCoffee ? 'bg-amber-gold/25 text-amber-gold border border-amber-gold/30' : 'bg-sage-500/25 text-sage-300 border border-sage-500/30'}`}>
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-cream-soft/60 uppercase font-bold tracking-wider">Extraction Ratio</div>
              <div className="text-base font-extrabold text-cream-light font-mono">
                {isCoffee ? `1 : ${activeMethod?.ratio || 15}` : `1g / ${activeMethod?.ratio || 50}ml`}
              </div>
            </div>
          </div>

        </div>

        {/* PREFERRED COFFEE / TEA TYPES FOR THIS METHOD */}
        {activeMethod?.preferredCoffeeTypes && (
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-gold/30 shadow-xl backdrop-blur-md">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-amber-gold mb-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-gold" />
              <span>{isCoffee ? `Preferred Coffee Beans & Origins for ${activeMethod?.name}:` : `Preferred Tea Leaf Varieties for ${activeMethod?.name}:`}</span>
            </div>
            <p className="text-xs text-cream-soft/90 font-medium leading-relaxed">
              {activeMethod?.preferredCoffeeTypes}
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
