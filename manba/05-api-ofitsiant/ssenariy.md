# 5-video: API nima? (ofitsiant) — SSENARIY (tasdiq kutilmoqda)

Format: ~32 s, 1080x1920, 30 fps. Blender kirishi (zal + oshxona eshigi + ofitsiant), qolgani CSS sahnalar.
Ovozga o'/g' -> oʻ/gʻ (U+02BB). Ekranda ‘.

## 1. HOOK (0–6.4 s) — Blender
Ekran tepasida 0-kadrdan: "🎯 BOSHLANG‘ICH DASTURCHILAR UCHUN" + "FRONTEND BACKENDGA QANDAY GAPIRADI?"
| Ovoz | Blender kadri |
|---|---|
| "Boshlang'ich dasturchilar uchun savol:" | Zal: stollar, iliq chiroqlar. Kamera oshxona eshigi tomon siljiydi. |
| "frontend backendga qanday gapiradi?" | Mijoz eshikni qoqadi. Eshik yopiq, ustida "OSHXONA". |
| "Orada ofitsiant bor!" | Ofitsiant buyurtma qog'ozi bilan kadrga kiradi, eshikdan o'tadi. Ekran sarlavhasi: "MANA, OFITSIANT! 🤵" |

## 2. NEGA KERAK (6.4–11 s) — Blender davomi + CSS
- "Zal oshxonaga to'g'ridan-to'g'ri kira olmaydi." (eshik oldida "⛔" belgisi)
- "Orada ofitsiant yuradi. Dasturda uni API deymiz." (belgi: "API = ofitsiant 🤵")
- Izoh (birinchi marta aytilgani uchun): "API — dasturlar bir-biri bilan gaplashadigan eshikcha."

## 3. YO'L (11–20 s) — CSS
Yo'l chizig'i: 📱 Tugma → 🤵 Ofitsiant → 👨‍🍳 Oshxona → 🗄️ Ombor, va javob orqaga qaytadi.
- "Siz tugmani bosasiz. Bu — so'rov." (1-qadam yonadi)
- "Ofitsiant uni oshxonaga olib boradi." (2–3)
- "Oshxona ombordan oladi va tayyorlaydi." (4)
- "Ofitsiant javobni qaytaradi. Sayt yangilanadi." (orqaga yo'l, ✅)

## 4. JSON (20–26 s) — CSS
Qog'oz kartasi (NAMUNA ma'lumot belgisi bilan):
```
{ "taom": "sushi", "soni": 2 }
```
- "Ofitsiant qog'ozga yozadi. Bu qog'oz — JSON."
- "Odam ham, kompyuter ham o'qiy oladigan oddiy yozuv."

## 5. CTA (26–32 s)
- "Saqlab qo'ying." + "Frontend ✓ Backend ✓ Baza ✓ API ✓"
- "Keyingi videoda: server, ya'ni oshxona joylashgan bino!" (teaser -> 6-video)
- Prompt kartasi: "API nima? Ofitsiant misolida tushuntir va JSON misol ber."

## Blender sahna (ombor.py asosida)
- Zal: pol (yaltiroq), 4–5 stol, osma chiroqlar, devor, "OSHXONA" yozuvli ikki tabaqali eshik (yog'och + issiq yoritish).
- Ofitsiant: oddiy figura (tana silindr, bosh shar, galstuk, patnis) — "wow" kamera harakati va yoritishdan, shakl soddaligi shundan.
- Kamera: zal bo'ylab siljish, ofitsiant yonidan o'tib eshikka. 15 fps, 0.6 masshtab, 12 namuna (~11 s/kadr, ~140 kadr ≈ 25 daqiqa), keyin 30 fps ga interpolyatsiya.

## Qoidalar tekshiruvi
- Kim uchun: 0-kadrda yozilgan va aytilgan ✔ | Ostyozuv har doim ✔ | Pastki 20% bo'sh ✔
- Musiqa yo'q ✔ | Namuna ma'lumot belgilanadi ✔ | Natija kafolati yo'q ✔
