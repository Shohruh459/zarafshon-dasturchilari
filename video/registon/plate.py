"""
Background plate for the REGISTON hotel ad: camera moves over the two real
photos, rendered at 1080x1920 / 30fps and piped into FFmpeg as plate.mp4.

Only three things ever move inside the photos, each confined to a mask:
  * exterior: the green plants sway in a light breeze (building pixels untouched)
  * bedroom:  the curtain panels drift a pixel or two, hanging from the rod
  * bedroom:  the window light breathes by a few percent
Everything else is a pure scale/translate of the original pixels, so the
architecture, furniture, colours and proportions stay exactly as photographed.

Usage:  python3 plate.py [--stills 1,5,9,13]
"""
import subprocess
import sys

import cv2
import numpy as np

W, H, FPS, DURATION = 1080, 1920, 30, 15.0
# Scene boundaries (seconds). Keep in sync with overlay.html and audio.js.
T_ROOM, T_BED, T_END = 4.0, 8.0, 12.0
FADE = 0.5  # half-length of each dissolve

ext_src = cv2.imread('src/exterior.png')   # 688x1529 portrait
room_src = cv2.imread('src/room.png')      # 688x521 landscape (photo band cropped from the supplied screenshot)


def sharpen(img, amount=0.35, sigma=1.2):
    """Mild unsharp mask to offset the softness of upscaling a small photo."""
    blur = cv2.GaussianBlur(img, (0, 0), sigma)
    return cv2.addWeighted(img, 1 + amount, blur, -amount, 0)


ext_src = sharpen(ext_src)
room_src = sharpen(room_src)

# ---------- masks ----------
# Plants: green, reasonably saturated pixels. The beige building, grey gravel and
# blue sky all fall outside this range, so the building never moves.
hsv = cv2.cvtColor(ext_src, cv2.COLOR_BGR2HSV)
plant = ((hsv[..., 0] > 28) & (hsv[..., 0] < 95) & (hsv[..., 1] > 55) & (hsv[..., 2] > 25)).astype(np.uint8)
plant = cv2.morphologyEx(plant, cv2.MORPH_CLOSE, np.ones((5, 5), np.uint8))
plant_mask = cv2.GaussianBlur(plant.astype(np.float32), (0, 0), 1.0)
# Sway grows towards the leaf tips: the yucca's base is low in the frame, the
# trees' canopies are high; a vertical ramp is a good enough stand-in.
eh, ew = ext_src.shape[:2]
yy, xx = np.mgrid[0:eh, 0:ew].astype(np.float32)
yucca_amp = np.clip((1450 - yy) / 700, 0, 1) * (yy > 760)    # foreground yucca, tips move most
tree_amp = 0.45 * (yy <= 760)                                 # background trees/bushes, gentler
plant_amp = plant_mask * (yucca_amp * 2.2 + tree_amp * 1.2)  # max displacement in source px

# Curtain panels and the sheer, drawn by hand from the photo (room.png coordinates).
rh, rw = room_src.shape[:2]
curtain = np.zeros((rh, rw), np.uint8)
cv2.fillPoly(curtain, [np.array([(416, 0), (522, 0), (522, 158), (470, 168), (416, 162)])], 1)
cv2.fillPoly(curtain, [np.array([(592, 0), (688, 0), (688, 248), (640, 248), (634, 196), (598, 186)])], 1)
sheer = np.zeros((rh, rw), np.uint8)
cv2.fillPoly(sheer, [np.array([(523, 0), (591, 0), (591, 176), (523, 170)])], 1)
ryy, rxx = np.mgrid[0:rh, 0:rw].astype(np.float32)
hang = np.clip(ryy / 200, 0, 1)  # fixed at the rod, freer towards the hem
curtain_amp = cv2.GaussianBlur(curtain.astype(np.float32), (0, 0), 1.5) * hang * 1.4 \
    + cv2.GaussianBlur(sheer.astype(np.float32), (0, 0), 1.5) * hang * 0.8
window_light = cv2.GaussianBlur(sheer.astype(np.float32), (0, 0), 18)[..., None]

# Blurred, dimmed copy of the room for the empty space above/below the photo.
room_bg = cv2.GaussianBlur(cv2.resize(room_src, (int(rw * H / rh), H)), (0, 0), 70)
room_bg = (room_bg * 0.30).astype(np.uint8)


def ease(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


def place(src, scale, cx, cy, out_w=W, out_h=H, ox=0, oy=0, interp=cv2.INTER_LANCZOS4):
    """Scale src uniformly and position source point (cx, cy) at output (ox+out_w/2, oy+out_h/2)."""
    m = np.float32([[scale, 0, ox + out_w / 2 - cx * scale], [0, scale, oy + out_h / 2 - cy * scale]])
    return cv2.warpAffine(src, m, (W, H), flags=interp, borderMode=cv2.BORDER_REFLECT)


def breezy_exterior(t):
    """The exterior photo at source resolution with only the plants swaying."""
    wind = (np.sin(2 * np.pi * (0.32 * t) + xx * 0.012 + yy * 0.006) * 0.7
            + np.sin(2 * np.pi * (0.53 * t) + xx * 0.031 - yy * 0.017) * 0.3)
    dx = plant_amp * wind
    dy = plant_amp * 0.25 * np.sin(2 * np.pi * 0.41 * t + xx * 0.02)
    return cv2.remap(ext_src, (xx - dx).astype(np.float32), (yy - dy).astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


def exterior(t, push=(0.0, 0.07), t0=0.0, t1=T_ROOM + FADE, center=(344, 760)):
    """Breeze + slow dolly-in over the exterior photo."""
    moved = breezy_exterior(t)
    base = W / ew  # fill the width; the frame then crops rows ~150-1380 (keeps the corner mark out)
    k = ease((t - t0) / (t1 - t0))
    return place(moved, base * (1 + push[0] + (push[1] - push[0]) * k), *center)


def curtained_room(t):
    """The bedroom photo at source resolution with only the curtains and window light moving."""
    sway = np.sin(2 * np.pi * 0.28 * t + ryy * 0.015) * 0.7 + np.sin(2 * np.pi * 0.47 * t + ryy * 0.03) * 0.3
    moved = cv2.remap(room_src, (rxx - curtain_amp * sway).astype(np.float32), ryy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    light = 1 + 0.035 * np.sin(2 * np.pi * t / 5.5) + 0.015 * np.sin(2 * np.pi * t / 2.3)
    return np.clip(moved * (1 + (light - 1) * window_light), 0, 255).astype(np.uint8)


def room(t):
    """Bedroom photo at full width over its own blurred copy; drift, then push toward the bed."""
    moved = curtained_room(t)

    # scene 2 (4-8s): gentle drift; scene 3 (8-12s): push toward the near bed
    drift = ease((t - (T_ROOM - FADE)) / (T_BED - T_ROOM + FADE))
    push = ease((t - T_BED) / (T_END - T_BED))
    zoom = 1.0 + 0.03 * drift + 0.12 * push
    cx = rw / 2 + (300 - rw / 2) * push   # near bed centre ~ (300, 320)
    cy = rh / 2 + (320 - rh / 2) * push

    panel_h = int(round(W * rh / rw))       # 818px tall at full width
    top = 360
    frame = place(room_bg, 1 + 0.02 * drift, room_bg.shape[1] / 2, H / 2, interp=cv2.INTER_LINEAR)
    photo = place(moved, (W / rw) * zoom, cx, cy, out_h=panel_h, oy=top)
    frame[top:top + panel_h] = photo[top:top + panel_h]
    # soft shadow under/over the photo band so it sits on the background
    for i in range(24):
        a = 0.35 * (1 - i / 24)
        frame[top - 1 - i] = (frame[top - 1 - i] * (1 - a)).astype(np.uint8)
        frame[top + panel_h + i] = (frame[top + panel_h + i] * (1 - a)).astype(np.uint8)
    return frame


def closing(t):
    """Exterior again, slowly pulling back, under a dark gradient for the contact card."""
    k = ease((t - (T_END - FADE)) / (DURATION - T_END + FADE))
    img = place(ext_src, (W / ew) * (1.10 - 0.04 * k), 344, 700).astype(np.float32)
    g = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    shade = 0.50 + 0.18 * np.abs(g - 0.5) * 2   # darker at top and bottom edges
    return (img * (1 - shade * ease((t - (T_END - FADE)) / (2 * FADE)))).astype(np.uint8)


def frame_at(t):
    if t < T_ROOM - FADE:
        return exterior(t)
    if t < T_ROOM + FADE:
        a = ease((t - (T_ROOM - FADE)) / (2 * FADE))
        return cv2.addWeighted(exterior(t), 1 - a, room(t), a, 0)
    if t < T_END - FADE:
        return room(t)
    if t < T_END + FADE:
        a = ease((t - (T_END - FADE)) / (2 * FADE))
        return cv2.addWeighted(room(t), 1 - a, closing(t), a, 0)
    return closing(t)


def main():
    if '--stills' in sys.argv:
        for s in sys.argv[sys.argv.index('--stills') + 1].split(','):
            cv2.imwrite(f'plate-{s}s.png', frame_at(float(s)))
        return
    ff = subprocess.Popen([
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error',
        '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '12', '-pix_fmt', 'yuv420p', 'plate.mp4',
    ], stdin=subprocess.PIPE)
    total = int(DURATION * FPS)
    for i in range(total):
        ff.stdin.write(frame_at(i / FPS).tobytes())
        if i % FPS == 0:
            print(f'\r  plate {100 * i // total}%', end='', flush=True)
    ff.stdin.close()
    if ff.wait() != 0:
        sys.exit('ffmpeg failed')
    print('\r  plate 100%')


if __name__ == '__main__':
    main()
