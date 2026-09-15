import React, { useState } from 'react';

/**
 * BrandLogo — TheBrew.App Official Luxury Coffee Medallion
 * 
 * Renders the high-definition 3D gold coffee medallion with an inline
 * vector SVG fallback.
 */
export default function BrandLogo({ size = 36, className = "" }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="/images/branding/thebrew_medallion.png"
        alt="TheBrew.App Coffee Medallion Logo"
        width={size}
        height={size}
        onError={() => setImgError(true)}
        className={`rounded-full shrink-0 object-cover shadow-sm transition-transform duration-300 hover:scale-105 border border-amber-500/40 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    );
  }

  // Pure SVG Fallback representing the all-coffee gold medallion with center bean
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      width={size} 
      height={size} 
      className={`rounded-full shrink-0 transition-transform duration-300 hover:scale-105 ${className}`}
      aria-label="TheBrew.App Coffee Medallion Logo"
    >
      <defs>
        <radialGradient id="tbaMedBg" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#2A1B10" />
          <stop offset="100%" stopColor="#0E0B08" />
        </radialGradient>
        <linearGradient id="tbaGoldRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="35%" stopColor="#D4A373" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <linearGradient id="tbaLightRoast" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="tbaDarkRoast" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350F" />
          <stop offset="60%" stopColor="#451A03" />
          <stop offset="100%" stopColor="#1C1917" />
        </linearGradient>
      </defs>
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="url(#tbaMedBg)" />
      {/* Outer Beveled Gold Rim */}
      <circle cx="50" cy="50" r="46" fill="none" stroke="url(#tbaGoldRim)" strokeWidth="4.5" />
      <circle cx="50" cy="50" r="41.5" fill="none" stroke="#FDE68A" strokeWidth="0.8" opacity="0.6" />
      {/* Left Bean Half (Light Roast Amber) */}
      <path 
        d="M 50 14 C 28 14, 18 32, 20 54 C 22 72, 34 86, 50 86 C 44 76, 40 64, 48 48 C 54 36, 56 24, 50 14 Z" 
        fill="url(#tbaLightRoast)" 
      />
      {/* Right Bean Half (Dark Roast Espresso) */}
      <path 
        d="M 50 14 C 56 24, 54 36, 48 48 C 40 64, 44 76, 50 86 C 66 86, 78 72, 80 54 C 82 32, 72 14, 50 14 Z" 
        fill="url(#tbaDarkRoast)" 
      />
      {/* Fluid S-Curve Crevasse */}
      <path 
        d="M 50 14 C 56 24, 54 36, 48 48 C 40 64, 44 76, 50 86" 
        fill="none" 
        stroke="#0E0B08" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 50 14 C 56 24, 54 36, 48 48 C 40 64, 44 76, 50 86" 
        fill="none" 
        stroke="url(#tbaGoldRim)" 
        strokeWidth="1.2" 
        strokeLinecap="round" 
        opacity="0.8" 
      />
      {/* Golden Center Coffee Bean */}
      <g transform="translate(50, 49) rotate(-10)">
        <ellipse cx="0" cy="0" rx="6.5" ry="9.5" fill="url(#tbaGoldRim)" stroke="#78350F" strokeWidth="0.9" />
        <path d="M 0 -7.5 C 1.2 -2.5, -1.2 2.5, 0 7.5" fill="none" stroke="#2A1B10" strokeWidth="1.1" strokeLinecap="round" />
      </g>
    </svg>
  );
}
