import React from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Check,
  Share2
} from 'lucide-react';
import { normalizeRoasterKey, getRoasterShortName } from '../../data/roasterShowcaseData';

export default function RoasterHeader({
  onBackToApp,
  activeCoffee = null,
  isBrandOwner,
  isDomainVerified,
  roaster,
  activeRoasterId,
  setActiveRoasterId,
  allRoasters = [],
  roasterScrollRef,
  copiedLink,
  handleSharePage
}) {
  const backLabel = activeCoffee?.beanName 
    ? `Back to Recipe: ${activeCoffee.beanName.length > 20 ? `${activeCoffee.beanName.slice(0, 18)}…` : activeCoffee.beanName}`
    : 'Brewing Station';

  return (
    <header className="sticky top-0 z-40 bg-[#0A0604]/85 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="py-1.5 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-cream-light hover:text-amber-gold border border-white/15 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow cursor-pointer"
              title={activeCoffee?.beanName ? `Return to recipe for ${activeCoffee.beanName}` : "Return to Brewing Station"}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isBrandOwner ? 'bg-emerald-400 animate-pulse' : (isDomainVerified ? 'bg-emerald-400' : 'bg-amber-400')}`} />
            <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isBrandOwner || isDomainVerified ? 'text-emerald-400' : 'text-amber-gold'}`}>
              {isBrandOwner ? 'Verified Brand Owner' : (isDomainVerified ? 'Domain-Verified Brand' : (roaster?.isCustomRoaster ? 'Artisan Roaster' : 'Specialty Showcase'))}
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
            onClick={() => roasterScrollRef?.current?.scrollBy({ left: -160, behavior: 'smooth' })}
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
            onClick={() => roasterScrollRef?.current?.scrollBy({ left: 160, behavior: 'smooth' })}
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
  );
}
