import React from 'react';
import { Mail, ExternalLink, Store, Tv } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Footer({ trackMode = 'coffee', onOpenRoasterInfo, onOpenRoasterShowcase, onOpenVideoAcademy }) {
  const isCoffee = trackMode === 'coffee';
  const emailAddress = 'clay@thebrew.app';

  const handleMailtoClick = () => {
    trackEvent('contact_click_mailto', { email: emailAddress });
  };

  return (
    <footer className={`mt-14 py-6 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-xl text-stone-400 transition-colors duration-500 ${
      isCoffee ? 'bg-[#0E0906]/90 border-[#A66E38]/25' : 'bg-[#07130B]/90 border-sage-500/25'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        
        {/* Minimal Copyright */}
        <div className="text-stone-400 text-[11px] font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} The Brew App. All rights reserved.</span>
          <span className="hidden sm:inline text-stone-600">•</span>
          <span className="text-stone-500">Digital Trail Labs LLC</span>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-3">
          {onOpenVideoAcademy && (
            <button
              onClick={onOpenVideoAcademy}
              className="py-2 px-3.5 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Coffee Academy</span>
            </button>
          )}

          {onOpenRoasterShowcase && (
            <button
              onClick={onOpenRoasterShowcase}
              className="py-2 px-3.5 rounded-xl bg-amber-gold/15 hover:bg-amber-gold/25 text-amber-gold hover:text-amber-300 border border-amber-gold/30 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Roaster Showcase</span>
            </button>
          )}

          {onOpenRoasterInfo && (
            <button
              onClick={onOpenRoasterInfo}
              className="py-2 px-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-300 hover:text-white border border-white/10 text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <span>Add Your Roastery</span>
            </button>
          )}

          {/* Compact Contact HQ Button */}
          <a
            href={`mailto:${emailAddress}?subject=The%20Brew%20App%20Inquiry`}
            onClick={handleMailtoClick}
            className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all ${
              isCoffee
                ? 'btn-tactile-coffee text-[#140C08]'
                : 'btn-tactile-tea text-white'
            }`}
            title="Contact Founder HQ"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact HQ</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>
        </div>

      </div>
    </footer>
  );
}
