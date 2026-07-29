import React from 'react';
import { Coffee, Leaf, Volume2, VolumeX, Scale, Sparkles } from 'lucide-react';

export default function Header({ trackMode, setTrackMode, unitSystem, setUnitSystem, isMuted, setIsMuted }) {
  const isCoffee = trackMode === 'coffee';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-espresso-950/85 border-b border-white/10 shadow-2xl px-4 lg:px-8 py-3.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title with Metallic Accent */}
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${
            isCoffee 
              ? 'bg-gradient-to-br from-amber-gold/30 to-amber-gold/10 text-amber-gold border border-amber-gold/40 shadow-lg shadow-amber-gold/20' 
              : 'bg-gradient-to-br from-sage-500/30 to-sage-500/10 text-sage-300 border border-sage-500/40 shadow-lg shadow-sage-500/20'
          } transition-all duration-500`}>
            {isCoffee ? <Coffee className="w-6 h-6 animate-pulse" /> : <Leaf className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wide text-cream-light flex items-center gap-2 drop-shadow-md">
              The Brew App <span className="text-[10px] uppercase tracking-widest font-sans px-2.5 py-1 rounded-full bg-white/10 text-cream-light border border-white/15 shadow-inner">Extraction Master</span>
            </h1>
            <p className="text-xs text-cream-soft/70 font-medium">Precision Specialty Coffee & Fine Tea at Home</p>
          </div>
        </div>

        {/* Center Track Mode Tactile Pill Switcher */}
        <div className="flex items-center bg-espresso-900/90 p-1.5 rounded-2xl border border-white/15 shadow-2xl backdrop-blur-xl relative">
          <button
            onClick={() => setTrackMode('coffee')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isCoffee
                ? 'btn-tactile-amber text-espresso-950 scale-105'
                : 'text-cream-soft/70 hover:text-cream-light hover:bg-white/5'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Coffee Track</span>
          </button>
          
          <button
            onClick={() => setTrackMode('tea')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              !isCoffee
                ? 'btn-tactile-sage text-cream-light scale-105'
                : 'text-cream-soft/70 hover:text-cream-light hover:bg-white/5'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Tea Track</span>
          </button>
        </div>

        {/* Right Settings (Metric/Imperial & Audio Mute with Metallic Raised Borders) */}
        <div className="flex items-center space-x-3">
          {/* Unit System Toggle */}
          <button
            onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/90 border border-white/15 text-xs text-cream-soft hover:border-amber-gold/60 shadow-lg hover:shadow-amber-gold/10 transition-all active:scale-95"
            title="Toggle Metric (grams/ml) vs Imperial (oz/fl oz)"
          >
            <Scale className="w-4 h-4 text-amber-gold" />
            <span className="font-bold uppercase tracking-wider">{unitSystem === 'imperial' ? 'Imperial (oz/°F)' : 'Metric (g/°C)'}</span>
          </button>

          {/* Audio Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border shadow-lg transition-all active:scale-95 ${
              isMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-red-500/10'
                : 'bg-slate-800/90 border-white/15 text-cream-soft hover:text-amber-gold hover:border-amber-gold/50'
            }`}
            title={isMuted ? 'Unmute Audio Chimes' : 'Mute Audio Chimes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
