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
import BrewJournal from './components/BrewJournal';
import RecipeBuilderModal from './components/RecipeBuilderModal';
import UserProfileDashboard from './components/UserProfileDashboard';
import GlobalSearchModal from './components/GlobalSearchModal';
import AuthModal from './components/AuthModal';
import CommunityHubModal from './components/CommunityHubModal';
import LocalCoffeeFinderModal from './components/LocalCoffeeFinderModal';
import ShopDrawer from './components/ShopDrawer';
import Footer from './components/Footer';
import { BREW_METHODS } from './data/brewData';
import { initGA, trackEvent } from './utils/analytics';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const DEFAULT_LOCAL_PROFILES = [
  {
    username: '@barista_pro',
    displayName: 'Alex Rivers',
    email: 'alex@specialtybrew.org',
    avatar: './avatar_cartoon_female_barista.jpg',
    bio: 'Specialty Coffee Association Certified Barista • Obsessed with high-altitude washed Ethiopians & 1:16 pour-overs.',
    role: 'user',
    streakDays: 14,
    totalBrewsLogged: 142
  }
];

export default function App() {
  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4

  // User Accounts State (Persisted in localStorage)
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_local_users');
      return saved ? JSON.parse(saved) : DEFAULT_LOCAL_PROFILES;
    } catch {
      return DEFAULT_LOCAL_PROFILES;
    }
  });

  // Currently Active Logged In User (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync usersList and currentUser to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('the_brew_app_local_users', JSON.stringify(usersList));
    } catch (err) {
      console.warn('Unable to persist usersList to localStorage:', err);
    }
  }, [usersList]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('the_brew_app_active_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('the_brew_app_active_user');
      }
    } catch (err) {
      console.warn('Unable to persist currentUser to localStorage:', err);
    }
  }, [currentUser]);

  // Platform Modal States
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isRecipeBuilderOpen, setIsRecipeBuilderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLocalCoffeeOpen, setIsLocalCoffeeOpen] = useState(false);

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
    if (setActiveVideo) setActiveVideo(null);
    trackEvent('switch_track_mode', { track_mode: newTrack });
  };

  const handleSelectMethodFromGrid = (method) => {
    setActiveMethod(method);
    setCustomRatio(null);
    setCustomWaterMl(null);
    if (setActiveVideo) setActiveVideo(null);
    setCurrentStep(2);
    trackEvent('select_method', { method_id: method.id, method_name: method.name });
  };

  const handleDeleteUser = (usernameToDelete) => {
    setUsersList(usersList.filter((u) => u.username !== usernameToDelete));
  };

  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';
  const isBeer = trackMode === 'beer';

  // Sync body theme class whenever track changes
  useEffect(() => {
    document.body.className = `theme-${trackMode}`;
  }, [trackMode]);
  
  // Guarantee active method belongs to current track
  const currentActiveMethod = (activeMethod && methods.some(m => m.id === activeMethod.id))
    ? activeMethod
    : (methods.length > 0 ? methods[0] : null);

  // Calculated Water Volume & Dose
  const effectiveRatio = customRatio !== null ? customRatio : (currentActiveMethod?.ratio || 15);
  const calculatedTotalWaterMl = customWaterMl !== null ? customWaterMl : (cupCount * cupMl);
  const dryDoseGrams = calculatedTotalWaterMl > 0 ? Math.round((calculatedTotalWaterMl / effectiveRatio) * 10) / 10 : 0;

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-700 relative ${
      isBeer
        ? 'bg-[#110C04] text-[#FEFCE8] selection:bg-amber-400 selection:text-[#0F0C05]'
        : isCoffee
        ? 'bg-[#0E0906] text-[#F8F5F1] selection:bg-[#C48B56] selection:text-[#140C08]'
        : 'bg-[#08110B] text-[#EBF7EE] selection:bg-sage-400 selection:text-[#07130B]'
    }`}>

      {/* High-Definition Extraction Method Background Image Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 md:opacity-40 transition-all duration-1000">
        <img
          key={currentActiveMethod?.heroImage || trackMode}
          src={currentActiveMethod?.heroImage || (isBeer ? './beer_hazy_dipa_hero.jpg' : isCoffee ? './pour_over_hero.jpg' : './tea_ceremony.jpg')}
          alt={currentActiveMethod?.name || 'Extraction Background'}
          className="w-full h-full object-cover object-center filter blur-[2px] scale-105 transform transition-transform duration-1000 brightness-90 contrast-110"
        />
        <div className={`absolute inset-0 ${
          isBeer
            ? 'bg-gradient-to-b from-[#110C04]/80 via-[#110C04]/55 to-[#110C04]/90'
            : isCoffee
            ? 'bg-gradient-to-b from-[#0E0906]/80 via-[#0E0906]/55 to-[#0E0906]/90'
            : 'bg-gradient-to-b from-[#08110B]/80 via-[#08110B]/55 to-[#08110B]/90'
        }`} />
      </div>
      
      {/* 100% Bulletproof Sticky Top Header Container */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-700 border-b shadow-2xl ${
        isBeer
          ? 'bg-[#181207]/95 border-amber-500/40 shadow-[0_10px_30px_rgba(245,158,11,0.15)]'
          : isCoffee
          ? 'bg-[#160E09]/95 border-[#A66E38]/40 shadow-[0_10px_30px_rgba(166,110,56,0.15)]'
          : 'bg-[#0B1710]/95 border-sage-500/40 shadow-[0_10px_30px_rgba(94,150,106,0.15)]'
      }`}>
        <Header
          trackMode={trackMode}
          setTrackMode={handleTrackSwitch}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCommunity={() => setIsCommunityOpen(true)}
          onOpenLocalCoffee={() => setIsLocalCoffeeOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          currentUser={currentUser}
        />
        
        {/* Step Progress Bar Pinned Inside Sticky Top Bar */}
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          trackMode={trackMode}
        />
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        <main className="mt-4 space-y-10">

          {/* STEP 01: METHOD SELECTOR */}
          {currentStep === 1 && (
            <MethodSelectorGrid
              trackMode={trackMode}
              setTrackMode={setTrackMode}
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
                methods={methods}
                activeMethod={currentActiveMethod}
                setActiveMethod={setActiveMethod}
                cupCount={cupCount}
                setCupCount={setCupCount}
                cupMl={cupMl}
                setCupMl={setCupMl}
                customRatio={customRatio}
                setCustomRatio={setCustomRatio}
                customWaterMl={customWaterMl}
                setCustomWaterMl={setCustomWaterMl}
                unitSystem={unitSystem}
                setUnitSystem={setUnitSystem}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onNextStep={() => setCurrentStep(3)}
                onPrevStep={() => setCurrentStep(1)}
              />
            </div>
          )}

          {/* STEP 03: METHOD SPECIFICATIONS & HERO */}
          {currentStep === 3 && (
            <div className="animate-fade-in space-y-8">
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
                unitSystem={unitSystem}
                isMuted={isMuted}
                onPrevStep={() => setCurrentStep(3)}
                onOpenJournal={() => setIsJournalOpen(true)}
              />
            </div>
          )}

          {/* Video Masterclass Tutorials */}
          <div className="mt-10">
            <MasterclassHub
              trackMode={trackMode}
              activeMethod={currentActiveMethod}
              isSplitScreen={isSplitScreen}
              setIsSplitScreen={setIsSplitScreen}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
            />
          </div>

          {/* Amazon Affiliate Equipment & Gear Store Drawer (Collapsed by Default) */}
          <ShopDrawer trackMode={trackMode} activeMethod={currentActiveMethod} />

          {/* 1. Diagnostics Drawer (Troubleshooting & Water) */}
          <DiagnosticsDrawer trackMode={trackMode} />

          {/* 2. Knowledge Base Drawer (Terroir Atlas) */}
          <KnowledgeBaseDrawer trackMode={trackMode} />

          {/* Dedicated Community Hub Modal (Contains Shared Recipes & Brew Master Forum) */}
          <CommunityHubModal
            isOpen={isCommunityOpen}
            onClose={() => setIsCommunityOpen(false)}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            trackMode={trackMode}
            onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
          />

          {/* Personal Tasting Journal Modal */}
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

          {/* Global Multi-Index Search Overlay */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectMethod={(method) => {
              setActiveMethod(method);
              setCurrentStep(2);
            }}
          />

          {/* User Profile & Badges Dashboard */}
          <UserProfileDashboard
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            trackMode={trackMode}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={() => setCurrentUser(null)}
          />

          {/* Recipe Builder Modal */}
          <RecipeBuilderModal
            isOpen={isRecipeBuilderOpen}
            onClose={() => setIsRecipeBuilderOpen(false)}
            trackMode={trackMode}
          />

          {/* Sign In / Auth Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            currentUser={currentUser}
            usersList={usersList}
            onSaveProfile={(updatedUser) => {
              setCurrentUser(updatedUser);
              setUsersList([updatedUser, ...usersList.filter((u) => u.username !== updatedUser.username)]);
            }}
            onLogout={() => setCurrentUser(null)}
          />

          {/* Specialty Coffee Shop Finder Modal */}
          <LocalCoffeeFinderModal
            isOpen={isLocalCoffeeOpen}
            onClose={() => setIsLocalCoffeeOpen(false)}
            trackMode={trackMode}
          />

        </main>

        {/* Contact HQ Email & App Footer */}
        <Footer trackMode={trackMode} />

      </div>

    </div>
  );
}
