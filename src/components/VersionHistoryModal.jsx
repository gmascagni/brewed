import React, { useEffect, useState } from 'react';
import { VERSION_HISTORY, CURRENT_VERSION } from '../data/versionHistory';

export default function VersionHistoryModal({ isOpen, onClose }) {
  const [activeBuildInfo, setActiveBuildInfo] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/version.json')
        .then(res => res.json())
        .then(data => setActiveBuildInfo(data))
        .catch(() => setActiveBuildInfo(null));
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-lg font-black text-white shadow-lg shadow-amber-500/20">
              🏷️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">Version Control & Build History</h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  v{CURRENT_VERSION.version}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tracked releases, feature notes, and disaster recovery snapshots
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-lg leading-none cursor-pointer"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Build Health & Disaster Recovery Banner */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-200">Production Build Status: Verified Clean</span>
            </div>
            {activeBuildInfo && (
              <p className="text-slate-400 font-mono text-[11px]">
                Commit: <strong className="text-slate-300">{activeBuildInfo.commit}</strong> • Branch: <span className="text-indigo-400">{activeBuildInfo.branch}</span> • Built: {new Date(activeBuildInfo.buildDate).toLocaleString()}
              </p>
            )}
          </div>
          <a
            href="http://127.0.0.1:8000/backups"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 font-semibold transition flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>💾</span>
            <span>Backups & Rollback Hub ↗</span>
          </a>
        </div>

        {/* Release Timeline */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {VERSION_HISTORY.map((rel, idx) => (
            <div
              key={rel.version}
              className={`p-5 rounded-2xl border ${
                idx === 0
                  ? 'bg-slate-800/60 border-amber-500/40 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/20'
                  : 'bg-slate-850/60 border-slate-800'
              }`}
            >
              {/* Release Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-xs ${
                    idx === 0
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    v{rel.version}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-white">{rel.title}</h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{rel.releaseDate}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {rel.summary}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2">
                {rel.highlights.map((h, hIdx) => {
                  let badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
                  if (h.type === 'fix') badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
                  if (h.type === 'enhancement') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                  return (
                    <div
                      key={hIdx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-start gap-2.5 text-xs"
                    >
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold border ${badgeColor} shrink-0 mt-0.5`}>
                        {h.badge}
                      </span>
                      <div>
                        <strong className="text-slate-100 font-semibold">{h.title}</strong>
                        <p className="text-slate-400 mt-0.5 leading-normal">{h.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>The Brew App Build Infrastructure</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
