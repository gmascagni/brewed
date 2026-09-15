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
  Sparkles,
  GraduationCap,
  SlidersHorizontal,
  Layers,
  Wrench
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
  onOpenMobileTools,
  isRoasterShowcaseView = false,
  isShopsView = false,
  onOpenVideoAcademy,
  onOpenNews,
  onSelectView,
  currentView = 'discovery', // 'discovery' | 'brew_station' | 'roasters' | 'cafe_portal' | 'learn' | 'recipes' | 'shops'
  isMuted = false,
  onToggleMute,
  currentUser 
}) {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target)) {
        setIsToolsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-40 px-3 sm:px-6 lg:px-8 py-2.5 transition-colors duration-400 bg-white/95 backdrop-blur-md border-b border-[#ECE6DC] text-[#14110F]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
        
        {/* 1. Left: Editorial Logo & Brand Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => onSelectView && onSelectView('discovery')}
              className="cursor-pointer p-1.5 rounded-2xl transition-all duration-300 flex items-center justify-center bg-[#FAF7F2] border border-[#ECE6DC] shadow-xs hover:border-[#D69550]"
            >
              <BrandLogo size={32} />
            </div>
            <div>
              <h1 
                onClick={() => onSelectView && onSelectView('discovery')}
                className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-[#14110F] flex items-center gap-1.5 cursor-pointer"
              >
                <span>TheBrew.App</span>
                <span className="whitespace-nowrap text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border bg-[#FAF0E6] text-[#A25A24] border-[#ECD4BD] font-bold">
                  Master
                </span>
              </h1>
              <p className="text-[10.5px] text-[#766A62] font-sans">Precision Specialty Coffee Guide</p>
            </div>
          </div>

          {/* Mobile Tools Menu Toggle & Quick Brew */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              type="button"
              onClick={() => onSelectView && onSelectView('brew')}
              className="px-2.5 py-1.5 rounded-xl bg-[#14110F] text-white flex items-center gap-1 text-xs font-bold font-sans mobile-touch-target shadow-xs"
              title="Start a Brew"
            >
              <Coffee className="w-3.5 h-3.5 text-[#E8AF72]" />
              <span className="text-[11px]">Brew</span>
            </button>
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#5C524B] mobile-touch-target flex items-center justify-center"
                title="Open Global Search (Ctrl + K)"
                aria-label="Open Global Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (onOpenMobileTools) {
                  onOpenMobileTools();
                } else {
                  setIsToolsMenuOpen(!isToolsMenuOpen);
                }
              }}
              className="p-2 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] text-[#14110F] flex items-center justify-center gap-1 text-xs font-bold font-sans mobile-touch-target"
              title="Open Barista Tools & Settings"
              aria-label="Open Barista Tools Menu"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C88A4B]" />
            </button>
          </div>
        </div>

        {/* 2. Center: 5 PRIMARY NAVIGATION AREAS (BREW | DISCOVER | CAFÉS | LEARN | MY COFFEE) */}
        {(() => {
          const isBrewActive = currentView === 'brew' || currentView === 'brew_station' || (!['discover', 'roasters', 'cafes', 'shops', 'learn', 'my_coffee', 'recipes'].includes(currentView) && !isRoasterShowcaseView && !isShopsView);
          const isDiscoverActive = currentView === 'discover' || currentView === 'roasters' || isRoasterShowcaseView;
          const isCafesActive = currentView === 'cafes' || currentView === 'shops' || isShopsView;
          const isLearnActive = currentView === 'learn';
          const isMyCoffeeActive = currentView === 'my_coffee' || currentView === 'recipes';

          return (
            <nav className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-[#ECE6DC] w-full md:w-auto justify-center overflow-x-auto">
              
              {/* Primary 1: BREW */}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('brew')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isBrewActive
                    ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                    : 'text-[#766A62] hover:text-[#14110F]'
                }`}
                title="Guided Coffee Brewing Atelier & Timer"
              >
                <span>Brew</span>
                {isBrewActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse inline-block shrink-0" />
                )}
              </button>

              {/* Primary 2: DISCOVER */}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('discover')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isDiscoverActive
                    ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                    : 'text-[#766A62] hover:text-[#14110F]'
                }`}
                title="Discover Specialty Coffees, Artisan Roasters & Smart Bags"
              >
                <Compass className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span>Discover</span>
                {isDiscoverActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse inline-block shrink-0" />
                )}
              </button>

              {/* Primary 3: CAFÉS */}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('cafes')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isCafesActive
                    ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                    : 'text-[#766A62] hover:text-[#14110F]'
                }`}
                title="Find Specialty Coffee Shops & Roasters Near You"
              >
                <Store className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span>Cafés</span>
                {isCafesActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse inline-block shrink-0" />
                )}
              </button>

              {/* Primary 4: LEARN */}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('learn')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isLearnActive
                    ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                    : 'text-[#766A62] hover:text-[#14110F]'
                }`}
                title="Specialty Coffee Video Academy, Extraction Science & World News"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span>Learn</span>
                {isLearnActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse inline-block shrink-0" />
                )}
              </button>

              {/* Primary 5: MY COFFEE */}
              <button
                type="button"
                onClick={() => onSelectView && onSelectView('my_coffee')}
                className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isMyCoffeeActive
                    ? 'bg-white text-[#14110F] shadow-xs border border-[#ECE6DC]'
                    : 'text-[#766A62] hover:text-[#14110F]'
                }`}
                title="Tasting Journal, Recipe Vault & Personal Studio"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#C88A4B]" />
                <span>My Coffee</span>
                {isMyCoffeeActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2F663C] animate-pulse inline-block shrink-0" />
                )}
              </button>
            </nav>
          );
        })()}

        {/* 3. Right: Utility Controls & Consolidated Secondary Menu */}
        <div className="hidden md:flex items-center gap-2 text-xs">

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

          {/* Global Primary Action: START A BREW */}
          <button
            type="button"
            onClick={() => onSelectView && onSelectView('brew')}
            className="px-3.5 py-1.5 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white font-sans font-bold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95 group"
            title="Start a Guided Coffee Brew"
          >
            <Coffee className="w-3.5 h-3.5 text-[#E8AF72] group-hover:scale-110 transition-transform" />
            <span>Start a Brew</span>
          </button>

          {/* Consolidated Secondary Dropdown Menu ("Tools & Barista") */}
          <div className="relative z-50" ref={toolsMenuRef}>
            <button
              type="button"
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ECE6DC] bg-[#FAF7F2] text-[#2A2421] hover:text-[#14110F] hover:border-[#C88A4B] font-sans font-semibold text-xs shadow-xs transition-all active:scale-95"
              title="Open Secondary Tools & Barista Menu"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>Tools</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#766A62] transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Container (Always in DOM with transition for instantaneous accessibility & testing) */}
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-[#ECE6DC] shadow-2xl p-2.5 z-50 transition-all duration-200 space-y-1 ${
              isToolsMenuOpen 
                ? 'opacity-100 scale-100 pointer-events-auto' 
                : 'opacity-0 scale-95 pointer-events-none hidden'
            }`}>
              
              {/* Section Header: Tools & Utilities */}
              <div className="px-3 py-1.5 border-b border-[#ECE6DC] mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766A62]">
                  Barista Tools & Utility Suite
                </span>
                <span className="text-[10px] font-mono font-bold text-[#A25A24] bg-[#FAF0E6] px-1.5 py-0.5 rounded">
                  Free
                </span>
              </div>

              {/* 1. Scan Bag Barcode Scanner */}
              {onOpenScanner && (
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsMenuOpen(false);
                    onOpenScanner();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                  title="Scan Bean Bag Barcode or QR Code with Device Camera"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-[#C88A4B] shrink-0 mt-0.5">
                    <ScanLine className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                      Scan Bag
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      Camera barcode & QR scanner with instant 1-click recipe dial-in.
                    </p>
                  </div>
                </button>
              )}

              {/* 2. Water Chemistry Lab */}
              {onOpenWaterLab && (
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsMenuOpen(false);
                    onOpenWaterLab();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                  title="Open Coffee Water Chemistry Lab & Mineral Recipes"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-cyan-600 shrink-0 mt-0.5">
                    <FlaskConical className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                      Water Lab
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      SCA hardness (GH/KH) mineral calculator & recipe builder.
                    </p>
                  </div>
                </button>
              )}

              {/* 3. Video Academy */}
              {onOpenVideoAcademy && (
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsMenuOpen(false);
                    onOpenVideoAcademy();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                  title="Open Coffee Academy & Video Masterclasses"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                    <Tv className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                      Academy
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      Masterclass video library by world champion baristas.
                    </p>
                  </div>
                </button>
              )}

              {/* 4. Tasting Journal */}
              {onOpenJournal && (
                <button
                  type="button"
                  onClick={() => {
                    setIsToolsMenuOpen(false);
                    onOpenJournal();
                  }}
                  className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                  title="Open Tasting Journal"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-[#C88A4B] shrink-0 mt-0.5">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                      Tasting Journal
                    </h4>
                    <p className="text-[11px] text-[#766A62]">
                      Log sensory notes, brew specs, and favorite roasts.
                    </p>
                  </div>
                </button>
              )}

              {/* 5. Brew News */}
              <button
                type="button"
                onClick={() => {
                  setIsToolsMenuOpen(false);
                  if (onOpenNews) onOpenNews();
                }}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                title="Brew News"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-[#C88A4B] shrink-0 mt-0.5">
                  <Newspaper className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                    Brew News
                  </h4>
                  <p className="text-[11px] text-[#766A62]">
                    Curated RSS dispatch from Daily Coffee News and Sprudge.
                  </p>
                </div>
              </button>

              {/* B2B Partner Portals Section Header */}
              <div className="px-3 py-1.5 border-t border-b border-[#ECE6DC] mt-2 mb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#766A62]">
                  B2B Partner Hub (Large Free Tier)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#2F663C] bg-[#EBF3ED] px-1.5 py-0.5 rounded">
                  Free
                </span>
              </div>

              {/* Roaster SaaS Portal Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsToolsMenuOpen(false);
                  if (onOpenRoasterPortal) onOpenRoasterPortal();
                }}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                title="Open Roaster Portal"
              >
                <div className="w-7 h-7 rounded-lg bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24] shrink-0 mt-0.5">
                  <Store className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#A8622D] transition-colors">
                    Roaster Portal
                  </h4>
                  <p className="text-[11px] text-[#766A62]">
                    Free lot management, roast curves, thermal QR labels & telemetry.
                  </p>
                </div>
              </button>

              {/* Cafe B2B Portal Trigger */}
              <button
                type="button"
                onClick={() => {
                  setIsToolsMenuOpen(false);
                  if (onOpenCafePortal) onOpenCafePortal();
                }}
                className="w-full text-left flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors group"
                title="Open Coffee Shop Portal"
              >
                <div className="w-7 h-7 rounded-lg bg-[#EBF3ED] border border-[#C8E0CD] flex items-center justify-center text-[#2F663C] shrink-0 mt-0.5">
                  <Coffee className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-[#14110F] group-hover:text-[#2F663C] transition-colors">
                    Coffee Shop Portal
                  </h4>
                  <p className="text-[11px] text-[#766A62]">
                    Free "On Bar Today" live menu switcher, bar gear setup & foot-traffic.
                  </p>
                </div>
              </button>

              {/* Profile & Account Bottom Action */}
              <div className="pt-2 border-t border-[#ECE6DC] mt-1">
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      if (onOpenProfile) onOpenProfile();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#FAF0E6] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] flex items-center justify-center text-[#A25A24] text-xs font-bold font-mono">
                        {currentUser.displayName ? currentUser.displayName[0] : 'B'}
                      </div>
                      <span className="font-sans text-xs font-bold text-[#14110F] truncate max-w-[150px]">
                        {currentUser.displayName || 'Barista'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#A25A24] font-bold">Manage Profile →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsToolsMenuOpen(false);
                      if (onOpenAuth) onOpenAuth();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#14110F] text-[#FAF7F2] hover:bg-[#2A2421] font-sans font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    title="Profile"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Barista Profile Login / Sign Up</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
