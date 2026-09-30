import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Star, 
  Sparkles, 
  Plus, 
  Trash2, 
  X, 
  Filter, 
  Heart, 
  Coffee, 
  Leaf, 
  Scale, 
  Gauge, 
  Thermometer, 
  Calendar, 
  Award, 
  Download, 
  Upload, 
  ScanLine,
  Search,
  History,
  ArrowRight,
  Maximize2,
  Cloud,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Flame,
  Mail,
  Share2,
  Globe,
  Lock
} from 'lucide-react';

import { 
  JOURNAL_STORAGE_KEY, 
  JOURNAL_UPDATED_EVENT, 
  getJournalLogs, 
  saveJournalLogs,
  syncJournalWithCloud,
  findPreviousBrewsForLot,
  compressPhotoToThumbnail,
  toggleEntryPublicStatus
} from '../utils/journalStorage';
import { 
  getStreakData, 
  STREAK_UPDATED_EVENT, 
  BADGE_DEFINITIONS 
} from '../utils/streakStorage';
import { hapticTap, hapticSuccess } from '../utils/haptics';
import ShareBrewCardModal from './sharing/ShareBrewCardModal';
import WeeklyDigestModal from './digest/WeeklyDigestModal';

export default function BrewJournal({
  isOpen,
  onClose,
  trackMode,
  activeMethod,
  cupCount,
  cupMl,
  customRatio,
  customWaterMl = null,
  customGrind = null,
  unitSystem,
  onOpenScanner,
  isInline = false,
  onBrewAgain = null,
  currentUser = null
}) {
  const isCoffee = trackMode === 'coffee';
  const isMetric = unitSystem === 'metric';

  // Calculations for auto-filling current parameters in manual add form
  const totalWaterMl = customWaterMl !== null && customWaterMl !== undefined ? customWaterMl : (cupCount * cupMl);
  const ratio = customRatio || activeMethod?.ratio || 15;
  const dryDoseGrams = totalWaterMl / ratio;
  const totalWaterOz = (totalWaterMl / 29.5735).toFixed(1);
  const dryDoseOz = (dryDoseGrams / 28.3495).toFixed(2);

  const defaultWaterStr = isMetric ? `${totalWaterMl} mL` : `${totalWaterOz} fl oz`;
  const defaultDoseStr = isMetric ? `${dryDoseGrams.toFixed(1)} g` : `${dryDoseOz} oz (${dryDoseGrams.toFixed(1)}g)`;
  const defaultTempStr = isMetric ? `${activeMethod?.tempC || 90}°C` : `${activeMethod?.tempF || 194}°F`;

  // Journal State
  const [logs, setLogs] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Multi-Faceted Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [roasterFilter, setRoasterFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all'); // 'all' | '5' | '4' | '3'
  const [tasteFilter, setTasteFilter] = useState('all'); // 'all' | 'balanced' | 'sour' | 'bitter' | 'weak' | 'strong' | 'favorites'
  const [timeFilter, setTimeFilter] = useState('all'); // 'all' | '7days' | '30days'

  // Side-by-Side Comparison State
  const [compareLogPair, setCompareLogPair] = useState(null); // [logA, logB]
  const [activePhotoModal, setActivePhotoModal] = useState(null); // Photo URL for full-screen preview

  // Retention & Social State
  const [streakData, setStreakData] = useState(() => getStreakData());
  const [showWeeklyDigestModal, setShowWeeklyDigestModal] = useState(false);
  const [selectedShareBrew, setSelectedShareBrew] = useState(null);

  // New Log Form State
  const [beanName, setBeanName] = useState('');
  const [roaster, setRoaster] = useState('');
  const [rating, setRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tasteFeedback, setTasteFeedback] = useState('balanced');
  const [tastingNotes, setTastingNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState(null);
  const [isNewEntryPublic, setIsNewEntryPublic] = useState(false);

  // Listen for streak updates
  useEffect(() => {
    const handleStreakUpdate = () => {
      setStreakData(getStreakData());
    };
    window.addEventListener(STREAK_UPDATED_EVENT, handleStreakUpdate);
    window.addEventListener('storage', handleStreakUpdate);
    return () => {
      window.removeEventListener(STREAK_UPDATED_EVENT, handleStreakUpdate);
      window.removeEventListener('storage', handleStreakUpdate);
    };
  }, []);

  // Load logs on mount and handle live session updates
  useEffect(() => {
    setLogs(getJournalLogs());

    // If user is authenticated, sync with Cloud Firestore
    if (currentUser?.uid) {
      setIsSyncing(true);
      syncJournalWithCloud(currentUser.uid).then(syncedLogs => {
        setLogs(syncedLogs);
        setIsSyncing(false);
      }).catch(() => {
        setIsSyncing(false);
      });
    }

    const handleUpdate = (e) => {
      if (e?.detail) setLogs(e.detail);
      else setLogs(getJournalLogs());
    };
    window.addEventListener(JOURNAL_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(JOURNAL_UPDATED_EVENT, handleUpdate);
  }, [currentUser?.uid]);

  // Save logs to localStorage and Firestore
  const saveLogsToStorage = (updatedLogs) => {
    setLogs(updatedLogs);
    saveJournalLogs(updatedLogs, currentUser?.uid || null);
  };

  // Add new manual log entry
  const handleAddLog = (e) => {
    e.preventDefault();
    hapticSuccess();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      timestamp: Date.now(),
      trackMode,
      methodId: activeMethod?.id || (isCoffee ? 'pour_over' : 'tea'),
      methodName: activeMethod?.name || (isCoffee ? 'Pour Over' : 'Green Tea'),
      beanName: beanName.trim() || (isCoffee ? 'Single-Origin Ethiopian Yirgacheffe' : 'Full-Leaf Green Tea'),
      roaster: roaster.trim() || 'Artisan Roaster',
      doseStr: defaultDoseStr,
      waterStr: defaultWaterStr,
      ratioStr: `1 : ${ratio}`,
      grindStr: customGrind || activeMethod?.grind || 'Medium-Fine',
      tempStr: defaultTempStr,
      rating,
      tasteFeedback,
      isFavorite,
      tastingNotes: tastingNotes.trim() ? tastingNotes.split(',').map(s => s.trim()) : ['Sweet & Balanced', 'Silky Body'],
      notes: notes.trim(),
      photoUrl: newPhotoUrl,
      userId: currentUser?.uid || null
    };

    const updated = [newEntry, ...logs];
    saveLogsToStorage(updated);

    // Reset form
    setBeanName('');
    setRoaster('');
    setRating(5);
    setIsFavorite(false);
    setTasteFeedback('balanced');
    setTastingNotes('');
    setNotes('');
    setNewPhotoUrl(null);
    setShowAddForm(false);
  };

  const handleDeleteLog = (id) => {
    hapticTap();
    const updated = logs.filter(l => l.id !== id);
    saveLogsToStorage(updated);
  };

  const handleToggleFavorite = (id) => {
    hapticTap();
    const updated = logs.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l);
    saveLogsToStorage(updated);
  };

  // Compute unique Roasters & Beans for filter dropdowns
  const uniqueRoasters = useMemo(() => {
    const list = Array.from(new Set(logs.map(l => l.roaster).filter(Boolean))).sort();
    return list;
  }, [logs]);

  const uniqueMethods = useMemo(() => {
    const map = new Map();
    logs.forEach(l => {
      if (l.methodId && l.methodName) {
        map.set(l.methodId, l.methodName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [logs]);

  // Multi-Faceted Filtered Logs
  const filteredLogs = useMemo(() => {
    const now = Date.now();
    const cleanSearch = searchQuery.toLowerCase().trim();

    return logs.filter(log => {
      if (!log) return false;

      // 1. Text Search
      if (cleanSearch) {
        const bean = (log.beanName || '').toLowerCase();
        const roasterName = (log.roaster || '').toLowerCase();
        const notesText = (log.notes || '').toLowerCase();
        const tags = Array.isArray(log.tastingNotes) ? log.tastingNotes.join(' ').toLowerCase() : '';
        const searchMatches = bean.includes(cleanSearch) || roasterName.includes(cleanSearch) || notesText.includes(cleanSearch) || tags.includes(cleanSearch);
        if (!searchMatches) return false;
      }

      // 2. Method Filter
      if (methodFilter !== 'all' && log.methodId !== methodFilter) {
        return false;
      }

      // 3. Roaster Filter
      if (roasterFilter !== 'all' && log.roaster !== roasterFilter) {
        return false;
      }

      // 4. Rating Filter
      if (ratingFilter === '5' && log.rating < 5) return false;
      if (ratingFilter === '4' && log.rating < 4) return false;
      if (ratingFilter === '3' && log.rating < 3) return false;

      // 5. Taste / Favorites Filter
      if (tasteFilter === 'favorites' && !log.isFavorite) return false;
      if (tasteFilter === 'balanced' && (log.tasteFeedback !== 'balanced' && log.tasteFeedback !== 'sweet')) return false;
      if (tasteFilter === 'sour' && log.tasteFeedback !== 'sour') return false;
      if (tasteFilter === 'bitter' && log.tasteFeedback !== 'bitter') return false;
      if (tasteFilter === 'weak' && log.tasteFeedback !== 'weak') return false;
      if (tasteFilter === 'strong' && log.tasteFeedback !== 'strong') return false;

      // 6. Time Range Filter
      if (timeFilter === '7days' && log.timestamp && (now - log.timestamp > 7 * 86400 * 1000)) return false;
      if (timeFilter === '30days' && log.timestamp && (now - log.timestamp > 30 * 86400 * 1000)) return false;

      return true;
    });
  }, [logs, searchQuery, methodFilter, roasterFilter, ratingFilter, tasteFilter, timeFilter]);

  // Launch Side-by-Side Comparison between a log and its previous session
  const handleLaunchComparison = (currentLog) => {
    hapticTap();
    const candidates = findPreviousBrewsForLot({
      beanName: currentLog.beanName,
      roaster: currentLog.roaster,
      methodId: currentLog.methodId,
      excludeId: currentLog.id
    });

    if (candidates.length > 0) {
      setCompareLogPair([candidates[0], currentLog]); // [Earlier, Later]
    } else {
      // Pick the next chronological brew in the list for comparison
      const currentIndex = logs.findIndex(l => l.id === currentLog.id);
      const nextLog = logs[currentIndex + 1] || logs[0];
      if (nextLog && nextLog.id !== currentLog.id) {
        setCompareLogPair([nextLog, currentLog]);
      } else {
        alert('No other brew logs found to compare against yet. Brew another cup of this coffee to unlock side-by-side dial-in analytics!');
      }
    }
  };

  // Export logs to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `the_brew_app_journal_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import logs from JSON
  const handleImportLogs = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const existingIds = new Set(logs.map(l => l.id));
          const newEntries = imported.filter(item => item && item.id && !existingIds.has(item.id));
          const merged = [...newEntries, ...logs];
          saveLogsToStorage(merged);
          alert(`Successfully imported ${newEntries.length} brew log(s) into your journal!`);
        } else {
          alert('Invalid file format. Please upload a valid JSON journal backup array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  if (!isOpen && !isInline) return null;

  const content = (
    <div 
      role={isInline ? "region" : "dialog"} 
      aria-modal={!isInline} 
      aria-label="Tasting Journal & Extraction Log" 
      className={`relative max-w-5xl w-full rounded-3xl bg-[#14100D] border border-white/[0.14] p-5 sm:p-7 md:p-9 shadow-2xl text-cream-light ${isInline ? 'my-2' : 'my-8'}`}
    >
      {/* Ambient Top Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/[0.10] gap-4 mb-6">
        <div className="flex items-center space-x-3.5">
          <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-gold border border-amber-400/30">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.15em] text-amber-gold font-extrabold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              <span>Personal Tasting Journal • Dial-In History</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
              Tasting Journal & Brew Log
            </h2>
          </div>
        </div>

        {/* Header Right: Cloud Sync Status & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Cloud Synced'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-stone-400 text-[11px] font-mono">
              <span>Guest Mode (Local)</span>
            </div>
          )}

          <label
            className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white border border-white/[0.12] cursor-pointer flex items-center gap-1 text-xs font-mono transition"
            title="Import JSON backup"
          >
            <Upload className="w-3.5 h-3.5 text-amber-gold" />
            <span className="hidden md:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportLogs} className="hidden" />
          </label>

          {logs.length > 0 && (
            <button
              onClick={handleExportLogs}
              className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-stone-300 hover:text-white border border-white/[0.12] flex items-center gap-1 text-xs font-mono transition"
              title="Export JSON backup"
            >
              <Download className="w-3.5 h-3.5 text-amber-gold" />
              <span className="hidden md:inline">Export</span>
            </button>
          )}

          <button
            type="button"
            id="journal-weekly-digest-btn"
            onClick={() => {
              hapticTap();
              setShowWeeklyDigestModal(true);
            }}
            className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-amber-gold hover:text-white border border-white/[0.12] flex items-center gap-1.5 text-xs font-mono transition cursor-pointer"
            title="Weekly Barista Digest & Insights"
          >
            <Mail className="w-3.5 h-3.5 text-amber-gold" />
            <span className="hidden md:inline">Weekly Digest</span>
          </button>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-2 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel' : 'Log Manual Brew'}</span>
          </button>

          {!isInline && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white border border-white/10 transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Manual Log Add Form (Collapsible) */}
      {showAddForm && (
        <form onSubmit={handleAddLog} className="mb-6 p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 animate-fade-in text-xs font-mono">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-amber-gold font-bold uppercase tracking-wider text-[11px]">
              Record Manual Extraction
            </span>
            <span className="text-[10px] text-stone-400">
              Auto-filled from current method ({activeMethod?.name})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Bean / Single-Origin Lot</label>
              <input
                type="text"
                value={beanName}
                onChange={e => setBeanName(e.target.value)}
                placeholder="e.g. Caffe Choco / 13"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Roaster / Roastery</label>
              <input
                type="text"
                value={roaster}
                onChange={e => setRoaster(e.target.value)}
                placeholder="e.g. Brookmill Coffee Roasters"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Taste Profile Tag</label>
              <select
                value={tasteFeedback}
                onChange={e => setTasteFeedback(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
              >
                <option value="balanced">✨ Balanced (Golden Cup)</option>
                <option value="sour">🍋 Sour / Bright (Under-extracted)</option>
                <option value="bitter">🪵 Bitter / Dry (Over-extracted)</option>
                <option value="weak">💧 Weak / Hollow (Under-dosed)</option>
                <option value="strong">⚡ Strong / Heavy (Over-concentrated)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] text-stone-400 block mb-1">Tasting Notes (comma-separated)</label>
              <input
                type="text"
                value={tastingNotes}
                onChange={e => setTastingNotes(e.target.value)}
                placeholder="e.g. Milk Chocolate, Peach, Jasmine"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
              />
            </div>
            <div>
              <label className="text-[10px] text-stone-400 block mb-1">Cup Rating (1–5 Stars)</label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map(starVal => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setRating(starVal)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-5 h-5 ${starVal <= rating ? 'text-amber-400 fill-amber-400' : 'text-stone-600'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsNewEntryPublic(!isNewEntryPublic)}
                className={`py-1.5 px-3 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  isNewEntryPublic
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10'
                }`}
              >
                {isNewEntryPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{isNewEntryPublic ? 'Public Community' : 'Private Personal'}</span>
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl btn-tactile-amber text-espresso-950 font-bold"
              >
                Save to Journal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Daily Brew Streak & Barista Achievements Banner */}
      <div 
        id="journal-streak-banner"
        className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#1A120D] via-[#221811] to-[#150E09] border border-amber-500/30 shadow-md space-y-3 mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-gold flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-amber-gold">
                  Retention &amp; Streaks
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                  {streakData.currentStreak || 0}-Day Streak
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-light leading-tight">
                {streakData.currentStreak >= 3 ? '🔥 Barista Consistency Master' : 'Specialty Brew Streaks'}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-stone-300">
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[9px] text-stone-400 uppercase block">Current</span>
              <span className="font-bold text-amber-gold">{streakData.currentStreak || 0}d</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[9px] text-stone-400 uppercase block">Best</span>
              <span className="font-bold text-cream-light">{streakData.maxStreak || 0}d</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[9px] text-stone-400 uppercase block">Total</span>
              <span className="font-bold text-amber-gold">{streakData.totalBrews || logs.length}</span>
            </div>
          </div>
        </div>

        {/* Badges Carousel / Pills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
            Barista Achievements ({streakData.unlockedBadges?.length || 0}/{BADGE_DEFINITIONS.length} unlocked):
          </span>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {BADGE_DEFINITIONS.map((badge) => {
              const isUnlocked = streakData.unlockedBadges?.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  data-badge-id={badge.id}
                  data-unlocked={Boolean(isUnlocked)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-mono transition ${
                    isUnlocked
                      ? badge.tier === 'gold'
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-xs'
                        : badge.tier === 'silver'
                        ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                        : 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                      : 'bg-black/30 text-stone-500 border-white/5 opacity-60'
                  }`}
                  title={`${badge.title}: ${badge.description} (${isUnlocked ? 'Unlocked' : 'Locked'})`}
                >
                  <span className="text-sm">{badge.icon}</span>
                  <span className="font-bold text-[11px]">{badge.title}</span>
                  {isUnlocked ? (
                    <span className="text-[9px] text-amber-400 font-extrabold">✓</span>
                  ) : (
                    <span className="text-[9px] text-stone-600">🔒</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Multi-Faceted Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] space-y-3 mb-6">
        {/* Row 1: Search Bar & Primary Taste Chips */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by bean name, roaster, or flavor note..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs font-mono placeholder-stone-500 focus:outline-none focus:border-amber-gold"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Taste Tag Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-mono">
            {[
              { id: 'all', label: 'All Brews' },
              { id: 'favorites', label: '★ Favorites' },
              { id: 'balanced', label: '✨ Balanced' },
              { id: 'sour', label: '🍋 Sour' },
              { id: 'bitter', label: '🪵 Bitter' },
              { id: 'weak', label: '💧 Weak' },
              { id: 'strong', label: '⚡ Strong' }
            ].map(filterItem => (
              <button
                key={filterItem.id}
                type="button"
                onClick={() => { hapticTap(); setTasteFilter(filterItem.id); }}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition cursor-pointer ${
                  tasteFilter === filterItem.id
                    ? 'bg-amber-500/25 border-amber-400 text-amber-200 font-bold'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-white'
                }`}
              >
                {filterItem.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters (Method, Roaster, Rating, Time) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono text-stone-300">
          {/* Method Filter */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-0.5">Brew Method</label>
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs focus:outline-none focus:border-amber-gold"
            >
              <option value="all">All Methods</option>
              {uniqueMethods.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          {/* Roaster Filter */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-0.5">Roaster / Brand</label>
            <select
              value={roasterFilter}
              onChange={e => setRoasterFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs focus:outline-none focus:border-amber-gold"
            >
              <option value="all">All Roasters</option>
              {uniqueRoasters.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-0.5">Min Rating</label>
            <select
              value={ratingFilter}
              onChange={e => setRatingFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs focus:outline-none focus:border-amber-gold"
            >
              <option value="all">All Ratings</option>
              <option value="5">5★ Golden Cup Only</option>
              <option value="4">4★ & Up</option>
              <option value="3">3★ & Up</option>
            </select>
          </div>

          {/* Time Filter */}
          <div>
            <label className="text-[10px] text-stone-400 block mb-0.5">Time Range</label>
            <select
              value={timeFilter}
              onChange={e => setTimeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-cream-light text-xs focus:outline-none focus:border-amber-gold"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Journal Statistics Header */}
      <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-4 px-1">
        <span>Showing <strong>{filteredLogs.length}</strong> of {logs.length} logged extractions</span>
        {(searchQuery || methodFilter !== 'all' || roasterFilter !== 'all' || ratingFilter !== 'all' || tasteFilter !== 'all' || timeFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setMethodFilter('all');
              setRoasterFilter('all');
              setRatingFilter('all');
              setTasteFilter('all');
              setTimeFilter('all');
            }}
            className="text-amber-gold hover:underline text-[11px] cursor-pointer"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Log Entries Grid */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-black/30 border border-white/10 text-center space-y-3">
          <Coffee className="w-10 h-10 text-stone-500 mx-auto" />
          <h4 className="font-serif text-lg text-stone-300">No extractions match your filters</h4>
          <p className="text-xs font-mono text-stone-400 max-w-sm mx-auto">
            Try adjusting your search criteria or record your first guided brew session above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLogs.map(log => {
            const hasPhoto = Boolean(log.photoUrl);
            const tasteBadgeColor = 
              log.tasteFeedback === 'balanced' || log.tasteFeedback === 'sweet'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : log.tasteFeedback === 'sour'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : log.tasteFeedback === 'bitter'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                : log.tasteFeedback === 'weak'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

            return (
              <div 
                key={log.id}
                className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all space-y-3 flex flex-col justify-between"
              >
                {/* Card Top: Roaster, Bean, Rating, Favorite */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-amber-gold font-bold uppercase tracking-wider block">
                        {log.roaster || 'Specialty Roastery'}
                      </span>
                      <h4 className="font-serif text-base font-bold text-cream-light leading-snug">
                        {log.beanName || 'Artisan Single-Origin'}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(log.id)}
                      className="p-1 text-stone-400 hover:text-rose-400 transition cursor-pointer"
                      title={log.isFavorite ? "Favorited" : "Mark as Favorite"}
                    >
                      <Heart className={`w-4 h-4 ${log.isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Extraction Metrics Row */}
                  <div className="grid grid-cols-4 gap-1.5 py-2 mt-2 border-y border-white/[0.08] text-[11px] font-mono text-center">
                    <div className="bg-white/[0.03] p-1.5 rounded-lg">
                      <span className="text-[9px] text-stone-400 block uppercase">Ratio</span>
                      <strong className="text-amber-gold">{log.ratioStr || `1:${log.ratio || 16}`}</strong>
                    </div>
                    <div className="bg-white/[0.03] p-1.5 rounded-lg">
                      <span className="text-[9px] text-stone-400 block uppercase">Dose</span>
                      <strong className="text-cream-light">{log.doseStr || `${log.doseGrams || 18}g`}</strong>
                    </div>
                    <div className="bg-white/[0.03] p-1.5 rounded-lg">
                      <span className="text-[9px] text-stone-400 block uppercase">Grind</span>
                      <strong className="text-stone-300 truncate block">{log.grindStr || 'Med-Fine'}</strong>
                    </div>
                    <div className="bg-white/[0.03] p-1.5 rounded-lg">
                      <span className="text-[9px] text-stone-400 block uppercase">Time</span>
                      <strong className="text-cream-light">{log.durationFormatted || '3:00'}</strong>
                    </div>
                  </div>

                  {/* Taste Tag & Star Rating & Public/Private Indicator */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          hapticTap();
                          toggleEntryPublicStatus(log.id);
                          setLogs(getJournalLogs());
                        }}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border transition cursor-pointer ${
                          log.isPublic
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-white/5 text-stone-400 border-white/10 hover:bg-white/10'
                        }`}
                        title={log.isPublic ? "Public Community Brew — Click to make private" : "Private Personal Brew — Click to make public"}
                      >
                        {log.isPublic ? <Globe className="w-3 h-3 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-gold" />}
                        <span>{log.isPublic ? 'Public' : 'Private'}</span>
                      </button>

                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border ${tasteBadgeColor}`}>
                        {log.tasteFeedback === 'balanced' || log.tasteFeedback === 'sweet' ? '✨ Balanced' :
                         log.tasteFeedback === 'sour' ? '🍋 Sour' :
                         log.tasteFeedback === 'bitter' ? '🪵 Bitter' :
                         log.tasteFeedback === 'weak' ? '💧 Weak' :
                         log.tasteFeedback === 'strong' ? '⚡ Strong' : 'Logged'}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${s <= (log.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-stone-700'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Notes / Remedy / Photo */}
                  <div className="space-y-2 pt-2">
                    {log.notes && (
                      <p className="text-xs text-stone-300 font-sans italic line-clamp-2">
                        "{log.notes}"
                      </p>
                    )}

                    {hasPhoto && (
                      <div className="flex items-center gap-2 pt-1">
                        <img 
                          src={log.photoUrl} 
                          alt="Brew thumbnail" 
                          onClick={() => setActivePhotoModal(log.photoUrl)}
                          className="w-14 h-14 object-cover rounded-xl border border-white/20 cursor-pointer hover:scale-105 transition" 
                          title="Click to enlarge"
                        />
                        <span className="text-[10px] font-mono text-stone-400">
                          Tap photo to enlarge
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-stone-500">{log.date}</span>

                  <div className="flex items-center gap-2">
                    {/* Share Card Button */}
                    <button
                      type="button"
                      onClick={() => {
                        hapticTap();
                        setSelectedShareBrew(log);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-cream-light border border-white/10 text-[11px] font-mono transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Share luxury brew card image & link"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-gold" />
                      <span>Share</span>
                    </button>

                    {/* Compare with Previous Brew Button */}
                    <button
                      type="button"
                      onClick={() => handleLaunchComparison(log)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 hover:text-cream-light border border-white/10 text-[11px] font-mono transition flex items-center gap-1"
                      title="Compare side-by-side with previous brew of this coffee"
                    >
                      <History className="w-3.5 h-3.5 text-amber-gold" />
                      <span>Compare</span>
                    </button>

                    {/* Brew Again Button */}
                    {onBrewAgain && (
                      <button
                        type="button"
                        onClick={() => onBrewAgain(log)}
                        className="px-3 py-1.5 rounded-lg btn-tactile-amber text-espresso-950 text-[11px] font-bold font-mono transition flex items-center gap-1 active:scale-95"
                        title="Load this recipe into guided timer"
                      >
                        <Coffee className="w-3.5 h-3.5" />
                        <span>Brew Again</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1.5 text-stone-500 hover:text-rose-400 transition"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Comparison Modal */}
      {compareLogPair && (
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-[#14100D] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-5 text-cream-light animate-scale-up">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-gold" />
                <h3 className="font-serif text-lg font-bold text-cream-light">
                  Side-by-Side Brew Evolution
                </h3>
              </div>
              <button 
                onClick={() => setCompareLogPair(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono text-xs">
              {/* Column 1: Earlier Session */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-[10px] text-stone-400 font-bold uppercase block">
                    Session 1 (Earlier)
                  </span>
                  <strong className="text-cream-light text-sm font-serif block truncate">
                    {compareLogPair[0].beanName}
                  </strong>
                  <span className="text-[10px] text-stone-400">{compareLogPair[0].date}</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span>Method:</span><strong>{compareLogPair[0].methodName}</strong></div>
                  <div className="flex justify-between"><span>Ratio:</span><strong className="text-amber-gold">{compareLogPair[0].ratioStr || `1:${compareLogPair[0].ratio || 16}`}</strong></div>
                  <div className="flex justify-between"><span>Dose / Water:</span><strong>{compareLogPair[0].doseStr} • {compareLogPair[0].waterStr}</strong></div>
                  <div className="flex justify-between"><span>Grind:</span><strong className="text-stone-300">{compareLogPair[0].grindStr}</strong></div>
                  <div className="flex justify-between"><span>Water Temp:</span><strong>{compareLogPair[0].tempStr}</strong></div>
                  <div className="flex justify-between"><span>Drawdown:</span><strong>{compareLogPair[0].durationFormatted || '3:00'}</strong></div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span>Taste:</span>
                    <strong className="text-amber-300">{compareLogPair[0].tasteFeedback || 'Logged'} ({compareLogPair[0].rating || 3}★)</strong>
                  </div>
                </div>

                {compareLogPair[0].notes && (
                  <p className="text-[11px] font-sans italic text-stone-400 border-t border-white/10 pt-2 line-clamp-2">
                    "{compareLogPair[0].notes}"
                  </p>
                )}
              </div>

              {/* Column 2: Current / Later Session */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="border-b border-white/10 pb-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">
                    Session 2 (Later / Current)
                  </span>
                  <strong className="text-cream-light text-sm font-serif block truncate">
                    {compareLogPair[1].beanName}
                  </strong>
                  <span className="text-[10px] text-stone-400">{compareLogPair[1].date}</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span>Method:</span><strong>{compareLogPair[1].methodName}</strong></div>
                  <div className="flex justify-between"><span>Ratio:</span><strong className="text-amber-gold">{compareLogPair[1].ratioStr || `1:${compareLogPair[1].ratio || 16}`}</strong></div>
                  <div className="flex justify-between"><span>Dose / Water:</span><strong>{compareLogPair[1].doseStr} • {compareLogPair[1].waterStr}</strong></div>
                  <div className="flex justify-between"><span>Grind:</span><strong className="text-cream-light">{compareLogPair[1].grindStr}</strong></div>
                  <div className="flex justify-between"><span>Water Temp:</span><strong>{compareLogPair[1].tempStr}</strong></div>
                  <div className="flex justify-between"><span>Drawdown:</span><strong>{compareLogPair[1].durationFormatted || '3:00'}</strong></div>
                  <div className="flex justify-between pt-1 border-t border-white/10">
                    <span>Taste:</span>
                    <strong className="text-emerald-300">{compareLogPair[1].tasteFeedback || 'Logged'} ({compareLogPair[1].rating || 5}★)</strong>
                  </div>
                </div>

                {compareLogPair[1].notes && (
                  <p className="text-[11px] font-sans italic text-stone-300 border-t border-white/10 pt-2 line-clamp-2">
                    "{compareLogPair[1].notes}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCompareLogPair(null)}
                className="px-5 py-2 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-xs"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Full-Screen Lightbox */}
      {activePhotoModal && (
        <div 
          onClick={() => setActivePhotoModal(null)}
          className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-md w-full" onClick={e => e.stopPropagation()}>
            <img 
              src={activePhotoModal} 
              alt="Enlarged cup photo" 
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-white/20 shadow-2xl" 
            />
            <button
              onClick={() => setActivePhotoModal(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white border border-white/20 hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Shareable Brew Card Modal */}
      <ShareBrewCardModal
        isOpen={Boolean(selectedShareBrew)}
        onClose={() => setSelectedShareBrew(null)}
        brew={selectedShareBrew}
      />

      {/* Weekly Barista Digest Modal */}
      <WeeklyDigestModal
        isOpen={showWeeklyDigestModal}
        onClose={() => setShowWeeklyDigestModal(false)}
        currentUser={currentUser}
      />

    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      {content}
    </div>
  );
}
