import React from 'react';
import {
  Coffee,
  Compass,
  Store,
  GraduationCap,
  BookOpen,
  SlidersHorizontal
} from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export default function MobileBottomNav({
  currentView,
  isShopsView = false,
  onSelectView,
  onOpenTools,
  isToolsOpen = false
}) {
  const isBrew = !isToolsOpen && (currentView === 'brew' || currentView === 'brew_station' || (!['discover', 'roasters', 'cafes', 'shops', 'learn', 'my_coffee', 'recipes'].includes(currentView) && !isShopsView));
  const isDiscover = !isToolsOpen && (currentView === 'discover' || currentView === 'roasters');
  const isCafes = !isToolsOpen && (currentView === 'cafes' || currentView === 'shops' || isShopsView);
  const isLearn = !isToolsOpen && currentView === 'learn';
  const isMyCoffee = !isToolsOpen && (currentView === 'my_coffee' || currentView === 'recipes');

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#ECE6DC] shadow-[0_-4px_20px_rgba(20,17,15,0.06)] flex items-center justify-around px-1.5 pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] text-[#766A62] select-none"
      role="navigation"
      aria-label="Mobile Navigation Bar"
    >
      {/* 1. Brew */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('brew');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isBrew
            ? 'text-[#14110F] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Guided Brew Station"
        aria-label="Guided Brew Station"
      >
        {isBrew && (
          <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
        )}
        <div className={`p-1 rounded-xl transition-all ${
          isBrew ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
        }`}>
          <Coffee className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Brew</span>
      </button>

      {/* 2. Roasters */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('roasters');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isDiscover
            ? 'text-[#14110F] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Roasters & Coffees"
        aria-label="Specialty Roasters & Coffees"
      >
        {isDiscover && (
          <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
        )}
        <div className={`p-1 rounded-xl transition-all ${
          isDiscover ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
        }`}>
          <Compass className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Roasters</span>
      </button>

      {/* 3. Cafés */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('cafes');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isCafes
            ? 'text-[#14110F] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Coffee Shop & Roaster Radar"
        aria-label="Specialty Coffee Shop & Roaster Radar"
      >
        {isCafes && (
          <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
        )}
        <div className={`p-1 rounded-xl transition-all ${
          isCafes ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
        }`}>
          <Store className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Cafés</span>
      </button>

      {/* 4. Learn */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('learn');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isLearn
            ? 'text-[#14110F] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Coffee Academy & Science"
        aria-label="Specialty Coffee Academy & Science"
      >
        {isLearn && (
          <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
        )}
        <div className={`p-1 rounded-xl transition-all ${
          isLearn ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
        }`}>
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Learn</span>
      </button>

      {/* 5. My Coffee */}
      <button
        type="button"
        onClick={() => {
          hapticTap();
          if (onSelectView) onSelectView('my_coffee');
        }}
        className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isMyCoffee
            ? 'text-[#14110F] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="My Coffee Journal & Recipes"
        aria-label="My Coffee Journal & Recipes"
      >
        {isMyCoffee && (
          <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
        )}
        <div className={`p-1 rounded-xl transition-all ${
          isMyCoffee ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
        }`}>
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">My Coffee</span>
      </button>

      {/* 6. Tools & More (Bottom Sheet Trigger) */}
      {onOpenTools && (
        <button
          type="button"
          onClick={() => {
            hapticTap();
            onOpenTools();
          }}
          className={`relative flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all active:scale-95 mobile-touch-target ${
            isToolsOpen
              ? 'text-[#14110F] font-bold'
              : 'hover:text-[#14110F]'
          }`}
          title="Barista Tools, Scanner, Water Lab & Portals"
          aria-label="Open Barista Tools Drawer"
        >
          {isToolsOpen && (
            <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-[#C88A4B]" />
          )}
          <div className={`p-1 rounded-xl transition-all ${
            isToolsOpen ? 'bg-[#FAF0E6] text-[#C88A4B]' : ''
          }`}>
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">Tools</span>
        </button>
      )}
    </nav>
  );
}
