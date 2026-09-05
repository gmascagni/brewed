import React from 'react';
import { Coffee, Leaf, BookOpen, Search, User, Users, MapPin } from 'lucide-react';

export default function Header({ trackMode, setTrackMode, onOpenJournal, onOpenSearch, onOpenProfile, onOpenCommunity, onOpenLocalCoffee, onOpenAuth, currentUser }) {
  const isCoffee = trackMode === 'coffee';

  return (
    <div className="px-4 lg:px-8 py-2.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl transition-all duration-500 ${
            isCoffee 
              ? 'bg-[#A66E38]/25 text-[#D2A06E] border border-[#A66E38]/40 shadow-[0_0_20px_rgba(166,110,56,0.3)]' 
              : 'bg-sage-500/25 text-sage-300 border border-sage-500/40 shadow-[0_0_20px_rgba(94,150,106,0.3)]'
          }`}>
            {isCoffee ? <Coffee className="w-5 h-5 animate-pulse" /> : <Leaf className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider text-cream-light flex items-center gap-2">
              <span>The Brew App</span>
              <span className={`whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border transition-colors ${
                isCoffee
                  ? 'bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/40'
                  : 'bg-sage-500/20 text-sage-300 border-sage-500/40'
              }`}>
                Master
              </span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono">Precision Coffee & Tea Guide</p>
          </div>
        </div>

        {/* Center 2-Track Switcher: Coffee (Brown) vs Tea (Green) */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#14110E] border border-white/[0.12] text-xs font-bold shadow-inner gap-1">
          <button
            onClick={() => setTrackMode('coffee')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all duration-300 ${
              isCoffee 
                ? 'btn-tactile-coffee text-[#140C08] font-extrabold scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.05]'
            }`}
            title="Switch to The Coffee Lab"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Coffee</span>
          </button>

          <button
            onClick={() => setTrackMode('tea')}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl transition-all duration-300 ${
              !isCoffee 
                ? 'btn-tactile-tea text-white font-extrabold scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.05]'
            }`}
            title="Switch to The Tea Room"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Tea</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 text-xs">

          {/* Shop Local Button Dynamic for Coffee vs Tea */}
          {onOpenLocalCoffee && (
            <button
              onClick={onOpenLocalCoffee}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all ${
                isCoffee
                  ? 'btn-tactile-coffee text-[#140C08]'
                  : 'btn-tactile-tea text-white'
              }`}
              title={isCoffee ? 'Shop Local Coffee & Roasters' : 'Shop Local Tea & Specialty Tea Houses'}
            >
              {isCoffee ? <Coffee className="w-3.5 h-3.5" /> : <Leaf className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">
                {isCoffee ? 'Shop Local Coffee' : 'Shop Local Tea'}
              </span>
              <span className="text-[10px] bg-black/40 text-current px-1.5 py-0.5 rounded-full font-mono font-bold">📍</span>
            </button>
          )}

          {/* Global Multi-Index Search Overlay Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className={`p-2.5 rounded-xl bg-white/[0.08] border transition-all active:scale-95 shadow-md ${
                isCoffee
                  ? 'text-stone-200 hover:text-[#D2A06E] hover:border-[#A66E38]/50 border-white/[0.12]'
                  : 'text-stone-200 hover:text-sage-300 hover:border-sage-500/50 border-white/[0.12]'
              }`}
              title="Open Global Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Community Hub Trigger */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border font-mono font-bold transition-all active:scale-95 shadow-md ${
                isCoffee
                  ? 'bg-[#2A1C12]/50 border-[#A66E38]/40 text-[#D2A06E] hover:bg-[#38261A]/60'
                  : 'bg-emerald-950/50 border-sage-500/40 text-sage-300 hover:bg-emerald-900/60'
              }`}
              title="Open Community Hub (Recipes & Forums)"
            >
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Community</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>
          )}

          {/* Brew Journal Trigger */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className={`p-2.5 rounded-xl bg-white/[0.08] border transition-all active:scale-95 shadow-md ${
                isCoffee
                  ? 'text-stone-200 hover:text-[#D2A06E] hover:border-[#A66E38]/50 border-white/[0.12]'
                  : 'text-stone-200 hover:text-sage-300 hover:border-sage-500/50 border-white/[0.12]'
              }`}
              title="Open Tasting Journal"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Avatar / Sign In Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] hover:border-amber-gold/50 transition-all shadow-md group"
              title="Open Barista Profile Dashboard"
            >
              <img
                src={currentUser.avatar || '/'}
                alt={currentUser.displayName}
                className="w-6 h-6 rounded-full object-cover border border-amber-gold"
              />
              <span className="font-mono text-[11px] font-bold text-cream-light group-hover:text-amber-gold transition-colors hidden lg:inline max-w-[90px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className={`px-3 py-2 rounded-xl font-bold font-mono text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md active:scale-95 ${
                isCoffee
                  ? 'btn-tactile-coffee text-[#140C08]'
                  : 'btn-tactile-tea text-white'
              }`}
              title="Sign In or Create Account"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
