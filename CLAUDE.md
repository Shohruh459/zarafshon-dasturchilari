# Zarafshon Dasturchilari — video ishlab chiqarish

Instagram Reels videolari (1080x1920, 30 fps) koddan yasaladi. Foydalanuvchi bilan
**o'zbek tilida** gaplashiladi.

## Umumiy qoidalar

- Ish `claude/nodejs-ffmpeg-video-script-rm6osj` shoxida olib boriladi. Kod render boshlanishidan oldin commit qilinadi, mp4 esa faqat render tugab, tekshirilgandan keyin.
- Chatga yuboriladigan fayl 30 MB dan oshmasligi kerak. Katta videoni scratchpad'ga `ffmpeg -crf 23 -c:a copy` bilan siqib yuboring. Repoda to'liq sifatli nusxa qoladi.
- Yakuniy renderdan oldin doim tekshiring: kadrlar (`--stills`), har soniyadagi ovoz balandligi (`volumedetect`) va umumiy balandlik (`ebur128`, taxminan −15 LUFS).
- Uzoq renderlar (~10–12 daqiqa) fonda ishga tushiriladi.
- Reels xavfsiz maydoni: x 120–960, y 220–1500.
- Brend qatori: `ZARAFSHON DASTURCHILARI`. Emoji ishlatilmaydi.
- Haqiqiy joy yoki mehmonxona reklamasida soxta obyekt yoki odam qo'shilmaydi, arxitektura o'zgartirilmaydi.

## Umumiy kod (`video/lib/`)

- `render.js`: `renderScene({page, duration, out, audio, background})` va `renderStills(...)`. Sahifa `video/` ildizidan lokal HTTP orqali ochiladi, Playwright Chromium (swiftshader WebGL) kadrma-kadr PNG oladi va FFmpeg'ga uzatadi. `background` berilsa, sahifa shaffof olinadi va o'sha video ustiga qo'yiladi.
- `synth.js`: oflayn sintezator (shovqin, filtr, reverb, WAV). Sahifa `window.renderFrame(t)` va `window.sceneReady` ni taqdim etishi kerak.

## "Qur'on va ilm" seriyasi (`video/quran/`)

**Qat'iy talablar:**
- **Ilmiy faktlar aniq va halol bo'lsin.** "Isbot" deb oshirib yuborilmaydi, kerak bo'lsa "nozik muvofiqlik" deyiladi.
- **Ma'nolar Tafsiri Hilol bo'yicha beriladi.** Xotiradan yozilgan ma'no albatta foydalanuvchiga tekshirish uchun belgilanadi (kodda "CHECK AGAINST THE BOOK" izohi bilan).
- **Fon ovozi faqat tabiiy tovushlardan:** shovqin, shamol, suv, asalari va hokazo. **Musiqa asbobi ham, kuy ham ishlatilmaydi.**
- **Arabcha oyatlar sun'iy ovozda o'qitilmaydi.** Sun'iy ovoz faqat o'zbekcha ma'no va izohlar uchun.

**Oyat matni:**
- Manba: `build_ayat.py` → `ayat.json`. Matn `quran-json@3.1.2` paketidan olinadi (CC BY-SA 4.0, King Fahd Uthmani). KFGQPC belgilari Unicode'ga o'giriladi.
- Yangi oyat yoki fragment `AYAT` ro'yxatiga qo'shiladi, keyin skript qayta ishga tushiriladi.
- Shrift: Amiri Quran.
- Oxiridagi final ي mushafdagidek nuqtasiz ko'rinishi mumkin, bu to'g'ri.

**Umumiy animatsiya:** `common/anim.js` (`textAnimator`, `loadAyat` va boshqalar).

**Qism tuzilishi** (`video/quran/0N-nom/`):
- `scene.html`: matn yoki grafik sahifasi, ichida `T` vaqt jadvali.
- `audio.js`: `generateAudio(file)` va `DURATION` ni eksport qiladi.
- `render.js`: `--stills 1,5,9` bilan sinov kadrlari chiqaradi.
- 1–3-qismlar: fon three.js shader'da chizilgan.
- 4-qism (Asalari): stok videolar ishlatilgan. `plate.js` kliplarni 9:16 formatga kesadi. 480p kliplar markazda 16:9 "karta" sifatida, orqasida xiralashtirilgan nusxasi bilan qo'yiladi.
- Kuzatib bo'lmaydigan tabiat kadrlari uchun foydalanuvchi stok klip yuklaydi (Pexels yoki Pixabay).

**Ovozli izoh (voice-over):**
- Microsoft Edge TTS (`pip install edge-tts`). Namuna: `04-asalari/voice.py`.
- **Tanlangan ovoz: `uz-UZ-MadinaNeural`**, tezlik −4%.
- **Talaffuz qoidasi:** matnda oʻ/gʻ harflari **U+02BB (ʻ)** bilan yoziladi, tutuq belgisi **U+02BC (ʼ)** bilan. Oddiy `'` qo'yilsa, "yig'adigan" so'zi "yigadigan" deb o'qiladi.
- Proksi orqasida ishga tushirish: `SSL_CERT_FILE=/root/.ccr/ca-bundle.crt python3 voice.py ...`
- MP3 fayllar repoga commit qilinadi.
- Vaqt jadvali ovozga moslanadi: har bir gap o'z kadri boshlanishidan 0,3 soniya keyin boshlanadi va keyingi kesimgacha tugashi kerak.
- Gap paytida tabiiy tovushlar `sidechaincompress` bilan pasaytiriladi.

**Qismlar:**
1. Kengayish — Zoriyot 47 va Isro 85 (fragment)
2. Zulmatlar — Nur 40
3. Barzax — Rahmon 19–20 va Furqon 53
4. Asalari — Nahl 68–69; Madina va Sardor versiyalari bor

**Foydalanuvchi hali tekshirishi kerak:** 1–4-qismlardagi Tafsiri Hilol ma'nolari va arabcha matn (mushaf bilan solishtirish).
