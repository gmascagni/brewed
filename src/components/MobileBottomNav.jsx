import React from 'react';
import {
  Coffee,
  Compass,
  Store,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { hapticTap } from '../utils/haptics';

export default function MobileBottomNav({
  currentView,
  isShopsView = false,
  onSelectView
}) {
  const isBrew = currentView === 'brew' || currentView === 'brew_station' || (!['discover', 'roasters', 'cafes', 'shops', 'learn', 'my_coffee', 'recipes'].includes(currentView) && !isShopsView);
  const isDiscover = currentView === 'discover' || currentView === 'roasters';
  const isCafes = currentView === 'cafes' || currentView === 'shops' || isShopsView;
  const isLearn = currentView === 'learn';
  const isMyCoffee = currentView === 'my_coffee' || currentView === 'recipes';

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-[#ECE6DC] shadow-lg flex items-center justify-around px-2 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] text-[#766A62] select-none"
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
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isBrew
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Guided Brew Station"
        aria-label="Guided Brew Station"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isBrew ? 'bg-[#FAF0E6]' : ''
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
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isDiscover
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Roasters & Coffees"
        aria-label="Specialty Roasters & Coffees"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isDiscover ? 'bg-[#FAF0E6]' : ''
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
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isCafes
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Coffee Shop & Roaster Radar"
        aria-label="Specialty Coffee Shop & Roaster Radar"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isCafes ? 'bg-[#FAF0E6]' : ''
        }`}>
          <Store className="w-5 h-5 text-[#C88A4B]" />
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
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isLearn
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="Specialty Coffee Academy & Science"
        aria-label="Specialty Coffee Academy & Science"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isLearn ? 'bg-[#FAF0E6]' : ''
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
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 mobile-touch-target ${
          isMyCoffee
            ? 'text-[#C88A4B] font-bold'
            : 'hover:text-[#14110F]'
        }`}
        title="My Coffee Journal & Recipes"
        aria-label="My Coffee Journal & Recipes"
      >
        <div className={`p-1 rounded-xl transition-all ${
          isMyCoffee ? 'bg-[#FAF0E6]' : ''
        }`}>
          <BookOpen className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-sans font-semibold mt-0.5 tracking-tight">My Coffee</span>
      </button>
    </nav>
  );
}
