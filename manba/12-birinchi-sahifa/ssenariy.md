# 12-video: Birinchi sahifa, Claude bilan — SSENARIY (tasdiq kutilmoqda)

Taklif etilgan yuklash sanasi: **14.10.2026** (11-video 13.10 dan keyingi kun; o'zgartirish mumkin). ~45 s, 1080x1920, 30 fps, OQ FON, 11-videodagi dizayn (Inter + JetBrains Mono, kartalar, mock UI).
Reja bo'yicha 6-raqam: "Birinchi HTML sahifa (Claude bilan, real demo)".
Bitta g'oya: Claude'ga aniq so'rov yozasiz -> HTML kod oladi -> faylga saqlab, brauzerda ochasiz -> sahifa tayyor.
Hook formulasi: "Kelishganimizdek, bugun siz bilan birinchi sahifani Claude bilan yasashni o'rganamiz." (foyda ro'yxati va "Oxirigacha qoling" yo'q). Kirish g'oyasi: **E (oldin -> keyin)**: chap tomonda bo'sh oq brauzer, o'ngda tayyor sahifa.

## 1. HOOK (0–8 s)
Katta yozuv: "BUGUN SIZ BILAN / **Birinchi sahifa** / Claude bilan". Ekran ikkiga bo'linadi: chap — bo'sh brauzer ("hech narsa yo'q"), o'ng — tayyor sahifa. Strelka chapdan o'ngga.
- Ovoz: "Kelishganimizdek, bugun siz bilan birinchi sahifani Klod bilan yasashni o'rganamiz. Bo'sh ekrandan tayyor sahifagacha."
## 2. SO'ROV (8–16 s)
Chat kartasi (Claude'ga yoziladigan xabar, namuna): "Menga bitta sahifa yoz: sarlavha, ikki qator matn va bitta tugma. Faqat HTML, bitta fayl." Pastda 3 chip: **nima** / **nechta qism** / **qaysi format** — "aniq so'rov = yaxshi natija".
- Ovoz: "Avval Klod'ga aniq yozamiz: nima kerak, nechta qism, qaysi format. Qanchalik aniq bo'lsa, natija shunchalik yaxshi."
## 3. KOD (16–26 s)
Kod kartasi (haqiqiy, ishlaydigan ~12 qator HTML): `<h1>`, `<p>`, `<button>`. Har qism navbat bilan yoritiladi, yonida oddiy izoh: sarlavha / matn / tugma. Ekranda "namuna kod".
- Ovoz: "Klod kod yozadi. Uch qism ko'rinadi: sarlavha, matn va tugma. Kodni o'qib chiqing, tushunmagan joyingizni so'rang."
## 4. SAQLASH VA OCHISH (26–36 s)
Fayl nomi: `index.html` saqlanadi (ikonka) -> brauzerda ochiladi -> tayyor sahifa (brauzer oynasi — kod haqiqatan shu sahifani beradi, kadr real brauzerda olinadi). Tugma bosiladi -> matn o'zgaradi.
- Ovoz: "Kodni index nuqta eych-ti-em-el nomi bilan saqlang va brauzerda oching. Sahifa tayyor. Tugmani bosib ko'ring."
## 5. O'ZGARTIRISH (36–40 s)
Ikkinchi so'rov: "Tugmani yashil qil." -> tugma yashilga o'zgaradi (oldin/keyin).
- Ovoz: "Yoqmasa, yana so'rang: tugmani yashil qil."
## 6. XULOSA + CTA (40–48 s)
"Aniq so'rov + kodni o'qish + saqlash = birinchi sahifa". Banner: "Keyingi video: CSS, telefonga moslashuvchan sahifa".
- Ovoz: "Xulosa: aniq so'rov yozing, kodni o'qing, faylga saqlang. Saqlab qo'ying. Keyingi videoda: sahifa telefonda ham chiroyli ko'rinishi uchun nima qilamiz?"

## Halollik
- Klod javobi **tezlashtirilgan** deb belgilanadi (haqiqiy javob bir necha soniya oladi). Kod va brauzer natijasi haqiqiy: kod real brauzerda render qilinadi, qo'lda chizilmaydi.
- Sahifadagi ism/matn namuna (Ali, "namuna" yozuvi). Klod logotipi ishlatilmaydi.
- "Klod har safar aynan shunday kod beradi" deb va'da qilinmaydi: har safar javob biroz farq qilishi mumkin (ekranda/ovozda aytish kerakmi — sizdan so'raymiz).
- HTML nima ekani 2-videoda tushuntirilgan; bu yerda qayta tushuntirilmaydi.

## Talaffuz (sinov kerak)
- "HTML": ovozga "eych-ti-em-el" deb yoziladi (variantlar: "eych ti em el" / "ash ti em el"). Qaysi biri to'g'ri eshitilishini sinab ko'ramiz.
- "index.html" — "indeks eych-ti-em-el". `Claude` -> `Klod` (tasdiqlangan).

## Sizdan kerak
1. Ssenariy mosmi? Sahifa mavzusi namuna "Ali, veb dasturchi" bo'lib qolsinmi, boshqa mavzu (masalan, shaxsiy vizitka, non do'koni) xohlaysizmi?
2. "Javob har safar biroz farq qiladi" degan gapni videoga qo'shamizmi?
3. Teaser "CSS, telefonga moslashuvchan sahifa" mosmi?
Tasdiqlansa: talaffuz klipi + kadr namunalari ko'rsataman, so'ng to'liq render.
