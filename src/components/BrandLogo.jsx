import React from 'react';

export default function BrandLogo({ size = 36, className = "" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="TheBrew.App 'B' Monogram Dripper Logo"
    >
      <defs>
        <radialGradient id="tbaBgGrad" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1C1814" />
          <stop offset="100%" stopColor="#0A0806" />
        </radialGradient>

        <linearGradient id="tbaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#D4A373" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        <linearGradient id="tbaAmberDrop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="tbaRimBezel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4A373" />
          <stop offset="100%" stopColor="#9A622A" />
        </linearGradient>

        <filter id="tbaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#D4A373" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Dark Obsidian Squircle Container Badge */}
      <rect width="100" height="100" rx="22" fill="url(#tbaBgGrad)" />
      <rect width="94" height="94" x="3" y="3" rx="19" fill="none" stroke="url(#tbaRimBezel)" strokeWidth="1.2" strokeOpacity="0.35" />

      {/* Group with subtle ambient gold glow */}
      <g filter="url(#tbaGlow)">
        {/* Dripper Top Fluted Crown (Origami / V60 style rim) */}
        <path 
          d="M 24 16 L 76 16 L 71 24 L 29 24 Z" 
          fill="none" 
          stroke="url(#tbaGoldGrad)" 
          strokeWidth="2.2" 
          strokeLinejoin="round" 
        />
        {/* Fluted Vertical Slots on Crown */}
        <line x1="36" y1="16" x2="38" y2="24" stroke="url(#tbaGoldGrad)" strokeWidth="1.6" />
        <line x1="45" y1="16" x2="46" y2="24" stroke="url(#tbaGoldGrad)" strokeWidth="1.6" />
        <line x1="55" y1="16" x2="54" y2="24" stroke="url(#tbaGoldGrad)" strokeWidth="1.6" />
        <line x1="64" y1="16" x2="62" y2="24" stroke="url(#tbaGoldGrad)" strokeWidth="1.6" />

        {/* Stem of the 'B' */}
        <line x1="28" y1="16" x2="28" y2="84" stroke="url(#tbaGoldGrad)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Dripper Funnel V-Shape integrated into Monogram */}
        <path 
          d="M 29 24 L 47 48 L 47 53 L 49 53 L 53 53 L 53 48 L 71 24" 
          fill="none" 
          stroke="url(#tbaGoldGrad)" 
          strokeWidth="2.4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Upper Loop of 'B' */}
        <path 
          d="M 28 24 L 54 24 C 67 24, 76 32, 72 45 C 70 50, 64 52, 53 52" 
          fill="none" 
          stroke="url(#tbaGoldGrad)" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Lower Loop of 'B' */}
        <path 
          d="M 53 52 C 67 52, 79 58, 77 72 C 75 82, 63 84, 28 84" 
          fill="none" 
          stroke="url(#tbaGoldGrad)" 
          strokeWidth="3.4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Golden Amber Extraction Droplet suspended from dripper tip */}
        <path 
          d="M 50 56 C 54.5 62, 57 66, 55 70 C 53 74, 47 74, 45 70 C 43 66, 45.5 62, 50 56 Z" 
          fill="url(#tbaAmberDrop)" 
          stroke="#FDE68A" 
          strokeWidth="0.8" 
        />
        {/* Droplet Light Specular Glint */}
        <ellipse cx="48.5" cy="65" rx="1.2" ry="2.2" transform="rotate(-25 48.5 65)" fill="#FFFFFF" opacity="0.75" />
      </g>
    </svg>
  );
}
