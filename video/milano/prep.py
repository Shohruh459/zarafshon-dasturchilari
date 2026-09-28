"""
Prepares the Milano Foods photos in src/ (supplied by the restaurant) for scene.html:
resizes them and cuts the sushi out of their white backgrounds (rembg / ISNet), so
they can float over the dark scene.

Usage:  cd video/milano && python3 prep.py
"""
import os

from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, OUT = os.path.join(HERE, 'src'), os.path.join(HERE, 'assets')
os.makedirs(OUT, exist_ok=True)


def fit(im, max_side):
    s = max_side / max(im.size)
    return im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS) if s < 1 else im


# Photos used whole
for src, out, side in [('burger.jpg', 'burger.jpg', 1600), ('pizza.jpg', 'pizza.jpg', 1400), ('combo.png', 'combo.jpg', 1254)]:
    fit(Image.open(os.path.join(SRC, src)).convert('RGB'), side).save(os.path.join(OUT, out), quality=92)

# Logo on white: cropped to its content, kept on white (it sits on a white card).
logo = Image.open(os.path.join(SRC, 'logo.jpg')).convert('RGB')
gray = logo.convert('L').point(lambda v: 255 if v < 235 else 0)
box = gray.getbbox()
pad = 24
logo.crop((box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad)).save(os.path.join(OUT, 'logo.png'))

# Sushi on white backgrounds: cut out
from rembg import new_session, remove  # noqa: E402

session = new_session('isnet-general-use')
for name in ['sushi-set', 'roll-1', 'roll-2', 'roll-3']:
    im = Image.open(os.path.join(SRC, f'{name}.webp')).convert('RGB')
    cut = remove(im, session=session, post_process_mask=True)
    cut = cut.crop(cut.getbbox())
    # small sources: upscale 2x so the browser only ever scales down
    cut = cut.resize((cut.width * 2, cut.height * 2), Image.LANCZOS)
    rgb = cut.convert('RGB').filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))
    rgb.putalpha(cut.getchannel('A'))
    rgb.save(os.path.join(OUT, f'{name}.png'))
    print(name, rgb.size)
