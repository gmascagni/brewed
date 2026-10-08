# pyright: reportMissingImports=false
import os
import sys
import math
import subprocess
import wave
import shutil
import asyncio
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import edge_tts

ROOT_DIR = Path(r"c:\Users\gmasc\Documents\Antigravity\brewed")
PUBLIC_DIR = ROOT_DIR / "public"
OUTPUT_DIR = PUBLIC_DIR / "videos"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TEMP_DIR = ROOT_DIR / "temp_video_render"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

ASSETS_DIR = PUBLIC_DIR / "images" / "video_assets"
DEMO_DIR = PUBLIC_DIR / "images" / "demo"
SOCIAL_DIR = PUBLIC_DIR / "images" / "social"
BRANDING_DIR = PUBLIC_DIR / "images" / "branding"

WIDTH = 1080
HEIGHT = 1920
FPS = 30

FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_REG = r"C:\Windows\Fonts\segoeui.ttf"
FONT_BLACK = r"C:\Windows\Fonts\ariblk.ttf"

def get_font(path: str, size: int):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# Master Medallion Logo
LOGO_PATH = BRANDING_DIR / "thebrew_medallion.png"
if not LOGO_PATH.exists():
    LOGO_PATH = BRANDING_DIR / "thebrew_app_logo_master.png"

LOGO_IMG = Image.open(LOGO_PATH).convert("RGBA") if LOGO_PATH.exists() else None

# English Scenes
SCENES_EN = [
    {
        "id": "scene1_hook",
        "bg_image": SOCIAL_DIR / "coffee_bloom_asmr.jpg",
        "fallback": DEMO_DIR / "step4_brew.jpg",
        "script": "Welcome to The Brew App. As specialty roasters and cafes, you pour immense craft into sourcing and roasting exceptional lots. Here is how your brand onboards into our ecosystem, ensuring every customer brews your coffee exactly as intended.",
        "badge": "SPECIALTY ROASTER & CAFE ECOSYSTEM",
        "badge_color": "#C88A4B",
        "headline": "ONBOARD YOUR\nCOFFEE BRAND",
        "subtitle": "Turn retail bags into interactive masterclasses\nfor specialty roasters and cafes worldwide.",
        "sub_highlight": "Smart Bag & Dial-In Technology",
        "card_type": "hook"
    },
    {
        "id": "scene2_roaster_studio",
        "bg_image": ASSETS_DIR / "scene_roaster_studio.png",
        "fallback": DEMO_DIR / "step1_print.jpg",
        "script": "First, enter your roastery credentials, bean origin details, and signature dial-in parameters. In moments, our packaging studio produces crisp 300 D-P-I thermal labels, complete with embedded recipe Q-R codes formatted for Dymo and Zebra roll printers.",
        "badge": "1. ROASTERY STUDIO • THERMAL LABELS",
        "badge_color": "#D97706",
        "headline": "SMART LABELS &\nRECIPE CREATION",
        "subtitle": "Direct-thermal Dymo & Zebra labels (300 DPI).\nHigh error correction for effortless mobile scanning.",
        "sub_highlight": "Precision Ratio, Micron Grind & Temp Specs",
        "card_type": "roaster"
    },
    {
        "id": "scene3_scan_timer",
        "bg_image": DEMO_DIR / "step3_scan.jpg",
        "fallback": ASSETS_DIR / "scene_guided_timer.png",
        "script": "When coffee lovers receive your bag, there is no app to download. Scanning your label with a standard phone camera instantly launches your dialed-in recipe in their mobile browser, complete with a synchronized slurry timer and audio pour guidance.",
        "badge": "2. INSTANT CAMERA SCAN • LIVE TIMER",
        "badge_color": "#0284C7",
        "headline": "SEAMLESS SCAN &\nGUIDED EXTRACTION",
        "subtitle": "Zero app download required. Instant browser launch.\nSynchronized multi-phase timer with precision guidance.",
        "sub_highlight": "Golden Ratio 1:16.5 • Voice-Guided Bloom",
        "card_type": "timer"
    },
    {
        "id": "scene4_cafe_portal",
        "bg_image": ASSETS_DIR / "scene_cafe_portal.png",
        "fallback": SOCIAL_DIR / "coffee_bloom_asmr.jpg",
        "script": "For specialty cafes, the dedicated shop portal lets your team update what is on bar today in just seconds. Showcase your espresso machines and batch brews, publish origin cupping events, and guide local foot traffic directly to your counter.",
        "badge": "3. COFFEE SHOP PORTAL • ON BAR TODAY",
        "badge_color": "#2F663C",
        "headline": "LIVE MENU SWITCHER\n& LOCAL RADAR",
        "subtitle": "Update rotating single-origin beans and espresso on bar.\nAttract local coffee lovers and host community cuppings.",
        "sub_highlight": "Turn Radar Searches Into In-Store Guests",
        "card_type": "cafe"
    },
    {
        "id": "scene5_telemetry_cta",
        "bg_image": ASSETS_DIR / "scene_roaster_telemetry.png",
        "fallback": SOCIAL_DIR / "methodical_coffee_dialin.jpg",
        "script": "You will also gain genuine insight into how customers brew your coffees at home, from preferred ratios to popular brew methods. Onboard your roastery or cafe today, and bring precision extraction to every cup.",
        "badge": "4. TELEMETRY & BRAND ENGAGEMENT",
        "badge_color": "#D97706",
        "headline": "ONBOARD YOUR\nBRAND TODAY",
        "subtitle": "Packaging studio, live menu switcher,\nand real brew insights for your brand.",
        "sub_highlight": "Visit TheBrew.App • Roaster & Cafe Onboarding",
        "card_type": "cta"
    }
]

# Spanish Scenes (Costa Rican Barista)
SCENES_ES = [
    {
        "id": "scene1_hook",
        "bg_image": SOCIAL_DIR / "coffee_bloom_asmr.jpg",
        "fallback": DEMO_DIR / "step4_brew.jpg",
        "script": "Bienvenidos a The Brew App. Como tostadores y cafeterías de especialidad, ustedes dedican una gran pasión al cultivo y tueste de micro-lotes excepcionales. Así es como su marca se integra en nuestra plataforma, garantizando que cada cliente prepare su café exactamente como fue diseñado.",
        "badge": "ECOSISTEMA DE TOSTADORES Y CAFETERÍAS",
        "badge_color": "#C88A4B",
        "headline": "INTEGRE SU MARCA\nDE CAFÉ",
        "subtitle": "Convierta sus bolsas de café en clases maestras interactivas\npara tostadores y amantes del café en todo el mundo.",
        "sub_highlight": "Tecnología Smart Bag y Calibración de Tazas",
        "card_type": "hook"
    },
    {
        "id": "scene2_roaster_studio",
        "bg_image": ASSETS_DIR / "scene_roaster_studio.png",
        "fallback": DEMO_DIR / "step1_print.jpg",
        "script": "Primero, ingrese los datos de su tostaduría, el origen del grano y su receta insignia. En segundos, nuestro estudio de empaque genera etiquetas térmicas de trescientos D-P-I con códigos Q-R listos para impresoras Dymo y Zebra.",
        "badge": "1. ESTUDIO DE TOSTADURÍA • ETIQUETAS",
        "badge_color": "#D97706",
        "headline": "ETIQUETAS SMART &\nCREACIÓN DE RECETAS",
        "subtitle": "Etiquetas térmicas de 300 DPI para Dymo y Zebra.\nCódigos QR de alta precisión para escaneo instantáneo.",
        "sub_highlight": "Ratio de Precisión, Molienda en Micras y Temp",
        "card_type": "roaster"
    },
    {
        "id": "scene3_scan_timer",
        "bg_image": DEMO_DIR / "step3_scan.jpg",
        "fallback": ASSETS_DIR / "scene_guided_timer.png",
        "script": "Cuando el cliente recibe su café, no necesita descargar ninguna aplicación. Al escanear la etiqueta con la cámara de su celular, su receta se abre al instante en el navegador con un temporizador multi-fase guiado por voz.",
        "badge": "2. ESCANEO CON CÁMARA • TEMPORIZADOR EN VIVO",
        "badge_color": "#0284C7",
        "headline": "ESCANEO FÁCIL &\nEXTRACCIÓN GUIADA",
        "subtitle": "Sin descargas de apps. Apertura inmediata en el navegador.\nTemporizador multi-fase sincronizado con voz y chimes.",
        "sub_highlight": "Ratio Dorado 1:16.5 • Pre-infusión Guiada",
        "card_type": "timer"
    },
    {
        "id": "scene4_cafe_portal",
        "bg_image": ASSETS_DIR / "scene_cafe_portal.png",
        "fallback": SOCIAL_DIR / "coffee_bloom_asmr.jpg",
        "script": "Para las cafeterías de especialidad, nuestro portal les permite actualizar la barra del día en pocos segundos. Muestren sus espressos de origen, promocionen catas comunitarias y guíen a los clientes locales directamente a su barra.",
        "badge": "3. PORTAL DE CAFETERÍAS • EN BARRA HOY",
        "badge_color": "#2F663C",
        "headline": "MENÚ EN VIVO &\nRADAR DE CAFÉ LOCAL",
        "subtitle": "Actualice sus granos de origen y espresso en barra hoy.\nAtraiga a los amantes del café y organice catas locales.",
        "sub_highlight": "Convierta Búsquedas en Visitantes en su Local",
        "card_type": "cafe"
    },
    {
        "id": "scene5_telemetry_cta",
        "bg_image": ASSETS_DIR / "scene_roaster_telemetry.png",
        "fallback": SOCIAL_DIR / "methodical_coffee_dialin.jpg",
        "script": "Además, obtendrán estadísticas reales sobre cómo preparan sus cafés en casa: ratios favoritos y métodos más populares. Registren su tostaduría o cafetería hoy mismo en thebrew.app y lleven la extracción perfecta a cada taza.",
        "badge": "4. ESTADÍSTICAS Y COMUNIDAD",
        "badge_color": "#D97706",
        "headline": "REGISTRE SU MARCA\nHOY MISMO",
        "subtitle": "Estudio de empaque, menú en vivo\ny métricas reales de preparación para su marca.",
        "sub_highlight": "Visite TheBrew.App • Registro de Tostadores",
        "card_type": "cta"
    }
]

async def generate_voiceover_edge(scene: dict, lang: str) -> Path:
    wav_path = TEMP_DIR / f"{scene['id']}_{lang}.wav"
    mp3_path = TEMP_DIR / f"{scene['id']}_{lang}.mp3"
    
    voice = "en-GB-RyanNeural" if lang == "en" else "es-CR-JuanNeural"
    comm = edge_tts.Communicate(scene["script"], voice, rate="+2%", pitch="+0Hz")
    await comm.save(str(mp3_path))
    
    cmd = [
        "ffmpeg", "-y",
        "-i", str(mp3_path),
        "-ar", "44100",
        "-ac", "2",
        str(wav_path)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    return wav_path

def get_audio_duration(audio_path: Path) -> float:
    with wave.open(str(audio_path), "rb") as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)

def draw_hud(draw: ImageDraw.ImageDraw, card_type: str, progress: float, center_x: int, center_y: int, lang: str):
    if card_type == "hook":
        w, h = 760, 240
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 230), outline="#C88A4B", width=2)
        
        f_sub = get_font(FONT_BOLD, 26)
        if lang == "es":
            draw.text((x1 + 40, y1 + 45), "☕ PARA TOSTADORES ARTESANALES", font=f_sub, fill="#F5E8D4")
            draw.text((x1 + 40, y1 + 85), "• Etiquetas Térmicas 300 DPI y Códigos QR Smart Bag", font=get_font(FONT_REG, 22), fill="#DFD7CB")
            draw.text((x1 + 40, y1 + 135), "🏪 PARA CAFETERÍAS DE ESPECIALIDAD", font=f_sub, fill="#C8E0CD")
            draw.text((x1 + 40, y1 + 175), "• Menú 'En Barra Hoy' y Radar de Cafeterías Locales", font=get_font(FONT_REG, 22), fill="#DFD7CB")
        else:
            draw.text((x1 + 40, y1 + 45), "☕ FOR ARTISAN ROASTERS", font=f_sub, fill="#F5E8D4")
            draw.text((x1 + 40, y1 + 85), "• 300 DPI Thermal QR Labels & Smart Bag Scanning", font=get_font(FONT_REG, 22), fill="#DFD7CB")
            draw.text((x1 + 40, y1 + 135), "🏪 FOR SPECIALTY COFFEE SHOPS", font=f_sub, fill="#C8E0CD")
            draw.text((x1 + 40, y1 + 175), "• Live 'On Bar Today' Menu Switcher & Local Radar", font=get_font(FONT_REG, 22), fill="#DFD7CB")

    elif card_type == "roaster":
        w, h = 680, 280
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(255, 255, 255, 245), outline="#14110F", width=3)
        
        f_lbl_title = get_font(FONT_BLACK, 32)
        title_text = "ETIQUETA TÉRMICA SMART" if lang == "es" else "THERMAL SMART LABEL"
        sub_text = "TOSTADURÍA • LOTE DE ORIGEN" if lang == "es" else "ARTISAN ROASTERY • SIGNATURE LOT"
        draw.text((x1 + 40, y1 + 35), title_text, font=f_lbl_title, fill="#14110F")
        draw.text((x1 + 40, y1 + 75), sub_text, font=get_font(FONT_BOLD, 20), fill="#766A62")
        
        qr_size = 140
        qr_x = x1 + w - qr_size - 40
        qr_y = y1 + 35
        draw.rectangle([(qr_x, qr_y), (qr_x + qr_size, qr_y + qr_size)], fill="#14110F")
        draw.rectangle([(qr_x + 15, qr_y + 15), (qr_x + qr_size - 15, qr_y + qr_size - 15)], fill="#FFFFFF")
        draw.rectangle([(qr_x + 40, qr_y + 40), (qr_x + qr_size - 40, qr_y + qr_size - 40)], fill="#14110F")
        
        draw.text((x1 + 40, y1 + 125), "RATIO: 1:16.5  •  TEMP: 94.4°C / 202°F", font=get_font(FONT_BOLD, 22), fill="#A8622D")
        dose_text = "DOSIS: 20.0g  •  AGUA: 330g  •  TIEMPO: 3:15" if lang == "es" else "DOSE: 20.0g  •  WATER: 330g  •  POUR: 3:15"
        draw.text((x1 + 40, y1 + 160), dose_text, font=get_font(FONT_BOLD, 20), fill="#14110F")
        
        badge_spec = "COMPATIBLE CON DYMO / ZEBRA 300 DPI" if lang == "es" else "DYMO / ZEBRA 300 DPI COMPLIANT"
        draw.rounded_rectangle([(x1 + 40, y1 + 210), (x1 + 400, y1 + 248)], radius=8, fill="#F7F4EE", outline="#ECE6DC", width=1)
        draw.text((x1 + 55, y1 + 218), badge_spec, font=get_font(FONT_BOLD, 15), fill="#2F663C")

    elif card_type == "timer":
        ring_radius = 120
        draw.ellipse(
            [(center_x - ring_radius, center_y - ring_radius),
             (center_x + ring_radius, center_y + ring_radius)],
            outline=(40, 32, 26, 230),
            width=16
        )
        sweep = int(360 * progress)
        if sweep > 0:
            draw.arc(
                [(center_x - ring_radius, center_y - ring_radius),
                 (center_x + ring_radius, center_y + ring_radius)],
                start=-90,
                end=-90 + sweep,
                fill="#D69550",
                width=16
            )
        f_time = get_font(FONT_BLACK, 64)
        t_str = "03:15"
        tb = f_time.getbbox(t_str)
        draw.text((center_x - (tb[2] - tb[0]) // 2, center_y - 45), t_str, font=f_time, fill="#FAF7F2")
        
        f_p = get_font(FONT_BOLD, 22)
        p_str = "FASE 1: PRE-INFUSIÓN 45s" if lang == "es" else "STAGE 1: 45s BLOOM"
        pb = f_p.getbbox(p_str)
        draw.text((center_x - (pb[2] - pb[0]) // 2, center_y + 35), p_str, font=f_p, fill="#E8AF72")

    elif card_type == "cafe":
        w, h = 720, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 235), outline="#2F663C", width=2)
        
        status_hdr = "EN BARRA HOY • ESTADO EN RADAR" if lang == "es" else "ON BAR TODAY • LIVE RADAR STATUS"
        draw.text((x1 + 40, y1 + 35), status_hdr, font=get_font(FONT_BOLD, 22), fill="#2F663C")
        
        it1 = "Batch Brew de Origen Único" if lang == "es" else "Seasonal Single-Origin Batch Brew"
        draw.text((x1 + 40, y1 + 80), it1, font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 170, y1 + 75), (x1 + w - 40, y1 + 115)], radius=12, fill="#EBF3ED")
        lbl1 = "● EN BARRA" if lang == "es" else "● ON BAR"
        draw.text((x1 + w - 155, y1 + 85), lbl1, font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        it2 = "Espresso de Especialidad" if lang == "es" else "Artisan Signature Espresso"
        draw.text((x1 + 40, y1 + 145), it2, font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 170, y1 + 140), (x1 + w - 40, y1 + 180)], radius=12, fill="#EBF3ED")
        draw.text((x1 + w - 155, y1 + 150), lbl1, font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        footer_note = "Sincronizado con el Radar de Cafeterías Locales." if lang == "es" else "Synchronized with Local Coffee Radar across all home baristas."
        draw.text((x1 + 40, y1 + 208), footer_note, font=get_font(FONT_REG, 18), fill="#ECE6DC")

    elif card_type == "cta":
        w, h = 760, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(247, 244, 238, 250), outline="#C88A4B", width=3)
        
        f_cta_url = get_font(FONT_BLACK, 48)
        u_txt = "thebrew.app"
        ub = f_cta_url.getbbox(u_txt)
        draw.text((center_x - (ub[2] - ub[0]) // 2, y1 + 35), u_txt, font=f_cta_url, fill="#14110F")
        
        if lang == "es":
            draw.text((x1 + 60, y1 + 115), "✔ Ecosistema para Tostadores y Cafeterías", font=get_font(FONT_BOLD, 26), fill="#2F663C")
            draw.text((x1 + 60, y1 + 160), "✔ Estudio de Empaque y Códigos QR 300 DPI", font=get_font(FONT_BOLD, 24), fill="#14110F")
            draw.text((x1 + 60, y1 + 205), "✔ Métricas de Preparación y Visitas Locales", font=get_font(FONT_BOLD, 24), fill="#14110F")
        else:
            draw.text((x1 + 60, y1 + 115), "✔ Dedicated Roaster & Cafe Ecosystem", font=get_font(FONT_BOLD, 26), fill="#2F663C")
            draw.text((x1 + 60, y1 + 160), "✔ 300 DPI Thermal Packaging & QR Studio", font=get_font(FONT_BOLD, 24), fill="#14110F")
            draw.text((x1 + 60, y1 + 205), "✔ Live Foot-Traffic Analytics & Dial-In Telemetry", font=get_font(FONT_BOLD, 24), fill="#14110F")

def render_frame(scene: dict, progress: float, bg_base: Image.Image, lang: str) -> Image.Image:
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (20, 17, 15, 255))
    
    # 1. Ken Burns Zoom & Subtle Vertical Pan
    zoom = 1.0 + (progress * 0.10)
    target_w = int(WIDTH * zoom)
    target_h = int(HEIGHT * zoom)
    scale = max(target_w / bg_base.width, target_h / bg_base.height)
    nw = int(bg_base.width * scale)
    nh = int(bg_base.height * scale)
    resized_bg = bg_base.resize((nw, nh), Image.Resampling.BILINEAR)
    
    ox = (nw - WIDTH) // 2
    oy = int((nh - HEIGHT) * (0.1 + 0.4 * progress))
    cropped = resized_bg.crop((ox, oy, ox + WIDTH, oy + HEIGHT))
    frame.paste(cropped, (0, 0))
    
    # 2. Gradient Scrims & Card Overlays
    scrim = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_scrim = ImageDraw.Draw(scrim)
    
    d_scrim.rectangle([(0, 0), (WIDTH, 360)], fill=(12, 10, 8, 220))
    d_scrim.rectangle([(0, 360), (WIDTH, 540)], fill=(12, 10, 8, 140))
    d_scrim.rectangle([(0, HEIGHT - 680), (WIDTH, HEIGHT)], fill=(12, 10, 8, 240))
    
    frame = Image.alpha_composite(frame, scrim)
    draw = ImageDraw.Draw(frame)
    
    # 3. Top Safe Zone Header (Embedded Brand Medallion Logo & Badge)
    header_y = 120
    
    # Embed the new gold medallion logo centered
    if LOGO_IMG:
        logo_size = 72
        logo_resized = LOGO_IMG.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
        logo_x = (WIDTH - logo_size) // 2
        frame.paste(logo_resized, (logo_x, header_y), logo_resized)
        badge_y = header_y + logo_size + 16
    else:
        badge_y = header_y
    
    badge_txt = scene["badge"]
    f_badge = get_font(FONT_BOLD, 22)
    b_box = f_badge.getbbox(badge_txt)
    bw = (b_box[2] - b_box[0]) + 48
    bh = 44
    bx = (WIDTH - bw) // 2
    
    draw.rounded_rectangle([(bx, badge_y), (bx + bw, badge_y + bh)], radius=14, fill=(18, 14, 11, 230), outline=scene["badge_color"], width=2)
    draw.text((bx + 24, badge_y + 10), badge_txt, font=f_badge, fill=scene["badge_color"])
    
    # Main Headline
    f_head = get_font(FONT_BLACK, 60)
    lines = scene["headline"].split("\n")
    hl_y = badge_y + bh + 24
    for line in lines:
        l_box = f_head.getbbox(line)
        lx = (WIDTH - (l_box[2] - l_box[0])) // 2
        draw.text((lx + 3, hl_y + 3), line, font=f_head, fill=(0, 0, 0, 200))
        draw.text((lx, hl_y), line, font=f_head, fill="#FAF7F2")
        hl_y += 70
        
    # Subtitle / Micro-script
    f_sub = get_font(FONT_REG, 24)
    sub_lines = scene["subtitle"].split("\n")
    sub_y = hl_y + 8
    for line in sub_lines:
        sb = f_sub.getbbox(line)
        sx = (WIDTH - (sb[2] - sb[0])) // 2
        draw.text((sx + 1, sub_y + 1), line, font=f_sub, fill=(0, 0, 0, 180))
        draw.text((sx, sub_y), line, font=f_sub, fill="#DFD7CB")
        sub_y += 34
        
    # 4. Center Interactive Graphic / HUD
    hud_center_y = 1060
    draw_hud(draw, scene["card_type"], progress, WIDTH // 2, hud_center_y, lang)
    
    # 5. Bottom Safe Zone Highlight Banner
    bottom_card_y = HEIGHT - 360
    cw, ch = 840, 140
    cx = (WIDTH - cw) // 2
    
    draw.rounded_rectangle(
        [(cx, bottom_card_y), (cx + cw, bottom_card_y + ch)],
        radius=20,
        fill=(14, 11, 9, 235),
        outline="#D69550",
        width=2
    )
    
    f_sh = get_font(FONT_BOLD, 28)
    sh_txt = scene["sub_highlight"]
    sh_b = f_sh.getbbox(sh_txt)
    sh_x = (WIDTH - (sh_b[2] - sh_b[0])) // 2
    draw.text((sh_x, bottom_card_y + 30), sh_txt, font=f_sh, fill="#E8AF72")
    
    f_domain = get_font(FONT_BOLD, 22)
    d_txt = "TheBrew.App • Guía de Precisión y Registro de Tostadores" if lang == "es" else "TheBrew.App • Precision Coffee Guide & Partner Onboarding"
    db = f_domain.getbbox(d_txt)
    dx = (WIDTH - (db[2] - db[0])) // 2
    draw.text((dx, bottom_card_y + 82), d_txt, font=f_domain, fill="#A89F91")
    
    # 6. Overall Scene Progress Bar
    bar_y = HEIGHT - 12
    draw.rectangle([(0, bar_y), (WIDTH, HEIGHT)], fill=(20, 17, 15, 255))
    draw.rectangle([(0, bar_y), (int(WIDTH * progress), HEIGHT)], fill="#D69550")
    
    return frame.convert("RGB")

async def build_scene_clip(scene: dict, scene_idx: int, total_scenes: int, lang: str) -> Path:
    print(f"\n--- [{lang.upper()} Scene {scene_idx + 1}/{total_scenes}] Processing {scene['id']} ---")
    audio_path = await generate_voiceover_edge(scene, lang)
    duration = get_audio_duration(audio_path)
    print(f"-> Audio duration: {duration:.2f}s")
    
    total_frames = math.ceil(duration * FPS)
    print(f"-> Rendering {total_frames} frames @ {FPS} fps...")
    
    bg_source = scene["bg_image"] if scene["bg_image"].exists() else scene["fallback"]
    bg_img = Image.open(bg_source).convert("RGBA")
    
    frames_dir = TEMP_DIR / f"frames_{scene['id']}_{lang}"
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
    frames_dir.mkdir(parents=True, exist_ok=True)
    
    for f_idx in range(total_frames):
        p = f_idx / max(1, total_frames - 1)
        frame_img = render_frame(scene, p, bg_img, lang)
        frame_img.save(frames_dir / f"frame_{f_idx:05d}.jpg", quality=92)
        
    scene_mp4 = TEMP_DIR / f"{scene['id']}_{lang}.mp4"
    cmd = [
        "ffmpeg", "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "frame_%05d.jpg"),
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-preset", "faster",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(scene_mp4)
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"[OK] Rendered scene: {scene_mp4}")
    return scene_mp4

async def build_full_video(scenes: list, lang: str, out_filename: str):
    clips = []
    for i, s in enumerate(scenes):
        c = await build_scene_clip(s, i, len(scenes), lang)
        clips.append(c)
        
    concat_txt = TEMP_DIR / f"concat_{lang}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for cl in clips:
            f.write(f"file '{cl.resolve().as_posix()}'\n")
            
    final_mp4 = OUTPUT_DIR / out_filename
    print(f"[*] Concatenating scenes into: {final_mp4}...")
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(final_mp4)
    ]
    subprocess.run(cmd, check=True)
    print(f"[SUCCESS] {final_mp4} generated ({final_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    return final_mp4

async def main():
    print("==========================================================")
    print("[START] RENDERING REBUILT PARTNER WALKTHROUGHS (CLEAN UI & NEW LOGO)")
    print("==========================================================")
    
    # 1. English Partner Walkthrough
    print("\n--- BUILDING ENGLISH WALKTHROUGH ---")
    en_path = await build_full_video(SCENES_EN, "en", "roasters_and_cafes_partner_walkthrough.mp4")
    shutil.copy2(en_path, OUTPUT_DIR / "smart_bag_scan_demo.mp4")
    
    # 2. Spanish Costa Rican Partner Walkthrough
    print("\n--- BUILDING SPANISH (COSTA RICA) WALKTHROUGH ---")
    es_path = await build_full_video(SCENES_ES, "es", "roasters_and_cafes_partner_walkthrough_espanol.mp4")
    
    print("\n==========================================================")
    print("[SUCCESS] BOTH VIDEOS REBUILT WITH NEW BRAND MEDALLION & CLEAN UI!")
    print(f"English Video: {en_path}")
    print(f"Spanish Video: {es_path}")
    print("==========================================================")

if __name__ == "__main__":
    asyncio.run(main())
