import React from 'react';
import { Plus } from 'lucide-react';
import RoasterVideoPlayer from '../RoasterVideoPlayer';

export default function RoasterVideoTab({
  isRoasterAuthenticated,
  onOpenAuth,
  setActiveTab
}) {
  const handleStartOnboarding = () => {
    if (!isRoasterAuthenticated && onOpenAuth) {
      onOpenAuth({ role: 'roaster', mode: 'signup' });
    } else {
      setActiveTab('onboard');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
        <div className="space-y-1">
          <h3 className="font-serif text-lg font-bold text-cream-light">
            The Smart Bag Journey (End-to-End Walkthrough)
          </h3>
          <p className="text-xs text-cream-soft">
            Watch the 4-step workflow: thermal printing the QR sticker, affixing to retail packaging, customer optical scan, and instant dial-in recipe load.
          </p>
        </div>
        <button
          onClick={handleStartOnboarding}
          className="px-4 py-2 rounded-xl bg-amber-gold hover:bg-amber-300 text-espresso-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>2. Start Onboarding Recipe</span>
        </button>
      </div>

      <RoasterVideoPlayer
        onStartOnboarding={handleStartOnboarding}
      />
    </div>
  );
}
