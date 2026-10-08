import React, { useState, useEffect, useMemo } from 'react';
import {
  Coffee,
  Play,
  QrCode,
  Flame,
  Droplet,
  Thermometer,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Store,
  ChevronLeft,
  Bookmark,
  Share2,
  CheckCircle2,
  Sliders,
  Scale,
  Award,
  Globe,
  Instagram,
  Download,
  Copy
} from 'lucide-react';
import QRCode from 'qrcode';
import { getCoffeeCustomerUrl } from '../data/roasterRegistry';
import { logBrewSession } from '../utils/journalStorage';
import { trackEvent } from '../utils/analytics';

export default function CoffeeLandingPage({
  roasterSlug,
  coffeeSlug,
  coffee,
  onStartGuidedBrew,
  onNavigateToRoaster,
  onBackToHome
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Fallback defaults if certain fields are unset
  const beanName = coffee?.beanName || 'Specialty Micro-Lot';
  const roasterName = coffee?.roaster || coffee?.roasterInfo?.name || 'Specialty Coffee Roaster';
  const origin = coffee?.origin || 'Single Origin';
  const farm = coffee?.farm || 'Artisan Producer Estate';
  const region = coffee?.region || 'Specialty Highland Growing Region';
  const variety = coffee?.varietal || coffee?.variety || 'Specialty Arabica Heirloom';
  const process = coffee?.process || 'Washed';
  const elevation = coffee?.elevation || '1,800+ MASL';
  const roastLevel = coffee?.roastLevel || 'Light Roast';
  
  const tastingNotes = useMemo(() => {
    if (Array.isArray(coffee?.tastingNotes) && coffee.tastingNotes.length > 0) {
      return coffee.tastingNotes;
    }
    if (typeof coffee?.tastingNotes === 'string' && coffee.tastingNotes.trim()) {
      return coffee.tastingNotes.split(',').map((s) => s.trim());
    }
    if (typeof coffee?.notes === 'string' && coffee.notes.trim()) {
      return coffee.notes.split(',').map((s) => s.trim());
    }
    return ['Floral Aromatics', 'Vibrant Sweetness', 'Clean Finish'];
  }, [coffee]);

  // Extraction Parameters
  const brewMethod = coffee?.brewMethod || 'pour_over';
  const ratio = Number(coffee?.recommendedRatio || coffee?.ratio || 16.5);
  const dose = Number(coffee?.doseGrams || coffee?.dryDoseGrams || 18.0);
  const water = Number(coffee?.waterGrams || Math.round(dose * ratio) || 297);
  const tempF = Number(coffee?.tempF || 202);
  const tempC = Number(coffee?.tempC || Math.round(((tempF - 32) * 5) / 9 * 10) / 10 || 94.4);
  const grind = coffee?.recommendedGrind || 'Medium-Fine (620µm)';
  const brewTime = coffee?.brewTime || '3m 15s';
  const bloom = coffee?.bloom || '45-second bloom with 50g water';
  const roasterNotes = coffee?.description || coffee?.roasterNotes || '';

  // Roaster Links
  const shopLink = coffee?.shopLink || coffee?.directUrl || coffee?.roasterInfo?.shopUrl || coffee?.roasterInfo?.website || '';
  const instagram = coffee?.instagram || coffee?.roasterInfo?.instagram || '';
  const website = coffee?.website || coffee?.roasterInfo?.website || '';
  const logoImage = coffee?.logoImage || coffee?.roasterInfo?.logoImage || '';

  // Demonstration / Showcase Status
  const isDemo = Boolean(
    coffee?.isDemoExample ||
    coffee?.roasterInfo?.isDemoExample ||
    ['onyx', 'onyx-coffee-lab', 'methodical', 'methodical-coffee', 'black_and_white', 'black-and-white'].includes(String(roasterSlug || '').toLowerCase())
  );
  const demoNotice = coffee?.demoNotice || coffee?.roasterInfo?.demoNotice || `${roasterName} is an illustrative demonstration showcase on The Brew and is not currently an official onboarded partner.`;

  const customerUrl = useMemo(() => {
    return getCoffeeCustomerUrl(coffee);
  }, [coffee]);

  // Generate high-res QR code pointing to this exact customer URL
  useEffect(() => {
    QRCode.toDataURL(customerUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#14110F',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.warn('Error generating QR code:', err));
  }, [customerUrl]);

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(customerUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      trackEvent('coffee_share_link_copied', { roaster: roasterName, coffee: beanName });
    } catch {}
  };

  const handleSaveToCellar = () => {
    try {
      logBrewSession({
        coffeeName: beanName,
        roaster: roasterName,
        origin,
        process,
        roastLevel,
        method: brewMethod,
        doseGrams: dose,
        waterGrams: water,
        ratio,
        tempF,
        grindSetting: grind,
        notes: `Saved from Roaster Verified Guide: ${tastingNotes.join(', ')}`
      });
      setSavedToJournal(true);
      setTimeout(() => setSavedToJournal(false), 2500);
      trackEvent('coffee_saved_to_cellar', { roaster: roasterName, coffee: beanName });
    } catch {}
  };

  const handleLaunchBrew = () => {
    trackEvent('coffee_start_guided_brew', { roaster: roasterName, coffee: beanName, method: brewMethod });
    if (onStartGuidedBrew) {
      onStartGuidedBrew(coffee);
    }
  };

  const formattedMethodName = useMemo(() => {
    switch (brewMethod) {
      case 'pour_over':
        return 'Conical Pour Over (V60)';
      case 'classic_pour_over':
        return 'Flat-Bottom (Kalita Wave)';
      case 'chemex':
        return 'Chemex Glass';
      case 'aeropress':
        return 'AeroPress Precision';
      case 'french_press':
        return 'French Press Immersion';
      case 'espresso':
        return '9-Bar Espresso';
      case 'moka_pot':
        return 'Moka Pot Stovetop';
      case 'drip_brewer':
        return 'Batch Precision Brewer';
      default:
        return brewMethod.replace(/_/g, ' ').toUpperCase();
    }
  }, [brewMethod]);

  return (
    <div className="space-y-10 animate-fade-in max-w-5xl mx-auto pb-16">
      {/* Top Breadcrumb & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pb-2 border-b border-[#ECE6DC]">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-800 hover:text-amber-800 font-bold border border-[#ECE6DC] shadow-xs transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 text-[#A8622D]" />
          <span>The Brew Station</span>
        </button>

        <div className="flex items-center gap-2">
          {roasterSlug && onNavigateToRoaster && (
            <button
              type="button"
              onClick={() => onNavigateToRoaster(roasterSlug)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-900 font-bold border border-[#ECE6DC] shadow-xs transition cursor-pointer"
            >
              <Store className="w-3.5 h-3.5 text-[#A8622D]" />
              <span>{roasterName} Profile</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-stone-900 font-bold border border-[#ECE6DC] shadow-xs transition cursor-pointer"
            title="Copy unique bag URL"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#A8622D]" />
                <span>Share Guide</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Coffee Spotlight Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#1E1915] via-[#14110F] to-[#0D0B0A] border border-amber-gold/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            {/* Roaster Brand Lockup */}
            <div className="flex items-center gap-3">
              {logoImage ? (
                <div className="w-12 h-12 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                  <img src={logoImage} alt={roasterName} className="max-w-full max-h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-gold font-bold font-mono">
                  {roasterName.charAt(0)}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest font-black text-amber-400">
                    {isDemo ? 'Demonstration Showcase Guide' : 'Official Roaster Dial-In Guide'}
                  </span>
                  {isDemo ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 font-mono text-[10px] font-black border border-amber-400/50">
                      ✦ Demo Preview
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-mono text-[10px] font-black border border-emerald-400/50">
                      ✓ Verified Partner
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-sans font-extrabold text-white">
                  {roasterName}
                </h3>
              </div>
            </div>

            {/* Prominent Demo Notice Banner if not an official onboarded partner */}
            {isDemo && (
              <div className="p-3.5 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-start gap-2.5 text-xs font-mono text-amber-200 shadow-sm animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-white block font-sans text-xs mb-0.5">Demonstration Showcase Profile</strong>
                  <span>{demoNotice}</span>
                </div>
              </div>
            )}

            {/* Coffee Lot Title */}
            <div>
              <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {beanName}
              </h1>
              <p className="text-sm sm:text-base font-sans text-stone-200 mt-2 leading-relaxed font-medium">
                {origin} • {region} • {process} • {elevation}
              </p>
            </div>

            {/* Tasting Notes Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-300 font-bold block">
                Cupping Tasting Notes:
              </span>
              <div className="flex flex-wrap gap-2">
                {tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-500/25 border-2 border-amber-400/60 text-amber-100 text-xs font-mono font-bold shadow-xs"
                  >
                    ✦ {note}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Bag QR Card */}
          <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
            {qrDataUrl && (
              <div
                onClick={() => setShowQrModal(true)}
                className="p-3.5 rounded-2xl bg-white shadow-2xl cursor-pointer hover:scale-105 transition border-2 border-amber-400 group relative"
                title="Click to view packaging QR code"
              >
                <img src={qrDataUrl} alt="Smart Bag QR" className="w-28 h-28 object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-mono font-black">
                  View Full QR
                </div>
              </div>
            )}
            <span className="text-xs font-mono text-stone-200 text-center sm:text-right font-medium">
              Bag QR Destination<br />
              <strong className="text-amber-300 font-black">{roasterSlug}/{coffeeSlug}</strong>
            </span>
          </div>
        </div>

        {/* Primary Action Row: Start Guided Brew & Buy Beans */}
        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono text-stone-200 font-medium">
              No app download required • Guided timer launches directly in browser
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleSaveToCellar}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
            >
              <Bookmark className={`w-4 h-4 ${savedToJournal ? 'text-amber-300 fill-amber-300' : 'text-stone-300'}`} />
              <span>{savedToJournal ? 'Saved to Cellar!' : 'Save Lot'}</span>
            </button>

            {shopLink && (
              <a
                href={shopLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs font-black flex items-center gap-1.5 border border-white/30 transition shadow-xs"
              >
                <span>Buy This Coffee</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              </a>
            )}

            <button
              type="button"
              onClick={handleLaunchBrew}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-stone-950 font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Start Guided Brew</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recipe & Dial-In Parameters + Lot Origin & Terroir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recommended Brewing Recipe (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#18130F] border-2 border-amber-500/30 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-stone-800">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-black tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isDemo ? "Showcase Recommended Brew Recipe" : "Roaster's Recommended Brew Recipe"}</span>
              </div>
              <span className="text-xs font-mono text-amber-200/90 font-bold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/40 self-start sm:self-auto shadow-xs">
                {isDemo ? 'Demonstration Recipe Calibration' : 'Calibrated by Head Roaster'}
              </span>
            </div>

            {/* Method Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#281C14] via-[#1E140E] to-[#281C14] border-2 border-amber-400/60 shadow-lg flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-300 uppercase font-black tracking-wider block">
                  Recommended Method
                </span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5 tracking-tight">
                  {formattedMethodName}
                </h4>
              </div>
              <div className="px-4 py-2 rounded-xl bg-amber-400 text-stone-950 font-mono text-sm font-black shadow-md border border-amber-300 tracking-wide shrink-0">
                Ratio 1 : {ratio}
              </div>
            </div>

            {/* Extraction Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-[#241A13] border-2 border-amber-500/30 hover:border-amber-400/70 text-center space-y-1.5 shadow-md transition">
                <Scale className="w-5 h-5 text-amber-300 mx-auto" />
                <span className="text-xs font-mono text-stone-200 uppercase font-bold tracking-wider block">Coffee Dose</span>
                <span className="text-2xl font-mono font-black text-white block">{dose}g</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#241A13] border-2 border-amber-500/30 hover:border-amber-400/70 text-center space-y-1.5 shadow-md transition">
                <Droplet className="w-5 h-5 text-sky-300 mx-auto" />
                <span className="text-xs font-mono text-stone-200 uppercase font-bold tracking-wider block">Total Water</span>
                <span className="text-2xl font-mono font-black text-white block">{water}g</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#241A13] border-2 border-amber-500/30 hover:border-amber-400/70 text-center space-y-1.5 shadow-md transition">
                <Thermometer className="w-5 h-5 text-rose-300 mx-auto" />
                <span className="text-xs font-mono text-stone-200 uppercase font-bold tracking-wider block">Water Temp</span>
                <span className="text-2xl font-mono font-black text-white block">
                  {tempF}°F <span className="text-xs font-medium text-stone-300 block sm:inline">({tempC}°C)</span>
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#241A13] border-2 border-amber-500/30 hover:border-amber-400/70 text-center space-y-1.5 shadow-md transition">
                <Clock className="w-5 h-5 text-emerald-300 mx-auto" />
                <span className="text-xs font-mono text-stone-200 uppercase font-bold tracking-wider block">Total Time</span>
                <span className="text-2xl font-mono font-black text-white block">{brewTime}</span>
              </div>
            </div>

            {/* Grind & Bloom Cards */}
            <div className="space-y-3">
              <div className="p-4.5 rounded-2xl bg-[#221912] border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
                <Sliders className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-mono font-bold text-white block">
                    Grind Size Setting: <span className="text-amber-300 font-black bg-amber-500/25 px-2.5 py-0.5 rounded-md border border-amber-400/40 ml-1.5">{grind}</span>
                  </span>
                  <p className="text-xs font-sans text-stone-200 mt-1.5 leading-relaxed">
                    A calibrated burr grind balances extraction surface area with percolation drainage speed.
                  </p>
                </div>
              </div>

              {bloom && (
                <div className="p-4.5 rounded-2xl bg-[#221912] border border-amber-500/30 flex items-start gap-3.5 shadow-xs">
                  <Flame className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-sm font-mono font-bold text-white block">
                      Bloom Phase & Degassing: <span className="text-amber-300 font-black bg-amber-500/25 px-2.5 py-0.5 rounded-md border border-amber-400/40 ml-1.5">{bloom}</span>
                    </span>
                    <p className="text-xs font-sans text-stone-200 mt-1.5 leading-relaxed">
                      Saturate all dry grounds completely during the bloom to release roasted CO2 and ensure uniform water channels during subsequent pours.
                    </p>
                  </div>
                </div>
              )}

              {roasterNotes && (
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#281C14] to-[#1E140E] border-2 border-amber-400/50 space-y-1.5 shadow-sm">
                  <span className="text-xs font-mono text-amber-300 uppercase font-black tracking-wider block">
                    Roaster's Pour Cadence & Advice:
                  </span>
                  <p className="text-sm font-sans text-stone-100 leading-relaxed italic">
                    "{roasterNotes}"
                  </p>
                </div>
              )}
            </div>

            {/* Big Launch Guided Brew CTA */}
            <button
              type="button"
              onClick={handleLaunchBrew}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:brightness-110 text-stone-950 font-mono text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Launch Guided Brew Timer ({formattedMethodName})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Grinder Calibration Helper Table */}
          <div className="p-6 rounded-3xl bg-[#18130F] border-2 border-amber-500/30 space-y-4 shadow-xl">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-black block">
              Quick Grinder Calibration Reference
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#241A13] border border-amber-500/25 text-center">
                <span className="text-stone-300 text-[11px] font-bold block mb-1">Comandante C40</span>
                <span className="text-amber-200 font-black text-sm">22–24 Clicks</span>
              </div>
              <div className="p-3 rounded-xl bg-[#241A13] border border-amber-500/25 text-center">
                <span className="text-stone-300 text-[11px] font-bold block mb-1">Baratza Encore</span>
                <span className="text-amber-200 font-black text-sm">Setting 14–16</span>
              </div>
              <div className="p-3 rounded-xl bg-[#241A13] border border-amber-500/25 text-center">
                <span className="text-stone-300 text-[11px] font-bold block mb-1">Fellow Ode (Gen 2)</span>
                <span className="text-amber-200 font-black text-sm">Setting 4.1–5.0</span>
              </div>
              <div className="p-3 rounded-xl bg-[#241A13] border border-amber-500/25 text-center">
                <span className="text-stone-300 text-[11px] font-bold block mb-1">Timemore C2/C3</span>
                <span className="text-amber-200 font-black text-sm">18–20 Clicks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Terroir, Origin & Roastery Knowledge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Origin & Terroir Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#18130F] border-2 border-amber-500/30 space-y-5 shadow-xl">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-black tracking-wider pb-2 border-b border-stone-800">
              <Globe className="w-4 h-4 text-amber-300" />
              <span>Origin Terroir & Processing</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Country Origin</span>
                <span className="text-white font-extrabold">{origin}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Region / Zone</span>
                <span className="text-white font-extrabold">{region}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Producer / Farm</span>
                <span className="text-white font-extrabold">{farm}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Botanical Variety</span>
                <span className="text-white font-extrabold">{variety}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Processing Method</span>
                <span className="text-white font-extrabold">{process}</span>
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                <span className="text-stone-300 font-bold">Elevation</span>
                <span className="text-white font-extrabold">{elevation}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-bold">Roast Profile</span>
                <span className="text-white font-extrabold">{roastLevel}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#241A13] border border-amber-500/30 text-xs font-sans text-stone-200 leading-relaxed shadow-xs">
              <strong className="text-amber-300 font-mono font-black block mb-1">Terroir Impact:</strong>
              High elevation ({elevation}) slows cherry maturation, concentrating complex organic fruit sugars and crisp citric acidity that shine under precise extraction.
            </div>
          </div>

          {/* About the Roastery Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#18130F] border-2 border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-black tracking-wider">
                <Store className="w-4 h-4 text-amber-300" />
                <span>About {roasterName}</span>
              </div>
              {roasterSlug && onNavigateToRoaster && (
                <button
                  type="button"
                  onClick={() => onNavigateToRoaster(roasterSlug)}
                  className="text-xs font-mono text-amber-300 hover:text-amber-200 font-bold hover:underline cursor-pointer"
                >
                  View Showcase →
                </button>
              )}
            </div>

            <p className="text-xs font-sans text-stone-200 leading-relaxed">
              {coffee?.roasterInfo?.originStory?.[0] ||
                coffee?.about ||
                `${roasterName} roasts exceptional specialty coffees with precision heat transfer and deep producer relationships, bringing direct-trade lots to passionate home baristas.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              {shopLink && (
                <a
                  href={shopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-mono text-xs font-black flex items-center gap-1.5 shadow-md transition"
                >
                  <span>Visit Roaster Store</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
                </a>
              )}

              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 border border-white/20 transition"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-300" />
                  <span>Website</span>
                </a>
              )}

              {instagram && (
                <a
                  href={instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 border border-white/20 transition"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>{instagram.startsWith('@') ? instagram : '@roaster'}</span>
                </a>
              )}
            </div>
          </div>

          {/* Roaster Partner Callout / Ecosystem Principle */}
          <div className="p-5.5 rounded-3xl bg-gradient-to-r from-[#281C14] to-[#1E140E] border-2 border-amber-400/40 text-xs font-mono space-y-2 shadow-lg">
            <span className="font-black text-amber-300 uppercase block text-xs">
              Are you a specialty coffee roaster?
            </span>
            <p className="text-stone-200 text-xs font-sans leading-relaxed">
              Create a free Roaster Hub profile to generate custom Smart Bag QR codes, connect your coffees to daily home baristas, and direct customers straight back to your shop.
            </p>
            <a
              href="/roasters"
              className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 hover:underline font-black"
            >
              <span>Explore Roaster Hub Founding Program →</span>
            </a>
          </div>
        </div>
      </div>

      {/* QR Code Modal Overlay */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#1C1815] border border-amber-gold/40 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream-light cursor-pointer"
            >
              ✕
            </button>

            <span className="text-[10px] font-mono text-amber-gold uppercase font-bold tracking-wider block">
              Smart Bag Packaging QR Code
            </span>
            <h3 className="font-serif text-xl font-bold text-cream-light">
              {beanName}
            </h3>

            {qrDataUrl && (
              <div className="p-4 rounded-2xl bg-white inline-block shadow-lg mx-auto">
                <img src={qrDataUrl} alt="Smart Bag QR" className="w-48 h-48 object-contain" />
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-[11px] text-cream-soft break-all">
              {customerUrl}
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-light font-mono text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 text-amber-gold" />
                <span>{copiedLink ? 'Copied!' : 'Copy URL'}</span>
              </button>

              {qrDataUrl && (
                <a
                  href={qrDataUrl}
                  download={`smart_bag_qr_${roasterSlug}_${coffeeSlug}.png`}
                  className="px-4 py-2 rounded-xl bg-amber-gold text-espresso-950 font-mono text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
