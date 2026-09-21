import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Droplet,
  Coffee,
  Building,
  ExternalLink
} from 'lucide-react';
import { getShowcaseRoaster, getAllShowcaseRoasters } from '../data/roasterShowcaseData';
import { trackEvent } from '../utils/analytics';
import { useAppOrchestrator } from '../context/AppOrchestratorContext';
import {
  checkRoasterBrandOwnership,
  isDomainVerifiedRoaster,
  extractDomainFromUrl
} from '../utils/roasterVerification';

// Subcomponents
import RoasterHeader from './roaster/RoasterHeader';
import RoasterHero from './roaster/RoasterHero';
import RoasterWaterLab from './roaster/RoasterWaterLab';
import RoasterOfferingsGrid from './roaster/RoasterOfferingsGrid';
import RoasterCafesList from './roaster/RoasterCafesList';
import PackagingLabelProofModal, { useCoffeeLabelQrCodes } from './roaster/PackagingLabelProofModal';
import RoasterVideoModal from './roaster/RoasterVideoModal';

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
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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

  // Recognize authenticated brand owner via strict multi-tenant authorization
  const isBrandOwner = Boolean(currentUser && checkRoasterBrandOwnership(roaster, currentUser));
  const roasterDomain = extractDomainFromUrl(roaster?.website);
  const isDomainVerified = Boolean(
    roaster?.ownerEmail && roaster?.website && isDomainVerifiedRoaster(roaster.ownerEmail, roaster.website)
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
        setIsVideoModalOpen(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('view_roaster_profile_page', {
      roaster_id: roaster?.id,
      roaster_name: roaster?.name
    });
  }, [activeRoasterId, roaster?.id, roaster?.name]);

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
        roaster: roaster?.name,
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

  const synthesizedFromUrl = useMemo(() => {
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

  if (!roaster) return null;

  return (
    <div className="min-h-screen bg-[#0A0604] text-cream-light selection:bg-amber-gold selection:text-espresso-950 font-sans pb-24 relative overflow-hidden">
      
      {/* 1. AMBIENT ATMOSPHERE */}
      <div className="absolute top-0 inset-x-0 h-[680px] pointer-events-none overflow-hidden select-none z-0">
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-25 blur-[120px]"
          style={{ background: roaster.brandColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0604]/80 to-[#0A0604]" />
      </div>

      {/* 2. TOP STICKY NAVIGATION BAR */}
      <RoasterHeader
        onBackToApp={onBackToApp}
        isBrandOwner={isBrandOwner}
        isDomainVerified={isDomainVerified}
        roaster={roaster}
        activeRoasterId={activeRoasterId}
        setActiveRoasterId={setActiveRoasterId}
        allRoasters={allRoasters}
        roasterScrollRef={roasterScrollRef}
        copiedLink={copiedLink}
        handleSharePage={handleSharePage}
      />

      {/* 3. HERO & CONTENT SHOWCASE SECTION */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 space-y-12">
        
        {/* Brand Hero, Origin Story, and Stats */}
        <RoasterHero
          roaster={roaster}
          isBrandOwner={isBrandOwner}
          isDomainVerified={isDomainVerified}
          roasterDomain={roasterDomain}
          currentUser={currentUser}
          onOpenRoasterInfo={onOpenRoasterInfo}
          onOpenRoasterPortalWithBean={onOpenRoasterPortalWithBean}
          onWatchVideo={() => setIsVideoModalOpen(true)}
        />

        {/* Cupping Room Water Chemistry */}
        <RoasterWaterLab
          roaster={roaster}
          orchestrator={orchestrator}
          onOpenWaterLabWithProfile={onOpenWaterLabWithProfile}
        />

        {/* Quick Jump Section Nav */}
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
              <span>Certified Coffees ({roaster.coffees?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => document.getElementById('cafes-labs')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-amber-gold hover:text-espresso-950 text-cream-light transition whitespace-nowrap flex items-center gap-1.5 font-bold cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Cafes & Labs ({roaster.cafes?.length || 0})</span>
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

        {/* Certified Coffee Lineup & Dial-In Station */}
        <RoasterOfferingsGrid
          roaster={roaster}
          activeScannedCoffee={activeScannedCoffee}
          coffeeViewMode={coffeeViewMode}
          setCoffeeViewMode={setCoffeeViewMode}
          qrCodeMap={qrCodeMap}
          cardLabelFlipMap={cardLabelFlipMap}
          handleToggleCardFlip={handleToggleCardFlip}
          savedToJournalId={savedToJournalId}
          handleSaveToJournal={handleSaveToJournal}
          setActiveLabelModalCoffee={setActiveLabelModalCoffee}
          onBrewCoffee={onBrewCoffee}
          orchestrator={orchestrator}
          isBrandOwner={isBrandOwner}
          onOpenRoasterPortalWithBean={onOpenRoasterPortalWithBean}
        />

        {/* Cafes & Roastery Labs Section */}
        <RoasterCafesList
          roaster={roaster}
          isBrandOwner={isBrandOwner}
          onOpenRoasterPortalWithBean={onOpenRoasterPortalWithBean}
          orchestrator={orchestrator}
        />

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

      {/* 60-Second Video Walkthrough Theater Modal */}
      <RoasterVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

    </div>
  );
}
