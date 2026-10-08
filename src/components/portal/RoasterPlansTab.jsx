import React, { useState } from 'react';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Coffee,
  QrCode,
  ExternalLink,
  Mail,
  ArrowRight,
  Store
} from 'lucide-react';
import { ROASTER_PLANS } from '../../data/roasterRegistry';

export default function RoasterPlansTab({
  currentUser,
  registeredCoffees = [],
  onOpenOnboardTab,
  onClose
}) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'
  const [inquirySent, setInquirySent] = useState(false);

  const usedLots = registeredCoffees.length;
  const freeLotLimit = ROASTER_PLANS.free.lotLimit;

  const handleInquirePro = () => {
    const subject = encodeURIComponent(`Roaster Pro Partner Inquiry — ${currentUser?.roasterName || currentUser?.displayName || 'Specialty Roaster'}`);
    const body = encodeURIComponent(
      `Hello Clay & The Brew Team,\n\nI am interested in upgrading to the Pro Partner tier (${billingCycle === 'annual' ? '$199/year' : '$24/month'}) for our roastery.\n\nRoastery Name: ${currentUser?.roasterName || ''}\nEmail: ${currentUser?.email || ''}\nCurrent Lots: ${usedLots}\n\nPlease share details on activating Pro lot limits, custom branded landing pages, and analytics tracking.\n\nBest regards,\n${currentUser?.displayName || 'Head Roaster'}`
    );
    window.open(`mailto:clay@thebrew.app?subject=${subject}&body=${body}`, '_blank');
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Monetization Philosophy Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#1C1815] via-black/80 to-[#14110F] border border-amber-gold/30 space-y-3">
        <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
          <Store className="w-4 h-4" />
          <span>Transparent, Friction-Free Roaster Partnership</span>
        </div>
        <h3 className="font-editorial text-2xl font-bold text-cream-light">
          Simple Partner Plans • Zero E-Commerce Take Rates
        </h3>
        <p className="text-xs sm:text-sm font-sans text-cream-soft/90 max-w-2xl leading-relaxed">
          The Brew is designed to educate coffee drinkers and elevate your craft. You continue handling your own sales and retail fulfillment—we provide the precision brewing guides, Smart Bag QR codes, and send customers directly to your shop.
        </p>
      </div>

      {/* Billing Cycle Switcher */}
      <div className="flex items-center justify-center gap-3 text-xs font-mono">
        <span className={billingCycle === 'monthly' ? 'text-cream-light font-bold' : 'text-cream-soft/60'}>
          Monthly Billing
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'annual' : 'monthly'))}
          className="w-12 h-6 rounded-full bg-white/10 p-1 flex items-center transition cursor-pointer border border-white/20"
        >
          <div
            className={`w-4 h-4 rounded-full bg-amber-gold shadow-md transform transition-transform ${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <span className={billingCycle === 'annual' ? 'text-cream-light font-bold' : 'text-cream-soft/60'}>
          Annual Billing <span className="text-amber-gold text-[10px] font-bold">(Save ~30% — $199/yr)</span>
        </span>
      </div>

      {/* Plans Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FREE TIER CARD */}
        <div className="rounded-3xl bg-black/40 border-2 border-white/15 p-6 sm:p-7 flex flex-col justify-between space-y-6 relative hover:border-amber-gold/30 transition">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-cream-light font-mono text-[10px] font-bold uppercase tracking-wider border border-white/10">
                {ROASTER_PLANS.free.badge}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                ✓ Currently Active
              </span>
            </div>

            <div>
              <h4 className="font-editorial text-2xl font-bold text-cream-light">
                {ROASTER_PLANS.free.name}
              </h4>
              <p className="text-xs text-cream-soft/80 mt-1 leading-relaxed font-sans">
                {ROASTER_PLANS.free.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2 pt-2 pb-1 border-b border-white/10">
              <span className="font-mono text-4xl font-extrabold text-cream-light">
                {ROASTER_PLANS.free.price}
              </span>
              <span className="text-xs font-mono text-cream-soft/60">
                / {ROASTER_PLANS.free.period}
              </span>
            </div>

            {/* Quota Meter */}
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-cream-soft/70">Your Active Lots:</span>
                <span className="text-cream-light font-bold">{usedLots} / {freeLotLimit} lots</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-amber-gold rounded-full transition-all"
                  style={{ width: `${Math.min(100, (usedLots / freeLotLimit) * 100)}%` }}
                />
              </div>
            </div>

            {/* Features List */}
            <ul className="space-y-2.5 text-xs font-sans text-cream-soft/90 pt-2">
              {ROASTER_PLANS.free.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onOpenOnboardTab}
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-cream-light font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-amber-gold" />
              <span>{usedLots < freeLotLimit ? `Onboard Coffee Lot (${freeLotLimit - usedLots} Remaining)` : 'Manage Registered Lots'}</span>
            </button>
          </div>
        </div>

        {/* PRO TIER CARD */}
        <div className="rounded-3xl bg-gradient-to-b from-[#1C1815] via-black/60 to-black/80 border-2 border-amber-gold/50 p-6 sm:p-7 flex flex-col justify-between space-y-6 relative shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-gold font-mono text-[10px] font-bold uppercase tracking-wider border border-amber-500/40">
                {ROASTER_PLANS.pro.badge}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-gold font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Recommended</span>
              </span>
            </div>

            <div>
              <h4 className="font-editorial text-2xl font-bold text-cream-light">
                {ROASTER_PLANS.pro.name}
              </h4>
              <p className="text-xs text-cream-soft/80 mt-1 leading-relaxed font-sans">
                {ROASTER_PLANS.pro.description}
              </p>
            </div>

            <div className="flex items-baseline gap-2 pt-2 pb-1 border-b border-white/10">
              <span className="font-mono text-4xl font-extrabold text-amber-gold">
                {billingCycle === 'annual' ? '$199' : '$24'}
              </span>
              <span className="text-xs font-mono text-cream-soft/60">
                {billingCycle === 'annual' ? '/ year ($16.50/mo)' : '/ month'}
              </span>
            </div>

            {/* Features List */}
            <ul className="space-y-2.5 text-xs font-sans text-cream-light pt-2">
              {ROASTER_PLANS.pro.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-gold shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={handleInquirePro}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-gold via-amber-400 to-amber-gold text-espresso-950 font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-espresso-950" />
              <span>{inquirySent ? 'Email Client Opened!' : 'Activate Pro Partner'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-cream-soft/60 font-mono text-center">
              Simple invoice or card setup • No lock-in contracts • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
