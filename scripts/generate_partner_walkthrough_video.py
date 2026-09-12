# pyright: reportMissingImports=false
import os
import sys
import math
import subprocess
import wave
import shutil
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from gtts import gTTS
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
        "script": "First, enter your roastery credentials, bean origin details, and signature dial-in parameters. In moments, our packaging studio produces crisp three-hundred D-P-I thermal labels, complete with embedded recipe Q-R codes formatted for Dymo and Zebra roll printers.",
        "badge": "1. ROASTERY STUDIO • THERMAL LABELS",
        "badge_color": "#D97706",
        "headline": "SMART LABELS &\nRECIPE CREATION",
        "subtitle": "Direct-thermal Dymo & Zebra labels (300 DPI).\nError-Correction Level H for effortless optical scanning.",
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
        "fallback": ASSETS_DIR / "scene_local_radar.png",
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

def generate_voiceover(scene: dict) -> Path:
    raw_mp3 = TEMP_DIR / f"{scene['id']}_raw.mp3"
    wav_path = TEMP_DIR / f"{scene['id']}.wav"
    
    # 1. Generate natural British barista speech with gTTS
    tts = gTTS(text=scene["script"], lang="en", tld="co.uk", slow=False)
    tts.save(str(raw_mp3))
    
    # 2. Warm studio equalizer & broadcast audio normalization
    cmd = [
        FFMPEG_EXE, "-y",
        "-i", str(raw_mp3),
        "-af", "volume=1.25,equalizer=f=220:t=q:w=1.2:g=2.5,equalizer=f=3200:t=q:w=1:g=1.5,loudnorm=I=-16:TP=-1.5:LRA=11",
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

def draw_hud(draw: ImageDraw.Draw, card_type: str, progress: float, center_x: int, center_y: int):
    if card_type == "hook":
        # Draw elegant dual-pillar badge for roasters & cafes
        w, h = 760, 240
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 220), outline="#C88A4B", width=2)
        
        f_sub = get_font(FONT_BOLD, 26)
        draw.text((x1 + 40, y1 + 45), "☕ FOR ARTISAN ROASTERS", font=f_sub, fill="#F5E8D4")
        draw.text((x1 + 40, y1 + 85), "• 300 DPI Thermal QR Labels & Smart Bag Scanning", font=get_font(FONT_REG, 22), fill="#DFD7CB")
        
        draw.text((x1 + 40, y1 + 135), "🏪 FOR SPECIALTY COFFEE SHOPS", font=f_sub, fill="#C8E0CD")
        draw.text((x1 + 40, y1 + 175), "• Live 'On Bar Today' Menu Switcher & Local Radar", font=get_font(FONT_REG, 22), fill="#DFD7CB")

    elif card_type == "roaster":
        # Draw thermal printer label preview with generic artisan branding
        w, h = 680, 280
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(255, 255, 255, 245), outline="#14110F", width=3)
        
        f_lbl_title = get_font(FONT_BLACK, 32)
        draw.text((x1 + 40, y1 + 35), "THERMAL SMART LABEL", font=f_lbl_title, fill="#14110F")
        draw.text((x1 + 40, y1 + 75), "ARTISAN ROASTERY • SIGNATURE LOT", font=get_font(FONT_BOLD, 20), fill="#766A62")
        
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
        # Draw on bar today switcher card with generic items
        w, h = 720, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(20, 17, 15, 235), outline="#2F663C", width=2)
        
        draw.text((x1 + 40, y1 + 35), "ON BAR TODAY • LIVE RADAR STATUS", font=get_font(FONT_BOLD, 22), fill="#2F663C")
        
        # Item 1 Filter
        draw.text((x1 + 40, y1 + 80), "Seasonal Single-Origin Batch Brew", font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 160, y1 + 75), (x1 + w - 40, y1 + 115)], radius=12, fill="#EBF3ED")
        draw.text((x1 + w - 145, y1 + 85), "● ON BAR", font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        # Item 2 Espresso
        draw.text((x1 + 40, y1 + 145), "Artisan Signature Espresso", font=get_font(FONT_BOLD, 24), fill="#FAF7F2")
        draw.rounded_rectangle([(x1 + w - 160, y1 + 140), (x1 + w - 40, y1 + 180)], radius=12, fill="#EBF3ED")
        draw.text((x1 + w - 145, y1 + 150), "● ON BAR", font=get_font(FONT_BOLD, 18), fill="#2F663C")
        
        draw.text((x1 + 40, y1 + 208), "Synchronized with Local Coffee Radar across all home baristas.", font=get_font(FONT_REG, 18), fill="#ECE6DC")

    elif card_type == "cta":
        # Draw high-impact CTA card without cost or pricing mentions
        w, h = 760, 260
        x1, y1 = center_x - w // 2, center_y - h // 2
        draw.rounded_rectangle([(x1, y1), (x1 + w, y1 + h)], radius=24, fill=(247, 244, 238, 250), outline="#C88A4B", width=3)
        
        f_cta_url = get_font(FONT_BLACK, 48)
        u_txt = "thebrew.app"
        ub = f_cta_url.getbbox(u_txt)
        draw.text((center_x - (ub[2] - ub[0]) // 2, y1 + 35), u_txt, font=f_cta_url, fill="#14110F")
        
        draw.text((x1 + 60, y1 + 115), "✔ Dedicated Roaster & Cafe Ecosystem", font=get_font(FONT_BOLD, 26), fill="#2F663C")
        draw.text((x1 + 60, y1 + 160), "✔ 300 DPI Thermal Packaging & QR Studio", font=get_font(FONT_BOLD, 24), fill="#14110F")
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
    
    d_scrim.rectangle([(0, 0), (WIDTH, 340)], fill=(12, 10, 8, 220))
    d_scrim.rectangle([(0, 340), (WIDTH, 520)], fill=(12, 10, 8, 140))
    d_scrim.rectangle([(0, HEIGHT - 680), (WIDTH, HEIGHT)], fill=(12, 10, 8, 240))
    
    frame = Image.alpha_composite(frame, scrim)
    draw = ImageDraw.Draw(frame)
    
    # 3. Top Safe Zone Header (Platform Logo & Mission Badge)
    header_y = 140
    badge_txt = scene["badge"]
    f_badge = get_font(FONT_BOLD, 22)
    b_box = f_badge.getbbox(badge_txt)
    bw = (b_box[2] - b_box[0]) + 48
    bh = 46
    bx = (WIDTH - bw) // 2
    
    draw.rounded_rectangle([(bx, header_y), (bx + bw, header_y + bh)], radius=14, fill=(18, 14, 11, 230), outline=scene["badge_color"], width=2)
    draw.text((bx + 24, header_y + 11), badge_txt, font=f_badge, fill=scene["badge_color"])
    
    # Main Headline
    f_head = get_font(FONT_BLACK, 62)
    lines = scene["headline"].split("\n")
    hl_y = header_y + bh + 30
    for line in lines:
        l_box = f_head.getbbox(line)
        lx = (WIDTH - (l_box[2] - l_box[0])) // 2
        # Drop shadow
        draw.text((lx + 3, hl_y + 3), line, font=f_head, fill=(0, 0, 0, 200))
        draw.text((lx, hl_y), line, font=f_head, fill="#FAF7F2")
        hl_y += 74
        
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
    hud_center_y = 1040
    draw_hud(draw, scene["card_type"], progress, WIDTH // 2, hud_center_y)
    
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
    
    f_sh = get_font(FONT_BOLD, 30)
    sh_txt = scene["sub_highlight"]
    sh_b = f_sh.getbbox(sh_txt)
    sh_x = (WIDTH - (sh_b[2] - sh_b[0])) // 2
    draw.text((sh_x, bottom_card_y + 30), sh_txt, font=f_sh, fill="#E8AF72")
    
    f_domain = get_font(FONT_BOLD, 22)
    d_txt = "TheBrew.App • Precision Coffee Guide & Partner Onboarding"
    db = f_domain.getbbox(d_txt)
    dx = (WIDTH - (db[2] - db[0])) // 2
    draw.text((dx, bottom_card_y + 82), d_txt, font=f_domain, fill="#A89F91")
    
    # 6. Overall Scene Progress Bar
    bar_y = HEIGHT - 12
    draw.rectangle([(0, bar_y), (WIDTH, HEIGHT)], fill=(20, 17, 15, 255))
    draw.rectangle([(0, bar_y), (int(WIDTH * progress), HEIGHT)], fill="#D69550")
    
    return frame.convert("RGB")

def build_scene_clip(scene: dict, scene_idx: int) -> Path:
    print(f"\n--- [Scene {scene_idx + 1}/{len(SCENES)}] Processing {scene['id']} ---")
    
    audio_path = generate_voiceover(scene)
    duration = get_audio_duration(audio_path)
    print(f"-> Audio duration: {duration:.2f}s")
    
    total_frames = int(math.ceil(duration * FPS))
    print(f"-> Rendering {total_frames} frames @ {FPS} fps...")
    
    # Load background image
    bg_source = scene["bg_image"] if scene["bg_image"].exists() else scene["fallback"]
    bg_img = Image.open(bg_source).convert("RGBA")
    
    frames_dir = TEMP_DIR / f"frames_{scene['id']}"
    if frames_dir.exists():
        shutil.rmtree(frames_dir)
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
    print("🇬🇧 Natural British Barista Voiceover • Generic Brand Onboarding")
    print("==================================================================")
    
    clips = []
    total_dur = 0.0
    for i, s in enumerate(SCENES):
        c = build_scene_clip(s, i)
        clips.append(c)
        
    concat_txt = TEMP_DIR / "concat_list.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for cl in clips:
            f.write(f"file '{cl.resolve().as_posix()}'\n")
            
    final_mp4 = OUTPUT_DIR / "roasters_and_cafes_partner_walkthrough.mp4"
    smart_bag_mp4 = OUTPUT_DIR / "smart_bag_scan_demo.mp4"
    
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
        
    # Copy to smart_bag_scan_demo.mp4 so both modal endpoints resolve the updated British video
    shutil.copy2(final_mp4, smart_bag_mp4)
        
    # Also create WebM versions for cross-browser HTML5 fallback
    final_webm = OUTPUT_DIR / "roasters_and_cafes_partner_walkthrough.webm"
    smart_bag_webm = OUTPUT_DIR / "smart_bag_scan_demo.webm"
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
    shutil.copy2(final_webm, smart_bag_webm)
    
    # Also copy to social directory for social media campaign packs
    social_mp4 = SOCIAL_DIR / "roasters_and_cafes_walkthrough_short.mp4"
    shutil.copy2(final_mp4, social_mp4)
    
    print("\n==================================================================")
    print(f"✅ FINAL VIDEO GENERATED SUCCESSFULLY!")
    print(f"📁 MP4 Walkthrough: {final_mp4} ({final_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"📁 MP4 Smart Bag:   {smart_bag_mp4} ({smart_bag_mp4.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"📁 WebM Version:    {final_webm} ({final_webm.stat().st_size / 1024 / 1024:.2f} MB)")
    print(f"📁 Social Assets:   {social_mp4}")
    print("==================================================================")

if __name__ == "__main__":
    main()
