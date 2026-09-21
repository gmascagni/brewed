import React, { useState, useEffect, useRef } from 'react';
import {
  Store,
  QrCode,
  X,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Play,
  Lock,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import {
  getCustomRoasterCoffees,
  saveRoasterCoffee,
  deleteRoasterCoffee,
  generateSmartBagUrl,
  saveCustomRoasterProfile
} from '../data/roasterRegistry';
import { useAppOrchestrator } from '../context/AppOrchestratorContext';
import { 
  downloadCompleteStickerPng, 
  downloadBrotherQlStickerPng,
  downloadBrotherQlMinimalStickerPng,
  downloadVectorQrSvg, 
  downloadHighResQrPng 
} from '../services/packagingAssetPipeline';
import { printBrotherQlCoffee, printHtmlElementIsolated } from '../utils/printLabel';
import RoasterVideoTab from './portal/RoasterVideoTab';
import RoasterOnboardTab from './portal/RoasterOnboardTab';
import RoasterStickerStudioTab from './portal/RoasterStickerStudioTab';
import RoasterCatalogTab from './portal/RoasterCatalogTab';
import RoasterTelemetryTab from './portal/RoasterTelemetryTab';
import RoasterAuthGate from './portal/RoasterAuthGate';

export default function RoasterPortalModal({
  isOpen,
  onClose,
  prefilledBarcode = '',
  prefilledBean = null,
  onSelectBeanToBrew,
  onNavigateToRoaster = null,
  currentUser = null,
  onOpenAuth = null
}) {
  const isRoasterAuthenticated = Boolean(
    currentUser && (currentUser.role === 'roaster' || currentUser.isVerifiedRoaster) && currentUser.email
  );

  const [activeTab, setActiveTab] = useState(() => (prefilledBarcode || prefilledBean ? 'onboard' : 'video'));
  const [qrLayout, setQrLayoutState] = useState(() => {
    try {
      return localStorage.getItem('the_brew_app_label_layout') || 'brother_ql';
    } catch {
      return 'brother_ql';
    }
  });

  const setQrLayout = (newLayout) => {
    setQrLayoutState(newLayout);
    try {
      localStorage.setItem('the_brew_app_label_layout', newLayout);
    } catch {}
  };

  const [qrColor, setQrColor] = useState('black');
  const [qrEcc, setQrEcc] = useState('H');
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
    const isBrotherLayout = qrLayout === 'brother_ql' || qrLayout === 'brother_ql_minimal';
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

    if (qrLayout === 'brother_ql_minimal') {
      await printBrotherQlCoffee(coffee, { minimal: true, layout: 'brother_ql_minimal' });
    } else if (qrLayout === 'brother_ql') {
      await printBrotherQlCoffee(coffee);
    } else if (stickerRef.current) {
      await printHtmlElementIsolated(stickerRef.current, {
        width: qrLayout === 'minimal' ? '2.5in' : '3in',
        height: qrLayout === 'minimal' ? '2.5in' : '3in',
        title: `${coffee.beanName || 'Coffee'} Label`
      });
    } else {
      await printBrotherQlCoffee(coffee, { minimal: true, layout: 'brother_ql_minimal' });
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

  const handleDownloadBrotherQlMinimalPng = async () => {
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

    if (orchestrator?.downloadBrotherQlMinimalSticker) {
      await orchestrator.downloadBrotherQlMinimalSticker(coffee);
    } else {
      await downloadBrotherQlMinimalStickerPng(coffee);
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

    if (qrLayout === 'brother_ql_minimal') {
      await handleDownloadBrotherQlMinimalPng();
      return;
    }

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
    if (onNavigateToRoaster) {
      onNavigateToRoaster(slug);
    } else {
      navigate(`/roasters/${slug}`);
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
            className="p-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition cursor-pointer"
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
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-2 font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
            className={`px-3.5 sm:px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0 cursor-pointer ${
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
            <RoasterOnboardTab
              formError={formError}
              roasterName={roasterName}
              setRoasterName={setRoasterName}
              location={location}
              setLocation={setLocation}
              website={website}
              handleWebsiteChange={handleWebsiteChange}
              handleWebsiteBlur={handleWebsiteBlur}
              logoImage={logoImage}
              logoFileName={logoFileName}
              handleLogoUpload={handleLogoUpload}
              handleRemoveLogo={handleRemoveLogo}
              beanName={beanName}
              setBeanName={setBeanName}
              origin={origin}
              setOrigin={setOrigin}
              varietal={varietal}
              setVarietal={setVarietal}
              process={process}
              setProcess={setProcess}
              elevation={elevation}
              setElevation={setElevation}
              roastLevel={roastLevel}
              setRoastLevel={setRoastLevel}
              tastingNotesInput={tastingNotesInput}
              setTastingNotesInput={setTastingNotesInput}
              upc={upc}
              setUpc={setUpc}
              handleGenerateRandomSku={handleGenerateRandomSku}
              brewMethod={brewMethod}
              setBrewMethod={setBrewMethod}
              recommendedRatio={recommendedRatio}
              setRecommendedRatio={setRecommendedRatio}
              tempF={tempF}
              setTempF={setTempF}
              recommendedGrind={recommendedGrind}
              setRecommendedGrind={setRecommendedGrind}
              roasterNotes={roasterNotes}
              setRoasterNotes={setRoasterNotes}
              handleSaveCoffee={handleSaveCoffee}
              onClose={onClose}
            />
          )}

          {/* TAB 2: SMART BAG QR STUDIO (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'sticker' && (
            <RoasterStickerStudioTab
              registeredCoffees={registeredCoffees}
              selectedCoffeeForSticker={selectedCoffeeForSticker}
              setSelectedCoffeeForSticker={setSelectedCoffeeForSticker}
              qrLayout={qrLayout}
              setQrLayout={setQrLayout}
              qrColor={qrColor}
              setQrColor={setQrColor}
              qrEcc={qrEcc}
              setQrEcc={setQrEcc}
              stickerRef={stickerRef}
              roasterName={roasterName}
              location={location}
              roastLevel={roastLevel}
              beanName={beanName}
              origin={origin}
              process={process}
              elevation={elevation}
              tastingNotesInput={tastingNotesInput}
              qrDataUrl={qrDataUrl}
              recommendedRatio={recommendedRatio}
              tempF={tempF}
              brewMethod={brewMethod}
              recommendedGrind={recommendedGrind}
              upc={upc}
              handleDownloadBrotherQlMinimalPng={handleDownloadBrotherQlMinimalPng}
              handleDownloadBrotherQlPng={handleDownloadBrotherQlPng}
              handleDownloadFullStickerPng={handleDownloadFullStickerPng}
              handlePrintSticker={handlePrintSticker}
              handleDownloadQrSvg={handleDownloadQrSvg}
              handleDownloadQrPng={handleDownloadQrPng}
              handleCopyLink={handleCopyLink}
              copySuccess={copySuccess}
              handleOpenLinkInNewTab={handleOpenLinkInNewTab}
              handleNavigateToPortfolio={handleNavigateToPortfolio}
              activeTargetUrl={activeTargetUrl}
              getResolvedTargetUrl={getResolvedTargetUrl}
            />
          )}

          {/* TAB 3: REGISTERED COFFEES CATALOG (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'catalog' && (
            <RoasterCatalogTab
              registeredCoffees={registeredCoffees}
              currentUser={currentUser}
              setActiveTab={setActiveTab}
              setSelectedCoffeeForSticker={setSelectedCoffeeForSticker}
              orchestrator={orchestrator}
              onSelectBeanToBrew={onSelectBeanToBrew}
              onClose={onClose}
              handleDelete={handleDelete}
            />
          )}

          {/* TAB 4: EDUCATIONAL WALKTHROUGH VIDEO (Available to all visitors) */}
          {activeTab === 'video' && (
            <RoasterVideoTab
              isRoasterAuthenticated={isRoasterAuthenticated}
              onOpenAuth={onOpenAuth}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 5: TELEMETRY & ANALYTICS (Gated to authenticated roasters) */}
          {isRoasterAuthenticated && activeTab === 'telemetry' && (
            <RoasterTelemetryTab
              activeRoasterKey={selectedCoffeeForSticker?.roaster || roasterName || 'methodical'}
            />
          )}

        </div>
      </div>
    </div>
  );
}
