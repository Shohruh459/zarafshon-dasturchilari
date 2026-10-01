# Video qo'llanmalar rejasi: "0 dan internetga" (boshlang'ich dasturchilar uchun)

> Holat: **loyiha taklifi**, birgalikda ko'rib chiqamiz. Hech narsa tasdiqlanmagan.

## 1. Maqsad va auditoriya

- **Kim uchun:** dasturlashni endi boshlayotgan, o'zbek tilida o'rganmoqchi bo'lgan odamlar.
- **Va'da:** "Sayt qanday ishlaydi" dan "internetda o'z domenimda ishlayapti" gacha, oddiy tilda, misollar bilan.
- **Seriya nomi (taklif):** *"0 dan internetga"*. Har video oldingisiga bog'lanadi, shuning uchun odamlar keyingisini kutadi.
- **Asosiy qoida:** har videoda **bitta g'oya**. Jargonni birinchi marta aytganda darhol oddiy so'z bilan izohlaymiz.

## 2. Qiziqtirish formulasi (har videoda)

| Qism | Vaqt | Nima qilamiz |
|---|---|---|
| **Hook** | 0–3 s | 0-kadrda tayyor sarlavha, ovoz 0.0 dan. **Birinchi navbatda kim uchun ekanini aytamiz va yozamiz** ("Dasturlashni endi boshlayapsizmi? Bu video aynan siz uchun!"): tomoshabin "bu menga kerakmi?" degan savolga 3 soniyada javob topadi. Keyin savol, xavf yoki "wow" natija. Sekin kirish yo'q. |
| **Va'da** | 3–6 s | "Shu videoda … o'rganasiz" (bir gap). |
| **Tana** | 6–30 s | 3–4 qisqa bo'lak. Har bo'lakda **bitta o'xshatish** va **bitta ko'rinadigan animatsiya**. |
| **Natija** | 30–35 s | Qisqa xulosa ("Endi bilasiz: …"). |
| **Chaqiriq** | oxirgi 4 s | Saqlash + do'stga yuborish + **keyingi videoga ochiq savol** ("Keyingi videoda … ochib beraman"). |

**Hook shablonlari** (almashtirib ishlatamiz; har biri oldidan "kim uchun" qatori keladi, masalan "🎯 Boshlang'ich dasturchilar uchun"):
1. **Savol:** "Siz hozir tugma bosdingiz. Ortida nima bo'ldi?"
2. **Xavf:** "Bu xato saytingizni hammaga ochib qo'yadi!"
3. **Wow-natija:** "Bu serverni Claude yozdi. 15 qator xolos."
4. **Tanish og'riq:** "'Menda ishlayapti' — hamma dasturchi shuni aytgan."
5. **Qarama-qarshilik:** "Domen sotib oldim, lekin sayt ochilmayapti. Sababi bitta narsa."

**Vizual uslublar** (videoning turiga qarab):
- **A: "Wow" demo:** gibrid WebGL 3D + CSS (render ≈ 15 daqiqa). Haftada 1 ta.
- **B: Tushuntirish:** o'xshatish animatsiyasi, CSS usuli (≈ 6 daqiqa). Haftada 1–2 ta.
- **C: Xato/Xavf:** "noto'g'ri → to'g'ri" bo'linma ekran. Haftada 1 ta.

## 3. Asosiy o'xshatish: restoran

| Termin | O'xshatish | Bir gapda |
|---|---|---|
| Frontend | Zal | Foydalanuvchi ko'radigan va bosadigan narsa |
| Backend | Oshxona | Buyurtmani qabul qilib, ishlov beradigan mantiq |
| Ma'lumotlar bazasi | Ombor | Hamma narsa saqlanadigan joy |
| API | Ofitsiant | Zal bilan oshxona o'rtasida xabar tashiydi |
| Server | Bino/uy | Dastur ishlab turadigan kompyuter |
| IP manzil | Koordinatalar | Serverning raqamli manzili |
| Domen | Nomi | Odam yodlay oladigan manzil (masalan, `misol.uz`) |
| DNS | Telefon kitobi | Nomni IP raqamga aylantiradi |
| HTTPS | Muhrlangan konvert | Xabarni yo'lda hech kim o'qiy olmasligi |
| Docker | Tushlik qutisi | Dastur o'zining hamma kerakli narsasi bilan qadoqlangan |
| Git | O'yinni saqlash nuqtasi | Har bir o'zgarishni saqlaydi, orqaga qaytish mumkin |

## 4. Yo'l xaritasi (≈ 12 hafta, haftada 3 video)

**Modul 1: Asos (1-hafta)**
1. Sayt qanday ishlaydi? (restoran misolida) — *pilot 1*
2. Frontend nima: HTML, CSS, JS (skelet, kiyim, harakat) — *pilot 2*
3. Backend nima? (oshxona)
4. Ma'lumotlar bazasi nima? (ombor, Excel bilan farqi)
5. API nima? (ofitsiant) va JSON nima

**Modul 2: Frontend (2–3-hafta)**
6. Birinchi HTML sahifa (Claude bilan, real demo)
7. CSS: telefonga moslashuvchan sahifa (responsive)
8. JavaScript: tugma bosilganda nima bo'ladi?
9. Forma: foydalanuvchi ma'lumoti qayerga ketadi?
10. `fetch`: sahifa API'dan ma'lumot oladi
11. React kerakmi? (boshlovchilarga qachon kerak, qachon yo'q)

**Modul 3: Backend (4–5-hafta)**
12. Birinchi API (Node.js + Express, ~15 qator) — *pilot 7*
13. Endpoint nima? GET va POST farqi
14. Ma'lumotni saqlash: SQLite, keyin PostgreSQL
15. Login qanday ishlaydi? (parol hash qilinadi, ochiq saqlanmaydi)
16. `.env` va sirlar: token va parol qayerda turadi — *xavf videosi*
17. **Telegram bot** bilan forma (O'zbekiston auditoriyasiga juda yaqin) — *pilot 6 bilan bog'liq*

**Modul 4: Git/GitHub (6-hafta)**
18. Git nima? ("Saqlash nuqtasi")
19. `commit`, `push`, `branch`: kundalik 5 buyruq
20. Pull request va kodni birga yozish

**Modul 5: Docker (7–8-hafta)**
21. "Menda ishlayapti" muammosi va Docker — *pilot 3*
22. Dockerfile: retsept (qator-qator tushuntirish)
23. docker compose: backend va baza birga
24. Docker'da eng ko'p uchraydigan 5 xato

**Modul 6: Server (9–10-hafta)**
25. Server/VPS nima va qanday tanlanadi (narx, joylashuv, minimal talab)
26. SSH: serverga xavfsiz kirish (parol o'rniga kalit)
27. Serverga joylash: 5 qadam — *pilot 5*
28. Xavfsizlik asoslari: firewall, 22/80/443 portlar, yangilanishlar

**Modul 7: Domen va HTTPS (11-hafta)**
29. Domen va DNS: nega sayt ochilmayapti — *pilot 4*
30. HTTPS: qulf belgisi qayerdan keladi (Let's Encrypt, Caddy yoki Nginx)
31. `.uz` domen: qayerdan va nimalarga e'tibor berish *(narx va qoidalar o'zgaradi, joylashdan oldin tekshiramiz)*

**Modul 8: Yakun va Claude bilan ishlash (12-hafta)**
32. Hammasini birlashtirish: 0 dan internetga (3 qismli finale)
33. Claude Code nima va qanday ishlatiladi
34. `CLAUDE.md` nima va nega kerak
35. AI yozgan kodni tekshirish: 3 qoida — *pilot 8*
36. Xato xabarini Claude'ga to'g'ri berish (debug)

## 5. Pilot videolar (to'liq ssenariy, o'zbekcha ovoz uchun)

Har birining davomiyligi ≈ 30–38 s. Matn ovozga mos, qisqa gaplar bilan.

### Pilot 1: "Sayt qanday ishlaydi? Restoran misolida" (turi B)
- **Hook (0–3):** "Siz hozir bitta tugma bosdingiz. Ortida nima bo'ldi? Restoran misolida ko'rsataman!" *Vizual: telefon ekranidagi tugma, kamera restoran ichiga kirib ketadi.*
- **Zal (3–10):** "Frontend — bu zal. Siz ko'rasiz va bosasiz: tugma, rasm, matn." *Zal animatsiyasi, "FRONTEND" yorlig'i.*
- **Oshxona (10–16):** "Backend — oshxona. Buyurtmani qabul qiladi va tayyorlaydi."
- **Ombor (16–21):** "Ma'lumotlar bazasi — ombor. Hamma narsa shu yerda saqlanadi."
- **Ofitsiant (21–29):** "API — ofitsiant. Zal bilan oshxona o'rtasida xabar tashiydi." *Yo'l chizig'i: tugma → ofitsiant → oshxona → ombor → qaytish, yonib boradi.*
- **Natija (29–33):** "Endi siz sayt ichida nima bo'lishini bilasiz."
- **Chaqiriq (33–37):** "Saqlab qo'ying. Keyingi videoda ofitsiantni, ya'ni API'ni ochib beraman!"

### Pilot 2: "Frontend: har bir sayt 3 narsadan iborat" (B)
- **Hook:** "Har bir sayt aynan 3 narsadan iborat. Bilsangiz, o'zingiz sayt yasay olasiz!"
- **HTML = skelet:** "HTML — tuzilma. Sarlavha, matn, tugma qayerda turishini aytadi." *Faqat qora-oq chiziqli sahifa.*
- **CSS = kiyim:** "CSS — ko'rinish. Rang, shrift, joylashuv." *Bir zumda rangli, chiroyli bo'ladi.*
- **JavaScript = harakat:** "JavaScript — harakat. Tugma bosilganda nima bo'lishini belgilaydi." *Tugma bosiladi, ekran o'zgaradi.*
- **Chaqiriq:** "Saqlab qo'ying. Prompt: 'HTML, CSS va JavaScript qismlarini alohida tushuntirib yoz.'"

### Pilot 3: "Docker: 'menda ishlayapti' muammosi" (A yoki B)
- **Hook:** "'Menda ishlayapti!' — dasturchilarning eng mashhur gapi. Docker shuni tugatadi!"
- **Muammo:** "Sizning kompyuteringizda ishlaydi, do'stingizniki xato beradi. Sabab: versiyalar farq qiladi." *Ikki kompyuter: biri yashil, biri qizil.*
- **Docker = tushlik qutisi:** "Docker dasturni hamma kerakli narsasi bilan bir qutiga soladi."
- **Dockerfile = retsept:** "Dockerfile — shu qutining retsepti." *Ekranda 5 qator, har biri yonib tushuntiriladi:*
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  CMD ["node", "server.js"]
  ```
- **Image va container:** "Image — tayyor paket. Container — uning ishlab turgan nusxasi."
- **Chaqiriq:** "Prompt: 'Shu loyiha uchun Dockerfile yoz va har qatorini tushuntir.' Saqlab qo'ying!"
- *Aniqlik:* "faqat shu bitta Dockerfile hamma loyiha uchun mos" demaymiz; Node loyiha misoli ekanini aytamiz.

### Pilot 4: "Domen va DNS: sayt nega ochilmayapti?" (B)
- **Hook:** "Sayt tayyor, domen ham bor, lekin ochilmayapti. Sabab bitta narsa: manzil ulanmagan!"
- **Server = uy:** "Server — uy. Uning raqamli manzili bor: IP."
- **Domen = nom:** "Domen — shu manzilga odam yodlay oladigan nom."
- **DNS = telefon kitobi:** "DNS — telefon kitobi: nomni IP raqamga aylantiradi."
- **A yozuv:** "Siz DNS'ga aytasiz: `misol.uz` → `203.0.113.10`." *(Hujjatlar uchun ajratilgan namuna IP, haqiqiy emas.)*
- **Kuting:** "O'zgarish tarqalishi uchun bir necha daqiqadan bir necha soatgacha vaqt ketishi mumkin."
- **Chaqiriq:** "Keyingi videoda saytga HTTPS qulfini qo'yamiz."

### Pilot 5: "Serverga joylash: 5 qadam" (A)
- **Hook:** "Saytingiz faqat sizning kompyuteringizda. 5 qadamda butun dunyoga ochamiz!"
- **Qadamlar:** 1) VPS oling (Ubuntu). 2) SSH bilan kiring. 3) Docker o'rnating. 4) `git clone` bilan kodni oling. 5) `docker compose up -d`.
- **Xavfsizlik (qisqa):** "Parol o'rniga SSH kalit ishlating. Firewall'da faqat 22, 80, 443 portlarni oching."
- **Aniqlik:** buyruqlar provayderga qarab biroz farq qilishi mumkin, shuni videoda aytamiz.
- **Chaqiriq:** "Prompt: 'Ubuntu serverda docker compose bilan loyihani joylash bo'yicha qadamma-qadam yo'riqnoma yoz.'"

### Pilot 6: "Telegram token saytda ochiq bo'lsa, nima bo'ladi?" (C, xavf)
- **Hook:** "Agar saytingiz kodida bot tokeni yozilgan bo'lsa, uni hamma ko'ra oladi!"
- **Ko'rsatish:** brauzerda "Sahifa manbasini ko'rish" (soxta token bilan demo!). *Hech qachon haqiqiy token ko'rsatmaymiz.*
- **Xavf:** "Birov shu token bilan botingiz nomidan xabar yuborishi mumkin."
- **To'g'ri yo'l:** "Token backendda `.env` faylda turadi. Sayt backendga so'rov yuboradi, backend Telegram'ga yuboradi."
- **Agar oshkor bo'lsa:** "Telegram'da @BotFather orqali tokenni darhol yangilang."
- **Chaqiriq:** "Keyingi videoda shu xavfsiz variantni 20 qatorda yasaymiz!"

### Pilot 7: "Birinchi API — Claude yozdi, 15 qator" (A)
- **Hook:** "Bu serverni Claude yozdi — va u ishlayapti. Atigi 15 qator!"
- **Demo (haqiqiy, tezlashtirilgan belgisi bilan):** kod yoziladi, `node server.js`, brauzerda `localhost:3000/salom` ochiladi.
  ```js
  import express from 'express';
  const app = express();
  app.get('/salom', (req, res) => res.json({ xabar: 'Salom, dunyo!' }));
  app.listen(3000);
  ```
  *(`package.json` da `"type": "module"` bo'lishi kerak; videoda ko'rsatamiz.)*
- **Chaqiriq:** "Prompt: 'Express bilan oddiy API yoz va har qatorini tushuntir.'"

### Pilot 8: "AI yozgan kodga ko'r-ko'rona ishonmang" (C)
- **Hook:** "Claude yozgan kodni tekshirmasdan ishlatsangiz, bu xato sizga qimmatga tushadi!"
- **3 qoida:** 1) **Ishga tushiring va sinang**, faqat o'qib ishonmang. 2) **Sirlar** (token, parol) kodga yozilmasin. 3) **So'rang:** "Bu kodda xavfsizlik muammosi bormi?" va javobni o'qing.
- **Chaqiriq:** "Saqlab qo'ying: bu uch qoida sizni ko'p muammodan saqlaydi."

## 6. Ishlab chiqarish jarayoni (bizda tayyor)

1. **Ssenariy** (birgalikda tasdiqlaymiz) → 2. **Ovoz** (o'zbekcha neyron ovoz, `oʻ`/`gʻ` uchun maxsus belgi) → 3. **Vizual** (CSS yoki gibrid WebGL) → 4. **Kadrlarni ko'rib tekshirish** (to'liq renderdan oldin) → 5. **Render + ovoz tenglash** → 6. **Izoh va hashtag** → 7. Siz joylaysiz.
- Bitta suhbatda 2–3 videoni partiya qilib yasash samaraliroq (muhit bir marta sozlanadi).
- **Texnik cheklov:** AI-video (Higgsfield) hozir kredit yo'qligi sababli ishlatilmaydi. Hamma narsa kod bilan chiziladi.

## 7. O'lchash (har video joylangandan keyin)

Instagram statistikasidan 4 raqamni yozib boramiz:
1. **3 soniyadan keyin qolganlar** (hook sifati)
2. **Oxirigacha ko'rganlar** (qiziqarliligi)
3. **Saqlashlar** (foydaliligi, eng muhim)
4. **Yuborishlar** (tarqalishi)

Qoida: bir vaqtda **bitta narsani** o'zgartiramiz (masalan, faqat hook), shunda nima ishlaganini bilamiz. Aniq "yaxshi" raqamlarni o'zimiz qo'ymaymiz; avval 5–6 video bo'yicha o'z bazaviy ko'rsatkichimizni topamiz.

## 8. Aniqlik va halollik qoidalari

- Narx, versiya, qonun-qoidaga oid gap (masalan, `.uz` domen shartlari, VPS narxi) videoga **joylashdan oldin tekshiriladi** va "o'zgarishi mumkin" deb aytiladi.
- Namuna narsa **namuna** deb belgilanadi (soxta token, soxta IP `203.0.113.x`, fiktiv brend "Sakura Sushi").
- Tezlashtirilgan jarayon **"tezlashtirilgan"** deb yoziladi.
- Haqiqiy mijoz nomi yoki brendi ruxsatsiz ishlatilmaydi.
- Natija kafolatlanmaydi ("hamma ko'radi", "pul topasiz" kabi va'dalar yo'q).

## 9. Xavflar va savollar

| Xavf | Chorasi |
|---|---|
| Juda ko'p mavzu, boshlovchi adashadi | Har video bitta g'oya, tartib raqami bilan |
| Texnik xato (eskirgan buyruq) | Har buyruqni nashrdan oldin sinab ko'ramiz |
| Render vaqti uzun (gibrid ≈ 15 daqiqa) | Gibridni faqat "wow" videolarda ishlatamiz |
| Ovozda talaffuz xatosi | Siz eshitib tasdiqlaysiz, so'z yozilishini o'zgartiramiz |

**Birgalikda hal qilamiz:**
1. Backend uchun **Node.js (JavaScript)** bilan boshlaymizmi (frontend bilan bir til) yoki Python?
2. Haftada nechta video realistik (3 yoki 2)?
3. Seriya nomi "0 dan internetga" yarashadimi?
4. Kanal/akkaunt nomini videoga qo'shamizmi?


## 10. Ko'rinish strategiyasi va texnologiya tanlovi (yangi)

**Kuzatuv:** Yer shari → O'zbekiston → Zarafshon xaritasi bilan boshlangan video ko'proq ko'rilgan. Sabab: tomoshabin birinchi soniyada **o'z joyini** ko'radi ("bu bizning shahar haqida"). Shuning uchun har videoning boshiga **mahalliy kirish** qo'yamiz va ma'lumotni shu odamlarga yetkazamiz.

**Har video tuzilishi:**
1. **Kirish (≈7 s):** Yer → O'zbekiston → Zarafshon + "Zarafshonlik dasturchimisiz? Yoki endi boshlayapsizmi? Bu video aynan siz uchun!" (ovoz va ostyozuv 0.0 dan)
2. **Asosiy qism (25–35 s):** bitta g'oya, har 3–4 soniyada ko'rinish o'zgarishi
3. **Oxiri (4–5 s):** saqlash, yuborish, keyingi videoga ochiq savol

**Texnologiyalar (qaysi vazifaga qaysi vosita):**

| Vazifa | Vosita | Qachon ishlatamiz | Render |
|---|---|---|---|
| Mahalliy kirish (Yer → Zarafshon) | WebGL (three.js) + haqiqiy ma'lumot (Natural Earth, NASA teksturasi) | Har video boshida | ≈7 daqiqa / 7 s |
| Tushuntirish (o'xshatish, diagramma) | HTML/CSS + Canvas | Ko'pchilik videolar | ≈5 daqiqa |
| "Wow" demo (3D telefon, konfetti) | Gibrid WebGL + CSS | Haftada 1 ta | ≈15 daqiqa |
| Haqiqiy ishlayotganini ko'rsatish (kod, server) | Haqiqiy brauzer/terminal ni yozib olish (Playwright) | Docker, server, domen videolari | ≈5 daqiqa |
| Ovoz | Neyron o'zbek ovozi (Sardor), pauzalar qisqartirilgan | Hamma joyda | 1 daqiqa |
| AI-video (Higgsfield) | Kredit kerak | Hozir ishlatilmaydi | – |

**Qoidalar:**
- Murakkab effekt faqat **ma'noga xizmat qilsa** ishlatiladi (globus = "bu sizga"; konfetti = "ishladi").
- Xarita ma'lumotini manbasi bilan yozamiz; Zarafshon nuqtasi shahar markazi, aniq bino emas.
- Mahalliy kirish matni auditoriyaga moslanadi: Zarafshon uchun "Zarafshonlik", umumiy uchun "O'zbekistonlik".


## 11. Kirish g'oyalari kutubxonasi (har video o'ziga xos boshlansin)

**Qoida:** kirish (0–5 s) uchta ishni qiladi: (1) **kim uchun** ekanini aytadi, (2) mavzuning **ko'rinadigan "obrazi"** ni ko'rsatadi, (3) **harakat** bilan ushlab turadi. Globus bu qoidaning faqat bitta ko'rinishi edi.

| # | G'oya | Qanday boshlanadi (0–3 s) | Qaysi mavzularga mos | Narx |
|---|---|---|---|---|
| A | **Ichiga kirish (zoom-through)** | Telefondagi "BOS!" tugmasidan kamera ichkariga tushadi, kod/tarmoq/oshxonaga aylanadi | Backend, API, baza | yuqori (WebGL) |
| B | **Xato ekrani** | Qizil `404`, `ERR_CONNECTION_REFUSED`, "Site can't be reached": "Siz ham shuni ko'rdingizmi?" | Domen, DNS, Docker, server xatolari | past |
| C | **Chat/Telegram xabari** | Boshlovchining savoli: "Ustoz, saytim ochilmayapti…" → javob beramiz (fiktiv ism) | Kundalik muammolar, FAQ | past |
| D | **Hisoblagich/chaqiriq** | Katta taymer: "Serverga joylash: 5 qadam, 60 soniya" (haqiqiy vaqt yoki "tezlashtirilgan" belgisi bilan) | Server, Docker, domen | o'rta |
| E | **Oldin → keyin** | Ekran ikkiga bo'linadi: chap bo'sh sahifa, o'ng tayyor sayt | Frontend, "o'zingiz yasang" | past |
| F | **Ma'lumot yo'li** | Yuborilgan paket Yerdan serverga chiziq bo'ylab uchadi | DNS, domen, server, API | yuqori (globus qayta ishlatiladi) |
| G | **Xavf signali** | Qizil "OCHIQ!" ogohlantirishi: token, parol, port | Xavfsizlik videolari | past |
| H | **Terminal** | Haqiqiy buyruq yoziladi, ENTER, natija chiqadi | Docker, Git, server | past |
| I | **Restoran olami (seriya "dunyosi")** | Kamera restoranning kerakli xonasiga kiradi: zal, oshxona, ombor, ofitsiant | Hamma asos mavzular | o'rta |
| J | **Keyingi videoga ko'prik** | Oldingi videoning oxirgi savoli keyingisining birinchi kadri bo'ladi | Hamma | past |

**Maslahat:** qimmat kirish (A, F) faqat 3 videodan 1 tasiga; qolganlariga arzon (B, C, E, G, H). Shunda sifat ham, tezlik ham saqlanadi. **I** (restoran olami) seriyaga **tanish ko'rinish** beradi, tomoshabin "bu o'sha seriya" deb taniydi.

### Navbatdagi videolar uchun taklif

| Video | Kirish g'oyasi | Birinchi 3 soniya (ovoz va yozuv) |
|---|---|---|
| 3. Backend nima? | **J + A + I**: 2-videoning savoli ("ma'lumot qayerga ketadi?") javobi; "BOS!" → paket yo'lga chiqadi → oshxonaga kiradi | "Tugma bosdingiz. Ma'lumot qayerga ketdi? 🎯 Boshlovchilar uchun" |
| 4. Baza nima? | **I**: kamera ombor eshigini ochadi, javonlar | "Sayt ma'lumotni qayerda saqlaydi?" |
| 5. API nima? | **C**: chat: "API nima, tushunmadim" | "‘API’ so'zini eshitib, tushunmadingizmi?" |
| 21. Docker | **B**: "Menda ishlayapti!" + qizil xato | "‘Menda ishlayapti’ — shu gapni eshitganmisiz?" |
| 27. Serverga joylash | **D**: taymer 60 s | "5 qadamda saytni internetga chiqaramiz" |
| 29. Domen/DNS | **B + F**: "Sayt ochilmayapti" → paket yo'li | "Sayt tayyor, lekin ochilmayapti. Sabab?" |
| Xavf (token) | **G**: qizil "OCHIQ" | "Bu xato botingizni hammaga ochib qo'yadi!" |
