import React, { useState, useMemo, useEffect } from 'react';
import { 
  Newspaper, 
  Search, 
  ExternalLink, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Globe2, 
  RefreshCw, 
  Tag, 
  Layers,
  Coffee,
  Leaf,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WORLD_BREW_NEWS, NEWS_CATEGORIES, LAST_UPDATED } from '../data/newsData';

function sanitizeNewsText(str) {
  if (!str) return '';
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&ndash;/gi, '–')
    .replace(/&mdash;/gi, '—')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function WorldNewsSection({ trackMode }) {
  const isCoffee = trackMode === 'coffee';
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Listen for navigation event from Header
  useEffect(() => {
    const handleOpenWorldNews = () => {
      setIsExpanded(true);
    };
    window.addEventListener('open-world-news', handleOpenWorldNews);
    return () => window.removeEventListener('open-world-news', handleOpenWorldNews);
  }, []);

  // Filter and search logic
  const filteredNews = useMemo(() => {
    return WORLD_BREW_NEWS.filter((item) => {
      // Category filter
      const matchesCategory = 
        selectedCategory === 'all' ||
        (selectedCategory === 'coffee' && item.category === 'coffee') ||
        (selectedCategory === 'tea' && item.category === 'tea') ||
        (selectedCategory === 'origin' && (item.tag.toLowerCase().includes('origin') || item.tag.toLowerCase().includes('farming') || item.tag.toLowerCase().includes('harvest'))) ||
        (selectedCategory === 'competition' && (item.tag.toLowerCase().includes('competition') || item.tag.toLowerCase().includes('events')));

      if (!matchesCategory) return false;

      // Keyword search
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        item.keyPoints.some((pt) => pt.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <section 
      id="world-news" 
      className={`mt-14 p-6 sm:p-8 md:p-10 rounded-3xl transition-all duration-700 shadow-2xl border ${
        isCoffee 
          ? 'glass-panel-coffee border-[#A66E38]/35' 
          : 'glass-panel-tea border-sage-500/35'
      }`}
    >
      {/* Section Header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all ${
        isExpanded ? 'pb-6 border-b border-white/10' : ''
      }`}>
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-gold border border-amber-gold/30 mb-3 shadow">
            <Globe2 className="w-3.5 h-3.5 text-amber-gold" />
            <span>Coffee & Tea News Roundup • Curated RSS Feeds</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md flex items-center gap-3">
            <span>World Coffee & Tea News</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cream-soft/80 border border-white/15">
              {WORLD_BREW_NEWS.length} Stories
            </span>
          </h3>
          
          <p className="text-xs sm:text-sm text-cream-soft/80 mt-2 max-w-2xl leading-relaxed">
            Curated briefings, harvest dispatches, competition highlights, and market analytics pulled directly from Daily Coffee News, World Tea Press, and trade publications.
          </p>
        </div>

        {/* Status Card & Expand/Collapse Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 shadow-inner">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-gold">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-gold">
                <span className="w-2 h-2 rounded-full bg-amber-gold" />
                <span>Curated via RSS</span>
              </div>
              <div className="text-[10px] text-cream-soft/70 font-mono">
                {LAST_UPDATED ? `Synced: ${LAST_UPDATED}` : 'Updated periodically'}
              </div>
            </div>
          </div>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`px-5 sm:px-6 py-3.5 rounded-2xl text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all active:scale-95 whitespace-nowrap ${
              isExpanded
                ? isCoffee 
                  ? 'btn-tactile-coffee text-[#140C08]' 
                  : 'btn-tactile-tea text-white'
                : 'bg-white/[0.08] text-cream-light hover:bg-white/[0.15] border border-white/[0.12]'
            }`}
            title={isExpanded ? 'Collapse World News section' : 'Expand World News section'}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Collapse News' : 'Expand World News'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Body Content */}
      {isExpanded && (
        <div className="mt-8 space-y-8 animate-fade-in">

      {/* Control Bar: Category Filters & Search Input */}
      <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {NEWS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'btn-tactile-amber text-espresso-950 shadow-lg shadow-amber-gold/20 scale-105'
                    : 'bg-white/[0.06] text-cream-soft/80 hover:bg-white/[0.12] hover:text-cream-light border border-white/10'
                }`}
              >
                {cat.id === 'coffee' && <Coffee className="w-3.5 h-3.5" />}
                {cat.id === 'tea' && <Leaf className="w-3.5 h-3.5" />}
                {cat.id === 'all' && <Layers className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full lg:w-80 flex-shrink-0">
          <Search className="w-4 h-4 text-cream-soft/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news briefs, origins, topics..."
            className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-black/40 border border-white/15 text-xs text-cream-light placeholder-cream-soft/50 focus:outline-none focus:border-amber-gold transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-cream-soft/50 hover:text-cream-light px-1.5 py-0.5 rounded bg-white/10"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* News Briefs Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews.length > 0 ? (
          filteredNews.map((article) => {
            const isTeaArticle = article.category === 'tea';

            return (
              <article
                key={article.id}
                className="p-6 sm:p-7 rounded-3xl bg-espresso-950/70 border border-white/10 hover:border-amber-gold/50 transition-all duration-300 flex flex-col justify-between group shadow-xl hover:-translate-y-1 hover:shadow-2xl"
              >
                <div>
                  {/* Article Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      {/* Source Badge */}
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider border shadow-sm ${
                        isTeaArticle
                          ? 'bg-sage-500/20 text-sage-300 border-sage-500/40'
                          : 'bg-amber-500/20 text-amber-gold border-amber-400/40'
                      }`}>
                        {article.source}
                      </span>

                      {/* Topic Tag */}
                      <span className="px-2 py-0.5 rounded-lg bg-white/[0.05] text-cream-soft/70 border border-white/[0.08] text-[10px] font-mono font-bold">
                        {article.tag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-cream-soft/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-gold" />
                        <span>{article.publishedDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cream-soft/40" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Headline */}
                  <h4 className="font-serif text-lg sm:text-xl font-bold text-cream-light mb-3 leading-snug group-hover:text-amber-gold transition-colors">
                    {sanitizeNewsText(article.title)}
                  </h4>

                  {/* News Brief / Summary */}
                  <p className="text-xs sm:text-sm text-cream-soft/90 leading-relaxed mb-5 font-normal">
                    {sanitizeNewsText(article.summary)}
                  </p>

                  {/* Executive Key Points */}
                  {article.keyPoints && article.keyPoints.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.08] mb-6 shadow-inner">
                      <div className="text-[10px] font-mono font-extrabold text-amber-gold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-gold" />
                        <span>Key Takeaways</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-cream-soft/85 font-medium">
                        {article.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{sanitizeNewsText(point)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer: Source Link & Domain */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono text-cream-soft/50 truncate">
                    Publisher: {article.sourceDomain}
                  </span>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-amber-gold hover:text-espresso-950 text-cream-light text-xs font-mono font-bold transition-all border border-white/15 flex items-center gap-1.5 active:scale-95 group/link shadow"
                    title={`Read full coverage on ${article.source}`}
                  >
                    <span>Read on {article.source}</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </article>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center p-8 rounded-3xl bg-black/30 border border-white/10">
            <Newspaper className="w-10 h-10 text-cream-soft/40 mx-auto mb-3" />
            <h5 className="font-serif text-lg font-bold text-cream-light mb-1">
              No matching news briefs found
            </h5>
            <p className="text-xs text-cream-soft/60">
              Try adjusting your search query or switching to another category.
            </p>
          </div>
        )}
      </div>

      {/* Transparency Footer Notice */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-cream-soft/50 font-mono">
        <span>Syndicated from primary industry publications via RSS. Direct article permalinks open original reporting on publisher sites.</span>
        <span>Curated with direct publisher attribution</span>
      </div>
        </div>
      )}
    </section>
  );
}
