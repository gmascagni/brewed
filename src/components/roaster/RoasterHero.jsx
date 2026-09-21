import React from 'react';
import {
  Store,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Building,
  Play,
  ArrowRight,
  ExternalLink,
  Coffee,
  Sparkles,
  Flame,
  QrCode
} from 'lucide-react';

export default function RoasterHero({
  roaster,
  isBrandOwner,
  isDomainVerified,
  roasterDomain,
  currentUser,
  onOpenRoasterInfo,
  onOpenRoasterPortalWithBean,
  onWatchVideo
}) {
  if (!roaster) return null;

  return (
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
        ) : isDomainVerified ? (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-extrabold border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Domain-Verified Brand</span>
          </span>
        ) : roaster.isCustomRoaster ? (
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 font-mono text-xs font-extrabold border border-sky-500/40 flex items-center gap-1.5 shadow-sm">
            <Building className="w-3.5 h-3.5 text-sky-400" />
            <span>Artisan Roaster (Self-Registered)</span>
          </span>
        ) : (
          <>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-extrabold border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
              <Store className="w-3.5 h-3.5 text-amber-gold" />
              <span>Curated Showcase Benchmark</span>
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
            <button
              type="button"
              onClick={onWatchVideo}
              className="px-3 py-1 rounded-full bg-red-600/20 hover:bg-red-600/30 text-red-300 font-mono text-xs font-bold border border-red-500/40 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="Watch 60-Second Video Demo Walkthrough"
            >
              <Play className="w-3.5 h-3.5 text-red-400 fill-current" />
              <span>Watch Video</span>
            </button>
            {onOpenRoasterInfo && roasterDomain && (
              <button
                type="button"
                onClick={onOpenRoasterInfo}
                className="px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono text-xs font-bold border border-white/15 flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                title={`Claim official brand certification with @${roasterDomain}`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-gold" />
                <span>Claim Profile (@{roasterDomain})</span>
              </button>
            )}
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
                  {currentUser?.email}
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

      {/* Transparent Showcase Demonstration & Partner Example Notice */}
      {!roaster.isCustomRoaster && !isBrandOwner && (
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-xs font-mono text-cream-soft/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-md shadow-lg">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-md bg-amber-gold/20 text-amber-gold font-bold text-[10px] uppercase tracking-wider border border-amber-gold/40 shrink-0">
              Curated Showcase
            </span>
            <span className="leading-relaxed">
              Featured roaster showcase demonstrating The Brew App Smart Bag ecosystem. Coffee dial-in recipes are curated from published barista guides. Unclaimed brand.
              {roasterDomain && (
                <span className="block text-cream-soft/70 mt-0.5">
                  Are you on the team at {roaster.name}? Sign in with your @{roasterDomain} corporate email to claim verified ownership.
                </span>
              )}
            </span>
          </div>
          {onOpenRoasterInfo && (
            <button
              onClick={onOpenRoasterInfo}
              className="text-amber-gold hover:underline font-bold text-xs flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <span>Claim with @{roasterDomain || 'domain'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Origin Story & Roasting Craft */}
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {(roaster?.stats || []).map((stat, i) => (
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
          <span>Browse Coffees & Dial-In Recipes ({roaster?.coffees?.length || 0})</span>
        </button>

        <button
          onClick={() => {
            document.getElementById('cafes-labs')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono text-xs font-bold border border-white/15 flex items-center gap-2 transition cursor-pointer"
        >
          <Building className="w-3.5 h-3.5 text-amber-gold" />
          <span>Cafes & Labs ({roaster?.cafes?.length || 0})</span>
        </button>

        <div className="text-xs font-mono text-cream-soft/60 hidden lg:block ml-2">
          Founders: <span className="text-cream-light font-bold">{roaster?.founders?.length ? roaster.founders.join(', ') : `${roaster.city}${roaster.state ? ', ' + roaster.state : ''}`}</span>
        </div>
      </div>

    </div>
  );
}
