import React, { useState, useEffect } from 'react';
import { BookOpen, Star, Sparkles, Plus, Trash2, X, Filter, Heart, Coffee, Leaf, Scale, Gauge, Thermometer, Calendar, Award, Download, Upload, ScanLine } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'the_brew_app_journal_v1';

export default function BrewJournal({
  isOpen,
  onClose,
  trackMode,
  activeMethod,
  cupCount,
  cupMl,
  customRatio,
  unitSystem,
  onOpenScanner
}) {
  const isCoffee = trackMode === 'coffee';
  const isMetric = unitSystem === 'metric';

  // Calculations for auto-filling current parameters
  const totalWaterMl = cupCount * cupMl;
  const ratio = customRatio || activeMethod?.ratio || 15;
  const dryDoseGrams = totalWaterMl / ratio;
  const totalWaterOz = (totalWaterMl / 29.5735).toFixed(1);
  const dryDoseOz = (dryDoseGrams / 28.3495).toFixed(2);

  const defaultWaterStr = isMetric ? `${totalWaterMl} mL` : `${totalWaterOz} fl oz`;
  const defaultDoseStr = isMetric ? `${dryDoseGrams.toFixed(1)} g` : `${dryDoseOz} oz (${dryDoseGrams.toFixed(1)}g)`;
  const defaultTempStr = isMetric ? `${activeMethod?.tempC || 90}°C` : `${activeMethod?.tempF || 194}°F`;

  // Journal State
  const [logs, setLogs] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'favorites' | 'coffee' | 'tea'
  const [showAddForm, setShowAddForm] = useState(false);

  // New Log Form State
  const [beanName, setBeanName] = useState('');
  const [roaster, setRoaster] = useState('');
  const [rating, setRating] = useState(5);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tastingNotes, setTastingNotes] = useState('');
  const [notes, setNotes] = useState('');

  // Load logs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setLogs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load brew logs from localStorage', e);
    }
  }, []);

  // Save logs to localStorage whenever logs change
  const saveLogsToStorage = (updatedLogs) => {
    setLogs(updatedLogs);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (e) {
      console.error('Failed to save brew logs to localStorage', e);
    }
  };

  // Add new log entry
  const handleAddLog = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      trackMode,
      methodName: activeMethod?.name || (isCoffee ? 'Pour Over' : 'Green Tea'),
      beanName: beanName.trim() || (isCoffee ? 'Single-Origin Ethiopian Yirgacheffe' : 'Full-Leaf Dragonwell Green Tea'),
      roaster: roaster.trim() || 'Artisan Roaster',
      doseStr: defaultDoseStr,
      waterStr: defaultWaterStr,
      ratioStr: `1 : ${ratio}`,
      grindStr: activeMethod?.grind || 'Medium-Fine',
      tempStr: defaultTempStr,
      rating,
      isFavorite,
      tastingNotes: tastingNotes.trim() ? tastingNotes.split(',').map(s => s.trim()) : ['Jasmine', 'Citrus', 'Silky Body'],
      notes: notes.trim()
    };

    const updated = [newEntry, ...logs];
    saveLogsToStorage(updated);

    // Reset form state
    setBeanName('');
    setRoaster('');
    setRating(5);
    setIsFavorite(false);
    setTastingNotes('');
    setNotes('');
    setShowAddForm(false);
  };

  // Delete log entry
  const handleDeleteLog = (id) => {
    const updated = logs.filter(l => l.id !== id);
    saveLogsToStorage(updated);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id) => {
    const updated = logs.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l);
    saveLogsToStorage(updated);
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

  // Import / Restore logs from JSON
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
        alert('Failed to parse JSON file. Please ensure the backup file is valid.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  // Filtered Logs
  const filteredLogs = logs.filter(log => {
    if (activeFilter === 'favorites') return log.isFavorite;
    if (activeFilter === 'coffee') return log.trackMode === 'coffee';
    if (activeFilter === 'tea') return log.trackMode === 'tea';
    return true;
  });

  // Calculate statistics
  const totalLogs = logs.length;
  const favoriteCount = logs.filter(l => l.isFavorite).length;
  const avgRating = totalLogs > 0 ? (logs.reduce((acc, l) => acc + l.rating, 0) / totalLogs).toFixed(1) : '5.0';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      
      {/* Main Dialog Panel */}
      <div className="relative max-w-4xl w-full rounded-3xl bg-[#120F0D] border border-white/[0.12] p-6 md:p-9 shadow-2xl overflow-hidden my-8">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <div className="flex items-center space-x-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-500/20 text-amber-gold border border-amber-400/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.15em] text-amber-gold font-extrabold mb-0.5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>On-Device Private Journal • 100% Offline • Zero Tracking</span>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-cream-light">
                The Brew App Journal
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Import / Restore Journal Backup */}
            <label
              className="p-2.5 rounded-2xl bg-white/[0.08] text-stone-300 hover:text-cream-light hover:bg-white/[0.15] transition-all border border-white/[0.12] cursor-pointer flex items-center gap-1.5 text-xs font-mono"
              title="Import & Restore Journal from JSON backup"
            >
              <Upload className="w-4 h-4 text-amber-gold" />
              <span className="hidden sm:inline">Import Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportLogs}
                className="hidden"
              />
            </label>

            {/* Export Journal Backup */}
            {logs.length > 0 && (
              <button
                onClick={handleExportLogs}
                className="p-2.5 rounded-2xl bg-white/[0.08] text-stone-300 hover:text-cream-light hover:bg-white/[0.15] transition-all border border-white/[0.12] flex items-center gap-1.5 text-xs font-mono"
                title="Export Journal to JSON backup"
              >
                <Download className="w-4 h-4 text-amber-gold" />
                <span className="hidden sm:inline">Export</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-white/[0.08] text-stone-300 hover:text-amber-gold hover:bg-white/[0.15] transition-all border border-white/[0.12]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 bg-[#1A1613] p-4 md:p-5 rounded-2xl border border-white/[0.08] text-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-1">Total Brews</div>
            <div className="text-xl md:text-2xl font-extrabold font-mono text-cream-light">{totalLogs}</div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-gold mb-1 flex items-center justify-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Golden Cups</span>
            </div>
            <div className="text-xl md:text-2xl font-extrabold font-mono text-amber-gold">{favoriteCount}</div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-stone-400 mb-1">Avg Score</div>
            <div className="text-xl md:text-2xl font-extrabold font-mono text-amber-bright flex items-center justify-center gap-1">
              <span>{avgRating}</span>
              <Star className="w-4 h-4 fill-current text-amber-gold" />
            </div>
          </div>
        </div>

        {/* Log Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 bg-black/40 p-1.5 rounded-2xl border border-white/[0.08] overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-amber-gold text-espresso-950 font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              All ({logs.length})
            </button>

            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                activeFilter === 'favorites'
                  ? 'bg-amber-gold text-espresso-950 font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-amber-400" />
              <span>Golden Cups ({favoriteCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('coffee')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'coffee'
                  ? 'btn-tactile-coffee text-[#140C08] font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Coffee ({logs.filter(l => l.trackMode === 'coffee').length})</span>
            </button>

            <button
              onClick={() => setActiveFilter('tea')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === 'tea'
                  ? 'btn-tactile-tea text-white font-extrabold shadow-md'
                  : 'text-stone-400 hover:text-cream-light'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Tea ({logs.filter(l => l.trackMode === 'tea').length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto py-3 px-6 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel Entry' : 'Log Current Brew'}</span>
          </button>

        </div>

        {/* Add New Log Form */}
        {showAddForm && (
          <form onSubmit={handleAddLog} className="mb-8 p-6 md:p-7 rounded-3xl bg-[#181412] border border-amber-gold/40 shadow-2xl animate-fade-in space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-serif text-xl font-bold text-cream-light flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-gold" />
                <span>Log Recipe: {activeMethod?.name}</span>
              </h3>
              <div className="flex items-center gap-2">
                {onOpenScanner && (
                  <button
                    type="button"
                    onClick={onOpenScanner}
                    className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-gold border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 shadow"
                    title="Scan bag barcode or QR code to auto-fill"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    <span>Scan Bag Barcode</span>
                  </button>
                )}
                <span className="text-xs font-mono font-bold text-amber-gold bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/30">
                  {defaultDoseStr} • {defaultWaterStr}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1.5">
                  Bean / Tea Name:
                </label>
                <input
                  type="text"
                  placeholder={isCoffee ? "e.g. Ethiopia Yirgacheffe Worka Sakaro" : "e.g. Darjeeling First Flush Muscatel"}
                  value={beanName}
                  onChange={(e) => setBeanName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-cream-light focus:border-amber-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1.5">
                  Roaster / Origin Brand:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Onyx Coffee Lab / Stumptown"
                  value={roaster}
                  onChange={(e) => setRoaster(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-cream-light focus:border-amber-gold outline-none"
                />
              </div>
            </div>

            {/* Rating & Golden Cup Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/[0.08]">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase font-bold text-stone-300 mr-2">Rating Score:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-gold text-amber-gold' : 'text-stone-600'}`} />
                  </button>
                ))}
              </div>

              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-gold cursor-pointer"
                />
                <span className="text-xs font-bold text-amber-gold flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>Mark as Golden Cup (Best Cup ⭐)</span>
                </span>
              </label>
            </div>

            {/* Tasting Notes & Custom Feedback */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1.5">
                  Tasting Notes (comma separated):
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jasmine Floral, Meyer Lemon, Bergamot, Honey"
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-cream-light focus:border-amber-gold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-300 font-bold mb-1.5">
                  Brew Notes & Technique Observations:
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. 45s bloom with 90g pour. Excellent clarity, subtle citric brightness and zero bitterness."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/[0.12] text-xs text-cream-light focus:border-amber-gold outline-none resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all"
            >
              Save to Journal
            </button>

          </form>
        )}

        {/* Logs List Container */}
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-black/40 border border-white/[0.08]">
              <BookOpen className="w-10 h-10 text-stone-600 mx-auto mb-3" />
              <h4 className="font-serif text-lg font-bold text-cream-light mb-1">No Brew Logs Saved Yet</h4>
              <p className="text-xs text-stone-400 max-w-sm mx-auto mb-4">
                Click "Log Current Brew" above to record your favorite coffee and tea recipes, tasting notes, and golden cup ratings!
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="py-2.5 px-6 rounded-xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase"
              >
                Log Your First Cup
              </button>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-5 md:p-6 rounded-2xl border transition-all relative group ${
                  log.isFavorite
                    ? 'bg-amber-500/10 border-amber-400/40 text-cream-light shadow-[0_0_20px_rgba(212,140,70,0.15)]'
                    : 'bg-[#161311] border-white/[0.08] text-stone-300 hover:bg-[#1D1916]'
                }`}
              >
                {/* Entry Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center space-x-2.5 mb-1">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white/[0.08] text-amber-gold border border-white/[0.12]">
                        {log.methodName}
                      </span>
                      {log.isFavorite && (
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-gold border border-amber-400/40 font-bold flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>Golden Cup</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {log.date}
                      </span>
                    </div>

                    <h4 className="font-serif text-xl font-bold text-cream-light drop-shadow">
                      {log.beanName}
                    </h4>
                    <p className="text-xs text-stone-400 font-medium">{log.roaster}</p>
                  </div>

                  {/* Rating & Actions */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-0.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/[0.08]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= log.rating ? 'fill-amber-gold text-amber-gold' : 'text-stone-700'}`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleToggleFavorite(log.id)}
                      className={`p-2 rounded-xl transition-all border ${
                        log.isFavorite
                          ? 'bg-amber-gold text-espresso-950 border-amber-gold'
                          : 'bg-black/40 text-stone-400 border-white/[0.08] hover:text-amber-gold'
                      }`}
                      title={log.isFavorite ? 'Remove Golden Cup' : 'Mark as Golden Cup'}
                    >
                      <Heart className={`w-4 h-4 ${log.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-2 rounded-xl bg-black/40 text-stone-500 hover:text-red-400 hover:border-red-500/40 transition-all border border-white/[0.08]"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Recipe Specs Line */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2.5 my-3 border-y border-white/[0.06] text-[11px] font-mono">
                  <div>
                    <span className="text-stone-500">Dose: </span>
                    <strong className="text-cream-light">{log.doseStr}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Water: </span>
                    <strong className="text-cyan-300">{log.waterStr}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Ratio: </span>
                    <strong className="text-amber-gold">{log.ratioStr}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500">Grind: </span>
                    <strong className="text-cream-light">{log.grindStr}</strong>
                  </div>
                </div>

                {/* Tasting Notes Tags */}
                {log.tastingNotes && log.tastingNotes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {log.tastingNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-black/40 text-[10px] font-mono text-stone-300 border border-white/[0.08]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}

                {/* Custom Notes */}
                {log.notes && (
                  <p className="text-xs text-stone-300 italic mt-2 bg-black/30 p-2.5 rounded-xl border border-white/[0.04]">
                    "{log.notes}"
                  </p>
                )}

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
