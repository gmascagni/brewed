import React, { useState, useMemo, useEffect } from 'react';
import {
  Tv,
  X,
  Search,
  Sparkles,
  Coffee,
  Flame,
  Droplets,
  Store,
  FlaskConical,
  Sliders,
  Clock,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Share2,
  Play,
  RotateCcw,
  Film,
  BookOpen
} from 'lucide-react';
import { COFFEE_VIDEOS, VIDEO_CATEGORIES } from '../data/coffeeVideos';
import { trackEvent } from '../utils/analytics';

export default function CoffeeVideoAcademyModal({
  isOpen,
  onClose,
  onBrewWithVideo,
  initialVideoId = null
}) {
  const [selectedVideo, setSelectedVideo] = useState(() => {
    if (initialVideoId) {
      const found = COFFEE_VIDEOS.find((v) => v.id === initialVideoId || v.youtubeId === initialVideoId);
      if (found) return found;
    }
    return COFFEE_VIDEOS.find((v) => v.featured) || COFFEE_VIDEOS[0];
  });

  // viewMode: 'library' | 'player'
  // If user opens with a specific video deep link, open player. Otherwise default to full library catalog.
  const [viewMode, setViewMode] = useState(() => (initialVideoId ? 'player' : 'library'));
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync if initialVideoId changes dynamically
  useEffect(() => {
    if (initialVideoId) {
      const found = COFFEE_VIDEOS.find((v) => v.id === initialVideoId || v.youtubeId === initialVideoId);
      if (found) {
        setSelectedVideo(found);
        setViewMode('player');
      }
    }
  }, [initialVideoId]);

  // Filtered videos based on category and search
  const filteredVideos = useMemo(() => {
    return COFFEE_VIDEOS.filter((video) => {
      const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        video.title.toLowerCase().includes(q) ||
        video.creator.toLowerCase().includes(q) ||
        video.description.toLowerCase().includes(q) ||
        (video.recipeSync && video.recipeSync.methodName.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleWatchVideo = (video) => {
    setSelectedVideo(video);
    setViewMode('player');
    trackEvent('select_academy_video', {
      video_id: video.id,
      title: video.title,
      creator: video.creator
    });
  };

  const handleBrewClick = (video) => {
    trackEvent('brew_along_video_click', {
      video_id: video.id,
      title: video.title,
      ratio: video.recipeSync?.ratio,
      methodId: video.recipeSync?.methodId
    });
    if (onBrewWithVideo) {
      onBrewWithVideo(video);
    }
    onClose();
  };

  const handleShareVideo = (video) => {
    const shareUrl = `https://thebrew.app/?video=${video.youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-[#120D0A] border-2 border-[#A66E38]/50 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[94vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-academy-title"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#20150E] via-[#160E09] to-[#0D0805] border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-gold shadow-lg shadow-amber-500/20 shrink-0">
              <Tv className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-amber-gold">
                  Coffee Academy
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 font-mono text-[9px] font-bold border border-red-500/30 flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {COFFEE_VIDEOS.length} Masterclasses
                </span>
              </div>
              <h2 id="video-academy-title" className="font-serif text-lg sm:text-xl font-bold text-cream-light leading-tight">
                Masterclass Video Hub
              </h2>
            </div>
          </div>

          {/* Navigation View Switcher (Library vs Player) */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('library')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'library'
                    ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                    : 'text-cream-soft hover:text-white'
                }`}
                title="Browse Full Video Catalog"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Library ({filteredVideos.length})</span>
              </button>
              
              <button
                type="button"
                onClick={() => setViewMode('player')}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'player'
                    ? 'bg-amber-gold text-espresso-950 shadow-md font-extrabold'
                    : 'text-cream-soft hover:text-white'
                }`}
                title="Watch Selected Video"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Theater Player</span>
              </button>
            </div>

            <a
              href="https://www.youtube.com/@TheBrewapp?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('youtube_subscribe_modal_header_click')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-md transition"
              title="Subscribe to The Brew App on YouTube"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Subscribe</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition shrink-0"
              title="Close Coffee Academy"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8 text-cream-light">
          
          {/* ========================================================================= */}
          {/* VIEW MODE 1: FULL MASTERCLASS LIBRARY CATALOG                            */}
          {/* ========================================================================= */}
          {viewMode === 'library' && (
            <div className="space-y-6 animate-fade-in">
              {/* Academy Hero Introduction Banner */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#20150E] via-[#2A180F] to-[#170E08] border border-amber-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-gold font-mono text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                      Curated Masterclasses
                    </span>
                    <span className="text-xs font-mono text-cream-soft/70">
                      World Barista Champions • Artisan Roasters • Extraction Science
                    </span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-light leading-snug">
                    Specialty Coffee Masterclasses & Dial-In Guides
                  </h3>
                  <p className="text-xs sm:text-sm text-cream-soft/80 font-sans">
                    Explore {COFFEE_VIDEOS.length} hand-picked video tutorials covering pour-over mechanics, espresso dialing, water chemistry, and roastery origins. Every masterclass synchronizes directly with our guided brew timers.
                  </p>
                </div>

                {selectedVideo && (
                  <button
                    type="button"
                    onClick={() => setViewMode('player')}
                    className="px-4 py-2.5 rounded-2xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition shrink-0 self-stretch sm:self-auto justify-center"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Featured Video ({selectedVideo.creator})</span>
                  </button>
                )}
              </div>

              {/* Filter Bar & Search */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {VIDEO_CATEGORIES.map((cat) => {
                      const isActive = activeCategory === cat.id;
                      const count = cat.id === 'all' 
                        ? COFFEE_VIDEOS.length 
                        : COFFEE_VIDEOS.filter(v => v.category === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setActiveCategory(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                            isActive
                              ? 'btn-tactile-amber text-espresso-950 shadow-md shadow-amber-gold/20 scale-102 font-extrabold'
                              : 'bg-black/40 text-cream-soft hover:text-cream-light hover:bg-white/[0.06] border-white/10'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-black/30 text-espresso-950 font-bold' : 'bg-white/10 text-cream-soft'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72 shrink-0">
                    <Search className="w-4 h-4 text-amber-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search masterclasses, baristas..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-soft/60 hover:text-white text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Video Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredVideos.map((video) => {
                    const isCurrent = selectedVideo && selectedVideo.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => handleWatchVideo(video)}
                        className={`rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xl hover:-translate-y-1 ${
                          isCurrent
                            ? 'bg-amber-500/15 border-amber-gold ring-2 ring-amber-gold/50 shadow-amber-900/30'
                            : 'bg-[#150F0B] border-white/10 hover:border-amber-gold/40 hover:bg-[#1C140E]'
                        }`}
                      >
                        {/* Thumbnail Frame */}
                        <div className="relative aspect-video w-full overflow-hidden bg-black">
                          <img
                            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                            loading="lazy"
                          />
                          
                          {/* Dark Vignette Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                          {/* Play Badge Center */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-black/60 border border-amber-gold/60 backdrop-blur-sm flex items-center justify-center text-amber-gold shadow-lg group-hover:scale-110 group-hover:bg-amber-gold group-hover:text-espresso-950 transition-all duration-300">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Duration Tag */}
                          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-cream-light font-bold border border-white/15">
                            {video.duration}
                          </div>

                          {/* Category Chip */}
                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-amber-gold uppercase tracking-wider font-bold border border-amber-gold/30">
                            {video.recipeSync?.methodName || video.category.replace('_', ' ')}
                          </div>
                        </div>

                        {/* Content Details */}
                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <img
                                src={video.creatorAvatar}
                                alt={video.creator}
                                className="w-5 h-5 rounded-full object-cover border border-amber-gold/40"
                              />
                              <span className="text-[11px] font-mono font-bold text-amber-gold/90 truncate">
                                {video.creator}
                              </span>
                              <span className="text-[10px] font-mono text-cream-soft/50">• {video.creatorBadge || 'Specialty Barista'}</span>
                            </div>

                            <h4 className="font-serif text-sm font-bold text-cream-light leading-snug line-clamp-2 group-hover:text-amber-gold transition-colors">
                              {video.title}
                            </h4>
                            
                            <p className="text-xs text-cream-soft/70 font-sans line-clamp-2 mt-1">
                              {video.description}
                            </p>
                          </div>

                          {/* Footer Actions */}
                          <div className="pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                            <span className="text-[10px] text-cream-soft/60">
                              {video.views} views
                            </span>

                            <div className="flex items-center gap-1.5">
                              {video.recipeSync && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBrewClick(video);
                                  }}
                                  className="px-2 py-1 rounded-lg bg-amber-gold/20 hover:bg-amber-gold hover:text-espresso-950 text-amber-gold text-[10px] font-bold border border-amber-gold/40 transition flex items-center gap-1"
                                  title="Load this recipe into the brew timer"
                                >
                                  <Coffee className="w-3 h-3" />
                                  <span>Brew 1:{video.recipeSync.ratio}</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWatchVideo(video);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold border border-white/15 transition flex items-center gap-1"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>Watch</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredVideos.length === 0 && (
                  <div className="py-12 text-center p-8 rounded-3xl bg-black/40 border border-white/10 space-y-3">
                    <Tv className="w-10 h-10 text-cream-soft/40 mx-auto" />
                    <h5 className="font-serif text-lg font-bold text-cream-light">
                      No matching video masterclasses found
                    </h5>
                    <p className="text-xs text-cream-soft/60">
                      Try clearing your search query or selecting another category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW MODE 2: THEATER PLAYER & BREW SYNC                                  */}
          {/* ========================================================================= */}
          {viewMode === 'player' && selectedVideo && (
            <div className="space-y-6 animate-fade-in">
              {/* Back to Library Button Bar */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('library')}
                  className="px-4 py-2 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] text-cream-light hover:text-amber-gold border border-white/15 text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95 shadow"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>← Back to Masterclass Library ({COFFEE_VIDEOS.length} Videos)</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cream-soft/70 hidden sm:inline">Now Playing:</span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold font-mono text-xs font-bold border border-amber-gold/40">
                    {selectedVideo.creator}
                  </span>
                </div>
              </div>

              {/* Main Theater Player Container */}
              <div
                id="academy-theater-player"
                className="rounded-3xl bg-[#1A120B] border border-amber-gold/30 p-4 sm:p-6 shadow-2xl space-y-5"
              >
                {/* 16:9 Responsive YouTube Embed */}
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl group">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0&color=white`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Theater Video Meta & Brew-Along Sync Section */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-2">
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-full bg-amber-gold/20 text-amber-gold font-bold border border-amber-gold/40">
                        {selectedVideo.creatorBadge || 'Barista Champion'}
                      </span>
                      <span className="text-cream-soft/60 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-gold" />
                        {selectedVideo.duration}
                      </span>
                      <span className="text-cream-soft/60 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-gold" />
                        {selectedVideo.views} views
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-light leading-snug">
                      {selectedVideo.title}
                    </h3>

                    <div className="flex items-center gap-3">
                      <img
                        src={selectedVideo.creatorAvatar}
                        alt={selectedVideo.creator}
                        className="w-8 h-8 rounded-full object-cover border border-amber-gold/40 shadow"
                      />
                      <span className="font-mono text-xs font-bold text-amber-gold">
                        {selectedVideo.creator}
                      </span>
                      <span className="text-stone-500 text-xs font-mono">•</span>
                      <p className="text-xs text-cream-soft/80 font-sans">
                        {selectedVideo.description}
                      </p>
                    </div>
                  </div>

                  {/* Brew-Along Interactive Card */}
                  {selectedVideo.recipeSync && (
                    <div className="w-full lg:w-auto p-4 rounded-2xl bg-black/60 border border-amber-gold/50 shadow-xl flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-stretch gap-4 shrink-0">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-gold">
                          <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
                          <span>Interactive Brew Sync</span>
                        </div>
                        <div className="text-xs font-mono text-cream-soft/90">
                          Method: <strong className="text-white">{selectedVideo.recipeSync.methodName}</strong>
                        </div>
                        <div className="text-[11px] font-mono text-cream-soft/70">
                          Golden Ratio: <span className="text-amber-gold font-bold">1:{selectedVideo.recipeSync.ratio}</span> • Temp: <span className="text-cyan-300 font-bold">{selectedVideo.recipeSync.waterTempF}°F</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full">
                        <button
                          onClick={() => handleBrewClick(selectedVideo)}
                          className="flex-1 py-2.5 px-4 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition"
                        >
                          <Coffee className="w-4 h-4" />
                          <span>Brew With This Video</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleShareVideo(selectedVideo)}
                          className="p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
                          title={copiedLink ? 'Link Copied!' : 'Share Video Link'}
                        >
                          {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Up Next / Explore More Masterclasses Carousel Grid */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-base font-bold text-cream-light flex items-center gap-2">
                    <Film className="w-4 h-4 text-amber-gold" />
                    <span>Up Next • More Masterclasses in the Academy</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setViewMode('library')}
                    className="text-amber-gold hover:underline text-xs font-mono font-bold flex items-center gap-1"
                  >
                    <span>View All {COFFEE_VIDEOS.length} Masterclasses</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {COFFEE_VIDEOS.filter(v => v.id !== selectedVideo.id).slice(0, 4).map((v) => (
                    <div
                      key={v.id}
                      onClick={() => handleWatchVideo(v)}
                      className="p-3 rounded-2xl bg-[#170E08] border border-white/10 hover:border-amber-gold/40 cursor-pointer transition group shadow-md flex gap-3 items-center"
                    >
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-amber-gold fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-mono text-amber-gold truncate">{v.creator}</div>
                        <h5 className="font-serif text-xs font-bold text-cream-light line-clamp-2 group-hover:text-amber-gold leading-tight">
                          {v.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sourcing / Attribution Disclosure Footer */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-cream-soft/60">
            <span>
              All video streams hosted directly via YouTube. Zero video storage overhead or server egress cost.
            </span>
            <span className="text-amber-gold font-bold">
              © {new Date().getFullYear()} The Brew App • Coffee Academy
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}