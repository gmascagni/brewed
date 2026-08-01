import React from 'react';
import { Coffee, Leaf, Volume2, VolumeX, Scale, BookOpen } from 'lucide-react';

export default function Header({ trackMode, setTrackMode, unitSystem, setUnitSystem, isMuted, setIsMuted, onOpenJournal }) {
  const isCoffee = trackMode === 'coffee';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-[#0A0908]/90 border-b border-white/[0.08] shadow-2xl px-4 lg:px-8 py-3.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title with Metallic Accent */}
        <div className="flex items-center space-x-3.5">
          <div className={`p-3 rounded-2xl ${
            isCoffee 
              ? 'bg-amber-500/20 text-amber-gold border border-amber-400/40 shadow-[0_0_20px_rgba(212,140,70,0.2)]' 
              : 'bg-sage-500/20 text-sage-300 border border-sage-500/40 shadow-[0_0_20px_rgba(143,168,153,0.2)]'
          } transition-all duration-500`}>
            {isCoffee ? <Coffee className="w-6 h-6 animate-pulse" /> : <Leaf className="w-6 h-6 animate-pulse" />}
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold tracking-wide text-cream-light flex items-center gap-2 drop-shadow-md">
              The Brew App <span className="text-[10px] uppercase font-mono tracking-[0.2em] px-2.5 py-1 rounded-full bg-white/[0.08] text-cream-light border border-white/[0.12] shadow-inner">Extraction Master</span>
            </h1>
            <p className="text-xs text-stone-400 font-medium">Precision Specialty Coffee & Fine Tea at Home</p>
          </div>
        </div>

        {/* Center Track Mode Switcher */}
        <div className="flex items-center bg-[#14110E] p-1.5 rounded-2xl border border-white/[0.12] shadow-2xl backdrop-blur-xl relative">
          <button
            onClick={() => setTrackMode('coffee')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isCoffee
                ? 'btn-tactile-amber text-espresso-950 scale-105'
                : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.05]'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Coffee Track</span>
          </button>
          
          <button
            onClick={() => setTrackMode('tea')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              !isCoffee
                ? 'btn-tactile-sage text-cream-light scale-105'
                : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.05]'
            }`}
          >
            <Leaf className="w-4 h-4" />
            <span>Tea Track</span>
          </button>
        </div>

        {/* Right Action Bar (Brew Journal, Unit Toggle & Mute) */}
        <div className="flex items-center space-x-3">
          {/* Brew Journal Button */}
          <button
            onClick={onOpenJournal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-xs text-amber-gold font-extrabold hover:bg-amber-400/25 shadow-lg shadow-amber-gold/10 transition-all active:scale-95"
            title="Open Brew Journal & Tasting Log"
          >
            <BookOpen className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider hidden sm:inline">Brew Journal</span>
          </button>

          {/* Unit System Toggle */}
          <button
            onClick={() => setUnitSystem(unitSystem === 'metric' ? 'imperial' : 'metric')}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#1A1613] border border-white/[0.12] text-xs text-stone-300 hover:border-amber-gold/60 hover:text-cream-light shadow-lg transition-all active:scale-95"
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
                ? 'bg-red-500/20 text-red-400 border-red-500/40' 
                : 'bg-[#1A1613] text-cream-light border-white/[0.12] hover:border-amber-gold/60'
            }`}
            title={isMuted ? 'Unmute Phase Audio Chimes' : 'Mute Phase Audio Chimes'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
