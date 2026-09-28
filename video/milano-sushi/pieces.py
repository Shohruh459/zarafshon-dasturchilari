"""
Splits the three roll cut-outs of ../milano/assets (each shows a roll's cut face
and its side) into single pieces: the two touch, so the split is the column with
the least alpha in the middle third. Writes assets/roll-<n>-face.png and
assets/roll-<n>-side.png, cropped to content.

Usage:  python3 video/milano-sushi/pieces.py   (after video/milano/prep.py)
"""
import os

import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'milano', 'assets')
OUT = os.path.join(HERE, 'assets')
os.makedirs(OUT, exist_ok=True)

for n in (1, 2, 3):
    im = Image.open(os.path.join(SRC, f'roll-{n}.png'))
    a = np.array(im.getchannel('A')).astype(np.float32)
    w = a.shape[1]
    col = a.sum(axis=0)
    x = int(w * 0.33 + np.argmin(col[int(w * 0.33):int(w * 0.67)]))
    for name, box in (('face', (0, 0, x, im.height)), ('side', (x, 0, w, im.height))):
        part = im.crop(box)
        part.crop(part.getbbox()).save(os.path.join(OUT, f'roll-{n}-{name}.png'))
        print(n, name, part.getbbox())
