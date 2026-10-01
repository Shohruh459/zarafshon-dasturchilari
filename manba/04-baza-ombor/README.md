# 4-video: Ma'lumotlar bazasi = ombor (Blender kirishi)
1. `python3 tts11.py` -> ovoz + `timing.json`
2. `python3 ombor.py 0 132 0.6 12 frames 15` (Blender Cycles, ~25 daqiqa) -> `frames/`
3. `ffmpeg -framerate 15 -i frames/f_%04d.jpg -vf "scale=1080:1920:flags=lanczos,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:vsbmc=1" -q:v 2 -start_number 1 bg/b_%04d.jpg`
4. `python3 -m http.server 8810` (shu papkada, `bg/` bilan), keyin `python3 render11.py out.mp4` va `loudnorm`.
mp4 va kadrlar repoga qo'shilmaydi.
