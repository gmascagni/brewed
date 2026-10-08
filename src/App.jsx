import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
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
import UserProfileDashboard from './components/UserProfileDashboard';
import GlobalSearchModal from './components/GlobalSearchModal';
import AuthModal from './components/AuthModal';
import LocalCoffeeFinderModal from './components/LocalCoffeeFinderModal';
import ShopDrawer from './components/ShopDrawer';
import WorldNewsSection from './components/WorldNewsSection';
import RoasterInfoPage from './components/RoasterInfoPage';
import RoasterProfilePage from './components/RoasterProfilePage';
import CoffeeLandingPage from './components/CoffeeLandingPage';
import ConsumerDiscoveryFeed from './components/ConsumerDiscoveryFeed';
import CafePartnerPortal from './components/CafePartnerPortal';
import { getShowcaseRoaster, normalizeRoasterKey } from './data/roasterShowcaseData';

// Code-split heavy on-demand modals with React.lazy
const BarcodeScannerModal = lazy(() => import('./components/BarcodeScannerModal'));
const WaterChemistryModal = lazy(() => import('./components/WaterChemistryModal'));
const RoasterPortalModal = lazy(() => import('./components/RoasterPortalModal'));
const CoffeeVideoAcademyModal = lazy(() => import('./components/CoffeeVideoAcademyModal'));
const RecipeBuilderModal = lazy(() => import('./components/RecipeBuilderModal'));
const CommunityHubModal = lazy(() => import('./components/CommunityHubModal'));
const VersionHistoryModal = lazy(() => import('./components/VersionHistoryModal'));
import LearnSection from './components/LearnSection';
import RecipeExplorer from './components/RecipeExplorer';
import BrewCoffeeSelector from './components/BrewCoffeeSelector';
import MyCoffeeHub from './components/MyCoffeeHub';
import MobileBottomNav from './components/MobileBottomNav';
import MobileToolsDrawer from './components/MobileToolsDrawer';
import Footer from './components/Footer';
import { AppOrchestratorProvider } from './context/AppOrchestratorContext';
import { BREW_METHODS } from './data/brewData';
import { initGA, trackEvent } from './utils/analytics';
import { recordTelemetryEvent } from './utils/telemetry';
import { getMethodJsonLd, updatePageSeo } from './utils/seo';
import { syncCloudCatalog, findCoffeeBySlugs, slugify } from './data/roasterRegistry';
import { signOutRoasterAccount } from './services/firebase';
import { parseRecipePayload } from './utils/recipeParser';
import { getAssetUrl } from './utils/assetUrl';
import { getRecentBrews, JOURNAL_UPDATED_EVENT, JOURNAL_STORAGE_KEY, logBrewSession } from './utils/journalStorage';
import { saveActiveBrewSession, createNextIterationSession, startOrGetActiveBrewSession, OPEN_JOURNAL_EVENT } from './utils/brewSessionManager';
import { ChevronRight, ChevronLeft, Sparkles, Coffee, Clock, Play, BookOpen, Store } from 'lucide-react';
import { getCoffeeProvenance } from './utils/roasterVerification';

// Pre-configured Verified Roaster Profile for CL Pickens (Brookmill Roaster)
export const CL_PICKEN_ROASTER_USER = {
  uid: 'user_clpicken',
  email: 'clpicken@live.com',
  username: '@clpicken',
  displayName: 'CL Pickens',
  role: 'roaster',
  isVerifiedRoaster: true,
  accountType: 'roaster',
  roasterName: 'Brookmill Coffee Roasters',
  roasterSlug: 'brookmill-roaster',
  avatar: '/avatar_roast_beans.jpg',
  bio: 'Founder & Head Artisan Roaster at Brookmill Coffee Roasters in Alpharetta, GA. Dialing in precision extraction profiles.'
};

const DEFAULT_LOCAL_PROFILES = [];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Main Application State
  const [trackMode, setTrackMode] = useState('coffee'); // 'coffee' | 'tea'
  const [unitSystem, setUnitSystem] = useState('imperial'); // 'imperial' | 'metric'
  const [isMuted, setIsMuted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1 | 2 | 3 | 4
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);

  // User Accounts State (Persisted in localStorage)
  const [usersList, setUsersList] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_local_users');
      let list = saved ? JSON.parse(saved) : [];
      // Clean up any historical fake personas
      list = list.filter((u) => u && u.username !== '@barista_pro' && u.email !== 'alex@specialtybrew.org');
      // Ensure CL Pickens Brookmill Roaster profile is always available
      if (!list.some((u) => u && (u.username === '@clpicken' || u.email === 'clpicken@live.com' || u.roasterSlug === 'brookmill-roaster'))) {
        list.unshift(CL_PICKEN_ROASTER_USER);
      }
      return list;
    } catch {
      return [CL_PICKEN_ROASTER_USER];
    }
  });

  // Currently Active Logged In User (Persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_active_user') || localStorage.getItem('the_brew_app_current_user');
      const user = saved ? JSON.parse(saved) : null;
      if (user && (user.username === '@barista_pro' || user.email === 'alex@specialtybrew.org')) {
        localStorage.removeItem('the_brew_app_active_user');
        localStorage.removeItem('the_brew_app_current_user');
        return null;
      }
      return user || null;
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
  useEffect(() => {
    const handleOpenJournalEvent = () => setIsJournalOpen(true);
    window.addEventListener(OPEN_JOURNAL_EVENT, handleOpenJournalEvent);
    return () => window.removeEventListener(OPEN_JOURNAL_EVENT, handleOpenJournalEvent);
  }, []);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isRecipeBuilderOpen, setIsRecipeBuilderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState('user');
  const [authInitialMode, setAuthInitialMode] = useState('signup');

  const handleOpenAuth = (roleOrConfig = 'user') => {
    if (typeof roleOrConfig === 'object' && roleOrConfig !== null) {
      setAuthInitialRole(roleOrConfig.role || 'user');
      setAuthInitialMode(roleOrConfig.mode || 'signup');
    } else {
      setAuthInitialRole(roleOrConfig || 'user');
      setAuthInitialMode('signup');
    }
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    signOutRoasterAccount().catch(() => {});
    setCurrentUser(null);
  };
  const [isLocalCoffeeOpen, setIsLocalCoffeeOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isWaterLabOpen, setIsWaterLabOpen] = useState(false);
  const [isRoasterPortalOpen, setIsRoasterPortalOpen] = useState(false);
  const [isRoasterInfoOpen, setIsRoasterInfoOpen] = useState(false);
  const [roasterPrefillBarcode, setRoasterPrefillBarcode] = useState('');
  const [roasterPrefillBean, setRoasterPrefillBean] = useState(null);
  const [roasterPortalInitialTab, setRoasterPortalInitialTab] = useState(null);
  const [activeCustomerCoffee, setActiveCustomerCoffee] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/^\/brewed/, '');
      const parts = p.split('/').filter(Boolean);
      const RESERVED_PATHS = [
        'methods', 'guides', 'discover', 'academy', 'videos', 'learn',
        'recipes', 'recipe', 'my-coffee', 'journal', 'profile', 'shops',
        'cafes', 'local', 'demo', 'smart-bag-scanner', 'scanner', 'scan',
        'brewed', 'api', 'images', 'static', 'emails', 'r'
      ];
      let rSlug = null;
      let cSlug = null;
      if (parts.length === 2 && !RESERVED_PATHS.includes(parts[0].toLowerCase())) {
        rSlug = parts[0];
        cSlug = parts[1];
      } else if (parts.length === 3 && (parts[0] === 'roasters' || parts[0] === 'roaster')) {
        rSlug = parts[1];
        cSlug = parts[2];
      }
      if (rSlug && cSlug) {
        return findCoffeeBySlugs(rSlug, cSlug);
      }
    }
    return null;
  });

  const [currentArea, setCurrentArea] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/^\/brewed/, '');
      const parts = p.split('/').filter(Boolean);
      const RESERVED_PATHS = [
        'methods', 'guides', 'discover', 'academy', 'videos', 'learn',
        'recipes', 'recipe', 'my-coffee', 'journal', 'profile', 'shops',
        'cafes', 'local', 'demo', 'smart-bag-scanner', 'scanner', 'scan',
        'brewed', 'api', 'images', 'static', 'emails', 'r'
      ];
      if ((parts.length === 2 && !RESERVED_PATHS.includes(parts[0].toLowerCase())) || (parts.length === 3 && (parts[0] === 'roasters' || parts[0] === 'roaster'))) {
        const rSlug = parts.length === 2 ? parts[0] : parts[1];
        const cSlug = parts.length === 2 ? parts[1] : parts[2];
        if (findCoffeeBySlugs(rSlug, cSlug)) {
          return 'coffee';
        }
      }

      const search = window.location.search || '';
      const params = new URLSearchParams(search);
      const hasRecipeParams = params.has('recipe') || params.has('bean') || params.has('coffee') || params.has('method');
      if (!hasRecipeParams && (p.startsWith('/roasters') || p.startsWith('/roaster') || p.startsWith('/discover') || search.includes('slug='))) {
        return 'discover';
      }
      if (p.startsWith('/shops') || p.startsWith('/cafes') || p.startsWith('/local')) {
        return 'cafes';
      }
      if (p.startsWith('/learn') || p.startsWith('/academy') || p.startsWith('/videos') || p.startsWith('/guides')) {
        return 'learn';
      }
      if (p.startsWith('/recipes') || p.startsWith('/recipe') || p.startsWith('/my-coffee') || p.startsWith('/journal') || p.startsWith('/profile')) {
        return 'my_coffee';
      }
    }
    return 'brew';
  });

  const [isCafePartnerPortalOpen, setIsCafePartnerPortalOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [selectedRoasterSlug, setSelectedRoasterSlug] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/^\/brewed/, '');
      if (p.startsWith('/roasters') || p.startsWith('/roaster')) {
        const parts = p.split('/').filter(Boolean);
        if (parts.length > 1 && !['showcase', 'partner', 'info', 'roasters', 'roaster', 'registered'].includes(parts[1].toLowerCase())) {
          return parts[1];
        }
        return 'methodical';
      }
      const searchParams = new URLSearchParams(window.location.search);
      const querySlug = searchParams.get('roaster') || searchParams.get('slug');
      if (querySlug) {
        return querySlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }
    }
    return null;
  });

  // Backward compatible alias flags
  const isRoasterShowcaseView = currentArea === 'discover';
  const isCafePortalView = currentArea === 'cafes' && isCafePartnerPortalOpen;
  const isLearnView = currentArea === 'learn';
  const isRecipesView = currentArea === 'my_coffee';
  const isShopsView = currentArea === 'cafes' && !isCafePartnerPortalOpen;

  const [isVideoAcademyOpen, setIsVideoAcademyOpen] = useState(false);
  const [selectedAcademyVideoId, setSelectedAcademyVideoId] = useState(null);
  const [dialedInCoffee, setDialedInCoffee] = useState(null);
  const [customGrind, setCustomGrind] = useState(null);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  // Track offline status for PWA offline resilience
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track whether any full-screen modal overlay is active
  const isAnyModalOpen = Boolean(
    isJournalOpen ||
    isSearchOpen ||
    isProfileOpen ||
    isCommunityOpen ||
    isRecipeBuilderOpen ||
    isAuthModalOpen ||
    isLocalCoffeeOpen ||
    isScannerOpen ||
    isWaterLabOpen ||
    isRoasterPortalOpen ||
    isRoasterInfoOpen ||
    isVersionHistoryOpen ||
    isVideoAcademyOpen ||
    isMobileToolsOpen
  );

  // Primary Action Throughout App: Start a Brew
  const handleStartBrew = (initialMethod = null, initialCoffee = null) => {
    setCurrentArea('brew');
    if (initialCoffee) {
      setSelectedCoffee(initialCoffee);
      setDialedInCoffee(initialCoffee);
      if (initialCoffee.recommendedRatio) setCustomRatio(Number(initialCoffee.recommendedRatio));
      if (initialCoffee.recommendedGrind) setCustomGrind(initialCoffee.recommendedGrind);
    }
    if (initialMethod) {
      setActiveMethod(initialMethod);
      setCurrentStep(initialCoffee ? 3 : 2);
      navigate(`/methods/${initialMethod.id}`);
    } else if (currentActiveMethod) {
      setCurrentStep(2);
      navigate(`/methods/${currentActiveMethod.id}`);
    } else {
      setCurrentStep(1);
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Brew Along With Video Action
  const handleBrewWithVideo = (video) => {
    if (!video || !video.recipeSync) return;
    const { methodId, ratio } = video.recipeSync;
    const allMethods = BREW_METHODS.coffee;
    const targetMethod = allMethods.find(m => m.id === methodId) || allMethods[0];
    setActiveMethod(targetMethod);
    if (ratio) {
      setCustomRatio(ratio);
    }
    setIsVideoAcademyOpen(false);
    setCurrentArea('brew');
    setCurrentStep(4); // Advance straight to the active guided timer so user brews along
    navigate(`/methods/${targetMethod.id}`);
    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    trackEvent('brew_with_video_applied', { video_id: video.id, method_id: targetMethod.id, ratio });
  };

  // Handler for Brew News navigation (resets sub-views, opens Learn, and smoothly scrolls)
  const handleOpenBrewNews = () => {
    setCurrentArea('learn');
    navigate('/learn');
    window.dispatchEvent(new CustomEvent('open-world-news'));
    const tryScroll = (attempts = 0) => {
      const el = document.getElementById('world-news');
      if (el) {
        const topPos = el.getBoundingClientRect().top + window.pageYOffset - 70;
        window.scrollTo({ top: Math.max(topPos, 450), behavior: 'auto' });
      } else if (attempts < 20) {
        setTimeout(() => tryScroll(attempts + 1), 50);
      }
    };
    setTimeout(() => tryScroll(0), 50);
  };

  // Handler for Specialty Roaster Showcase Navigation
  const handleOpenRoasterShowcase = (slug = null) => {
    setCurrentArea('discover');
    if (slug) {
      setSelectedRoasterSlug(slug);
      navigate(`/roasters/${slug}`);
    } else {
      setSelectedRoasterSlug(null);
      navigate('/roasters');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for Selecting Coffee from Discover Feed or Roaster Page
  const handleSelectBeanToBrew = (bean) => {
    if (!bean) return;
    setSelectedCoffee(bean);
    setDialedInCoffee(bean);
    if (bean.recommendedRatio) setCustomRatio(Number(bean.recommendedRatio));
    if (bean.recommendedGrind || bean.grindSetting) setCustomGrind(bean.recommendedGrind || bean.grindSetting);
    if (bean.brewMethod) {
      const allMethods = BREW_METHODS.coffee;
      const match = allMethods.find(m => m.id === bean.brewMethod || m.id.includes(bean.brewMethod));
      if (match) setActiveMethod(match);
    }
    setCurrentArea('brew');
    setCurrentStep(3); // Land on Step 3: Recipe & Dial In
    navigate(currentActiveMethod ? `/methods/${currentActiveMethod.id}` : '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unified Handler for Applying Any Recipe (Curated Master, User Custom, or Scanned Bean)
  const handleApplyRecipe = (recipe, targetStep = 3) => {
    if (!recipe) return;

    // 1. Switch to Brew area and close modal overlays
    setCurrentArea('brew');
    setIsScannerOpen(false);
    setIsRoasterPortalOpen(false);
    setIsCommunityOpen(false);
    setIsSearchOpen(false);

    // 2. Resolve method (support exact ID and fuzzy alias)
    const targetMethodId = recipe.methodId || recipe.brewMethod || recipe.extraction?.method || 'pour_over';
    const allMethods = BREW_METHODS.coffee;
    let targetMethod = allMethods.find(m => m.id === targetMethodId) ||
                       allMethods.find(m => m.id.includes(targetMethodId) || targetMethodId.includes(m.id)) ||
                       allMethods[0];

    // 3. Extract ratio, dose, and water volume mathematically
    const ratio = Number(recipe.ratio || recipe.recommendedRatio || recipe.extraction?.ratio || targetMethod.ratio || 16);

    let waterAmount = Number(recipe.waterAmountMl || recipe.waterGrams);
    if (!waterAmount || isNaN(waterAmount) || waterAmount <= 0) {
      const dose = Number(recipe.dryDoseGrams || recipe.doseGrams);
      if (dose && dose > 0) {
        waterAmount = Math.round(dose * ratio);
      } else {
        waterAmount = targetMethod.defaultCupMl || 240;
      }
    }

    const doseAmount = Number(recipe.dryDoseGrams || recipe.doseGrams) || (Math.round((waterAmount / ratio) * 10) / 10);

    setCustomRatio(ratio);
    setCustomWaterMl(waterAmount);
    setCupCount(1);
    setCupMl(waterAmount);

    // 4. Map recipe steps or custom phases to targetMethod phases
    if (recipe.steps && Array.isArray(recipe.steps) && recipe.steps.length > 0) {
      targetMethod = {
        ...targetMethod,
        phases: recipe.steps.map((s, idx) => ({
          name: s.action || `Pour Phase ${s.order || idx + 1}`,
          durationSec: Number(s.durationSec) || 45,
          waterGrams: s.waterMl !== undefined ? Number(s.waterMl) : null,
          instruction: s.action || `Phase ${s.order || idx + 1} extraction`
        }))
      };
    } else if (recipe.customPhases && Array.isArray(recipe.customPhases) && recipe.customPhases.length > 0) {
      targetMethod = {
        ...targetMethod,
        phases: recipe.customPhases
      };
    }

    setActiveMethod(prev => prev?.id === targetMethod.id ? { ...prev, ...targetMethod } : targetMethod);

    // 5. Build coffee & dial-in context
    const grindVal = recipe.grindSetting || recipe.recommendedGrind || targetMethod.grind;
    const tempCVal = recipe.waterTempC || recipe.tempC || targetMethod.tempC;
    const tempFVal = recipe.tempF || (tempCVal ? Math.round((tempCVal * 9/5) + 32) : targetMethod.tempF);

    if (grindVal) {
      setCustomGrind(grindVal);
    }

    const recipeCoffeeContext = {
      beanName: recipe.beanName || recipe.title || 'Selected Recipe Lot',
      roaster: recipe.roasterName || recipe.roaster || recipe.technique || 'Specialty Recipe',
      recommendedGrind: grindVal,
      grindSetting: grindVal,
      tempC: tempCVal,
      tempF: tempFVal,
      recommendedRatio: ratio,
      dryDoseGrams: doseAmount,
      waterAmountMl: waterAmount,
      waterGrams: waterAmount,
      tastingNotes: recipe.tastingNotes || [],
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      description: recipe.description
    };

    setSelectedCoffee(recipeCoffeeContext);
    setDialedInCoffee(recipeCoffeeContext);

    // 6. Advance step and navigate route
    setCurrentStep(targetStep);
    navigate(`/methods/${targetMethod.id}`);

    // 7. Smooth scroll down to active step
    setTimeout(() => {
      const el = document.getElementById(`step-${targetStep}`) || document.querySelector('main');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    trackEvent('recipe_applied', {
      recipe_id: recipe.id,
      title: recipe.title || recipe.beanName,
      method: targetMethod.id,
      ratio,
      waterAmount,
      doseAmount
    });
  };

  // Handlers for Scanned / Roaster Dial-In Actions
  // Handlers for Scanned / Roaster Dial-In Actions
  // Experience Design: The scanned barcode immediately launches into the dialed-in Recipe (Step 3).
  // The recipe includes an option for the consumer to click on the roaster profile and learn about the roaster.
  const handleApplyScannedRecipe = (scannedBean, options = { showRoasterFirst: false }) => {
    if (!scannedBean) return;

    setDialedInCoffee(scannedBean);
    setSelectedCoffee(scannedBean);
    if (scannedBean.recommendedRatio) setCustomRatio(Number(scannedBean.recommendedRatio));
    if (scannedBean.recommendedGrind) setCustomGrind(scannedBean.recommendedGrind);

    trackEvent('dial_in_recipe_applied', {
      roaster: scannedBean.roaster,
      bean: scannedBean.beanName,
      method: scannedBean.brewMethod || 'pour_over',
      ratio: scannedBean.recommendedRatio || 16
    });

    recordTelemetryEvent('bean_dial_in', {
      roaster: scannedBean.roaster,
      beanName: scannedBean.beanName,
      methodId: scannedBean.brewMethod || 'pour_over',
      ratio: Number(scannedBean.recommendedRatio || 16)
    });

    // Optional legacy opt-in for Roaster Story First UX
    if (options.showRoasterFirst && scannedBean.roaster) {
      const rawSlug = scannedBean.roasterSlug || 
                      scannedBean.roaster.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const roasterObj = getShowcaseRoaster(rawSlug) || getShowcaseRoaster(scannedBean.roaster);
      const targetSlug = roasterObj?.slug || roasterObj?.id || rawSlug;

      setCurrentArea('discover');
      setSelectedRoasterSlug(targetSlug);
      navigate(`/roasters/${targetSlug}?bean=${encodeURIComponent(scannedBean.beanName || '')}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Direct recipe launch: Land immediately on Step 3 (Recipe & Dial-In)
    handleApplyRecipe(scannedBean, 3);
  };

  // Handler for clicking the roaster profile from a recipe to learn about the roaster
  const handleViewRoasterProfile = (coffeeOrRoaster) => {
    if (!coffeeOrRoaster) return;
    const roasterName = typeof coffeeOrRoaster === 'string'
      ? coffeeOrRoaster
      : (coffeeOrRoaster.roaster || coffeeOrRoaster.roasterName || coffeeOrRoaster.roasterSlug || 'methodical');
    const slug = typeof coffeeOrRoaster === 'object' && coffeeOrRoaster.roasterSlug
      ? coffeeOrRoaster.roasterSlug
      : normalizeRoasterKey(roasterName);
    const roasterObj = getShowcaseRoaster(slug) || getShowcaseRoaster(roasterName);
    const targetSlug = roasterObj?.slug || roasterObj?.id || slug;

    setCurrentArea('discover');
    setSelectedRoasterSlug(targetSlug);
    const beanName = typeof coffeeOrRoaster === 'object' && coffeeOrRoaster.beanName ? coffeeOrRoaster.beanName : '';
    navigate(`/roasters/${targetSlug}${beanName ? `?bean=${encodeURIComponent(beanName)}` : ''}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for applying closed-loop dial-in engine tweaks to next brew
  const handleApplyNextBrewTweak = (recipePatch, nextSession = null) => {
    if (!recipePatch) return;
    const tweak = recipePatch.singleVariableTweak;

    if (tweak?.variable === 'grind') {
      const newGrind = tweak.targetGrindSetting || recipePatch.grindSetting;
      if (newGrind) {
        setCustomGrind(newGrind);
        setDialedInCoffee(prev => ({
          ...(prev || {}),
          recommendedGrind: newGrind,
          grindSetting: newGrind
        }));
      }
    } else if (tweak?.variable === 'temp') {
      const newTempF = tweak.targetTempF || recipePatch.tempF;
      if (newTempF) {
        setDialedInCoffee(prev => ({
          ...(prev || {}),
          tempF: newTempF
        }));
      }
    } else if (tweak?.variable === 'ratio') {
      const newRatio = tweak.targetRatio || recipePatch.ratio;
      if (newRatio) {
        setCustomRatio(Number(newRatio));
        setDialedInCoffee(prev => ({
          ...(prev || {}),
          recommendedRatio: Number(newRatio)
        }));
      }
    } else {
      if (recipePatch.grindSetting) {
        setCustomGrind(recipePatch.grindSetting);
      }
      if (recipePatch.ratio) {
        setCustomRatio(Number(recipePatch.ratio));
      }
      if (recipePatch.tempF) {
        setDialedInCoffee(prev => ({
          ...(prev || {}),
          tempF: recipePatch.tempF
        }));
      }
    }

    // nextSession was already saved by createNextIterationSession() — no need to save again here.
    // Direct transition to timer so the barista can brew immediately
    setCurrentStep(4);
    navigate(`/methods/${activeMethod?.id || 'pour_over'}`);
    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // Handler for Quick-Start Direct Brew from Hero Calculator
  const handleLaunchDirectBrew = ({ methodId, waterGrams, ratio }) => {
    const allMethods = BREW_METHODS.coffee;
    const targetMethod = allMethods.find(m => m.id === methodId) ||
                         allMethods.find(m => m.id.includes(methodId) || methodId.includes(m.id)) ||
                         allMethods[0];
    const finalRatio = Number(ratio || targetMethod.ratio || 16);
    const finalWater = Number(waterGrams || 300);

    setActiveMethod(prev => prev?.id === targetMethod.id ? prev : targetMethod);
    setCustomRatio(finalRatio);
    setCustomWaterMl(finalWater);
    setCupCount(1);
    setCupMl(finalWater);

    setCurrentStep(4);
    navigate(`/methods/${targetMethod.id}`);

    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    trackEvent('hero_calculator_brew_started', {
      method: targetMethod.id,
      waterGrams: finalWater,
      ratio: finalRatio
    });
  };

  const handleSaveScannedToJournal = (scannedBean) => {
    if (!scannedBean) return;
    try {
      const provenance = getCoffeeProvenance(scannedBean, scannedBean.roasterProfile || null, currentUser);
      const dose = 18;
      const ratio = scannedBean.recommendedRatio || 16;
      const water = dose * ratio;
      const methodId = String(scannedBean.brewMethod || 'pour_over').replace(/\s+/g, '_');

      logBrewSession({
        trackMode: 'coffee',
        methodId,
        methodName: methodId.replace(/_/g, ' '),
        beanName: scannedBean.beanName,
        roaster: scannedBean.roaster,
        doseGrams: dose,
        waterMl: water,
        ratio,
        tempF: scannedBean.tempF || 200,
        grindName: scannedBean.recommendedGrind || 'Medium-Fine',
        grinderSetting: scannedBean.recommendedGrind || 'Medium-Fine',
        rating: 5,
        tastingNotes: scannedBean.tastingNotes || [],
        notes: `${scannedBean.notes || ''} (Origin: ${scannedBean.origin || 'Specialty'}, Altitude: ${scannedBean.elevation || '1800+ MASL'})`,
        userId: currentUser?.uid || null,
        isPublic: false,
        // Attach provenance metadata via notes (logBrewSession doesn't have a provenance field)
        tasteFeedback: 'balanced'
      });
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

  // Recent Brews for 1-Click Replay Shelf (Synced from Tasting Journal)
  const [recentBrews, setRecentBrews] = useState(() => {
    if (typeof window !== 'undefined') {
      return getRecentBrews(3);
    }
    return [];
  });

  useEffect(() => {
    const handleJournalUpdate = () => {
      setRecentBrews(getRecentBrews(3));
    };
    window.addEventListener(JOURNAL_UPDATED_EVENT, handleJournalUpdate);
    window.addEventListener('storage', handleJournalUpdate);
    return () => {
      window.removeEventListener(JOURNAL_UPDATED_EVENT, handleJournalUpdate);
      window.removeEventListener('storage', handleJournalUpdate);
    };
  }, []);

  const handleBrewAgain = (entry) => {
    if (!entry) return;

    const allMethods = BREW_METHODS[entry.trackMode || 'coffee'] || BREW_METHODS.coffee;
    const targetMethod = allMethods.find(m => m.id === entry.methodId) ||
                         allMethods.find(m => m.name?.toLowerCase() === (entry.methodName || '').toLowerCase()) ||
                         allMethods[0];

    // Check if previous entry has a recommended single-variable tweak to apply
    const tweak = entry.singleVariableTweak;
    let nextGrind = entry.grinderSetting || entry.grindStr || 'Medium-Fine';
    let nextTempF = Number(entry.tempF) || parseInt(String(entry.tempStr || '')) || 202;
    let nextRatio = parseFloat(String(entry.ratioStr || '').replace('1 :', '').trim()) || entry.ratio || 16;
    let nextWater = parseFloat(String(entry.waterStr || '').replace(/[^0-9.]/g, '')) || entry.waterMl || 300;

    const currentDose = Number(entry.doseGrams) || parseFloat(entry.doseStr) || 18;
    if (tweak) {
      if (tweak.variable === 'grind' && tweak.targetGrindSetting) {
        nextGrind = tweak.targetGrindSetting;
      } else if (tweak.variable === 'temp' && tweak.targetTempF) {
        nextTempF = tweak.targetTempF;
      } else if (tweak.variable === 'ratio' && tweak.targetRatio) {
        nextRatio = tweak.targetRatio;
        nextWater = Math.round(currentDose * nextRatio);
      }
    }

    setActiveMethod(targetMethod);
    setTrackMode(entry.trackMode || 'coffee');
    setCustomRatio(nextRatio);
    setCustomWaterMl(nextWater);
    setCupCount(1);
    const brewCoffeeContext = {
      beanName: entry.beanName,
      roaster: entry.roaster,
      recommendedGrind: nextGrind,
      grindSetting: nextGrind,
      tempF: nextTempF,
      recommendedRatio: nextRatio
    };

    setDialedInCoffee(brewCoffeeContext);
    setSelectedCoffee(brewCoffeeContext);
    setCustomGrind(nextGrind);

    // Create and prime next iteration session (createNextIterationSession automatically saves and dispatches event)
    const nextSession = createNextIterationSession(entry, tweak);

    // Close Tasting Journal modal if open so the user immediately sees the guided timer
    setIsJournalOpen(false);

    setCurrentStep(4);
    navigate(`/methods/${targetMethod.id}`);

    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    trackEvent('brew_again_launched', {
      method: targetMethod.id,
      bean: entry.beanName,
      roaster: entry.roaster,
      sessionIndex: nextSession?.sessionIndex || 2
    });
  };

  // Masterclass & Split Screen State
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);
  const lastInboundUrlRef = useRef('');

  // Initialize Analytics on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initGA(window.GA_MEASUREMENT_ID || 'G-VT2YZ4KHHB');
    }
  }, []);

  // Synchronize React Router URL with Active Method and Steps
  useEffect(() => {
    const rawPath = location.pathname;
    const path = rawPath.startsWith('/brewed') ? (rawPath.replace(/^\/brewed/, '') || '/') : rawPath;

    // Inbound Recipe Link Detection (?recipe=... or /r/<id> or direct query params on home or scanned bag)
    const isRoasterRoute = path.startsWith('/roasters') || path.startsWith('/roaster');
    const fullUrl = typeof window !== 'undefined' ? window.location.href : `${location.pathname}${location.search}${location.hash}`;
    const searchParams = new URLSearchParams(location.search || (typeof window !== 'undefined' ? window.location.search : ''));
    const inboundRecipe = !isRoasterRoute ? parseRecipePayload(fullUrl) : null;
    if (inboundRecipe && lastInboundUrlRef.current !== fullUrl) {
      lastInboundUrlRef.current = fullUrl;
      handleApplyRecipe(inboundRecipe, 3);
      updatePageSeo(
        `${inboundRecipe.beanName} Recipe by ${inboundRecipe.roaster} | TheBrew.App`,
        `Pre-filled specialty coffee brew recipe for ${inboundRecipe.beanName} roasted by ${inboundRecipe.roaster}. Ratio 1:${inboundRecipe.recommendedRatio}, ${inboundRecipe.dryDoseGrams}g coffee, ${inboundRecipe.waterGrams}g water.`,
        `https://thebrew.app/r/${inboundRecipe.id}`
      );
      return;
    }

    // Customer Coffee Deep-Link Detection (e.g. /onyx-coffee-lab/ethiopia-guji-natural or /roasters/onyx-coffee-lab/ethiopia-guji-natural)
    const pathParts = path.split('/').filter(Boolean);
    const RESERVED_PATHS = [
      'methods', 'guides', 'discover', 'academy', 'videos', 'learn',
      'recipes', 'recipe', 'my-coffee', 'journal', 'profile', 'shops',
      'cafes', 'local', 'demo', 'smart-bag-scanner', 'scanner', 'scan',
      'brewed', 'api', 'images', 'static', 'emails', 'r'
    ];
    let candidateRoasterSlug = null;
    let candidateCoffeeSlug = null;

    if (pathParts.length === 2 && !RESERVED_PATHS.includes(pathParts[0].toLowerCase())) {
      candidateRoasterSlug = pathParts[0];
      candidateCoffeeSlug = pathParts[1];
    } else if (pathParts.length === 3 && (pathParts[0] === 'roasters' || pathParts[0] === 'roaster')) {
      candidateRoasterSlug = pathParts[1];
      candidateCoffeeSlug = pathParts[2];
    }

    if (candidateRoasterSlug && candidateCoffeeSlug) {
      const matchedCoffee = findCoffeeBySlugs(candidateRoasterSlug, candidateCoffeeSlug);
      if (matchedCoffee) {
        setActiveCustomerCoffee(matchedCoffee);
        setCurrentArea('coffee');
        updatePageSeo(
          `${matchedCoffee.beanName} | ${matchedCoffee.roaster} | The Brew`,
          `Explore origin details, tasting notes, and roaster-certified dial-in parameters for ${matchedCoffee.beanName}. Scan bag to launch guided brew.`,
          `https://thebrew.app/${slugify(matchedCoffee.roasterSlug || matchedCoffee.roaster)}/${slugify(matchedCoffee.slug || matchedCoffee.beanSlug || matchedCoffee.beanName || matchedCoffee.id)}`
        );
        return;
      }
    }

    if (path.startsWith('/methods/')) {
      setCurrentArea('brew');
      const methodId = path.replace('/methods/', '').replace(/\/$/, '');
      const allMethods = BREW_METHODS.coffee;
      const found = allMethods.find(m => m.id === methodId);

      if (found) {
        setActiveMethod(prev => {
          if (prev?.id === found.id) return prev;
          setCupMl(found.defaultCupMl || 240);
          if (found.id === 'espresso') setCupCount(1);
          setCustomRatio(null);
          setCustomWaterMl(null);
          return found;
        });

        const stepParam = searchParams.get('step');
        if (stepParam) {
          const parsedStep = parseInt(stepParam, 10);
          if (parsedStep >= 1 && parsedStep <= 4) {
            setCurrentStep(parsedStep);
          }
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
    } else if (path.startsWith('/guides/coffee-water-chemistry') || path.startsWith('/guides/water-chemistry-gh-kh')) {
      setIsWaterLabOpen(true);
      const isGhKh = path.startsWith('/guides/water-chemistry-gh-kh');
      updatePageSeo(
        isGhKh
          ? 'Coffee Water Chemistry: GH vs. KH Cheat Sheet | The Brew App'
          : 'Coffee Water Chemistry & Extraction Yield Guide | The Brew App',
        'Master coffee water chemistry: SCA water specs, Lotus drop recipes, DIY mineral recipes (GH & KH), and extraction yield optimization for specialty coffee.',
        isGhKh
          ? 'https://thebrew.app/guides/water-chemistry-gh-kh'
          : 'https://thebrew.app/guides/coffee-water-chemistry'
      );
    } else if (isRoasterRoute || path.startsWith('/discover')) {
      setCurrentArea('discover');
      if (path === '/roasters/partner' || path === '/roasters/info') {
        setIsRoasterInfoOpen(true);
      } else {
        const fullPath = (typeof window !== 'undefined' ? window.location.pathname : path).replace(/^\/brewed/, '');
        const parts = fullPath.split('/').filter(Boolean);
        const querySlug = searchParams.get('roaster') || searchParams.get('slug');
        if (parts.length > 1 && !['showcase', 'partner', 'info', 'roasters', 'roaster', 'registered'].includes(parts[1].toLowerCase())) {
          setSelectedRoasterSlug(parts[1]);
        } else if (querySlug) {
          const formattedSlug = querySlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          setSelectedRoasterSlug(formattedSlug);
        } else {
          setSelectedRoasterSlug('methodical');
        }
      }
      updatePageSeo(
        'Specialty Coffee Roaster Showcase & Dial-In Lab | The Brew App',
        'Explore verified specialty coffee roasters, authentic origin stories, and certified dial-in recipes with golden ratios, grind sizes, and water chemistry.',
        'https://thebrew.app/roasters'
      );
    } else if (path.startsWith('/academy') || path.startsWith('/videos')) {
      setCurrentArea('learn');
      setIsVideoAcademyOpen(true);
      updatePageSeo(
        'Coffee Academy & Video Masterclasses | The Brew App',
        'Learn specialty coffee brewing from world barista champions: James Hoffmann, Lance Hedrick, and Onyx Coffee Lab.',
        'https://thebrew.app/academy'
      );
    } else if (path.startsWith('/learn')) {
      setCurrentArea('learn');
      updatePageSeo(
        'Specialty Coffee Learning Center & Extraction Science | TheBrew.App',
        'Master specialty coffee brewing: video masterclasses, extraction channeling diagnostics, SCA water mineral chemistry, and gear guides.',
        'https://thebrew.app/learn'
      );
    } else if (path.startsWith('/recipes') || path.startsWith('/recipe') || path.startsWith('/my-coffee') || path.startsWith('/journal') || path.startsWith('/profile')) {
      setCurrentArea('my_coffee');
      setIsCommunityOpen(false);
      updatePageSeo(
        'Specialty Coffee Master Recipe Vault & Personal Studio | TheBrew.App',
        'Explore verified benchmark extraction guides from world champions and craft your own custom recipes saved locally on your device.',
        'https://thebrew.app/recipes'
      );
    } else if (path.startsWith('/shops') || path.startsWith('/cafes') || path.startsWith('/local')) {
      setCurrentArea('cafes');
      setIsCafePartnerPortalOpen(false);
      setIsLocalCoffeeOpen(false);
      updatePageSeo(
        'Find Specialty Coffee Shops Near Me | TheBrew.App',
        'Live GPS radar and directory for finding artisan coffee roasters, third-wave espresso bars, and specialty cafes near your physical location.',
        'https://thebrew.app/shops'
      );
    } else if (path.includes('smart-bag-scanner') || path.startsWith('/demo') || path.startsWith('/scanner') || path.startsWith('/scan') || location.search.includes('scanner=') || location.search.includes('scan=')) {
      setIsScannerOpen(true);
      updatePageSeo(
        'Smart Bag Barcode & QR Scanner Demo | The Brew App',
        'Scan any specialty coffee bag barcode or Smart Bag QR code to automatically dial in grind size, golden ratios, and water temperature in seconds.',
        'https://thebrew.app/demo/smart-bag-scanner'
      );
    } else if (path === '/' || path === '') {
      setCurrentArea('brew');
      // Check for Smart Bag deep link query parameters or video parameter:
      const searchParams = new URLSearchParams(location.search);
      const videoParam = searchParams.get('video');
      if (videoParam) {
        setSelectedAcademyVideoId(videoParam);
        setIsVideoAcademyOpen(true);
      }
      const roasterParam = searchParams.get('roaster');
      const beanParam = searchParams.get('bean');
      const recipeParam = searchParams.get('recipe');
      const stepParam = searchParams.get('step');
      if (stepParam) {
        setCurrentStep(parseInt(stepParam));
      } else if (recipeParam || roasterParam || beanParam) {
        // Direct recipe deep link: Land directly on Step 3: Recipe & Dial-In!
        const methodParam = searchParams.get('method');
        const ratioParam = parseFloat(searchParams.get('ratio'));
        const allMethods = BREW_METHODS.coffee;
        const found = allMethods.find(m => m.id === methodParam || m.id.includes(methodParam)) || allMethods[0];
        setActiveMethod(found);
        setCupMl(found.defaultCupMl || 240);
        if (found.id === 'espresso') setCupCount(1);
        if (ratioParam) setCustomRatio(ratioParam);

        const rName = searchParams.get('roasterName') || roasterParam || 'Specialty Roaster';
        const rSlug = roasterParam || normalizeRoasterKey(rName);
        const coffeeContext = {
          beanName: beanParam || searchParams.get('coffee') || 'Scanned Bag Micro-Lot',
          roaster: rName,
          roasterSlug: rSlug,
          recommendedRatio: ratioParam || found.ratio || 16.5,
          recommendedGrind: searchParams.get('grind') || found.grind || 'Medium-Fine',
          tempF: parseInt(searchParams.get('tempF') || searchParams.get('temp_f') || found.tempF || '202', 10),
          brewMethod: found.id,
          tastingNotes: searchParams.get('notes') ? searchParams.get('notes').split(',').map(s => s.trim()) : [],
          roastLevel: searchParams.get('roast') || 'Medium Roast',
          origin: searchParams.get('origin') || 'Specialty Single Origin',
          isBagRecipe: true
        };
        setSelectedCoffee(coffeeContext);
        setDialedInCoffee(coffeeContext);
        if (coffeeContext.recommendedGrind) setCustomGrind(coffeeContext.recommendedGrind);
        setCurrentStep(3);
      } else {
        setCurrentStep(1);
      }
      updatePageSeo(
        'The Art of Extraction',
        'Precision specialty coffee extraction ratio scaler, multi-phase countdown timer, burr grinder macro texture guide, and troubleshooting compendium.',
        'https://thebrew.app/'
      );

      // Clean up JSON-LD on homepage
      const existingScript = document.getElementById('json-ld-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
    }
  }, [location.pathname, location.search]);

  const handleSelectMethodFromGrid = (method) => {
    if (currentActiveMethod?.id === method.id) {
      setCurrentStep(2);
      navigate(`/methods/${method.id}`);
    } else {
      setActiveMethod(method);
      setCupMl(method.defaultCupMl || 240);
      if (method.id === 'espresso') {
        setCupCount(1);
      }
      setCustomRatio(null);
      setCustomWaterMl(null);
      setCustomGrind(null);
      if (setActiveVideo) setActiveVideo(null);
    }
    trackEvent('select_method', { method_id: method.id, method_name: method.name });
  };

  const handleSelectBrewerFromHero = (brewerId) => {
    const allMethods = BREW_METHODS.coffee;
    const match = allMethods.find(m => m.id === brewerId || (brewerId === 'pour_over' && (m.id === 'pour_over' || m.id === 'classic_pour_over'))) || allMethods[0];
    if (match) {
      handleSelectMethodFromGrid(match);
      trackEvent('select_hero_brewer', { brewer_id: brewerId, method_name: match.name });
    }
  };

  const isCoffee = true;

  // Sync body theme class
  useEffect(() => {
    document.body.className = 'theme-coffee';
  }, []);

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
  const effectiveRatio = customRatio !== null ? customRatio : (selectedCoffee?.recommendedRatio ? Number(selectedCoffee.recommendedRatio) : (currentActiveMethod?.ratio || 15));
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
      <div className="min-h-screen font-sans flex flex-col transition-colors duration-700 relative bg-[#FAF7F2] text-[#14110F] selection:bg-[#C48B56] selection:text-white">

      {/* High-Definition Extraction Method Background Image Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          key={activeMethod?.id || 'technique_backdrop'}
          src={getAssetUrl(activeMethod?.heroImage || (trackMode === 'tea' ? '/tea_ceremony.jpg' : '/coffee_setup.jpg'))}
          alt=""
          className="w-full h-full object-cover object-center opacity-55 filter saturate-115 contrast-105 transition-all duration-700"
        />
        {/* Atmospheric Scrim: Tuned for rich warmth and unmistakable visibility while preserving card contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/65 via-[#FAF7F2]/45 to-[#FAF7F2]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#FAF7F2]/20 to-[#FAF7F2]/65" />
      </div>
      
      {/* 100% Bulletproof Sticky Top Header Container */}
      <header className={`sticky top-0 ${isAnyModalOpen ? 'z-20 pointer-events-none' : 'z-40'} backdrop-blur-xl transition-all duration-300 border-b border-[#ECE6DC] bg-[#FAF7F2]/95 shadow-xs pt-1 sm:pt-2 pb-0.5`}>
        <Header
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCommunity={() => setIsCommunityOpen(true)}
          onOpenLocalCoffee={() => {
            setCurrentArea('cafes');
            setIsCafePartnerPortalOpen(false);
            navigate('/shops');
          }}
          onOpenAuth={handleOpenAuth}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWaterLab={() => setIsWaterLabOpen(true)}
          onOpenRoasterPortal={() => { setRoasterPrefillBarcode(''); setRoasterPrefillBean(null); setIsRoasterPortalOpen(true); }}
          onOpenCafePortal={() => { setCurrentArea('cafes'); setIsCafePartnerPortalOpen(true); }}
          onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          onOpenRoasterShowcase={handleOpenRoasterShowcase}
          onOpenMobileTools={() => setIsMobileToolsOpen(true)}
          isRoasterShowcaseView={currentArea === 'discover'}
          isShopsView={currentArea === 'cafes'}
          currentView={currentArea}
          onStartBrew={() => handleStartBrew()}
          onSelectView={(v) => {
            // Dismiss all open modals when navigating primary views
            setIsCommunityOpen(false);
            setIsRoasterPortalOpen(false);
            setIsLocalCoffeeOpen(false);
            setIsWaterLabOpen(false);
            setIsVideoAcademyOpen(false);
            setIsJournalOpen(false);
            setIsProfileOpen(false);
            setIsSearchOpen(false);

            if (v === 'brew') {
              setCurrentArea('brew');
              navigate(currentStep > 1 && currentActiveMethod ? `/methods/${currentActiveMethod.id}` : '/');
            } else if (v === 'discover' || v === 'roasters') {
              setCurrentArea('discover');
              setSelectedRoasterSlug('methodical');
              navigate('/roasters');
            } else if (v === 'cafes') {
              setCurrentArea('cafes');
              setIsCafePartnerPortalOpen(false);
              navigate('/shops');
            } else if (v === 'learn') {
              setCurrentArea('learn');
              navigate('/learn');
            } else if (v === 'my_coffee') {
              setCurrentArea('my_coffee');
              navigate('/recipes');
            }
          }}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
          onOpenNews={handleOpenBrewNews}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          currentUser={currentUser}
        />
        
        {/* Step Progress Bar Pinned Inside Sticky Top Bar (active only in BREW area) */}
        {currentArea === 'brew' && (
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

        {/* Offline PWA Banner */}
        {isOffline && (
          <div className="bg-amber-500/90 text-espresso-950 px-3 py-1.5 text-center text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm animate-fade-in relative z-20">
            <span className="w-2 h-2 rounded-full bg-amber-900 animate-ping" />
            <span>⚡ Offline Mode Active • Core Guided Brew Timer &amp; Saved Recipes 100% Available</span>
          </div>
        )}
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8 relative">

        <main className="mt-4 space-y-10">

          {/* AREA 0: COFFEE CUSTOMER LANDING PAGE (SCAN BAG QR DESTINATION) */}
          {currentArea === 'coffee' && activeCustomerCoffee && (
            <CoffeeLandingPage
              roasterSlug={activeCustomerCoffee.roasterSlug}
              coffeeSlug={activeCustomerCoffee.slug || activeCustomerCoffee.beanSlug || activeCustomerCoffee.id}
              coffee={activeCustomerCoffee}
              onStartGuidedBrew={(coffeeToBrew) => {
                handleSelectBeanToBrew(coffeeToBrew || activeCustomerCoffee);
              }}
              onNavigateToRoaster={(slug) => {
                setSelectedRoasterSlug(slug);
                setCurrentArea('discover');
                navigate(`/roasters/${slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToHome={() => {
                setCurrentArea('brew');
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* AREA 1: DISCOVER (ROASTERS & SINGLE ORIGINS) */}
          {currentArea === 'discover' && (
            selectedRoasterSlug ? (
              <RoasterProfilePage
                initialRoasterId={selectedRoasterSlug}
                onBackToApp={() => {
                  setSelectedRoasterSlug(null);
                  setCurrentArea('brew');
                  if (selectedCoffee || dialedInCoffee) {
                    setCurrentStep(3);
                    const mId = selectedCoffee?.brewMethod || dialedInCoffee?.brewMethod || currentActiveMethod?.id || 'pour_over';
                    navigate(`/methods/${mId}`);
                  } else {
                    setCurrentStep(1);
                    navigate('/');
                  }
                }}
                activeCoffee={selectedCoffee || dialedInCoffee}
                onBrewCoffee={(coffee) => {
                  handleSelectBeanToBrew(coffee);
                }}
                onOpenWaterLabWithProfile={() => {
                  setIsWaterLabOpen(true);
                }}
                onOpenRoasterPortalWithBean={(bean) => {
                  setRoasterPrefillBean(bean);
                  setIsRoasterPortalOpen(true);
                }}
                onOpenRoasterInfo={() => {
                  setIsRoasterInfoOpen(true);
                }}
                onOpenProfile={() => {
                  setIsProfileOpen(true);
                }}
                currentUser={currentUser}
                onOpenAuth={handleOpenAuth}
              />
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ECE6DC]">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-[#A8622D] block">
                      SPECIALTY ROASTERS & COFFEE
                    </span>
                    <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] mt-1">
                      Artisan Roasters & Single-Origin Vault
                    </h2>
                    <p className="text-sm font-sans text-stone-600 mt-1 max-w-xl">
                      Explore farm gate origins, tasting notes, and roaster-certified dial-in parameters for world-class beans.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
                    <span>Scan Any Bag Barcode</span>
                  </button>
                </div>

                <ConsumerDiscoveryFeed
                  activeBrewerId={currentActiveMethod?.id}
                  onSelectBrewerId={handleSelectBrewerFromHero}
                  onSelectBeanToBrew={handleSelectBeanToBrew}
                  onLaunchDirectBrew={handleLaunchDirectBrew}
                  onNavigateToRoaster={(roasterSlug) => {
                    setSelectedRoasterSlug(roasterSlug);
                    navigate(`/roasters/${roasterSlug}`);
                  }}
                  onOpenLocator={() => {
                    setCurrentArea('cafes');
                    navigate('/shops');
                  }}
                  onStartBrewStation={() => {
                    setCurrentArea('brew');
                    setCurrentStep(1);
                    navigate('/');
                  }}
                  onOpenScanner={() => setIsScannerOpen(true)}
                />
              </div>
            )
          )}

          {/* AREA 2: CAFÉS & RADAR */}
          {currentArea === 'cafes' && (
            isCafePartnerPortalOpen ? (
              <CafePartnerPortal
                onClose={() => setIsCafePartnerPortalOpen(false)}
                onNavigateToConsumer={() => setIsCafePartnerPortalOpen(false)}
              />
            ) : (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 animate-fade-in w-full space-y-6" id="local-coffee-shops-section" data-view="cafes" role="region" aria-label="Specialty Coffee Shop & Roaster Radar">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF7F2] to-[#F3EDE2] border border-[#ECE6DC] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#A8622D]/10 text-[#A8622D] flex items-center justify-center font-bold shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                        Are you a specialty cafe owner or artisan roaster?
                      </h3>
                      <p className="text-xs text-stone-600 font-sans">
                        Manage your verified shop pin, retail bean list, and custom brew recipes.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCafePartnerPortalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    Open Partner Portal →
                  </button>
                </div>

                <LocalCoffeeFinderModal
                  isModal={false}
                  isOpen={true}
                  onClose={() => {
                    setCurrentArea('brew');
                    navigate('/');
                  }}
                  trackMode={trackMode}
                />
              </div>
            )
          )}

          {/* AREA 3: LEARN (ACADEMY & SCIENCE) */}
          {currentArea === 'learn' && (
            <LearnSection
              trackMode={trackMode}
              activeMethod={currentActiveMethod}
              activeVideo={activeVideo}
              setActiveVideo={setActiveVideo}
              onOpenWaterLab={() => setIsWaterLabOpen(true)}
              onSelectMethodToBrew={(methodId) => {
                const allMethods = BREW_METHODS.coffee;
                const match = allMethods.find(m => m.id === methodId || m.id.includes(methodId)) || allMethods[0];
                handleSelectMethodFromGrid(match);
                setCurrentArea('brew');
              }}
            />
          )}

          {/* AREA 4: MY COFFEE (JOURNAL, RECIPES, PROFILE, ROASTER TOOLS) */}
          {currentArea === 'my_coffee' && (
            <MyCoffeeHub
              trackMode={trackMode}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              onBrewAgain={(entry) => handleBrewAgain(entry)}
              onSelectRecipe={(recipe) => handleApplyRecipe(recipe, 3)}
              onSelectRecipeToBrew={(recipe) => handleApplyRecipe(recipe, 4)}
              onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
              onSelectBeanToBrew={(bean) => handleSelectBeanToBrew(bean)}
              onOpenScanner={() => setIsScannerOpen(true)}
              activeMethod={currentActiveMethod}
              cupCount={cupCount}
              cupMl={cupMl}
              customRatio={customRatio}
              customGrind={customGrind}
              customWaterMl={calculatedTotalWaterMl}
              unitSystem={unitSystem}
            />
          )}

          {/* AREA 5: BREW (4-STEP GUIDED BREW WORKFLOW) */}
          {currentArea === 'brew' && (
            <>
              {/* STEP 01: CHOOSE BREWER */}
              {currentStep === 1 && (
                <div className="space-y-10 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#ECE6DC]">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold text-[#A8622D] block">
                        STEP 01 OF 04 • BREWING METHOD
                      </span>
                      <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#14110F] mt-1">
                        Choose Your Brewer
                      </h2>
                      <p className="text-sm font-sans text-stone-600 mt-1 max-w-xl">
                        Select your brewing geometry to calibrate flow rate, water dispersion, and extraction dynamics.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 text-[#A8622D] hover:bg-amber-500/25 border border-amber-500/30 text-xs font-mono font-bold transition-all cursor-pointer self-start sm:self-auto"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Have a Bag? Scan Barcode</span>
                    </button>
                  </div>

                  {/* RECENT BREWS • BREW AGAIN IN 1-CLICK SHELF */}
                  {recentBrews && recentBrews.length > 0 && (
                    <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#FAF7F2] to-[#F3EDE2] border border-[#ECE6DC] shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-[#ECE6DC]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#A8622D]/15 text-[#A8622D] flex items-center justify-center font-bold shadow-xs">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-[#A8622D] block">
                              Tasting Journal Sync
                            </span>
                            <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#14110F]">
                              Recent Brews • Brew Again in 1-Click
                            </h3>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentArea('my_coffee');
                            navigate('/recipes');
                          }}
                          className="text-xs font-mono font-bold text-[#A8622D] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                        >
                          <span>Full Tasting Journal ({recentBrews.length})</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentBrews.map((brew) => (
                          <div
                            key={brew.id}
                            className="p-4 rounded-2xl bg-white border border-[#ECE6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 text-left group"
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[#A8622D]">{brew.methodName}</span>
                                  {brew.sessionIndex && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 border border-amber-500/30 text-[9px] font-bold">
                                      Brew #{brew.sessionIndex}
                                    </span>
                                  )}
                                  {brew.evolutionDelta?.isImprovement && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-900 border border-emerald-500/30 text-[9px] font-bold">
                                      ▲ Improved
                                    </span>
                                  )}
                                </div>
                                <span>{brew.date}</span>
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#14110F] line-clamp-1">
                                {brew.beanName}
                              </h4>
                              <p className="text-xs text-stone-500 line-clamp-1">
                                {brew.roaster}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono">
                                <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#ECE6DC] text-stone-700 font-semibold">
                                  {brew.doseStr} • {brew.ratioStr}
                                </span>
                                {brew.grindStr && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#ECE6DC] text-stone-600">
                                    {brew.grindStr}
                                  </span>
                                )}
                                {brew.tasteFeedback && (
                                  <span className={`px-2 py-0.5 rounded-md font-bold ${
                                    brew.tasteFeedback === 'sweet'
                                      ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                                      : brew.tasteFeedback === 'sour'
                                      ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                                      : brew.tasteFeedback === 'bitter'
                                      ? 'bg-rose-500/15 text-rose-800 border border-rose-500/30'
                                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                                  }`}>
                                    {brew.tasteFeedback === 'sweet' ? '✨ Golden Cup' : brew.tasteFeedback === 'sour' ? '🍋 Sour' : brew.tasteFeedback === 'bitter' ? '🪵 Bitter' : '☕ Brewed'}
                                  </span>
                                )}
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleBrewAgain(brew)}
                              className="w-full py-2.5 px-3 rounded-xl bg-[#14110F] hover:bg-[#A8622D] text-white font-mono text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 group-hover:scale-[1.01] active:scale-95 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Brew Again in 1-Click</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div id="brew-atelier" className="pt-2">
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
                  </div>
                </div>
              )}

              {/* STEP 02: COFFEE & ROAST PROFILE SELECTION */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <BrewCoffeeSelector
                    selectedCoffee={selectedCoffee}
                    onSelectCoffee={(coffee) => {
                      setSelectedCoffee(coffee);
                      if (coffee) {
                        setDialedInCoffee(coffee);
                        if (coffee.recommendedRatio) setCustomRatio(Number(coffee.recommendedRatio));
                        if (coffee.recommendedGrind || coffee.grindSetting) setCustomGrind(coffee.recommendedGrind || coffee.grindSetting);
                      }
                      setCurrentStep(3);
                    }}
                    onNextStep={() => {
                      if (selectedCoffee?.recommendedRatio) setCustomRatio(Number(selectedCoffee.recommendedRatio));
                      if (selectedCoffee?.recommendedGrind || selectedCoffee?.grindSetting) {
                        setCustomGrind(selectedCoffee.recommendedGrind || selectedCoffee.grindSetting);
                      }
                      setCurrentStep(3);
                    }}
                    onPrevStep={() => {
                      setCurrentStep(1);
                      navigate('/');
                    }}
                    onOpenScanner={() => setIsScannerOpen(true)}
                    activeMethod={currentActiveMethod}
                    unitSystem={unitSystem}
                    setUnitSystem={setUnitSystem}
                  />
                </div>
              )}

              {/* STEP 03: RECIPE & DIAL IN (RATIO, DOSE, GRIND, WATER LAB) */}
              {currentStep === 3 && (
                <div className="animate-fade-in space-y-8">
                  <PrecisionCalculator
                    trackMode={trackMode}
                    methods={methods}
                    activeMethod={currentActiveMethod}
                    setActiveMethod={(m) => {
                      handleSelectMethodFromGrid(m);
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
                    customGrind={customGrind}
                    onSelectGrind={(grindId) => setCustomGrind(grindId)}
                    unitSystem={unitSystem}
                    setUnitSystem={setUnitSystem}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    onNextStep={() => setCurrentStep(4)}
                    onPrevStep={() => setCurrentStep(2)}
                    selectedCoffee={selectedCoffee || dialedInCoffee}
                    onOpenWaterLab={() => setIsWaterLabOpen(true)}
                    onViewRoasterProfile={handleViewRoasterProfile}
                  />
                </div>
              )}

              {/* STEP 04: GUIDED BREW TIMER & SENSORY EVALUATION */}
              {currentStep === 4 && (
                <div id="step-4" className="animate-fade-in space-y-6">
                  {(dialedInCoffee || selectedCoffee) && (() => {
                    const activeCoffee = dialedInCoffee || selectedCoffee;
                    const provenance = getCoffeeProvenance(activeCoffee, activeCoffee.roasterProfile || null, currentUser);
                    return (
                    <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-md shadow-lg ${
                      provenance.isAiDerived 
                        ? 'bg-purple-950/20 border-purple-500/40' 
                        : (provenance.isDomainVerified ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-amber-500/10 border-amber-500/30')
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            provenance.isAiDerived ? 'bg-purple-400 animate-pulse' : (provenance.isDomainVerified ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400')
                          }`} />
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${provenance.badgeColor}`}>
                                {provenance.shortBadge || provenance.label}
                              </span>
                              {provenance.isAiDerived && (
                                <span className="text-[10px] font-mono text-purple-300/80">
                                  Derived via On-Device AI Vision • Personal Cellar
                                </span>
                              )}
                            </div>
                            <div className="text-base sm:text-lg font-serif font-bold text-cream-light mt-1">
                              {activeCoffee.roaster || activeCoffee.roasteryName || 'Artisan Roaster'} • {activeCoffee.beanName || activeCoffee.name}
                            </div>
                          </div>
                        </div>

                        {/* Roaster Tasting Notes */}
                        {activeCoffee.tastingNotes && activeCoffee.tastingNotes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] font-mono text-cream-soft/60 uppercase">Flavor Profile:</span>
                            {activeCoffee.tastingNotes.map((note, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[11px] font-sans font-medium">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                        {activeCoffee.notes && (
                          <p className="text-xs text-cream-soft/80 italic font-sans max-w-xl line-clamp-2">
                            "{activeCoffee.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 self-start lg:self-center">
                        <button
                          type="button"
                          onClick={() => handleViewRoasterProfile(activeCoffee)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                          title={`Learn about ${activeCoffee.roaster || 'this roaster'}`}
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>Learn About Roaster</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-xs font-mono text-cream-soft bg-black/40 p-3 rounded-xl border border-white/10 flex flex-wrap sm:flex-col sm:items-end gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-amber-gold font-bold">1:{effectiveRatio}</span>
                            <span>•</span>
                            <span className="text-cream-light font-bold">{dryDoseGrams}g : {calculatedTotalWaterMl}g</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-cream-soft/80">
                            {(activeCoffee.tempF || activeCoffee.extraction?.tempF) && (
                              <span>{activeCoffee.tempF || activeCoffee.extraction?.tempF}°F</span>
                            )}
                            {(activeCoffee.recommendedGrind || activeCoffee.grindSize || activeCoffee.extraction?.grind) && (
                              <>
                                <span>•</span>
                                <span>{activeCoffee.recommendedGrind || activeCoffee.grindSize || activeCoffee.extraction?.grind}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })()}

                  <MultiPhaseTimer
                    trackMode={trackMode}
                    activeMethod={currentActiveMethod}
                    dryDoseGrams={dryDoseGrams}
                    unitSystem={unitSystem}
                    isMuted={isMuted}
                    setIsMuted={setIsMuted}
                    onPrevStep={() => setCurrentStep(3)}
                    onOpenJournal={() => setIsJournalOpen(true)}
                    dialedInCoffee={dialedInCoffee || selectedCoffee}
                    totalWaterMl={calculatedTotalWaterMl}
                    customRatio={effectiveRatio}
                    customGrind={customGrind}
                    onApplyNextBrewTweak={handleApplyNextBrewTweak}
                    currentUser={currentUser}
                  />
                </div>
              )}
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
            customGrind={customGrind}
            customWaterMl={calculatedTotalWaterMl}
            unitSystem={unitSystem}
            onOpenScanner={() => setIsScannerOpen(true)}
            currentUser={currentUser}
            onBrewAgain={handleBrewAgain}
          />

          {/* Multi-Index Global Search Modal */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectMethod={(method) => {
              handleSelectMethodFromGrid(method);
            }}
            onSelectRecipe={(recipe) => {
              handleApplyRecipe(recipe, 3);
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

          {/* Code-Split Lazy Loaded Interactive Modals */}
          <Suspense fallback={null}>
            {/* Community Hub Modal */}
            <CommunityHubModal
              isOpen={isCommunityOpen}
              onClose={() => setIsCommunityOpen(false)}
              trackMode={trackMode}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
              onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
              onSelectRecipe={(recipe) => {
                handleApplyRecipe(recipe, 3);
              }}
            />

            {/* Recipe Builder Modal */}
            <RecipeBuilderModal
              isOpen={isRecipeBuilderOpen}
              onClose={() => setIsRecipeBuilderOpen(false)}
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
              currentUser={currentUser}
              onOpenRoasterPortal={(code, bean) => {
                setRoasterPrefillBarcode(typeof code === 'string' ? code : '');
                setRoasterPrefillBean(bean || null);
                setIsRoasterPortalOpen(true);
              }}
              onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
            />

            {/* Specialty Roaster Partner Portal & Smart Bag Packaging Generator Modal */}
            <RoasterPortalModal
              isOpen={isRoasterPortalOpen}
              onClose={() => {
                setIsRoasterPortalOpen(false);
                setRoasterPrefillBarcode('');
                setRoasterPrefillBean(null);
                setRoasterPortalInitialTab(null);
              }}
              prefilledBarcode={roasterPrefillBarcode}
              prefilledBean={roasterPrefillBean}
              initialTab={roasterPortalInitialTab}
              onSelectBeanToBrew={handleApplyScannedRecipe}
              onNavigateToRoaster={(slug) => {
                setCurrentArea('discover');
                setSelectedRoasterSlug(slug);
                navigate(`/roasters/${slug}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              currentUser={currentUser}
              onOpenAuth={handleOpenAuth}
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

            {/* Version Control & Build History Modal */}
            <VersionHistoryModal
              isOpen={isVersionHistoryOpen}
              onClose={() => setIsVersionHistoryOpen(false)}
            />
          </Suspense>

          {/* Barista & Roaster User Profile Modal */}
          <UserProfileDashboard
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            trackMode={trackMode}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onOpenRoasterPortal={(bean = null, initialTab = 'catalog') => {
              setIsProfileOpen(false);
              setRoasterPrefillBean(bean || null);
              if (bean?.upc) setRoasterPrefillBarcode(bean.upc);
              setRoasterPortalInitialTab(initialTab);
              setIsRoasterPortalOpen(true);
            }}
            onNavigateToRoaster={(slug) => {
              setIsProfileOpen(false);
              setCurrentArea('discover');
              setSelectedRoasterSlug(slug);
              navigate(`/roasters/${slug}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectBeanToBrew={(coffee) => {
              setIsProfileOpen(false);
              handleSelectBeanToBrew(coffee);
            }}
            onOpenWaterLab={() => {
              setIsProfileOpen(false);
              setIsWaterLabOpen(true);
            }}
            onLogout={handleLogout}
          />

          {/* Sign In / Auth Modal */}
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            currentUser={currentUser}
            usersList={usersList}
            initialRole={authInitialRole}
            initialMode={authInitialMode}
            onSaveProfile={(updatedUser) => {
              setCurrentUser(updatedUser);
              setUsersList([updatedUser, ...usersList.filter((u) => u.username !== updatedUser.username)]);
            }}
            onLogout={handleLogout}
          />

          {/* Specialty Coffee Shop Finder Modal */}
          <LocalCoffeeFinderModal
            isOpen={isLocalCoffeeOpen}
            onClose={() => setIsLocalCoffeeOpen(false)}
            trackMode={trackMode}
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

        </main>

        {/* Contact HQ Email & App Footer */}
        <Footer
          trackMode={trackMode}
          onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          onOpenRoasterShowcase={handleOpenRoasterShowcase}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
          onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        />

        {/* Mobile Sticky 1-Thumb Bottom Navigation Bar */}
        <MobileBottomNav
          currentView={currentArea}
          isShopsView={currentArea === 'cafes'}
          onSelectView={(v) => {
            // Dismiss all open modals when navigating primary views
            setIsCommunityOpen(false);
            setIsRoasterPortalOpen(false);
            setIsLocalCoffeeOpen(false);
            setIsWaterLabOpen(false);
            setIsVideoAcademyOpen(false);
            setIsJournalOpen(false);
            setIsProfileOpen(false);
            setIsSearchOpen(false);
            setIsMobileToolsOpen(false);

            if (v === 'brew') {
              setCurrentArea('brew');
              navigate(currentStep > 1 && currentActiveMethod ? `/methods/${currentActiveMethod.id}` : '/');
            } else if (v === 'discover' || v === 'roasters') {
              setCurrentArea('discover');
              navigate('/roasters');
            } else if (v === 'cafes') {
              setCurrentArea('cafes');
              setIsCafePartnerPortalOpen(false);
              navigate('/shops');
            } else if (v === 'learn') {
              setCurrentArea('learn');
              navigate('/learn');
            } else if (v === 'my_coffee') {
              setCurrentArea('my_coffee');
              navigate('/recipes');
            }
          }}
          onStartBrew={() => handleStartBrew()}
          onOpenLocalCoffee={() => {
            setIsMobileToolsOpen(false);
            setCurrentArea('cafes');
            setIsCafePartnerPortalOpen(false);
            navigate('/shops');
          }}
          onOpenRoasterShowcase={() => {
            setIsMobileToolsOpen(false);
            handleOpenRoasterShowcase();
          }}
          onOpenTools={() => setIsMobileToolsOpen(true)}
          isToolsOpen={isMobileToolsOpen}
        />

        {/* Mobile Slide-Up Barista Tools & Settings Drawer */}
        <MobileToolsDrawer
          isOpen={isMobileToolsOpen}
          onClose={() => setIsMobileToolsOpen(false)}
          onOpenScanner={() => setIsScannerOpen(true)}
          onOpenWaterLab={() => setIsWaterLabOpen(true)}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
          onOpenJournal={() => setIsJournalOpen(true)}
          onOpenNews={handleOpenBrewNews}
          onOpenRoasterPortal={() => { setRoasterPrefillBarcode(''); setRoasterPrefillBean(null); setIsRoasterPortalOpen(true); }}
          onOpenCafePortal={() => { setIsRoasterShowcaseView(false); setIsCafePortalView(true); }}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAuth={handleOpenAuth}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          currentUser={currentUser}
        />

      </div>
    </div>
    </AppOrchestratorProvider>
  );
}
