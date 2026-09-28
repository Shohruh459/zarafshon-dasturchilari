"""
Cuts src/exploded.png (the restaurant's "exploded" burger image) into its layers
for scene.html: rembg (ISNet) separates the burger from the background, then each
boundary between two layers is a seam through the emptiest pixels of a horizontal
band (dynamic programming, like seam carving), so it follows the gaps between the
layers. Small loose bits (sesame, sauce drops, lettuce shreds) become one
"particles" layer. Writes assets/<name>.png cropped to content and
assets/layers.json with each layer's box in source pixels (top to bottom).

Usage:  cd video/milano-burger && python3 layers.py
"""
import json
import os

import cv2
import numpy as np
from PIL import Image
from rembg import new_session, remove

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'assets')
os.makedirs(OUT, exist_ok=True)

im = Image.open(os.path.join(HERE, 'src', 'exploded.png')).convert('RGB')
rgb = np.array(im)
H, W = rgb.shape[:2]
alpha = np.array(remove(im, session=new_session('isnet-general-use')).getchannel('A'))

# layers top to bottom, and the band (y0, y1) where the seam below each one runs
NAMES = ['bun-top', 'jalapeno', 'onion', 'cheese', 'patty', 'tomato', 'lettuce', 'bun-bottom']
BANDS = [(380, 480), (575, 632), (700, 790), (840, 905), (1060, 1110), (1170, 1235), (1380, 1435)]

hsv = cv2.cvtColor(rgb, cv2.COLOR_RGB2HSV)
green = ((hsv[..., 0] >= 22) & (hsv[..., 0] <= 48) & (hsv[..., 1] > 90)).astype(np.float32)
green = cv2.dilate(green, np.ones((9, 9), np.uint8))


def seam(y0, y1, extra=None):
    """Lowest-cost left-to-right path through rows y0..y1 (one y per column)."""
    cost = alpha[y0:y1].astype(np.float32) / 255
    if extra is not None:
        cost = cost + extra[y0:y1] * 4
    h = y1 - y0
    acc = cost.copy()
    back = np.zeros((h, W), np.int32)
    for x in range(1, W):
        prev = acc[:, x - 1]
        cand = np.stack([np.r_[np.inf, prev[:-1]], prev, np.r_[prev[1:], np.inf]])  # from y-1, y, y+1
        k = np.argmin(cand, axis=0)
        acc[:, x] += cand[k, np.arange(h)]
        back[:, x] = np.arange(h) + k - 1
    ys = np.zeros(W, np.int32)
    ys[-1] = int(np.argmin(acc[:, -1]))
    for x in range(W - 1, 0, -1):
        ys[x - 1] = back[ys[x], x]
    return ys + y0


# the seams above and below the jalapeños avoid green, so their slices stay whole
seams = [seam(y0, y1, green if i < 2 else None) for i, (y0, y1) in enumerate(BANDS)]
rows = np.arange(H)[:, None]
bounds = [np.zeros(W, np.int32)] + seams + [np.full(W, H, np.int32)]

# loose bits: small connected pieces of the mask
fg = (alpha > 100).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(fg, 8)
small = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] < 2500])

meta = []
for i, name in enumerate(NAMES):
    region = (rows >= bounds[i][None, :]) & (rows < bounds[i + 1][None, :]) & ~small
    a = (alpha * region).astype(np.uint8)
    ys, xs = np.nonzero(a > 8)
    x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    Image.fromarray(np.dstack([rgb, a])[y0:y1, x0:x1], 'RGBA').save(os.path.join(OUT, f'{name}.png'))
    meta.append({'name': name, 'x': int(x0), 'y': int(y0), 'w': int(x1 - x0), 'h': int(y1 - y0)})
    print(name, meta[-1])

pa = (alpha * small).astype(np.uint8)
Image.fromarray(np.dstack([rgb, pa]), 'RGBA').save(os.path.join(OUT, 'particles.png'))
json.dump({'width': W, 'height': H, 'layers': meta}, open(os.path.join(OUT, 'layers.json'), 'w'), indent=1)

# background for the scene: the photo with the burger painted out, then blurred
hole = cv2.dilate(fg * 255, np.ones((25, 25), np.uint8))
small_bg = cv2.inpaint(cv2.resize(rgb, (W // 4, H // 4)), cv2.resize(hole, (W // 4, H // 4)), 9, cv2.INPAINT_TELEA)
bg = cv2.GaussianBlur(cv2.resize(small_bg, (W, H)), (0, 0), 18)
Image.fromarray(bg).save(os.path.join(OUT, 'bg.jpg'), quality=90)

# preview: every layer on its own row, alternating tints, to check the cuts
prev = np.zeros((H, W, 3), np.uint8) + 30
tints = [(255, 80, 80), (80, 255, 80), (80, 80, 255), (255, 255, 80), (255, 80, 255), (80, 255, 255), (255, 160, 60), (160, 160, 255)]
for i, m in enumerate(meta):
    region = (rows >= bounds[i][None, :]) & (rows < bounds[i + 1][None, :]) & ~small & (alpha > 100)
    prev[region] = (0.55 * rgb[region] + 0.45 * np.array(tints[i])).astype(np.uint8)
prev[small & (alpha > 100)] = 255
cv2.imwrite(os.path.join(HERE, 'layers-preview.png'), cv2.cvtColor(prev, cv2.COLOR_RGB2BGR))
