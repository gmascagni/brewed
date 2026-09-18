import React, { useState, useEffect, useRef } from 'react';
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
import ConsumerDiscoveryFeed from './components/ConsumerDiscoveryFeed';
import CafePartnerPortal from './components/CafePartnerPortal';
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
import { syncCloudCatalog } from './data/roasterRegistry';
import { parseRecipePayload } from './utils/recipeParser';
import { getAssetUrl } from './utils/assetUrl';
import { getRecentBrews, JOURNAL_UPDATED_EVENT } from './utils/journalStorage';
import { ChevronRight, ChevronLeft, Sparkles, Coffee, Clock, Play, BookOpen, Store } from 'lucide-react';

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
      const saved = localStorage.getItem('the_brew_app_active_user') || localStorage.getItem('the_brew_app_current_user');
      const user = saved ? JSON.parse(saved) : null;
      if (user && (user.username === '@barista_pro' || user.email === 'alex@specialtybrew.org')) {
        localStorage.removeItem('the_brew_app_active_user');
        localStorage.removeItem('the_brew_app_current_user');
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
  const [isLocalCoffeeOpen, setIsLocalCoffeeOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isWaterLabOpen, setIsWaterLabOpen] = useState(false);
  const [isRoasterPortalOpen, setIsRoasterPortalOpen] = useState(false);
  const [isRoasterInfoOpen, setIsRoasterInfoOpen] = useState(false);
  const [roasterPrefillBarcode, setRoasterPrefillBarcode] = useState('');
  const [roasterPrefillBean, setRoasterPrefillBean] = useState(null);
  
  // Primary 5 Logical Application Areas: 'brew' | 'discover' | 'cafes' | 'learn' | 'my_coffee'
  const [currentArea, setCurrentArea] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/^\/brewed/, '');
      const search = window.location.search || '';
      if (p.startsWith('/roasters') || p.startsWith('/roaster') || p.startsWith('/discover') || search.includes('roaster=') || search.includes('slug=')) {
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

  // Primary Action Throughout App: Start a Brew
  const handleStartBrew = (initialMethod = null, initialCoffee = null) => {
    setCurrentArea('brew');
    if (initialCoffee) {
      setSelectedCoffee(initialCoffee);
      setDialedInCoffee(initialCoffee);
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

  // Handlers for Scanned / Roaster Dial-In Actions
  const handleApplyScannedRecipe = (scannedBean) => {
    if (!scannedBean) return;

    // 1. Immediately switch to Brew area and close overlays
    setCurrentArea('brew');
    setIsScannerOpen(false);
    setIsRoasterPortalOpen(false);

    // 2. Extract ratio, dose, and water volume
    const ratio = Number(scannedBean.recommendedRatio || scannedBean.extraction?.ratio || 16);
    setCustomRatio(ratio);

    const waterAmount = Number(scannedBean.waterGrams || (scannedBean.dryDoseGrams ? Math.round(scannedBean.dryDoseGrams * ratio) : 320));
    setCustomWaterMl(waterAmount);
    setCupCount(1);
    setCupMl(waterAmount);

    // 3. Resolve target brew method (prioritize exact ID before fuzzy substring match)
    const targetMethodId = scannedBean.brewMethod || scannedBean.extraction?.method || 'pour_over';
    const allMethods = BREW_METHODS.coffee;
    let targetMethod = allMethods.find(m => m.id === targetMethodId) ||
                       allMethods.find(m => m.id.includes(targetMethodId) || targetMethodId.includes(m.id)) ||
                       allMethods[0];

    // If custom phases were provided in the recipe (e.g. roaster bloom specs), attach them
    if (scannedBean.customPhases && scannedBean.customPhases.length > 0) {
      targetMethod = {
        ...targetMethod,
        phases: scannedBean.customPhases
      };
    }

    setActiveMethod(prev => prev?.id === targetMethod.id ? { ...prev, ...targetMethod } : targetMethod);
    setSelectedCoffee(scannedBean);
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

    recordTelemetryEvent('bean_dial_in', {
      roaster: scannedBean.roaster,
      beanName: scannedBean.beanName,
      methodId: targetMethod.id,
      ratio
    });
  };

  // Handler for applying closed-loop dial-in engine tweaks to next brew
  const handleApplyNextBrewTweak = (recipePatch) => {
    if (!recipePatch) return;
    if (recipePatch.ratio) {
      setCustomRatio(Number(recipePatch.ratio));
    }
    if (dialedInCoffee) {
      setDialedInCoffee(prev => ({
        ...prev,
        tempF: recipePatch.tempF || prev.tempF,
        recommendedRatio: recipePatch.ratio || prev.recommendedRatio,
        recommendedGrind: recipePatch.grindSetting ? `${recipePatch.grindSetting}` : prev.recommendedGrind
      }));
    } else {
      setDialedInCoffee({
        beanName: activeMethod?.preferredCoffeeTypes?.split('.')[0] || 'Single-Origin Lot',
        roaster: 'Specialty Roastery',
        tempF: recipePatch.tempF || 202,
        recommendedRatio: recipePatch.ratio || 16,
        recommendedGrind: recipePatch.grindSetting || 'Medium-Fine'
      });
    }
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
      const existing = JSON.parse(localStorage.getItem('the_brew_app_journal_v1') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trackMode: 'coffee',
        methodName: String(scannedBean.brewMethod || 'pour_over').replace(/_/g, ' '),
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

    const parsedRatio = parseFloat(String(entry.ratioStr || '').replace('1 :', '').trim()) || entry.ratio || 16;
    const parsedWater = parseFloat(String(entry.waterStr || '').replace(/[^0-9.]/g, '')) || entry.waterMl || 300;

    setActiveMethod(targetMethod);
    setTrackMode(entry.trackMode || 'coffee');
    setCustomRatio(parsedRatio);
    setCustomWaterMl(parsedWater);
    setCupCount(1);
    setCupMl(parsedWater);

    setDialedInCoffee({
      beanName: entry.beanName,
      roaster: entry.roaster,
      recommendedGrind: entry.grindStr,
      tempF: parseInt(entry.tempStr) || 202
    });

    setCurrentStep(4);
    navigate(`/methods/${targetMethod.id}`);

    setTimeout(() => {
      const timerEl = document.getElementById('step-4') || document.querySelector('main');
      if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
    }, 150);

    trackEvent('brew_again_launched', {
      method: targetMethod.id,
      bean: entry.beanName,
      roaster: entry.roaster
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

    // Inbound Recipe Link Detection (?recipe=... or /r/<id> or direct query params on home)
    const isRoasterRoute = path.startsWith('/roasters') || path.startsWith('/roaster');
    const fullUrl = typeof window !== 'undefined' ? window.location.href : `${location.pathname}${location.search}${location.hash}`;
    const inboundRecipe = !isRoasterRoute ? parseRecipePayload(fullUrl) : null;
    if (inboundRecipe && lastInboundUrlRef.current !== fullUrl) {
      lastInboundUrlRef.current = fullUrl;
      handleApplyScannedRecipe(inboundRecipe);
      updatePageSeo(
        `${inboundRecipe.beanName} Recipe by ${inboundRecipe.roaster} | TheBrew.App`,
        `Pre-filled specialty coffee brew recipe for ${inboundRecipe.beanName} roasted by ${inboundRecipe.roaster}. Ratio 1:${inboundRecipe.recommendedRatio}, ${inboundRecipe.dryDoseGrams}g coffee, ${inboundRecipe.waterGrams}g water.`,
        `https://thebrew.app/r/${inboundRecipe.id}`
      );
      return;
    }

    if (path.startsWith('/methods/')) {
      setCurrentArea('brew');
      const methodId = path.replace('/methods/', '').replace(/\/$/, '');
      const allMethods = BREW_METHODS.coffee;
      const found = allMethods.find(m => m.id === methodId);

      if (found) {
        setActiveMethod(prev => (prev?.id === found.id ? prev : found));

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
    } else if (path.startsWith('/roasters') || path.startsWith('/roaster') || path.startsWith('/discover') || (typeof window !== 'undefined' && (window.location.pathname.includes('/roasters') || window.location.search.includes('roaster=')))) {
      setCurrentArea('discover');
      if (path === '/roasters/partner' || path === '/roasters/info') {
        setIsRoasterInfoOpen(true);
      } else {
        const fullPath = (typeof window !== 'undefined' ? window.location.pathname : path).replace(/^\/brewed/, '');
        const parts = fullPath.split('/').filter(Boolean);
        const searchParams = new URLSearchParams(location.search || (typeof window !== 'undefined' ? window.location.search : ''));
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
      const stepParam = searchParams.get('step');
      if (stepParam) {
        setCurrentStep(parseInt(stepParam));
      } else if (roasterParam || beanParam) {
        const methodParam = searchParams.get('method');
        const ratioParam = parseFloat(searchParams.get('ratio'));
        const allMethods = BREW_METHODS.coffee;
        const found = allMethods.find(m => m.id === methodParam) || allMethods[0];
        setActiveMethod(found);
        if (ratioParam) setCustomRatio(ratioParam);
        setCurrentStep(2);
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
      setCustomRatio(null);
      setCustomWaterMl(null);
      if (setActiveVideo) setActiveVideo(null);
    }
    trackEvent('select_method', { method_id: method.id, method_name: method.name });
  };

  const handleSelectBrewerFromHero = (brewerId) => {
    const allMethods = BREW_METHODS.coffee;
    const match = allMethods.find(m => m.id === brewerId || (brewerId === 'pour_over' && (m.id === 'pour_over' || m.id === 'classic_pour_over'))) || allMethods[0];
    if (match) {
      setActiveMethod(match);
      setCustomRatio(null);
      setCustomWaterMl(null);
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
      <header className="sticky top-0 z-50 backdrop-blur-xl transition-all duration-700 border-b border-[#ECE6DC] bg-[#FAF7F2]/95 shadow-xs">
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
            } else if (v === 'discover') {
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
      </header>

      {/* Main Workspace Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8 relative z-10">

        <main className="mt-4 space-y-10">

          {/* AREA 1: DISCOVER (ROASTERS & SINGLE ORIGINS) */}
          {currentArea === 'discover' && (
            selectedRoasterSlug ? (
              <RoasterProfilePage
                initialRoasterId={selectedRoasterSlug}
                onBackToApp={() => {
                  setSelectedRoasterSlug(null);
                  setCurrentArea('brew');
                  navigate('/');
                }}
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
                      DISCOVER SPECIALTY COFFEE
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
              onLogout={() => setCurrentUser(null)}
              onBrewAgain={(entry) => handleBrewAgain(entry)}
              onSelectRecipe={(recipe) => {
                const allMethods = BREW_METHODS.coffee;
                const match = allMethods.find(m => m.id === recipe.methodId || m.id.includes(recipe.methodId)) || allMethods[0];
                setActiveMethod(match);
                if (recipe.ratio) setCustomRatio(recipe.ratio);
                const waterAmount = Number(recipe.waterGrams || (recipe.doseGrams ? Math.round(recipe.doseGrams * (recipe.ratio || 16)) : 320));
                setCustomWaterMl(waterAmount);
                setCupCount(1);
                setCupMl(waterAmount);
                setCurrentArea('brew');
                setCurrentStep(4);
                navigate(`/methods/${match.id}`);
                setTimeout(() => {
                  const timerEl = document.getElementById('step-4') || document.querySelector('main');
                  if (timerEl) timerEl.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
              onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
              onSelectBeanToBrew={(bean) => handleSelectBeanToBrew(bean)}
              onOpenScanner={() => setIsScannerOpen(true)}
              activeMethod={currentActiveMethod}
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
                                <span className="font-bold text-[#A8622D]">{brew.methodName}</span>
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
                      }
                      setCurrentStep(3);
                    }}
                    onNextStep={() => setCurrentStep(3)}
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
                    onNextStep={() => setCurrentStep(4)}
                    onPrevStep={() => setCurrentStep(2)}
                    selectedCoffee={selectedCoffee}
                    onOpenWaterLab={() => setIsWaterLabOpen(true)}
                  />
                </div>
              )}

              {/* STEP 04: GUIDED BREW TIMER & SENSORY EVALUATION */}
              {currentStep === 4 && (
                <div id="step-4" className="animate-fade-in space-y-6">
                  {(dialedInCoffee || selectedCoffee) && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <div>
                            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-amber-gold font-bold flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>{(dialedInCoffee || selectedCoffee).isBagRecipe ? 'Bag Recipe QR Dial-In Active' : 'Specialty Dial-In Active'}</span>
                            </div>
                            <div className="text-base sm:text-lg font-serif font-bold text-cream-light">
                              {(dialedInCoffee || selectedCoffee).roaster || (dialedInCoffee || selectedCoffee).roasteryName || 'Artisan Roaster'} • {(dialedInCoffee || selectedCoffee).beanName || (dialedInCoffee || selectedCoffee).name}
                            </div>
                          </div>
                        </div>

                        {/* Roaster Tasting Notes */}
                        {(dialedInCoffee || selectedCoffee).tastingNotes && (dialedInCoffee || selectedCoffee).tastingNotes.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="text-[10px] font-mono text-cream-soft/60 uppercase">Flavor Profile:</span>
                            {(dialedInCoffee || selectedCoffee).tastingNotes.map((note, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[11px] font-sans font-medium">
                                {note}
                              </span>
                            ))}
                          </div>
                        )}
                        {(dialedInCoffee || selectedCoffee).notes && (
                          <p className="text-xs text-cream-soft/80 italic font-sans max-w-xl line-clamp-2">
                            "{(dialedInCoffee || selectedCoffee).notes}"
                          </p>
                        )}
                      </div>

                      <div className="text-xs font-mono text-cream-soft bg-black/40 p-3 rounded-xl border border-white/10 flex flex-wrap sm:flex-col sm:items-end gap-2 self-start sm:self-center shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-gold font-bold">1:{effectiveRatio}</span>
                          <span>•</span>
                          <span className="text-cream-light font-bold">{dryDoseGrams}g : {calculatedTotalWaterMl}g</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-cream-soft/80">
                          {((dialedInCoffee || selectedCoffee).tempF || (dialedInCoffee || selectedCoffee).extraction?.tempF) && (
                            <span>{(dialedInCoffee || selectedCoffee).tempF || (dialedInCoffee || selectedCoffee).extraction?.tempF}°F</span>
                          )}
                          {((dialedInCoffee || selectedCoffee).recommendedGrind || (dialedInCoffee || selectedCoffee).grindSize || (dialedInCoffee || selectedCoffee).extraction?.grind) && (
                            <>
                              <span>•</span>
                              <span>{(dialedInCoffee || selectedCoffee).recommendedGrind || (dialedInCoffee || selectedCoffee).grindSize || (dialedInCoffee || selectedCoffee).extraction?.grind}</span>
                            </>
                          )}
                        </div>
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
                    dialedInCoffee={dialedInCoffee || selectedCoffee}
                    totalWaterMl={calculatedTotalWaterMl}
                    customRatio={effectiveRatio}
                    onApplyNextBrewTweak={handleApplyNextBrewTweak}
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
              const allMethods = BREW_METHODS.coffee;
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
            onOpenAuth={handleOpenAuth}
            onOpenRecipeBuilder={() => setIsRecipeBuilderOpen(true)}
            onSelectRecipe={(recipe) => {
              const allMethods = BREW_METHODS.coffee;
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
            onOpenAuth={handleOpenAuth}
            onOpenRoasterPortal={() => {
              setIsProfileOpen(false);
              setIsRoasterPortalOpen(true);
            }}
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
            initialRole={authInitialRole}
            initialMode={authInitialMode}
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

        </main>

        {/* Contact HQ Email & App Footer */}
        <Footer
          trackMode={trackMode}
          onOpenRoasterInfo={() => setIsRoasterInfoOpen(true)}
          onOpenRoasterShowcase={handleOpenRoasterShowcase}
          onOpenVideoAcademy={() => setIsVideoAcademyOpen(true)}
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
            } else if (v === 'discover') {
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
