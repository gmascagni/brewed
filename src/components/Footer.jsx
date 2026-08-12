import React from 'react';
import { Mail, ExternalLink } from 'lucide-react';
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
    <footer className={`mt-14 py-6 px-4 sm:px-6 lg:px-8 border-t bg-[#0B0908]/90 backdrop-blur-xl text-stone-400 transition-colors duration-500 ${
      isBeer ? 'border-amber-500/25' : isCoffee ? 'border-[#A66E38]/25' : 'border-sage-500/25'
    }`}>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        
        {/* Minimal Copyright */}
        <div className="text-stone-400 text-[11px] font-medium">
          © {new Date().getFullYear()} The Brew App. All rights reserved.
        </div>

        {/* Compact Contact HQ Button */}
        <a
          href={`mailto:${emailAddress}?subject=The%20Brew%20App%20Inquiry`}
          onClick={handleMailtoClick}
          className={`py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all ${
            isBeer
              ? 'btn-tactile-beer text-[#0F0C05]'
              : isCoffee
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
    </footer>
  );
}
