import React from 'react';

/**
 * TastingNoteBadge
 * Tactile botanical pill badge for coffee flavor notes (Peach, Jasmine, Bergamot, etc.)
 */
const FLAVOR_CATEGORIES = {
  floral: {
    bg: 'bg-[#F4EBF7]',
    border: 'border-[#E0D0E6]',
    text: 'text-[#6B3A7D]',
    keywords: ['jasmine', 'floral', 'blossom', 'lavender', 'rose', 'elderflower', 'chamomile']
  },
  citrus: {
    bg: 'bg-[#FFF8E6]',
    border: 'border-[#F7E7B8]',
    text: 'text-[#8A6A12]',
    keywords: ['bergamot', 'lemon', 'lime', 'grapefruit', 'orange', 'tangerine', 'yuzu', 'citrus']
  },
  stoneFruit: {
    bg: 'bg-[#FDF0EB]',
    border: 'border-[#F8D5C4]',
    text: 'text-[#9C4B23]',
    keywords: ['peach', 'apricot', 'plum', 'nectarine', 'cherry', 'mango', 'papaya']
  },
  berry: {
    bg: 'bg-[#FDEBF1]',
    border: 'border-[#F7CAD9]',
    text: 'text-[#942C51]',
    keywords: ['blueberry', 'raspberry', 'blackberry', 'strawberry', 'currant', 'pomegranate', 'cassis']
  },
  sweet: {
    bg: 'bg-[#F9F3EA]',
    border: 'border-[#ECDCBE]',
    text: 'text-[#855B18]',
    keywords: ['honey', 'caramel', 'brown sugar', 'toffee', 'maple', 'vanilla', 'cane sugar']
  },
  chocolate: {
    bg: 'bg-[#F4ECE8]',
    border: 'border-[#DECBC4]',
    text: 'text-[#5C3B30]',
    keywords: ['chocolate', 'cacao', 'cocoa', 'fudge', 'praline', 'hazelnut', 'almond']
  },
  ferment: {
    bg: 'bg-[#F7EDF2]',
    border: 'border-[#E6CAD9]',
    text: 'text-[#7D2954]',
    keywords: ['winey', 'rum', 'anaerobic', 'boozy', 'cider', 'confection', 'tropical']
  }
};

export default function TastingNoteBadge({ note, size = 'sm', className = '' }) {
  if (!note) return null;
  const lower = note.toLowerCase().trim();

  // Find matching flavor category
  let matched = null;
  for (const cat of Object.values(FLAVOR_CATEGORIES)) {
    if (cat.keywords.some(k => lower.includes(k))) {
      matched = cat;
      break;
    }
  }

  // Fallback styling: warm neutral caramel
  const style = matched || {
    bg: 'bg-[#F5EFE8]',
    border: 'border-[#E4D7CA]',
    text: 'text-[#5C524B]'
  };

  const sizeClasses = size === 'xs' 
    ? 'text-[10px] px-2 py-0.5' 
    : size === 'md'
    ? 'text-xs px-3 py-1 font-semibold'
    : 'text-[11px] px-2.5 py-0.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border ${style.bg} ${style.border} ${style.text} ${sizeClasses} tracking-wide transition-colors duration-150 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 opacity-60 bg-current" />
      <span>{note}</span>
    </span>
  );
}
