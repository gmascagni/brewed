import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import PrecisionCalculator from './components/PrecisionCalculator';
import MultiPhaseTimer from './components/MultiPhaseTimer';
import GrindVisualGuide from './components/GrindVisualGuide';
import MasterclassHub from './components/MasterclassHub';
import UniversityHub from './components/UniversityHub';
import TroubleshootingHub from './components/TroubleshootingHub';
import { BREW_METHODS } from './data/brewData';

export default function App() {
  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('metric'); // 'metric' | 'imperial'
  const [isMuted, setIsMuted] = useState(false);

  // Active Method & Scaling State
  const methods = BREW_METHODS[trackMode] || BREW_METHODS.coffee;
  const [activeMethod, setActiveMethod] = useState(methods[0]);
  const [cupCount, setCupCount] = useState(2);
  const [cupMl, setCupMl] = useState(240);
  const [customRatio, setCustomRatio] = useState(null);

  // Masterclass & Split Screen State (Initial video player is closed until user clicks a tutorial card)
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  // Sync active method when track mode switches
  const handleTrackSwitch = (newTrack) => {
    setTrackMode(newTrack);
    const newMethods = BREW_METHODS[newTrack] || BREW_METHODS.coffee;
    setActiveMethod(newMethods[0]);
    setCustomRatio(null);
    setActiveVideo(null);
  };

  // Sync active method selection
  const handleMethodSelect = (method) => {
    if (method) {
      setActiveMethod(method);
      setCustomRatio(null);
      setActiveVideo(null);
    }
  };

  // Ensure activeMethod always belongs to current trackMode methods
  const currentActiveMethod = (activeMethod && methods.some(m => m.id === activeMethod.id))
    ? activeMethod
    : (methods[0] || BREW_METHODS.coffee[0]);

  const isCoffee = trackMode === 'coffee';
  const heroImage = currentActiveMethod?.heroImage || (isCoffee ? './coffee_setup.jpg' : './tea_kettle.jpg');

  // Math for dry dose calculation
  const totalWaterMl = cupCount * cupMl;
  const ratio = customRatio || currentActiveMethod?.ratio || 15;
  const dryDoseGrams = totalWaterMl / ratio;

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${
      isCoffee ? 'bg-espresso-950 text-cream-soft' : 'bg-slate-950 text-cream-soft'
    }`}>
      
      {/* Full-Page Dynamic Method Background Image (Vivid & Clear Photography Backdrop) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          key={heroImage}
          src={heroImage}
          alt={currentActiveMethod?.name || 'Brew Background'}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.72] contrast-115 transition-all duration-1000 ease-in-out"
        />
        <div className={`absolute inset-0 ${
          isCoffee
            ? 'bg-gradient-to-b from-espresso-950/40 via-espresso-950/60 to-espresso-950/85'
            : 'bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/85'
        }`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/70" />
      </div>

      {/* App Main Body Layer */}
      <div className="relative z-10">
        
        {/* 1. Header Bar */}
        <Header
          trackMode={trackMode}
          setTrackMode={handleTrackSwitch}
          unitSystem={unitSystem}
          setUnitSystem={setUnitSystem}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
        />

        {/* Main Workspace Container */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          
          {/* 2. Core Calculator & Multi-Phase Timer Layout (Moved to Top for Immediate Access) */}
          <div className={`mb-8 grid grid-cols-1 ${isSplitScreen ? 'lg:grid-cols-12 gap-6' : 'lg:grid-cols-2 gap-8'}`}>
            
            {/* Left Pane: Precision Ratio & Cup Scaling Calculator */}
            <div className={isSplitScreen ? 'lg:col-span-5' : ''}>
              <PrecisionCalculator
                trackMode={trackMode}
                methods={methods}
                activeMethod={currentActiveMethod}
                setActiveMethod={handleMethodSelect}
                cupCount={cupCount}
                setCupCount={setCupCount}
                cupMl={cupMl}
                setCupMl={setCupMl}
                customRatio={customRatio}
                setCustomRatio={setCustomRatio}
                unitSystem={unitSystem}
              />
            </div>

            {/* Right Pane: Multi-Phase Countdown Timer */}
            <div className={isSplitScreen ? 'lg:col-span-7' : ''}>
              <MultiPhaseTimer
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                dryDoseGrams={dryDoseGrams}
                isMuted={isMuted}
              />
            </div>

          </div>

          {/* 3. Hero Editorial Banner */}
          <HeroBanner
            trackMode={trackMode}
            activeMethod={currentActiveMethod}
            unitSystem={unitSystem}
          />

          {/* 4. Coffee Grind Coarseness Visual Reference Guide (Coffee Track Only) */}
          {isCoffee && <GrindVisualGuide activeMethod={currentActiveMethod} />}

          {/* 5. Integrated Masterclass Video Hub & Split Screen */}
          <MasterclassHub
            trackMode={trackMode}
            activeMethod={currentActiveMethod}
            isSplitScreen={isSplitScreen}
            setIsSplitScreen={setIsSplitScreen}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />

          {/* 6. The Brew App University: Terroir, Agronomy Science & Sourced Brands */}
          <UniversityHub trackMode={trackMode} />

          {/* 7. Extraction Nuance & Troubleshooting Hub */}
          <TroubleshootingHub trackMode={trackMode} />

        </main>

        {/* App Footer */}
        <footer className="mt-16 border-t border-white/10 py-8 px-4 text-center text-xs text-cream-soft/50 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-serif font-bold text-cream-light text-sm">The Brew App: The Art of Extraction</span>
              <p className="mt-0.5">Precision Specialty Coffee & Fine Tea Brewing Application</p>
            </div>
            <div className="text-cream-soft/40">
              Designed for Home Brewing Excellence • Metric & Imperial Support
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
