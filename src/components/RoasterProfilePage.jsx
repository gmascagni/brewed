import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Building,
  Heart,
  Flame,
  Scale,
  Calendar,
  Layers,
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';
import { SHOWCASE_ROASTERS, getShowcaseRoaster } from '../data/roasterShowcaseData';
import { trackEvent } from '../utils/analytics';

export default function RoasterProfilePage({
  initialRoasterId = 'methodical',
  onBackToApp,
  onBrewCoffee,
  onOpenWaterLabWithProfile,
  onOpenRoasterPortalWithBean,
  onOpenRoasterInfo
}) {
  const [activeRoasterId, setActiveRoasterId] = useState(initialRoasterId);
  const [activeTab, setActiveTab] = useState('coffees'); // 'coffees' | 'story' | 'water' | 'cafes'
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedCoffeeForQuickView, setSelectedCoffeeForQuickView] = useState(null);

  const roaster = getShowcaseRoaster(activeRoasterId);

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

  return (
    <div className="min-h-screen bg-[#0A0604] text-cream-light selection:bg-amber-gold selection:text-espresso-950 font-sans pb-24 relative overflow-hidden">
      
      {/* ========================================================================= */}
      {/* 1. BACKGROUND LOGO WATERMARK & AMBIENT ATMOSPHERE                        */}
      {/* ========================================================================= */}
      <div className="absolute top-0 inset-x-0 h-[680px] pointer-events-none overflow-hidden select-none z-0">
        
        {/* Ambient warm radial backlighting */}
        <div 
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-25 blur-[120px]"
          style={{ background: roaster.brandColor }}
        />

        {/* Gigantic Roaster Monogram Watermark */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center opacity-[0.06] transform scale-110">
          <span 
            className="font-serif font-black text-[280px] sm:text-[380px] leading-none tracking-tighter"
            style={{ color: roaster.brandColor }}
          >
            {roaster.monogram}
          </span>
          <span className="font-mono text-xs sm:text-sm tracking-[0.3em] uppercase -mt-16 text-cream-soft font-bold">
            {roaster.emblemSubtitle}
          </span>
        </div>

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
                className="py-1.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition shadow"
                title="Return to Brewing Station"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Brewing Station</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-gold">
                Verified Roaster Partner
              </span>
            </div>
          </div>

          {/* Roaster Switcher Dropdown / Pills */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs font-mono text-cream-soft/60">
              Demo Showcase:
            </span>
            <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
              {SHOWCASE_ROASTERS.map((r) => {
                const isSelected = r.id === activeRoasterId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveRoasterId(r.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap ${
                      isSelected
                        ? 'bg-amber-gold text-espresso-950 shadow-md'
                        : 'text-cream-soft hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {r.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleSharePage}
              className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
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
            <span className="px-3 py-1 rounded-full bg-amber-500/25 text-amber-300 font-mono text-xs font-extrabold border border-amber-500/50 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
              <span>Showcase Demonstration • Example Profile</span>
            </span>

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

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Smart Bag Verified Spec</span>
            </span>
          </div>

          {/* Roaster Big Title & Tagline */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream-light tracking-tight leading-none">
              {roaster.name}
            </h1>
            <p className="font-serif italic text-lg sm:text-2xl text-amber-gold font-medium">
              "{roaster.tagline}"
            </p>
          </div>

          {/* Transparent Showcase Demonstration & Partner Example Notice */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs font-mono text-cream-soft/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md shadow-lg">
            <div className="flex items-start sm:items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-amber-gold/20 text-amber-gold font-bold text-[10px] uppercase tracking-wider border border-amber-gold/40 shrink-0">
                Demo / Example Only
              </span>
              <span className="leading-relaxed">
                This profile represents an illustrative partner demonstration of The Brew App Smart Bag catalog. Coffee descriptions and trademarks belong to their respective roasteries.
              </span>
            </div>
            {onOpenRoasterInfo && (
              <button
                onClick={onOpenRoasterInfo}
                className="text-amber-gold hover:underline font-bold text-xs flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto"
              >
                <span>Are you a roaster? Ingest official labels</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

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

          {/* Action CTAs */}
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

            {onOpenRoasterInfo && (
              <button
                onClick={onOpenRoasterInfo}
                className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono text-xs font-bold border border-white/15 flex items-center gap-2 transition"
              >
                <Store className="w-3.5 h-3.5 text-amber-gold" />
                <span>Onboard Your Roastery</span>
              </button>
            )}

            <div className="text-xs font-mono text-cream-soft/60 hidden lg:block ml-2">
              Founders: <span className="text-cream-light font-bold">{roaster.founders.join(', ')}</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. ROASTER SECTION TABS                                                  */}
        {/* ========================================================================= */}
        <div className="border-b border-white/10 pt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 text-xs font-mono">
            <button
              onClick={() => setActiveTab('coffees')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
                activeTab === 'coffees'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Certified Coffees & Dial-In Recipes ({roaster.coffees.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('story')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
                activeTab === 'story'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Origin Story & Craft</span>
            </button>

            <button
              onClick={() => setActiveTab('water')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
                activeTab === 'water'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>Cupping Room Water Spec</span>
            </button>

            <button
              onClick={() => setActiveTab('cafes')}
              className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
                activeTab === 'cafes'
                  ? 'bg-amber-gold text-espresso-950 shadow'
                  : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Cafes & Roastery Labs ({roaster.cafes.length})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: CERTIFIED COFFEE LINEUP & DIAL-IN STATION                          */}
        {/* ========================================================================= */}
        {activeTab === 'coffees' && (
          <div className="space-y-8 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-black/40 to-transparent border border-amber-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-gold animate-ping" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                    Roaster-Certified Dial-In Station
                  </h3>
                </div>
                <p className="text-xs text-cream-soft font-sans">
                  Click <strong>"Dial-In & Brew"</strong> on any lot below to automatically transfer the roaster's golden ratio, water temperature, grind setting, and bloom steps into The Brew App live timer.
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-mono text-amber-300 font-bold shrink-0">
                Showcase Sample Dial-Ins
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {roaster.coffees.map((coffee) => (
                <div
                  key={coffee.id}
                  className="rounded-3xl bg-black/40 border border-white/10 hover:border-amber-gold/50 p-6 flex flex-col justify-between gap-6 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-amber-gold/5 relative overflow-hidden"
                >
                  {/* Top Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-gold font-mono text-[10px] font-bold border border-amber-500/30">
                        {coffee.badge} • Showcase Demo
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>SCA {coffee.cuppingScore}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-xl font-bold text-cream-light group-hover:text-amber-gold transition leading-snug">
                        {coffee.beanName}
                      </h4>
                      <p className="text-xs font-mono text-cream-soft/70 mt-1">
                        {coffee.origin}
                      </p>
                    </div>

                    <p className="text-xs text-cream-soft font-sans leading-relaxed">
                      {coffee.description}
                    </p>

                    {/* Tasting Notes Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {coffee.tastingNotes.map((note, i) => (
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
                        <span className="text-cream-light font-bold">{coffee.process}</span>
                      </div>
                      <div className="flex justify-between text-cream-soft">
                        <span>Varietal:</span>
                        <span className="text-cream-light">{coffee.varietal}</span>
                      </div>
                      <div className="flex justify-between text-cream-soft">
                        <span>Elevation:</span>
                        <span className="text-amber-gold">{coffee.elevation}</span>
                      </div>
                    </div>

                    {/* Dial-In Parameters Box */}
                    <div className="p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-500/25 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-gold font-bold uppercase tracking-wider">
                        <span>Dial-In Parameters:</span>
                        <span className="capitalize">{coffee.brewMethod.replace(/_/g, ' ')}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Ratio</span>
                          <strong className="text-cream-light font-bold">1:{coffee.recommendedRatio}</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Water Temp</span>
                          <strong className="text-amber-gold font-bold">{coffee.tempF}°F</strong>
                        </div>
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                          <span className="text-[10px] text-cream-soft/60 block">Time</span>
                          <strong className="text-cream-light font-bold">{coffee.brewTime}</strong>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-cream-soft/80 flex items-center justify-between pt-1">
                        <span>Grind Setting:</span>
                        <span className="text-cream-light font-bold">{coffee.recommendedGrind}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    
                    {/* Primary Dial-In Button */}
                    <button
                      onClick={() => {
                        if (onBrewCoffee) {
                          onBrewCoffee({
                            ...coffee,
                            roaster: roaster.name
                          });
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Dial-In & Brew ({coffee.dryDoseGrams}g : {coffee.waterGrams}g)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Smart Bag QR Studio Trigger */}
                      <button
                        onClick={() => {
                          if (onOpenRoasterPortalWithBean) {
                            onOpenRoasterPortalWithBean({
                              roaster: roaster.name,
                              beanName: coffee.beanName,
                              brewMethod: coffee.brewMethod,
                              recommendedRatio: coffee.recommendedRatio,
                              tempF: coffee.tempF,
                              recommendedGrind: coffee.recommendedGrind,
                              upc: coffee.upc,
                              customUrl: coffee.directUrl
                            });
                          }
                        }}
                        className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1.5 transition"
                        title="Download or print packaging QR sticker"
                      >
                        <QrCode className="w-3.5 h-3.5 text-amber-gold" />
                        <span>Smart Bag QR</span>
                      </button>

                      {/* Buy Direct from Roaster */}
                      <a
                        href={coffee.directUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-cream-light flex items-center justify-center gap-1.5 transition"
                        title="Purchase directly on roaster's website"
                      >
                        <span>Buy {coffee.price}</span>
                        <ExternalLink className="w-3 h-3 text-cream-soft" />
                      </a>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORIGIN STORY & ROASTING PHILOSOPHY                                 */}
        {/* ========================================================================= */}
        {activeTab === 'story' && (
          <div className="space-y-10 animate-fade-in max-w-4xl">
            
            {/* Origin Story Narrative */}
            <div className="p-8 rounded-3xl bg-black/40 border border-white/10 space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-gold">
                  Our Founding Narrative
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
                  How {roaster.name} Came to Be
                </h3>
              </div>

              <div className="space-y-4 font-serif text-base sm:text-lg text-cream-soft leading-relaxed">
                {roaster.originStory.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="text-cream-soft/80">
                  Founding Team: <strong className="text-cream-light">{roaster.founders.join(' • ')}</strong>
                </div>
                <div className="text-amber-gold">
                  Headquartered in {roaster.city}, {roaster.state}
                </div>
              </div>
            </div>

            {/* Roasting Craft & Machinery */}
            <div className="p-8 rounded-3xl bg-[#140C08] border border-amber-gold/30 space-y-5 shadow-xl">
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
                {roaster.roastingPhilosophy}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-cream-soft/70 block">Production Equipment</span>
                  <span className="font-serif text-base font-bold text-cream-light block">{roaster.roasterMachines}</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-cream-soft/70 block">Sourcing Ethics</span>
                  <span className="font-serif text-base font-bold text-cream-light block">{roaster.sourcingPhilosophy}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CUPPING ROOM WATER CHEMISTRY                                      */}
        {/* ========================================================================= */}
        {activeTab === 'water' && (
          <div className="space-y-8 animate-fade-in max-w-4xl">
            
            <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-black/50 to-espresso-950 border border-cyan-500/30 space-y-6 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow">
                    <Droplet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Roaster-Approved Mineral Profile
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-cream-light">
                      {roaster.name} Cupping Room Water Specification
                    </h3>
                  </div>
                </div>

                {onOpenWaterLabWithProfile && (
                  <button
                    onClick={() => {
                      onOpenWaterLabWithProfile(roaster.recommendedWater);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition"
                  >
                    <span>Open in Water Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <p className="text-sm text-cream-soft font-sans leading-relaxed">
                {roaster.recommendedWater.philosophy}
              </p>

              {/* Water Targets Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                  <span className="text-[10px] uppercase text-cyan-400/80 block">Target TDS</span>
                  <span className="text-2xl font-bold text-cream-light">{roaster.recommendedWater.targetTds}</span>
                  <span className="text-[10px] text-cream-soft/60 block">PPM</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                  <span className="text-[10px] uppercase text-cyan-400/80 block">Hardness (GH)</span>
                  <span className="text-2xl font-bold text-amber-gold">{roaster.recommendedWater.gh}</span>
                  <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                  <span className="text-[10px] uppercase text-cyan-400/80 block">Buffer (KH)</span>
                  <span className="text-2xl font-bold text-emerald-400">{roaster.recommendedWater.kh}</span>
                  <span className="text-[10px] text-cream-soft/60 block">PPM CaCO3</span>
                </div>

                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/20 text-center">
                  <span className="text-[10px] uppercase text-cyan-400/80 block">Target pH</span>
                  <span className="text-2xl font-bold text-cyan-300">{roaster.recommendedWater.ph}</span>
                  <span className="text-[10px] text-cream-soft/60 block">Neutral Balanced</span>
                </div>
              </div>

              {/* Bottled Water Recommendation */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-xs">
                <div className="font-mono text-amber-gold font-bold">
                  Recommended Bottled Water Pairing:
                </div>
                <p className="text-cream-soft font-sans">
                  {roaster.recommendedWater.bottledWaterPairing}
                </p>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CAFES & ROASTERY LABS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'cafes' && (
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roaster.cafes.map((cafe, i) => (
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
        )}

      </main>

    </div>
  );
}
