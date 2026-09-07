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
import RoasterPortalModal from './components/RoasterPortalModal';
import RoasterInfoPage from './components/RoasterInfoPage';
import RoasterProfilePage from './components/RoasterProfilePage';
import CoffeeVideoAcademyModal from './components/CoffeeVideoAcademyModal';
import Footer from './components/Footer';
import { AppOrchestratorProvider } from './context/AppOrchestratorContext';
import { BREW_METHODS } from './data/brewData';
import { initGA, trackEvent } from './utils/analytics';
import { getMethodJsonLd, updatePageSeo } from './utils/seo';
import { syncCloudCatalog } from './data/roasterRegistry';
import { ChevronRight, ChevronLeft, Sparkles, Coffee } from 'lucide-react';

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

  // Synchronize Cloud Firestore roaster & coffee registry in background
  useEffect(() => {
    syncCloudCatalog().catch(() => {});
  }, []);

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
  const [isRoasterPortalOpen, setIsRoasterPortalOpen] = useState(false);
  const [isRoasterInfoOpen, setIsRoasterInfoOpen] = useState(false);
  const [roasterPrefillBarcode, setRoasterPrefillBarcode] = useState('');
  const [roasterPrefillBean, setRoasterPrefillBean] = useState(null);
  const [isRoasterShowcaseView, setIsRoasterShowcaseView] = useState(false);
  const [selectedRoasterSlug, setSelectedRoasterSlug] = useState('methodical');
  const [isVideoAcademyOpen, setIsVideoAcademyOpen] = useState(false);
  const [selectedAcademyVideoId, setSelectedAcademyVideoId] = useState(null);
  const [dialedInCoffee, setDialedInCoffee] = useState(null);

  // Handler for Brew Along With Video Action
  const handleBrewWithVideo = (video) => {
    if (!video || !video.recipeSync) return;
    const { methodId, ratio, waterTempF } = video.recipeSync;
    const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
    const targetMethod = allMethods.find(m => m.id === methodId) || allMethods[0];
    setActiveMethod(targetMethod);
    if (ratio) {
      setCustomRatio(ratio);
    }
    setTrackMode('coffee');
    setIsVideoAcademyOpen(false);
    setCurrentStep(4); // Advance straight to the active guided timer so user brews along
    navigate(`/methods/${targetMethod.id}`);
    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    trackEvent('brew_with_video_applied', { video_id: video.id, method_id: targetMethod.id, ratio });
  };

  // Handlers for Scanned / Roaster Dial-In Actions
  const handleApplyScannedRecipe = (scannedBean) => {
    if (!scannedBean) return;

    // 1. Immediately exit Roaster Showcase or Scanner overlay
    setIsRoasterShowcaseView(false);
    setIsScannerOpen(false);

    // 2. Extract ratio, dose, and water volume
    const ratio = Number(scannedBean.recommendedRatio || scannedBean.extraction?.ratio || 16);
    setCustomRatio(ratio);

    const waterAmount = Number(scannedBean.waterGrams || (scannedBean.dryDoseGrams ? Math.round(scannedBean.dryDoseGrams * ratio) : 320));
    setCustomWaterMl(waterAmount);
    setCupCount(1);
    setCupMl(waterAmount);

    // 3. Resolve target brew method
    const targetMethodId = scannedBean.brewMethod || scannedBean.extraction?.method || 'pour_over';
    const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
    const targetMethod = allMethods.find(m => m.id === targetMethodId || m.id.includes(targetMethodId) || targetMethodId.includes(m.id)) || allMethods[0];

    setActiveMethod(targetMethod);
    setTrackMode('coffee');
    setDialedInCoffee(scannedBean);

    // 4. Advance straight to Step 4 (Guided Brew Timer) and navigate URL
    setCurrentStep(4);
    navigate(`/methods/${targetMethod.id}`);

    // 5. Smooth scroll down to the timer
    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    trackEvent('dial_in_recipe_applied', {
      roaster: scannedBean.roaster,
      bean: scannedBean.beanName,
      method: targetMethod.id,
      ratio
    });
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
      setIsRoasterShowcaseView(false);
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
      setIsRoasterShowcaseView(false);
      setIsWaterLabOpen(true);
      updatePageSeo(
        'Coffee Water Chemistry & Extraction Yield Guide',
        'Master coffee water chemistry: SCA water specs, Lotus drop recipes, DIY mineral recipes (GH & KH), and extraction yield optimization for specialty coffee.',
        'https://thebrew.app/guides/coffee-water-chemistry'
      );
    } else if (path.startsWith('/roasters') || path.startsWith('/roaster')) {
      if (path === '/roasters/partner' || path === '/roasters/info') {
        setIsRoasterInfoOpen(true);
      } else {
        setIsRoasterShowcaseView(true);
        const parts = path.split('/').filter(Boolean);
        if (parts.length > 1 && parts[1] !== 'showcase' && parts[1] !== 'partner' && parts[1] !== 'info') {
          setSelectedRoasterSlug(parts[1]);
        }
      }
      updatePageSeo(
        'Specialty Coffee Roaster Showcase & Dial-In Lab | The Brew App',
        'Explore verified specialty coffee roasters, authentic origin stories, and certified dial-in recipes with golden ratios, grind sizes, and water chemistry.',
        'https://thebrew.app/roasters'
      );
    } else if (path.startsWith('/academy') || path.startsWith('/videos')) {
      setIsVideoAcademyOpen(true);
      updatePageSeo(
        'Coffee Academy & Video Masterclasses | The Brew App',
        'Watch curated 4K specialty coffee tutorials, roaster origins, water science, and dial-in masterclasses with synchronized brew timers.',
        'https://thebrew.app/academy'
      );
    } else if (path.includes('smart-bag-scanner') || path.startsWith('/demo') || path.startsWith('/scanner') || path.startsWith('/scan')) {
      setIsRoasterShowcaseView(false);
      setIsScannerOpen(true);
      updatePageSeo(
        'Smart Bag Barcode & QR Scanner Demo | The Brew App',
        'Scan any specialty coffee bag barcode or Smart Bag QR code to automatically dial in grind size, golden ratios, and water temperature in seconds.',
        'https://thebrew.app/demo/smart-bag-scanner'
      );
    } else if (path === '/' || path === '') {
      setIsRoasterShowcaseView(false);
      // Check for Smart Bag deep link query parameters or video parameter:
      const searchParams = new URLSearchParams(location.search);
      const videoParam = searchParams.get('video');
      if (videoParam) {
        setSelectedAcademyVideoId(videoParam);
        setIsVideoAcademyOpen(true);
      }
      const roasterParam = searchParams.get('roaster');
      const beanParam = searchParams.get('bean');
      const stepParam = searchParams.get('step');
      if (stepParam) {
        setCurrentStep(parseInt(stepParam));
      } else if (roasterParam || beanParam) {
        const methodParam = searchParams.get('method');
        const ratioParam = parseFloat(searchParams.get('ratio'));
        const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
        const found = allMethods.find(m => m.id === methodParam) || allMethods[0];
        setActiveMethod(found);
        if (ratioParam) setCustomRatio(ratioParam);
        setTrackMode('coffee');
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
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
  }, [location.pathname, location.search]);

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
    <AppOrchestratorProvider
      onApplyRecipeToTimer={handleApplyScannedRecipe}
      onSaveRecipeToJournal={handleSaveScannedToJournal}
      onOpenScanner={() => setIsScannerOpen(true)}
      onOpenPackagingStudio={(coffee) => {
        if (coffee?.packaging?.upc) setRoasterPrefillBarcode(coffee.packaging.upc);
        if (coffee) setRoasterPrefillBean(coffee);
        setIsRoasterPortalOpen(true);
      }}
      onOpenWaterLab={() => setIsWaterLabOpen(true)}
      onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
      onOpenJournal={() => setIsJournalOpen(true)}
      navigate={navigate}
    >
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
          onOpenRoasterPortal={() => { setRoasterPrefillBarcode(''); setRoasterPrefillBean(null); setIsRoasterPortalOpen(true); }}
          onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          onOpenRoasterShowcase={() => {
            setIsRoasterShowcaseView(true);
            navigate('/roasters');
          }}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          currentUser={currentUser}
        />
        
        {/* Step Progress Bar Pinned Inside Sticky Top Bar (hidden in Roaster Showcase) */}
        {!isRoasterShowcaseView && (
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
        )}
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">

        <main className="mt-4 space-y-10">

          {isRoasterShowcaseView ? (
            <RoasterProfilePage
              initialRoasterId={selectedRoasterSlug}
              onBackToApp={() => {
                setIsRoasterShowcaseView(false);
                navigate('/');
              }}
              onBrewCoffee={(coffee) => {
                setIsRoasterShowcaseView(false);
                handleApplyScannedRecipe(coffee);
              }}
              onOpenWaterLabWithProfile={(waterProfile) => {
                setIsWaterLabOpen(true);
              }}
              onOpenRoasterPortalWithBean={(bean) => {
                setRoasterPrefillBean(bean);
                setIsRoasterPortalOpen(true);
              }}
              onOpenRoasterInfo={() => {
                setIsRoasterInfoOpen(true);
              }}
            />
          ) : (
            <>
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
            <div id="step-4" className="animate-fade-in space-y-6">
              {dialedInCoffee && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <div>
                      <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-gold font-bold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Roaster Certified Dial-In Active</span>
                      </div>
                      <div className="text-sm sm:text-base font-serif font-bold text-cream-light">
                        {dialedInCoffee.roaster} • {dialedInCoffee.beanName}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono text-cream-soft bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 self-start sm:self-auto">
                    <span>1:{effectiveRatio}</span>
                    <span>•</span>
                    <span>{dryDoseGrams}g : {calculatedTotalWaterMl}g</span>
                    {(dialedInCoffee.tempF || dialedInCoffee.extraction?.tempF) && (
                      <>
                        <span>•</span>
                        <span className="text-amber-gold font-bold">
                          {dialedInCoffee.tempF || dialedInCoffee.extraction?.tempF}°F
                        </span>
                      </>
                    )}
                    {(dialedInCoffee.recommendedGrind || dialedInCoffee.extraction?.grind) && (
                      <>
                        <span>•</span>
                        <span className="text-cream-light font-bold">
                          {dialedInCoffee.recommendedGrind || dialedInCoffee.extraction?.grind}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

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

          {/* Brew News Dispatch Section */}
          <WorldNewsSection trackMode={trackMode} />
        </>
      )}

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
            onSelectRecipe={(recipe) => {
              const allMethods = [...BREW_METHODS.coffee, ...BREW_METHODS.tea];
              const match = allMethods.find(m => m.id === recipe.methodId);
              if (match) {
                handleSelectMethodFromGrid(match);
              }
              if (recipe.ratio) setCustomRatio(recipe.ratio);
              setCurrentStep(2);
              setIsSearchOpen(false);
            }}
            onSelectOrigin={(origin) => {
              setCurrentStep(3);
              setIsSearchOpen(false);
              setTimeout(() => {
                const el = document.getElementById('step-3');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
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
            onClose={() => {
              setIsScannerOpen(false);
              if (location.pathname.includes('smart-bag-scanner') || location.pathname.startsWith('/demo') || location.pathname.startsWith('/scanner') || location.pathname.startsWith('/scan')) {
                navigate('/', { replace: true });
              }
            }}
            onApplyRecipe={handleApplyScannedRecipe}
            onSaveToJournal={handleSaveScannedToJournal}
            onOpenRoasterPortal={(code, bean) => {
              setRoasterPrefillBarcode(typeof code === 'string' ? code : '');
              setRoasterPrefillBean(bean || null);
              setIsRoasterPortalOpen(true);
            }}
            onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          />

          {/* Specialty Roaster Partner Information & Contact HQ Page */}
          <RoasterInfoPage
            isOpen={isRoasterInfoOpen}
            onClose={() => setIsRoasterInfoOpen(false)}
            onOpenStudio={() => {
              setIsRoasterInfoOpen(false);
              setIsRoasterPortalOpen(true);
            }}
          />

          {/* Specialty Roaster Partner Portal & Smart Bag Packaging Generator Modal */}
          <RoasterPortalModal
            isOpen={isRoasterPortalOpen}
            onClose={() => {
              setIsRoasterPortalOpen(false);
              setRoasterPrefillBarcode('');
              setRoasterPrefillBean(null);
            }}
            prefilledBarcode={roasterPrefillBarcode}
            prefilledBean={roasterPrefillBean}
            onSelectBeanToBrew={handleApplyScannedRecipe}
          />

          {/* Coffee Water Chemistry Lab Modal */}
          <WaterChemistryModal
            isOpen={isWaterLabOpen}
            onClose={() => setIsWaterLabOpen(false)}
          />

          {/* YouTube-Powered Coffee Video Academy & Masterclass Hub */}
          <CoffeeVideoAcademyModal
            isOpen={isVideoAcademyOpen}
            onClose={() => {
              setIsVideoAcademyOpen(false);
              setSelectedAcademyVideoId(null);
            }}
            onBrewWithVideo={handleBrewWithVideo}
            initialVideoId={selectedAcademyVideoId}
          />

        </main>

        {/* Contact HQ Email & App Footer */}
        <Footer
          trackMode={trackMode}
          onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          onOpenRoasterShowcase={() => {
            setIsRoasterShowcaseView(true);
            navigate('/roasters');
          }}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
        />

      </div>
    </div>
    </AppOrchestratorProvider>
  );
}
