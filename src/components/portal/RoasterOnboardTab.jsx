import React, { useEffect } from 'react';
import {
  AlertCircle,
  Store,
  UploadCloud,
  Trash2,
  Coffee,
  Sparkles,
  ArrowRight,
  Edit3,
  Plus,
  Globe,
  Instagram,
  ShoppingBag,
  Sliders,
  Scale,
  Droplet,
  Thermometer,
  Clock,
  Flame,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { slugify, getCoffeeCustomerUrl } from '../../data/roasterRegistry';

export default function RoasterOnboardTab({
  formError,
  editingCoffeeId = null,
  onStartNewLot = null,
  // Roaster Information
  roasterName,
  setRoasterName,
  headRoaster = '',
  setHeadRoaster = null,
  onSwitchToProfileTab = null,
  location,
  setLocation,
  website,
  handleWebsiteChange,
  handleWebsiteBlur,
  about = '',
  setAbout = null,
  instagram = '',
  setInstagram = null,
  shopLink = '',
  setShopLink = null,
  logoImage,
  logoFileName,
  handleLogoUpload,
  handleRemoveLogo,
  // Coffee Information
  beanName,
  setBeanName,
  origin,
  setOrigin,
  farm = '',
  setFarm = null,
  region = '',
  setRegion = null,
  varietal,
  setVarietal,
  process,
  setProcess,
  elevation,
  setElevation,
  roastLevel,
  setRoastLevel,
  tastingNotesInput,
  setTastingNotesInput,
  upc,
  setUpc,
  handleGenerateRandomSku,
  // Recommended Brew Parameters
  brewMethod,
  setBrewMethod,
  doseGrams = 18,
  setDoseGrams = null,
  waterGrams = 297,
  setWaterGrams = null,
  recommendedRatio,
  setRecommendedRatio,
  tempF,
  setTempF,
  recommendedGrind,
  setRecommendedGrind,
  bloom = '45s bloom (50g water)',
  setBloom = null,
  brewTime = '3m 15s',
  setBrewTime = null,
  roasterNotes,
  setRoasterNotes,
  price = '$22.00',
  setPrice = null,
  directUrl = '',
  setDirectUrl = null,
  handleSaveCoffee,
  onClose
}) {
  // Sync dose and water automatically when ratio or dose changes
  const handleDoseChange = (e) => {
    const d = parseFloat(e.target.value) || 0;
    if (setDoseGrams) setDoseGrams(d);
    if (d > 0 && recommendedRatio > 0 && setWaterGrams) {
      setWaterGrams(Math.round(d * recommendedRatio));
    }
  };

  const handleRatioChange = (e) => {
    const r = parseFloat(e.target.value) || 0;
    setRecommendedRatio(r);
    if (r > 0 && doseGrams > 0 && setWaterGrams) {
      setWaterGrams(Math.round(doseGrams * r));
    }
  };

  const handleWaterChange = (e) => {
    const w = parseFloat(e.target.value) || 0;
    if (setWaterGrams) setWaterGrams(w);
  };

  // Preview the generated URL
  const previewRoasterSlug = slugify(roasterName || 'specialty-roaster');
  const previewCoffeeSlug = slugify(beanName || 'single-origin');
  const previewCustomerUrl = `https://thebrew.app/${previewRoasterSlug}/${previewCoffeeSlug}`;

  return (
    <form onSubmit={handleSaveCoffee} noValidate className="space-y-6 animate-fade-in">
      {/* Active Edit Mode Indicator Banner */}
      {editingCoffeeId && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-gold font-bold">
            <Edit3 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Editing Existing Lot: <strong className="text-white">{beanName || 'Coffee Lot'}</strong></span>
          </div>
          {onStartNewLot && (
            <button
              type="button"
              onClick={onStartNewLot}
              className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-cream-light font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-gold" />
              <span>+ Switch to New Lot</span>
            </button>
          )}
        </div>
      )}

      {/* Form Validation Warning */}
      {formError && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="font-bold">{formError}</span>
        </div>
      )}

      {/* 1. ROASTER INFORMATION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
            <Store className="w-4 h-4" />
            <span>1. Roaster Information</span>
          </div>

          {onSwitchToProfileTab && (
            <button
              type="button"
              onClick={onSwitchToProfileTab}
              className="text-[11px] font-mono text-amber-gold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Edit Full Roaster Profile →</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Roaster Name *</label>
            <input
              type="text"
              required
              value={roasterName}
              onChange={(e) => setRoasterName(e.target.value)}
              placeholder="e.g. Onyx Coffee Lab"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Location (City, State / Country)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Rogers, AR or San José, Costa Rica"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Website URL</label>
            <input
              type="text"
              inputMode="url"
              value={website}
              onChange={handleWebsiteChange}
              onBlur={handleWebsiteBlur}
              placeholder="https://onyxcoffeelab.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Shop Link (Buy Beans URL)
            </label>
            <input
              type="url"
              value={shopLink || directUrl}
              onChange={(e) => {
                if (setShopLink) setShopLink(e.target.value);
                if (setDirectUrl) setDirectUrl(e.target.value);
              }}
              placeholder="https://onyxcoffeelab.com/collections/coffee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
            <span className="block mt-1 text-[10px] text-cream-soft/50 font-mono">
              Directs home baristas straight back to your online store to re-order beans.
            </span>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Instagram Handle or Profile
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram && setInstagram(e.target.value)}
              placeholder="@onyxcoffeelab"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono mb-1">
            About the Roastery
          </label>
          <textarea
            rows={2}
            value={about}
            onChange={(e) => setAbout && setAbout(e.target.value)}
            placeholder="A brief introduction to your roastery, your passion for coffee, and your sourcing philosophy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
          />
        </div>

        {/* Brand Logo Upload */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-cream-soft/80 font-mono text-xs flex items-center gap-1.5 font-bold">
              <UploadCloud className="w-3.5 h-3.5 text-amber-gold" />
              <span>Roaster Logo</span>
            </label>
            <span className="text-[10px] text-cream-soft/50 font-mono">PNG, JPG, SVG (Max 5MB)</span>
          </div>

          {logoImage ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-amber-gold/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10 p-1 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logoImage} alt="Roaster Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs text-cream-light font-mono font-bold block truncate max-w-xs">
                    {logoFileName || 'Brand Logo Active'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Displayed on coffee pages & packaging stickers
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-1.5 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-dashed border-white/25 hover:border-amber-gold text-cream-light font-mono text-xs flex items-center gap-2 transition w-fit">
                <UploadCloud className="w-4 h-4 text-amber-gold" />
                <span>Upload Logo Image</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-cream-soft/60 font-mono">
                Appears on your customer-facing coffee guide.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. COFFEE INFORMATION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Coffee className="w-4 h-4" />
          <span>2. Coffee Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Coffee Name *</label>
            <input
              type="text"
              required
              value={beanName}
              onChange={(e) => setBeanName(e.target.value)}
              placeholder="e.g. Ethiopia Guji Natural"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans font-bold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Origin (Country)</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Ethiopia, Costa Rica, Colombia"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Region / Micro-Region</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion && setRegion(e.target.value)}
              placeholder="e.g. Shakisso, Guji Zone"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Farm / Producer / Estate</label>
            <input
              type="text"
              value={farm}
              onChange={(e) => setFarm && setFarm(e.target.value)}
              placeholder="e.g. Dambi Uddo Station"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Variety (Botanical)</label>
            <input
              type="text"
              value={varietal}
              onChange={(e) => setVarietal(e.target.value)}
              placeholder="e.g. Gibirinna 74110, Geisha, Caturra"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Process</label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="Washed">Fully Washed</option>
              <option value="Natural">Natural / Dry Processed</option>
              <option value="Honey">Honey / Pulped Natural</option>
              <option value="Anaerobic">Anaerobic Fermentation</option>
              <option value="Wet-Hulled">Wet-Hulled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Elevation (MASL)</label>
            <input
              type="text"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
              placeholder="e.g. 2,000 – 2,150 MASL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Roast Level</label>
            <select
              value={roastLevel}
              onChange={(e) => setRoastLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="Light">Light Roast</option>
              <option value="Medium-Light">Medium-Light</option>
              <option value="Medium">Medium</option>
              <option value="Medium-Dark">Medium-Dark</option>
              <option value="Dark">Dark Roast</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono text-xs mb-1">
            Tasting Notes (comma-separated)
          </label>
          <input
            type="text"
            value={tastingNotesInput}
            onChange={(e) => setTastingNotesInput(e.target.value)}
            placeholder="e.g. Wild Strawberry, Jasmine Blossom, Meyer Lemon, Bergamot Honey"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
          />
        </div>
      </div>

      {/* 3. RECOMMENDED BREW (RECIPE) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>3. Recommended Brew Recipe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Brewing Method</label>
            <select
              value={brewMethod}
              onChange={(e) => setBrewMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="pour_over">Conical Pour Over (V60)</option>
              <option value="classic_pour_over">Flat-Bottom (Kalita Wave)</option>
              <option value="chemex">Chemex Glass</option>
              <option value="aeropress">AeroPress Standard</option>
              <option value="french_press">French Press Immersion</option>
              <option value="espresso">9-Bar Espresso</option>
              <option value="moka_pot">Moka Pot Stovetop</option>
            </select>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Dose (Grams of Coffee)</label>
            <input
              type="number"
              step="0.5"
              value={doseGrams}
              onChange={handleDoseChange}
              placeholder="18"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Ratio (1 : X)</label>
            <input
              type="number"
              step="0.1"
              value={recommendedRatio}
              onChange={handleRatioChange}
              placeholder="16.5"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Water (Grams / mL)</label>
            <input
              type="number"
              step="1"
              value={waterGrams}
              onChange={handleWaterChange}
              placeholder="297"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Water Temperature (°F)</label>
            <input
              type="number"
              value={tempF}
              onChange={(e) => setTempF(e.target.value)}
              placeholder="202"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Grind Setting</label>
            <input
              type="text"
              value={recommendedGrind}
              onChange={(e) => setRecommendedGrind(e.target.value)}
              placeholder="e.g. Medium-Fine (620µm)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Bloom Phase</label>
            <input
              type="text"
              value={bloom}
              onChange={(e) => setBloom && setBloom(e.target.value)}
              placeholder="e.g. 45s bloom (50g water)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Total Brew Time</label>
            <input
              type="text"
              value={brewTime}
              onChange={(e) => setBrewTime && setBrewTime(e.target.value)}
              placeholder="e.g. 3m 15s"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono text-xs mb-1">
            Roaster Pour Cadence & Guidance
          </label>
          <textarea
            rows={2}
            value={roasterNotes}
            onChange={(e) => setRoasterNotes(e.target.value)}
            placeholder="e.g. Pour gently in concentric rings avoiding filter edges to highlight bright fruit notes and floral sweetness."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
          />
        </div>
      </div>

      {/* 4. CUSTOMER URL & QR DESTINATION PREVIEW */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <QrCode className="w-4 h-4" />
          <span>Coffee-Specific Customer URL & QR Destination</span>
        </div>
        <p className="text-xs text-cream-soft/80 font-sans">
          When this coffee is saved, The Brew generates its unique customer-facing page and QR code:
        </p>
        <div className="p-3 rounded-xl bg-black/60 border border-white/15 flex items-center justify-between gap-2 font-mono text-xs text-cream-light break-all">
          <span className="text-amber-gold font-bold">{previewCustomerUrl}</span>
          <span className="text-[10px] text-cream-soft/50 uppercase tracking-widest shrink-0 hidden sm:inline">Auto Generated</span>
        </div>
        <p className="text-[11px] text-cream-soft/60 font-mono">
          Customers scanning this bag QR code will land on this page, learn your coffee's story, see your recommended recipe, and launch the guided brew timer with zero app download required.
        </p>
      </div>

      {/* Form Validation Warning at Bottom */}
      {formError && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="font-bold">{formError}</span>
        </div>
      )}

      {/* Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div>
          {editingCoffeeId && onStartNewLot && (
            <button
              type="button"
              onClick={onStartNewLot}
              className="text-xs font-mono text-amber-gold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cancel editing & start a new lot</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft font-mono text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={(e) => handleSaveCoffee(e, { andAddAnother: true })}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-cream-light font-mono text-xs font-bold flex items-center gap-1.5 border border-white/15 cursor-pointer transition"
            title="Save this coffee and immediately start entering another lot"
          >
            <Plus className="w-3.5 h-3.5 text-amber-gold" />
            <span>Save & Add Another Lot</span>
          </button>

          <button
            type="submit"
            onClick={(e) => handleSaveCoffee(e, { andAddAnother: false })}
            className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <span>{editingCoffeeId ? 'Update Lot & Recipe' : 'Save Lot & Generate QR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
