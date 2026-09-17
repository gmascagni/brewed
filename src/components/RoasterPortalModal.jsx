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
  AlertCircle,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { getRoasterTelemetry } from '../utils/telemetry';
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
  downloadBrotherQlStickerPng,
  downloadVectorQrSvg, 
  downloadHighResQrPng 
} from '../services/packagingAssetPipeline';
import { printBrotherQlCoffee, printHtmlElementIsolated } from '../utils/printLabel';

export default function RoasterPortalModal({
  isOpen,
  onClose,
  prefilledBarcode = '',
  prefilledBean = null,
  onSelectBeanToBrew,
  currentUser = null,
  onOpenAuth = null
}) {
  const isRoasterAuthenticated = Boolean(
    currentUser && (currentUser.role === 'roaster' || currentUser.isVerifiedRoaster) && currentUser.email
  );

  const [activeTab, setActiveTab] = useState(() => (prefilledBarcode || prefilledBean ? 'onboard' : 'video')); // 'video' | 'onboard' | 'sticker' | 'catalog' | 'telemetry'
  const [qrLayout, setQrLayout] = useState('thermal'); // 'thermal' | 'badge' | 'minimal' | 'brother_ql'
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

  const handleWebsiteChange = (e) => {
    let val = e.target.value;
    val = val.replace(/^(https?):\/+([^\/])/i, '$1://$2');
    val = val.replace(/^(https?):\/{3,}$/i, '$1://');
    if (val === 'https:/' && (website === 'https:' || website === '')) {
      val = 'https://';
    } else if (val === 'http:/' && (website === 'http:' || website === '')) {
      val = 'http://';
    }
    setWebsite(val);
  };

  const handleWebsiteBlur = () => {
    if (!website) return;
    let s = website.trim();
    if (/^https?:\/*$/i.test(s)) {
      setWebsite('');
      return;
    }
    s = s.replace(/^(https?):\/+([^\/])/i, '$1://$2');
    s = s.replace(/^(https?):\/{3,}/i, '$1://');
    if (!/^https?:\/\//i.test(s)) {
      s = `https://${s}`;
    }
    setWebsite(s);
  };

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

  // Load custom registered coffees from registry on open (filtered to authenticated roaster)
  useEffect(() => {
    if (isOpen) {
      const list = isRoasterAuthenticated ? getCustomRoasterCoffees(currentUser?.email) : [];
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
  }, [isOpen, prefilledBarcode, prefilledBean, isRoasterAuthenticated, currentUser]);

  // Pre-fill roastery brand name from authenticated roaster account
  useEffect(() => {
    if (currentUser?.roasterName && !roasterName) {
      setRoasterName(currentUser.roasterName);
    }
  }, [currentUser]);

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
    const isBrotherLayout = qrLayout === 'brother_ql';
    const targetUrl = customUrl.trim() || generateSmartBagUrl(coffee, null, { compact: isBrotherLayout });
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

    const effectiveEcc = isBrotherLayout ? 'M' : qrEcc;
    const effectiveMargin = isBrotherLayout ? 1 : 2;

    Promise.all([
      QRCode.toDataURL(targetUrl, {
        width: 1200,
        margin: effectiveMargin,
        errorCorrectionLevel: effectiveEcc,
        color: { dark: darkColor, light: lightColor }
      }),
      QRCode.toString(targetUrl, {
        type: 'svg',
        margin: effectiveMargin,
        errorCorrectionLevel: effectiveEcc,
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
  }, [selectedCoffeeForSticker, roasterName, beanName, brewMethod, recommendedRatio, tempF, recommendedGrind, upc, customUrl, qrColor, qrEcc, qrLayout]);

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
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || '',
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
      notes: roasterNotes.trim() || `Dialed-in recipe from ${trimmedRoaster}. Optimized for ${String(brewMethod || 'pour_over').replace(/_/g, ' ')}.`
    };

    saveRoasterCoffee(newCoffee, currentUser);

    // Save custom roaster profile with uploaded logoImage for RoasterProfilePage background
    saveCustomRoasterProfile({
      name: trimmedRoaster,
      slug: trimmedRoaster.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      location: location.trim(),
      website: normalizedWebsite,
      logoImage: logoImage || '',
      backgroundImage: logoImage || '',
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    }, currentUser);

    const updated = getCustomRoasterCoffees(currentUser?.email);
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
    if (confirm('Remove this coffee from your Roaster Registry?')) {
      const remaining = deleteRoasterCoffee(id, currentUser);
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

  const checkBarcodeOwnership = () => {
    if (!isRoasterAuthenticated) {
      alert('Authentication Required: Only verified roasters can generate barcodes for coffee packaging.');
      if (onOpenAuth) onOpenAuth({ role: 'roaster', mode: 'login' });
      return false;
    }
    if (selectedCoffeeForSticker?.ownerEmail && selectedCoffeeForSticker.ownerEmail !== currentUser?.email) {
      alert(`Authorization Protected: You are signed in as ${currentUser?.email}, but this coffee belongs to ${selectedCoffeeForSticker.ownerEmail}. Only the verified brand owner can generate packaging barcodes for this coffee.`);
      return false;
    }
    return true;
  };

  const handlePrintSticker = async () => {
    if (!checkBarcodeOwnership()) return;
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
      customUrl: customUrl.trim(),
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    };

    if (qrLayout === 'brother_ql') {
      await printBrotherQlCoffee(coffee);
    } else if (stickerRef.current) {
      await printHtmlElementIsolated(stickerRef.current, {
        width: qrLayout === 'minimal' ? '2.5in' : '3in',
        height: qrLayout === 'minimal' ? '2.5in' : '3in',
        title: `${coffee.beanName || 'Coffee'} Label`
      });
    } else {
      await printBrotherQlCoffee(coffee);
    }
  };

  const handleDownloadBrotherQlPng = async () => {
    if (!checkBarcodeOwnership()) return;
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
      customUrl: customUrl.trim(),
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    };

    if (orchestrator?.downloadBrotherQlSticker) {
      await orchestrator.downloadBrotherQlSticker(coffee);
    } else {
      await downloadBrotherQlStickerPng(coffee);
    }
  };

  const handleDownloadFullStickerPng = async () => {
    if (!checkBarcodeOwnership()) return;
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
      customUrl: customUrl.trim(),
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    };

    if (qrLayout === 'brother_ql') {
      if (orchestrator?.downloadBrotherQlSticker) {
        await orchestrator.downloadBrotherQlSticker(coffee);
      } else {
        await downloadBrotherQlStickerPng(coffee);
      }
      return;
    }

    if (orchestrator) {
      await orchestrator.downloadSticker(coffee);
    } else {
      await downloadCompleteStickerPng(coffee);
    }
  };

  const handleDownloadQrPng = async () => {
    if (!checkBarcodeOwnership()) return;
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      customUrl: customUrl.trim(),
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    };

    if (orchestrator) {
      await orchestrator.downloadQr(coffee, 1200);
    } else {
      await downloadHighResQrPng(coffee, 1200);
    }
  };

  const handleDownloadQrSvg = async () => {
    if (!checkBarcodeOwnership()) return;
    const coffee = selectedCoffeeForSticker || {
      roaster: roasterName || 'Specialty Roaster',
      beanName: beanName || 'Single Origin Lot',
      customUrl: customUrl.trim(),
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || ''
    };

    if (orchestrator) {
      await orchestrator.downloadVector(coffee);
    } else {
      await downloadVectorQrSvg(coffee);
    }
  };

  const ensureDraftSaved = () => {
    const trimmedRoaster = (selectedCoffeeForSticker?.roaster || roasterName || '').trim();
    const trimmedBean = (selectedCoffeeForSticker?.beanName || beanName || '').trim();
    if (!trimmedRoaster && !trimmedBean) return null;

    const rName = trimmedRoaster || 'Specialty Roastery';
    const bName = trimmedBean || 'Single Origin Lot';
    const slug = rName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    const coffeeRecord = selectedCoffeeForSticker || {
      id: `roaster_${Date.now()}`,
      ownerEmail: currentUser?.email || '',
      ownerUid: currentUser?.uid || '',
      roaster: rName,
      location: location.trim() || 'Artisan Small Batch',
      website: website.trim() || 'https://thebrew.app',
      logoImage: logoImage || '',
      beanName: bName,
      origin: origin.trim() || 'Single Origin',
      varietal: varietal.trim() || 'Specialty Lot',
      process: process || 'Washed',
      elevation: elevation || '1,800+ MASL',
      roastLevel: roastLevel || 'Light-Medium',
      tastingNotes: tastingNotesInput ? tastingNotesInput.split(',').map(s => s.trim()).filter(Boolean) : ['Floral', 'Fruit', 'Balanced'],
      brewMethod: brewMethod || 'pour_over',
      recommendedRatio: Number(recommendedRatio) || 16.5,
      tempF: Number(tempF) || 202,
      tempC: Math.round(((Number(tempF || 202) - 32) * 5) / 9),
      recommendedGrind: recommendedGrind.trim() || 'Medium-Fine',
      brewTime: brewTime.trim() || '3m 15s',
      upc: upc.trim() || `LOT-${Date.now().toString().slice(-6)}`,
      customUrl: customUrl.trim(),
      notes: roasterNotes.trim() || `Dialed-in recipe from ${rName}.`
    };

    try {
      saveCustomRoasterProfile({
        name: rName,
        slug,
        location: location.trim(),
        website: website.trim(),
        logoImage: logoImage || '',
        backgroundImage: logoImage || '',
        ownerEmail: currentUser?.email || '',
        ownerUid: currentUser?.uid || ''
      }, currentUser);
      saveRoasterCoffee(coffeeRecord, currentUser);
      const updated = getCustomRoasterCoffees(currentUser?.email);
      setRegisteredCoffees(updated);
      setSelectedCoffeeForSticker(coffeeRecord);
    } catch (e) {
      console.warn('Auto-save draft on test link error:', e);
    }
    return coffeeRecord;
  };

  const handleOpenLinkInNewTab = () => {
    ensureDraftSaved();
    const targetUrl = getResolvedTargetUrl();
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleNavigateToPortfolio = () => {
    ensureDraftSaved();
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

        {/* Tab Navigation - Step 1 Walkthrough Video is First */}
        <div 
          className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-white/10 bg-black/20 overflow-x-auto overflow-y-hidden no-scrollbar text-xs font-mono shrink-0 select-none [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <button
            onClick={() => setActiveTab('video')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'video'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Play className="w-3.5 h-3.5 shrink-0" />
            <span>1. Walkthrough Video (How It Works)</span>
          </button>

          <button
            onClick={() => setActiveTab('onboard')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'onboard'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>2. Onboard Coffee & Recipe</span>
            {!isRoasterAuthenticated && <Lock className="w-3 h-3 text-stone-400 opacity-60 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('sticker')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'sticker'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 shrink-0" />
            <span>3. Smart Bag QR Studio</span>
            {!isRoasterAuthenticated && <Lock className="w-3 h-3 text-stone-400 opacity-60 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>4. Registered Coffees ({registeredCoffees.length})</span>
            {!isRoasterAuthenticated && <Lock className="w-3 h-3 text-stone-400 opacity-60 ml-0.5" />}
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 ${
              activeTab === 'telemetry'
                ? 'bg-amber-gold text-espresso-950 shadow'
                : 'text-cream-soft hover:text-cream-light bg-white/[0.04]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>5. Telemetry & Analytics</span>
            {!isRoasterAuthenticated && <Lock className="w-3 h-3 text-stone-400 opacity-60 ml-0.5" />}
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

          {/* Verified Roaster Active Banner */}
          {isRoasterAuthenticated && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border border-amber-gold/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-cream-light">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Authenticated Roaster: <strong className="text-amber-gold">{currentUser.roasterName || currentUser.displayName}</strong> ({currentUser.email})
                </span>
              </div>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                🛡️ Verified Brand Owner
              </span>
            </div>
          )}

          {/* Unauthenticated Roaster Gate for Protected Tabs */}
          {activeTab !== 'video' && !isRoasterAuthenticated && (
            <RoasterAuthGate
              onOpenAuth={onOpenAuth}
              onReturnToVideo={() => setActiveTab('video')}
            />
          )}

          {/* TAB 1: ONBOARD FORM (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'onboard' && (
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
                    <label className="block text-cream-soft/70 font-mono mb-1">Location (City, State)</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Greenville, SC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-cream-soft/70 font-mono mb-1">Website / Store URL</label>
                    <input
                      type="text"
                      inputMode="url"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      style={{ fontVariantLigatures: 'none' }}
                      value={website}
                      onChange={handleWebsiteChange}
                      onBlur={handleWebsiteBlur}
                      placeholder="https://methodicalcoffee.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-cream-light placeholder-cream-soft/40 focus:outline-none focus:border-amber-gold"
                    />
                    <span className="block mt-1 text-[10px] text-cream-soft/50 font-mono">
                      Tip: Enter bare domain (e.g. methodicalcoffee.com) or full https:// URL
                    </span>
                  </div>
                </div>

                {/* Brand Logo Upload */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-cream-soft/80 font-mono text-xs flex items-center gap-1.5 font-bold">
                      <UploadCloud className="w-3.5 h-3.5 text-amber-gold" />
                      <span>Roastery Brand Logo (Showcase & Packaging)</span>
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
                            ✓ Ready for packaging stickers & showcase page
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
                        This logo appears on your Roaster Showcase page & prints on Smart Bag stickers.
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

          {/* TAB 2: SMART BAG QR STUDIO (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'sticker' && (
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

                    <button
                      type="button"
                      onClick={() => setQrLayout('brother_ql')}
                      className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition font-bold ${
                        qrLayout === 'brother_ql'
                          ? 'bg-amber-gold text-espresso-950 shadow'
                          : 'bg-white/[0.06] text-cream-soft hover:text-white'
                      }`}
                      title="Brother QL-600 / QL-800 thermal roll label (DK-1209 1.1x2.4 / 29x62mm)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Brother QL-600 (1.1"x2.4")</span>
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
                    className="w-full max-w-sm rounded-2xl bg-white text-stone-950 p-6 shadow-2xl border-2 border-stone-800 text-center space-y-3 font-sans relative overflow-hidden"
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
                          {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}
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
                    className="w-full max-w-sm rounded-3xl bg-[#1A120B] border-2 border-amber-gold/60 p-6 shadow-2xl text-center space-y-4 text-cream-light relative overflow-hidden"
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
                          {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}
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
                    className="w-72 h-72 rounded-3xl bg-white text-stone-900 p-5 shadow-2xl border-2 border-stone-800 text-center flex flex-col justify-between"
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

                {/* LAYOUT 4: BROTHER QL-600 COMPACT THERMAL LABEL (1.1" x 2.4" / DK-1209) */}
                {qrLayout === 'brother_ql' && (
                  <div 
                    ref={stickerRef}
                    className="w-full max-w-lg h-56 rounded-xl bg-white text-stone-900 p-3 shadow-2xl border-2 border-stone-800 flex items-stretch justify-between gap-3 relative overflow-hidden select-none"
                  >
                    {/* Left Details Column */}
                    <div className="flex-1 flex flex-col justify-between h-full min-w-0 pr-1">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[8px] font-mono uppercase tracking-wider font-extrabold bg-stone-900 text-white px-1.5 py-0.5 rounded">
                            THEBREW.APP
                          </span>
                          <span className="text-[8px] font-mono text-stone-500 uppercase tracking-tight truncate">
                            {selectedCoffeeForSticker?.roastLevel || roastLevel || 'Light'} Roast
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-stone-950 truncate leading-tight">
                          {selectedCoffeeForSticker?.roaster || roasterName || 'Specialty Roaster'}
                        </h4>
                        <p className="text-xs text-stone-700 font-medium truncate font-sans">
                          {selectedCoffeeForSticker?.beanName || beanName || 'Single Origin Lot'}
                        </p>
                        <p className="text-[9px] text-amber-800 font-serif italic truncate mt-0.5">
                          {tastingNotesInput ? tastingNotesInput : 'Peach, Jasmine, Honey'}
                        </p>
                      </div>

                      {/* 4-Cell Dial-In Matrix */}
                      <div className="grid grid-cols-4 gap-1 py-1 px-1.5 bg-stone-100 rounded-md border border-stone-200 text-[8px] font-mono">
                        <div>
                          <span className="text-stone-500 block text-[7px] uppercase leading-none">Ratio</span>
                          <span className="font-bold text-amber-800">
                            1:{selectedCoffeeForSticker?.recommendedRatio || recommendedRatio}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[7px] uppercase leading-none">Temp</span>
                          <span className="font-bold text-stone-900">
                            {selectedCoffeeForSticker?.tempF || tempF}°F
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[7px] uppercase leading-none">Method</span>
                          <span className="font-bold text-stone-900 capitalize truncate block">
                            {(selectedCoffeeForSticker?.brewMethod || brewMethod || 'pour_over').replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-500 block text-[7px] uppercase leading-none">Grind</span>
                          <span className="font-bold text-stone-900 truncate block">
                            {selectedCoffeeForSticker?.recommendedGrind || recommendedGrind || 'Med-Fine'}
                          </span>
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[8px] font-mono text-stone-500 pt-1 border-t border-stone-200">
                        <span className="truncate">{selectedCoffeeForSticker?.upc || upc || 'DK-1209 SPEC'}</span>
                        <span className="font-bold text-stone-800">Scan for Recipe</span>
                      </div>
                    </div>

                    {/* Right QR Column: Maximized Full-Height QR Code */}
                    <div className="flex flex-col items-center justify-center flex-shrink-0 bg-white p-1 rounded-lg border border-stone-300 h-full aspect-square">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="Brother QL Smart Bag QR Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-[9px]">
                          Generating...
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Action Buttons for QR Studio */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={qrLayout === 'brother_ql' ? handleDownloadBrotherQlPng : handleDownloadFullStickerPng}
                  className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition"
                  title={qrLayout === 'brother_ql' ? 'Download 300 DPI Brother QL-600 (1.1" x 2.4") thermal label PNG' : 'Download complete 300 DPI composite packaging sticker PNG ready to email or upload to your printer'}
                >
                  <Download className="w-4 h-4 text-espresso-950" />
                  <span>
                    {qrLayout === 'brother_ql' ? 'Download Brother QL Label (1.1"x2.4" PNG)' : 'Download Complete Sticker (PNG)'}
                  </span>
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

          {/* TAB 3: REGISTERED COFFEES CATALOG (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'catalog' && (
            <div className="space-y-4">
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
                          <span className="capitalize">{(c.brewMethod || 'pour_over').replace(/_/g, ' ')}</span>
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
                  onClick={() => {
                    if (!isRoasterAuthenticated && onOpenAuth) {
                      onOpenAuth({ role: 'roaster', mode: 'signup' });
                    } else {
                      setActiveTab('onboard');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-gold hover:bg-amber-300 text-espresso-950 font-bold text-xs flex items-center gap-1.5 shadow transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>2. Start Onboarding Recipe</span>
                </button>
              </div>

              <RoasterVideoPlayer
                onStartOnboarding={() => {
                  if (!isRoasterAuthenticated && onOpenAuth) {
                    onOpenAuth({ role: 'roaster', mode: 'signup' });
                  } else {
                    setActiveTab('onboard');
                  }
                }}
              />
            </div>
          )}

          {/* TAB 5: TELEMETRY & CONSUMER EXTRACTION ANALYTICS */}
          {isRoasterAuthenticated && activeTab === 'telemetry' && (() => {
            const telemetry = getRoasterTelemetry(activeRoasterKey || 'methodical');
            const totalMethods = Object.values(telemetry.methodsUsed || {}).reduce((a, b) => a + b, 0) || 1;
            return (
              <div className="space-y-6 animate-fade-in">
                {/* Telemetry Header */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-espresso-900 to-espresso-950 border border-white/10 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold text-[10px] font-mono font-bold uppercase tracking-wider mb-2 border border-amber-gold/40">
                        <Sparkles className="w-3 h-3" />
                        <span>Roaster Telemetry Engine</span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-cream-light">
                        Consumer Extraction & Dial-In Telemetry
                      </h3>
                      <p className="text-xs text-cream-soft max-w-2xl mt-1">
                        Anonymized real-time extraction metrics captured when specialty coffee drinkers scan your retail bags and execute Guided Brew recipes.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 self-start sm:self-auto">
                      🟢 Live Telemetry Stream
                    </span>
                  </div>
                </div>

                {/* KPI Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-400 font-sans">Total Guided Dial-Ins</span>
                    <div className="font-serif text-3xl font-bold text-cream-light mt-1">
                      {telemetry.totalDialIns}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-block">
                      Home extractions executed
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-400 font-sans">Average Customer Ratio</span>
                    <div className="font-serif text-3xl font-bold text-amber-gold mt-1">
                      1:{telemetry.avgRatio}
                    </div>
                    <span className="text-[11px] font-mono text-stone-400 mt-1 inline-block">
                      Golden cup dialed-in range
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-400 font-sans">Weekly Showcase Views</span>
                    <div className="font-serif text-3xl font-bold text-cream-light mt-1">
                      {telemetry.weeklyViews}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 mt-1 inline-block">
                      Connoisseur impressions
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-stone-400 font-sans">Top Dialed Bean</span>
                    <div className="font-serif text-lg font-bold text-amber-gold mt-2 line-clamp-1">
                      {Object.keys(telemetry.topBeans || {})[0] || 'Single-Origin'}
                    </div>
                    <span className="text-[11px] font-mono text-stone-400 mt-1 inline-block">
                      Customer favorite lot
                    </span>
                  </div>
                </div>

                {/* Extraction Method Distribution Bar */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <h4 className="font-serif text-base font-bold text-cream-light flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-gold" />
                    <span>Customer Extraction Method Distribution</span>
                  </h4>
                  <div className="space-y-3 text-xs font-mono">
                    {Object.entries(telemetry.methodsUsed || {}).map(([method, count]) => {
                      const pct = Math.round((count / totalMethods) * 100);
                      const mName = String(method || 'pour_over').replace(/_/g, ' ').toUpperCase();
                      return (
                        <div key={method} className="space-y-1">
                          <div className="flex justify-between text-stone-300">
                            <span>{mName}</span>
                            <span>{pct}% ({count} brews)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden border border-white/10">
                            <div className="h-full bg-gradient-to-r from-amber-gold to-[#A25A24] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Partner Tiers & Commercial Value */}
                <div className="p-6 rounded-2xl bg-espresso-900/60 border border-white/15 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-cream-light">
                        Roaster Partner Tiers & Data Resale Intelligence
                      </h4>
                      <p className="text-xs text-stone-400">
                        Generous free tools for all specialty roasters, with premium extraction analytics for production roasters.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Free Tier */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-cream-light">Roaster Free Tier</span>
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">FREE</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mb-3">Permanent catalog & packaging setup.</p>
                        <ul className="text-xs text-stone-300 space-y-1.5">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlimited coffee registrations</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Thermal label QR sticker generation</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-click recipe dial-in syncing</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Basic 7-day dial-in counters</li>
                        </ul>
                      </div>
                      <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-emerald-400 font-bold">
                        ✓ Included with your account
                      </div>
                    </div>

                    {/* Pro Telemetry Pack */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-gold/40 flex flex-col justify-between shadow-lg">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-sm text-amber-gold">Market Intelligence Pro</span>
                          <span className="text-xs font-mono font-bold text-amber-gold bg-amber-gold/20 px-2 py-0.5 rounded">$19 / mo</span>
                        </div>
                        <p className="text-[11px] text-stone-300 mb-3">Actionable data intelligence to refine your roast curves.</p>
                        <ul className="text-xs text-stone-200 space-y-1.5">
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Granular customer extraction drift reports</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Customer grinder micron distribution analytics</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Water chemistry pairing correlations (GH/KH)</li>
                          <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-amber-gold" /> Dedicated roaster showcase sponsor badge</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('Roaster Telemetry Pro Pack requested! Our partner engineering team is generating your deep extraction reports.')}
                        className="mt-4 w-full py-2 rounded-xl btn-tactile-amber text-espresso-950 font-bold text-xs shadow-md active:scale-95"
                      >
                        Activate Telemetry Pro ($19/mo)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}

function RoasterAuthGate({ onOpenAuth, onReturnToVideo }) {
  return (
    <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1E140F] to-[#120B08] border-2 border-amber-gold/40 text-center space-y-6 shadow-2xl animate-fade-in my-6 max-w-2xl mx-auto">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-gold flex items-center justify-center text-amber-gold shadow-lg shadow-amber-500/10">
        <Store className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-gold/20 text-amber-gold text-xs font-mono font-bold uppercase tracking-widest border border-amber-gold/40">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Roaster Identity Required</span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-light">
          Authenticate Your Roastery Account
        </h3>
        <p className="text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
          To protect intellectual property and recipe integrity, every recipe, water specification, brew profile, and retail packaging barcode strictly belongs to the authenticated roaster.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-black/50 border border-white/10 text-left space-y-3 max-w-lg mx-auto text-xs font-mono text-stone-300">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Authentic Email Authentication:</strong> Register using any email address you own (e.g., @gmail.com, @yourroastery.com, etc.).</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Exclusive Recipe & Water Control:</strong> Dial-in recipes, grinder microns, and water specs remain strictly owned by your roastery.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span><strong>Authorized Packaging Barcodes:</strong> Only verified brand owners can generate packaging barcodes, vector SVGs, and thermal stickers.</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => onOpenAuth && onOpenAuth({ role: 'roaster', mode: 'signup' })}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl btn-tactile-amber text-espresso-950 font-extrabold text-xs uppercase tracking-wider shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Store className="w-4 h-4" />
          <span>Create Verified Roaster Account</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenAuth && onOpenAuth({ role: 'roaster', mode: 'login' })}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-light font-bold text-xs uppercase tracking-wider border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Sign In as Existing Roaster</span>
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={onReturnToVideo}
          className="text-xs text-stone-400 hover:text-amber-gold transition underline font-mono cursor-pointer"
        >
          ← Return to Educational Walkthrough Video
        </button>
      </div>
    </div>
  );
}
