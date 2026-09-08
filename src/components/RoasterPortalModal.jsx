import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  QrCode,
  X,
  Plus,
  CheckCircle2,
  Printer,
  Download,
  Copy,
  ExternalLink,
  Trash2,
  Edit3,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  UploadCloud,
  Tag,
  Palette,
  Eye,
  Sliders,
  Share2,
  Compass,
  Play,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  getCustomRoasterCoffees,
  saveRoasterCoffee,
  deleteRoasterCoffee,
  generateSmartBagUrl,
  exportRoasterCatalogJson,
  saveCustomRoasterProfile,
  getCustomRoasters
} from '../data/roasterRegistry';
import { BREW_METHODS } from '../data/brewData';
import RoasterVideoPlayer from './RoasterVideoPlayer';
import { useAppOrchestrator } from '../context/AppOrchestratorContext';
import { 
  downloadCompleteStickerPng, 
  downloadVectorQrSvg, 
  downloadHighResQrPng 
} from '../services/packagingAssetPipeline';

export default function RoasterPortalModal({
  isOpen,
  onClose,
  prefilledBarcode = '',
  prefilledBean = null,
  onSelectBeanToBrew
}) {
  const [activeTab, setActiveTab] = useState('onboard'); // 'onboard' | 'sticker' | 'catalog'
  const [qrLayout, setQrLayout] = useState('thermal'); // 'thermal' | 'badge' | 'minimal'
  const [qrColor, setQrColor] = useState('black'); // 'black' | 'espresso' | 'gold'
  const [qrEcc, setQrEcc] = useState('H'); // 'H' (30%) | 'Q' (25%) | 'M' (15%) | 'L' (7%)
  const [registeredCoffees, setRegisteredCoffees] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

  let orchestrator = null;
  try {
    orchestrator = useAppOrchestrator();
  } catch {}

  const navigate = useNavigate();

  // Form State for Onboarding
  const [roasterName, setRoasterName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [logoImage, setLogoImage] = useState('');
  const [logoFileName, setLogoFileName] = useState('');
  const [beanName, setBeanName] = useState('');
  const [origin, setOrigin] = useState('');
  const [varietal, setVarietal] = useState('');
  const [process, setProcess] = useState('Washed');
  const [elevation, setElevation] = useState('1,850 MASL');

  const [formError, setFormError] = useState(null);
  const [saveToast, setSaveToast] = useState(null);
  const modalBodyRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('Logo image size must be under 10MB.');
      return;
    }

    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 512;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/png');
          setLogoImage(optimizedDataUrl);
        } catch (canvasErr) {
          console.warn('Canvas optimization fallback:', canvasErr);
          setLogoImage(event.target.result);
        }
      };
      img.onerror = () => {
        setLogoImage(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoImage('');
    setLogoFileName('');
  };
  const [roastLevel, setRoastLevel] = useState('Light');
  const [tastingNotesInput, setTastingNotesInput] = useState('Peach, Jasmine, Honey');
  
  // Extraction Parameters
  const [brewMethod, setBrewMethod] = useState('pour_over');
  const [recommendedRatio, setRecommendedRatio] = useState(16.5);
  const [tempF, setTempF] = useState(202);
  const [recommendedGrind, setRecommendedGrind] = useState('Medium-Fine (650µm)');
  const [brewTime, setBrewTime] = useState('3m 15s');
  const [roasterNotes, setRoasterNotes] = useState('');

  // QR Destination / SKU
  const [upc, setUpc] = useState(prefilledBarcode || '');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedCoffeeForSticker, setSelectedCoffeeForSticker] = useState(null);

  // Real QR Code State
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [qrSvgString, setQrSvgString] = useState('');
  const [miniQrDataUrl, setMiniQrDataUrl] = useState('');
  const [activeTargetUrl, setActiveTargetUrl] = useState('');

  const stickerRef = useRef(null);

  // Load custom registered coffees from registry on open
  useEffect(() => {
    if (isOpen) {
      const list = getCustomRoasterCoffees();
      setRegisteredCoffees(list);
      if (prefilledBean) {
        if (prefilledBean.roaster) setRoasterName(prefilledBean.roaster);
        if (prefilledBean.location) setLocation(prefilledBean.location);
        if (prefilledBean.website) setWebsite(prefilledBean.website);
        if (prefilledBean.logoImage) setLogoImage(prefilledBean.logoImage);
        if (prefilledBean.beanName) setBeanName(prefilledBean.beanName);
        if (prefilledBean.brewMethod) setBrewMethod(prefilledBean.brewMethod);
        if (prefilledBean.recommendedRatio) setRecommendedRatio(prefilledBean.recommendedRatio);
        if (prefilledBean.tempF) setTempF(prefilledBean.tempF);
        if (prefilledBean.recommendedGrind) setRecommendedGrind(prefilledBean.recommendedGrind);
        if (prefilledBean.upc) setUpc(prefilledBean.upc);
        if (prefilledBean.customUrl) setCustomUrl(prefilledBean.customUrl);
        setSelectedCoffeeForSticker(prefilledBean);
        setActiveTab('sticker');
      } else if (prefilledBarcode) {
        setUpc(prefilledBarcode);
        setActiveTab('onboard');
      } else if (list.length > 0 && !selectedCoffeeForSticker) {
        setSelectedCoffeeForSticker(list[0]);
      }
    }
  }, [isOpen, prefilledBarcode, prefilledBean]);

  // Live mini QR preview in Onboarding form (Card 4)
  useEffect(() => {
    let isMounted = true;
    const formCoffee = {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      brewMethod,
      recommendedRatio,
      tempF,
      recommendedGrind,
      upc
    };
    const targetUrl = customUrl.trim() || generateSmartBagUrl(formCoffee);

    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: { dark: '#000000', light: '#FFFFFF' }
    }).then((dataUrl) => {
      if (isMounted) setMiniQrDataUrl(dataUrl);
    }).catch((err) => {
      console.warn('Mini QR render error:', err);
    });

    return () => { isMounted = false; };
  }, [roasterName, beanName, brewMethod, recommendedRatio, tempF, recommendedGrind, upc, customUrl]);

  // Main QR Code Generation in Studio (Tab 2)
  useEffect(() => {
    let isMounted = true;
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      brewMethod,
      recommendedRatio,
      tempF,
      recommendedGrind,
      upc
    };
    const targetUrl = customUrl.trim() || generateSmartBagUrl(coffee);
    setActiveTargetUrl(targetUrl);

    let darkColor = '#000000';
    let lightColor = '#FFFFFF';
    if (qrColor === 'espresso') {
      darkColor = '#1A120B';
      lightColor = '#FFFFFF';
    } else if (qrColor === 'gold') {
      darkColor = '#C48B56';
      lightColor = '#1A120B';
    }

    Promise.all([
      QRCode.toDataURL(targetUrl, {
        width: 1200,
        margin: 2,
        errorCorrectionLevel: qrEcc,
        color: { dark: darkColor, light: lightColor }
      }),
      QRCode.toString(targetUrl, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: qrEcc,
        color: { dark: darkColor, light: lightColor }
      })
    ]).then(([pngUrl, svgStr]) => {
      if (isMounted) {
        setQrDataUrl(pngUrl);
        setQrSvgString(svgStr);
      }
    }).catch((err) => {
      console.warn('Studio QR render error:', err);
    });

    return () => { isMounted = false; };
  }, [selectedCoffeeForSticker, roasterName, beanName, brewMethod, recommendedRatio, tempF, recommendedGrind, upc, customUrl, qrColor, qrEcc]);

  if (!isOpen) return null;

  const handleGenerateRandomSku = () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
    setUpc(`LOT-${new Date().getFullYear()}-${randomSuffix}`);
  };

  const handleSaveCoffee = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFormError(null);

    const trimmedRoaster = roasterName.trim();
    const trimmedBean = beanName.trim();

    if (!trimmedRoaster) {
      setFormError('Please enter your Roastery Brand name.');
      if (modalBodyRef.current) modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!trimmedBean) {
      setFormError('Please enter the Coffee / Lot name.');
      if (modalBodyRef.current) modalBodyRef.current.scrollTo({ top: 250, behavior: 'smooth' });
      return;
    }

    // Auto-normalize URLs so user isn't rejected for omitting https://
    let normalizedWebsite = website.trim();
    if (normalizedWebsite && !/^https?:\/\//i.test(normalizedWebsite)) {
      normalizedWebsite = `https://${normalizedWebsite}`;
    }

    let normalizedCustomUrl = customUrl.trim();
    if (normalizedCustomUrl && !/^https?:\/\//i.test(normalizedCustomUrl)) {
      normalizedCustomUrl = `https://${normalizedCustomUrl}`;
    }

    const notesArray = tastingNotesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newCoffee = {
      id: `roaster_${Date.now()}`,
      roaster: trimmedRoaster,
      location: location.trim(),
      website: normalizedWebsite,
      logoImage: logoImage || '',
      beanName: trimmedBean,
      origin: origin.trim() || 'Single Origin',
      varietal: varietal.trim(),
      process,
      elevation,
      roastLevel,
      tastingNotes: notesArray.length > 0 ? notesArray : ['Floral', 'Fruit', 'Balanced'],
      brewMethod,
      recommendedRatio: Number(recommendedRatio) || 16.5,
      tempF: Number(tempF) || 202,
      tempC: Math.round(((Number(tempF || 202) - 32) * 5) / 9),
      recommendedGrind: recommendedGrind.trim() || 'Medium-Fine',
      brewTime: brewTime.trim() || '3m 15s',
      upc: upc.trim() || `LOT-${Date.now().toString().slice(-6)}`,
      customUrl: normalizedCustomUrl,
      notes: roasterNotes.trim() || `Dialed-in recipe from ${trimmedRoaster}. Optimized for ${brewMethod.replace(/_/g, ' ')}.`
    };

    saveRoasterCoffee(newCoffee);

    // Save custom roaster profile with uploaded logoImage for RoasterProfilePage background
    saveCustomRoasterProfile({
      name: trimmedRoaster,
      location: location.trim(),
      website: normalizedWebsite,
      logoImage: logoImage || '',
      backgroundImage: logoImage || ''
    });

    const updated = getCustomRoasterCoffees();
    setRegisteredCoffees(updated);
    setSelectedCoffeeForSticker(newCoffee);
    setActiveTab('sticker');

    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setSaveToast(`Saved "${trimmedBean}" to your Roaster Registry! Smart Bag QR Studio ready.`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  const handleDelete = (id) => {
    if (confirm('Remove this coffee from your local Roaster Registry?')) {
      const remaining = deleteRoasterCoffee(id);
      setRegisteredCoffees(remaining);
      if (selectedCoffeeForSticker?.id === id) {
        setSelectedCoffeeForSticker(remaining[0] || null);
      }
    }
  };

  const getResolvedTargetUrl = () => {
    if (activeTargetUrl && activeTargetUrl.trim()) return activeTargetUrl;
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      brewMethod,
      recommendedRatio,
      tempF,
      recommendedGrind,
      upc
    };
    return customUrl.trim() || generateSmartBagUrl(coffee);
  };

  const handleCopyLink = async () => {
    const urlToCopy = getResolvedTargetUrl();
    if (!urlToCopy) return;

    let copied = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
        copied = true;
      }
    } catch (err) {
      console.warn('navigator.clipboard failed, attempting fallback', err);
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = urlToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.warn('execCommand copy fallback failed', fallbackErr);
      }
    }

    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handlePrintSticker = () => {
    window.print();
  };

  const handleDownloadFullStickerPng = async () => {
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      location: location || 'Artisan Small Batch',
      beanName: beanName || 'Single Origin Lot',
      origin: origin || 'Single Origin',
      process: process || 'Washed',
      elevation: elevation || '1,850 MASL',
      roastLevel: roastLevel || 'Light',
      tastingNotes: tastingNotesInput ? tastingNotesInput.split(',').map(s => s.trim()).filter(Boolean) : ['Peach', 'Jasmine', 'Honey'],
      brewMethod: brewMethod || 'pour_over',
      recommendedRatio: Number(recommendedRatio) || 16.5,
      tempF: Number(tempF) || 202,
      recommendedGrind: recommendedGrind || 'Medium-Fine',
      upc: upc || 'LOT-2026-CERTIFIED',
      customUrl: customUrl.trim()
    };

    if (orchestrator) {
      await orchestrator.downloadSticker(coffee);
    } else {
      await downloadCompleteStickerPng(coffee);
    }
  };

  const handleDownloadQrPng = async () => {
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      customUrl: customUrl.trim()
    };

    if (orchestrator) {
      await orchestrator.downloadQr(coffee, 1200);
    } else {
      await downloadHighResQrPng(coffee, 1200);
    }
  };

  const handleDownloadQrSvg = async () => {
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      customUrl: customUrl.trim()
    };

    if (orchestrator) {
      await orchestrator.downloadVector(coffee);
    } else {
      await downloadVectorQrSvg(coffee);
    }
  };

  const handleOpenLinkInNewTab = () => {
    const targetUrl = getResolvedTargetUrl();
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNavigateToPortfolio = () => {
    const rName = selectedCoffeeForSticker?.roaster || roasterName || 'methodical';
    const slug = rName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    onClose();
    navigate(`/roasters/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-espresso-950/95 border border-[#A66E38]/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="roaster-portal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-gold shadow">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                  B2B Specialty Roaster Portal
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  Real QR Code Generator
                </span>
              </div>
              <h2 id="roaster-portal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                Roaster Onboarding & Smart Bag QR Studio
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
            title="Close Roaster Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div 
          className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/20 overflow-x-auto overflow-y-hidden no-scrollbar text-xs font-mono shrink-0 select-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => setActiveTab('onboard')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'onboard'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>1. Onboard Coffee & Recipe</span>
          </button>

          <button
            onClick={() => setActiveTab('sticker')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'sticker'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>2. Smart Bag QR Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>3. Registered Coffees ({registeredCoffees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'video'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Play className="w-3.5 h-3.5 shrink-0" />
            <span>4. Walkthrough Video</span>
          </button>
        </div>

        {/* Modal Body */}
        <div ref={modalBodyRef} className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">

          {/* Global Toast Notification inside Modal */}
          {saveToast && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-bold">{saveToast}</span>
            </div>
          )}

          {/* TAB 1: ONBOARD FORM */}
          {activeTab === 'onboard' && (
            <form onSubmit={handleSaveCoffee} noValidate className="space-y-6">
              
              {/* Form Validation Warning */}
              {formError && (
                <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="font-bold">{formError}</span>
                </div>
              )}
              
              {/* Roastery Information Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
                  <Store className="w-4 h-4" />
                  <span>1. Roastery Credentials</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Roastery Brand *</label>
                    <input
                      type="text"
                      required
                      value={roasterName}
                      onChange={(e) => setRoasterName(e.target.value)}
                      placeholder="e.g. Methodical Coffee"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Location (City, Country)</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Greenville, SC, USA"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Website / Store URL</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://methodicalcoffee.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                {/* Brand Logo Upload */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-cream-soft/80 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <UploadCloud className="w-3.5 h-3.5 text-amber-gold" />
                      <span>Roastery Brand Logo (Watermark & Showcase)</span>
                    </label>
                    <span className="text-[10px] text-cream-soft/50 font-mono">PNG, JPG, SVG, WebP (Max 5MB)</span>
                  </div>

                  {logoImage ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-amber-gold/40">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/10 p-1 border border-white/20 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={logoImage} alt="Roaster Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <div>
                          <span className="text-xs text-cream-light font-mono font-bold block truncate max-w-xs">
                            {logoFileName || 'Brand Logo Uploaded'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            ✓ Ready for packaging stickers & ambient background
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="p-1.5 px-2.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs font-mono flex items-center gap-1 transition"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-dashed border-white/25 hover:border-amber-gold text-cream-light font-mono text-xs flex items-center gap-2 transition w-fit">
                        <UploadCloud className="w-4 h-4 text-amber-gold" />
                        <span>Upload Roastery Logo</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/webp, image/svg+xml"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-cream-soft/60 font-mono">
                        This logo becomes the ambient watermark on your Roaster Showcase page & prints on Smart Bag stickers.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bean Identity Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
                  <Coffee className="w-4 h-4" />
                  <span>2. Coffee Origin & Processing Profile</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Coffee / Lot Name *</label>
                    <input
                      type="text"
                      required
                      value={beanName}
                      onChange={(e) => setBeanName(e.target.value)}
                      placeholder="e.g. Worka Sakaro / Belly Warmer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Origin / Farm / Region</label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. Gedeb, Yirgacheffe, Ethiopia"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Varietal</label>
                    <input
                      type="text"
                      value={varietal}
                      onChange={(e) => setVarietal(e.target.value)}
                      placeholder="e.g. Heirloom, Geisha, Bourbon"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Processing Method</label>
                    <select
                      value={process}
                      onChange={(e) => setProcess(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                    >
                      <option value="Washed">Fully Washed</option>
                      <option value="Natural">Natural / Dry Processed</option>
                      <option value="Honey">Honey / Pulped Natural</option>
                      <option value="Anaerobic">Anaerobic Fermentation</option>
                      <option value="Wet-Hulled">Wet-Hulled (Giling Basah)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Elevation (MASL)</label>
                    <input
                      type="text"
                      value={elevation}
                      onChange={(e) => setElevation(e.target.value)}
                      placeholder="e.g. 1,900 - 2,100 MASL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Roast Profile Degree</label>
                    <select
                      value={roastLevel}
                      onChange={(e) => setRoastLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                    >
                      <option value="Ultra-Light (Nordic)">Ultra-Light (Nordic Style)</option>
                      <option value="Light">Light Roast</option>
                      <option value="Medium-Light">Medium-Light</option>
                      <option value="Medium">Medium</option>
                      <option value="Medium-Dark">Medium-Dark</option>
                      <option value="Dark">Dark Roast</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-cream-soft/70 font-mono text-xs mb-1">
                    Authentic Tasting Notes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tastingNotesInput}
                    onChange={(e) => setTastingNotesInput(e.target.value)}
                    placeholder="e.g. Bergamot, White Peach, Black Tea, Wildflower Honey"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold font-mono"
                  />
                </div>

                {/* Optional Retail Barcode or Batch Lot SKU */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-cream-soft/70 font-mono text-xs">
                      Retail Bag Barcode (UPC/EAN) or Batch Lot SKU (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomSku}
                      className="text-[10px] font-mono text-amber-gold hover:underline flex items-center gap-1 font-bold"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Assign Lot SKU</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={upc}
                    onChange={(e) => setUpc(e.target.value)}
                    placeholder="e.g. 850012345099 or LOT-2026-WORKA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
                  />
                  <p className="text-[10px] text-cream-soft/50 mt-1">
                    When customers scan this barcode with the camera scanner, your dialed-in recipe and roastery profile load automatically.
                  </p>
                </div>
              </div>

              {/* Extraction Parameters Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Roaster's Recommended Dial-In Recipe</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Recommended Method</label>
                    <select
                      value={brewMethod}
                      onChange={(e) => setBrewMethod(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                    >
                      <option value="classic_pour_over">Flat-Bottom (Kalita Wave)</option>
                      <option value="pour_over">Conical (Hario V60)</option>
                      <option value="chemex">Chemex Glass</option>
                      <option value="aeropress">AeroPress Standard</option>
                      <option value="french_press">French Press Immersion</option>
                      <option value="espresso">9-Bar Espresso</option>
                      <option value="moka_pot">Moka Pot Stovetop</option>
                      <option value="drip_brewer">Batch Precision Brewer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Golden Ratio (1 : X)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={recommendedRatio}
                      onChange={(e) => setRecommendedRatio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Water Temp (°F)</label>
                    <input
                      type="number"
                      value={tempF}
                      onChange={(e) => setTempF(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Grind Setting</label>
                    <input
                      type="text"
                      value={recommendedGrind}
                      onChange={(e) => setRecommendedGrind(e.target.value)}
                      placeholder="e.g. Medium-Fine (550μm)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono focus:outline-none focus:border-amber-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cream-soft/70 font-mono text-xs mb-1">
                    Roaster Pour Cadence & Bloom Technique
                  </label>
                  <textarea
                    rows={2}
                    value={roasterNotes}
                    onChange={(e) => setRoasterNotes(e.target.value)}
                    placeholder="e.g. 45-second gentle bloom with soft water (60-80 ppm TDS). Pour slowly in concentric rings avoiding filter edges."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                  />
                </div>
              </div>

              {/* Form Validation Warning at Bottom */}
              {formError && (
                <div className="p-4 rounded-2xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-xl animate-shake">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="font-bold">{formError}</span>
                </div>
              )}

              {/* Submit Action Bar */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft font-mono text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleSaveCoffee}
                  className="px-6 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition"
                >
                  <span>Save to Registry & Open QR Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: SMART BAG QR STUDIO */}
          {activeTab === 'sticker' && (
            <div className="space-y-6">
              
              {/* Studio Control Header */}
              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono text-amber-gold font-bold uppercase block text-[10px]">
                      Smart Bag QR Packaging Studio
                    </span>
                    <p className="text-cream-soft/80 text-xs mt-0.5">
                      Generate authentic high-resolution QR stickers, packaging badges, or vector SVGs for your coffee bags.
                    </p>
                  </div>

                  {/* Coffee Selector */}
                  {registeredCoffees.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-cream-soft/60 text-[11px] font-mono">Coffee:</span>
                      <select
                        value={selectedCoffeeForSticker?.id || ''}
                        onChange={(e) => {
                          const found = registeredCoffees.find((c) => c.id === e.target.value);
                          if (found) setSelectedCoffeeForSticker(found);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
                      >
                        {registeredCoffees.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.roaster} — {c.beanName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* QR Layout Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cream-soft/60 text-[11px] mr-1">Label Layout:</span>
                    <button
                      type="button"
                      onClick={() => setQrLayout('thermal')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold ${
                        qrLayout === 'thermal'
                          ? 'bg-amber-gold text-espresso-950 shadow'
                          : 'bg-white/[0.06] text-cream-soft hover:text-white'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Artisan Thermal Sticker (2"x3")</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQrLayout('badge')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold ${
                        qrLayout === 'badge'
                          ? 'bg-amber-gold text-espresso-950 shadow'
                          : 'bg-white/[0.06] text-cream-soft hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Luxury Roaster Badge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setQrLayout('minimal')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold ${
                        qrLayout === 'minimal'
                          ? 'bg-amber-gold text-espresso-950 shadow'
                          : 'bg-white/[0.06] text-cream-soft hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Minimal Square (2"x2")</span>
                    </button>
                  </div>

                  {/* QR Customization Options */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-amber-gold" />
                      <select
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-cream-light font-mono text-[11px] focus:outline-none focus:border-amber-gold"
                        title="QR Code Color Theme"
                      >
                        <option value="black">Classic Black / White</option>
                        <option value="espresso">Espresso Brown / White</option>
                        <option value="gold">Amber Gold / Dark</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-gold" />
                      <select
                        value={qrEcc}
                        onChange={(e) => setQrEcc(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-black/50 border border-white/15 text-cream-light font-mono text-[11px] focus:outline-none focus:border-amber-gold"
                        title="Error Correction Level (Resilience against wear & smudges)"
                      >
                        <option value="H">Level H (30% Damage Recovery)</option>
                        <option value="Q">Level Q (25% Recovery)</option>
                        <option value="M">Level M (15% Recovery)</option>
                        <option value="L">Level L (7% Recovery)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Live Physical Label Previews */}
              <div className="flex justify-center p-6 bg-stone-900/60 rounded-3xl border border-dashed border-white/20">

                {/* LAYOUT 1: ARTISAN THERMAL STICKER (2" x 3") */}
                {qrLayout === 'thermal' && (
                  <div 
                    ref={stickerRef}
                    className="w-full max-w-sm rounded-2xl bg-white text-stone-950 p-6 shadow-2xl border-2 border-stone-800 text-center space-y-3 font-sans relative overflow-hidden print-label-target"
                  >
                    {/* Header Branding */}
                    <div className="border-b border-stone-800 pb-2 text-left flex justify-between items-baseline">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-stone-500 block">
                          SPECIALTY COFFEE ROASTERY
                        </span>
                        <h3 className="font-serif text-xl font-bold tracking-tight text-stone-900 leading-tight">
                          {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
                        </h3>
                        <span className="text-[11px] text-stone-600 font-medium">
                          {selectedCoffeeForSticker?.location || location || 'Artisan Small Batch'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider">
                          {selectedCoffeeForSticker?.roastLevel || roastLevel}
                        </span>
                      </div>
                    </div>

                    {/* Coffee Profile */}
                    <div className="text-left space-y-0.5 pt-0.5">
                      <h4 className="font-serif text-lg font-bold text-stone-950 leading-tight">
                        {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium">
                        {selectedCoffeeForSticker?.origin || origin || 'Single Origin'} • {selectedCoffeeForSticker?.process || process} • {selectedCoffeeForSticker?.elevation || elevation}
                      </p>
                      {(selectedCoffeeForSticker?.tastingNotes?.length > 0 || tastingNotesInput) && (
                        <p className="text-[11px] text-amber-900/90 font-serif italic pt-0.5">
                          Notes: {(selectedCoffeeForSticker?.tastingNotes || tastingNotesInput.split(',').map(s => s.trim())).slice(0, 4).join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Real High-Resolution QR Code */}
                    <div className="p-3 bg-white border border-stone-200 rounded-2xl flex flex-col items-center justify-center shadow-inner mx-auto w-fit">
                      {/* Prominent "Scan Me for Recipe" Callout Badge */}
                      <div className="flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-900 text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-2.5 shadow-md border border-stone-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Scan Me for Recipe</span>
                      </div>

                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Smart Bag QR Code"
                          className="w-44 h-44 object-contain"
                        />
                      ) : (
                        <div className="w-44 h-44 flex items-center justify-center text-stone-400 font-mono text-xs">
                          Generating QR...
                        </div>
                      )}
                      <span className="text-[9px] font-mono text-stone-600 font-bold uppercase tracking-wider mt-1.5">
                        Aim phone camera to brew
                      </span>
                    </div>

                    {/* Dial-in Parameters */}
                    <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-stone-100 border border-stone-200 text-[10px] font-mono">
                      <div>
                        <span className="text-stone-500 block text-[8px] uppercase">Ratio</span>
                        <span className="font-bold text-amber-800">
                          1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[8px] uppercase">Water Temp</span>
                        <span className="font-bold text-stone-800">
                          {selectedCoffeeForSticker?.tempF || tempF}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[8px] uppercase">Method</span>
                        <span className="font-bold text-stone-800 capitalize">
                          {(selectedCoffeeForSticker?.brewMethod || brewMethod).replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Footer Tagline */}
                    <div className="text-[9px] font-mono text-stone-500 pt-2 border-t border-stone-200 flex justify-between items-center">
                      <span>thebrew.app dial-in</span>
                      <span className="uppercase font-bold tracking-wider text-[8px] text-stone-700">
                        {selectedCoffeeForSticker?.upc || upc || 'Smart Bag Certified'}
                      </span>
                    </div>
                  </div>
                )}

                {/* LAYOUT 2: LUXURY ROASTER BADGE (Espresso & Gold) */}
                {qrLayout === 'badge' && (
                  <div 
                    ref={stickerRef}
                    className="w-full max-w-sm rounded-3xl bg-[#1A120B] border-2 border-amber-gold/60 p-6 shadow-2xl text-center space-y-4 text-cream-light relative overflow-hidden print-label-target"
                  >
                    <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-amber-gold" />
                    <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-amber-gold" />
                    <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-amber-gold" />
                    <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-amber-gold" />

                    <div>
                      <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-gold/90 block">
                        DIALED-IN EXTRACTION RECIPE
                      </span>
                      <h3 className="font-serif text-xl font-bold text-cream-light mt-0.5 tracking-wide">
                        {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
                      </h3>
                      <p className="text-xs text-amber-200/80 font-serif italic">
                        {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-2xl shadow-md mx-auto w-fit">
                      {/* Prominent "Scan Me for Recipe" Badge */}
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#1A120B] text-amber-gold font-mono text-[10px] font-bold uppercase tracking-wider mb-2 border border-amber-gold/40 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-amber-gold" />
                        <span>Scan Me for Recipe</span>
                      </div>

                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Smart Bag QR Code"
                          className="w-44 h-44 object-contain"
                        />
                      ) : (
                        <div className="w-44 h-44 flex items-center justify-center text-stone-400 font-mono text-xs">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 py-1.5 px-2 rounded-xl bg-white/[0.06] border border-white/10 text-[10px] font-mono">
                      <div>
                        <span className="text-cream-soft/60 block text-[8px] uppercase">Ratio</span>
                        <span className="font-bold text-amber-gold">
                          1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                        </span>
                      </div>
                      <div>
                        <span className="text-cream-soft/60 block text-[8px] uppercase">Temp</span>
                        <span className="font-bold text-cream-light">
                          {selectedCoffeeForSticker?.tempF || tempF}°F
                        </span>
                      </div>
                      <div>
                        <span className="text-cream-soft/60 block text-[8px] uppercase">Method</span>
                        <span className="font-bold text-cream-light capitalize">
                          {(selectedCoffeeForSticker?.brewMethod || brewMethod).replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-cream-soft/70">
                        Scan with camera to open The Brew App timer & water calculator
                      </p>
                      <span className="text-[8px] font-mono text-amber-gold/70 block uppercase tracking-wider">
                        thebrew.app • Smart Bag Certified
                      </span>
                    </div>
                  </div>
                )}

                {/* LAYOUT 3: MINIMAL SQUARE STICKER (2" x 2") */}
                {qrLayout === 'minimal' && (
                  <div 
                    ref={stickerRef}
                    className="w-72 h-72 rounded-3xl bg-white text-stone-900 p-5 shadow-2xl border-2 border-stone-800 text-center flex flex-col justify-between print-label-target"
                  >
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-900 leading-tight">
                        {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
                      </h4>
                      <p className="text-[11px] text-stone-600 font-medium truncate">
                        {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {/* Prominent "Scan Me for Recipe" Badge */}
                      <div className="flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider mb-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>Scan Me for Recipe</span>
                      </div>

                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Smart Bag QR Code"
                          className="w-36 h-36 object-contain"
                        />
                      ) : (
                        <div className="w-36 h-36 flex items-center justify-center text-stone-400 font-mono text-xs">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] font-mono text-stone-600 flex justify-between items-center border-t border-stone-200 pt-1.5">
                      <span>1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}</span>
                      <span>{selectedCoffeeForSticker?.tempF || tempF}°F</span>
                      <span className="font-bold text-stone-800">thebrew.app</span>
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons for QR Studio */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleDownloadFullStickerPng}
                  className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition"
                  title="Download complete 300 DPI composite packaging sticker PNG ready to email or upload to your printer"
                >
                  <Download className="w-4 h-4 text-espresso-950" />
                  <span>Download Complete Sticker (PNG)</span>
                </button>

                <button
                  onClick={handlePrintSticker}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                >
                  <Printer className="w-4 h-4 text-amber-gold" />
                  <span>Print Label Direct</span>
                </button>

                <button
                  onClick={handleDownloadQrSvg}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                  title="Download scalable vector SVG for commercial bag packaging printers"
                >
                  <Download className="w-4 h-4 text-amber-gold" />
                  <span>Vector QR (SVG)</span>
                </button>

                <button
                  onClick={handleDownloadQrPng}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                  title="Download ultra-crisp 1200px PNG"
                >
                  <Download className="w-4 h-4 text-amber-gold" />
                  <span>Standalone QR (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                  title="Copy the direct recipe and dial-in link to clipboard"
                >
                  {copySuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">URL Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-gold" />
                      <span>Copy Recipe URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleOpenLinkInNewTab}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                  title="Open the generated link in a new tab to test customer experience"
                >
                  <ExternalLink className="w-4 h-4 text-amber-gold" />
                  <span>Test Link</span>
                </button>

                <button
                  type="button"
                  onClick={handleNavigateToPortfolio}
                  className="px-4 py-2.5 rounded-xl bg-amber-gold/20 hover:bg-amber-gold/30 text-amber-gold font-mono text-xs font-bold flex items-center gap-2 border border-amber-gold/40 transition active:scale-95"
                  title="Open this roaster's profile and recipe page directly in the app"
                >
                  <Store className="w-4 h-4 text-amber-gold" />
                  <span>View Portfolio Page</span>
                </button>
              </div>

              {/* Direct Recipe & Showcase URL Box */}
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <span className="text-cream-soft/60 uppercase text-[10px] shrink-0 font-bold">Live Target URL:</span>
                  <input
                    type="text"
                    readOnly
                    value={activeTargetUrl || getResolvedTargetUrl()}
                    className="w-full bg-black/60 border border-white/15 px-3 py-1.5 rounded-lg text-cream-light font-mono text-[11px] truncate focus:outline-none focus:border-amber-gold"
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-bold flex items-center gap-1.5 border border-white/15 transition active:scale-95 text-[11px]"
                  >
                    {copySuccess ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-gold" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenLinkInNewTab}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-bold flex items-center gap-1.5 border border-white/15 transition active:scale-95 text-[11px]"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-gold" />
                    <span>Open New Tab</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNavigateToPortfolio}
                    className="px-3 py-1.5 rounded-lg bg-amber-gold text-espresso-950 font-bold flex items-center gap-1.5 transition active:scale-95 text-[11px]"
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>View In-App</span>
                  </button>
                </div>
              </div>

              {/* Printer Handoff Guidance Banner */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-3 text-xs font-mono text-cream-soft/80">
                <FileText className="w-4 h-4 text-amber-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-cream-light block">
                    Where Files Save & Handoff to Your Packaging Printer:
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    When you click <strong>"Download Complete Sticker (PNG)"</strong> or <strong>"Vector QR (SVG)"</strong>, your browser saves the high-resolution file directly into your device's default <strong>Downloads</strong> folder (e.g. <code>Downloads/smart_bag_sticker_*.png</code>).
                  </p>
                  <p className="text-[11px] leading-relaxed text-amber-gold/90">
                    You can email the 300-DPI PNG directly to your label printer for thermal sticker rolls (Avery, Zebra, Rollo, Dymo), or provide the vector SVG to your bag packaging manufacturer. The sticker includes the prominent <strong>"Scan Me for Recipe"</strong> callout so customers can instantly scan it on retail shelves.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: REGISTERED COFFEES CATALOG */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/30 border border-white/10 text-xs">
                <div>
                  <span className="font-mono text-amber-gold font-bold uppercase text-[10px]">
                    Roastery Coffee Registry
                  </span>
                  <p className="text-cream-soft/80 text-xs mt-0.5">
                    {registeredCoffees.length} custom coffees registered in your local environment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportRoasterCatalogJson}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs flex items-center gap-1.5 border border-white/15"
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
                    onClick={() => setActiveTab('onboard')}
                    className="px-4 py-2 rounded-xl bg-amber-gold text-espresso-950 font-mono text-xs font-bold uppercase"
                  >
                    Onboard First Coffee
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
                          <span className="capitalize">{c.brewMethod.replace(/_/g, ' ')}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setSelectedCoffeeForSticker(c);
                            setActiveTab('sticker');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-[11px] font-mono text-cream-light flex items-center gap-1 border border-white/10"
                          title="Open Smart Bag QR Studio"
                        >
                          <QrCode className="w-3.5 h-3.5 text-amber-gold" />
                          <span>QR Studio</span>
                        </button>

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
                            className="px-3 py-1.5 rounded-lg bg-amber-gold/20 hover:bg-amber-gold text-amber-gold hover:text-espresso-950 text-[11px] font-mono font-bold flex items-center gap-1 border border-amber-500/30 transition"
                          >
                            <span>Dial-In</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
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
          )}

          {/* TAB 4: VIDEO WALKTHROUGH */}
          {activeTab === 'video' && (
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
                  onClick={() => setActiveTab('sticker')}
                  className="px-4 py-2 rounded-xl bg-amber-gold hover:bg-amber-gold/90 text-espresso-950 font-bold text-xs flex items-center gap-1.5 shadow transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Open Smart Bag QR Studio</span>
                </button>
              </div>

              <RoasterVideoPlayer
                onOpenLiveDemo={() => setActiveTab('sticker')}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
