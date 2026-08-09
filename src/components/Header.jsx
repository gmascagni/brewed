import React from 'react';
import { Coffee, Leaf, BookOpen, Search, User, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function Header({ trackMode, setTrackMode, onOpenJournal, onOpenSearch, onOpenProfile, onOpenCommunity, onOpenLocalCoffee, onOpenAuth, onOpenAdmin, isAdmin, currentUser }) {
  const isCoffee = trackMode === 'coffee';

  return (
    <div className="px-4 lg:px-8 py-2.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-2xl ${
            isCoffee 
              ? 'bg-amber-500/20 text-amber-gold border border-amber-400/40 shadow-[0_0_20px_rgba(212,140,70,0.2)]' 
              : 'bg-sage-500/20 text-sage-300 border border-sage-500/40 shadow-[0_0_20px_rgba(143,168,153,0.2)]'
          } transition-all duration-500`}>
            {isCoffee ? <Coffee className="w-5 h-5 animate-pulse" /> : <Leaf className="w-5 h-5 animate-pulse" />}
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider text-cream-light flex items-center gap-2">
              <span>The Brew App</span>
              <span className="whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
                Master
              </span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono">Precision Coffee & Tea Guide</p>
          </div>
        </div>

        {/* Center Track Mode Switcher: The Coffee Lab vs The Tea Room */}
        <div className="flex items-center p-1 rounded-2xl bg-[#14110E] border border-white/[0.12] text-xs font-bold shadow-inner">
          <button
            onClick={() => setTrackMode('coffee')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              isCoffee 
                ? 'btn-tactile-amber text-espresso-950 scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light'
            }`}
            title="Switch to The Coffee Lab"
          >
            <Coffee className="w-4 h-4" />
            <span>The Coffee Lab</span>
          </button>

          <button
            onClick={() => setTrackMode('tea')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              !isCoffee 
                ? 'btn-tactile-sage text-cream-light scale-102 shadow-lg' 
                : 'text-stone-400 hover:text-cream-light'
            }`}
            title="Switch to The Tea Room"
          >
            <Leaf className="w-4 h-4" />
            <span>The Tea Room</span>
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
              <MapPin className="w-4 h-4 text-espresso-950 animate-bounce" />
              <span className="hidden sm:inline uppercase tracking-wider text-[11px]">Shop Local Coffee 📍</span>
            </button>
          )}

          {/* Global Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-[#1A1613] border border-white/[0.12] text-stone-300 hover:border-amber-gold/60 hover:text-amber-gold shadow-md transition-all active:scale-95"
              title="Global Search"
            >
              <Search className="w-4 h-4 text-amber-gold" />
            </button>
          )}

          {/* Community Forum Trigger */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-gold font-bold hover:bg-amber-500/25 transition-all active:scale-95 shadow-md"
              title="Open Community Forum"
            >
              <Users className="w-4 h-4 text-amber-gold" />
              <span className="hidden sm:inline">Community 🌐</span>
            </button>
          )}

          {/* Brew Journal Button */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-stone-300 hover:border-amber-gold/50 hover:text-cream-light transition-all active:scale-95 shadow-md"
              title="Open Tasting Journal"
            >
              <BookOpen className="w-4 h-4 text-amber-gold" />
              <span className="hidden sm:inline font-bold">Journal</span>
            </button>
          )}

          {/* Profile / Account Badge */}
          {onOpenProfile && (
            <button
              onClick={currentUser ? onOpenProfile : onOpenAuth}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all active:scale-95 shadow-md border ${
                currentUser
                  ? 'bg-amber-gold/15 border-amber-gold/50 text-cream-light hover:bg-amber-gold/25'
                  : 'bg-amber-gold text-espresso-950 font-extrabold hover:bg-amber-gold/90'
              }`}
              title={currentUser ? `Profile: ${currentUser.displayName}` : 'Sign In / Join'}
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatar || './avatar_cartoon_female_barista.jpg'}
                    alt={currentUser.displayName}
                    className="w-5 h-5 rounded-full object-cover border border-amber-gold"
                  />
                  <span className="font-bold text-xs text-amber-gold truncate max-w-[100px] hidden sm:inline">
                    {currentUser.displayName}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-espresso-950" />
                  <span className="font-bold uppercase tracking-wider text-xs hidden sm:inline">Sign In</span>
                </>
              )}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
