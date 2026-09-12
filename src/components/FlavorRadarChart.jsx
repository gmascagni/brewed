import React, { useState } from 'react';

/**
 * FlavorRadarChart
 * Interactive 5-axis SVG spider chart visualizing coffee sensory profiles:
 * - Acidity (brightness, citrus, malic)
 * - Sweetness (caramel, honey, cane sugar)
 * - Body (mouthfeel, weight, silkiness)
 * - Floral & Aroma (jasmine, bergamot, stone fruit)
 * - Finish & Clarity (length, aftertaste, cleanliness)
 */
export default function FlavorRadarChart({
  profile = {
    acidity: 85,
    sweetness: 88,
    body: 75,
    floral: 90,
    finish: 82
  },
  size = 280,
  fillColor = '#C88A4B',
  strokeColor = '#A8622D',
  className = ''
}) {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  // Normalized axes configuration (5 vertices, starting from top 12 o'clock)
  const axes = [
    { key: 'floral', label: 'Floral & Aroma', value: profile.floral ?? 80 },
    { key: 'sweetness', label: 'Sweetness', value: profile.sweetness ?? 85 },
    { key: 'finish', label: 'Finish', value: profile.finish ?? 80 },
    { key: 'acidity', label: 'Acidity', value: profile.acidity ?? 85 },
    { key: 'body', label: 'Body & Texture', value: profile.body ?? 75 },
  ];

  const center = size / 2;
  const radius = (size / 2) - 42; // Leave breathing room for labels

  // Convert polar coordinates to Cartesian (x, y)
  const getCoordinates = (angleRad, dist) => {
    // Subtract PI/2 so 0 radians points straight UP (12 o'clock)
    const x = center + dist * Math.cos(angleRad - Math.PI / 2);
    const y = center + dist * Math.sin(angleRad - Math.PI / 2);
    return { x, y };
  };

  const angleStep = (2 * Math.PI) / axes.length;

  // Generate background concentric rings (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Polygon points for the data values
  const dataPoints = axes.map((axis, i) => {
    const angle = i * angleStep;
    const clampedVal = Math.max(10, Math.min(100, axis.value));
    const dist = (clampedVal / 100) * radius;
    return getCoordinates(angle, dist);
  });

  const polygonPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="Sensory Flavor Profile Radar Chart"
      >
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.45" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.15" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={strokeColor} floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Concentric Web Grid Lines */}
        {gridLevels.map((lvl, idx) => {
          const ringPoints = axes.map((_, i) => {
            const angle = i * angleStep;
            return getCoordinates(angle, radius * lvl);
          });
          const path = ringPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';
          return (
            <path
              key={idx}
              d={path}
              fill="none"
              stroke="#ECE6DC"
              strokeWidth={idx === gridLevels.length - 1 ? '1.5' : '1'}
              strokeDasharray={idx < gridLevels.length - 1 ? '3 3' : undefined}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {axes.map((axis, i) => {
          const angle = i * angleStep;
          const outer = getCoordinates(angle, radius);
          const labelCoord = getCoordinates(angle, radius + 22);
          const isHovered = hoveredAxis === axis.key;

          return (
            <g key={axis.key}>
              <line
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                stroke="#DFD7CB"
                strokeWidth="1"
              />
              {/* Text Label */}
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={`text-[10.5px] font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  isHovered ? 'fill-[#A8622D] font-bold text-[11.5px]' : 'fill-[#5C524B]'
                }`}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                {axis.label}
              </text>
            </g>
          );
        })}

        {/* Sensory Data Area Polygon */}
        <path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke={strokeColor}
          strokeWidth="2"
          filter="url(#radarGlow)"
          className="transition-all duration-500 ease-out"
        />

        {/* Interactive Data Point Vertices */}
        {dataPoints.map((point, i) => {
          const axis = axes[i];
          const isHovered = hoveredAxis === axis.key;

          return (
            <g
              key={axis.key}
              onMouseEnter={() => setHoveredAxis(axis.key)}
              onMouseLeave={() => setHoveredAxis(null)}
              className="cursor-pointer"
            >
              {/* Invisible touch/hover target */}
              <circle cx={point.x} cy={point.y} r="14" fill="transparent" />
              {/* Outer halo */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isHovered ? 7 : 4}
                fill="#FFFFFF"
                stroke={strokeColor}
                strokeWidth="2"
                className="transition-all duration-200"
              />
              {/* Inner core */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isHovered ? 3.5 : 2}
                fill={fillColor}
                className="transition-all duration-200"
              />
            </g>
          );
        })}
      </svg>

      {/* Dynamic Hover Tooltip Banner */}
      <div className="h-6 flex items-center justify-center mt-1">
        {hoveredAxis ? (
          <div className="animate-fade-in text-xs font-mono font-bold text-[#A8622D] bg-[#F5E8D4]/60 px-2.5 py-0.5 rounded-full border border-[#EBCFA9]">
            {axes.find(a => a.key === hoveredAxis)?.label}: {axes.find(a => a.key === hoveredAxis)?.value}/100
          </div>
        ) : (
          <span className="text-[11px] font-sans text-[#8C8178] italic">
            Hover points for cupping dimension scores
          </span>
        )}
      </div>
    </div>
  );
}
