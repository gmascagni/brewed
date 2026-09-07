import React from 'react';

export default function BrandLogo({ size = 36, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="The Brew App Alchemy Harmony Logo"
    >
      <defs>
        <radialGradient id="headerBgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A1410" />
          <stop offset="100%" stopColor="#0B0907" />
        </radialGradient>

        <linearGradient id="headerCoffeeGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5DCB7" />
          <stop offset="35%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#8F5422" />
        </linearGradient>

        <linearGradient id="headerTeaSage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C2E2CC" />
          <stop offset="45%" stopColor="#7EA98E" />
          <stop offset="100%" stopColor="#365C45" />
        </linearGradient>

        <linearGradient id="headerBeanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D190D" />
          <stop offset="100%" stopColor="#100703" />
        </linearGradient>

        <linearGradient id="headerGoldBezel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCEFD8" />
          <stop offset="50%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#9A622A" />
        </linearGradient>

        <filter id="headerAlchemyGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#D4A373" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Dark Obsidian Container Badge */}
      <rect width="100" height="100" rx="24" fill="url(#headerBgGrad)" />
      <rect width="94" height="94" x="3" y="3" rx="21" fill="none" stroke="url(#headerGoldBezel)" strokeWidth="1.2" strokeOpacity="0.4" />

      {/* Yin-Yang Harmony Medallion */}
      <g filter="url(#headerAlchemyGlow)">
        <circle cx="50" cy="50" r="38" fill="#120E0A" stroke="url(#headerGoldBezel)" strokeWidth="1.5" />

        {/* Coffee Half (Left Amber-Gold Hemisphere with S-Curve) */}
        <path 
          d="M 50,12 A 38,38 0 0,0 50,88 A 19,19 0 0,1 50,50 A 19,19 0 0,0 50,12 Z" 
          fill="url(#headerCoffeeGold)" 
        />

        {/* Tea Half (Right Sage-Green Hemisphere with S-Curve) */}
        <path 
          d="M 50,12 A 38,38 0 0,1 50,88 A 19,19 0 0,1 50,50 A 19,19 0 0,0 50,12 Z" 
          fill="url(#headerTeaSage)" 
        />

        {/* Coffee Droplet / Bean in Upper Half */}
        <path 
          d="M 50 21 C 54.5 26.5, 57 31, 55.5 35 C 54 39, 46 39, 44.5 35 C 43 31, 45.5 26.5, 50 21 Z" 
          fill="url(#headerBeanGrad)" 
          stroke="#D4A373" 
          strokeWidth="0.9" 
        />
        
        {/* Bean Center Crease / Golden Glint */}
        <path 
          d="M 50 25 Q 48 30.5, 51.5 35.5" 
          fill="none" 
          stroke="#F5DCB7" 
          strokeWidth="0.9" 
          strokeLinecap="round" 
          opacity="0.85" 
        />

        {/* Botanical Tea Leaf Veins in Lower Sage Half */}
        <path d="M 50 57 L 50 80" stroke="#1E3826" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M 50 63 Q 56.5 60.5, 59.5 58.5" stroke="#1E3826" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 50 69 Q 43.5 66.5, 40.5 65.5" stroke="#1E3826" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M 50 74.5 Q 55.5 72.5, 58 71.5" stroke="#1E3826" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* Outer Fine Gold Ring Accent */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="url(#headerGoldBezel)" strokeWidth="1.5" strokeOpacity="0.8" />
      </g>
    </svg>
  );
}
