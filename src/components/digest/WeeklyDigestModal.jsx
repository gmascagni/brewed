import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Bell,
  Sparkles,
  Flame,
  Coffee,
  CheckCircle2,
  Calendar,
  Send,
  Award,
  ArrowRight
} from 'lucide-react';
import { 
  getDigestPreferences, 
  saveDigestPreferences, 
  generateWeeklyDigestSummary 
} from '../../utils/weeklyDigestStorage';
import { hapticTap, hapticSuccess } from '../../utils/haptics';

export default function WeeklyDigestModal({
  isOpen,
  onClose,
  currentUser = null
}) {
  if (!isOpen) return null;

  const [prefs, setPrefs] = useState(() => getDigestPreferences());
  const [emailInput, setEmailInput] = useState(currentUser?.email || prefs.email || '');
  const [receivePush, setReceivePush] = useState(prefs.receivePush || false);
  const [isSubscribed, setIsSubscribed] = useState(prefs.isSubscribed || false);
  const [sentSimulation, setSentSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'settings'

  const digestData = generateWeeklyDigestSummary(currentUser);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    hapticSuccess();
    const updated = saveDigestPreferences({
      isSubscribed: true,
      email: emailInput.trim(),
      receivePush
    });
    setPrefs(updated);
    setIsSubscribed(true);
    setSentSimulation(true);
    setTimeout(() => setSentSimulation(false), 3500);
  };

  const handleSendSample = () => {
    hapticSuccess();
    setSentSimulation(true);
    setTimeout(() => setSentSimulation(false), 3500);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-xl bg-[#140F0D] border border-amber-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-slide-up text-cream-light"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-gold flex items-center justify-center border border-amber-500/30">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                  Retention &amp; Insights
                </span>
                <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  Weekly Dispatch
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-cream-light">
                Weekly Barista Digest
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white transition cursor-pointer"
            title="Close digest modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-white/10 flex items-center gap-2 bg-[#100B09]">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-[#1C1410] text-amber-gold border-t border-x border-amber-gold/40'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>Preview This Week's Digest</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1C1410] text-amber-gold border-t border-x border-amber-gold/40'
                : 'text-cream-soft hover:text-white'
            }`}
          >
            <span>Delivery Preferences</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-left">
          
          {sentSimulation && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2.5 animate-bounce-short">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Weekly digest dispatched to <strong>{emailInput || 'your inbox'}</strong>!</span>
            </div>
          )}

          {activeTab === 'preview' ? (
            /* PREVIEW DIGEST CARD */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#1C1510] to-[#110B08] border border-white/10 space-y-4 shadow-lg">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-bold text-cream-light">
                      TheBrew.App Sunday Briefing
                    </span>
                    <span className="text-[10px] font-mono text-amber-gold">
                      • {digestData.weekRange}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-gold" />
                    <span>{digestData.currentStreak}-Day Streak</span>
                  </div>
                </div>

                {/* KPI Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs font-mono">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Brews Logged</span>
                    <span className="text-xl font-bold text-cream-light mt-0.5 block">{digestData.totalBrewsThisWeek}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Top Method</span>
                    <span className="text-sm font-bold text-amber-gold mt-1 block truncate">{digestData.topMethod}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-cream-soft/60 uppercase block">Top Roastery</span>
                    <span className="text-sm font-bold text-cream-light mt-1 block truncate">{digestData.favoriteRoaster}</span>
                  </div>
                </div>

                {/* Try This Method Next */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-gold font-mono text-xs font-bold uppercase">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Method Recommendation for Next Week</span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-cream-light">
                    {digestData.suggestedMethod.name}
                  </h4>
                  <p className="text-xs text-cream-soft leading-relaxed">
                    {digestData.suggestedMethod.reason}. Recommended for your current coffee inventory to expand your palate.
                  </p>
                </div>

                {/* Roaster Drops */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono text-cream-soft/70 uppercase">
                    What's New in The Marketplace
                  </span>
                  <div className="text-xs text-stone-300 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>• Methodical Coffee: New Colombia Pink Bourbon Lot</span>
                      <span className="text-amber-gold font-mono text-[10px] font-bold">New Drop</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Onyx Coffee Lab: Fresh Tropical Weather Roasts</span>
                      <span className="text-amber-gold font-mono text-[10px] font-bold">New Drop</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSendSample}
                  className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-cream-light text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-amber-gold" />
                  <span>Send Sample to {emailInput || 'Email'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* SETTINGS FORM */
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-cream-soft/70 font-mono text-xs uppercase block mb-1">
                  Subscriber Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your-email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-cream-light text-xs font-mono focus:outline-none focus:border-amber-gold"
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={true}
                    readOnly
                    className="w-4 h-4 rounded text-amber-gold accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-cream-light">Sunday Morning Email Briefing</div>
                    <div className="text-[11px] text-cream-soft/70">Weekly brew stats, next-method suggestions, and new roaster drops.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={receivePush}
                    onChange={(e) => setReceivePush(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-gold accent-amber-500"
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-cream-light">Device Push Notifications</div>
                    <div className="text-[11px] text-cream-soft/70">Gentle reminders to maintain your dial-in streak and when followed roasters drop new lots.</div>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Digest Preferences</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
