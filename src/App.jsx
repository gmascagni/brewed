import React, { useState } from 'react';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import MethodSelectorGrid from './components/MethodSelectorGrid';
import PrecisionCalculator from './components/PrecisionCalculator';
import HeroBanner from './components/HeroBanner';
import GrindVisualGuide from './components/GrindVisualGuide';
import MasterclassHub from './components/MasterclassHub';
import MultiPhaseTimer from './components/MultiPhaseTimer';
import KnowledgeBaseDrawer from './components/KnowledgeBaseDrawer';
import DiagnosticsDrawer from './components/DiagnosticsDrawer';
import ShopDrawer from './components/ShopDrawer';
import BrewJournal from './components/BrewJournal';
import { BREW_METHODS } from './data/brewData';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Active Method & Scaling State
  const methods = BREW_METHODS[trackMode] || BREW_METHODS.coffee;
  const [activeMethod, setActiveMethod] = useState(methods[0]);
  const [cupCount, setCupCount] = useState(2);
  const [cupMl, setCupMl] = useState(240);
  const [customRatio, setCustomRatio] = useState(null);
  const [customWaterMl, setCustomWaterMl] = useState(null);

  // Masterclass & Split Screen State
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  // Sync active method when track mode switches
  const handleTrackSwitch = (newTrack) => {
    setTrackMode(newTrack);
    const newMethods = BREW_METHODS[newTrack] || BREW_METHODS.coffee;
    setActiveMethod(newMethods[0]);
    setCustomRatio(null);
    setCustomWaterMl(null);
    setActiveVideo(null);
    setCurrentStep(1); // Reset to Step 1 on track switch
  };

  // Sync active method selection
  const handleMethodSelect = (method) => {
    if (method) {
      setActiveMethod(method);
      setCustomRatio(null);
      setCustomWaterMl(null);
      setActiveVideo(null);
    }
  };

  const handleScrollToShop = () => {
    const shopElem = document.getElementById('brew-shop-section');
    if (shopElem) {
      shopElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Ensure activeMethod always belongs to current trackMode methods
  const currentActiveMethod = (activeMethod && methods.some(m => m.id === activeMethod.id))
    ? activeMethod
    : (methods[0] || BREW_METHODS.coffee[0]);

  const isCoffee = trackMode === 'coffee';
  const heroImage = currentActiveMethod?.heroImage || (isCoffee ? './coffee_setup.jpg' : './tea_kettle.jpg');

  // Math for dry dose calculation
  const totalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
  const ratio = customRatio || currentActiveMethod?.ratio || 15;
  const dryDoseGrams = totalWaterMl / ratio;

  return (
    <div className={`min-h-screen relative transition-colors duration-500 ${
      isCoffee ? 'bg-[#0A0908] text-cream-soft' : 'bg-slate-950 text-cream-soft'
    }`}>
      
      {/* Full-Page Dynamic Method Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          key={heroImage}
          src={heroImage}
          alt={currentActiveMethod?.name || 'Brew Background'}
          className="w-full h-full object-cover object-center transform scale-105 filter brightness-[0.72] contrast-115 transition-all duration-1000 ease-in-out"
        />
        <div className={`absolute inset-0 ${
          isCoffee
            ? 'bg-gradient-to-b from-[#0A0908]/40 via-[#0A0908]/60 to-[#0A0908]/85'
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
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenShop={handleScrollToShop}
        />

        {/* 2. Top Sticky 4-Step Indicator Bar */}
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          trackMode={trackMode}
        />

        {/* 3. Guided Wizard Step Container */}
        <main key={`${trackMode}-${currentStep}`} className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          
          {/* STEP 01: CHOOSE METHOD */}
          {currentStep === 1 && (
            <MethodSelectorGrid
              trackMode={trackMode}
              methods={methods}
              activeMethod={currentActiveMethod}
              setActiveMethod={handleMethodSelect}
              onNextStep={() => setCurrentStep(2)}
              unitSystem={unitSystem}
            />
          )}

          {/* STEP 02: RATIO & CUP SCALER */}
          {currentStep === 2 && (
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
              customWaterMl={customWaterMl}
              setCustomWaterMl={setCustomWaterMl}
              unitSystem={unitSystem}
              onPrevStep={() => setCurrentStep(1)}
              onNextStep={() => setCurrentStep(3)}
            />
          )}

          {/* STEP 03: GRIND & BEAN SPECS */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Method Specs & Preferred Roasts Hero Banner */}
              <HeroBanner
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                unitSystem={unitSystem}
              />

              {/* Coffee Grind Coarseness Visual Micron Reference (Coffee Track Only) */}
              {isCoffee && <GrindVisualGuide activeMethod={currentActiveMethod} />}

              {/* Step Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="py-3 px-6 rounded-2xl bg-white/10 text-cream-light font-extrabold text-xs flex items-center gap-2 hover:bg-white/20 transition-all border border-white/15"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Step 02: Ratio & Scaler</span>
                </button>

                <button
                  onClick={() => setCurrentStep(4)}
                  className="py-3.5 px-8 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Step 04: Guided Brew Timer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 04: GUIDED BREW TIMER */}
          {currentStep === 4 && (
            <div className="animate-fade-in max-w-4xl mx-auto">
              <MultiPhaseTimer
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                dryDoseGrams={dryDoseGrams}
                isMuted={isMuted}
                onPrevStep={() => setCurrentStep(3)}
                onOpenJournal={() => setIsJournalOpen(true)}
              />
            </div>
          )}

          {/* Video Masterclass Tutorials for Selected Method */}
          <div className="mt-14">
            <MasterclassHub
              trackMode={trackMode}
              activeMethod={currentActiveMethod}
              isSplitScreen={isSplitScreen}
              setIsSplitScreen={setIsSplitScreen}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
            />
          </div>

          {/* Amazon Affiliate "Brew Essentials Kit & Shop" Section */}
          <div id="brew-shop-section">
            <ShopDrawer
              trackMode={trackMode}
              activeMethod={currentActiveMethod}
            />
          </div>

          {/* 1. Dedicated Diagnostics Drawer (Taste Troubleshooting & Water Chemistry) */}
          <DiagnosticsDrawer trackMode={trackMode} />

          {/* 2. Dedicated Knowledge Base Drawer (Terroir Atlas & Agronomy) */}
          <KnowledgeBaseDrawer trackMode={trackMode} />

          {/* 3. Personal Tasting Journal & Golden Cup Log Modal */}
          <BrewJournal
            isOpen={isJournalOpen}
            onClose={() => setIsJournalOpen(false)}
            trackMode={trackMode}
            activeMethod={currentActiveMethod}
            cupCount={cupCount}
            cupMl={cupMl}
            customRatio={customRatio}
            unitSystem={unitSystem}
          />

        </main>

        {/* App Footer */}
        <footer className="mt-16 border-t border-white/10 py-8 px-4 text-center text-xs text-cream-soft/50 backdrop-blur-xl bg-black/40">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-serif font-bold text-cream-light text-sm">The Brew App: The Art of Extraction</span>
              <p className="mt-0.5">Precision Specialty Coffee & Fine Tea Brewing Application</p>
            </div>
            <div className="text-cream-soft/40">
              Guided 4-Step Brewing Wizard • Amazon Affiliate Store • Personal Tasting Journal • Imperial & Metric Support
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
