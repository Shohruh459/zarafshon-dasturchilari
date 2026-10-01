# Kirish: Yer sharidan Zarafshongacha (WebGL, three.js)

7 soniyalik kinematografik kirish: Yer → O'zbekiston (oltin kontur) → Navoiy viloyati → Zarafshon nuqtasi. Ovoz va ostyozuv 0.0 dan.

## Ma'lumot manbalari (hammasi ochiq)
- Yer teksturasi (4096x2048): `vasturiano/three-globe` → `example/img/earth-blue-marble.jpg`, `earth-night.jpg` (raw.githubusercontent.com)
- Chegaralar, viloyatlar, daryolar, shaharlar: **Natural Earth** (`nvkelso/natural-earth-vector`). `prep_geo.py` ularni `data/geo.json` ga aylantiradi.
- Zarafshon koordinatasi: Natural Earth "populated places" bo'yicha 41.582°N, 64.202°E (Navoiy viloyati). Bu shahar markazi, aniq bino emas.

## Ishga tushirish
1. `data/blue.jpg`, `data/night.jpg` ni yuqoridagi manbadan yuklang (gitga qo'shilmagan)
2. `npm i three@0.160.0` va `python3 -m http.server 8801`
3. `python3 tts_g.py` (ovoz) → `python3 render_g.py chiqish.mp4` (≈7 daqiqa, 1080x1920)

## Cheklov
Bazaviy tekstura 4K, shuning uchun oxirgi yaqinlikda xiralashadi. Buni yaltiroq vektor chiziqlar va qorong'ilashtirish yashiradi.
