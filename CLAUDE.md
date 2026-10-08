# Zarafshon dasturchilari — loyiha qoidalari

## Loyiha
- Maqsad: o'zbek tilida boshlang'ich dasturchilar uchun video qo'llanmalar ("0 dan internetga": frontend, backend, Docker, server, domen) va shu bilan bog'liq sayt/loyihalar.
- Video rejasi: `video-reja.md`. Yangi video yasashdan oldin shu fayldagi qoidalarni o'qi.

## Til va ohang
- Asosiy til: o'zbek (lotin). Oddiy so'zlar, qisqa gaplar. Jargonni birinchi marta aytganda darhol oddiy so'z bilan izohla.
- Foydalanuvchiga javob: o'zbek tilida, qisqa va aniq.
- Ekrandagi matnda `o‘` va `g‘` uchun `‘` (U+2018) ishlat.
- **Ovozga (TTS) beriladigan matnda** `o'` va `g'` ni `oʻ` va `gʻ` (U+02BB) ga almashtir. Oddiy `'` bilan ovoz "o"/"g" deb o'qiydi (sinab tasdiqlangan). Qo'shimchalardagi apostrof (`Claude'ga`) o'zgarmaydi. **Ovoz imlosi (foydalanuvchi eshitib tasdiqlagan):** ovozga `commit` -> `kommit`, `GitHub` -> `Git xab`, `push` -> `pash`, `clone` -> `klon`, `token` -> `tokin`, `Claude` -> `Klod`, `viewport` -> `viuport`, `width` -> `vidt`, `max-width` -> `maks vidt`, `index.html` -> `indeks nuqta, eych, ti, em, el`, `HTML` -> `eych, ti, em, el` yoz (ekranda asl yozuv). Aks holda TTS "tommit" va "kuchuk" kabi o'qiydi. Yangi inglizcha so'z qo'shsang, avval bir necha imlo variantini yasab foydalanuvchiga eshittir.

## Video qoidalari
- Format: 1080x1920, 30 fps, h264 + aac, ovoz -16 LUFS (`loudnorm`).
- TTS pauzalari: ovoz nuqta/vergul/ikki nuqtadan keyin ~0.85 s jim qoladi ("ovoz uzilgan"). Har ovozga `silenceremove=start_periods=1:start_threshold=-42dB:start_silence=0.02:stop_periods=-1:stop_duration=0.30:stop_threshold=-42dB:stop_silence=0.18` qo'lla. Sahna davomiyligi = ovoz + ~0.12 s (ortiqcha jim dum qoldirma). Tayyor ovozdan `silencedetect` yoki RMS bilan 0.5 s dan uzun jimlikni tekshir.
- Hook: 0-kadrda tayyor sarlavha, ovoz 0.0 dan, sekin kirish yo'q. 3 soniyada qiziqtir.
- Mahalliy kirish: videoni Yer → O'zbekiston → Zarafshon uchishi bilan boshla (`manba/intro-zarafshon-globus/`). Tomoshabin o'z joyini ko'rsin.
- **Hook formulasi (9-videodan):** "Bugun siz bilan X ni o'rganamiz" (X ni aniq ayt va katta yoz). "Boshlang'ich dasturchilar uchun" yozuvi/ovozi YO'Q: u "men boshlang'ich emasman" degan to'siq beradi, auditoriya kengroq bo'lsin. Variantlar: "kelishganimizdek, bugun X ni o'rganamiz", "X ni o'rganishga navbat keldi". Tomoshabin 3 soniyada "nima o'rganaman" savoliga javob topsin. Hook'da "✔ ... bilasiz" foydalar ro'yxati va "Oxirigacha qoling" bo'lmasin (10-videodan): mavzu aytilgach darrov mazmunga o't.
- Ostyozuv har doim bo'lsin. Instagram interfeysi yopadigan joy: pastki ~20% (y > 1540) va o'ng chet. Muhim narsani shu yerga qo'yma.
- Musiqa qo'shma (mualliflik huquqi). Foydalanuvchi Instagram kutubxonasidan qo'shadi.
- Har video: bitta g'oya, oxirida "saqlash + yuborish + keyingi videoga ochiq savol".
- Jarayon: avval ssenariy -> foydalanuvchi tasdiqlaydi -> kadr namunalarini ko'rsat -> to'liq render. Tasdiqsiz uzoq render qilma.
- Tayyor videoni `SendUserFile` bilan yubor. **Izohni (Instagram caption) har safar matnli javobda ``` kod blokida ber** (nusxa olish uchun), faqat fayl captionida qoldirma. Yuklash sanasini ham yoz.

## Aniqlik va halollik
- Narx, versiya, qonun/qoidaga oid faktni tekshirilmagan holda "aniq" deb yozma. "O'zgarishi mumkin" de yoki tekshirishni so'ra.
- Namuna ma'lumotni namuna deb belgila: soxta token, soxta IP (`203.0.113.x`), fiktiv brend ("Sakura Sushi").
- Tezlashtirilgan jarayonni "tezlashtirilgan" deb belgila.
- Haqiqiy mijoz/brend nomini ruxsatsiz ishlatma.
- Natija kafolatini va'da qilma. Eshita olmagan/ko'ra olmagan narsangni "tekshirildi" dema.

## Xavfsizlik
- Token, parol, API kalit **hech qachon** frontend kodiga (`index.html`, brauzerga boradigan JS) yozilmaydi va gitga commit qilinmaydi. Ular backendda `.env` da turadi; `.env` `.gitignore` da.
- Sirni javobda/logda **to'liq ko'rsatma**; kerak bo'lsa maskalab yoz.
- Agar kodda ochiq sir topilsa: darhol foydalanuvchiga ayt, tokenni yangilashni (revoke) tavsiya qil. O'zing bahsiz tuzatma.

## Git
- Ishlash branchi: sessiya aytgan branch. Boshqasiga push qilma.
- Commit xabari: qisqa, nima o'zgargani aniq (o'zbek yoki ingliz, bir xil uslubda).
- Katta fayllar (mp4 > 5 MB) repozitoriyga to'g'ridan-to'g'ri qo'shilmasin: Git LFS yoki alohida joy. (Hozir tarixda ~117 MB video bor.)
- Vaqtinchalik fayl (node_modules, render kadrlar, .whl, .log) commit qilinmaydi.
- Pull request faqat foydalanuvchi so'raganda.

## Muhit ayrimliklari (bulut konteyner, har sessiyada qayta o'rnatiladi)
Quyidagilar sinab tasdiqlangan; muhit o'zgarsa qayta tekshir.
- `ffmpeg` yo'q: `pip install imageio-ffmpeg`, binarni `/tmp/ffmpeg` ga nusxala.
- TTS: `pip install edge-tts`. Ishlatishdan oldin `certifi.where = lambda: '/root/.ccr/ca-bundle.crt'` (aks holda SSL xato). Ovoz: `uz-UZ-SardorNeural`. Kirill yozuvi ishlamaydi, faqat lotin.
- Brauzer: Chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (`playwright install` qilma). Python: `pip install playwright`, `launch(executable_path=..., args=['--no-sandbox'])`.
- WebGL: `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader --ignore-gpu-blocklist` (dasturiy, ~0.7 s/kadr). `three` npm orqali (`npm i three@0.160.0`); CDN (cdnjs, jsdelivr) bloklangan. Modul import uchun `python3 -m http.server` (localhost ishlaydi).
- Shriftlar: Liberation Sans/Mono (kirill, `‘`), Noto Color Emoji. Boshqa shrift yuklab bo'lmaydi.
- Tarmoq: PyPI, npm va **raw.githubusercontent.com** ochiq (GitHub'dagi tekstura va ma'lumot fayllarini olish mumkin); Hugging Face, CDN (cdnjs/unpkg/jsdelivr), OSM/xarita tayllari, Google yopiq.
- Xarita ma'lumoti: Natural Earth (`nvkelso/natural-earth-vector`, GitHub raw). Yer shari kirishi: `manba/intro-zarafshon-globus/` (WebGL, ≈7 daqiqa/7 s).
- Blender: `pip install bpy` (≈20 s) ishlaydi; Cycles CPU: 1080x1920, 48 namuna ≈ 30 s/kadr (4 yadro). EEVEE ishlamaydi (libEGL yo'q). Sinov: `manba/blender-sinov/`.
- Pillow bilan chizishda `oʻ` ni emas, `‘` ni ishlat (shriftda bor).

## Bu yerda qilinmaydi
- Foydalanuvchining roziligisiz mavjud `index.html` (jonli sayt kodi) ni o'zgartirma.
- Hisob parolini, tokenni so'rama va qabul qilma.
