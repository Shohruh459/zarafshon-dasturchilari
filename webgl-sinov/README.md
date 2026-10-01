# WebGL (three.js) sinovi

- `scene.html` — three.js sahnasi (metall telefon, HDR yorug'lik, bloom, zarrachalar, uchib kelib yig'iladigan bloklar)
- `run_clip.py` — Playwright + Chromium (SwiftShader, dasturiy WebGL 2) orqali kadrma-kadr video yozadi
- Ishga tushirish: `npm i three@0.160.0`, `python3 -m http.server 8765`, so'ng `python3 run_clip.py 135`
- Tezlik: 1080×1920 da taxminan 0.7 s/kadr (video-kartasiz)
