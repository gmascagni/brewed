import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  ScanLine, 
  QrCode, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Coffee, 
  Scale, 
  Flame, 
  MapPin, 
  Upload, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  Sliders,
  BookmarkPlus,
  Store,
  Loader2,
  Mail,
  Download,
  Printer,
  FileText,
  Cpu
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import jsQR from 'jsqr';
import { getRegisteredCoffees, fetchRemoteCoffeeByCode, saveRoasterCoffee } from '../data/roasterRegistry';
import { useAppOrchestrator } from '../context/AppOrchestratorContext';
import { createCoffeeProfile } from '../models/coffeeProfile';
import { hapticScan } from '../utils/haptics';
import { performBagOcr, parseCoffeeBagLabel, generateTargetBrewRecipe } from '../utils/bagLabelOcr';
import { getSavedGrinderId } from '../data/grinderProfiles';

import { VERIFIED_BEAN_CATALOG } from '../data/verifiedBeans';
export { VERIFIED_BEAN_CATALOG };
import { parseRecipePayload } from '../utils/recipeParser';

export default function BarcodeScannerModal({
  isOpen,
  onClose,
  onApplyRecipe,
  onSaveToJournal,
  onOpenRoasterPortal,
  onOpenRoasterInfo
}) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);
  const [matchedBean, setMatchedBean] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [uncatalogedResult, setUncatalogedResult] = useState(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState(null);
  const [isSnapshotScanning, setIsSnapshotScanning] = useState(false);
  const [shutterFlash, setShutterFlash] = useState(false);
  const [scanNotice, setScanNotice] = useState(null);

  // AI Bag Scanning (Camera OCR) Mode & State
  const [scannerMode, setScannerMode] = useState('barcode'); // 'barcode' | 'ai_label'
  const [ocrProgress, setOcrProgress] = useState({ status: '', progress: 0 });
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [aiBagResult, setAiBagResult] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  let orchestrator = null;
  try {
    orchestrator = useAppOrchestrator();
  } catch {}

  // Initialize camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedResult(null);
      setMatchedBean(null);
      setUncatalogedResult(null);
      setManualCode('');
      setCapturedSnapshot(null);
      setIsSnapshotScanning(false);
      setScanNotice(null);
      setShutterFlash(false);
      setAiBagResult(null);
      setIsOcrRunning(false);
      setOcrProgress({ status: '', progress: 0 });
    }
    return () => stopCamera();
  }, [isOpen]);

  // Handle mode switching between Barcode and AI Label OCR
  useEffect(() => {
    if (scannerMode === 'ai_label') {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    } else if (cameraActive && !capturedSnapshot) {
      startScanLoop();
    }
  }, [scannerMode, cameraActive, capturedSnapshot]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      // Prefer rear environment-facing camera on mobile devices
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        startScanLoop();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can upload a photo or enter a barcode manually below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  /**
   * Multi-pass high-reliability barcode and QR decoder
   * Normalizes canvas dimensions to max 640px to prevent CPU bottlenecks,
   * yields execution between passes, and checks multiple crops & formats.
   */
  const scanCanvasMultiPass = async (sourceCanvas, sourceCtx, width, height) => {
    if (!sourceCanvas || !sourceCtx || width <= 0 || height <= 0) return null;

    // Downscale large camera/photo frames to max 640px to prevent main-thread freezing
    let canvas = sourceCanvas;
    let ctx = sourceCtx;
    let w = width;
    let h = height;
    const maxDim = 640;

    if (Math.max(width, height) > maxDim) {
      const scale = maxDim / Math.max(width, height);
      w = Math.round(width * scale);
      h = Math.round(height * scale);
      canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(sourceCanvas, 0, 0, w, h);
    }

    // Micro-yield helper to let browser UI stay responsive
    const yieldEventLoop = () => new Promise(resolve => setTimeout(resolve, 0));

    // Pass 1: Center 50% reticle crop with jsQR (fastest & highest resolution)
    try {
      const cx = Math.floor(w * 0.25);
      const cy = Math.floor(h * 0.25);
      const cw = Math.floor(w * 0.5);
      const ch = Math.floor(h * 0.5);
      const imgData = ctx.getImageData(cx, cy, cw, ch);
      const qr = jsQR(imgData.data, cw, ch);
      if (qr && qr.data && qr.data.trim()) {
        return { text: qr.data.trim(), format: 'qr_code' };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 2: Center 75% crop with jsQR
    try {
      const cx = Math.floor(w * 0.125);
      const cy = Math.floor(h * 0.125);
      const cw = Math.floor(w * 0.75);
      const ch = Math.floor(h * 0.75);
      const imgData = ctx.getImageData(cx, cy, cw, ch);
      const qr = jsQR(imgData.data, cw, ch);
      if (qr && qr.data && qr.data.trim()) {
        return { text: qr.data.trim(), format: 'qr_code' };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 3: Full-frame with jsQR
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const qr = jsQR(imgData.data, w, h);
      if (qr && qr.data && qr.data.trim()) {
        return { text: qr.data.trim(), format: 'qr_code' };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 4: Horizontally Mirrored pass (fixes flipped desktop/laptop webcams)
    try {
      const mirrorCanvas = document.createElement('canvas');
      mirrorCanvas.width = w;
      mirrorCanvas.height = h;
      const mctx = mirrorCanvas.getContext('2d');
      mctx.translate(w, 0);
      mctx.scale(-1, 1);
      mctx.drawImage(canvas, 0, 0);
      const mData = mctx.getImageData(0, 0, w, h);
      const qr = jsQR(mData.data, w, h);
      if (qr && qr.data && qr.data.trim()) {
        return { text: qr.data.trim(), format: 'qr_code' };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 5: Contrast-enhanced binarization pass (for low-contrast or glare-prone thermal stickers)
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const d = imgData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const stretched = v < 128 ? Math.max(0, v * 0.6) : Math.min(255, v * 1.4);
        d[i] = stretched;
        d[i + 1] = stretched;
        d[i + 2] = stretched;
      }
      const qr = jsQR(d, w, h);
      if (qr && qr.data && qr.data.trim()) {
        return { text: qr.data.trim(), format: 'qr_code' };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 6: ZXing Multi-Format Reader (for 1D UPC-A/EAN retail barcodes)
    try {
      const codeReader = new BrowserMultiFormatReader();
      const zResult = await codeReader.decodeFromCanvas(canvas);
      if (zResult && zResult.getText()) {
        return {
          text: zResult.getText().trim(),
          format: zResult.getBarcodeFormat ? zResult.getBarcodeFormat().toString() : 'barcode'
        };
      }
    } catch (e) {}

    await yieldEventLoop();

    // Pass 7: Native BarcodeDetector (if supported by browser)
    if ('BarcodeDetector' in window) {
      try {
        const barcodeDetector = new window.BarcodeDetector({
          formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']
        });
        const barcodes = await barcodeDetector.detect(canvas);
        if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
          return {
            text: barcodes[0].rawValue.trim(),
            format: barcodes[0].format || 'barcode'
          };
        }
      } catch (e) {}
    }

    return null;
  };

  // Real-time Barcode & QR Code Scanning Loop (continuous live video scanning)
  const startScanLoop = () => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    let isTickBusy = false;
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    const codeReader = new BrowserMultiFormatReader();

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2 || isTickBusy) return;

      isTickBusy = true;
      try {
        const video = videoRef.current;
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;

        // Downsample video frame for high-speed continuous scanning without lag (max 540px)
        const targetW = Math.min(vw, 540);
        const targetH = Math.round((vh / vw) * targetW);
        offscreenCanvas.width = targetW;
        offscreenCanvas.height = targetH;
        offscreenCtx.drawImage(video, 0, 0, targetW, targetH);

        // 1. Ultra-fast Center Crop jsQR check (target reticle box, ~2-4ms)
        const cx = Math.floor(targetW * 0.2);
        const cy = Math.floor(targetH * 0.2);
        const cw = Math.floor(targetW * 0.6);
        const ch = Math.floor(targetH * 0.6);
        const centerData = offscreenCtx.getImageData(cx, cy, cw, ch);
        let qr = jsQR(centerData.data, cw, ch);

        // 2. Full frame jsQR check if center crop was off-target
        if (!qr || !qr.data) {
          const fullData = offscreenCtx.getImageData(0, 0, targetW, targetH);
          qr = jsQR(fullData.data, targetW, targetH);
        }

        if (qr && qr.data && qr.data.trim()) {
          handleCodeDetected(qr.data.trim(), 'qr_code');
          isTickBusy = false;
          return;
        }

        // 3. Fallback to native BarcodeDetector / ZXing for 1D retail UPC barcodes
        if ('BarcodeDetector' in window) {
          try {
            const barcodeDetector = new window.BarcodeDetector({
              formats: ['qr_code', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128']
            });
            const barcodes = await barcodeDetector.detect(offscreenCanvas);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleCodeDetected(barcodes[0].rawValue.trim(), barcodes[0].format);
              isTickBusy = false;
              return;
            }
          } catch (e) {}
        }

        try {
          const zResult = await codeReader.decodeFromCanvas(offscreenCanvas);
          if (zResult && zResult.getText()) {
            handleCodeDetected(zResult.getText().trim(), zResult.getBarcodeFormat ? zResult.getBarcodeFormat().toString() : 'barcode');
            isTickBusy = false;
            return;
          }
        } catch (zErr) {}
      } catch (e) {
        // Suppress continuous tick errors
      } finally {
        isTickBusy = false;
      }
    }, 380);
  };

  // Bag Label OCR Execution Engine
  const handleRunBagOcr = async (sourceCanvasOrUrl) => {
    setIsOcrRunning(true);
    setOcrProgress({ status: 'Starting Optical Character Recognition...', progress: 0.05 });
    setScanNotice(null);
    setUncatalogedResult(null);

    try {
      const extractedText = await performBagOcr(sourceCanvasOrUrl, (progressObj) => {
        setOcrProgress(progressObj);
      });

      if (!extractedText || extractedText.trim().length < 5) {
        setScanNotice({
          type: 'warning',
          message: 'No readable text was recognized on this coffee bag photo. Ensure clear direct lighting and frame the roaster, origin country, and process names clearly.'
        });
        setIsOcrRunning(false);
        return;
      }

      const parsed = parseCoffeeBagLabel(extractedText);
      const activeGrinderId = getSavedGrinderId();
      const targetRecipe = generateTargetBrewRecipe(parsed, activeGrinderId);

      setAiBagResult({
        metadata: parsed,
        recipe: targetRecipe,
        rawText: extractedText
      });
      setMatchedBean(targetRecipe);
      setScannedResult(`OCR_${targetRecipe.roaster}_${targetRecipe.origin}`);
      hapticScan();
    } catch (err) {
      console.warn('AI Bag OCR failed:', err);
      setScanNotice({
        type: 'error',
        message: 'Bag label optical recognition error: ' + (err.message || 'Please try again with clear lighting.')
      });
    } finally {
      setIsOcrRunning(false);
    }
  };

  const handleRunDemoBagOcr = (type = 'washed') => {
    let demoText = '';
    if (type === 'washed') {
      demoText = `SEY COFFEE\nWORKA CHELICHELE\nETHIOPIA - GEDEB, YIRGACHEFFE\nVARIETAL: HEIRLOOM\nPROCESS: WASHED\nELEVATION: 2050 MASL\nNOTES: JASMINE, WHITE PEACH, BERGAMOT\nROAST: LIGHT`;
    } else if (type === 'anaerobic') {
      demoText = `METHODICAL COFFEE\nEL PARAISO - DIEGO BERMUDEZ\nCOLOMBIA - CAUCA\nVARIETAL: CASTILLO\nPROCESS: THERMAL SHOCK ANAEROBIC NATURAL\nELEVATION: 1950 MASL\nNOTES: STRAWBERRY JAM, PASSION FRUIT, LYCHEE\nROAST: LIGHT`;
    } else {
      demoText = `ONYX COFFEE LAB\nSOUTHERN WEATHER\nCOLOMBIA & ETHIOPIA\nPROCESS: WASHED & NATURAL\nNOTES: MILK CHOCOLATE, PLUM, CANDIED WALNUT\nROAST: MEDIUM`;
    }
    const parsed = parseCoffeeBagLabel(demoText);
    const activeGrinderId = getSavedGrinderId();
    const targetRecipe = generateTargetBrewRecipe(parsed, activeGrinderId);

    setAiBagResult({
      metadata: parsed,
      recipe: targetRecipe,
      rawText: demoText
    });
    setMatchedBean(targetRecipe);
    setScannedResult(`AI_DEMO_${parsed.origin}_${parsed.process}`);
    hapticScan();
  };

  // High-Resolution Snapshot Capture and Multi-Pass Barcode & QR Decoding
  const captureSnapshotAndScan = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) {
      setScanNotice({
        type: 'warning',
        message: 'Camera video is not ready yet. Please wait a moment.'
      });
      return;
    }

    // Trigger physical shutter flash effect
    setShutterFlash(true);
    setTimeout(() => setShutterFlash(false), 180);

    try {
      const video = videoRef.current;
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(video, 0, 0, width, height);

      const snapshotUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedSnapshot(snapshotUrl);

      // Branch: AI Bag Label OCR Mode
      if (scannerMode === 'ai_label') {
        await handleRunBagOcr(canvas);
        return;
      }

      setIsSnapshotScanning(true);
      setScanNotice(null);

      // Execute comprehensive multi-pass decoding pipeline
      const decoded = await scanCanvasMultiPass(canvas, ctx, width, height);

      setIsSnapshotScanning(false);

      if (decoded && decoded.text) {
        handleCodeDetected(decoded.text, decoded.format);
      } else {
        setScanNotice({
          type: 'no_code_found',
          message: 'Photo captured, but no clear barcode or QR code was detected in this angle. Hold the bag 6–10 inches from the camera with good lighting, or upload a photo directly.'
        });
      }
    } catch (err) {
      console.warn('Error during snapshot capture & scan:', err);
      setIsSnapshotScanning(false);
      setScanNotice({
        type: 'error',
        message: 'Could not capture snapshot frame from camera. Please try again.'
      });
    }
  };

  const handleRetakeSnapshot = () => {
    setCapturedSnapshot(null);
    setScanNotice(null);
    setIsSnapshotScanning(false);
  };

  const handleDownloadSnapshot = () => {
    if (!capturedSnapshot) return;
    const a = document.createElement('a');
    a.href = capturedSnapshot;
    a.download = `coffee_bag_snapshot_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCodeDetected = async (rawValue, format = 'code') => {
    if (!rawValue || rawValue === scannedResult) return;
    hapticScan(); // Mobile tactile vibration on successful scan/detection
    setIsScanning(true);
    setScannedResult(rawValue);
    setUncatalogedResult(null);

    const cleanVal = rawValue.trim();
    const isSmartBagUrl = cleanVal.includes('bean=') || cleanVal.includes('recipe=') || (cleanVal.includes('/roasters/') && cleanVal.includes('?'));

    // 0. Check if raw payload or URL is a Bag Recipe JSON / URL
    const recipeMatch = parseRecipePayload(cleanVal);
    if (recipeMatch) {
      setMatchedBean(recipeMatch);
      setIsScanning(false);
      setIsLookingUp(false);
      return;
    }

    // 1. Search in local and built-in verified Roaster Registry
    const allRegistered = getRegisteredCoffees(VERIFIED_BEAN_CATALOG);
    const matched = allRegistered.find((bean) => {
      if (bean.upc === cleanVal) return true;
      if (bean.qrPatterns && bean.qrPatterns.some(p => cleanVal.toLowerCase().includes(p.toLowerCase()))) return true;
      if (isSmartBagUrl) {
        try {
          const urlObj = new URL(cleanVal.startsWith('http') ? cleanVal : `https://${cleanVal}`);
          const beanName = urlObj.searchParams.get('bean');
          if (beanName && bean.beanName && bean.beanName.toLowerCase() === beanName.toLowerCase()) return true;
        } catch {}
      }
      return false;
    });

    if (matched) {
      setMatchedBean(matched);
      setIsScanning(false);
      return;
    }

    // 2. Check live Cloud Firestore for remote roasters and coffees
    setIsLookingUp(true);
    try {
      const remoteCoffee = await fetchRemoteCoffeeByCode(cleanVal);
      if (remoteCoffee) {
        setMatchedBean(remoteCoffee);
        // Cache to local registry so subsequent offline scans are instantaneous
        saveRoasterCoffee(remoteCoffee);
        setIsScanning(false);
        setIsLookingUp(false);
        return;
      }
    } catch (e) {
      console.warn('Firestore remote lookup error:', e);
    }
    setIsLookingUp(false);

    // 3. Check if the scanned code is a direct The Brew App Smart Bag URL
    if (isSmartBagUrl) {
      try {
        const urlObj = new URL(cleanVal.startsWith('http') ? cleanVal : `https://${cleanVal}`);
        let roasterFromPath = '';
        if (urlObj.pathname.includes('/roasters/')) {
          const slugPart = urlObj.pathname.split('/roasters/')[1].split('/')[0];
          if (slugPart && !['showcase', 'partner', 'info', 'registered', 'roasters', 'roaster'].includes(slugPart.toLowerCase())) {
            roasterFromPath = slugPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          }
        }
        const roasterTitle = urlObj.searchParams.get('roaster') || roasterFromPath || 'Specialty Roaster';
        const parsedBean = {
          id: `smart_bag_${Date.now()}`,
          upc: urlObj.searchParams.get('upc') || cleanVal,
          roaster: roasterTitle,
          beanName: urlObj.searchParams.get('bean') || 'Smart Bag Lot',
          origin: urlObj.searchParams.get('origin') || 'Specialty Lot',
          process: urlObj.searchParams.get('process') || 'Specialty Process',
          elevation: urlObj.searchParams.get('elevation') || '1,800+ MASL',
          roastLevel: urlObj.searchParams.get('roast') || 'Light-Medium',
          tastingNotes: urlObj.searchParams.get('notes') ? urlObj.searchParams.get('notes').split(',').map(s => s.trim()) : ['Artisan Selected', 'Balanced Profile'],
          recommendedRatio: parseFloat(urlObj.searchParams.get('ratio')) || 16.5,
          recommendedGrind: urlObj.searchParams.get('grind') || 'Medium-Fine',
          tempF: parseInt(urlObj.searchParams.get('tempF')) || 202,
          tempC: Math.round(((parseInt(urlObj.searchParams.get('tempF') || '202') - 32) * 5) / 9),
          brewMethod: urlObj.searchParams.get('method') || 'pour_over',
          notes: `Smart Bag packaging QR scanned. Dialed in by ${roasterTitle}.`
        };
        setMatchedBean(parsedBean);
        setIsScanning(false);
        return;
      } catch (err) {
        console.warn('Error parsing Smart Bag URL:', err);
      }
    }

    // 4. Genuine real-time lookup against Open Food Facts API (only for numeric / SKU barcodes, never URLs)
    const isWebUrl = cleanVal.startsWith('http://') || cleanVal.startsWith('https://') || cleanVal.includes('/') || cleanVal.includes('?');
    if (!isWebUrl) {
      setIsLookingUp(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(cleanVal)}.json`, {
          signal: controller.signal,
          headers: { 'User-Agent': 'TheBrewApp/1.4.4 (contact@thebrew.app)' }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const offData = await res.json();
          if (offData.status === 1 && offData.product) {
            const p = offData.product;
            setMatchedBean({
              id: `off_${cleanVal}`,
              upc: cleanVal,
              roaster: p.brands || p.brand_owner || 'Retail Coffee Roaster',
              beanName: p.product_name || p.generic_name || 'Retail Whole Bean Coffee',
              origin: p.origins || p.countries || 'Commercial Origin',
              process: 'Commercial / Specialty',
              elevation: 'Unspecified',
              roastLevel: 'Medium',
              tastingNotes: ['Retail Roasted', 'Balanced Body'],
              recommendedRatio: 16,
              recommendedGrind: 'Medium',
              tempC: 93,
              tempF: 200,
              brewMethod: 'pour_over',
              isOffMatch: true,
              notes: `Verified retail product found on Open Food Facts (${p.product_name || 'Coffee'}). Note: Retail packaging barcodes do not specify barista extraction ratios or water temperatures. Set custom dial-in below.`
            });
            setIsLookingUp(false);
            setIsScanning(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Open Food Facts lookup failed or timed out:', err);
      }
    }


    // 4. Truly uncataloged: Absolutely NO fake data generated (Rule [user_global])
    setIsLookingUp(false);
    setMatchedBean(null);
    setUncatalogedResult({
      code: cleanVal,
      format
    });
    setIsScanning(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setCapturedSnapshot(dataUrl);
      setIsSnapshotScanning(true);
      setScanNotice(null);

      const img = new Image();
      img.onload = async () => {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);

        if (scannerMode === 'ai_label') {
          setIsSnapshotScanning(false);
          await handleRunBagOcr(canvas);
          return;
        }

        const decoded = await scanCanvasMultiPass(canvas, ctx, width, height);

        setIsSnapshotScanning(false);

        if (decoded && decoded.text) {
          handleCodeDetected(decoded.text, decoded.format);
        } else {
          setScanNotice({
            type: 'no_code_found',
            message: 'Uploaded photo analyzed, but no readable barcode or QR code was detected. Please ensure the code is clearly visible and well lit.'
          });
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleCodeDetected(manualCode.trim(), 'manual');
    }
  };

  const handleApplyToDialIn = () => {
    if (!matchedBean) return;
    if (orchestrator) {
      orchestrator.brew(matchedBean);
    } else if (onApplyRecipe) {
      onApplyRecipe(matchedBean);
    }
    onClose();
  };

  const handleSaveToCellar = () => {
    if (!matchedBean) return;
    if (orchestrator) {
      orchestrator.cellar(matchedBean);
    } else if (onSaveToJournal) {
      onSaveToJournal(matchedBean);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-espresso-950/95 border border-[#A66E38]/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] pb-safe"
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A66E38]/20 border border-[#A66E38]/40 flex items-center justify-center text-amber-gold shadow">
              {scannerMode === 'ai_label' ? <Sparkles className="w-5 h-5 text-amber-gold" /> : <ScanLine className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-gold">
                  Camera Vision & Ingestion
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                  UPC • EAN • QR • OCR
                </span>
              </div>
              <h2 id="scanner-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                {scannerMode === 'ai_label' ? 'AI Coffee Bag Label Scanner' : 'Bean Bag Barcode & QR Scanner'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-soft hover:text-white border border-white/10 transition"
            title="Close scanner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Dual-Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/60 rounded-2xl border border-white/10 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setScannerMode('barcode');
                setScanNotice(null);
              }}
              className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scannerMode === 'barcode'
                  ? 'bg-amber-gold text-espresso-950 shadow-md scale-[1.02]'
                  : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.04]'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Barcode & QR Code</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setScannerMode('ai_label');
                setScanNotice(null);
              }}
              className={`py-2.5 px-3 rounded-xl font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                scannerMode === 'ai_label'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-espresso-950 shadow-md scale-[1.02]'
                  : 'text-stone-400 hover:text-cream-light hover:bg-white/[0.04]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Bag Label (OCR)</span>
            </button>
          </div>

          {/* Viewfinder Section */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-white/15 aspect-[4/3] sm:aspect-video flex items-center justify-center shadow-inner">
            {/* Live Camera Video */}
            {!capturedSnapshot && (
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
              />
            )}

            {/* Frozen Captured Snapshot View */}
            {capturedSnapshot && (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img
                  src={capturedSnapshot}
                  alt="Captured Coffee Bag Snapshot"
                  className="w-full h-full object-cover"
                />
                {isSnapshotScanning && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 animate-fade-in">
                    <Loader2 className="w-8 h-8 text-amber-gold animate-spin" />
                    <span className="text-xs font-mono font-bold text-cream-light bg-black/70 px-3 py-1 rounded-full border border-amber-gold/30">
                      Analyzing Coffee Bag Snapshot...
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Physical Shutter Flash Animation */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white z-30 pointer-events-none transition-opacity duration-150 opacity-90" />
            )}

            {/* AI OCR Processing Overlay with Progress Bar */}
            {isOcrRunning && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3.5 animate-fade-in z-30 p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-gold/50 flex items-center justify-center text-amber-gold shadow-lg shadow-amber-gold/20">
                  <Cpu className="w-7 h-7 text-amber-gold animate-pulse" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-cream-light">
                    AI Label Analysis in Progress
                  </h4>
                  <p className="text-xs font-mono text-amber-gold/90 mt-0.5">
                    {ocrProgress.status || 'Extracting roaster, origin, and processing chemistry...'}
                  </p>
                </div>
                <div className="w-64 h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/20 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300 shadow"
                    style={{ width: `${Math.max(12, Math.round((ocrProgress.progress || 0) * 100))}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-cream-soft/70">
                  On-device neural OCR • Zero synthetic data
                </span>
              </div>
            )}

            {/* Laser Scan Animation Overlay (Live Camera Mode - Barcode Mode) */}
            {cameraActive && !capturedSnapshot && !isOcrRunning && scannerMode === 'barcode' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Viewfinder Framing Box */}
                <div className="relative w-64 h-48 border-2 border-amber-gold/60 rounded-2xl shadow-[0_0_15px_rgba(212,140,70,0.3)]">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-gold"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-gold"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-gold"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-gold"></div>
                  
                  {/* Glowing Laser line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_#f43f5e] animate-pulse" style={{ animationDuration: '1.5s' }} />
                </div>
              </div>
            )}

            {/* Framing Box for AI Bag Label Mode */}
            {cameraActive && !capturedSnapshot && !isOcrRunning && scannerMode === 'ai_label' && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                <div className="relative w-72 sm:w-80 h-52 sm:h-56 border-2 border-dashed border-amber-gold/80 rounded-2xl shadow-[0_0_20px_rgba(212,140,70,0.25)] flex flex-col items-center justify-between p-3 bg-amber-500/[0.03]">
                  <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-amber-gold bg-black/60 px-2 py-0.5 rounded border border-amber-gold/30">
                    <span>TOP: ROASTER & BEAN</span>
                    <span>AI VISION</span>
                  </div>
                  <div className="text-center px-2">
                    <span className="text-[11px] font-mono text-cream-light/90 bg-black/70 px-3 py-1 rounded-full border border-white/15 shadow">
                      Frame Roaster, Origin, Process & Altitude
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between text-[10px] font-mono font-bold text-amber-gold bg-black/60 px-2 py-0.5 rounded border border-amber-gold/30">
                    <span>BOTTOM: ELEVATION & NOTES</span>
                    <span>1-CLICK DIAL-IN</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prominent Circular Camera Shutter Button (Over Live Camera) */}
            {cameraActive && !capturedSnapshot && !isOcrRunning && (
              <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex flex-col items-center justify-center z-20 pointer-events-auto">
                <button
                  type="button"
                  onClick={captureSnapshotAndScan}
                  disabled={isSnapshotScanning || isOcrRunning}
                  className="group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/60 border-4 border-amber-gold shadow-[0_0_25px_rgba(212,140,70,0.6)] backdrop-blur-md hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-gold/50 cursor-pointer disabled:opacity-50"
                  title={scannerMode === 'ai_label' ? "Snap Photo & Extract Bag Label" : "Snap & Scan Coffee Bag Barcode"}
                  aria-label="Snap photo to scan coffee bag"
                >
                  <span className="w-12 h-12 rounded-full bg-amber-gold flex items-center justify-center text-espresso-950 shadow-inner group-hover:bg-amber-300 transition">
                    {isSnapshotScanning || isOcrRunning ? (
                      <Loader2 className="w-6 h-6 animate-spin text-espresso-950" />
                    ) : (
                      <Camera className="w-6 h-6 text-espresso-950" />
                    )}
                  </span>
                </button>
                <div className="mt-1.5 px-3 py-0.5 rounded-full bg-black/80 backdrop-blur text-[11px] font-mono font-bold text-amber-gold shadow border border-amber-gold/40">
                  {isOcrRunning 
                    ? 'Extracting Bag Label...' 
                    : isSnapshotScanning 
                    ? 'Scanning Snapshot...' 
                    : scannerMode === 'ai_label' 
                    ? '📸 Snap Bag Label & Analyze' 
                    : '📸 Snap & Scan Barcode'}
                </div>
              </div>
            )}

            {/* Camera Fallback / Error Display */}
            {!cameraActive && !capturedSnapshot && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-espresso-950/80">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-gold">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="max-w-sm">
                  <p className="text-sm font-semibold text-cream-light">
                    {cameraError ? 'Camera Access Notice' : 'Connecting Device Camera...'}
                  </p>
                  <p className="text-xs text-cream-soft/70 mt-1">
                    {cameraError || 'Allow camera access to scan retail coffee bag barcodes or QR dial-in codes directly.'}
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 rounded-xl bg-amber-gold text-espresso-950 text-xs font-mono font-bold uppercase tracking-wider transition hover:scale-105 active:scale-95 shadow"
                >
                  Retry Camera
                </button>
              </div>
            )}

            {/* Badge Indicator */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur text-[10px] font-mono text-cream-soft border border-white/10 flex items-center gap-2 z-10">
              <span className={`w-2 h-2 rounded-full ${capturedSnapshot ? 'bg-amber-400' : (cameraActive ? 'bg-emerald-400 animate-ping' : 'bg-rose-400')}`}></span>
              <span>{capturedSnapshot ? 'Captured Snapshot' : (cameraActive ? 'Live Camera Feed' : 'Camera Standby')}</span>
            </div>

            {/* Retake & Save Buttons Overlay (When Snapshot is Displayed) */}
            {capturedSnapshot && (
              <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2.5 z-20">
                <button
                  type="button"
                  onClick={handleRetakeSnapshot}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-gold text-espresso-950 font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xl hover:scale-105 active:scale-95 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-espresso-950" />
                  <span>Retake Photo</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSnapshot}
                  className="px-3.5 py-1.5 rounded-xl bg-black/80 hover:bg-black text-cream-light font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xl border border-white/20 hover:scale-105 active:scale-95 transition"
                  title="Download captured photo to your device"
                >
                  <Download className="w-3.5 h-3.5 text-amber-gold" />
                  <span>Save Image File</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Toolbar: Snap Button, File Upload & Quick Presets */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={capturedSnapshot ? handleRetakeSnapshot : captureSnapshotAndScan}
                disabled={(!cameraActive && !capturedSnapshot) || isSnapshotScanning}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-gold hover:bg-amber-300 text-espresso-950 font-mono font-bold text-xs shadow-lg shadow-amber-gold/20 hover:scale-105 active:scale-95 transition disabled:opacity-50"
              >
                {capturedSnapshot ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Retake Photo</span>
                  </>
                ) : (
                  <>
                    {isSnapshotScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    <span>{isSnapshotScanning ? 'Analyzing...' : '📸 Snap Photo'}</span>
                  </>
                )}
              </button>

              {capturedSnapshot && (
                <button
                  type="button"
                  onClick={handleDownloadSnapshot}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light font-mono text-xs font-bold border border-white/15 transition active:scale-95"
                  title="Save captured photo to Downloads"
                >
                  <Download className="w-3.5 h-3.5 text-amber-gold" />
                  <span>Save Image</span>
                </button>
              )}

              <label className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-cream-light border border-white/10 cursor-pointer transition active:scale-95 font-mono">
                <Upload className="w-3.5 h-3.5 text-amber-gold" />
                <span>Upload Bag Photo</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Quick Demo SKU & AI Bag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
              <span className="text-[10px] text-cream-soft/60 font-mono uppercase whitespace-nowrap">
                {scannerMode === 'ai_label' ? 'AI Label Demos:' : 'Quick Presets:'}
              </span>

              {scannerMode === 'ai_label' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleRunDemoBagOcr('washed')}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-mono text-amber-gold border border-amber-500/40 shrink-0 font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Dense Washed Ethiopia (208°F • 1:16.5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunDemoBagOcr('anaerobic')}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-[11px] font-mono text-purple-300 border border-purple-500/40 shrink-0 font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Anaerobic Thermal Shock (198°F • 1:15.5)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunDemoBagOcr('medium')}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#A66E38]/30 text-[11px] font-mono text-cream-soft hover:text-cream-light border border-white/10 shrink-0"
                  >
                    Medium Roast Blend
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleCodeDetected(JSON.stringify({
                      v: 1,
                      roaster: "Stumptown",
                      coffee: "Hair Bender",
                      roast: "medium",
                      brewer: "pour-over",
                      ratio: 16,
                      dose: 18.8,
                      water: 300,
                      temp_f: 205,
                      grind: "Medium-Fine",
                      total_time_sec: 210,
                      bloom_water: 60,
                      bloom_time_sec: 45,
                      notes: "Milk chocolate, sweet orange. 45-second bloom recommended."
                    }), "qr_code")}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[11px] font-mono text-amber-gold border border-amber-500/40 shrink-0 font-bold"
                  >
                    ⚡ Stumptown Recipe QR
                  </button>
                  <button
                    onClick={() => handleCodeDetected("850012345012", "upc_a")}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#A66E38]/30 text-[11px] font-mono text-cream-soft hover:text-cream-light border border-white/10 shrink-0"
                  >
                    Onyx Southern
                  </button>
                  <button
                    onClick={() => handleCodeDetected("850098765011", "upc_a")}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#A66E38]/30 text-[11px] font-mono text-cream-soft hover:text-cream-light border border-white/10 shrink-0"
                  >
                    Sey Pink Bourbon
                  </button>
                  <button
                    onClick={() => handleCodeDetected("935412300101", "upc_a")}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-[#A66E38]/30 text-[11px] font-mono text-cream-soft hover:text-cream-light border border-white/10 shrink-0"
                  >
                    Proud Mary Ghost
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Snapshot Feedback Alert Banner (When no code found in captured snapshot) */}
          {scanNotice && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-cream-light">
                    {scanNotice.message}
                  </p>
                  <p className="text-[11px] text-cream-soft/70 mt-0.5">
                    {scannerMode === 'barcode'
                      ? 'Align the barcode or QR code steadily within the center framing box, or switch to AI Label Vision.'
                      : 'Hold the coffee bag steady under direct lighting with roaster, origin country, and process visible.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {scannerMode === 'barcode' && capturedSnapshot && (
                  <button
                    type="button"
                    onClick={() => {
                      setScannerMode('ai_label');
                      handleRunBagOcr(capturedSnapshot);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-espresso-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow hover:scale-105 active:scale-95 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-espresso-950" />
                    <span>Scan Label (AI)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRetakeSnapshot}
                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.18] text-cream-light font-mono text-xs font-bold flex items-center gap-1.5 border border-white/15 transition active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-gold" />
                  <span>Retake Photo</span>
                </button>
              </div>
            </div>
          )}

          {/* Real-time Open Product Lookup Spinner */}
          {isLookingUp && (
            <div className="p-4 rounded-2xl bg-black/50 border border-amber-gold/30 flex items-center justify-center gap-3 text-cream-light font-mono text-xs animate-pulse">
              <Loader2 className="w-4 h-4 text-amber-gold animate-spin" />
              <span>Querying roaster catalog & Open Food Facts product database...</span>
            </div>
          )}

          {/* Uncataloged / Transparent Barcode Result */}
          {uncatalogedResult && !matchedBean && !isLookingUp && (
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/[0.07] border-2 border-amber-500/40 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-amber-gold">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-gold/80 block">
                    Transparent Barcode Result
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-light">
                    Unregistered Coffee Bag Barcode
                  </h3>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 font-mono text-xs text-cream-soft/90 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-cream-soft/60">Scanned Barcode:</span>
                  <span className="text-amber-gold font-bold px-2 py-0.5 rounded bg-white/[0.06]">{uncatalogedResult.code}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-cream-soft/80">
                  Standard supermarket and retail barcodes identify products for inventory and checkout, but do <strong>not</strong> specify barista brew recipes, water ratios, or extraction temperatures unless registered by the roaster. In accordance with our zero-theater standards, no synthetic recipe was generated.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200/90 text-[11px] flex items-start gap-2">
                  <Mail className="w-4 h-4 text-amber-gold shrink-0 mt-0.5" />
                  <span>
                    <strong>Roaster or Retail Partner?</strong> Please contact HQ if you would like to add your roaster, coffees, and bag barcodes to our global database.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                {onOpenRoasterInfo && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenRoasterInfo();
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-gold text-espresso-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow hover:scale-105 active:scale-95 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact HQ to Add Label</span>
                  </button>
                )}

                {onOpenRoasterPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenRoasterPortal(uncatalogedResult.code);
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-gold hover:bg-amber-300 text-espresso-950 font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <Store className="w-4 h-4 text-espresso-950" />
                    <span>Onboard & Register Recipe</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Scanned Bean Result Card */}
          {matchedBean && (
            <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border-2 border-amber-gold/50 shadow-2xl space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-gold text-[10px] font-mono font-bold uppercase border border-amber-500/30">
                    {matchedBean.roaster}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white/[0.06] text-cream-soft/70 text-[10px] font-mono border border-white/10">
                    Example Profile (Unverified)
                  </span>
                  <span className="text-[10px] text-cream-soft/50 font-mono">
                    Code: {scannedResult || matchedBean.upc}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profile Ingested</span>
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-light">
                  {matchedBean.beanName}
                </h3>
                <p className="text-xs text-cream-soft/80 mt-1 leading-relaxed">
                  {matchedBean.notes}
                </p>
              </div>

              {/* Extraction Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Origin & Altitude</span>
                  <span className="font-bold text-cream-light truncate block mt-0.5">{matchedBean.origin}</span>
                  <span className="text-[10px] text-amber-gold block">{matchedBean.elevation}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Process & Roast</span>
                  <span className="font-bold text-cream-light truncate block mt-0.5">{matchedBean.process}</span>
                  <span className="text-[10px] text-rose-400 block">{matchedBean.roastLevel}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Dial-In Ratio</span>
                  <span className="font-bold text-amber-gold text-sm block mt-0.5">1 : {matchedBean.recommendedRatio}</span>
                  <span className="text-[10px] text-cream-soft/70 block">{matchedBean.recommendedGrind}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10">
                  <span className="text-[10px] text-cream-soft/60 uppercase block">Water Temp</span>
                  <span className="font-bold text-cream-light text-sm block mt-0.5">{matchedBean.tempF}°F</span>
                  <span className="text-[10px] text-cream-soft/70 block">{matchedBean.tempC}°C</span>
                </div>
              </div>

              {/* Tasting Notes Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-cream-soft/60 uppercase">Notes:</span>
                {matchedBean.tastingNotes.map((note, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.08] text-[10px] font-medium text-cream-light border border-white/10">
                    {note}
                  </span>
                ))}
              </div>

              {/* Process Chemistry & Density Scientific Rationale Callout */}
              {matchedBean.extractionPhilosophy && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 text-xs font-mono space-y-2 animate-fade-in shadow-inner">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-amber-gold font-bold text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Scientific Process & Density Rationale</span>
                    </div>
                    {matchedBean.pourAgitation && (
                      <span className="px-2 py-0.5 rounded bg-black/50 text-[10px] text-amber-300 border border-amber-500/30">
                        {matchedBean.pourAgitation}
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] leading-relaxed text-cream-light font-sans">
                    {matchedBean.extractionPhilosophy}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-end gap-3">
                {/* 1. Direct 300-DPI Packaging Sticker Download */}
                <button
                  type="button"
                  onClick={() => {
                    if (orchestrator) {
                      orchestrator.downloadSticker(matchedBean);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light border border-white/15 text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95"
                  title="Download 300-DPI packaging sticker (PNG) with 'Scan Me for Recipe' badge directly to your device"
                >
                  <Download className="w-4 h-4 text-amber-gold" />
                  <span>Download Sticker (300 DPI)</span>
                </button>

                {/* 2. Roaster Studio Handoff */}
                <button
                  type="button"
                  onClick={() => {
                    if (orchestrator) {
                      orchestrator.package(matchedBean);
                    } else if (onOpenRoasterPortal) {
                      onOpenRoasterPortal(matchedBean.upc, matchedBean);
                    }
                    onClose();
                  }}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-gold border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95"
                  title="Open Roaster Studio to export vector SVG or thermal roll specs for your bag printer"
                >
                  <QrCode className="w-4 h-4 text-amber-gold" />
                  <span>Roaster Studio</span>
                </button>

                {/* 3. View Roaster Profile */}
                {matchedBean.roaster && (
                  <button
                    type="button"
                    onClick={() => {
                      const slug = String(matchedBean.roaster).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                      window.history.pushState(null, '', `/roasters/${slug}`);
                      window.dispatchEvent(new PopStateEvent('popstate'));
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-amber-gold border border-amber-500/30 text-xs font-mono font-bold flex items-center gap-2 transition active:scale-95"
                    title="Open Roaster Showcase Portfolio Page"
                  >
                    <Store className="w-4 h-4 text-amber-gold" />
                    <span>View Roaster Page</span>
                  </button>
                )}

                {/* 4. Log to Brew Cellar */}
                <button
                  type="button"
                  onClick={handleSaveToCellar}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-cream-light text-xs font-mono font-bold flex items-center gap-2 border border-white/15 transition active:scale-95"
                >
                  <BookmarkPlus className="w-4 h-4 text-amber-gold" />
                  <span>Log to Brew Cellar</span>
                </button>

                {/* 5. Load into Dial-In Station */}
                <button
                  type="button"
                  onClick={handleApplyToDialIn}
                  className="px-5 py-2.5 rounded-xl btn-tactile-amber text-espresso-950 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-gold/20 transition active:scale-95 hover:scale-105"
                >
                  <span>{matchedBean.isAiExtracted ? 'Brew This Bag (Apply Dial-In)' : matchedBean.isBagRecipe ? 'Brew This Bag Recipe' : 'Load into Dial-In Station'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Manual Barcode Input Form */}
          <form onSubmit={handleManualSubmit} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Or enter 12-digit UPC or QR URL manually..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-cream-light placeholder-cream-soft/50 font-mono focus:outline-none focus:border-amber-gold transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-amber-gold hover:text-espresso-950 text-cream-light text-xs font-mono font-bold transition border border-white/15 active:scale-95"
            >
              Verify Code
            </button>
          </form>

          {/* Roaster Partner Banner */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-cream-soft/80 font-mono text-[11px]">
              <Store className="w-4 h-4 text-amber-gold shrink-0" />
              <span>Are you a specialty coffee roaster? Add your labels & bag barcodes to our global database.</span>
            </div>
            <div className="flex items-center gap-3">
              {onOpenRoasterInfo && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRoasterInfo();
                    onClose();
                  }}
                  className="text-amber-gold hover:underline font-mono font-bold text-[11px] flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>How to Add Your Label</span>
                </button>
              )}
              {onOpenRoasterPortal && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenRoasterPortal('');
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-cream-light font-mono font-bold text-[11px] flex items-center gap-1 border border-white/10"
                >
                  <span>Roaster Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
