# 7-video v2 (yaxshilangan): brauzer oynasi, telefon chat, Yer shari ustida DNS, Lucide ikonkalar
Kadr namunalari tasdiq kutmoqda (to'liq render hali qilinmagan).
Kerak: `npm i three@0.160.0` va `lucide-static` (npm), `data/` (Natural Earth geo.json, blue.jpg, night.jpg: `manba/intro-zarafshon-globus/`).
1. `python3 tts16.py`  2. shu papkada `node_modules` va `data` ni ulab `python3 -m http.server 8816`  3. `python3 render16.py out.mp4` (+ `loudnorm`).
mp4 repoga qo'shilmaydi.

## v3: DNS sahnasi = telefon kontaktlari (CSS)
`video17.html` + `render17.py` (port 8817): Yer shari o'rniga kontaktlar ro'yxati. `globe_dns.html` 8-video (HTTPS) uchun saqlangan. Kadr namunalari tasdiq kutmoqda.
