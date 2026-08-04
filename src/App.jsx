import React, { useState, useEffect } from 'react';
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
import RecipeExplorer from './components/RecipeExplorer';
import RecipeBuilderModal from './components/RecipeBuilderModal';
import UserProfileDashboard from './components/UserProfileDashboard';
import GlobalSearchModal from './components/GlobalSearchModal';
import AuthModal from './components/AuthModal';
import BrewMasterCommunity from './components/BrewMasterCommunity';
import { BREW_METHODS } from './data/brewData';
import { initGA, trackEvent } from './utils/analytics';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export default function App() {
  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4

  // User Profile & Account State
  const [currentUser, setCurrentUser] = useState({
    username: '@barista_clara',
    displayName: 'Clara Vance',
    email: 'clara@specialtybrew.org',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialty Coffee Association Certified Barista • Obsessed with high-altitude washed Ethiopians & 1:16 pour-overs.',
    streakDays: 14,
    totalBrewsLogged: 142
  });

  // Platform Modal States
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRecipeBuilderOpen, setIsRecipeBuilderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

  // Initialize Analytics on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initGA(window.GA_MEASUREMENT_ID || 'G-VT2YZ4KHHB');
    }
  }, []);

  // Sync active method when track mode switches
  const handleTrackSwitch = (newTrack) => {
    setTrackMode(newTrack);
    const newMethods = BREW_METHODS[newTrack] || BREW_METHODS.coffee;
    setActiveMethod(newMethods[0]);
    setCustomRatio(null);
    setCustomWaterMl(null);
    trackEvent('switch_track_mode', { track_mode: newTrack });
  };

  const handleSelectMethodFromGrid = (method) => {
    setActiveMethod(method);
    setCustomRatio(null);
    setCustomWaterMl(null);
    setCurrentStep(2);
    trackEvent('select_method', { method_id: method.id, method_name: method.name });
  };

  const isCoffee = trackMode === 'coffee';
  const currentActiveMethod = activeMethod || (methods.length > 0 ? methods[0] : null);

  // Calculated Water Volume & Dose
  const effectiveRatio = customRatio !== null ? customRatio : (currentActiveMethod?.ratio || 15);
  const calculatedTotalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
  const dryDoseGrams = calculatedTotalWaterMl > 0 ? Math.round((calculatedTotalWaterMl / effectiveRatio) * 10) / 10 : 0;

  return (
    <div className="min-h-screen bg-[#0A0908] text-cream-soft font-sans selection:bg-amber-gold selection:text-espresso-950 flex flex-col">
      
      {/* Sticky Header with Action Controls */}
      <Header
        trackMode={trackMode}
        setTrackMode={handleTrackSwitch}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenJournal={() => setIsJournalOpen(true)}
        onOpenShop={() => {
          const shopElem = document.getElementById('brew-shop-section');
          if (shopElem) shopElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenCommunity={() => {
          const commElem = document.getElementById('brew-master-community');
          if (commElem) commElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Step-by-Step Progress Bar */}
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          trackMode={trackMode}
        />

        <main className="mt-8 space-y-12">

          {/* STEP 01: ATELIER / METHOD SELECTOR */}
          {currentStep === 1 && (
            <MethodSelectorGrid
              trackMode={trackMode}
              methods={methods}
              activeMethod={currentActiveMethod}
              setActiveMethod={handleSelectMethodFromGrid}
              onNextStep={() => setCurrentStep(2)}
              unitSystem={unitSystem}
            />
          )}

          {/* STEP 02: PRECISION RATIO CALCULATOR & SCALER */}
          {currentStep === 2 && (
            <div className="animate-fade-in space-y-8">
              <PrecisionCalculator
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                cupCount={cupCount}
                setCupCount={setCupCount}
                cupMl={cupMl}
                setCupMl={setCupMl}
                customRatio={customRatio}
                setCustomRatio={setCustomRatio}
                customWaterMl={customWaterMl}
                setCustomWaterMl={setCustomWaterMl}
                unitSystem={unitSystem}
                onNextStep={() => setCurrentStep(3)}
                onPrevStep={() => setCurrentStep(1)}
              />
            </div>
          )}

          {/* STEP 03: METHOD SPECIFICATIONS, HERO & GRIND VISUALIZER */}
          {currentStep === 3 && (
            <div className="animate-fade-in space-y-10">
              <HeroBanner
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                unitSystem={unitSystem}
              />

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

          {/* Dedicated Forum Component: The Brew Master Community */}
          <BrewMasterCommunity
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />

          {/* Community Recipe Explorer & User Submissions */}
          <div id="community-section">
            <RecipeExplorer
              trackMode={trackMode}
              onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
            />
          </div>

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

          {/* 1. Dedicated Diagnostics Drawer (Taste Troubleshooting & Water Chemistry) */}
          <DiagnosticsDrawer trackMode={trackMode} />

          {/* 2. Dedicated Knowledge Base Drawer (Terroir Atlas & Agronomy) */}
          <KnowledgeBaseDrawer trackMode={trackMode} />

          {/* Amazon Affiliate "Brew Essentials Kit & Shop" Section */}
          <div id="brew-shop-section">
            <ShopDrawer
              trackMode={trackMode}
              activeMethod={currentActiveMethod}
            />
          </div>

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

          {/* 4. Global Multi-Index Search Overlay */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectMethod={(method) => {
              setActiveMethod(method);
              setCurrentStep(2);
            }}
          />

          {/* 5. User Profile & Badges Dashboard */}
          <UserProfileDashboard
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            trackMode={trackMode}
          />

          {/* 6. Recipe Builder Modal */}
          <RecipeBuilderModal
            isOpen={isRecipeBuilderOpen}
            onClose={() => setIsRecipeBuilderOpen(false)}
            trackMode={trackMode}
          />

          {/* 7. Sign In / Create / Manage Profile Auth Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            currentUser={currentUser}
            onSaveProfile={(updatedUser) => setCurrentUser(updatedUser)}
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
              The Brew Master Community Forum • Community Recipe Exchange • User Accounts • Analytics Enabled
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}
