# `CLAUDE.md` taklifi (ko'rib chiqish uchun)

> Bu **taklif**. Loyiha ildizidagi `CLAUDE.md` ga hali qo'yilmagan. Birgalikda ko'rib chiqib, kerakli qismlarini qo'shamiz.

## Nega `CLAUDE.md`?
Claude har yangi suhbatda loyiha haqida hech narsa eslamaydi. `CLAUDE.md` unga **har safar avtomatik** o'qiladi. Bu videolarni bir xil sifat va uslubda ishlab chiqarish uchun eng arzon usul. Qoida: **qisqa va aniq** bo'lsin (≈ 100 qator). Uzun bo'lsa, muhim qoidalar yo'qolib ketadi.

**Nimalar yoziladi:** Claude o'zi koddan bilib ololmaydigan narsalar (qoidalar, qarorlar, muhit ayrimliklari).
**Nimalar yozilmaydi:** kodning o'zida ko'rinadigan narsa, uzun nazariya, tez eskiradigan ma'lumot (narx, versiya raqami).

---

## Taklif qilinadigan `CLAUDE.md` matni

```markdown
# Zarafshon dasturchilari — loyiha qoidalari

## Loyiha
- Maqsad: o'zbek tilida boshlang'ich dasturchilar uchun video qo'llanmalar ("0 dan internetga": frontend, backend, Docker, server, domen) va shu bilan bog'liq sayt/loyihalar.
- Video rejasi: `video-reja.md`. Yangi video yasashdan oldin shu fayldagi qoidalarni o'qi.

## Til va ohang
- Asosiy til: o'zbek (lotin). Oddiy so'zlar, qisqa gaplar. Jargonni birinchi marta aytganda darhol oddiy so'z bilan izohla.
- Foydalanuvchiga javob: o'zbek tilida, qisqa va aniq.
- Ekrandagi matnda `o‘` va `g‘` uchun `‘` (U+2018) ishlat.
- **Ovozga (TTS) beriladigan matnda** `o'` va `g'` ni `oʻ` va `gʻ` (U+02BB) ga almashtir. Oddiy `'` bilan ovoz "o"/"g" deb o'qiydi (sinab tasdiqlangan). Qo'shimchalardagi apostrof (`Claude'ga`) o'zgarmaydi.

## Video qoidalari
- Format: 1080x1920, 30 fps, h264 + aac, ovoz -16 LUFS (`loudnorm`).
- Hook: 0-kadrda tayyor sarlavha, ovoz 0.0 dan, sekin kirish yo'q. 3 soniyada qiziqtir.
- Ostyozuv har doim bo'lsin. Instagram interfeysi yopadigan joy: pastki ~20% (y > 1540) va o'ng chet. Muhim narsani shu yerga qo'yma.
- Musiqa qo'shma (mualliflik huquqi). Foydalanuvchi Instagram kutubxonasidan qo'shadi.
- Har video: bitta g'oya, oxirida "saqlash + yuborish + keyingi videoga ochiq savol".
- Jarayon: avval ssenariy -> foydalanuvchi tasdiqlaydi -> kadr namunalarini ko'rsat -> to'liq render. Tasdiqsiz uzoq render qilma.
- Tayyor videoni `SendUserFile` bilan yubor va kerak bo'lsa izoh (caption) matnini ham ber.

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
- Tarmoq: PyPI va npm ochiq; Hugging Face, CDN, Google yopiq.
- Pillow bilan chizishda `oʻ` ni emas, `‘` ni ishlat (shriftda bor).

## Bu yerda qilinmaydi
- Foydalanuvchining roziligisiz mavjud `index.html` (jonli sayt kodi) ni o'zgartirma.
- Hisob parolini, tokenni so'rama va qabul qilma.
```

---

## Nega aynan shular?

| Qoida | Sabab (bu loyihada nima bo'lgan) |
|---|---|
| `ʻ` (U+02BB) TTS qoidasi | Ovoz `o'` ni "o" deb o'qigan, shuning uchun ikki video qayta ovozlandi. Qayta xato qilmaymiz. |
| Hook qoidalari | Dastlabki videolar 3 soniyada o'tkazib yuborilgan. |
| Ssenariy → tasdiq → render | Uzoq renderdan keyin tuzatish vaqtni yeydi. |
| Aniqlik qoidalari | Videolarda "tezlashtirilgan", "namuna" belgilari shu uchun qo'yilgan. |
| Muhit ayrimliklari | Har sessiyada ffmpeg, SSL, shrift, CDN muammolarini qaytadan topishga ~20–30 daqiqa ketgan. |
| Katta fayl qoidasi | `.git` hozir ~155 MB, undan ~117 MB videolar. |
| Sirlar qoidasi | **Quyidagi ogohlantirishga qarang.** |

## Qo'shimcha tavsiyalar (CLAUDE.md dan tashqari)

1. **SessionStart hook:** muhit ayrimliklarini (ffmpeg, edge-tts, playwright, three) har sessiya boshida avtomatik o'rnatadigan skript. `CLAUDE.md` da faqat qoida qoladi, o'rnatish esa hook'da bo'ladi. (`session-start-hook` mahoratidan foydalanamiz.)
2. **Kichik "skill" (mahorat):** "reels-uz" nomli, video yasash jarayonini (ovoz → render → tekshiruv → yuborish) bir buyruq bilan ishga tushiradigan. Buni `CLAUDE.md` barqaror bo'lgandan keyin qilamiz.
3. **`.gitignore`:** `node_modules/`, `*.whl`, `*.log`, `still_*.png`, `fr/` va boshqa vaqtinchalik fayllar.
4. **Videolar uchun alohida joy:** `videolar/` papkasi va Git LFS (yoki tayyor videolarni repozitoriyga emas, bulut xotiraga saqlash).

## Muhim ogohlantirish: ochiq Telegram token

`index.html` (800–801-qatorlar) ichida **Telegram bot tokeni va chat ID brauzer kodiga to'g'ridan-to'g'ri yozilgan**. Bu `Forma Telegram botga ulandi` commit'idan beri shu yerda. Oqibati:
- Sayt ochiq bo'lsa, har kim "Sahifa manbasini ko'rish" orqali tokenni olib, botingiz nomidan xabar yuborishi mumkin.
- Token git tarixida ham qoladi (fayldan o'chirsangiz ham).

**Tavsiya qilinadigan tartib** (siz tasdiqlasangiz bajaramiz):
1. **Darhol tokenni yangilash:** Telegram'da `@BotFather` → botni tanlash → token yangilash (revoke). Eski token ishlamay qoladi.
2. Sayt kodini backend orqali yuboradigan qilib o'zgartirish (token faqat serverda `.env` da). Bu ayni vaqtda yaxshi **video mavzusi** (Pilot 6).
3. Git tarixini tozalash ixtiyoriy va murakkab, tokenni yangilagandan keyin bu muhim emas.

Men sizning roziligingizsiz `index.html` ni o'zgartirmadim va tokenni hech qayerda to'liq yozmadim.
