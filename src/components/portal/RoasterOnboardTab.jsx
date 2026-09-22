import React from 'react';
import {
  AlertCircle,
  Store,
  UploadCloud,
  Trash2,
  Coffee,
  Sparkles,
  ArrowRight,
  Edit3,
  Plus
} from 'lucide-react';

export default function RoasterOnboardTab({
  formError,
  editingCoffeeId = null,
  onStartNewLot = null,
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
  logoImage,
  logoFileName,
  handleLogoUpload,
  handleRemoveLogo,
  beanName,
  setBeanName,
  origin,
  setOrigin,
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
  brewMethod,
  setBrewMethod,
  recommendedRatio,
  setRecommendedRatio,
  tempF,
  setTempF,
  recommendedGrind,
  setRecommendedGrind,
  roasterNotes,
  setRoasterNotes,
  handleSaveCoffee,
  onClose
}) {
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

      {/* Roastery Information Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
            <Store className="w-4 h-4" />
            <span>1. Roastery Credentials & Leadership</span>
          </div>

          {onSwitchToProfileTab && (
            <button
              type="button"
              onClick={onSwitchToProfileTab}
              className="text-[11px] font-mono text-amber-gold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Edit Origin Story & Craft →</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Roastery Brand *</label>
            <input
              type="text"
              required
              value={roasterName}
              onChange={(e) => setRoasterName(e.target.value)}
              placeholder="e.g. Methodical Coffee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Head Roaster / Founder</label>
            <input
              type="text"
              value={headRoaster}
              onChange={(e) => setHeadRoaster && setHeadRoaster(e.target.value)}
              placeholder="e.g. Christian Picken"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Location (City, State)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Greenville, SC"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Website / Store URL</label>
            <input
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              style={{ fontVariantLigatures: 'none' }}
              value={website}
              onChange={handleWebsiteChange}
              onBlur={handleWebsiteBlur}
              placeholder="https://methodicalcoffee.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>
        </div>

        {/* Brand Logo Upload */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-cream-soft/80 font-mono text-xs flex items-center gap-1.5 font-bold">
              <UploadCloud className="w-3.5 h-3.5 text-amber-gold" />
              <span>Roastery Brand Logo (Showcase & Packaging)</span>
            </label>
            <span className="text-[10px] text-cream-soft/50 font-mono">PNG, JPG, SVG, WebP (Max 5MB)</span>
          </div>

          {logoImage ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-amber-gold/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10 p-1 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logoImage} alt="Roaster Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs text-cream-light font-mono font-bold block truncate max-w-xs">
                    {logoFileName || 'Brand Logo Uploaded'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Ready for packaging stickers & showcase page
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="p-1.5 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-mono flex items-center gap-1 transition cursor-pointer"
                title="Remove Logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Remove</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-dashed border-white/25 hover:border-amber-gold text-cream-light font-mono text-xs flex items-center gap-2 transition w-fit">
                <UploadCloud className="w-4 h-4 text-amber-gold" />
                <span>Upload Roastery Logo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-cream-soft/60 font-mono">
                This logo appears on your Roaster Showcase page & prints on Smart Bag stickers.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bean Identity Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Coffee className="w-4 h-4" />
          <span>2. Coffee Origin & Processing Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Coffee / Lot Name *</label>
            <input
              type="text"
              required
              value={beanName}
              onChange={(e) => setBeanName(e.target.value)}
              placeholder="e.g. Worka Sakaro / Belly Warmer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Origin / Farm / Region</label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Gedeb, Yirgacheffe, Ethiopia"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Varietal</label>
            <input
              type="text"
              value={varietal}
              onChange={(e) => setVarietal(e.target.value)}
              placeholder="e.g. Heirloom, Geisha, Bourbon"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Processing Method</label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="Washed">Fully Washed</option>
              <option value="Natural">Natural / Dry Processed</option>
              <option value="Honey">Honey / Pulped Natural</option>
              <option value="Anaerobic">Anaerobic Fermentation</option>
              <option value="Wet-Hulled">Wet-Hulled (Giling Basah)</option>
            </select>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Elevation (MASL)</label>
            <input
              type="text"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
              placeholder="e.g. 1,900 - 2,100 MASL"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Roast Profile Degree</label>
            <select
              value={roastLevel}
              onChange={(e) => setRoastLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="Ultra-Light (Nordic)">Ultra-Light (Nordic Style)</option>
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
            Authentic Tasting Notes (comma separated)
          </label>
          <input
            type="text"
            value={tastingNotesInput}
            onChange={(e) => setTastingNotesInput(e.target.value)}
            placeholder="e.g. Bergamot, White Peach, Black Tea, Wildflower Honey"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
          />
        </div>

        {/* Optional Retail Barcode or Batch Lot SKU */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-cream-soft/70 font-mono text-xs">
              Retail Bag Barcode (UPC/EAN) or Batch Lot SKU (Optional)
            </label>
            <button
              type="button"
              onClick={handleGenerateRandomSku}
              className="text-[10px] font-mono text-amber-gold hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Assign Lot SKU</span>
            </button>
          </div>
          <input
            type="text"
            value={upc}
            onChange={(e) => setUpc(e.target.value)}
            placeholder="e.g. 850012345099 or LOT-2026-WORKA"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
          />
          <p className="text-[10px] text-cream-soft/50 mt-1">
            When customers scan this barcode with the camera scanner, your dialed-in recipe and roastery profile load automatically.
          </p>
        </div>
      </div>

      {/* Extraction Parameters Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>3. Roaster's Recommended Dial-In Recipe</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Recommended Method</label>
            <select
              value={brewMethod}
              onChange={(e) => setBrewMethod(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
            >
              <option value="classic_pour_over">Flat-Bottom (Kalita Wave)</option>
              <option value="pour_over">Conical (Hario V60)</option>
              <option value="chemex">Chemex Glass</option>
              <option value="aeropress">AeroPress Standard</option>
              <option value="french_press">French Press Immersion</option>
              <option value="espresso">9-Bar Espresso</option>
              <option value="moka_pot">Moka Pot Stovetop</option>
              <option value="drip_brewer">Batch Precision Brewer</option>
            </select>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Golden Ratio (1 : X)</label>
            <input
              type="number"
              step="0.1"
              value={recommendedRatio}
              onChange={(e) => setRecommendedRatio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Water Temp (°F)</label>
            <input
              type="number"
              value={tempF}
              onChange={(e) => setTempF(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Grind Setting</label>
            <input
              type="text"
              value={recommendedGrind}
              onChange={(e) => setRecommendedGrind(e.target.value)}
              placeholder="e.g. Medium-Fine (550μm)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono text-xs mb-1">
            Roaster Pour Cadence & Bloom Technique
          </label>
          <textarea
            rows={2}
            value={roasterNotes}
            onChange={(e) => setRoasterNotes(e.target.value)}
            placeholder="e.g. 45-second gentle bloom with soft water (60-80 ppm TDS). Pour slowly in concentric rings avoiding filter edges."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
          />
        </div>
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
            title="Save this coffee to your registry and immediately begin entering the next lot"
          >
            <Plus className="w-3.5 h-3.5 text-amber-gold" />
            <span>Save & Add Another Lot</span>
          </button>

          <button
            type="submit"
            onClick={(e) => handleSaveCoffee(e, { andAddAnother: false })}
            className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <span>{editingCoffeeId ? 'Update Lot & Recipe' : 'Save Lot & Open QR Studio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
