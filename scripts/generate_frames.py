#!/usr/bin/env python3
"""
SWARNAVEDA JEWELS — Master 60-Frame Cinematic Sequence Generator
Generates 60 high-resolution, brilliantly illuminated frames (hero-necklace-0001.webp to hero-necklace-0060.webp)
strictly from clean_base.png with full 22K gold color, dynamic 3D rotation, specular light sweeps,
and smooth camera dolly zoom.
"""

from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import math, os

def create_frames():
    src_path = 'clean_base.png'
    out_dir = 'assets/jewellery/gold/hero-necklace'
    os.makedirs(out_dir, exist_ok=True)

    base = Image.open(src_path).convert('RGB')
    W, H = base.size

    total_frames = 60
    print(f"Generating {total_frames} cinematic frames from {src_path} ({W}x{H})...")

    for i in range(1, total_frames + 1):
        t = (i - 1) / (total_frames - 1) # 0.0 to 1.0

        # Timeline choreography
        if t < 0.25:
            p = t / 0.25
            scale = 1.00 + p * 0.03
            rot_deg = -5.0 * math.sin(p * math.pi)
            brightness = 1.02 + p * 0.08
            contrast = 1.15
            light_x = -0.3 + p * 0.8
            glint_ruby = p * 0.8
            glint_pearls = 0.0
            pan_y = 0
        elif t < 0.60:
            p = (t - 0.25) / 0.35
            scale = 1.03 + p * 0.13 # Zoom up to 1.16x
            rot_deg = 3.5 * math.sin(p * math.pi)
            brightness = 1.10 + math.sin(p * math.pi) * 0.10
            contrast = 1.18
            light_x = 0.5 + p * 0.5
            glint_ruby = 0.8 + math.sin(p * math.pi * 2) * 0.4
            glint_pearls = p * 0.5
            pan_y = int(p * 20)
        elif t < 0.85:
            p = (t - 0.60) / 0.25
            scale = 1.16 - p * 0.14 # Pull back to 1.02
            rot_deg = 2.0 * (1 - p)
            brightness = 1.12 - p * 0.08
            contrast = 1.15
            light_x = 1.0 - p * 0.4
            glint_ruby = 0.6 * (1 - p * 0.5)
            glint_pearls = 0.7 + math.sin(p * math.pi) * 0.5
            pan_y = int((1 - p) * 20)
        else:
            p = (t - 0.85) / 0.15
            scale = 1.02 - p * 0.02 # Exactly 1.0
            rot_deg = 0.0
            brightness = 1.04
            contrast = 1.15
            light_x = 0.6
            glint_ruby = 0.5 * (1 - p * 0.5)
            glint_pearls = 0.4 * (1 - p * 0.5)
            pan_y = 0

        # Transform base necklace
        curr_w = int(W * scale)
        curr_h = int(H * scale)
        frame_neck = base.resize((curr_w, curr_h), Image.Resampling.LANCZOS)

        if abs(rot_deg) > 0.05:
            frame_neck = frame_neck.rotate(rot_deg, resample=Image.Resampling.BICUBIC, expand=False)

        # Enhance brightness & contrast
        enh_b = ImageEnhance.Brightness(frame_neck).enhance(brightness)
        enh_c = ImageEnhance.Contrast(enh_b).enhance(contrast)

        # Composite centered onto target 1024x1024 canvas
        frame_canvas = Image.new('RGB', (W, H), (0, 0, 0))
        paste_x = (W - enh_c.size[0]) // 2
        paste_y = (H - enh_c.size[1]) // 2 + pan_y
        frame_canvas.paste(enh_c, (paste_x, paste_y))

        # Specular light sweep across gold links (luminance masked)
        sweep_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(sweep_img)
        beam_x = int(W * light_x)
        beam_width = 180

        for off in range(-beam_width, beam_width, 8):
            alpha = int(75 * (1 - abs(off) / beam_width))
            if alpha > 0:
                s_draw.line([(beam_x + off - 60, 0), (beam_x + off + 60, H)],
                            fill=(255, 240, 205, alpha), width=8)

        sweep_img = sweep_img.filter(ImageFilter.GaussianBlur(16))

        # Composite necklace
        canvas_rgba = frame_canvas.convert('RGBA')

        # Luminance mask: light sweep only reflects on the jewellery (pixels with brightness > 30)
        # Create mask from frame_canvas
        gray = frame_canvas.convert('L')
        # Mask where jewellery is
        mask = gray.point(lambda p: int(min(255, p * 1.5)) if p > 25 else 0)
        
        # Apply mask to sweep
        sweep_r, sweep_g, sweep_b, sweep_a = sweep_img.split()
        sweep_masked_a = Image.composite(sweep_a, Image.new('L', (W, H), 0), mask)
        sweep_img.putalpha(sweep_masked_a)

        canvas_rgba = Image.alpha_composite(canvas_rgba, sweep_img)

        # Glints
        if glint_ruby > 0.2:
            glint_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            g_draw = ImageDraw.Draw(glint_img)

            # Central ruby location in 1024x1024
            ruby_cx = W // 2
            ruby_cy = int(H * 0.46) + pan_y
            g_size = int(14 * min(1.2, glint_ruby))

            g_draw.ellipse([ruby_cx - g_size, ruby_cy - g_size, ruby_cx + g_size, ruby_cy + g_size],
                           fill=(255, 240, 210, int(160 * min(1.0, glint_ruby))))
            g_draw.line([ruby_cx - g_size * 2, ruby_cy, ruby_cx + g_size * 2, ruby_cy],
                        fill=(255, 255, 255, int(240 * min(1.0, glint_ruby))), width=2)
            g_draw.line([ruby_cx, ruby_cy - g_size * 2, ruby_cx, ruby_cy + g_size * 2],
                        fill=(255, 255, 255, int(240 * min(1.0, glint_ruby))), width=2)

            # Pearl glint
            if glint_pearls > 0.2:
                pearl_x = W // 2
                pearl_y = int(H * 0.83) + pan_y
                p_size = int(8 * min(1.0, glint_pearls))
                g_draw.ellipse([pearl_x - p_size, pearl_y - p_size, pearl_x + p_size, pearl_y + p_size],
                               fill=(255, 255, 255, int(160 * min(1.0, glint_pearls))))

            glint_img = glint_img.filter(ImageFilter.GaussianBlur(1.5))
            canvas_rgba = Image.alpha_composite(canvas_rgba, glint_img)

        final_rgb = canvas_rgba.convert('RGB')
        
        # Feather outer 40px boundary to pure (0,0,0) black so zero rectangular borders ever exist
        pix = final_rgb.load()
        for py in range(H):
            for px in range(W):
                d_b = min(px, py, W - 1 - px, H - 1 - py)
                if d_b < 40:
                    f = (d_b / 40.0) ** 2
                    r, g, b = pix[px, py]
                    pix[px, py] = (int(r * f), int(g * f), int(b * f))

        frame_name = f"hero-necklace-{i:04d}.webp"
        save_path = os.path.join(out_dir, frame_name)
        final_rgb.save(save_path, 'WEBP', quality=90)

        if i % 15 == 0 or i == total_frames:
            print(f"Generated frame {i}/{total_frames}: {frame_name}")

    print("Complete! 60 brilliant frames generated.")

if __name__ == '__main__':
    create_frames()
