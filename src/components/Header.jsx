import React from 'react';
import { Coffee, BookOpen, Search, User, Newspaper, ScanLine, FlaskConical, Volume2, VolumeX, Store, Tv } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Header({ 
  onOpenJournal, 
  onOpenSearch, 
  onOpenProfile, 
  onOpenCommunity, 
  onOpenLocalCoffee, 
  onOpenAuth, 
  onOpenScanner, 
  onOpenWaterLab,
  onOpenRoasterPortal,
  onOpenRoasterInfo,
  onOpenRoasterShowcase,
  isRoasterShowcaseView = false,
  onOpenVideoAcademy,
  onOpenNews,
  isMuted = false,
  onToggleMute,
  currentUser 
}) {
  return (
    <div className="px-4 lg:px-8 py-2.5 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-2xl transition-all duration-500 flex items-center justify-center bg-[#A66E38]/20 border border-[#A66E38]/40 shadow-[0_0_20px_rgba(166,110,56,0.35)]">
            <BrandLogo size={36} />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wider text-cream-light flex items-center gap-2">
              <span>TheBrew.App</span>
              <span className="whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/40">
                Master
              </span>
            </h1>
            <p className="text-[10px] text-stone-400 font-mono">Precision Specialty Coffee Guide</p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">

          {/* Shop Local Coffee Button */}
          {onOpenLocalCoffee && (
            <button
              onClick={onOpenLocalCoffee}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all btn-tactile-coffee text-[#140C08]"
              title="Shop Local Coffee & Roasters"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shop Local Coffee</span>
              <span className="text-[10px] bg-black/40 text-current px-1.5 py-0.5 rounded-full font-mono font-bold">📍</span>
            </button>
          )}

          {/* Global Audible / Mute Sound Toggle Button */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl font-mono font-bold transition-all active:scale-95 shadow-md cursor-pointer border ${
                isMuted
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                  : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
              }`}
              title={isMuted ? "Audible Sound: MUTED (Click to Turn Sound ON)" : "Audible Sound: ON (Click to Mute)"}
              aria-label="Toggle Audible Sound"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="font-mono text-xs">Audible: OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 animate-pulse" />
                  <span className="font-mono text-xs">Audible: ON</span>
                </>
              )}
            </button>
          )}

          {/* Global Multi-Index Search Overlay Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-stone-200 hover:text-[#D2A06E] hover:border-[#A66E38]/50 transition-all active:scale-95 shadow-md"
              title="Open Global Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Master Recipe Vault Trigger */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border bg-[#2A1C12]/50 border-[#A66E38]/40 text-[#D2A06E] hover:bg-[#38261A]/60 font-mono font-bold transition-all active:scale-95 shadow-md"
              title="Open Master Recipe Vault & Custom Studio"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Recipe Vault</span>
            </button>
          )}

          {/* Native Camera Barcode & QR Scanner Trigger */}
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border bg-[#2A1C12]/50 border-amber-gold/40 text-amber-gold hover:bg-[#38261A]/60 font-mono font-bold transition-all active:scale-95 shadow-md"
              title="Scan Bean Bag Barcode or QR Code with Device Camera"
            >
              <ScanLine className="w-4 h-4 text-amber-gold" />
              <span className="hidden lg:inline">Scan Bag</span>
            </button>
          )}

          {/* Water Chemistry Lab Trigger */}
          {onOpenWaterLab && (
            <button
              onClick={onOpenWaterLab}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border bg-[#2A1C12]/50 border-cyan-500/40 text-cyan-300 hover:bg-[#38261A]/60 font-mono font-bold transition-all active:scale-95 shadow-md"
              title="Open Coffee Water Chemistry Lab & Mineral Recipes"
            >
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">Water Lab</span>
            </button>
          )}

          {/* Coffee Academy & Video Hub Trigger */}
          {onOpenVideoAcademy && (
            <button
              onClick={onOpenVideoAcademy}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border bg-[#2A1C12]/50 border-red-500/40 text-red-300 hover:bg-[#38261A]/60 font-mono font-bold transition-all active:scale-95 shadow-md"
              title="Open Coffee Academy & Video Masterclasses"
            >
              <Tv className="w-4 h-4 text-red-400" />
              <span className="hidden sm:inline">Academy</span>
            </button>
          )}

          {/* Specialty Roaster Showcase Trigger */}
          {onOpenRoasterShowcase && (
            <button
              onClick={onOpenRoasterShowcase}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border font-mono font-bold transition-all active:scale-95 shadow-md ${
                isRoasterShowcaseView
                  ? 'bg-amber-gold text-espresso-950 border-amber-gold shadow-amber-500/30 ring-2 ring-amber-gold/50'
                  : 'bg-[#2A1C12]/50 border-amber-gold/40 text-amber-gold hover:bg-[#38261A]/60'
              }`}
              title={isRoasterShowcaseView ? "You are viewing the Roaster Showcase (Click to scroll to top)" : "View Roaster Showcase & Dial-In Profiles (Methodical, Onyx, Black & White)"}
            >
              <Store className={`w-4 h-4 ${isRoasterShowcaseView ? 'text-espresso-950' : 'text-amber-gold'}`} />
              <span className="hidden sm:inline">Roasters</span>
              {isRoasterShowcaseView && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
              )}
            </button>
          )}

          {/* Brew News Dispatch Trigger */}
          <button
            onClick={onOpenNews || (() => {
              window.dispatchEvent(new CustomEvent('open-world-news'));
              setTimeout(() => {
                const el = document.getElementById('world-news');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }, 60);
            })}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl border bg-[#2A1C12]/50 border-[#A66E38]/40 text-[#D2A06E] hover:bg-[#38261A]/60 font-mono font-bold transition-all active:scale-95 shadow-md"
            title="Jump to Brew News"
          >
            <Newspaper className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Brew News</span>
          </button>

          {/* Brew Journal Trigger */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="p-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-stone-200 hover:text-[#D2A06E] hover:border-[#A66E38]/50 transition-all active:scale-95 shadow-md"
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
              {currentUser.avatar && currentUser.avatar !== '/' ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-6 h-6 rounded-full object-cover border border-amber-gold"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-gold flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-amber-gold" />
                </div>
              )}
              <span className="font-mono text-[11px] font-bold text-cream-light group-hover:text-amber-gold transition-colors hidden lg:inline max-w-[90px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-2 rounded-xl font-bold font-mono text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md active:scale-95 btn-tactile-coffee text-[#140C08]"
              title="Barista Profile & Backup"
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
