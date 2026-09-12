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
    <footer className="mt-14 py-6 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-xl transition-colors duration-500 bg-[#FAF7F2]/95 border-[#ECE6DC] text-[#766A62]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
        
        {/* Minimal Copyright */}
        <div className="text-[#766A62] text-[11px] font-medium flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
          <span>© {new Date().getFullYear()} The Brew App. All rights reserved.</span>
          <span className="hidden sm:inline text-[#A89F91]">•</span>
          <span className="text-[#A89F91]">Digital Trail Labs LLC</span>
        </div>

        {/* Action Group */}
        <div className="flex flex-wrap items-center gap-3">
          {onOpenVideoAcademy && (
            <button
              onClick={onOpenVideoAcademy}
              className="py-2 px-3.5 rounded-xl bg-red-600/10 hover:bg-red-600/15 text-red-700 hover:text-red-800 border border-red-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Coffee Academy</span>
            </button>
          )}

          {/* Official YouTube Channel Link */}
          <a
            href="https://www.youtube.com/@TheBrewapp"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('youtube_channel_footer_click')}
            className="py-2 px-3.5 rounded-xl bg-red-600/10 hover:bg-red-600/15 text-red-700 hover:text-red-800 border border-red-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
            title="Official The Brew App YouTube Channel (@TheBrewapp)"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>YouTube Channel</span>
            <ExternalLink className="w-3 h-3 opacity-80" />
          </a>

          {onOpenRoasterShowcase && (
            <button
              onClick={onOpenRoasterShowcase}
              className="py-2 px-3.5 rounded-xl bg-[#D69550]/15 hover:bg-[#D69550]/25 text-[#A25A24] border border-[#D69550]/30 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-xs"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Roaster Showcase</span>
            </button>
          )}

          {onOpenRoasterInfo && (
            <button
              onClick={onOpenRoasterInfo}
              className="py-2 px-3.5 rounded-xl bg-[#ECE6DC] hover:bg-[#E2DACF] text-[#14110F] border border-[#D8CFC4] text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <span>Add Your Roastery</span>
            </button>
          )}

          {/* Compact Contact HQ Button */}
          <a
            href={`mailto:${emailAddress}?subject=TheBrew.App%20Inquiry`}
            onClick={handleMailtoClick}
            className="py-2 px-4 rounded-xl text-xs font-extrabold tracking-wider uppercase flex items-center gap-2 shadow-xs hover:scale-105 active:scale-95 transition-all bg-[#D69550] hover:bg-[#C48B56] text-white"
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
