"""Convert the verified Blender PNG sequence into desktop/mobile WebP assets."""
from pathlib import Path
from PIL import Image

SOURCE = Path('/Users/indigi/Desktop/Swarnaveda_Necklace_Frames')
ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'sequence' / 'gold-necklace'
DESKTOP = ROOT / 'desktop'
MOBILE = ROOT / 'mobile'


def main():
    expected = [SOURCE / f'gold-necklace-0150{i:04d}.png' for i in range(1, 151)]
    missing = [p.name for p in expected if not p.is_file()]
    if missing:
        raise SystemExit(f'Missing source frames: {missing[:12]} ({len(missing)} total)')

    DESKTOP.mkdir(parents=True, exist_ok=True)
    MOBILE.mkdir(parents=True, exist_ok=True)
    for index, path in enumerate(expected, 1):
        with Image.open(path) as source:
            rgba = source.convert('RGBA')
            rgba.save(DESKTOP / f'gold-necklace-{index:04d}.webp', 'WEBP', quality=92, method=5)
            rgba.thumbnail((960, 540), Image.Resampling.LANCZOS)
            rgba.save(MOBILE / f'gold-necklace-{index:04d}.webp', 'WEBP', quality=88, method=5)
        if index % 25 == 0:
            print(f'Converted {index}/150')
    print(f'Assets: {ROOT}')


if __name__ == '__main__':
    main()
