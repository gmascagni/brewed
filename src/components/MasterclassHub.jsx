import React, { useState, useEffect } from 'react';
import { Video, Play, Columns, Bookmark, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { MASTERCLASSES } from '../data/brewData';

export default function MasterclassHub({ trackMode, activeMethod, isSplitScreen, setIsSplitScreen, activeVideo, setActiveVideo }) {
  const isCoffee = trackMode === 'coffee';
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const toggleBookmark = (id) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    );
  };

  // Filter videos STRICTLY for the active method selected
  const activeMethodId = activeMethod?.id;
  const filteredVideos = MASTERCLASSES.filter(
    (item) => item.methodId === activeMethodId
  );

  const displayVideos = filteredVideos;

  // SAFETY GUARD: Ensure activeVideo belongs ONLY to the currently selected method
  const currentActiveVideo = (activeVideo && activeVideo.methodId === activeMethodId) ? activeVideo : null;

  return (
    <section className="mt-12 p-7 md:p-9 rounded-3xl glass-panel shadow-2xl transition-all duration-500">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Method Video Tutorials • {activeMethod?.name || 'Selected Method'}</span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light drop-shadow-md">
            Help Videos for {activeMethod?.name}
          </h3>
          <p className="text-xs md:text-sm text-cream-soft/70 mt-1">
            Curated video tutorials on preferred roasts, origins, pouring technique, and extraction for {activeMethod?.name}
          </p>
        </div>

        {/* Desktop Split Screen Mode Toggle Button */}
        <button
          onClick={() => setIsSplitScreen(!isSplitScreen)}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-extrabold border transition-all active:scale-95 ${
            isSplitScreen
              ? 'btn-tactile-amber text-espresso-950 scale-105'
              : 'bg-slate-800/90 border-white/15 text-cream-soft hover:border-amber-gold/60 hover:text-cream-light shadow-lg'
          }`}
          title="Pin video player side-by-side with active timer & calculator"
        >
          <Columns className="w-4 h-4" />
          <span>{isSplitScreen ? 'Exit Split Screen' : 'Split Screen Mode'}</span>
        </button>
      </div>

      {/* Active Video Player Panel (Renders ONLY if video belongs to activeMethod) */}
      {currentActiveVideo && (
        <div className="mb-10 p-5 rounded-3xl bg-espresso-950/95 border border-amber-gold/50 shadow-2xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-serif text-xl font-bold text-cream-light flex items-center gap-2.5 drop-shadow">
              <Video className="w-6 h-6 text-amber-gold" />
              <span>{currentActiveVideo.title}</span>
            </h4>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-xs text-cream-soft/70 hover:text-amber-gold font-bold underline"
            >
              Close Player
            </button>
          </div>

          {/* Responsive YouTube Masterclass Video Embed Player */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-5 border border-white/15 shadow-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${currentActiveVideo.embedId}?autoplay=0&rel=0`}
              title={currentActiveVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <p className="text-xs md:text-sm text-cream-soft/90 mb-4 font-medium leading-relaxed">
            {currentActiveVideo.description}
          </p>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <div className="text-xs font-extrabold text-amber-gold uppercase tracking-wider mb-2.5">
              Key Technique Takeaways:
            </div>
            <ul className="space-y-2 text-xs text-cream-soft/90 font-medium">
              {currentActiveVideo.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Video Masterclass Grid with Method-Filtered Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayVideos.map((item) => {
          const isBookmarked = bookmarkedIds.includes(item.id);
          const isActive = currentActiveVideo?.id === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-3xl border transition-all duration-300 overflow-hidden group flex flex-col justify-between hover:-translate-y-1.5 ${
                isActive
                  ? 'bg-amber-gold/20 border-amber-gold shadow-2xl shadow-amber-gold/20 scale-[1.02]'
                  : 'bg-espresso-900/70 border-white/10 hover:border-white/25 hover:bg-slate-900/80 shadow-xl'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                {/* Play Badge Overlay */}
                <button
                  onClick={() => setActiveVideo(item)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-13 h-13 rounded-full btn-tactile-amber text-espresso-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </button>

                {/* Duration Badge */}
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-cream-light flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-amber-gold" />
                  <span>{item.duration}</span>
                </div>

                {/* Bookmark Toggle */}
                <button
                  onClick={() => toggleBookmark(item.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 backdrop-blur-md text-cream-light hover:text-amber-gold transition-colors border border-white/10"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-gold text-amber-gold' : ''}`} />
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-gold mb-1.5">
                    {item.method} Tutorial
                  </div>
                  <h4 className="font-serif text-sm font-bold text-cream-light mb-2 line-clamp-2 drop-shadow">
                    {item.title}
                  </h4>
                  <p className="text-xs text-cream-soft/70 line-clamp-2 font-medium">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => setActiveVideo(item)}
                  className="mt-5 w-full py-2.5 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/20 text-xs font-extrabold text-cream-light transition-all shadow active:scale-95 flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-amber-gold" />
                  <span>Watch {item.method} Video</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
