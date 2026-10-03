# 7-video v2 (yaxshilangan): brauzer oynasi, telefon chat, Yer shari ustida DNS, Lucide ikonkalar
Kadr namunalari tasdiq kutmoqda (to'liq render hali qilinmagan).
Kerak: `npm i three@0.160.0` va `lucide-static` (npm), `data/` (Natural Earth geo.json, blue.jpg, night.jpg: `manba/intro-zarafshon-globus/`).
1. `python3 tts16.py`  2. shu papkada `node_modules` va `data` ni ulab `python3 -m http.server 8816`  3. `python3 render16.py out.mp4` (+ `loudnorm`).
mp4 repoga qo'shilmaydi.

## v3: DNS sahnasi = telefon kontaktlari (CSS)
`video17.html` + `render17.py` (port 8817): Yer shari o'rniga kontaktlar ro'yxati. `globe_dns.html` 8-video (HTTPS) uchun saqlangan. Kadr namunalari tasdiq kutmoqda.

## v4: hook "Har kuni ishlatasiz, lekin e'tibor bermaysiz" (qiziqish bo'shlig'i)
`script17.py`, `tts17.py`, `video17.html`, `render17.py`: manzil satri halqa bilan belgilanadi ("Shu nima?"), keyin ikki foyda. Kadr namunalari tasdiq kutmoqda.

## Yakuniy render
`python3 render17.py out17.mp4` (port 8817, shu papkada `python3 -m http.server 8817`), keyin `loudnorm`. 39.7 s. Yuklash: 9.10.2026.
