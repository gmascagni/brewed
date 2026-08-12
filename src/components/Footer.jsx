import React from 'react';
import { Mail, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

export default function Footer({ trackMode = 'coffee' }) {
  const isCoffee = trackMode === 'coffee';
  const isTea = trackMode === 'tea';
  const isBeer = trackMode === 'beer';
  const emailAddress = 'gmascagni@gmail.com';

  const handleMailtoClick = () => {
    trackEvent('contact_click_mailto', { email: emailAddress });
  };

  return (
    <footer className={`mt-20 border-t bg-[#0F0D0B]/90 backdrop-blur-2xl text-cream-light py-10 px-4 sm:px-6 lg:px-8 shadow-2xl relative overflow-hidden transition-all duration-500 ${
      isBeer ? 'border-amber-500/40' : isCoffee ? 'border-[#A66E38]/40' : 'border-sage-500/40'
    }`}>
      
      {/* Ambient Background Glow */}
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isBeer ? 'bg-amber-500/10' : isCoffee ? 'bg-[#A66E38]/10' : 'bg-emerald-500/10'
      }`} />
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isBeer ? 'bg-yellow-600/10' : isCoffee ? 'bg-[#7E4B21]/10' : 'bg-sage-600/10'
      }`} />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Side: Brand Identity */}
        <div className="text-center lg:text-left space-y-2 max-w-xl">
          <div className={`inline-flex items-center space-x-2 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] ${
            isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
          }`}>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Official Engineering & Founder HQ</span>
          </div>

          <h3 className="font-serif text-2xl font-extrabold text-cream-light tracking-wide flex items-center justify-center lg:justify-start gap-2">
            <span>The Brew App: The Art of Extraction</span>
            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
              isBeer ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : isCoffee ? 'bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/30' : 'bg-sage-500/20 text-sage-300 border-sage-500/30'
            }`}>
              v1.0 HQ
            </span>
          </h3>

          <p className="text-xs text-cream-soft/70 leading-relaxed">
            Premier specialty coffee ratio calculator, fine tea steeping timers, craft beer mash & ABV scalers, and troubleshooting guide. Have questions, feedback, or partnership inquiries? Contact HQ directly below.
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

        {/* Right Side: Contact HQ Button with Embedded Mailto Link */}
        <div className={`w-full lg:w-auto p-5 sm:p-6 rounded-3xl bg-espresso-950/90 border-2 shadow-2xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left ${
          isBeer ? 'border-amber-400/40' : isCoffee ? 'border-[#A66E38]/40' : 'border-sage-500/40'
        }`}>
          
          <div className={`p-3.5 rounded-2xl border shadow-inner flex-shrink-0 ${
            isBeer ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : isCoffee ? 'bg-[#A66E38]/20 text-[#D2A06E] border-[#A66E38]/30' : 'bg-sage-500/20 text-sage-300 border-sage-500/30'
          }`}>
            <Mail className="w-6 h-6 animate-bounce-subtle" />
          </div>

          <div className="space-y-1">
            <div className={`text-[10px] font-mono uppercase tracking-widest font-extrabold ${
              isBeer ? 'text-amber-400' : isCoffee ? 'text-[#D2A06E]' : 'text-sage-300'
            }`}>
              Inquiries & Feedback
            </div>
            <div className="font-serif text-lg font-bold text-cream-light">
              Connect with Founder
            </div>
          </div>

          <a
            href={`mailto:${emailAddress}?subject=The%20Brew%20App%20Inquiry%20from%20User`}
            onClick={handleMailtoClick}
            className={`w-full sm:w-auto py-3.5 px-6 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all whitespace-nowrap ${
              isBeer ? 'btn-tactile-beer text-[#0F0C05]' : isCoffee ? 'btn-tactile-coffee text-[#140C08]' : 'btn-tactile-tea text-white'
            }`}
            title="Send direct email to The Brew App Founder HQ"
          >
            <Mail className="w-4 h-4" />
            <span>Contact HQ</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

        </div>

      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400 font-mono">
        <div>
          © {new Date().getFullYear()} The Brew App. All rights reserved. Precision Coffee, Tea & Beer Guide.
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://thebrew.app" className="hover:text-cream-light transition-colors">thebrew.app</a>
          <span>•</span>
          <span className="text-stone-300 font-bold">Custom Domain Live</span>
        </div>
      </div>

    </footer>
  );
}
