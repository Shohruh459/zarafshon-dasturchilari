# 9-video: "Menda ishlayapti!" (Docker, metaforasiz) — Blender noutbuk + CSS
- `laptop.py`: Blender (bpy, Cycles) noutbuk, shaffof PNG (`laptopA.png`, `laptopB.png` = aks ettirilgan) va ekran burchaklari (`lap.json`).
- Ekran mazmuni CSS bilan, perspektiv `matrix3d` (homografiya) orqali noutbuk ekraniga joylanadi (`video21.html`).
1. `python3 laptop.py 160` (bir marta, ~2 daqiqa)  2. `python3 tts21.py`
3. shu papkada `python3 -m http.server 8821`, `python3 render21.py out21.mp4`, so'ng `loudnorm`.
mp4 repoga qo'shilmaydi. Yuklash: 11.10.2026.
