"""
Exports the moving photo layers for scene.html as JPEG sequences:
  assets/seq/ext_NNN.jpg   exterior with the plants swaying (from ../registon/plate.py)
  assets/seq/room_NNN.jpg  bedroom with the curtains/window light moving
Frames are upscaled 2x with Lanczos so the browser only ever scales them down or
slightly up. 150 frames (5s at 30fps) covers the longest time each photo is on screen.
"""
import os
import sys

import cv2

here = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.join(here, '..', 'registon'))  # plate.py loads src/ relative to its folder
sys.path.insert(0, os.getcwd())
import plate  # noqa: E402

FRAMES, FPS = 150, 30
out = os.path.join(here, 'assets', 'seq')
os.makedirs(out, exist_ok=True)
for i in range(FRAMES):
    t = i / FPS
    for name, img in (('ext', plate.breezy_exterior(t)), ('room', plate.curtained_room(t))):
        big = cv2.resize(img, (img.shape[1] * 2, img.shape[0] * 2), interpolation=cv2.INTER_LANCZOS4)
        cv2.imwrite(os.path.join(out, f'{name}_{i:03d}.jpg'), big, [cv2.IMWRITE_JPEG_QUALITY, 90])
    if i % FPS == 0:
        print(f'\r  frames {100 * i // FRAMES}%', end='', flush=True)
print('\r  frames 100%')

# Blurred, dimmed bedroom used behind the framed room shots.
bg = cv2.GaussianBlur(cv2.resize(plate.room_src, (688 * 1920 // 521, 1920)), (0, 0), 60)
cv2.imwrite(os.path.join(here, 'assets', 'room_bg.jpg'), (bg * 0.32).astype('uint8'), [cv2.IMWRITE_JPEG_QUALITY, 88])
