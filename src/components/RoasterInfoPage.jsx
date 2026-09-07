import React, { useState } from 'react';
import { 
  Store, 
  Mail, 
  CheckCircle2, 
  Send, 
  Barcode, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  Coffee, 
  Building, 
  Globe, 
  HelpCircle,
  ShieldCheck,
  Award,
  ChevronRight,
  ExternalLink,
  X,
  Play
} from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import RoasterVideoPlayer from './RoasterVideoPlayer';

export default function RoasterInfoPage({ isOpen, onClose, onOpenStudio }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState(null);
  const [formData, setFormData] = useState({
    roasteryName: '',
    contactName: '',
    email: '',
    website: '',
    location: '',
    coffeeCount: '1-5',
    sampleBarcodes: '',
    message: ''
  });

  const emailHq = 'clay@thebrew.app';

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    trackEvent('roaster_partnership_inquiry', {
      roastery: formData.roasteryName,
      contact: formData.contactName,
      email: formData.email
    });

    let liveSuccess = false;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/roaster-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roastery_name: formData.roasteryName,
          contact_name: formData.contactName,
          email: formData.email,
          website: formData.website,
          location: formData.location,
          coffee_count: formData.coffeeCount,
          sample_barcodes: formData.sampleBarcodes,
          message: formData.message
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          liveSuccess = true;
          setSubmissionResponse(data);
        }
      }
    } catch (err) {
      console.warn('War Room backend unreachable; falling back to direct mailto dispatch', err);
    }

    if (!liveSuccess) {
      const subject = encodeURIComponent(`Roastery Label Ingestion Request: ${formData.roasteryName}`);
      const body = encodeURIComponent(
        `Hello Brew App HQ,\n\n` +
        `I would like to add our specialty roastery and coffee labels to The Brew App global verified database.\n\n` +
        `Roastery Brand: ${formData.roasteryName}\n` +
        `Contact Name: ${formData.contactName}\n` +
        `Email: ${formData.email}\n` +
        `Website: ${formData.website}\n` +
        `Location: ${formData.location}\n` +
        `Number of Retail Coffees: ${formData.coffeeCount}\n` +
        `Sample Retail Barcodes (UPC/EAN): ${formData.sampleBarcodes}\n\n` +
        `Notes / Roaster Dial-In Details:\n${formData.message}\n\n` +
        `Looking forward to partnering!`
      );
      window.location.href = `mailto:${emailHq}?subject=${subject}&body=${body}`;
      setSubmissionResponse({ ok: true, lead_id: 'LOCAL_MAIL_DISPATCH', fallback: true });
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-espresso-950/95 border border-[#A66E38]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roaster-info-title"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-gold shadow">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                  Official Partnership Information
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  Zero-Cost Ingestion
                </span>
              </div>
              <h2 id="roaster-info-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                Add Your Roastery & Labels to The Brew App
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
            title="Close Info Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 custom-scrollbar space-y-8 text-cream-light">

          {/* Hero Value Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#2A1C12]/90 via-black/80 to-[#1A120B]/90 border border-amber-gold/30 p-6 sm:p-8 shadow-xl overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-gold font-mono text-xs font-bold border border-amber-500/30 inline-block">
                For Artisan & Specialty Coffee Roasters
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light leading-tight">
                Turn Every Bag into an Interactive Barista Masterclass
              </h3>
              <p className="text-sm text-cream-soft/90 leading-relaxed font-sans">
                When customers purchase your coffee, they shouldn't have to guess extraction ratios, grind settings, or water temperatures. By adding your roastery labels to our verified catalog, scanning your bag barcode with any smartphone camera instantly loads your exact dialed-in recipe and synchronized multi-phase timer.
              </p>
            </div>
          </div>

          {/* Interactive Video Walkthrough */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-gold animate-pulse" />
                <h4 className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                  Watch: The 20-Second Smart Bag Experience
                </h4>
              </div>
              <span className="text-xs font-mono text-cream-soft/70">
                From Printer to Dialed-In Cup
              </span>
            </div>

            <RoasterVideoPlayer
              onOpenLiveDemo={() => {
                if (onOpenStudio) {
                  onClose();
                  onOpenStudio();
                }
              }}
            />
          </div>

          {/* 3-Step Roaster Onboarding Process */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-cream-light flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-gold" />
              <span>How Roaster Label Verification Works</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-gold font-mono font-bold text-sm">
                  1
                </div>
                <h5 className="font-serif font-bold text-cream-light">Submit Roastery & Labels</h5>
                <p className="text-xs text-cream-soft/80 leading-relaxed">
                  Send your coffee varieties, origins, harvest processing, and existing retail bag UPC/EAN barcodes via the form below or directly to HQ.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-gold font-mono font-bold text-sm">
                  2
                </div>
                <h5 className="font-serif font-bold text-cream-light">Set Barista Dial-In Recipes</h5>
                <p className="text-xs text-cream-soft/80 leading-relaxed">
                  Define your recommended brew method (e.g. V60 or Kalita), golden ratio, water temperature, grind size, and bloom cadence for each roast lot.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-mono font-bold text-sm">
                  3
                </div>
                <h5 className="font-serif font-bold text-cream-light">Instant Camera Recognition</h5>
                <p className="text-xs text-cream-soft/80 leading-relaxed">
                  HQ ingests your profiles into the verified database. Any home barista scanning your bag barcode or Smart Bag sticker gets your certified recipe.
                </p>
              </div>
            </div>
          </div>

          {/* Roaster Benefits Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cream-light block">Zero-Cost Program</span>
                <span className="text-cream-soft/70 block mt-0.5">
                  100% free for independent specialty roasters. We believe great coffee deserves precise extraction.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cream-light block">Eliminate Under-Extraction</span>
                <span className="text-cream-soft/70 block mt-0.5">
                  Customers extract the bright, vibrant notes you intended rather than bitter or sour cups.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cream-light block">Printable Smart Bag Stickers</span>
                <span className="text-cream-soft/70 block mt-0.5">
                  Access our built-in QR generator to print high-resolution packaging stickers for retail bags.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cream-light block">Roaster Profile Attribution</span>
                <span className="text-cream-soft/70 block mt-0.5">
                  Every scan attributes your roastery brand, logo, shop link, and origin story to the customer's Brew Cellar.
                </span>
              </div>
            </div>
          </div>

          {/* Contact HQ Form */}
          <div className="p-6 rounded-2xl bg-black/40 border border-amber-gold/40 space-y-6">
            <div className="border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-gold block">
                  Contact HQ • Roaster Ingestion Desk
                </span>
                <h4 className="font-serif text-xl font-bold text-cream-light mt-0.5">
                  Submit Your Roastery Label Inquiry
                </h4>
              </div>
              <a
                href={`mailto:${emailHq}?subject=Roastery%20Database%20Inquiry`}
                className="text-xs font-mono text-amber-gold hover:underline flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Or email {emailHq} directly</span>
              </a>
            </div>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 uppercase tracking-wider">
                    {submissionResponse?.fallback ? 'Dispatched via Email Client' : 'Live Ingested to War Room CRM'}
                  </span>
                  <h5 className="font-serif text-xl font-bold text-cream-light">
                    Inquiry Received for {formData.roasteryName || 'Your Roastery'}
                  </h5>
                </div>

                <div className="max-w-md mx-auto p-3.5 rounded-xl bg-black/60 border border-white/10 text-left space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-cream-soft/70">
                    <span>Reference Lead ID:</span>
                    <span className="text-amber-gold font-bold">{submissionResponse?.lead_id || 'PENDING'}</span>
                  </div>
                  <div className="flex justify-between text-cream-soft/70">
                    <span>HQ Destination:</span>
                    <span className="text-cream-light">The Brew App Executive Swarm</span>
                  </div>
                  <div className="flex justify-between text-cream-soft/70">
                    <span>Contact Person:</span>
                    <span className="text-cream-light">{formData.contactName} ({formData.email})</span>
                  </div>
                  {formData.sampleBarcodes && (
                    <div className="flex justify-between text-cream-soft/70">
                      <span>Barcodes Queued:</span>
                      <span className="text-cream-light truncate max-w-[200px]">{formData.sampleBarcodes}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-cream-soft max-w-lg mx-auto leading-relaxed">
                  {submissionResponse?.fallback 
                    ? `Your desktop mail client was opened with all technical specifications addressed to ${emailHq}. Please send the prefilled email to complete ingestion.`
                    : `Your roastery profile and sample barcodes have been directly written to our War Room CRM. Our coffee dial-in pipeline will verify your coffees for QR bag integration.`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onOpenStudio && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenStudio();
                      }}
                      className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider transition hover:scale-105 shadow-md shadow-amber-gold/20"
                    >
                      Open Smart Bag Sticker Studio
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold border border-white/15"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-cream-soft/80 mb-1">Roastery Brand Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.roasteryName}
                      onChange={(e) => setFormData({ ...formData, roasteryName: e.target.value })}
                      placeholder="e.g. Methodical Coffee, Sweet Bloom"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/80 mb-1">Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="e.g. Will Shurtz (Head Roaster)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-cream-soft/80 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="roaster@yourbrand.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/80 mb-1">Roastery Website / Webshop</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourbrand.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/80 mb-1">City, State, Country</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Greenville, SC, USA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-cream-soft/80 mb-1">
                      Existing Retail Bag Barcodes (UPC / EAN numbers)
                    </label>
                    <input
                      type="text"
                      value={formData.sampleBarcodes}
                      onChange={(e) => setFormData({ ...formData, sampleBarcodes: e.target.value })}
                      placeholder="e.g. 850012345012, 850012345029"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/80 mb-1">Number of Active Retail Coffees</label>
                    <select
                      value={formData.coffeeCount}
                      onChange={(e) => setFormData({ ...formData, coffeeCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                    >
                      <option value="1-5">1 - 5 Retail Coffees</option>
                      <option value="6-15">6 - 15 Retail Coffees</option>
                      <option value="16-30">16 - 30 Retail Coffees</option>
                      <option value="30+">30+ Rotating Lots & Blends</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cream-soft/80 mb-1">
                    Notes, Dial-In Specifications, or Questions for HQ
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide any details on your coffee varieties, recommended ratios, or questions regarding packaging stickers..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-cream-soft/60">
                    Direct HQ Contact: <strong className="text-amber-gold">{emailHq}</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    {onOpenStudio && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenStudio();
                        }}
                        className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold border border-white/15"
                      >
                        Self-Service Studio
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-espresso-950 border-t-transparent rounded-full animate-spin" />
                          <span>Connecting to HQ...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Request to HQ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
