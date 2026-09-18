import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Store,
  MapPin,
  ExternalLink,
  Coffee,
  Sparkles,
  Droplet,
  Award,
  Clock,
  ArrowRight,
  QrCode,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Building,
  Heart,
  Flame,
  Scale,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  Check,
  Bookmark,
  Play,
  X,
  Printer,
  Download,
  Copy,
  Maximize2,
  Tag,
  Eye,
  Sliders,
  AlertCircle
} from 'lucide-react';
import QRCode from 'qrcode';
import { SHOWCASE_ROASTERS, getShowcaseRoaster, getAllShowcaseRoasters, normalizeRoasterKey, getRoasterShortName } from '../data/roasterShowcaseData';
import { trackEvent } from '../utils/analytics';
import { useAppOrchestrator } from '../context/AppOrchestratorContext';
import { getAssetUrl } from '../utils/assetUrl';
import { generateSmartBagUrl } from '../data/roasterRegistry';
import { 
  downloadCompleteStickerPng, 
  downloadBrotherQlStickerPng,
  downloadVectorQrSvg, 
  downloadHighResQrPng 
} from '../services/packagingAssetPipeline';
import { printBrotherQlCoffee, printThermalSticker, printHtmlElementIsolated } from '../utils/printLabel';

export default function RoasterProfilePage({
  initialRoasterId = 'methodical',
  onBackToApp,
  onBrewCoffee,
  onOpenWaterLabWithProfile,
  onOpenRoasterPortalWithBean,
  onOpenRoasterInfo,
  onOpenProfile,
  currentUser = null,
  onOpenAuth = null
}) {
  const [activeRoasterId, setActiveRoasterId] = useState(initialRoasterId);
  const roasterScrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [scannedBeanName, setScannedBeanName] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return new URLSearchParams(window.location.search).get('bean') || '';
      } catch {}
    }
    return '';
  });
  const [savedToJournalId, setSavedToJournalId] = useState(null);
  const [coffeeViewMode, setCoffeeViewMode] = useState('specs'); // 'specs' | 'labels' | 'split'
  const [cardLabelFlipMap, setCardLabelFlipMap] = useState({});
  const [activeLabelModalCoffee, setActiveLabelModalCoffee] = useState(null);

  // Keyboard accessibility: close label modal on Escape key
  useEffect(() => {
    if (!activeLabelModalCoffee) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveLabelModalCoffee(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLabelModalCoffee]);

  let orchestrator = null;
  try {
    orchestrator = useAppOrchestrator();
  } catch {}

  const roaster = useMemo(() => getShowcaseRoaster(activeRoasterId), [activeRoasterId]);
  const allRoasters = useMemo(() => getAllShowcaseRoasters(), []);
  const qrCodeMap = useCoffeeLabelQrCodes(roaster?.coffees, roaster);

  const handleToggleCardFlip = (coffeeId) => {
    setCardLabelFlipMap((prev) => ({
      ...prev,
      [coffeeId]: !prev[coffeeId]
    }));
  };

  // Recognize authenticated roaster as verified brand owner
  const isBrandOwner = Boolean(
    currentUser && (
      currentUser.role === 'roaster' || 
      currentUser.isVerifiedRoaster || 
      currentUser.accountType === 'roaster' ||
      (roaster?.ownerEmail && currentUser?.email && roaster.ownerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (roaster?.ownerUid && currentUser?.uid && roaster.ownerUid === currentUser.uid) ||
      (currentUser.roasterSlug && roaster?.slug && currentUser.roasterSlug === roaster.slug) ||
      (currentUser.roasterName && roaster?.name && currentUser.roasterName.toLowerCase() === roaster.name.toLowerCase())
    )
  );

  useEffect(() => {
    if (initialRoasterId) {
      setActiveRoasterId(initialRoasterId);
    }
  }, [initialRoasterId]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const beanParam = params.get('bean');
      if (beanParam) {
        setScannedBeanName(beanParam);
      }
      if (params.get('video') || window.location.hash === '#video') {
        setActiveTab('walkthrough');
      }
    } catch {}
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('view_roaster_profile_page', {
      roaster_id: roaster.id,
      roaster_name: roaster.name
    });
  }, [activeRoasterId]);

  const handleSharePage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleSaveToJournal = (coffee) => {
    try {
      const existing = JSON.parse(localStorage.getItem('the_brew_app_journal_v1') || '[]');
      const newEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        trackMode: 'coffee',
        methodName: String(coffee?.brewMethod || 'pour_over').replace(/_/g, ' '),
        beanName: coffee.beanName,
        roaster: roaster.name,
        doseStr: `${coffee.dryDoseGrams || 18} g`,
        waterStr: `${coffee.waterGrams || 297} mL`,
        ratioStr: `1 : ${coffee.recommendedRatio || 16.5}`,
        grindStr: coffee.recommendedGrind || 'Medium-Fine',
        tempStr: `${coffee.tempF || 202}°F`,
        rating: 5,
        isFavorite: true,
        tastingNotes: coffee.tastingNotes || [],
        notes: `${coffee.description || ''} (Origin: ${coffee.origin}, Elevation: ${coffee.elevation})`
      };
      localStorage.setItem('the_brew_app_journal_v1', JSON.stringify([newEntry, ...existing]));
      setSavedToJournalId(coffee.id);
      setTimeout(() => setSavedToJournalId(null), 2500);
    } catch (err) {
      console.error('Error saving to journal:', err);
    }
  };

  const scannedCoffee = scannedBeanName && roaster?.coffees ? roaster.coffees.find(
    (c) => c.beanName.toLowerCase() === scannedBeanName.toLowerCase() ||
           c.beanName.toLowerCase().includes(scannedBeanName.toLowerCase()) ||
           scannedBeanName.toLowerCase().includes(c.beanName.toLowerCase())
  ) : null;

  const synthesizedFromUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const bean = params.get('bean');
      if (!bean) return null;
      const ratio = parseFloat(params.get('ratio')) || 16.5;
      const dose = 18.0;
      const tempF = parseInt(params.get('tempF') || '202', 10);
      const method = params.get('method') || 'pour_over';
      return {
        id: params.get('coffeeId') || `url_scanned_${Date.now()}`,
        beanName: bean,
        origin: params.get('origin') || 'Specialty Single Origin',
        process: params.get('process') || 'Washed',
        varietal: params.get('varietal') || 'Specialty Lot',
        elevation: params.get('elevation') || '1,800+ MASL',
        roastLevel: params.get('roast') || 'Light-Medium',
        cuppingScore: 88.0,
        tastingNotes: params.get('notes') ? params.get('notes').split(',').map(s => s.trim()) : ['Clean', 'Sweet', 'Vibrant'],
        description: `Dialed-in recipe from ${roaster?.name || 'Specialty Roaster'}. Optimized for ${String(method || 'pour_over').replace(/_/g, ' ')}.`,
        brewMethod: method,
        recommendedRatio: ratio,
        dryDoseGrams: dose,
        waterGrams: Math.round(dose * ratio),
        tempF,
        tempC: Math.round(((tempF - 32) * 5) / 9),
        recommendedGrind: params.get('grind') || 'Medium-Fine',
        brewTime: params.get('time') || '3m 15s',
        upc: params.get('upc') || '',
        price: '$22.00',
        directUrl: params.get('url') || roaster?.shopUrl || 'https://thebrew.app',
        badge: 'Smart Bag Scanned'
      };
    } catch {
      return null;
    }
  }, [roaster?.name, roaster?.shopUrl]);

  const activeScannedCoffee = scannedCoffee || synthesizedFromUrl;

  return (
    <div className="min-h-screen bg-[#0A0604] text-cream-light selection:bg-amber-gold selection:text-espresso-950 font-sans pb-24 relative overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. AMBIENT ATMOSPHERE                                                    */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-[680px] pointer-events-none overflow-hidden select-none z-0">
        
        {/* Ambient warm radial backlighting */}
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-25 blur-[120px]"
          style={{ background: roaster.brandColor }}
        />

        {/* Ambient vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0604]/80 to-[#0A0604]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. TOP STICKY NAVIGATION BAR                                             */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#0A0604]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="py-1.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-cream-light hover:text-amber-gold border border-white/15 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
                title="Return to Brewing Station"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Brewing Station</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isBrandOwner ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isBrandOwner ? 'text-emerald-400' : 'text-amber-gold'}`}>
                {isBrandOwner ? 'Verified Brand Owner' : 'Specialty Roaster Showcase'}
              </span>
            </div>
          </div>

          {/* Roaster Switcher (Dropdown + Scroll Chevrons + Interactive Badges) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden lg:inline text-xs font-mono text-cream-soft/70">
              Roasters:
            </span>

            {/* Direct Select Dropdown Picker */}
            <select
              value={activeRoasterId}
              onChange={(e) => setActiveRoasterId(e.target.value)}
              className="bg-[#18110D] text-amber-gold border border-white/20 hover:border-amber-gold/50 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold focus:border-amber-gold focus:outline-none cursor-pointer shadow-sm transition"
              aria-label="Select coffee roaster"
            >
              {allRoasters.map((r) => {
                const displayName = r.shortName || getRoasterShortName(r.name);
                return (
                  <option key={r.id || r.slug || r.name} value={r.id} className="bg-[#18110D] text-cream-light">
                    {displayName} ({r.city})
                  </option>
                );
              })}
            </select>

            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => roasterScrollRef.current?.scrollBy({ left: -160, behavior: 'smooth' })}
              className="hidden sm:flex p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] text-cream-soft hover:text-white border border-white/10 transition shrink-0 cursor-pointer"
              title="Scroll Roasters Left"
              aria-label="Previous roasters"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Horizontal Scrollable Roaster Badges */}
            <div 
              ref={roasterScrollRef}
              onWheel={(e) => {
                if (e.deltaY) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
              className="hidden sm:flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 max-w-[180px] md:max-w-[260px] lg:max-w-md overflow-x-auto no-scrollbar scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {allRoasters.map((r) => {
                const targetKey = normalizeRoasterKey(activeRoasterId);
                const isSelected = 
                  normalizeRoasterKey(r.id) === targetKey ||
                  normalizeRoasterKey(r.slug) === targetKey ||
                  normalizeRoasterKey(r.name) === targetKey;
                const displayName = r.shortName || getRoasterShortName(r.name);
                return (
                  <button
                    key={r.id || r.slug || r.name}
                    onClick={() => setActiveRoasterId(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                        : 'text-cream-soft hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {r.logoImage && (
                      <img src={r.logoImage} alt="" className="w-3.5 h-3.5 object-contain rounded shrink-0 inline" />
                    )}
                    <span>{displayName}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => roasterScrollRef.current?.scrollBy({ left: 160, behavior: 'smooth' })}
              className="hidden sm:flex p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] text-cream-soft hover:text-white border border-white/10 transition shrink-0 cursor-pointer"
              title="Scroll Roasters Right"
              aria-label="Next roasters"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleSharePage}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition cursor-pointer"
              title="Share Roaster Profile"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO SHOWCASE SECTION                                                 */}
      {/* ========================================================================= */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 space-y-12">
        
        <div className="space-y-6">
          
          {/* Brand Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isBrandOwner ? (
              <button
                type="button"
                onClick={() => onOpenRoasterPortalWithBean && onOpenRoasterPortalWithBean(roaster.coffees?.[0] || null)}
                className="px-3 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs font-extrabold border border-emerald-500/40 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title="Manage packaging labels and verified recipes in Roaster Portal"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Brand Owner</span>
              </button>
            ) : (
              <>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-extrabold border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" />
                  <span>VERIFIED ROASTER PARTNER</span>
                </span>
                <button
                  type="button"
                  onClick={onOpenRoasterInfo}
                  className="px-3 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono text-xs font-bold border border-amber-500/40 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  title="Learn about verified roaster partner profiles"
                >
                  <Store className="w-3.5 h-3.5 text-amber-400" />
                  <span>Showcase Roaster Profile</span>
                </button>
              </>
            )}

            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>Specialty Coffee Roastery</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-white/[0.05] text-cream-soft font-mono text-xs border border-white/10 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-gold" />
              <span>{roaster.city}, {roaster.state} • {roaster.country}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-white/[0.05] text-cream-soft font-mono text-xs border border-white/10 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cream-soft/70" />
              <span>Est. {roaster.founded}</span>
            </span>

            <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Educational Extraction Spec</span>
            </span>
          </div>

          {/* Roaster Big Title & Tagline with Brand Logo Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {roaster.logoImage ? (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 p-2.5 border border-white/20 shadow-2xl backdrop-blur-md shrink-0 flex items-center justify-center overflow-hidden">
                <img 
                  src={roaster.logoImage} 
                  alt={roaster.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-serif text-3xl sm:text-4xl font-black text-espresso-950 shadow-xl shrink-0"
                style={{ backgroundColor: roaster.brandColor }}
              >
                {roaster.monogram}
              </div>
            )}

            <div className="space-y-2">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream-light tracking-tight leading-none">
                {roaster.name}
              </h1>
              <p className="font-serif italic text-lg sm:text-2xl text-amber-gold font-medium">
                "{roaster.tagline}"
              </p>
            </div>
          </div>

          {/* Authenticated Brand Owner Active Banner */}
          {isBrandOwner && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#161D15] to-[#120B08] border border-emerald-500/60 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                      Verified Brand Owner Active
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      {currentUser.email}
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    You have exclusive rights to edit this roaster's recipes, water chemistry parameters, and generate packaging smart barcodes.
                  </p>
                </div>
              </div>
              {onOpenRoasterPortalWithBean && (
                <button
                  onClick={() => onOpenRoasterPortalWithBean(roaster.coffees?.[0] || null)}
                  className="px-4 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Packaging Studio & QR</span>
                </button>
              )}
            </div>
          )}

          {/* Transparent Showcase Demonstration & Partner Example Notice (shown only for showcase profiles) */}
          {!roaster.isCustomRoaster && !isBrandOwner && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs font-mono text-cream-soft/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md shadow-lg">
              <div className="flex items-start sm:items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md bg-amber-gold/20 text-amber-gold font-bold text-[10px] uppercase tracking-wider border border-amber-gold/40 shrink-0">
                  Showcase Preview
                </span>
                <span className="leading-relaxed">
                  Featured roaster showcase demonstrating The Brew App Smart Bag ecosystem. Coffee dial-in recipes are tuned to roaster specifications.
                </span>
              </div>
              {onOpenRoasterInfo && (
                <button
                  onClick={onOpenRoasterInfo}
                  className="text-amber-gold hover:underline font-bold text-xs flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <span>Are you a roaster? Onboard your labels</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 1: ORIGIN STORY & ROASTING CRAFT (DEFAULT DIRECTLY BELOW PREVIEW) */}
          {/* ========================================================================= */}
          <div id="origin-story" className="space-y-8 animate-fade-in scroll-mt-24">
            
            {/* Origin Story Narrative */}
            <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-gold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-gold" />
                  <span>Our Founding Narrative</span>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
                  How {roaster.name} Came to Be
                </h3>
              </div>

              <div className="space-y-4 font-serif text-base sm:text-lg text-cream-soft leading-relaxed">
                {(roaster?.originStory || []).map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="text-cream-soft/80">
                  Founding Team: <strong className="text-cream-light">{roaster?.founders?.length ? roaster.founders.join(' • ') : (roaster?.name || 'Artisan Roasters')}</strong>
                </div>
                <div className="text-amber-gold">
                  Headquartered in {roaster?.city || 'Artisan'}, {roaster?.state || 'USA'}
                </div>
              </div>
            </div>

            {/* Roasting Craft & Machinery */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#140C08] border border-amber-gold/30 space-y-5 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-gold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                    Roaster Engineering & Machinery
                  </span>
                  <h4 className="font-serif text-xl font-bold text-cream-light">
                    The Science of Heat Transfer
                  </h4>
                </div>
              </div>

              <p className="font-sans text-sm text-cream-soft/90 leading-relaxed">
                {roaster?.roastingPhilosophy || 'We calibrate each roast profile to preserve origin terroir and sweetness.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-cream-soft/70 block">Production Equipment</span>
                  <span className="font-serif text-base font-bold text-cream-light block">{roaster?.roasterMachines || 'Artisan Roasters'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-cream-soft/70 block">Sourcing Ethics</span>
                  <span className="font-serif text-base font-bold text-cream-light block">{roaster?.sourcingPhilosophy || 'Ethical Direct-Trade Sourcing'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CUPPING ROOM WATER CHEMISTRY                                   */}
          {/* ========================================================================= */}
          {(() => {
            const hasCustomWater = Boolean(roaster?.recommendedWater && roaster.recommendedWater.targetTds);
            const waterSpec = hasCustomWater ? roaster.recommendedWater : {
              targetTds: 140,
              gh: 70,
              kh: 30,
              ph: 7.0,
              philosophy: 'The Brew App Specialty Extraction Benchmark (calculated based on Specialty Coffee Association standards: 140 PPM TDS, 70 GH general hardness, 30 KH buffer alkalinity, 7.0 neutral pH for optimal clarity and enzymatic sweetness).',
              diyFormula: { epsomMl: 14.5, bakingSodaMl: 5.5 },
              bottledWaterPairing: 'Crystal Geyser (Mount Shasta or Alpine source) or Volvic Natural Spring Water'
            };

            return (
              <div id="water-specs" className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-black/50 to-espresso-950 border border-cyan-500/30 space-y-6 shadow-xl scroll-mt-24">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                          {hasCustomWater ? 'Roaster-Approved Mineral Profile' : 'Specialty SCA Standard Extraction Spec'}
                        </span>
                        {!hasCustomWater && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            Calculated SCA Default
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-cream-light">
                        {roaster?.name || 'Specialty Roastery'} Cupping Room Water Specification
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (orchestrator) {
                        orchestrator.water(waterSpec);
                      } else if (onOpenWaterLabWithProfile) {
                        onOpenWaterLabWithProfile(waterSpec);
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition cursor-pointer"
                  >
                    <span>Open in Water Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {!hasCustomWater && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Transparency Notice:</strong> {roaster.name} has not published custom cupping room water metrics. Displaying <strong>The Brew App Specialty Extraction Benchmark</strong> (calculated based on Specialty Coffee Association standards: 140 PPM TDS, 70 GH general hardness, 30 KH buffer alkalinity, 7.0 neutral pH for optimal clarity and enzymatic sweetness).
                    </p>
                  </div>
                )}

                <p className="text-sm text-cream-soft font-sans leading-relaxed">
                  {waterSpec.philosophy}
                </p>

                {/* Water Targets Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                    <span className="text-[10px] uppercase text-cyan-400/80 block">Target TDS</span>
                    <span className="text-2xl font-bold text-cream-light">{waterSpec.targetTds}</span>
                    <span className="text-[10px] text-cream-soft/60 block">PPM</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                    <span className="text-[10px] uppercase text-cyan-400/80 block">Hardness (GH)</span>
                    <span className="text-2xl font-bold text-amber-gold">{waterSpec.gh}</span>
                    <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                    <span className="text-[10px] uppercase text-cyan-400/80 block">Buffer (KH)</span>
                    <span className="text-2xl font-bold text-emerald-400">{waterSpec.kh}</span>
                    <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                    <span className="text-[10px] uppercase text-cyan-400/80 block">Target pH</span>
                    <span className="text-2xl font-bold text-cyan-300">{waterSpec.ph}</span>
                    <span className="text-[10px] text-cream-soft/60 block">Neutral Balanced</span>
                  </div>
                </div>

                {/* DIY & Bottled Water Recommendation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-mono text-cyan-400 font-bold">
                      DIY Mineral Formula (Per 1L Distilled Water):
                    </div>
                    <p className="text-cream-soft font-sans">
                      {waterSpec.diyFormula
                        ? `${waterSpec.diyFormula.epsomMl}mL Epsom Salt concentrate + ${waterSpec.diyFormula.bakingSodaMl}mL Baking Soda concentrate`
                        : '14.5mL Epsom Salt concentrate + 5.5mL Baking Soda concentrate'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                    <div className="font-mono text-amber-gold font-bold">
                      Recommended Bottled Water Pairing:
                    </div>
                    <p className="text-cream-soft font-sans">
                      {waterSpec.bottledWaterPairing || 'Crystal Geyser (Mount Shasta source) or Volvic Natural Spring Water'}
                    </p>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {roaster.stats.map((stat, i) => (
              <div 
                key={i}
                className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md space-y-1 shadow-sm"
              >
                <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-cream-soft/70">
                  {stat.label}
                </div>
                <div className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs & Jump Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={roaster.shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition"
            >
              <span>Visit Official Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                document.getElementById('certified-coffees')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono text-xs font-bold border border-white/15 flex items-center gap-2 transition cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-gold" />
              <span>Browse Coffees & Dial-In Recipes ({roaster.coffees?.length || 0})</span>
            </button>

            <button
              onClick={() => {
                document.getElementById('cafes-labs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono text-xs font-bold border border-white/15 flex items-center gap-2 transition cursor-pointer"
            >
              <Building className="w-3.5 h-3.5 text-amber-gold" />
              <span>Cafes & Labs ({roaster.cafes?.length || 0})</span>
            </button>

            <div className="text-xs font-mono text-cream-soft/60 hidden lg:block ml-2">
              Founders: <span className="text-cream-light font-bold">{roaster.founders?.length ? roaster.founders.join(', ') : `${roaster.city}${roaster.state ? ', ' + roaster.state : ''}`}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* QUICK JUMP SECTION NAV BAR                                                */}
        {/* ========================================================================= */}
        <nav className="sticky top-[69px] z-20 py-2.5 px-4 rounded-2xl bg-[#0D0907]/90 backdrop-blur-md border border-white/10 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-mono">
            <button
              type="button"
              onClick={() => document.getElementById('origin-story')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-gold hover:text-espresso-950 text-cream-light transition whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Origin Story</span>
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('water-specs')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-cyan-400 hover:text-espresso-950 text-cream-light transition whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5" />
              <span>Water Specs</span>
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('certified-coffees')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-gold hover:text-espresso-950 text-cream-light transition whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Certified Coffees ({roaster.coffees.length})</span>
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('cafes-labs')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-gold hover:text-espresso-950 text-cream-light transition whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Cafes & Labs ({roaster.cafes.length})</span>
            </button>
          </div>

          <a
            href={roaster.shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs font-mono text-amber-gold hover:underline whitespace-nowrap shrink-0"
          >
            <span>Visit Store</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </nav>

        {/* ========================================================================= */}
        {/* SECTION 3: CERTIFIED COFFEE LINEUP & DIAL-IN STATION                      */}
        {/* ========================================================================= */}
        <div id="certified-coffees" className="space-y-8 animate-fade-in scroll-mt-24">
          <div className="space-y-8 animate-fade-in">
            
            {/* Scanned Bag Notification Banner (rendered when arriving from a bag barcode scan) */}
            {activeScannedCoffee && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-black/80 to-amber-950/40 border-2 border-emerald-500/60 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <QrCode className="w-6 h-6 text-emerald-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/50">
                        ✨ Smart Bag Scanned
                      </span>
                      <span className="text-xs font-mono text-cream-soft">
                        Matched from your physical packaging
                      </span>
                    </div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-cream-light mt-0.5">
                      {activeScannedCoffee.beanName}
                    </h4>
                    <p className="text-xs text-cream-soft font-sans">
                      Roaster golden ratio 1:{activeScannedCoffee.recommendedRatio || 16.5} • {activeScannedCoffee.tempF || 202}°F • {activeScannedCoffee.recommendedGrind || 'Medium-Fine'} grind
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => {
                      const payload = { ...activeScannedCoffee, roaster: roaster?.name || 'Specialty Roaster' };
                      if (onBrewCoffee) {
                        onBrewCoffee(payload);
                      }
                      if (orchestrator) {
                        orchestrator.brew(payload);
                      }
                    }}
                    className="px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Start Brew Timer</span>
                  </button>
                  <button
                    onClick={() => handleSaveToJournal(activeScannedCoffee)}
                    className="p-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-cream-light transition"
                    title="Save this bag to your personal coffee cellar"
                  >
                    <Bookmark className={`w-4 h-4 ${savedToJournalId === activeScannedCoffee.id ? 'text-amber-gold fill-amber-gold' : 'text-cream-soft'}`} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-transparent border border-amber-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-gold animate-ping" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                    Roaster-Certified Dial-In & Packaging Labels
                  </h3>
                </div>
                <p className="text-xs text-cream-soft font-sans">
                  Every certified recipe below includes a real scannable packaging label with roaster golden ratio, water temperature, grind setting, and live QR code.
                </p>
              </div>

              {/* View Switcher: Recipe Specs vs Retail Bag Labels vs Split View */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono shrink-0">
                <button
                  type="button"
                  onClick={() => setCoffeeViewMode('specs')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                    coffeeViewMode === 'specs'
                      ? 'bg-amber-gold text-espresso-950 shadow'
                      : 'text-cream-soft hover:text-cream-light'
                  }`}
                  title="View standard recipe and dial-in extraction cards"
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Recipe Specs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCoffeeViewMode('labels')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                    coffeeViewMode === 'labels'
                      ? 'bg-amber-gold text-espresso-950 shadow'
                      : 'text-cream-soft hover:text-cream-light'
                  }`}
                  title="View exact physical retail packaging labels for each recipe"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>Bag Labels ({roaster?.coffees?.length || 0})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCoffeeViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1.5 cursor-pointer ${
                    coffeeViewMode === 'split'
                      ? 'bg-amber-gold text-espresso-950 shadow'
                      : 'text-cream-soft hover:text-cream-light'
                  }`}
                  title="View recipe details and packaging labels side-by-side"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Side-by-Side</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: BAG LABELS ONLY */}
            {coffeeViewMode === 'labels' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {(roaster?.coffees || []).map((coffee) => {
                  const qr = qrCodeMap[coffee.id];
                  return (
                    <div
                      key={`label-${coffee.id}`}
                      className="rounded-3xl bg-black/40 border border-white/10 p-6 flex flex-col justify-between gap-5 shadow-xl hover:border-amber-gold/40 transition group"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-gold font-mono text-[10px] font-bold border border-amber-500/30">
                          🏷️ Retail Bag Sticker Proof
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveLabelModalCoffee(coffee)}
                          className="text-[11px] font-mono text-amber-gold hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Maximize2 className="w-3 h-3" />
                          <span>Enlarge</span>
                        </button>
                      </div>

                      {/* The Physical Label */}
                      <CoffeePackagingLabel
                        coffee={coffee}
                        roaster={roaster}
                        qrDataUrl={qr?.qrDataUrl}
                        smartBagUrl={qr?.url}
                        layout="thermal"
                        onEnlarge={setActiveLabelModalCoffee}
                        onBrewCoffee={onBrewCoffee}
                      />

                      {/* Quick Brew & Buy Buttons */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => {
                            const payload = { ...coffee, roaster: roaster?.name || 'Specialty Roastery' };
                            if (onBrewCoffee) onBrewCoffee(payload);
                            if (orchestrator) orchestrator.brew(payload);
                          }}
                          className="w-full py-2.5 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
                        >
                          <Coffee className="w-3.5 h-3.5" />
                          <span>Dial-In & Brew Recipe</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={coffee.directUrl || roaster.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1 transition font-bold"
                          >
                            <ExternalLink className="w-3 h-3 text-amber-gold shrink-0" />
                            <span className="truncate">Buy Beans</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleToggleCardFlip(coffee.id)}
                            className="py-2 px-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1 transition font-bold cursor-pointer"
                          >
                            <Coffee className="w-3 h-3 text-amber-gold shrink-0" />
                            <span className="truncate">Recipe Specs</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 2: SPLIT SIDE-BY-SIDE (RECIPE SPECS + PACKAGING LABEL) */}
            {coffeeViewMode === 'split' && (
              <div className="space-y-8 animate-fade-in">
                {(roaster?.coffees || []).map((coffee) => {
                  const qr = qrCodeMap[coffee.id];
                  const isThisCoffeeScanned = activeScannedCoffee && activeScannedCoffee.id === coffee.id;
                  return (
                    <div
                      key={`split-${coffee.id}`}
                      className={`rounded-3xl bg-black/40 border p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-xl relative overflow-hidden ${
                        isThisCoffeeScanned
                          ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/10'
                          : 'border-white/10 hover:border-amber-gold/40'
                      }`}
                    >
                      {/* Left 7 Columns: Recipe Details */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                            isThisCoffeeScanned
                              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                              : 'bg-amber-500/20 text-amber-gold border-amber-500/30'
                          }`}>
                            {isThisCoffeeScanned ? '✨ Scanned from Your Bag' : `${coffee.badge || 'Roaster Spec'} • Certified Dial-In`}
                          </span>
                          <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" />
                            <span>SCA {coffee.cuppingScore || 87.5}</span>
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
                            {coffee.beanName}
                          </h4>
                          <p className="text-xs font-mono text-cream-soft/70 mt-1">
                            {coffee.origin || 'Specialty Origin'} • {coffee.process || 'Washed'} • {coffee.elevation || '1,800+ MASL'}
                          </p>
                        </div>

                        <p className="text-sm text-cream-soft font-sans leading-relaxed">
                          {coffee.description || `Artisan craft roast by ${roaster?.name || 'Specialty Roastery'}.`}
                        </p>

                        {/* Tasting Notes Chips */}
                        <div className="flex flex-wrap gap-1.5">
                          {(coffee.tastingNotes || []).map((note, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-xs font-mono text-cream-light font-bold"
                            >
                              {note}
                            </span>
                          ))}
                        </div>

                        {/* Dial-In Parameters Box */}
                        <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                            <span>Dial-In Parameters:</span>
                            <span className="capitalize">{String(coffee?.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs">
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Ratio</span>
                              <strong className="text-cream-light font-bold">1:{coffee.recommendedRatio || 16.5}</strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Water Temp</span>
                              <strong className="text-amber-gold font-bold">{coffee.tempF || 202}°F</strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Grind</span>
                              <strong className="text-cream-light font-bold truncate block">
                                {(coffee.recommendedGrind || 'Medium-Fine').split(' ')[0]}
                              </strong>
                            </div>
                            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                              <span className="text-[10px] text-cream-soft/60 block">Time</span>
                              <strong className="text-cream-light font-bold">{coffee.brewTime || '3m 15s'}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="pt-2 flex flex-wrap gap-2.5">
                          <button
                            onClick={() => {
                              const payload = { ...coffee, roaster: roaster?.name || 'Specialty Roastery' };
                              if (onBrewCoffee) onBrewCoffee(payload);
                              if (orchestrator) orchestrator.brew(payload);
                            }}
                            className="px-6 py-3 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          >
                            <Coffee className="w-4 h-4" />
                            <span>Dial-In & Brew Recipe</span>
                          </button>

                          <a
                            href={coffee.directUrl || roaster.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center gap-1.5 transition font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-amber-gold shrink-0" />
                            <span>Buy Beans ({coffee.price || '$22.00'})</span>
                          </a>

                          <button
                            onClick={() => handleSaveToJournal(coffee)}
                            className={`py-3 px-4 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition font-bold ${
                              savedToJournalId === coffee.id
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-cream-light'
                            }`}
                          >
                            <Bookmark className={`w-3.5 h-3.5 shrink-0 ${savedToJournalId === coffee.id ? 'text-emerald-400 fill-emerald-400' : 'text-amber-gold'}`} />
                            <span>{savedToJournalId === coffee.id ? 'Saved in Cellar!' : 'Save to Cellar'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Right 5 Columns: The Actual Retail Packaging Label */}
                      <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center justify-between w-full max-w-sm px-1">
                          <span className="font-mono text-xs font-bold text-amber-gold flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            <span>Retail Packaging Label Proof</span>
                          </span>
                          <span className="font-mono text-[10px] text-cream-soft/60">
                            Scannable with Camera
                          </span>
                        </div>

                        <CoffeePackagingLabel
                          coffee={coffee}
                          roaster={roaster}
                          qrDataUrl={qr?.qrDataUrl}
                          smartBagUrl={qr?.url}
                          layout="thermal"
                          onEnlarge={setActiveLabelModalCoffee}
                          onBrewCoffee={onBrewCoffee}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE 3: STANDARD RECIPE SPECS CARDS (WITH INLINE LABEL FLIP & MINI PREVIEW) */}
            {coffeeViewMode === 'specs' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {(roaster?.coffees || []).map((coffee) => {
                  const qr = qrCodeMap[coffee.id];
                  const isThisCoffeeScanned = activeScannedCoffee && activeScannedCoffee.id === coffee.id;
                  const isFlippedToLabel = Boolean(cardLabelFlipMap[coffee.id]);

                  return (
                    <div
                      key={coffee.id}
                      className={`rounded-3xl bg-black/40 border p-6 flex flex-col justify-between gap-6 transition-all duration-300 shadow-xl group hover:shadow-2xl relative overflow-hidden ${
                        isThisCoffeeScanned
                          ? 'border-emerald-500/60 ring-2 ring-emerald-500/30 bg-emerald-950/10'
                          : 'border-white/10 hover:border-amber-gold/50 hover:shadow-amber-gold/5'
                      }`}
                    >
                      {/* Top Badge & Interactive Flip Toggle */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                            isThisCoffeeScanned
                              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50'
                              : 'bg-amber-500/20 text-amber-gold border-amber-500/30'
                          }`}>
                            {isThisCoffeeScanned ? '✨ Scanned from Your Bag' : `${coffee.badge || 'Roaster Spec'} • Dial-In Ready`}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                              <Award className="w-3.5 h-3.5" />
                              <span>SCA {coffee.cuppingScore || 87.5}</span>
                            </span>

                            {/* Card-Level Label Flip Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleCardFlip(coffee.id)}
                              className={`px-2 py-0.5 rounded-lg border font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                                isFlippedToLabel
                                  ? 'bg-amber-gold text-espresso-950 border-amber-gold shadow'
                                  : 'bg-white/[0.08] text-cream-soft hover:text-white border-white/15'
                              }`}
                              title={isFlippedToLabel ? "View recipe specs" : "View physical retail bag label"}
                            >
                              <Tag className="w-3 h-3" />
                              <span>{isFlippedToLabel ? 'Recipe Specs' : 'Bag Label'}</span>
                            </button>
                          </div>
                        </div>

                        {/* CONDITIONAL: RENDER PHYSICAL LABEL OR RECIPE SPECS */}
                        {isFlippedToLabel ? (
                          <div className="space-y-4 animate-fade-in">
                            <div className="flex items-center justify-between text-xs font-mono text-amber-gold">
                              <span className="font-bold flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Packaging Label Proof</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => setActiveLabelModalCoffee(coffee)}
                                className="text-[10px] text-cream-soft hover:text-white underline cursor-pointer"
                              >
                                Enlarge Proof
                              </button>
                            </div>

                            <CoffeePackagingLabel
                              coffee={coffee}
                              roaster={roaster}
                              qrDataUrl={qr?.qrDataUrl}
                              smartBagUrl={qr?.url}
                              layout="thermal"
                              onEnlarge={setActiveLabelModalCoffee}
                              onBrewCoffee={onBrewCoffee}
                            />
                          </div>
                        ) : (
                          <>
                            <div>
                              <h4 className="font-serif text-xl font-bold text-cream-light group-hover:text-amber-gold transition leading-snug">
                                {coffee.beanName}
                              </h4>
                              <p className="text-xs font-mono text-cream-soft/70 mt-1">
                                {coffee.origin || 'Specialty Origin'}
                              </p>
                            </div>

                            <p className="text-xs text-cream-soft font-sans leading-relaxed">
                              {coffee.description || `Artisan craft roast by ${roaster?.name || 'Specialty Roastery'}.`}
                            </p>

                            {/* Tasting Notes Chips */}
                            <div className="flex flex-wrap gap-1.5">
                              {(coffee.tastingNotes || []).map((note, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-[11px] font-mono text-cream-light"
                                >
                                  {note}
                                </span>
                              ))}
                            </div>

                            {/* Terroir & Processing Specs */}
                            <div className="p-3.5 rounded-2xl bg-[#140C08] border border-white/5 space-y-1.5 text-xs font-mono">
                              <div className="flex justify-between text-cream-soft">
                                <span>Process:</span>
                                <span className="text-cream-light font-bold">{coffee.process || 'Washed'}</span>
                              </div>
                              <div className="flex justify-between text-cream-soft">
                                <span>Varietal:</span>
                                <span className="text-cream-light">{coffee.varietal || 'Specialty Lot'}</span>
                              </div>
                              <div className="flex justify-between text-cream-soft">
                                <span>Elevation:</span>
                                <span className="text-amber-gold">{coffee.elevation || '1,800+ MASL'}</span>
                              </div>
                            </div>

                            {/* Dial-In Parameters Box */}
                            <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                                <span>Dial-In Parameters:</span>
                                <span className="capitalize">{String(coffee?.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                              </div>

                              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                  <span className="text-[10px] text-cream-soft/60 block">Ratio</span>
                                  <strong className="text-cream-light font-bold">1:{coffee.recommendedRatio || 16.5}</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                  <span className="text-[10px] text-cream-soft/60 block">Water Temp</span>
                                  <strong className="text-amber-gold font-bold">{coffee.tempF || 202}°F</strong>
                                </div>
                                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                                  <span className="text-[10px] text-cream-soft/60 block">Time</span>
                                  <strong className="text-cream-light font-bold">{coffee.brewTime || '3m 15s'}</strong>
                                </div>
                              </div>

                              <div className="text-[11px] font-mono text-cream-soft/80 flex items-center justify-between pt-1">
                                <span>Grind Setting:</span>
                                <span className="text-cream-light font-bold">{coffee.recommendedGrind || 'Medium-Fine'}</span>
                              </div>
                            </div>

                            {/* Packaging Label Preview Bar (Shows miniature scannable QR and click to view full label) */}
                            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                {qr?.qrDataUrl ? (
                                  <img
                                    src={qr.qrDataUrl}
                                    alt="Packaging QR Thumbnail"
                                    className="w-10 h-10 rounded-lg p-0.5 bg-white border border-stone-300 object-contain shrink-0 cursor-pointer hover:scale-105 transition"
                                    onClick={() => setActiveLabelModalCoffee(coffee)}
                                    title="Click to view full packaging sticker"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-gold shrink-0">
                                    <QrCode className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <span className="font-mono text-[11px] font-bold text-cream-light flex items-center gap-1">
                                    <Tag className="w-3 h-3 text-amber-gold" />
                                    <span>Bag Packaging Label</span>
                                  </span>
                                  <p className="text-[10px] font-mono text-cream-soft/60">
                                    Scannable 300 DPI thermal sticker
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleToggleCardFlip(coffee.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-gold/40 text-amber-gold font-mono text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View Label</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Customer Actions Bar */}
                      <div className="space-y-2.5 pt-4 border-t border-white/10">
                        
                        {/* Primary Customer Action: Dial-In & Brew */}
                        <button
                          onClick={() => {
                            const payload = {
                              ...coffee,
                              roaster: roaster?.name || 'Specialty Roastery'
                            };
                            if (onBrewCoffee) {
                              onBrewCoffee(payload);
                            }
                            if (orchestrator) {
                              orchestrator.brew(payload);
                            }
                          }}
                          className="w-full py-3 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        >
                          <Coffee className="w-4 h-4" />
                          <span>Dial-In & Brew ({coffee.dryDoseGrams || 18}g : {coffee.waterGrams || Math.round(18 * (coffee.recommendedRatio || 16.5))}g)</span>
                        </button>

                        {/* Secondary Customer Actions: Reorder from Roaster & Save to Cellar */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Buy Direct from Roaster */}
                          <a
                            href={coffee.directUrl || roaster.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1.5 transition font-bold"
                            title="Purchase directly on roaster's website"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-amber-gold shrink-0" />
                            <span className="truncate">Buy Beans ({coffee.price || '$22.00'})</span>
                          </a>

                          {/* Save to Personal Cellar / Journal */}
                          <button
                            onClick={() => handleSaveToJournal(coffee)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-mono flex items-center justify-center gap-1.5 transition font-bold ${
                              savedToJournalId === coffee.id
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-cream-light'
                            }`}
                            title="Save this lot to your personal coffee cellar"
                          >
                            <Bookmark className={`w-3.5 h-3.5 shrink-0 ${savedToJournalId === coffee.id ? 'text-emerald-400 fill-emerald-400' : 'text-amber-gold'}`} />
                            <span className="truncate">{savedToJournalId === coffee.id ? 'Saved in Cellar!' : 'Save to Cellar'}</span>
                          </button>
                        </div>

                        {/* Roaster Brand Owner Exclusive Packaging Barcode Generator */}
                        {isBrandOwner && onOpenRoasterPortalWithBean && (
                          <button
                            onClick={() => onOpenRoasterPortalWithBean(coffee)}
                            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-gold/40 text-amber-gold font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Generate Packaging Barcode for this Lot</span>
                          </button>
                        )}

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION 4: CAFES & ROASTERY LABS                                          */}
        {/* ========================================================================= */}
        <div id="cafes-labs" className="space-y-6 animate-fade-in max-w-5xl scroll-mt-24">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-gold" />
              <span>Cafes & Roastery Labs ({roaster.cafes.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(roaster?.cafes || []).map((cafe, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-gold">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-cream-light">
                    {cafe.name}
                  </h4>
                  <p className="text-xs font-mono text-amber-gold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{cafe.address}</span>
                  </p>
                  <p className="text-xs text-cream-soft font-sans leading-relaxed pt-1">
                    {cafe.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cream-soft/70">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{cafe.hours}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. ROASTERY PARTNER & PACKAGING TOOLING (DISCRETE OWNER FOOTER)           */}
        {/* ========================================================================= */}
        {onOpenRoasterPortalWithBean && (
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-soft/60">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-cream-soft/40" />
              {isBrandOwner ? (
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>You are managing {roaster.name} as a Verified Brand Owner</span>
                </span>
              ) : (
                <span>Are you a team member or owner at {roaster.name}?</span>
              )}
            </div>
            <button
              onClick={() => {
                const defaultBean = roaster.coffees && roaster.coffees[0];
                const payload = {
                  roaster: roaster.name,
                  beanName: defaultBean?.beanName || '',
                  brewMethod: defaultBean?.brewMethod || 'pour_over',
                  recommendedRatio: defaultBean?.recommendedRatio || 16.5,
                  tempF: defaultBean?.tempF || 202,
                  recommendedGrind: defaultBean?.recommendedGrind || 'Medium-Fine',
                  upc: defaultBean?.upc || '',
                  customUrl: defaultBean?.directUrl || roaster.shopUrl
                };
                if (orchestrator) {
                  orchestrator.package(payload);
                } else {
                  onOpenRoasterPortalWithBean(payload);
                }
              }}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
                isBrandOwner
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-cream-soft hover:text-cream-light border border-white/10'
              }`}
              title={isBrandOwner ? "Open Roaster Portal & Manage Packaging" : "Open Smart Bag Packaging & Label Studio"}
            >
              <QrCode className="w-3.5 h-3.5 text-amber-gold" />
              <span>{isBrandOwner ? 'Roaster Portal & Label Studio' : 'Roaster Packaging & Label Studio'}</span>
            </button>
          </div>
        )}

      </main>

      {/* High-Resolution Packaging Label Proof Modal */}
      {activeLabelModalCoffee && (
        <PackagingLabelProofModal
          coffee={activeLabelModalCoffee}
          roaster={roaster}
          qrDataUrl={qrCodeMap[activeLabelModalCoffee.id]?.qrDataUrl}
          smartBagUrl={qrCodeMap[activeLabelModalCoffee.id]?.url}
          onClose={() => setActiveLabelModalCoffee(null)}
          onBrewCoffee={(payload) => {
            if (onBrewCoffee) onBrewCoffee(payload);
            if (orchestrator) orchestrator.brew(payload);
          }}
        />
      )}

    </div>
  );
}

// Module-level permanent memory cache for packaging QR data URLs
const ROASTER_LABEL_QR_CACHE = new Map();

/**
 * Hook to asynchronously generate and cache crisp scannable QR codes for all coffees.
 * Uses a stable string cacheKey and in-memory cache to eliminate redundant canvas rendering and prevent infinite re-renders.
 */
function useCoffeeLabelQrCodes(coffees = [], roaster = null) {
  const [qrMap, setQrMap] = useState(() => {
    const initial = {};
    if (Array.isArray(coffees)) {
      for (const c of coffees) {
        if (!c || !c.id) continue;
        if (ROASTER_LABEL_QR_CACHE.has(c.id)) {
          initial[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
        }
      }
    }
    return initial;
  });

  const cacheKey = useMemo(() => {
    const ids = Array.isArray(coffees) ? coffees.map(c => c?.id).filter(Boolean).join(',') : '';
    return `${ids}:::${roaster?.name || ''}`;
  }, [coffees, roaster?.name]);

  useEffect(() => {
    let isCancelled = false;
    const list = Array.isArray(coffees) ? coffees : [];
    
    // Check which coffees actually need QR generation
    const uncached = list.filter(c => c && c.id && !ROASTER_LABEL_QR_CACHE.has(c.id));
    if (uncached.length === 0) {
      const fullMap = {};
      list.forEach(c => {
        if (c && c.id && ROASTER_LABEL_QR_CACHE.has(c.id)) {
          fullMap[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
        }
      });
      setQrMap(prev => {
        const hasDiff = list.some(c => c?.id && !prev[c.id]);
        return hasDiff ? fullMap : prev;
      });
      return;
    }

    async function generateUncached() {
      for (const coffee of uncached) {
        if (isCancelled || !coffee || !coffee.id) continue;
        try {
          const url = generateSmartBagUrl({
            ...coffee,
            roaster: roaster?.name || coffee.roaster || 'Specialty Roaster'
          }, null, { compact: true });
          const dataUrl = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 800,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
          ROASTER_LABEL_QR_CACHE.set(coffee.id, { qrDataUrl: dataUrl, url });
        } catch (err) {
          console.warn('Failed to generate packaging QR for coffee:', coffee.id, err);
        }
      }

      if (!isCancelled) {
        const fullMap = {};
        list.forEach(c => {
          if (c && c.id && ROASTER_LABEL_QR_CACHE.has(c.id)) {
            fullMap[c.id] = ROASTER_LABEL_QR_CACHE.get(c.id);
          }
        });
        setQrMap(fullMap);
      }
    }

    generateUncached();

    return () => {
      isCancelled = true;
    };
  }, [cacheKey]);

  return qrMap;
}

/**
 * Realistic retail barcode stripes renderer
 */
function BarcodeStripes({ value = '850029384012' }) {
  const str = String(value || '850029384012');
  return (
    <div className="flex flex-col items-center justify-center space-y-1 py-1 select-none">
      <div className="flex items-end justify-center h-7 sm:h-8 gap-[1.5px] px-2 bg-white w-full max-w-[190px]">
        {Array.from(str).flatMap((char, i) => {
          const n = parseInt(char, 10) || (i % 5) + 1;
          const w1 = (n % 3) + 1;
          const w2 = ((n + 1) % 2) + 1;
          return [
            <div key={`b1-${i}`} style={{ width: `${w1}px` }} className="h-6 sm:h-7 bg-stone-900 shrink-0" />,
            <div key={`g-${i}`} style={{ width: '1px' }} className="h-6 sm:h-7 bg-transparent shrink-0" />,
            <div key={`b2-${i}`} style={{ width: `${w2}px` }} className="h-7 sm:h-8 bg-stone-900 shrink-0" />
          ];
        })}
      </div>
      <div className="text-[10px] font-mono tracking-[0.22em] text-stone-700 font-bold">
        {str}
      </div>
    </div>
  );
}

/**
 * High-contrast tactile packaging label sticker component
 */
function CoffeePackagingLabel({
  coffee,
  roaster,
  qrDataUrl,
  smartBagUrl,
  layout = 'thermal', // 'thermal' | 'badge'
  onEnlarge,
  onBrewCoffee,
  isEnlarged = false
}) {
  const labelRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (smartBagUrl && navigator.clipboard) {
      navigator.clipboard.writeText(smartBagUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      if (layout === 'brother_ql') {
        await downloadBrotherQlStickerPng({
          ...coffee,
          roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
        });
      } else {
        await downloadCompleteStickerPng({
          ...coffee,
          roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
        });
      }
    } catch (err) {
      console.error('Download sticker error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = async (e) => {
    e.stopPropagation();
    if (layout === 'brother_ql') {
      await printBrotherQlCoffee({
        ...coffee,
        roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
      });
    } else if (labelRef.current) {
      await printHtmlElementIsolated(labelRef.current, {
        width: '3in',
        height: '3in',
        title: `${coffee.beanName || 'Coffee'} Thermal Label`
      });
    } else {
      await printBrotherQlCoffee({
        ...coffee,
        roaster: roaster?.name || coffee.roaster || 'Specialty Roastery'
      });
    }
  };

  const roastText = (coffee.roastLevel || 'Light').toUpperCase();
  const upc = coffee.upc || `LOT-${(coffee.beanName || 'COFFEE').slice(0, 5).toUpperCase()}-2026`;

  // Thermal White Sticker Layout (3" x 3")
  if (layout === 'thermal') {
    return (
      <div 
        ref={labelRef}
        className={`w-full max-w-sm mx-auto flex flex-col justify-between rounded-3xl bg-white text-stone-900 p-5 sm:p-6 border-2 border-stone-800 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/20 group ${isEnlarged ? 'scale-100' : ''}`}
      >
        {/* Alignment corner tick marks */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>
        <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-300 leading-none select-none">+</div>

        <div className="space-y-3">
          {/* Header Tag */}
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-stone-500 font-bold block">
                SPECIALTY ROASTERY • SMART BAG
              </span>
              <h4 className="font-serif text-sm font-bold text-stone-900 leading-tight">
                {roaster?.name || coffee.roaster || 'Specialty Roastery'}
              </h4>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
              {roastText}
            </span>
          </div>

          {/* Bean Lot Name & Terroir */}
          <div>
            <h3 className="font-serif text-base sm:text-lg font-black text-stone-950 leading-snug">
              {coffee.beanName}
            </h3>
            <p className="text-[11px] font-mono text-stone-600 mt-0.5 truncate">
              {coffee.origin || 'Specialty Origin'} • {coffee.process || 'Washed'}
            </p>
          </div>

          {/* Tasting Notes */}
          {coffee.tastingNotes && coffee.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {coffee.tastingNotes.slice(0, 3).map((note, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-stone-100 border border-stone-300 text-[10px] font-mono text-stone-700 font-medium">
                  {note}
                </span>
              ))}
            </div>
          )}

          {/* Live Scannable QR Code */}
          <div className="flex flex-col items-center justify-center p-2.5 bg-stone-50 rounded-2xl border border-stone-200 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Scan Me for Recipe</span>
            </div>

            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Smart Bag QR for ${coffee.beanName}`}
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-lg p-1 bg-white border border-stone-200"
              />
            ) : (
              <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
                Generating QR...
              </div>
            )}

            <span className="text-[8px] font-mono text-stone-500 uppercase tracking-wider mt-1.5 font-bold">
              Aim phone camera to load timer
            </span>
          </div>

          {/* Barista Dial-In Specifications Box */}
          <div className="grid grid-cols-4 gap-1 p-2 rounded-xl bg-stone-100 border border-stone-200 text-center font-mono">
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Ratio</span>
              <span className="text-[11px] font-bold text-amber-900">1:{coffee.recommendedRatio || 16.5}</span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Temp</span>
              <span className="text-[11px] font-bold text-stone-900">{coffee.tempF || 202}°F</span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Method</span>
              <span className="text-[10px] font-bold text-stone-900 truncate block capitalize">
                {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ').split(' ')[0]}
              </span>
            </div>
            <div>
              <span className="text-[8px] uppercase text-stone-500 block">Grind</span>
              <span className="text-[10px] font-bold text-stone-900 truncate block">
                {(coffee.recommendedGrind || 'Med-Fine').split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Barcode representation */}
          <BarcodeStripes value={upc} />
        </div>

        {/* Action Toolbar */}
        <div className="pt-3 mt-3 border-t border-stone-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
            title="Download 300 DPI composite sticker PNG"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Print label direct"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Copy scannable recipe URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          {onEnlarge && (
            <button
              type="button"
              onClick={() => onEnlarge(coffee)}
              className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Enlarge label proof"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Brother QL-600 Compact Thermal Label (1.1" x 2.4" / DK-1209)
  if (layout === 'brother_ql') {
    return (
      <div className={`w-full max-w-md mx-auto flex flex-col justify-between rounded-2xl bg-white text-stone-900 p-3.5 border-2 border-stone-800 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/20 group ${isEnlarged ? 'scale-100' : ''}`}>
        <div className="flex items-stretch justify-between gap-2.5 h-full">
          {/* Left Column: Details */}
          <div className="flex-1 min-w-0 pr-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[7px] font-mono uppercase tracking-wider font-extrabold bg-stone-900 text-white px-1.5 py-0.5 rounded">
                  THEBREW.APP
                </span>
                <span className="text-[7px] font-mono text-stone-500 uppercase tracking-tight truncate">
                  {roastText} Roast
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-stone-950 truncate leading-tight">
                {roaster?.name || coffee.roaster || 'Specialty Roaster'}
              </h4>
              <p className="text-[11px] text-stone-700 font-medium truncate font-sans">
                {coffee.beanName}
              </p>
            </div>

            {/* 4-Cell Dial-In Matrix */}
            <div className="grid grid-cols-2 gap-1 py-1 px-1.5 bg-stone-100 rounded-md border border-stone-200 text-[8px] font-mono my-1">
              <div>
                <span className="text-stone-500 block text-[7px] uppercase leading-none">Ratio</span>
                <span className="font-bold text-amber-800">1:{coffee.recommendedRatio || 16.5}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[7px] uppercase leading-none">Temp</span>
                <span className="font-bold text-stone-900">{coffee.tempF || 202}°F</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[7px] uppercase leading-none">Method</span>
                <span className="font-bold text-stone-900 capitalize truncate block">
                  {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ')}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block text-[7px] uppercase leading-none">Grind</span>
                <span className="font-bold text-stone-900 truncate block">
                  {(coffee.recommendedGrind || 'Med-Fine').split('(')[0]}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[7px] font-mono text-stone-500 pt-0.5 border-t border-stone-200">
              <span className="truncate">{upc}</span>
              <span className="font-bold text-stone-800">Scan Recipe</span>
            </div>
          </div>

          {/* Right Column: Maximized QR Code (Full Height) */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-lg border border-stone-300 h-full aspect-square w-28 h-28 sm:w-32 sm:h-32">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Smart Bag QR for ${coffee.beanName}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-[9px]">
                Generating...
              </div>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="pt-2.5 mt-2.5 border-t border-stone-200 flex items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
            title="Download Brother QL-600 300 DPI label PNG"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Print label direct"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
            title="Copy scannable recipe URL"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>

          {onEnlarge && (
            <button
              type="button"
              onClick={() => onEnlarge(coffee)}
              className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
              title="Enlarge label proof"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Luxury Roaster Badge Layout (Espresso & Gold)
  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col justify-between rounded-3xl bg-[#1A120B] text-cream-light p-5 sm:p-6 border-2 border-amber-gold/60 shadow-2xl relative overflow-hidden select-none transition-all duration-300 hover:shadow-amber-gold/30 group ${isEnlarged ? 'scale-100' : ''}`}>
      {/* Corner gold accents */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-gold" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-gold" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-gold" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-gold" />

      <div className="space-y-3">
        <div className="text-center border-b border-white/10 pb-2">
          <span className="text-[8px] font-mono tracking-widest uppercase font-bold text-amber-gold/90 block">
            DIALED-IN EXTRACTION RECIPE
          </span>
          <h4 className="font-serif text-base font-bold text-cream-light mt-0.5 tracking-wide">
            {roaster?.name || coffee.roaster || 'Specialty Roastery'}
          </h4>
          <p className="text-xs text-amber-200/80 font-serif italic">
            {coffee.beanName}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-md mx-auto w-fit">
          <div className="flex items-center justify-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1A120B] text-amber-gold font-mono text-[9px] font-bold uppercase tracking-wider mb-2 border border-amber-gold/40 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-gold" />
            <span>Scan Me for Recipe</span>
          </div>

          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Smart Bag QR Code"
              className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
            />
          ) : (
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
              Generating QR...
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.06] border border-white/10 text-[10px] font-mono text-center">
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Ratio</span>
            <span className="font-bold text-amber-gold">1:{coffee.recommendedRatio || 16.5}</span>
          </div>
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Temp</span>
            <span className="font-bold text-cream-light">{coffee.tempF || 202}°F</span>
          </div>
          <div>
            <span className="text-cream-soft/60 block text-[8px] uppercase">Method</span>
            <span className="font-bold text-cream-light capitalize truncate block">
              {(coffee.brewMethod || 'pour_over').replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-[8px] font-mono text-amber-gold/70 block uppercase tracking-wider">
            thebrew.app • Smart Bag Certified • {upc}
          </span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 py-1.5 px-2 rounded-lg btn-tactile-amber text-espresso-950 font-mono text-[10px] font-bold flex items-center justify-center gap-1 shadow transition cursor-pointer"
        >
          <Download className="w-3 h-3" />
          <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
        >
          <Printer className="w-3 h-3 text-amber-gold" />
          <span>Print</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-gold" />}
        </button>

        {onEnlarge && (
          <button
            type="button"
            onClick={() => onEnlarge(coffee)}
            className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-cream-light font-mono text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
          >
            <Maximize2 className="w-3 h-3 text-amber-gold" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * High-Resolution Packaging Label Modal Proof with Layout Switcher
 */
function PackagingLabelProofModal({
  coffee,
  roaster,
  qrDataUrl,
  smartBagUrl,
  onClose,
  onBrewCoffee
}) {
  const [layout, setLayout] = useState('thermal'); // 'thermal' | 'badge' | 'brother_ql'
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!coffee) return null;

  const coffeePayload = {
    ...coffee,
    roaster: roaster?.name || coffee.roaster || 'Specialty Roaster'
  };

  const handlePrintModal = async () => {
    setIsPrinting(true);
    try {
      if (layout === 'brother_ql') {
        await printBrotherQlCoffee(coffeePayload);
      } else {
        await printThermalSticker(coffeePayload);
      }
    } catch (err) {
      console.error('Modal print error:', err);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadModal = async () => {
    setIsSaving(true);
    try {
      if (layout === 'brother_ql') {
        await downloadBrotherQlStickerPng(coffeePayload);
      } else {
        await downloadCompleteStickerPng(coffeePayload);
      }
    } catch (err) {
      console.error('Modal download error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative max-w-lg w-full bg-[#120B08] border border-amber-gold/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-gold flex items-center justify-center border border-amber-gold/40">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-cream-light">
                Physical Packaging Label Proof
              </h3>
              <p className="text-[11px] font-mono text-cream-soft/70">
                Live scannable label for {coffee.beanName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-soft hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Layout Switcher */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-black/50 rounded-xl border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setLayout('thermal')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'thermal'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>3"x3" Thermal</span>
          </button>
          <button
            type="button"
            onClick={() => setLayout('badge')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'badge'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>Luxury Badge</span>
          </button>
          <button
            type="button"
            onClick={() => setLayout('brother_ql')}
            className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              layout === 'brother_ql'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-white'
            }`}
            title="Brother QL-600 / QL-800 thermal roll label (DK-1209: 62mm x 29mm / 2.44in x 1.14in)"
          >
            <span>Brother QL (DK-1209)</span>
          </button>
        </div>

        {/* Live Label Proof */}
        <div className="py-2 flex items-center justify-center">
          <CoffeePackagingLabel
            coffee={coffee}
            roaster={roaster}
            qrDataUrl={qrDataUrl}
            smartBagUrl={smartBagUrl}
            layout={layout}
            isEnlarged={true}
          />
        </div>

        {/* Brother QL Driver & Print Instructions Notice */}
        {layout === 'brother_ql' && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-200 text-left space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Printer className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Brother QL-600 / QL-800 Direct Print Instructions:</span>
            </div>
            <p className="text-[11px] text-cyan-100/90 leading-relaxed font-sans">
              1. In your browser print dialog, set <strong>Paper size: 62mm x 29mm (2.44" x 1.14" / DK-1209)</strong>.<br />
              2. Set <strong>Margins: None</strong>.<br />
              3. If you had a previous printer size error, cancel any stuck jobs in Windows before reprinting.
            </p>
          </div>
        )}

        {/* Smartphone Camera Scanning Tip */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-cream-soft text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-gold shrink-0" />
          <span>Point phone camera directly at the QR code to test instant dial-in sync!</span>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handlePrintModal}
            disabled={isPrinting}
            className="flex-1 py-3 px-4 rounded-2xl bg-amber-gold hover:bg-amber-400 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition active:scale-95"
            title="Print label directly to your Brother QL thermal printer"
          >
            <Printer className="w-4 h-4" />
            <span>{isPrinting ? 'Opening Print Dialog...' : 'Print Label Direct'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadModal}
            disabled={isSaving}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            title="Save 300 DPI high-resolution label PNG"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isSaving ? 'Exporting...' : 'Save PNG'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onBrewCoffee) {
                onBrewCoffee({
                  ...coffee,
                  roaster: roaster?.name || 'Specialty Roaster'
                });
              }
            }}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-mono text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Coffee className="w-4 h-4 text-amber-gold" />
            <span>Brew</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
