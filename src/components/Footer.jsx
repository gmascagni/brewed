import React from 'react';
import { Mail, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Footer() {
  const emailAddress = 'gmascagni@gmail.com';

  const handleMailtoClick = () => {
    trackEvent('contact_click_mailto', { email: emailAddress });
  };

  return (
    <footer className="mt-20 border-t border-amber-gold/30 bg-[#0F0D0B]/90 backdrop-blur-2xl text-cream-light py-10 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden">
      
      {/* Ambient Gold Radial Background Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Side: Brand Identity */}
        <div className="text-center lg:text-left space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] text-amber-gold">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-gold" />
            <span>Official Engineering & Founder HQ</span>
          </div>

          <h3 className="font-serif text-2xl font-extrabold text-cream-light tracking-wide flex items-center justify-center lg:justify-start gap-2">
            <span>The Brew App: The Art of Extraction</span>
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-gold/20 text-amber-gold border border-amber-gold/40">
              v1.0 HQ
            </span>
          </h3>

          <p className="text-xs text-cream-soft/70 leading-relaxed">
            Premier specialty coffee ratio calculator, fine tea steeping timers, micron-level grind sizing, and troubleshooting guide. Have questions, feedback, or partnership inquiries? Contact HQ directly below.
          </p>

          <div className="flex items-center justify-center lg:justify-start gap-3 text-[11px] font-mono text-stone-400 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Direct Founder Support</span>
            </span>
            <span>•</span>
            <span>https://thebrew.app</span>
          </div>
        </div>

        {/* Right Side: Contact HQ Button with Embedded Mailto Link (Email Address Hidden from Visible Text) */}
        <div className="w-full lg:w-auto p-5 sm:p-6 rounded-3xl bg-espresso-950/90 border-2 border-amber-gold/50 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          
          <div className="p-3.5 rounded-2xl bg-amber-gold/20 text-amber-gold border border-amber-gold/30 shadow-inner flex-shrink-0">
            <Mail className="w-6 h-6 animate-bounce-subtle" />
          </div>

          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest font-extrabold text-amber-gold">
              Inquiries & Feedback
            </div>
            <div className="font-serif text-lg font-bold text-cream-light">
              Connect With Founder HQ
            </div>
          </div>

          {/* Embedded Contact HQ Button */}
          <a
            href={`mailto:${emailAddress}?subject=The%20Brew%20App%20Inquiry%20%7C%20Feedback`}
            onClick={handleMailtoClick}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
            title="Open email app to send a message to HQ"
          >
            <Mail className="w-4 h-4 fill-current" />
            <span>Contact HQ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>

      </div>

      {/* Bottom Copyright Line */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center text-[11px] font-mono text-stone-500">
        © {new Date().getFullYear()} The Brew App HQ • All Rights Reserved
      </div>

    </footer>
  );
}
