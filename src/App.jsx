import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import WorldNewsSection from './components/WorldNewsSection';
import BarcodeScannerModal from './components/BarcodeScannerModal';
import WaterChemistryModal from './components/WaterChemistryModal';
import VersionHistoryModal from './components/VersionHistoryModal';
import Footer from './components/Footer';
import { BREW_METHODS } from './data/brewData';
import { initGA, trackEvent } from './utils/analytics';
import { getMethodJsonLd, updatePageSeo } from './utils/seo';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const DEFAULT_LOCAL_PROFILES = [];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4

  // User Accounts State (Persisted in localStorage)
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_local_users');
      const list = saved ? JSON.parse(saved) : [];
      // Clean up any historical fake personas
      return list.filter((u) => u && u.username !== '@barista_pro' && u.email !== 'alex@specialtybrew.org');
    } catch {
      return [];
    }
  });

  // Currently Active Logged In User (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_active_user');
      const user = saved ? JSON.parse(saved) : null;
      if (user && (user.username === '@barista_pro' || user.email === 'alex@specialtybrew.org')) {
        localStorage.removeItem('the_brew_app_active_user');
        return null;
      }
      return user;
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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isWaterLabOpen, setIsWaterLabOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Handlers for Scanned Bean Actions
  const handleApplyScannedRecipe = (scannedBean) => {
    if (!scannedBean) return;
    if (scannedBean.recommendedRatio) {
      setCustomRatio(scannedBean.recommendedRatio);
    }
    const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
    const targetMethod = allMethods.find(m => m.id === scannedBean.brewMethod) || allMethods[0];
    setActiveMethod(targetMethod);
    setTrackMode('coffee');
    setCurrentStep(2);
    setTimeout(() => {
      const el = document.getElementById('step-2');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSaveScannedToJournal = (scannedBean) => {
    if (!scannedBean) return;
    try {
      const existing = JSON.parse(localStorage.getItem('the_brew_app_journal_v1') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trackMode: 'coffee',
        methodName: scannedBean.brewMethod ? scannedBean.brewMethod.replace(/_/g, ' ') : 'Pour Over',
        beanName: scannedBean.beanName,
        roaster: scannedBean.roaster,
        doseStr: '18.0 g',
        waterStr: `${18 * (scannedBean.recommendedRatio || 16)} mL`,
        ratioStr: `1 : ${scannedBean.recommendedRatio || 16}`,
        grindStr: scannedBean.recommendedGrind || 'Medium-Fine',
        tempStr: `${scannedBean.tempF || 200}°F`,
        rating: 5,
        isFavorite: true,
        tastingNotes: scannedBean.tastingNotes || [],
        notes: `${scannedBean.notes} (Origin: ${scannedBean.origin}, Altitude: ${scannedBean.elevation})`
      };
      localStorage.setItem('the_brew_app_journal_v1', JSON.stringify([newEntry, ...existing]));
      setIsJournalOpen(true);
    } catch (err) {
      console.error('Error saving scanned bean to journal', err);
    }
  };

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

  // Synchronize React Router URL with Active Method and Steps
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/methods/')) {
      const methodId = path.replace('/methods/', '').replace(/\/$/, '');
      const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
      const found = allMethods.find(m => m.id === methodId);

      if (found) {
        setActiveMethod(found);
        if (found.category && found.category !== trackMode) {
          setTrackMode(found.category);
        }
        if (currentStep === 1) {
          setCurrentStep(2);
        }

        // Update Dynamic SEO & JSON-LD Structured Data
        updatePageSeo(
          `How to Brew ${found.name}`,
          found.description,
          `https://thebrew.app/methods/${found.id}`
        );

        // Inject / Update JSON-LD Script tag in <head>
        const jsonLdData = getMethodJsonLd(found);
        if (jsonLdData) {
          let script = document.getElementById('json-ld-structured-data');
          if (!script) {
            script = document.createElement('script');
            script.id = 'json-ld-structured-data';
            script.type = 'application/ld+json';
            document.head.appendChild(script);
          }
          script.textContent = JSON.stringify(jsonLdData);
        }
      }
    } else if (path.startsWith('/guides/coffee-water-chemistry')) {
      setIsWaterLabOpen(true);
      updatePageSeo(
        'Coffee Water Chemistry & Extraction Yield Guide',
        'Master coffee water chemistry: SCA water specs, Lotus drop recipes, DIY mineral recipes (GH & KH), and extraction yield optimization for specialty coffee.',
        'https://thebrew.app/guides/coffee-water-chemistry'
      );
    } else if (path === '/' || path === '') {
      setCurrentStep(1);
      updatePageSeo(
        'The Art of Extraction',
        'Precision specialty coffee & fine tea extraction ratio scaler, multi-phase countdown timer, burr grinder macro texture guide, and troubleshooting compendium.',
        'https://thebrew.app/'
      );

      // Clean up JSON-LD on homepage
      const existingScript = document.getElementById('json-ld-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [location.pathname]);

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
    navigate(`/methods/${method.id}`);
    trackEvent('select_method', { method_id: method.id, method_name: method.name });
  };

  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';

  // Sync body theme class whenever track changes
  useEffect(() => {
    document.body.className = `theme-${trackMode}`;
  }, [trackMode]);

  // Scroll to top smoothly when changing steps so mobile screens always show the active step container
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);
  
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
      isCoffee
        ? 'bg-[#0E0906] text-[#F8F5F1] selection:bg-[#C48B56] selection:text-[#140C08]'
        : 'bg-[#08110B] text-[#EBF7EE] selection:bg-sage-400 selection:text-[#07130B]'
    }`}>

      {/* High-Definition Extraction Method Background Image Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 md:opacity-40 transition-all duration-1000">
        <img
          key={currentActiveMethod?.heroImage || trackMode}
          src={currentActiveMethod?.heroImage || (isCoffee ? '/pour_over_hero.jpg' : '/tea_ceremony.jpg')}
          alt={currentActiveMethod?.name || 'Extraction Background'}
          className="w-full h-full object-cover object-center filter blur-[2px] scale-105 transform transition-transform duration-1000 brightness-90 contrast-110"
        />
        <div className={`absolute inset-0 ${
          isCoffee
            ? 'bg-gradient-to-b from-[#0E0906]/80 via-[#0E0906]/55 to-[#0E0906]/90'
            : 'bg-gradient-to-b from-[#08110B]/80 via-[#08110B]/55 to-[#08110B]/90'
        }`} />
      </div>
      
      {/* 100% Bulletproof Sticky Top Header Container */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl transition-all duration-700 border-b shadow-2xl ${
        isCoffee
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
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWaterLab={() => setIsWaterLabOpen(true)}
          onOpenVersionHistory={() => setIsVersionModalOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          currentUser={currentUser}
        />
        
        {/* Step Progress Bar Pinned Inside Sticky Top Bar */}
        <StepIndicator
          currentStep={currentStep}
          setCurrentStep={(stepNum) => {
            setCurrentStep(stepNum);
            if (stepNum === 1) {
              navigate('/');
            } else if (currentActiveMethod) {
              navigate(`/methods/${currentActiveMethod.id}`);
            }
          }}
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
              onNextStep={() => {
                setCurrentStep(2);
                if (currentActiveMethod) {
                  navigate(`/methods/${currentActiveMethod.id}`);
                }
              }}
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
                setActiveMethod={(m) => {
                  setActiveMethod(m);
                  navigate(`/methods/${m.id}`);
                }}
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
                onPrevStep={() => {
                  setCurrentStep(1);
                  navigate('/');
                }}
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
                  className={`py-3.5 px-8 rounded-2xl font-extrabold text-xs flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all ${
                    isCoffee ? 'btn-tactile-coffee text-[#140C08]' : 'btn-tactile-tea text-white'
                  }`}
                >
                  <span>Step 04: Guided Brew Timer</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 04: GUIDED BREW TIMER */}
          {currentStep === 4 && (
            <div className="animate-fade-in space-y-8">
              <MultiPhaseTimer
                trackMode={trackMode}
                activeMethod={currentActiveMethod}
                dryDoseGrams={dryDoseGrams}
                unitSystem={unitSystem}
                isMuted={isMuted}
                setIsMuted={setIsMuted}
                onPrevStep={() => setCurrentStep(3)}
                onOpenJournal={() => setIsJournalOpen(true)}
              />
            </div>
          )}

          {/* Collapsible Video Masterclasses Drawer */}
          <MasterclassHub
            trackMode={trackMode}
            activeMethod={currentActiveMethod}
            activeVideo={activeVideo}
            setActiveVideo={setActiveVideo}
          />

          {/* Collapsible Diagnostics & Water Chemistry Drawer */}
          <DiagnosticsDrawer trackMode={trackMode} />

          {/* Collapsible Knowledge Base & Terroir Atlas Drawer */}
          <KnowledgeBaseDrawer trackMode={trackMode} />

          {/* Collapsible Equipment & Gear Store Drawer */}
          <ShopDrawer trackMode={trackMode} activeMethod={currentActiveMethod} />

          {/* World Coffee & Tea News Dispatch Section */}
          <WorldNewsSection trackMode={trackMode} />

          {/* Tasting Journal Modal */}
          <BrewJournal
            isOpen={isJournalOpen}
            onClose={() => setIsJournalOpen(false)}
            trackMode={trackMode}
            activeMethod={currentActiveMethod}
            cupCount={cupCount}
            cupMl={cupMl}
            customRatio={customRatio}
            unitSystem={unitSystem}
            onOpenScanner={() => setIsScannerOpen(true)}
          />

          {/* Multi-Index Global Search Modal */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectMethod={(method) => {
              handleSelectMethodFromGrid(method);
            }}
          />

          {/* Community Hub Modal */}
          <CommunityHubModal
            isOpen={isCommunityOpen}
            onClose={() => setIsCommunityOpen(false)}
            trackMode={trackMode}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
            onSelectRecipe={(recipe) => {
              const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
              const match = allMethods.find(m => m.id === recipe.methodId);
              if (match) {
                handleSelectMethodFromGrid(match);
              }
              if (recipe.ratio) setCustomRatio(recipe.ratio);
              setIsCommunityOpen(false);
            }}
          />

          {/* Barista User Profile Modal */}
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

          {/* Native Camera Barcode & QR Scanner Modal */}
          <BarcodeScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onApplyRecipe={handleApplyScannedRecipe}
            onSaveToJournal={handleSaveScannedToJournal}
          />

          {/* Coffee Water Chemistry Lab Modal */}
          <WaterChemistryModal
            isOpen={isWaterLabOpen}
            onClose={() => setIsWaterLabOpen(false)}
          />

          {/* Version Control & Release Notes History Modal */}
          <VersionHistoryModal
            isOpen={isVersionModalOpen}
            onClose={() => setIsVersionModalOpen(false)}
          />

        </main>

        {/* Contact HQ Email & App Footer */}
        <Footer trackMode={trackMode} />

      </div>

    </div>
  );
}
