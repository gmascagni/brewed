import React, { useState } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  Coffee, 
  MapPin, 
  SlidersHorizontal, 
  Compass, 
  Store, 
  ArrowUpRight,
  Search,
  Award
} from 'lucide-react';
import FlavorRadarChart from './FlavorRadarChart';
import BeanCard from './BeanCard';
import TastingNoteBadge from './TastingNoteBadge';
import { CURATED_SINGLE_ORIGINS } from '../data/coffeeSensoryData';
import { SHOWCASE_ROASTERS } from '../data/roasterShowcaseData';

const FLAVOR_FILTER_OPTIONS = [
  'All Profiles',
  'Floral & Jasmine',
  'Peach & Stone Fruit',
  'Citrus & Bergamot',
  'Honey & Sweet',
  'Fermented / Anaerobic'
];

export default function ConsumerDiscoveryFeed({
  onSelectBeanToBrew,
  onNavigateToRoaster,
  onOpenLocator,
  onStartBrewStation
}) {
  const [selectedFilter, setSelectedFilter] = useState('All Profiles');
  const [inspectedBean, setInspectedBean] = useState(CURATED_SINGLE_ORIGINS[0]);

  // Filter beans by flavor note tag
  const filteredBeans = CURATED_SINGLE_ORIGINS.filter(b => {
    if (selectedFilter === 'All Profiles') return true;
    const notesStr = b.tastingNotes.join(' ').toLowerCase();
    if (selectedFilter.includes('Floral')) return notesStr.includes('floral') || notesStr.includes('jasmine');
    if (selectedFilter.includes('Peach')) return notesStr.includes('peach') || notesStr.includes('fruit');
    if (selectedFilter.includes('Citrus')) return notesStr.includes('citrus') || notesStr.includes('bergamot') || notesStr.includes('grapefruit');
    if (selectedFilter.includes('Honey')) return notesStr.includes('honey') || notesStr.includes('sweet') || notesStr.includes('caramel');
    if (selectedFilter.includes('Anaerobic')) return b.processing.toLowerCase().includes('anaerobic') || notesStr.includes('ferment');
    return true;
  });

  return (
    <div className="space-y-16 pb-12">
      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Typographic Narrative */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0E6] border border-[#ECD4BD] text-[#A25A24] text-xs font-mono font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Specialty Coffee Extraction Atelier</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#14110F] leading-[1.08]">
              The Art of Extraction.
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#5C524B] leading-relaxed max-w-xl">
              Precision single-origin discovery, multi-phase guided pour-over timers, and real-time cafe bar radar. Engineered for the modern home barista and culinary purist.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartBrewStation}
                className="py-3 px-6 rounded-2xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-card hover:shadow-elevated active:scale-95 transition-all"
              >
                <span>Launch Guided Brew Lab</span>
                <ChevronRight className="w-4 h-4 text-[#E8AF72]" />
              </button>

              <button
                type="button"
                onClick={onOpenLocator}
                className="py-3 px-5 rounded-2xl bg-white hover:bg-[#FAF7F2] text-[#2A2421] font-sans font-semibold text-xs sm:text-sm border border-[#ECE6DC] hover:border-[#D69550] flex items-center gap-2 shadow-subtle active:scale-95 transition-all"
              >
                <MapPin className="w-4 h-4 text-[#C88A4B]" />
                <span>Locate Cafes On Bar Today</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#ECE6DC] max-w-lg">
              <div>
                <span className="font-editorial text-2xl font-bold text-[#14110F]">88.5+</span>
                <p className="text-[11px] font-sans text-[#766A62]">Min Cupping Score</p>
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold text-[#14110F]">100%</span>
                <p className="text-[11px] font-sans text-[#766A62]">Direct Trade Lots</p>
              </div>
              <div>
                <span className="font-editorial text-2xl font-bold text-[#14110F]">0.1g</span>
                <p className="text-[11px] font-sans text-[#766A62]">Ratio Precision</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Micro-Lot with Live Radar */}
          <div className="lg:col-span-6">
            <div className="editorial-card p-6 sm:p-8 relative bg-white overflow-hidden shadow-elevated">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#A8622D] uppercase tracking-wider bg-[#F5E8D4]/60 px-3 py-1 rounded-full border border-[#EBCFA9]">
                  <Award className="w-3.5 h-3.5" />
                  Lot of the Month • {inspectedBean.cuppingScore} SCA
                </span>
                <span className="text-xs font-sans text-[#766A62]">
                  {inspectedBean.roaster}
                </span>
              </div>

              <div className="space-y-1 mb-4">
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
                  {inspectedBean.beanName}
                </h3>
                <p className="text-xs text-[#766A62] font-sans flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C88A4B]" />
                  <span>{inspectedBean.origin}</span>
                  <span className="text-[#DFD7CB]">•</span>
                  <span>{inspectedBean.elevation}</span>
                  <span className="text-[#DFD7CB]">•</span>
                  <span className="font-semibold text-[#2A2421]">{inspectedBean.processing}</span>
                </p>
              </div>

              {/* Sensory Radar Visualization */}
              <div className="my-3 flex justify-center">
                <FlavorRadarChart
                  profile={inspectedBean.flavorRadar}
                  size={270}
                  fillColor="#C88A4B"
                  strokeColor="#A8622D"
                />
              </div>

              {/* Tasting Notes */}
              <div className="flex flex-wrap gap-1.5 my-4">
                {inspectedBean.tastingNotes.map((note, i) => (
                  <TastingNoteBadge key={i} note={note} size="sm" />
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-[#ECE6DC] flex items-center justify-between gap-3">
                <p className="text-xs font-sans text-[#5C524B] italic line-clamp-1 max-w-[240px]">
                  "{inspectedBean.notes}"
                </p>

                <button
                  type="button"
                  onClick={() => onSelectBeanToBrew(inspectedBean)}
                  className="py-2.5 px-5 rounded-xl bg-[#14110F] hover:bg-[#2A2421] text-[#FAF7F2] font-sans font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                >
                  <span>Dial-In Recipe</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#E8AF72]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SENSORY FLAVOR FILTER BAR */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A8622D] font-semibold">
              Sensory Exploration
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
              Curated Single-Origin Micro-Lots
            </h2>
          </div>

          <div className="text-xs text-[#766A62] font-sans">
            Showing <strong className="text-[#14110F]">{filteredBeans.length}</strong> verified coffees
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {FLAVOR_FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={`text-xs font-sans font-semibold py-2 px-4 rounded-xl whitespace-nowrap transition-all ${
                selectedFilter === filter
                  ? 'bg-[#14110F] text-[#FAF7F2] shadow-sm'
                  : 'bg-white text-[#5C524B] hover:text-[#14110F] hover:bg-[#FAF7F2] border border-[#ECE6DC]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Bean Card Grid (12-Column Desktop Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBeans.map((coffee) => (
            <BeanCard
              key={coffee.id}
              coffee={coffee}
              onBrew={(c) => onSelectBeanToBrew(c)}
              onViewRadar={(c) => {
                setInspectedBean(c);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </section>

      {/* 3. CRAFT ROASTERS SPOTLIGHT CAROUSEL / GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#A8622D] font-semibold">
              Terroir & Partner Guild
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#14110F]">
              Featured Roasters of the Month
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOWCASE_ROASTERS.map((roaster) => (
            <article
              key={roaster.id}
              className="editorial-card p-6 flex flex-col justify-between group hover:border-[#D69550] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#ECE6DC] flex items-center justify-center font-serif text-lg font-bold text-[#A8622D] shadow-xs">
                    {roaster.monogram || roaster.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-mono font-medium text-[#766A62]">
                    {roaster.city}, {roaster.state}
                  </span>
                </div>

                <h3 className="font-editorial text-xl font-bold text-[#14110F] group-hover:text-[#A8622D] transition-colors mb-1">
                  {roaster.name}
                </h3>
                <p className="text-xs text-[#766A62] font-sans line-clamp-2 mb-4">
                  {roaster.tagline}
                </p>

                <div className="space-y-1.5 py-3 border-y border-[#ECE6DC] text-xs font-sans text-[#5C524B]">
                  <div className="flex justify-between">
                    <span>Direct Trade:</span>
                    <strong className="text-[#2F663C]">{roaster.stats?.[2]?.value || '100%'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Roast Technology:</span>
                    <span className="font-mono font-medium text-[#14110F]">{roaster.roasterMachines?.split('&')[0] || 'Diedrich IR'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onNavigateToRoaster(roaster.id)}
                  className="text-xs font-sans font-bold text-[#14110F] hover:text-[#A8622D] flex items-center gap-1 transition-colors"
                >
                  <span>Explore Roastery Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C88A4B]" />
                </button>

                <a
                  href={roaster.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#8C8178] hover:text-[#14110F] transition-colors"
                  title={`Visit ${roaster.name} Official Website`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
