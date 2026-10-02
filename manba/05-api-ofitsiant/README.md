# 5-video: API = ofitsiant (Blender kirishi)
Ssenariy: `ssenariy.md`.
1. `python3 tts12.py` -> ovoz + `timing.json`
2. `python3 zal.py 0 173 0.6 12 frames 15` (Blender Cycles, ~35 daqiqa)
3. `ffmpeg -framerate 15 -i frames/f_%04d.jpg -vf "scale=1080:1920:flags=lanczos,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1" -q:v 2 -start_number 1 bg/b_%04d.jpg`
4. `python3 -m http.server 8812` (shu papkada, `bg/` bilan), `python3 render12.py out.mp4`, so'ng `loudnorm`.
mp4 va kadrlar repoga qo'shilmaydi.

## v2: 3D odam ofitsiant
`zal2.py`: Mixamo "Xbot" manekeni (three.js namunalaridan, `raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/Xbot.glb`) `models/Xbot.glb` ga yuklanadi. Yurish animatsiyasi, oq ko'ylak/qora shim (Generated-Z rang zonalari), qo'lida buyurtma qog'ozi. Qolgani v1 bilan bir xil (`render12.py`). Model fayli repoga qo'shilmagan.
