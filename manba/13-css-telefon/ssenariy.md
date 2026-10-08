# 13-video: Sahifani telefonga moslash (CSS) — SSENARIY (tasdiq kutilmoqda)

Taklif etilgan yuklash sanasi: **15.10.2026** (12-video 14.10 dan keyingi kun; o'zgartirish mumkin). ~45 s, 1080x1920, 30 fps, OQ FON, 11–12-videodagi dizayn.
Reja bo'yicha 7-raqam: "CSS: telefonga moslashuvchan sahifa (responsive)". 12-videoning teaseri.
Bitta g'oya: sahifa telefonda yaxshi ko'rinishi uchun 3 narsa: `viewport` qatori, `max-width`, `@media`.
Hook formulasi: "Kelishganimizdek, bugun sahifani telefonga moslashni o'rganamiz." (foyda ro'yxati va "Oxirigacha qoling" yo'q). Kirish g'oyasi: **E (oldin -> keyin)** telefon maketida.
Haqiqiylik: telefon kadrlari Playwright mobil emulyatsiyasida (390x844) olinadi; "oldin" va "keyin" aynan ko'rsatilgan kod bilan chiqadi.

## 1. HOOK (0–7 s)
"BUGUN / **Telefonga moslash**": ikki telefon yonma-yon: chapda "OLDIN" (sahifa mayda, o'qib bo'lmaydi), o'ngda "KEYIN" (katta, o'qiladi).
- Ovoz: "Kelishganimizdek, bugun sahifani telefonga moslashni o'rganamiz. Oldin va keyin."
## 2. MUAMMO (7–14 s)
Kompyuter ekrani -> telefon ekraniga kichrayadi, sahifa mayda bo'lib qoladi (strelka).
- Ovoz: "Telefon ekrani kichik. Kompyuter uchun yozilgan sahifa u yerda mayda bo'lib qoladi."
## 3. 1-QADAM: viewport (14–22 s)
Kod kartasi: `<meta name="viewport" content="width=device-width, initial-scale=1">` yoritiladi; telefon "oldin -> keyin".
- Ovoz: "Birinchi qadam: bitta qator. Bu qator telefonga aytadi: ekran kengligiga moslash."
## 4. 2-QADAM: max-width (22–30 s)
Ikki telefon: `width:600px` (o'ng tomonga chiqib ketadi, gorizontal aylantirish) va `max-width:600px` (ekranga sig'adi).
- Ovoz: "Ikkinchi qadam: qattiq o'lcham o'rniga moslashuvchan o'lcham. width o'rniga max-width yozing."
## 5. 3-QADAM: @media (30–38 s)
3 karta yonma-yon (keng ekran) -> tor ekranda bir-birining tagida; kod: `@media (max-width: 600px){ ... flex-direction: column }`.
- Ovoz: "Uchinchi qadam: ekran tor bo'lsa, boshqa qoida. Kartalar bir-birining tagida turadi."
## 6. XULOSA + CTA (38–46 s)
3 qadam kartasi (viewport, max-width, media), "Saqlang / Yuboring", prompt kartasi (Claude'ga: "Sahifamni telefonga moslashtir"), teaser: "Keyingi video: JavaScript, tugma bosilganda nima bo'ladi?".
- Ovoz: "Xulosa: viewport, max-width va media. Saqlab qo'ying. Keyingi videoda: tugma bosilganda nima bo'lishini o'rganamiz!"

## Halollik
- Sahifa va kartalar namuna ("Ali", "namuna" belgisi). Brauzer/telefon logotiplari ishlatilmaydi.
- "Hamma telefonda mukammal chiqadi" deb va'da qilinmaydi: ba'zi qurilmalarda farq bo'lishi mumkin; videoda aytilmaydi, izohda "o'z telefoningizda tekshiring" deymiz.
- Faqat 3 asosiy qoida; murakkab narsa (grid, rem, clamp) lifehack/keyingi videolarga.

## Talaffuz (sinov kerak)
- `viewport` ("vyuport"?), `max-width` ("maks uidt"?), `media`, `width` ("uidt"). Kod kartasida yoziladi, ovozda kamroq aytiladi. Yuborilishi kerak: sinov klipi.

## Sizdan kerak
1. Ssenariy mosmi? Teaser (JavaScript, tugma) mosmi?
2. Qiziqarlilik uchun hook'da "OLDIN/KEYIN" telefonlari yetarlimi?
Tasdiqlansa: talaffuz klipi + kadr namunalari, so'ng to'liq render.
