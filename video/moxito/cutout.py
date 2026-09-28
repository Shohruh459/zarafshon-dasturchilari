"""Crops the elements out of src/sheet.png and removes their backgrounds (rembg / ISNet)."""
from PIL import Image
from rembg import new_session, remove

# (left, top, right, bottom) boxes in the 1408x768 source sheet
BOXES = {
    'mint':    (119, 69, 316, 224),
    'lime':    (333, 69, 572, 224),
    'ice':     (119, 264, 267, 386),
    'coaster': (287, 264, 422, 386),
    'straw':   (441, 264, 578, 386),
}

sheet = Image.open('src/sheet.png').convert('RGB')

# The small print on the glass came out garbled in the source image
# ("FRESN, REFRESUING..."). Inpaint its white letters so it reads as condensation.
import numpy as np
import cv2
_im = np.array(sheet)
x0, y0, x1, y1 = 640, 430, 822, 482
_hsv = cv2.cvtColor(_im[y0:y1, x0:x1], cv2.COLOR_RGB2HSV)
_m = ((_hsv[..., 2] > 200) & (_hsv[..., 1] < 70)).astype(np.uint8)
_mask = np.zeros(_im.shape[:2], np.uint8)
_mask[y0:y1, x0:x1] = cv2.dilate(_m, np.ones((7, 7), np.uint8)) * 255
_im = cv2.inpaint(_im, _mask, 6, cv2.INPAINT_TELEA)
_noise = np.random.default_rng(1).normal(0, 6, _im.shape)  # restore a little frosted-glass grain
_im = np.where(_mask[..., None] > 0, np.clip(_im + _noise, 0, 255), _im).astype(np.uint8)
sheet = Image.fromarray(_im)
session = new_session('isnet-general-use')
for name, box in BOXES.items():
    crop = sheet.crop(box)
    out = remove(crop, session=session, post_process_mask=True)
    out = out.crop(out.getbbox())
    out.save(f'assets/{name}.png')
    print(name, out.size)

# The beach scene is a full background, so it is only cropped (no cut-out).
sheet.crop((121, 427, 577, 688)).save('assets/beach.jpg', quality=95)

# Glass held by the hand: u2net keeps the hand, ISNet drops it and leaves a notch.
gh = remove(sheet.crop((545, 90, 1408, 712)), session=new_session('u2net'))
gh.crop(gh.getbbox()).save('assets/glass_hand.png')

# Logo: the wordmark sits on a flat light-grey wall. Flood-fill the wall from the
# crop border (the white letters are enclosed by a dark outline, so they survive),
# which keeps the letters intact where the AI models ate the white parts.
import numpy as np
import cv2
logo = np.array(sheet.crop((1012, 118, 1260, 244)))
h, w = logo.shape[:2]
mask = np.zeros((h + 2, w + 2), np.uint8)
flags = 4 | cv2.FLOODFILL_MASK_ONLY | cv2.FLOODFILL_FIXED_RANGE | (255 << 8)
for x, y in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1)]:
    cv2.floodFill(logo.copy(), mask, (x, y), 0, (24, 24, 24), (24, 24, 24), flags)
bg = mask[1:-1, 1:-1] > 0
bg = cv2.morphologyEx(bg.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
fg = (1 - bg).astype(np.uint8)
# Keep only the largest blob (the outlined wordmark); drops wall seams and the garbled tagline.
n, labels, stats, _ = cv2.connectedComponentsWithStats(fg, connectivity=8)
fg = (labels == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])).astype(np.uint8)
alpha = cv2.GaussianBlur(fg * 255, (3, 3), 0)
rgba = np.dstack([logo, alpha])
out = Image.fromarray(rgba, 'RGBA')
out.crop(out.getbbox()).save('assets/logo.png')

# The sheet is small (1408x768), so upscale every cut-out 3x with Lanczos plus a
# light unsharp mask; the browser then only ever scales these down.
import glob
for f in glob.glob('assets/*.png'):
    if '@3x' in f:
        continue
    im = Image.open(f)
    rgb = cv2.resize(np.array(im), (im.width * 3, im.height * 3), interpolation=cv2.INTER_LANCZOS4)
    blur = cv2.GaussianBlur(rgb, (0, 0), 2)
    rgb[..., :3] = cv2.addWeighted(rgb[..., :3], 1.5, blur[..., :3], -0.5, 0)
    Image.fromarray(rgb, 'RGBA').save(f.replace('.png', '@3x.png'))
