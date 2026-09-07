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
  Play
} from 'lucide-react';
import QRCode from 'qrcode';
import {
  getCustomRoasterCoffees,
  saveRoasterCoffee,
  deleteRoasterCoffee,
  generateSmartBagUrl,
  exportRoasterCatalogJson
} from '../data/roasterRegistry';
import { BREW_METHODS } from '../data/brewData';
import RoasterVideoPlayer from './RoasterVideoPlayer';

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

  // Form State for Onboarding
  const [roasterName, setRoasterName] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [beanName, setBeanName] = useState('');
  const [origin, setOrigin] = useState('');
  const [varietal, setVarietal] = useState('');
  const [process, setProcess] = useState('Washed');
  const [elevation, setElevation] = useState('1,850 MASL');
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
    e.preventDefault();
    if (!roasterName.trim() || !beanName.trim()) {
      alert('Please enter both the Roastery Name and the Coffee Bean Name.');
      return;
    }

    const notesArray = tastingNotesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newCoffee = {
      id: `roaster_${Date.now()}`,
      roaster: roasterName.trim(),
      location: location.trim(),
      website: website.trim(),
      beanName: beanName.trim(),
      origin: origin.trim() || 'Single Origin',
      varietal: varietal.trim(),
      process,
      elevation,
      roastLevel,
      tastingNotes: notesArray.length > 0 ? notesArray : ['Floral', 'Fruit', 'Balanced'],
      brewMethod,
      recommendedRatio: Number(recommendedRatio),
      tempF: Number(tempF),
      tempC: Math.round(((Number(tempF) - 32) * 5) / 9),
      recommendedGrind,
      brewTime,
      upc: upc.trim() || `LOT-${Date.now().toString().slice(-6)}`,
      customUrl: customUrl.trim(),
      notes: roasterNotes.trim() || `Dialed-in recipe from ${roasterName}. Optimized for ${brewMethod.replace(/_/g, ' ')}.`
    };

    saveRoasterCoffee(newCoffee);
    const updated = getCustomRoasterCoffees();
    setRegisteredCoffees(updated);
    setSelectedCoffeeForSticker(newCoffee);
    setActiveTab('sticker');
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

  const handleCopyLink = () => {
    if (!activeTargetUrl) return;
    navigator.clipboard.writeText(activeTargetUrl);
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
      recommendedRatio: recommendedRatio || 16.5,
      tempF: tempF || 202,
      recommendedGrind: recommendedGrind || 'Medium-Fine',
      upc: upc || 'LOT-2026-CERTIFIED'
    };

    const targetUrl = customUrl.trim() || generateSmartBagUrl(coffee);

    // Create high-res 300 DPI canvas (1200 x 1800 px for standard 2"x3" or 3"x4.5" commercial bag stickers)
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d');

    // Clean white label background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 1200, 1800);

    // Outer printer bleed & border
    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = 10;
    ctx.strokeRect(30, 30, 1140, 1740);

    // Inner hairline frame
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 1710);

    // Category Top Header
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 22px -apple-system, monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('SPECIALTY COFFEE ROASTERY • SMART BAG CERTIFIED', 70, 105);

    // Roast Level Pill Badge
    const roastText = (coffee.roastLevel || 'LIGHT').toUpperCase();
    ctx.font = 'bold 22px monospace, sans-serif';
    const badgeW = ctx.measureText(roastText).width + 36;
    ctx.fillStyle = '#1C1917';
    ctx.fillRect(1200 - 70 - badgeW, 78, badgeW, 42);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(roastText, 1200 - 70 - badgeW + 18, 107);

    // Roaster Title
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 52px Georgia, "Times New Roman", serif';
    ctx.fillText(coffee.roaster, 70, 180);

    // Roaster Location
    ctx.fillStyle = '#57534E';
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillText(coffee.location || 'Artisan Small Batch', 70, 225);

    // Dividing Rule
    ctx.strokeStyle = '#1C1917';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(70, 255);
    ctx.lineTo(1130, 255);
    ctx.stroke();

    // Coffee Lot Name
    ctx.fillStyle = '#0C0A09';
    ctx.font = 'bold 44px Georgia, serif';
    ctx.fillText(coffee.beanName, 70, 315);

    // Terroir Specs
    ctx.fillStyle = '#44403C';
    ctx.font = '500 26px -apple-system, sans-serif';
    const originStr = `${coffee.origin || 'Single Origin'} • ${coffee.process || 'Washed'} • ${coffee.elevation || 'High Altitude'}`;
    ctx.fillText(originStr, 70, 360);

    // Tasting Notes
    const notesStr = (coffee.tastingNotes || []).slice(0, 4).join(', ');
    if (notesStr) {
      ctx.fillStyle = '#92400E';
      ctx.font = 'italic 26px Georgia, serif';
      ctx.fillText(`Notes: ${notesStr}`, 70, 405);
    }

    // --- PROMINENT "SCAN ME FOR RECIPE" BANNER ---
    const bannerY = 460;
    const bannerH = 75;
    ctx.fillStyle = '#1C1917';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(140, bannerY, 920, bannerH, 37);
      ctx.fill();
    } else {
      ctx.fillRect(140, bannerY, 920, bannerH);
    }

    ctx.fillStyle = '#F59E0B'; // Amber Gold
    ctx.font = 'bold 32px -apple-system, monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨  SCAN ME FOR RECIPE  ✨', 600, bannerY + 49);

    // QR Code generation
    const qrCanvas = document.createElement('canvas');
    await QRCode.toCanvas(qrCanvas, targetUrl, {
      width: 700,
      margin: 1,
      errorCorrectionLevel: 'H',
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    // Draw QR centered
    ctx.drawImage(qrCanvas, 250, 560, 700, 700);

    // Callout subtitle
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 22px monospace, sans-serif';
    ctx.fillText('AIM PHONE CAMERA TO DIAL-IN & BREW', 600, 1315);

    // Extraction Parameter Box
    ctx.fillStyle = '#F5F5F4';
    ctx.fillRect(70, 1360, 1060, 230);
    ctx.strokeStyle = '#D6D3D1';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, 1360, 1060, 230);

    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 20px monospace, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('BARISTA DIAL-IN SPECIFICATIONS', 100, 1400);

    const colW = 1060 / 4;
    const colY = 1455;

    // Col 1: Ratio
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('WATER RATIO', 100, colY);
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 36px monospace, sans-serif';
    ctx.fillText(`1:${coffee.recommendedRatio}`, 100, colY + 45);

    // Col 2: Water Temp
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('WATER TEMP', 100 + colW, colY);
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 36px monospace, sans-serif';
    ctx.fillText(`${coffee.tempF}°F`, 100 + colW, colY + 45);

    // Col 3: Method
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('BREW METHOD', 100 + colW * 2, colY);
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.fillText((coffee.brewMethod || 'pour_over').replace(/_/g, ' '), 100 + colW * 2, colY + 42);

    // Col 4: Grind
    ctx.fillStyle = '#78716C';
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('GRIND SIZE', 100 + colW * 3, colY);
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 26px -apple-system, sans-serif';
    ctx.fillText((coffee.recommendedGrind || 'Medium-Fine').split('(')[0].trim(), 100 + colW * 3, colY + 42);

    // Footer
    ctx.fillStyle = '#A8A29E';
    ctx.font = 'bold 22px monospace, sans-serif';
    ctx.fillText('thebrew.app dial-in', 70, 1660);
    ctx.textAlign = 'right';
    ctx.fillText(`LOT: ${coffee.upc || 'CERTIFIED-LOT'}`, 1130, 1660);

    // Trigger Download to user's device Downloads directory
    const slug = (coffee.beanName || 'coffee').toLowerCase().replace(/[^a-z0-9]/g, '_');
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `smart_bag_sticker_${slug}_print_ready_300dpi.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    const slug = (selectedCoffeeForSticker?.beanName || beanName || 'coffee').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `smart_bag_qr_${slug}_1200px.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadQrSvg = () => {
    if (!qrSvgString) return;
    const blob = new Blob([qrSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = (selectedCoffeeForSticker?.beanName || beanName || 'coffee').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `smart_bag_qr_${slug}_vector.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleOpenLinkInNewTab = () => {
    if (activeTargetUrl) {
      window.open(activeTargetUrl, '_blank');
    }
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
        <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-black/20 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('onboard')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
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
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'sticker'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2. Smart Bag QR Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>3. Registered Coffees ({registeredCoffees.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>4. Walkthrough Video</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6">

          {/* TAB 1: ONBOARD FORM */}
          {activeTab === 'onboard' && (
            <form onSubmit={handleSaveCoffee} className="space-y-6">
              
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
              </div>

              {/* Extraction Parameters Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Roaster's Recommended Dial-In Recipe</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Primary Brew Method</label>
                    <select
                      value={brewMethod}
                      onChange={(e) => setBrewMethod(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold"
                    >
                      <option value="pour_over">Hario V60 (Pour Over)</option>
                      <option value="classic_pour_over">Kalita Wave / Flat Bed</option>
                      <option value="chemex">Chemex</option>
                      <option value="aeropress">AeroPress</option>
                      <option value="espresso">Espresso (9 Bar)</option>
                      <option value="french_press">French Press (Immersion)</option>
                      <option value="moka_pot">Moka Pot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">
                      Golden Ratio (1 : X)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="25"
                      value={recommendedRatio}
                      onChange={(e) => setRecommendedRatio(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Water Temp (°F)</label>
                    <input
                      type="number"
                      min="160"
                      max="212"
                      value={tempF}
                      onChange={(e) => setTempF(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Grind Size Recommendation</label>
                    <input
                      type="text"
                      value={recommendedGrind}
                      onChange={(e) => setRecommendedGrind(e.target.value)}
                      placeholder="e.g. Medium-Fine (650µm)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light focus:outline-none focus:border-amber-gold font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-cream-soft/70 font-mono text-xs mb-1">
                    Roaster's Extraction Technique & Advice
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

              {/* CARD 4: REAL QR CODE DESTINATION & LIVE PREVIEW */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-gold font-mono text-xs uppercase font-bold tracking-wider">
                    <QrCode className="w-4 h-4" />
                    <span>4. Smart Bag QR Code Destination & Live Preview</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateRandomSku}
                    className="text-[11px] font-mono text-amber-gold hover:underline flex items-center gap-1 font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Assign Batch Lot SKU</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-cream-soft/70 font-mono mb-1">
                        Packaging Batch SKU / Lot Code (Optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={upc}
                          onChange={(e) => setUpc(e.target.value)}
                          placeholder="e.g. LOT-2026-WORKA or 850012345099"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
                        />
                        <button
                          type="button"
                          onClick={handleGenerateRandomSku}
                          className="px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-gold font-mono text-xs whitespace-nowrap border border-amber-500/40 transition"
                        >
                          New Lot
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-cream-soft/70 font-mono mb-1">
                        Custom Destination URL (Optional Override)
                      </label>
                      <input
                        type="url"
                        value={customUrl}
                        onChange={(e) => setCustomUrl(e.target.value)}
                        placeholder="Leave blank to auto-generate The Brew App deep link"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light font-mono text-xs focus:outline-none focus:border-amber-gold"
                      />
                      <p className="text-[10px] text-cream-soft/60 mt-1">
                        By default, the QR code encodes a direct deep link with your golden ratio, water temperature, and brew guide pre-configured.
                      </p>
                    </div>
                  </div>

                  {/* Real QR Live Preview Box */}
                  <div className="p-4 rounded-2xl bg-white text-stone-900 border border-amber-gold/50 flex flex-col items-center justify-center shadow-inner text-center">
                    <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest font-bold mb-2">
                      Live Generated QR Code
                    </span>
                    
                    <div className="p-2 bg-white rounded-xl shadow-md border border-stone-200">
                      {miniQrDataUrl ? (
                        <img
                          src={miniQrDataUrl}
                          alt="Real QR Code Live Preview"
                          className="w-32 h-32 object-contain"
                        />
                      ) : (
                        <div className="w-32 h-32 flex items-center justify-center text-stone-400 font-mono text-xs">
                          Generating QR...
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] font-mono text-emerald-700 font-bold mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Scannable with any phone camera right now</span>
                    </span>
                  </div>
                </div>
              </div>

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
                  className="px-6 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20"
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
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
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
                  onClick={handleOpenLinkInNewTab}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                  title="Open the generated link in a new tab to test customer experience"
                >
                  <ExternalLink className="w-4 h-4 text-amber-gold" />
                  <span>Test Link</span>
                </button>
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
                          {onSelectBeanToBrew && (
                            <button
                              onClick={() => {
                                onSelectBeanToBrew(c);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-gold/20 hover:bg-amber-gold text-amber-gold hover:text-espresso-950 text-[11px] font-mono font-bold flex items-center gap-1 border border-amber-500/30 transition"
                            >
                              <span>Dial-In</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}

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
