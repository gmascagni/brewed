import React from 'react';
import { Coffee, Leaf, Beer, BookOpen, Search, User, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function Header({ trackMode, setTrackMode, onOpenJournal, onOpenSearch, onOpenProfile, onOpenCommunity, onOpenLocalCoffee, onOpenAuth, onOpenAdmin, isAdmin, currentUser }) {
  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';
  const isBeer = trackMode === 'beer';

  return (
    <div className="px-4 lg:px-8 py-2.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${
            isBeer
              ? 'bg-amber-600/20 text-amber-300 border border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
              : isCoffee 
              ? 'bg-amber-500/20 text-amber-gold border border-amber-400/40 shadow-[0_0_20px_rgba(212,140,70,0.2)]' 
              : 'bg-sage-500/20 text-sage-300 border border-sage-500/40 shadow-[0_0_20px_rgba(143,168,153,0.2)]'
          } transition-all duration-500`}>
            {isBeer ? <Beer className="w-5 h-5 animate-pulse" /> : isCoffee ? <Coffee className="w-5 h-5 animate-pulse" /> : <Leaf className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider text-cream-light flex items-center gap-2">
              <span>The Brew App</span>
              <span className="whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
                Master
              </span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono">Precision Coffee, Tea & Beer Guide</p>
          </div>
        </div>

        {/* Center 3-Track Switcher: The Coffee Lab vs The Tea Room vs The Craft Cellar */}
        <div className="flex items-center p-1 rounded-2xl bg-[#14110E] border border-white/[0.12] text-xs font-bold shadow-inner">
          <button
            onClick={() => setTrackMode('coffee')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
              isCoffee 
                ? 'btn-tactile-amber text-espresso-950 scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light'
            }`}
            title="Switch to The Coffee Lab"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Coffee</span>
          </button>

          <button
            onClick={() => setTrackMode('tea')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
              isTea 
                ? 'btn-tactile-sage text-cream-light scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light'
            }`}
            title="Switch to The Tea Room"
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Tea</span>
          </button>

          <button
            onClick={() => setTrackMode('beer')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all duration-300 ${
              isBeer 
                ? 'bg-amber-600 text-cream-light border border-amber-400/60 scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light'
            }`}
            title="Switch to The Craft Cellar (Beer)"
          >
            <Beer className="w-3.5 h-3.5" />
            <span>Beer</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2 text-xs">
          
          {/* Admin Console Button (Only visible for Admins) */}
          {onOpenAdmin && isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold hover:bg-rose-500/30 transition-all active:scale-95 shadow-md"
              title="Open Admin Control Console"
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span className="hidden xl:inline">Admin</span>
            </button>
          )}

          {/* Shop Local Coffee Finder Button with Brew-Inspired Logo */}
          {onOpenLocalCoffee && (
            <button
              onClick={onOpenLocalCoffee}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all"
              title="Shop Local Coffee • Locate Specialty Coffee Shops within 10 Miles"
            >
              <MapPin className="w-3.5 h-3.5 text-espresso-950" />
              <span className="hidden sm:inline">Shop Local Coffee</span>
              <span className="text-[10px] bg-espresso-950 text-amber-gold px-1.5 py-0.5 rounded-full font-mono font-bold">📍</span>
            </button>
          )}

          {/* Global Multi-Index Search Overlay Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-white/[0.08] text-stone-200 hover:text-amber-gold hover:bg-white/[0.15] transition-all border border-white/[0.12] active:scale-95 shadow-md"
              title="Open Global Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Community Hub Modal Trigger */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-900/40 border border-amber-500/30 text-amber-bright hover:bg-amber-800/60 font-mono font-bold transition-all active:scale-95 shadow-md"
              title="Open Community Hub (Recipes & Forums)"
            >
              <Users className="w-4 h-4 text-amber-gold" />
              <span className="hidden md:inline">Community</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </button>
          )}

          {/* Tasting Journal Button */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white/[0.08] border border-white/[0.12] text-cream-light font-mono font-bold hover:bg-white/[0.15] hover:border-amber-gold/50 transition-all active:scale-95 shadow-md"
              title="Open Personal Tasting Journal"
            >
              <BookOpen className="w-4 h-4 text-amber-gold" />
              <span className="hidden sm:inline">Journal</span>
            </button>
          )}

          {/* User Profile / Auth Dashboard Button */}
          <button
            onClick={currentUser ? onOpenProfile : onOpenAuth}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-mono font-bold transition-all active:scale-95 shadow-md border ${
              currentUser
                ? 'bg-amber-gold/20 text-amber-gold border-amber-gold/40 hover:bg-amber-gold/30'
                : 'btn-tactile-amber text-espresso-950'
            }`}
            title={currentUser ? `Logged in as ${currentUser.displayName}` : 'Sign In or Create Account'}
          >
            {currentUser?.avatar ? (
              <img src={currentUser.avatar} alt="Avatar" className="w-4 h-4 rounded-full object-cover border border-amber-gold" />
            ) : (
              <User className="w-4 h-4" />
            )}
            <span className="hidden sm:inline truncate max-w-[100px]">
              {currentUser ? currentUser.displayName.split(' ')[0] : 'Sign In'}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}
