import React from 'react';
import { Download, Coffee, QrCode, ArrowRight, Trash2, Plus, Edit3 } from 'lucide-react';
import { exportRoasterCatalogJson } from '../../data/roasterRegistry';

export default function RoasterCatalogTab({
  registeredCoffees = [],
  currentUser,
  setActiveTab,
  setSelectedCoffeeForSticker,
  onStartNewLot = null,
  onEditCoffee = null,
  orchestrator,
  onSelectBeanToBrew,
  onClose,
  handleDelete
}) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/30 border border-white/10 text-xs">
        <div>
          <span className="font-mono text-amber-gold font-bold uppercase text-[10px]">
            Roastery Coffee Registry
          </span>
          <p className="text-cream-soft/80 text-xs mt-0.5">
            {registeredCoffees.length} coffee lots registered under {currentUser?.email || 'your account'}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onStartNewLot && (
            <button
              onClick={onStartNewLot}
              className="px-3.5 py-1.5 rounded-lg bg-amber-gold hover:bg-amber-400 text-espresso-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add New Coffee Lot</span>
            </button>
          )}

          <button
            onClick={exportRoasterCatalogJson}
            className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs flex items-center gap-1.5 border border-white/15 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-amber-gold" />
            <span>Export Catalog (JSON)</span>
          </button>
        </div>
      </div>

      {registeredCoffees.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/15 rounded-2xl space-y-3 bg-black/20">
          <Coffee className="w-10 h-10 text-cream-soft/40 mx-auto" />
          <p className="text-cream-light font-serif font-bold text-lg">
            No Custom Coffees Registered Yet
          </p>
          <p className="text-cream-soft/70 text-xs max-w-md mx-auto">
            Click "Onboard Coffee & Recipe" to register your first lot, set your barista dial-in recipe, and generate your Smart Bag QR sticker.
          </p>
          <button
            onClick={onStartNewLot || (() => setActiveTab('onboard'))}
            className="px-4 py-2 rounded-xl bg-amber-gold text-espresso-950 font-mono text-xs font-bold uppercase cursor-pointer inline-flex items-center gap-1.5 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard First Coffee</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registeredCoffees.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-gold/40 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-gold font-mono font-bold text-[10px]">
                    {c.roaster}
                  </span>
                  <span className="font-mono text-[10px] text-cream-soft/60">
                    {c.upc || 'QR Ready'}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-bold text-cream-light mt-2">
                  {c.beanName}
                </h4>
                <p className="text-xs text-cream-soft/80 mt-0.5">
                  {c.origin} • {c.process} • {c.roastLevel}
                </p>

                <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-cream-soft/90">
                  <span className="text-amber-gold font-bold">1:{c.recommendedRatio}</span>
                  <span>•</span>
                  <span>{c.tempF}°F</span>
                  <span>•</span>
                  <span className="capitalize">{(c.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedCoffeeForSticker(c);
                      setActiveTab('sticker');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-cream-light flex items-center gap-1 border border-white/10 cursor-pointer"
                    title="Open Smart Bag QR Studio"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-gold" />
                    <span>QR Studio</span>
                  </button>

                  {onEditCoffee && (
                    <button
                      onClick={() => onEditCoffee(c)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-amber-gold flex items-center gap-1 border border-amber-gold/30 cursor-pointer transition"
                      title="Edit Lot Details, Grind & Recipe"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Lot</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (orchestrator) {
                        orchestrator.brew(c);
                      } else if (onSelectBeanToBrew) {
                        onSelectBeanToBrew(c);
                      }
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-gold/20 hover:bg-amber-gold text-amber-gold hover:text-espresso-950 text-[11px] font-mono font-bold flex items-center gap-1 border border-amber-500/30 transition cursor-pointer"
                  >
                    <span>Dial-In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 cursor-pointer"
                    title="Delete coffee"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
