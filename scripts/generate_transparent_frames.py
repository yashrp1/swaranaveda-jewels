#!/usr/bin/env python3
"""
SWARNAVEDA JEWELS — Transparent 60-Frame Cinematic Sequence Generator
Generates 60 high-resolution, fully transparent RGBA frames (hero-necklace-0001.webp to 0060.webp)
strictly from transparent_necklace_master.png with 3D rotation, camera dolly zoom,
specular light sweep across gold links, and gemstone glints.
"""

from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import math, os

def create_transparent_frames():
    src_path = 'transparent_necklace_master.png'
    out_dir = 'assets/jewellery/gold/hero-necklace'
    os.makedirs(out_dir, exist_ok=True)

    base = Image.open(src_path).convert('RGBA')
    W, H = base.size

    total_frames = 60
    print(f"Generating {total_frames} transparent cinematic frames from {src_path} ({W}x{H})...")

    # Pre-extract alpha mask of the base necklace for specular sweeps
    base_alpha = base.split()[3]

    for i in range(1, total_frames + 1):
        t = (i - 1) / (total_frames - 1)  # 0.0 to 1.0

        # Cinematic choreography matching BrewDistrict scroll dynamics:
        # Phase 1 (0.0 to 0.30): Initial float, gentle yaw tilt left (-7 deg), light sweep across left collar
        # Phase 2 (0.30 to 0.70): Dolly zoom in (1.0 to 1.18x), yaw tilts right (+8 deg), light sweep across ruby
        # Phase 3 (0.70 to 1.00): Pull back to 1.0x, yaw eases back to 0 deg, settles onto vitrine pedestal
        if t < 0.30:
            p = t / 0.30
            smooth_p = math.sin(p * math.pi / 2)
            scale = 1.00 + smooth_p * 0.04
            rot_deg = -7.0 * math.sin(smooth_p * math.pi)
            light_x = -0.2 + smooth_p * 0.7
            glint_ruby = smooth_p * 0.7
            glint_pearls = 0.0
            pan_y = int(smooth_p * 5)
        elif t < 0.70:
            p = (t - 0.30) / 0.40
            smooth_p = (1 - math.cos(p * math.pi)) / 2 # Smooth S-curve
            scale = 1.04 + smooth_p * 0.14  # Peak zoom 1.18x
            rot_deg = -7.0 * (1 - smooth_p) + 8.0 * smooth_p
            light_x = 0.5 + smooth_p * 0.45
            glint_ruby = 0.7 + math.sin(p * math.pi * 2) * 0.45
            glint_pearls = smooth_p * 0.8
            pan_y = int(5 + math.sin(p * math.pi) * 15)
        else:
            p = (t - 0.70) / 0.30
            smooth_p = math.sin(p * math.pi / 2)
            scale = 1.18 - smooth_p * 0.18  # Back to 1.0x
            rot_deg = 8.0 * (1.0 - smooth_p)
            light_x = 0.95 - smooth_p * 0.35
            glint_ruby = 0.5 * (1.0 - smooth_p * 0.6)
            glint_pearls = 0.8 * (1.0 - smooth_p * 0.6)
            pan_y = int(20 * (1.0 - smooth_p))

        # 1. Transform base necklace (LANCZOS resize)
        curr_w = int(W * scale)
        curr_h = int(H * scale)
        frame_neck = base.resize((curr_w, curr_h), Image.Resampling.LANCZOS)

        # 2. Smooth 3D rotation
        if abs(rot_deg) > 0.05:
            frame_neck = frame_neck.rotate(rot_deg, resample=Image.Resampling.BICUBIC, expand=False)

        # 3. Transparent target 1024x1024 canvas
        frame_canvas = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        paste_x = (W - frame_neck.size[0]) // 2
        paste_y = (H - frame_neck.size[1]) // 2 + pan_y
        frame_canvas.paste(frame_neck, (paste_x, paste_y), frame_neck)

        # 4. Specular light sweep (strictly masked to non-transparent necklace pixels)
        sweep_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        s_draw = ImageDraw.Draw(sweep_img)
        beam_x = int(W * light_x)
        beam_width = 170

        for off in range(-beam_width, beam_width, 8):
            alpha = int(70 * (1 - abs(off) / beam_width))
            if alpha > 0:
                s_draw.line([(beam_x + off - 60, 0), (beam_x + off + 60, H)],
                            fill=(255, 245, 220, alpha), width=8)

        sweep_img = sweep_img.filter(ImageFilter.GaussianBlur(14))

        # Mask sweep with current frame's alpha channel
        frame_a = frame_canvas.split()[3]
        sw_r, sw_g, sw_b, sw_a = sweep_img.split()
        masked_sw_a = Image.composite(sw_a, Image.new('L', (W, H), 0), frame_a)
        sweep_img.putalpha(masked_sw_a)

        # Composite sweep additively
        frame_canvas = Image.alpha_composite(frame_canvas, sweep_img)

        # 5. Dynamic Gemstone Glints
        if glint_ruby > 0.25:
            glint_img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            g_draw = ImageDraw.Draw(glint_img)

            ruby_cx = W // 2 + int(rot_deg * 2.5)
            ruby_cy = int(H * 0.46 * scale) + (H - int(H * scale)) // 2 + pan_y
            g_size = int(14 * min(1.3, glint_ruby))

            g_draw.ellipse([ruby_cx - g_size, ruby_cy - g_size, ruby_cx + g_size, ruby_cy + g_size],
                           fill=(255, 245, 220, int(150 * min(1.0, glint_ruby))))
            g_draw.line([ruby_cx - g_size * 2, ruby_cy, ruby_cx + g_size * 2, ruby_cy],
                        fill=(255, 255, 255, int(230 * min(1.0, glint_ruby))), width=2)
            g_draw.line([ruby_cx, ruby_cy - g_size * 2, ruby_cx, ruby_cy + g_size * 2],
                        fill=(255, 255, 255, int(230 * min(1.0, glint_ruby))), width=2)

            if glint_pearls > 0.3:
                pearl_x = W // 2 + int(rot_deg * 2.0)
                pearl_y = int(H * 0.83 * scale) + (H - int(H * scale)) // 2 + pan_y
                p_size = int(8 * min(1.0, glint_pearls))
                g_draw.ellipse([pearl_x - p_size, pearl_y - p_size, pearl_x + p_size, pearl_y + p_size],
                               fill=(255, 255, 255, int(160 * min(1.0, glint_pearls))))

            glint_img = glint_img.filter(ImageFilter.GaussianBlur(1.5))
            frame_canvas = Image.alpha_composite(frame_canvas, glint_img)

        # 6. Save as transparent WebP
        frame_name = f"hero-necklace-{i:04d}.webp"
        save_path = os.path.join(out_dir, frame_name)
        frame_canvas.save(save_path, 'WEBP', quality=92)

        if i % 15 == 0 or i == total_frames:
            print(f"Generated transparent frame {i}/{total_frames}: {frame_name}")

    print("Complete! 60 transparent frames successfully generated.")

if __name__ == '__main__':
    create_transparent_frames()
