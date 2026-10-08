import React, { useState, useEffect } from 'react';
import { 
  Building, 
  MapPin, 
  Clock, 
  Store, 
  CheckCircle2, 
  QrCode, 
  Coffee, 
  Users 
} from 'lucide-react';
import {
  recordCafeCheckIn,
  getCafeSocialStats,
  hasUserCheckedIn,
  CAFE_CHECKIN_EVENT
} from '../../utils/cafeCheckInStorage';
import { hapticSuccess } from '../../utils/haptics';

function CafeCard({ cafe, index, roasterName, currentUser }) {
  const cafeId = `${roasterName}_cafe_${index}_${cafe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const [stats, setStats] = useState(() => getCafeSocialStats(cafeId, 12 + index * 4));
  const [isCheckedIn, setIsCheckedIn] = useState(() => hasUserCheckedIn(cafeId, currentUser));
  const [justCheckedIn, setJustCheckedIn] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStats(getCafeSocialStats(cafeId, 12 + index * 4));
      setIsCheckedIn(hasUserCheckedIn(cafeId, currentUser));
    };
    window.addEventListener(CAFE_CHECKIN_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CAFE_CHECKIN_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [cafeId, currentUser, index]);

  const handleCheckIn = () => {
    recordCafeCheckIn(cafeId, cafe.name, {
      user: currentUser,
      roaster: roasterName
    });
    setIsCheckedIn(true);
    setJustCheckedIn(true);
    setStats(getCafeSocialStats(cafeId, 12 + index * 4));
    hapticSuccess();
    setTimeout(() => setJustCheckedIn(false), 3000);
  };

  return (
    <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4 shadow-lg flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-gold">
            <Building className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-gold text-[11px] font-mono font-bold">
            <Users className="w-3 h-3 text-amber-gold" />
            <span>{stats.totalCheckIns} Brewed Here</span>
          </div>
        </div>
        <h4 className="font-serif text-lg font-bold text-cream-light">
          {cafe.name}
        </h4>
        <p className="text-xs font-mono text-amber-gold flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{cafe.address}</span>
        </p>
        <p className="text-xs text-cream-soft font-sans leading-relaxed pt-1">
          {cafe.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
        <span className="flex items-center gap-1 text-cream-soft/70">
          <Clock className="w-3.5 h-3.5" />
          <span>{cafe.hours}</span>
        </span>

        <button
          type="button"
          onClick={handleCheckIn}
          disabled={isCheckedIn}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
            isCheckedIn
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
              : 'bg-white/[0.08] hover:bg-amber-gold hover:text-espresso-950 text-cream-light border border-white/15'
          }`}
          title="Log that you brewed or visited this specialty cafe"
        >
          <Coffee className="w-3.5 h-3.5" />
          <span>{justCheckedIn ? 'Checked In! ☕' : (isCheckedIn ? 'Brewed Here ✓' : 'I Brewed Here')}</span>
        </button>
      </div>
    </div>
  );
}

export default function RoasterCafesList({
  roaster,
  isBrandOwner,
  currentUser = null,
  onOpenRoasterPortalWithBean,
  orchestrator
}) {
  if (!roaster) return null;

  const cafes = roaster.cafes || [];

  return (
    <div className="space-y-12">
      {/* SECTION 4: CAFES & ROASTERY LABS */}
      <div id="cafes-labs" className="space-y-6 animate-fade-in max-w-5xl scroll-mt-24">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold text-cream-light flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-gold" />
            <span>Cafes & Roastery Labs ({cafes.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cafes.map((cafe, i) => (
            <CafeCard
              key={i}
              cafe={cafe}
              index={i}
              roasterName={roaster.name}
              currentUser={currentUser}
            />
          ))}
        </div>
      </div>

      {/* 5. ROASTERY PARTNER & PACKAGING TOOLING (DISCRETE OWNER FOOTER) */}
      {onOpenRoasterPortalWithBean && (
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream-soft/60">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-cream-soft/40" />
            {isBrandOwner ? (
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>You are managing {roaster.name} as a Verified Brand Owner</span>
              </span>
            ) : (
              <span>Are you a team member or owner at {roaster.name}?</span>
            )}
          </div>
          <button
            onClick={() => {
              const defaultBean = roaster.coffees && roaster.coffees[0];
              const payload = {
                roaster: roaster.name,
                beanName: defaultBean?.beanName || '',
                brewMethod: defaultBean?.brewMethod || 'pour_over',
                recommendedRatio: defaultBean?.recommendedRatio || 16.5,
                tempF: defaultBean?.tempF || 202,
                recommendedGrind: defaultBean?.recommendedGrind || 'Medium-Fine',
                upc: defaultBean?.upc || '',
                customUrl: defaultBean?.directUrl || roaster.shopUrl
              };
              if (orchestrator) {
                orchestrator.package(payload);
              } else {
                onOpenRoasterPortalWithBean(payload);
              }
            }}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition cursor-pointer ${
              isBrandOwner
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-cream-soft hover:text-cream-light border border-white/10'
            }`}
            title={isBrandOwner ? "Open Roaster Hub & Manage Packaging" : "Open Smart Bag Packaging & Label Studio"}
          >
            <QrCode className="w-3.5 h-3.5 text-amber-gold" />
            <span>{isBrandOwner ? 'Roaster Hub & Label Studio' : 'Roaster Packaging & Label Studio'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
