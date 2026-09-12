import os
import sys
import math
import subprocess
import wave
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(r"c:\Users\gmasc\Documents\Antigravity\brewed\brewed")
PUBLIC_DIR = ROOT_DIR / "public"
OUTPUT_DIR = PUBLIC_DIR / "videos"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TEMP_DIR = ROOT_DIR / "temp_video_render"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

ASSETS_DIR = PUBLIC_DIR / "images" / "video_assets"
DEMO_DIR = PUBLIC_DIR / "images" / "demo"
SOCIAL_DIR = PUBLIC_DIR / "images" / "social"

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

SCENES = [
    {
        "id": "scene1_hook",
        "bg_image": SOCIAL_DIR / "coffee_bloom_asmr.jpg",
        "fallback": DEMO_DIR / "step4_brew.jpg",
        "script": "Specialty roasters spend months sourcing micro-lots and dialing in roast curves. But once the bag leaves your roastery, customers struggle with ratios, temperature, and grind size. TheBrew.App bridges the gap for roasters and cafes.",
        "badge": "SPECIALTY ROASTER & CAFE ECOSYSTEM",
        "badge_color": "#C88A4B",
        "headline": "THE ART OF\nEXTRACTION",
        "subtitle": "Connecting artisan roasters, specialty cafes,\nand passionate home baristas worldwide.",
        "sub_highlight": "100% Free Partner Ecosystem",
        "card_type": "hook"
    },
    {
        "id": "scene2_roaster_studio",
        "bg_image": ASSETS_DIR / "scene_roaster_studio.png",
        "fallback": DEMO_DIR / "step1_print.jpg",
        "script": "With our free Roaster Studio, configure your signature roast curves, grind micron specs, and mineral recipes. Instantly generate high-contrast 300 DPI thermal labels with embedded recipes for your retail bags.",
        "badge": "1. ROASTER STUDIO • 300 DPI LABELS",
        "badge_color": "#D97706",
        "headline": "THERMAL SMART\nBAG STICKERS",
        "subtitle": "Direct-thermal Dymo & Zebra labels (300 DPI).\nError-Correction Level H for flawless optical scanning.",
        "sub_highlight": "One-Click Thermal QR & Barcode Generator",
        "card_type": "roaster"
    },
    {
        "id": "scene3_scan_timer",
        "bg_image": DEMO_DIR / "step3_scan.jpg",
        "fallback": ASSETS_DIR / "scene_guided_timer.png",
        "script": "Zero app store barriers. When customers point any phone camera at your retail bag, your exact golden ratio, water temperature, and synchronized multi-phase timer launch instantly in their mobile browser with voice guidance.",
        "badge": "2. ZERO-APP CAMERA SCAN • LIVE TIMER",
        "badge_color": "#0284C7",
        "headline": "INSTANT DIAL-IN\nGUIDED BREW",
        "subtitle": "No app download required. Seamless mobile web launch.\nMechanical clockwork ticking with audio pour guidance.",
        "sub_highlight": "Golden Ratio 1:16.5 • Live Slurry Timer",
        "card_type": "timer"
    },
    {
        "id": "scene4_cafe_portal",
        "bg_image": ASSETS_DIR / "scene_cafe_portal.png",
        "fallback": ASSETS_DIR / "scene_local_radar.png",
        "script": "For coffee shops, our free Cafe Portal gives baristas a live On Bar Today menu switcher, lets you showcase commercial espresso machines and precision grinders, host cupping events, and drives foot-traffic directly from our local coffee radar.",
        "badge": "3. COFFEE SHOP PORTAL • ON BAR TODAY",
        "badge_color": "#2F663C",
        "headline": "LIVE MENU SWITCHER\n& LOCAL RADAR",
        "subtitle": "Toggle active espresso and batch brews in seconds.\nDrive local foot-traffic and host community cuppings.",
        "sub_highlight": "Direct Navigation & Live Menu Impressions",
        "card_type": "cafe"
    },
    {
        "id": "scene5_telemetry_cta",
        "bg_image": ASSETS_DIR / "scene_roaster_telemetry.png",
        "fallback": SOCIAL_DIR / "methodical_coffee_dialin.jpg",
        "script": "Track real, anonymized customer brew telemetry, method distribution, and foot-traffic analytics. Free forever for independent roasters and cafes. Claim your partner profile today at TheBrew.App.",
        "badge": "4. PARTNER TELEMETRY • FREE FOREVER",
        "badge_color": "#D97706",
        "headline": "CLAIM YOUR FREE\nPROFILE TODAY",
        "subtitle": "Free packaging studio, live menu switcher,\nand real market intelligence for your business.",
        "sub_highlight": "Visit thebrew.app • Roasters & Cafes",
        "card_type": "cta"
    }
]

def generate_voiceover(scene: dict) -> Path:
    wav_path = TEMP_DIR / f"{scene['id']}.wav"
    if wav_path.exists() and wav_path.stat().st_size > 5000:
        return wav_path

    # Clean script for PowerShell speech synthesis
    clean_text = scene["script"].replace("'", "''").replace('"', '')
    ps_cmd = f"""
    Add-Type -AssemblyName System.Speech
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.SelectVoice("Microsoft Zira Desktop")
    $synth.Rate = 0
    $synth.SetOutputToWaveFile("{wav_path.resolve().as_posix()}")
    $synth.Speak("{clean_text}")
    $synth.Dispose()
    """
    subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], check=True)
    return wav_path

def get_audio_duration(audio_path: Path) -> float:
    with wave.open(str(audio_path), "rb") as wf:
        frames = wf.getnframes()
        rate = wf.getframerate()
        return frames / float(rate)

def draw_hud(draw: ImageDraw.Draw, card_type: str, progress: float, center_x: int, center_y: int):
    if card_type == "hook":
        # Draw elegant dual-pillar badge for roasters & cafes
        w, h = 760, 240
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 220), outline="#C88A4B", width=2)
        
        f_sub = get_font(FONT_BOLD, 26)
        draw.text((x1 + 40, y1 + 45), "☕ FOR SPECIALTY ROASTERS", font=f_sub, fill="#F5E8D4")
        draw.text((x1 + 40, y1 + 85), "• 300 DPI Thermal QR Labels & Smart Bag Scanning", font=get_font(FONT_REG, 22), fill="#DFD7CB")
        
        draw.text((x1 + 40, y1 + 135), "🏪 FOR SPECIALTY COFFEE SHOPS", font=f_sub, fill="#C8E0CD")
        draw.text((x1 + 40, y1 + 175), "• Live 'On Bar Today' Menu Switcher & Local Radar", font=get_font(FONT_REG, 22), fill="#DFD7CB")

    elif card_type == "roaster":
        # Draw thermal printer label preview
        w, h = 680, 280
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(255, 255, 255, 245), outline="#14110F", width=3)
        
        f_lbl_title = get_font(FONT_BLACK, 32)
        draw.text((x1 + 40, y1 + 35), "THERMAL SMART LABEL", font=f_lbl_title, fill="#14110F")
        draw.text((x1 + 40, y1 + 75), "METHODICAL COFFEE • WORKA SAKARO", font=get_font(FONT_BOLD, 20), fill="#766A62")
        
        # QR Code Mock box
        qr_size = 140
        qr_x = x1 + w - qr_size - 40
        qr_y = y1 + 35
        draw.rectangle([(qr_x, qr_y), (qr_x + qr_size, qr_y + qr_size)], fill="#14110F")
        draw.rectangle([(qr_x + 15, qr_y + 15), (qr_x + qr_size - 15, qr_y + qr_size - 15)], fill="#FFFFFF")
        draw.rectangle([(qr_x + 40, qr_y + 40), (qr_x + qr_size - 40, qr_y + qr_size - 40)], fill="#14110F")
        
        # Recipe specs
        draw.text((x1 + 40, y1 + 125), "RATIO: 1:16.5  •  TEMP: 202°F / 94.4°C", font=get_font(FONT_BOLD, 22), fill="#A8622D")
        draw.text((x1 + 40, y1 + 160), "DOSE: 20.0g  •  WATER: 330g  •  POUR: 3:15", font=get_font(FONT_BOLD, 20), fill="#14110F")
        
        # Zebra / Dymo badge
        draw.rounded_rectangle([(x1 + 40, y1 + 210), (x1 + 360, y1 + 248)], radius=8, fill="#F7F4EE", outline="#ECE6DC", width=1)
        draw.text((x1 + 55, y1 + 218), "DYMO / ZEBRA 300 DPI COMPLIANT", font=get_font(FONT_BOLD, 16), fill="#2F663C")

    elif card_type == "timer":
        # Draw multi-phase timer HUD with animated progress ring
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
        p_str = "STAGE 1: 45s BLOOM"
        pb = f_p.getbbox(p_str)
        draw.text((center_x - (pb[2] - pb[0]) // 2, center_y + 35), p_str, font=f_p, fill="#E8AF72")

    elif card_type == "cafe":
        # Draw on bar today switcher card
        w, h = 720, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 235), outline="#2F663C", width=2)
        
        draw.text((x1 + 40, y1 + 35), "ON BAR TODAY • LIVE RADAR STATUS", font=get_font(FONT_BOLD, 22), fill="#2F663C")
        
        # Item 1 Filter
        draw.text((x1 + 40, y1 + 80), "Pour-Over Filter: Onyx Tropical Weather", font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 160, y1 + 75), (x1 + w - 40, y1 + 115)], radius=12, fill="#EBF3ED")
        draw.text((x1 + w - 145, y1 + 85), "● ON BAR", font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        # Item 2 Espresso
        draw.text((x1 + 40, y1 + 145), "House Espresso: Southern Weather", font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 160, y1 + 140), (x1 + w - 40, y1 + 180)], radius=12, fill="#EBF3ED")
        draw.text((x1 + w - 145, y1 + 150), "● ON BAR", font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        draw.text((x1 + 40, y1 + 208), "Synchronized with Local Coffee Radar across all home baristas.", font=get_font(FONT_REG, 18), fill="#ECE6DC")

    elif card_type == "cta":
        # Draw high-impact CTA card
        w, h = 760, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(247, 244, 238, 250), outline="#C88A4B", width=3)
        
        f_cta_url = get_font(FONT_BLACK, 48)
        u_txt = "thebrew.app"
        ub = f_cta_url.getbbox(u_txt)
        draw.text((center_x - (ub[2] - ub[0]) // 2, y1 + 35), u_txt, font=f_cta_url, fill="#14110F")
        
        draw.text((x1 + 60, y1 + 115), "✔ 100% Free Forever for Roasters & Cafes", font=get_font(FONT_BOLD, 26), fill="#2F663C")
        draw.text((x1 + 60, y1 + 160), "✔ Free Thermal Packaging Studio & QR Generator", font=get_font(FONT_BOLD, 24), fill="#14110F")
        draw.text((x1 + 60, y1 + 205), "✔ Live Foot-Traffic Analytics & Dial-In Telemetry", font=get_font(FONT_BOLD, 24), fill="#14110F")

def render_frame(scene: dict, progress: float, bg_base: Image.Image) -> Image.Image:
    frame = Image.new("RGBA", (WIDTH, HEIGHT), (20, 17, 15, 255))
    
    # 1. Ken Burns Zoom & Subtle Vertical Pan
    zoom = 1.0 + (progress * 0.10)
    nw = int(WIDTH * zoom)
    nh = int(HEIGHT * zoom)
    resized_bg = bg_base.resize((nw, nh), Image.Resampling.BILINEAR)
    
    ox = (nw - WIDTH) // 2
    oy = int((nh - HEIGHT) * (0.2 + 0.6 * progress))
    cropped = resized_bg.crop((ox, oy, ox + WIDTH, oy + HEIGHT))
    frame.paste(cropped, (0, 0))
    
    # 2. Gradient Scrims & Card Overlays
    scrim = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    d_scrim = ImageDraw.Draw(scrim)
    
    # Top header scrim
    for y in range(400):
        a = int(220 * (1.0 - (y / 400.0)))
        d_scrim.line([(0, y), (WIDTH, y)], fill=(15, 12, 10, a))
        
    # Bottom footer scrim
    for y in range(HEIGHT - 450, HEIGHT):
        a = int(240 * ((y - (HEIGHT - 450)) / 450.0))
        d_scrim.line([(0, y), (WIDTH, y)], fill=(15, 12, 10, a))
        
    # Center backdrop for readability
    d_scrim.rectangle([(60, 480), (WIDTH - 60, 1540)], fill=(15, 12, 10, 205))
    d_scrim.rectangle([(60, 480), (WIDTH - 60, 1540)], outline=(68, 59, 54, 255), width=2)
    
    frame = Image.alpha_composite(frame, scrim)
    draw = ImageDraw.Draw(frame)
    
    # 3. Top Safe-Zone Badge (y=230)
    badge = scene["badge"]
    f_badge = get_font(FONT_BOLD, 26)
    bb = f_badge.getbbox(badge)
    bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    bx = (WIDTH - (bw + 50)) // 2
    by = 220
    draw.rounded_rectangle([(bx, by), (bx + bw + 50, by + bh + 24)], radius=16, fill=(20, 17, 15, 230), outline=scene["badge_color"], width=2)
    draw.text((bx + 25, by + 10), badge, font=f_badge, fill="#FAF7F2")
    
    # 4. Main Headline (y=300)
    f_hl = get_font(FONT_BLACK, 60)
    lines = scene["headline"].split("\n")
    hl_y = 300
    for l in lines:
        lb = f_hl.getbbox(l)
        draw.text(((WIDTH - (lb[2] - lb[0])) // 2, hl_y), l, font=f_hl, fill="#F7F4EE")
        hl_y += 70
        
    # 5. Dynamic Graphic Card HUD (y=840)
    draw_hud(draw, scene.get("card_type", "hook"), progress, WIDTH // 2, 840)
    
    # 6. Subtitle & Highlight (Safe zone above bottom 340px: y=1200 - 1460)
    f_sub = get_font(FONT_REG, 30)
    sub_lines = scene["subtitle"].split("\n")
    sy = 1180
    for sl in sub_lines:
        sb = f_sub.getbbox(sl)
        draw.text(((WIDTH - (sb[2] - sb[0])) // 2, sy), sl, font=f_sub, fill="#DFD7CB")
        sy += 44
        
    # Highlight pill
    hi_txt = scene["sub_highlight"]
    f_hi = get_font(FONT_BOLD, 30)
    hb = f_hi.getbbox(hi_txt)
    hw = hb[2] - hb[0]
    hx = (WIDTH - (hw + 50)) // 2
    hy = sy + 30
    draw.rounded_rectangle([(hx, hy), (hx + hw + 50, hy + 56)], radius=14, fill=(38, 30, 25, 240), outline=scene["badge_color"], width=2)
    draw.text((hx + 25, hy + 12), hi_txt, font=f_hi, fill="#F5E8D4")
    
    # 7. Bottom Brand Banner (Safe zone y=1660)
    draw.rounded_rectangle([(100, 1660), (WIDTH - 100, 1750)], radius=20, fill=(200, 138, 75, 255))
    brand_txt = "TheBrew.App • THE SPECIALTY COFFEE ATELIER"
    f_brand = get_font(FONT_BLACK, 30)
    brb = f_brand.getbbox(brand_txt)
    draw.text(((WIDTH - (brb[2] - brb[0])) // 2, 1692), brand_txt, font=f_brand, fill="#14110F")
    
    return frame.convert("RGB")

def build_scene_clip(scene: dict, scene_idx: int) -> Path:
    audio_path = generate_voiceover(scene)
    duration = get_audio_duration(audio_path)
    total_frames = int(duration * FPS)
    print(f"[*] Scene {scene_idx + 1} ({scene['id']}): Duration = {duration:.2f}s ({total_frames} frames)")
    
    bg_path = scene["bg_image"] if scene["bg_image"].exists() else scene["fallback"]
    bg_img = Image.open(bg_path).convert("RGB")
    
    # Scale background to fill 1080x1920
    scale = max(WIDTH / bg_img.width, HEIGHT / bg_img.height) * 1.2
    bg_img = bg_img.resize((int(bg_img.width * scale), int(bg_img.height * scale)), Image.Resampling.BILINEAR)
    
    frames_dir = TEMP_DIR / f"frames_{scene['id']}"
    frames_dir.mkdir(parents=True, exist_ok=True)
    
    for fi in range(total_frames):
        p = fi / float(max(1, total_frames - 1))
        f_img = render_frame(scene, p, bg_img)
        f_path = frames_dir / f"f_{fi:05d}.jpg"
        f_img.save(f_path, quality=88)
        
    scene_mp4 = TEMP_DIR / f"{scene['id']}.mp4"
    if scene_mp4.exists():
        scene_mp4.unlink()
        
    cmd = [
        FFMPEG_EXE, "-y",
        "-framerate", str(FPS),
        "-i", str(frames_dir / "f_%05d.jpg"),
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(scene_mp4)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg error: {res.stderr}")
        
    print(f"[OK] Scene {scene_idx + 1} rendered: {scene_mp4}")
    return scene_mp4

def main():
    print("==================================================================")
    print("🎬 ROASTER & CAFE PARTNER SHORT VIDEO PRODUCER (1080x1920 9:16)")
    print("==================================================================")
    
    clips = []
    for i, s in enumerate(SCENES):
        c = build_scene_clip(s, i)
        clips.append(c)
        
    concat_txt = TEMP_DIR / "concat_list.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for cl in clips:
            f.write(f"file '{cl.resolve().as_posix()}'\n")
            
    final_mp4 = OUTPUT_DIR / "roasters_and_cafes_partner_walkthrough.mp4"
    if final_mp4.exists():
        final_mp4.unlink()
        
    print(f"[*] Concatenating scenes into final video: {final_mp4}...")
    cmd = [
        FFMPEG_EXE, "-y",
        "-f", "concat",
        "-safe", "0",
        "-i", str(concat_txt),
        "-c", "copy",
        str(final_mp4)
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode != 0:
        raise RuntimeError(f"FFmpeg concat error: {res.stderr}")
        
    # Also create WebM version for cross-browser HTML5 fallback
    final_webm = OUTPUT_DIR / "roasters_and_cafes_partner_walkthrough.webm"
    print(f"[*] Creating WebM version: {final_webm}...")
    cmd_webm = [
        FFMPEG_EXE, "-y",
        "-i", str(final_mp4),
        "-c:v", "libvpx-vp9",
        "-crf", "30",
        "-b:v", "0",
        "-c:a", "libopus",
        str(final_webm)
    ]
    subprocess.run(cmd_webm, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    # Also copy to social directory for social media campaign packs
    social_mp4 = SOCIAL_DIR / "roasters_and_cafes_walkthrough_short.mp4"
    shutil.copy2(final_mp4, social_mp4)
    
    print("\n==================================================================")
    print(f"✅ FINAL VIDEO GENERATED SUCCESSFULLY!")
    print(f"📁 MP4 Output:    {final_mp4} ({final_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"📁 WebM Output:   {final_webm} ({final_webm.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"📁 Social Assets: {social_mp4}")
    print("==================================================================")

if __name__ == "__main__":
    main()
