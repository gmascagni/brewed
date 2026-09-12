import React, { useState, useRef, useEffect } from 'react';
import { 
  Coffee, 
  BookOpen, 
  Search, 
  User, 
  Newspaper, 
  ScanLine, 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Store, 
  Tv, 
  Briefcase, 
  ChevronDown, 
  Building2, 
  QrCode,
  Compass,
  Sparkles
} from 'lucide-react';
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
  onOpenCafePortal,
  onOpenRoasterInfo,
  onOpenRoasterShowcase,
  isRoasterShowcaseView = false,
  onOpenVideoAcademy,
  onOpenNews,
  onSelectView,
  currentView = 'discovery', // 'discovery' | 'brew_station' | 'roasters' | 'cafe_portal'
  isMuted = false,
  onToggleMute,
  currentUser 
}) {
  const [isPartnerMenuOpen, setIsPartnerMenuOpen] = useState(false);
  const partnerMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (partnerMenuRef.current && !partnerMenuRef.current.contains(event.target)) {
        setIsPartnerMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-40 px-4 lg:px-8 py-3 transition-colors duration-400 bg-white/95 backdrop-blur-md border-b border-[#ECE6DC] text-[#14110F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* 1. Left: Editorial Logo & Brand Title */}
        <div className="flex items-center space-x-3.5">
          <div 
            onClick={() => onSelectView && onSelectView('discovery')}
            className="cursor-pointer p-1.5 rounded-2xl transition-all duration-300 flex items-center justify-center bg-[#FAF7F2] border border-[#ECE6DC] shadow-xs hover:border-[#D69550]"
          >
            <BrandLogo size={34} />
          </div>
          <div>
            <h1 
              onClick={() => onSelectView && onSelectView('discovery')}
              className="font-editorial text-2xl font-bold tracking-tight text-[#14110F] flex items-center gap-2 cursor-pointer"
            >
              <span>TheBrew.App</span>
              <span className="whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border bg-[#FAF0E6] text-[#A25A24] border-[#ECD4BD] font-bold">
                Master
              </span>
            </h1>
            <p className="text-[11px] text-[#766A62] font-sans">Precision Specialty Coffee Guide</p>
          </div>
        </div>

        {/* 2. Center: Editorial Navigation Hierarchy */}
        <nav className="hidden md:flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-[#ECE6DC]">
          <button
            type="button"
            onClick={() => onSelectView && onSelectView('discovery')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all ${
              currentView === 'discovery' && !isRoasterShowcaseView
                ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                : 'text-[#766A62] hover:text-[#14110F]'
            }`}
          >
            Explore
          </button>

          <button
            type="button"
            onClick={() => onSelectView && onSelectView('brew_station')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all ${
              currentView === 'brew_station' && !isRoasterShowcaseView
                ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                : 'text-[#766A62] hover:text-[#14110F]'
            }`}
          >
            Brew Station
          </button>

          {onOpenRoasterShowcase && (
            <button
              type="button"
              onClick={onOpenRoasterShowcase}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all ${
                isRoasterShowcaseView
                  ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                  : 'text-[#766A62] hover:text-[#14110F]'
              }`}
              title="View Roaster Showcase & Dial-In Profiles (Methodical, Onyx, Black & White)"
            >
              <Store className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Roasters</span>
              {isRoasterShowcaseView && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse" />
              )}
            </button>
          )}

          {onOpenLocalCoffee && (
            <button
              type="button"
              onClick={onOpenLocalCoffee}
              className="px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold text-[#766A62] hover:text-[#14110F] transition-all"
            >
              Cafe Radar
            </button>
          )}
        </nav>

        {/* 3. Right: Utility Controls, Partner Portals, and Profile */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">

          {/* Shop Local Coffee Button (Preserves exact QA selector) */}
          {onOpenLocalCoffee && (
            <button
              onClick={onOpenLocalCoffee}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold font-sans shadow-xs hover:shadow-sm active:scale-95 transition-all bg-[#14110F] text-[#FAF7F2] hover:bg-[#2A2421]"
              title="Shop Local Coffee & Roasters"
            >
              <Coffee className="w-3.5 h-3.5 text-[#E8AF72]" />
              <span className="hidden sm:inline">Shop Local Coffee</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded-full font-mono font-bold">📍</span>
            </button>
          )}

          {/* Global Audible / Mute Sound Toggle Button */}
          {onToggleMute && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-mono font-bold transition-all active:scale-95 shadow-xs cursor-pointer border ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-[#EBF3ED] border-[#C8E0CD] text-[#2F663C] hover:bg-[#DDF0E2]'
              }`}
              title={isMuted ? "Audible Sound: MUTED (Click to Turn Sound ON)" : "Audible Sound: ON (Click to Mute)"}
              aria-label="Toggle Audible Sound"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                  <span className="font-mono text-xs">Audible: OFF</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#2F663C] flex-shrink-0 animate-pulse" />
                  <span className="font-mono text-xs">Audible: ON</span>
                </>
              )}
            </button>
          )}

          {/* Global Multi-Index Search Trigger */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#5C524B] hover:text-[#14110F] hover:border-[#D69550] transition-all active:scale-95 shadow-xs"
              title="Open Global Search (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* B2B Partner Portals Dropdown Hub */}
          <div className="relative z-50" ref={partnerMenuRef}>
            <button
              type="button"
              onClick={() => setIsPartnerMenuOpen(!isPartnerMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:text-[#14110F] hover:border-[#C88A4B] font-sans font-semibold text-xs shadow-xs transition-all active:scale-95"
              title="Open Partner Hub (Roaster & Cafe Portals)"
            >
              <Briefcase className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span className="hidden sm:inline">Partner Hub</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#766A62] transition-transform ${isPartnerMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPartnerMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-[#ECE6DC] shadow-2xl p-2.5 z-50 animate-fade-in space-y-1">
                <div className="px-3 py-1.5 border-b border-[#ECE6DC] mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766A62]">
                    B2B Operational Portals
                  </span>
                </div>

                {/* Roaster SaaS Portal Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPartnerMenuOpen(false);
                    if (onOpenRoasterPortal) onOpenRoasterPortal();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24] shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                      Roaster Portal
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      Manage lots, cupping scores, and packaging thermal labels.
                    </p>
                  </div>
                </button>

                {/* Cafe B2B Portal Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsPartnerMenuOpen(false);
                    if (onOpenCafePortal) onOpenCafePortal();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#EBF3ED] border border-[#C8E0CD] flex items-center justify-center text-[#2F663C] shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#2F663C] transition-colors">
                      Coffee Shop Portal
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      "On Bar Today" live menu switcher and cafe gear setup.
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Native Camera Barcode & QR Scanner Trigger */}
          {onOpenScanner && (
            <button
              onClick={onOpenScanner}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:bg-[#FFFFFF] font-sans font-semibold transition-all active:scale-95 shadow-xs"
              title="Scan Bean Bag Barcode or QR Code with Device Camera"
            >
              <ScanLine className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span className="hidden lg:inline">Scan Bag</span>
            </button>
          )}

          {/* Water Chemistry Lab Trigger */}
          {onOpenWaterLab && (
            <button
              onClick={onOpenWaterLab}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:bg-[#FFFFFF] font-sans font-semibold transition-all active:scale-95 shadow-xs"
              title="Open Coffee Water Chemistry Lab & Mineral Recipes"
            >
              <FlaskConical className="w-3.5 h-3.5 text-cyan-600" />
              <span className="hidden lg:inline">Water Lab</span>
            </button>
          )}

          {/* Master Recipe Vault Trigger */}
          {onOpenCommunity && (
            <button
              onClick={onOpenCommunity}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:bg-[#FFFFFF] font-sans font-semibold transition-all active:scale-95 shadow-xs"
              title="Open Master Recipe Vault & Custom Studio"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span className="hidden md:inline">Recipe Vault</span>
            </button>
          )}

          {/* Coffee Academy & Video Hub Trigger */}
          {onOpenVideoAcademy && (
            <button
              onClick={onOpenVideoAcademy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:bg-[#FFFFFF] font-sans font-semibold transition-all active:scale-95 shadow-xs"
              title="Open Coffee Academy & Video Masterclasses"
            >
              <Tv className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Academy</span>
            </button>
          )}

          {/* Brew News Trigger */}
          <button
            onClick={onOpenNews || (() => {
              window.dispatchEvent(new CustomEvent('open-world-news'));
              setTimeout(() => {
                const el = document.getElementById('world-news');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 60);
            })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:bg-[#FFFFFF] font-sans font-semibold transition-all active:scale-95 shadow-xs"
            title="Jump to Brew News"
          >
            <Newspaper className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span className="hidden sm:inline">Brew News</span>
          </button>

          {/* Tasting Journal Trigger */}
          {onOpenJournal && (
            <button
              onClick={onOpenJournal}
              className="p-2 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#5C524B] hover:text-[#14110F] hover:border-[#D69550] transition-all active:scale-95 shadow-xs"
              title="Open Tasting Journal"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* User Profile Avatar / Sign In Trigger */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center space-x-2 p-1 pl-1.5 pr-2.5 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] hover:border-[#C88A4B] transition-all shadow-xs group"
              title="Open Barista Profile Dashboard"
            >
              {currentUser.avatar && currentUser.avatar !== '/' ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-6 h-6 rounded-full object-cover border border-[#C88A4B]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#A25A24]" />
                </div>
              )}
              <span className="font-sans text-xs font-bold text-[#14110F] group-hover:text-[#A8622D] transition-colors hidden lg:inline max-w-[90px] truncate">
                {currentUser.displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl font-bold font-sans text-xs flex items-center space-x-1.5 transition-all shadow-xs active:scale-95 bg-[#14110F] text-[#FAF7F2] hover:bg-[#2A2421]"
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
