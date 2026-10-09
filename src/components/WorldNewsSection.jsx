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

function parseRssJsonItem(item, defaultSource) {
  const title = (item.title || '').replace(/<[^>]+>/g, '').trim();
  const url = item.link || item.guid || '';
  if (!title || !url) return null;

  let desc = (item.description || item.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (desc.length > 280) {
    desc = desc.substring(0, 277) + '...';
  }
  if (!desc || desc.length < 20) {
    desc = `${title}. Read complete reporting on ${defaultSource}.`;
  }

  const parsedDate = item.pubDate ? new Date(item.pubDate.replace(' ', 'T')) : new Date();
  const dateFormatted = !isNaN(parsedDate.getTime())
    ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  let tag = 'Industry & News';
  const combined = (title + ' ' + desc).toLowerCase();
  if (combined.includes('farm') || combined.includes('origin') || combined.includes('harvest') || combined.includes('producer') || combined.includes('grower')) {
    tag = 'Farm & Origin';
  } else if (combined.includes('competition') || combined.includes('championship') || combined.includes('barista') || combined.includes('cup of excellence')) {
    tag = 'Competitions';
  } else if (combined.includes('market') || combined.includes('price') || combined.includes('trade') || combined.includes('report') || combined.includes('export')) {
    tag = 'Market & Trade';
  }

  const domain = url.replace(/^https?:\/\//i, '').split('/')[0];

  return {
    id: `live_${Math.abs(url.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0))}`,
    title,
    source: defaultSource,
    sourceDomain: domain,
    url,
    publishedDate: dateFormatted,
    dateIso: !isNaN(parsedDate.getTime()) ? parsedDate.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    category: 'coffee',
    tag,
    readTime: `${Math.max(2, Math.min(6, Math.round(desc.split(' ').length / 30) + 1))} min read`,
    featured: false,
    summary: desc,
    keyPoints: [
      `Published by ${defaultSource} on ${dateFormatted}`,
      `Direct coverage covering ${tag.toLowerCase()}`
    ]
  };
}

export default function WorldNewsSection({ trackMode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncStatusNotice, setSyncStatusNotice] = useState(null);

  // Client-side persisted news state (falling back to build-time bundled articles)
  const [articles, setArticles] = useState(() => {
    try {
      const cached = localStorage.getItem('the_brew_app_fresh_news');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return WORLD_BREW_NEWS;
  });

  const [lastSynced, setLastSynced] = useState(() => {
    try {
      const saved = localStorage.getItem('the_brew_app_news_last_synced');
      if (saved) return saved;
    } catch {}
    return LAST_UPDATED || 'Recently';
  });

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
    return articles.filter((item) => {
      // Category filter
      const matchesCategory = 
        selectedCategory === 'all' ||
        (selectedCategory === 'coffee' && item.category === 'coffee') ||
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
  }, [articles, selectedCategory, searchQuery]);

  // Real live RSS fetcher connecting directly to primary publishers
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setSyncStatusNotice({ 
      type: 'loading', 
      message: 'Connecting to live RSS feeds (Daily Coffee News & Perfect Daily Grind)...' 
    });
    setIsExpanded(true);

    try {
      const feedEndpoints = [
        { url: 'https://dailycoffeenews.com/feed/', source: 'Daily Coffee News' },
        { url: 'https://perfectdailygrind.com/feed/', source: 'Perfect Daily Grind' }
      ];

      const results = await Promise.allSettled(
        feedEndpoints.map(async ({ url, source }) => {
          const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`, {
            signal: AbortSignal.timeout(9000)
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.status !== 'ok' || !Array.isArray(data.items)) throw new Error('Invalid RSS payload');
          return data.items.map(item => parseRssJsonItem(item, source)).filter(Boolean);
        })
      );

      const fetchedItems = [];
      const seenUrls = new Set();
      const seenTitles = new Set();

      for (const res of results) {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          for (const item of res.value) {
            const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (!seenUrls.has(item.url) && !seenTitles.has(normTitle)) {
              seenUrls.add(item.url);
              seenTitles.add(normTitle);
              fetchedItems.push(item);
            }
          }
        }
      }

      if (fetchedItems.length > 0) {
        fetchedItems.sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime());
        const topStories = fetchedItems.slice(0, 12);
        setArticles(topStories);

        const nowFormatted = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        });
        setLastSynced(nowFormatted);

        try {
          localStorage.setItem('the_brew_app_fresh_news', JSON.stringify(topStories));
          localStorage.setItem('the_brew_app_news_last_synced', nowFormatted);
        } catch {}

        setSyncStatusNotice({
          type: 'success',
          message: `Successfully captured ${topStories.length} live stories from primary RSS feeds.`
        });
      } else {
        throw new Error('No stories returned from live RSS feeds');
      }
    } catch (err) {
      console.warn('Live RSS refresh error:', err);
      setSyncStatusNotice({
        type: 'error',
        message: 'Could not connect to live RSS proxy. Displaying authentic curated cache.'
      });
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        setSyncStatusNotice(null);
      }, 6000);
    }
  };

  return (
    <section 
      id="world-news" 
      className="mt-14 p-6 sm:p-8 md:p-10 rounded-3xl transition-all duration-700 shadow-2xl border glass-panel-coffee border-[#A66E38]/35"
    >
      {/* Section Header */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all ${
        isExpanded ? 'pb-6 border-b border-white/10' : ''
      }`}>
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-mono font-extrabold uppercase tracking-widest text-amber-gold border border-amber-gold/30 mb-3 shadow">
            <Globe2 className="w-3.5 h-3.5 text-amber-gold" />
            <span>Brew News Roundup • Curated RSS Feeds</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-cream-light drop-shadow-md flex items-center gap-3">
            <span>Brew News</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-cream-soft/80 border border-white/15">
              {articles.length} Stories
            </span>
          </h3>
          
          <p className="text-xs sm:text-sm text-cream-soft/80 mt-2 max-w-2xl leading-relaxed">
            Curated briefings, harvest dispatches, competition highlights, and market analytics pulled directly from Daily Coffee News, Perfect Daily Grind, and specialty coffee trade publications.
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
                {lastSynced ? `Synced: ${lastSynced}` : 'Updated periodically'}
              </div>
            </div>
          </div>

          {/* Real Live RSS Refresh Button */}
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-4 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-gold border border-amber-500/35 text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95 cursor-pointer disabled:opacity-50 shadow-md whitespace-nowrap"
            title="Fetch the newest live articles from Daily Coffee News & Perfect Daily Grind"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-gold ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Fetching News...' : 'Refresh Feed'}</span>
          </button>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`px-5 sm:px-6 py-3.5 rounded-2xl text-xs font-mono font-extrabold uppercase tracking-wider flex items-center gap-2 shadow-xl transition-all active:scale-95 whitespace-nowrap ${
              isExpanded
                ? 'btn-tactile-coffee text-[#140C08]'
                : 'bg-white/[0.08] text-cream-light hover:bg-white/[0.15] border border-white/[0.12]'
            }`}
            title={isExpanded ? 'Collapse Brew News section' : 'Expand Brew News section'}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Collapse News' : 'Expand Brew News'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Body Content */}
      {isExpanded && (
        <div className="mt-8 space-y-8 animate-fade-in">
          {/* Live Sync Status Notice Banner */}
          {syncStatusNotice && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-mono border transition-all animate-fade-in ${
              syncStatusNotice.type === 'success'
                ? 'bg-emerald-500/15 text-emerald-200 border-emerald-500/35 shadow-lg'
                : syncStatusNotice.type === 'error'
                ? 'bg-amber-500/15 text-amber-200 border-amber-500/35 shadow-lg'
                : 'bg-white/[0.08] text-cream-light border-white/20 shadow-lg'
            }`}>
              {syncStatusNotice.type === 'loading' ? (
                <RefreshCw className="w-4 h-4 text-amber-gold animate-spin shrink-0" />
              ) : syncStatusNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span>{syncStatusNotice.message}</span>
            </div>
          )}

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
                      <span className="px-2.5 py-1 rounded-xl text-[10px] font-mono font-extrabold uppercase tracking-wider border shadow-sm bg-amber-500/20 text-amber-gold border-amber-400/40">
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
                        {(article.keyPoints || []).map((point, idx) => (
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
