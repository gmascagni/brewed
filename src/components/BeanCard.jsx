import React from 'react';
import { Coffee, Compass, ExternalLink, Sparkles, MapPin, Award, ChevronRight } from 'lucide-react';
import TastingNoteBadge from './TastingNoteBadge';

/**
 * BeanCard
 * Luxury editorial specialty coffee card featuring origin details,
 * process tags, cupping scores, and one-click extraction dial-in.
 */
export default function BeanCard({
  coffee,
  onBrew,
  onViewRadar,
  className = ''
}) {
  if (!coffee) return null;

  const {
    beanName = 'Single-Origin Micro-Lot',
    roaster = 'Craft Roaster',
    origin = 'Origin Unspecified',
    elevation = '1,800 MASL',
    processing = 'Washed',
    roastLevel = 'Light-Medium',
    tastingNotes = ['Citrus', 'Floral', 'Caramel'],
    cuppingScore = 88.0,
    shopUrl,
    flavorProfile
  } = coffee;

  // Process method color map
  const processBadgeStyles = {
    'Washed': 'bg-[#EBF3ED] text-[#2F663C] border-[#C8E0CD]',
    'Natural': 'bg-[#FAF0E6] text-[#A25A24] border-[#ECD4BD]',
    'Anaerobic': 'bg-[#F9EBF3] text-[#933267] border-[#ECC8DE]',
    'Honey': 'bg-[#FFF6E5] text-[#9E6E12] border-[#F4DCAC]',
    'default': 'bg-[#F5EFE8] text-[#5C524B] border-[#E4D7CA]'
  };

  const processStyle = Object.entries(processBadgeStyles).find(([k]) => 
    processing.toLowerCase().includes(k.toLowerCase())
  )?.[1] || processBadgeStyles.default;

  return (
    <article
      className={`editorial-card flex flex-col justify-between p-6 group transition-all duration-300 relative overflow-hidden ${className}`}
    >
      {/* Top Header: Roaster & Cupping Score */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center text-xs font-serif font-bold text-[#A8622D] shadow-xs group-hover:border-[#D69550] transition-colors">
              {roaster.charAt(0)}
            </div>
            <span className="text-xs font-sans font-semibold tracking-wider uppercase text-[#766A62]">
              {roaster}
            </span>
          </div>

          {/* SCA Cupping Score Badge */}
          {cuppingScore && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#ECE6DC] text-xs font-mono font-bold text-[#14110F]">
              <Award className="w-3.5 h-3.5 text-[#C88A4B]" />
              <span>{cuppingScore} <span className="text-[9px] font-sans text-[#8C8178]">SCA</span></span>
            </div>
          )}
        </div>

        {/* Bean Headline */}
        <h3 className="font-editorial text-xl font-bold text-[#14110F] group-hover:text-[#A8622D] transition-colors line-clamp-1 mb-1.5">
          {beanName}
        </h3>

        {/* Origin & Terroir Metadata */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-xs text-[#766A62] font-sans mb-4">
          <span className="flex items-center gap-1 text-[#2A2421] font-medium">
            <MapPin className="w-3 h-3 text-[#C88A4B]" />
            {origin}
          </span>
          <span className="text-[#DFD7CB]">•</span>
          <span>{elevation}</span>
          <span className="text-[#DFD7CB]">•</span>
          <span className={`text-[10.5px] px-2 py-0.2 rounded-md font-semibold border ${processStyle}`}>
            {processing}
          </span>
        </div>

        {/* Tasting Note Pills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {tastingNotes.slice(0, 4).map((note, idx) => (
            <TastingNoteBadge key={idx} note={note} size="xs" />
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between gap-2 mt-auto">
        {onViewRadar && (
          <button
            type="button"
            onClick={() => onViewRadar(coffee)}
            className="text-xs font-sans font-semibold text-[#766A62] hover:text-[#14110F] flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-[#FAF7F2]"
            title="Inspect 5-Axis Sensory Flavor Radar"
          >
            <Compass className="w-3.5 h-3.5 text-[#C88A4B]" />
            <span>Sensory Radar</span>
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {shopUrl && (
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl text-[#766A62] hover:text-[#14110F] hover:bg-[#FAF7F2] border border-transparent hover:border-[#ECE6DC] transition-all"
              title={`Buy ${beanName} from ${roaster}`}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {onBrew && (
            <button
              type="button"
              onClick={() => onBrew(coffee)}
              className="py-2 px-3.5 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95 transition-all"
            >
              <span>Dial-In</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E8AF72]" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
