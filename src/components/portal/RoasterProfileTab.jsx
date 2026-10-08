import React from 'react';
import {
  Store,
  User,
  Sparkles,
  UploadCloud,
  Trash2,
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass
} from 'lucide-react';

export default function RoasterProfileTab({
  roasterName,
  setRoasterName,
  headRoaster,
  setHeadRoaster,
  tagline,
  setTagline,
  foundedYear,
  setFoundedYear,
  location,
  setLocation,
  website,
  handleWebsiteChange,
  handleWebsiteBlur,
  shopLink = '',
  setShopLink = null,
  instagram = '',
  setInstagram = null,
  logoImage,
  logoFileName,
  handleLogoUpload,
  handleRemoveLogo,
  originStory,
  setOriginStory,
  roasterMachines,
  setRoasterMachines,
  sourcingPhilosophy,
  setSourcingPhilosophy,
  roastingPhilosophy,
  setRoastingPhilosophy,
  handleSaveProfile,
  onViewShowcase,
  formError,
  saveToast
}) {
  return (
    <form onSubmit={handleSaveProfile} noValidate className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">{saveToast}</span>
        </div>
      )}

      {/* Form Error Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="font-bold">{formError}</span>
        </div>
      )}

      {/* Header Explainer Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-black/60 to-black/40 border border-amber-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-gold text-xs font-mono font-bold uppercase tracking-wider">
            <Store className="w-4 h-4" />
            <span>Public Roastery Showcase Profile</span>
          </div>
          <p className="text-xs text-cream-soft/80 leading-relaxed max-w-xl font-sans">
            Author your founding story, introduce your roasting team, and showcase your roasting equipment. This information powers your public showcase page and verifies your coffee offerings.
          </p>
        </div>

        {roasterName && onViewShowcase && (
          <button
            type="button"
            onClick={onViewShowcase}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-amber-gold border border-amber-gold/30 text-xs font-mono font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
          >
            <span>Preview Showcase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Section 1: Roastery Identity & Leadership */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <User className="w-4 h-4" />
          <span>1. Roastery Identity & Team Leadership</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Roastery Brand / Company Name <span className="text-amber-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={roasterName}
              onChange={(e) => setRoasterName(e.target.value)}
              placeholder="e.g. Methodical Coffee or Brookmill Roasters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
            <span className="block mt-1 text-[10px] text-cream-soft/50 font-mono">
              The business or commercial brand entity.
            </span>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Head Roaster / Founder Name(s) <span className="text-amber-gold">*</span>
            </label>
            <input
              type="text"
              required
              value={headRoaster}
              onChange={(e) => setHeadRoaster(e.target.value)}
              placeholder="e.g. Christian Picken or Will Shurtz, Marco Suarez"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
            <span className="block mt-1 text-[10px] text-cream-soft/50 font-mono">
              The individual craftsperson, master roaster, or founding partners.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Brand Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Coffee, Hospitality, Design"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Year Founded</label>
            <input
              type="text"
              value={foundedYear}
              onChange={(e) => setFoundedYear(e.target.value)}
              placeholder="e.g. 2018"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
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
            <label className="block text-cream-soft/70 font-mono mb-1">Website URL</label>
            <input
              type="text"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              value={website}
              onChange={handleWebsiteChange}
              onBlur={handleWebsiteBlur}
              placeholder="https://methodicalcoffee.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Shop Link (Webshop Store URL)</label>
            <input
              type="text"
              inputMode="url"
              value={shopLink}
              onChange={(e) => setShopLink && setShopLink(e.target.value)}
              placeholder="https://methodicalcoffee.com/collections/coffee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">Instagram (@handle or profile)</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram && setInstagram(e.target.value)}
              placeholder="@methodicalcoffee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
            />
          </div>
        </div>

        {/* Roastery Brand Logo */}
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-cream-soft/80 font-mono text-xs flex items-center gap-1.5 font-bold">
              <UploadCloud className="w-3.5 h-3.5 text-amber-gold" />
              <span>Roastery Brand Logo & Emblem</span>
            </label>
            <span className="text-[10px] text-cream-soft/50 font-mono">PNG, JPG, SVG, WebP (Max 5MB)</span>
          </div>

          {logoImage ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-amber-gold/40">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-white/10 p-1.5 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={logoImage} alt="Roaster Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                  <span className="text-xs text-cream-light font-mono font-bold block truncate max-w-xs">
                    {logoFileName || 'Brand Logo Uploaded'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Displayed on your Showcase Header & printed on Smart Bag stickers
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
                <span>Upload Brand Logo</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-cream-soft/60 font-mono">
                Square or horizontal logo. Transparent background recommended.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Founding Narrative & Origin Story */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>2. Founding Narrative & Origin Story</span>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono text-xs mb-1">
            Roastery Origin Story & Heritage (Multi-paragraph)
          </label>
          <textarea
            rows={5}
            value={originStory}
            onChange={(e) => setOriginStory(e.target.value)}
            placeholder="Tell your story: When did your roastery begin? Who founded it, and what conviction drives your roast profiles? Describe your facility, your producer relationships, and your vision for coffee..."
            className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-serif text-sm leading-relaxed"
          />
          <p className="text-[11px] text-cream-soft/60 font-mono mt-1">
            Tip: Press Enter twice between paragraphs to create separate paragraphs on your public Roaster Showcase page.
          </p>
        </div>
      </div>

      {/* Section 3: Roasting Machinery & Craft Philosophy */}
      <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Flame className="w-4 h-4" />
          <span>3. Roaster Engineering & Sourcing Philosophy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Roaster Machinery & Technology
            </label>
            <input
              type="text"
              value={roasterMachines}
              onChange={(e) => setRoasterMachines(e.target.value)}
              placeholder="e.g. Diedrich IR-12 & Loring S35 Kestrel Drum Roasters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
            <span className="block mt-1 text-[10px] text-cream-soft/50 font-mono">
              Displayed in the 'Science of Heat Transfer' card.
            </span>
          </div>

          <div>
            <label className="block text-cream-soft/70 font-mono mb-1">
              Sourcing & Producer Philosophy
            </label>
            <input
              type="text"
              value={sourcingPhilosophy}
              onChange={(e) => setSourcingPhilosophy(e.target.value)}
              placeholder="e.g. 100% Direct-Trade & Organic Regenerative Micro-Lots"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans"
            />
          </div>
        </div>

        <div>
          <label className="block text-cream-soft/70 font-mono text-xs mb-1">
            Roasting Restraint & Flavor Philosophy
          </label>
          <textarea
            rows={3}
            value={roastingPhilosophy}
            onChange={(e) => setRoastingPhilosophy(e.target.value)}
            placeholder="e.g. We view roasting as an exercise in culinary restraint. We roast with gentle convection to unlock the natural terroir, florals, and vibrant fruit acids coaxed from the soil."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-sans text-xs leading-relaxed"
          />
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-cream-soft/60 font-mono">
          Changes sync instantly to your public profile and Firestore cloud catalog.
        </span>

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Roastery Brand Profile</span>
        </button>
      </div>
    </form>
  );
}
