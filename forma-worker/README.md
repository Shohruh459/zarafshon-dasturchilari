# Forma uchun xavfsiz server (Cloudflare Worker)

**Maqsad:** token brauzer kodida emas, serverda yashirin turadi.

```
Eski:  brauzer ──(token ochiq)──► Telegram        ← xavfli
Yangi: brauzer ──► Worker (token yashirin) ──► Telegram
```

## Siz qiladigan ishlar (≈ 10 daqiqa, hammasi brauzerda)
> Cloudflare sahifalaridagi tugma nomlari vaqt o'tishi bilan biroz o'zgarishi mumkin.

1. **dash.cloudflare.com** da bepul ro'yxatdan o'ting.
2. **Workers & Pages → Create → Create Worker.** Nomi: `zarafshon-forma`. **Deploy** bosing.
3. **Edit code** bosing, ichidagini o'chirib, shu papkadagi `worker.js` matnini qo'ying. **Deploy**.
4. **Settings → Variables and Secrets → Add** bosing:
   - `BOT_TOKEN`, turi **Secret**, qiymati: `@BotFather` dan olgan **yangi** token.
   - `CHAT_ID`, turi **Text**, qiymati: formadan keladigan xabarlar tushadigan chat ID.
   - **Deploy** bosing.
5. Worker manzilini nusxalang. U shunga o'xshash bo'ladi: `https://zarafshon-forma.<sizning-nom>.workers.dev`
6. **Shu manzilni menga yuboring.** U maxfiy emas.

## Eslatmalar
- **Yangi tokenni menga yubormang** va hech qayerga (gitga, chatga) yozmang. Faqat Cloudflare'dagi Secret maydoniga kiriting.
- Men manzilni olgach `index.html` dagi formani Worker'ga yuboradigan qilib o'zgartiraman va tokenni koddan olib tashlayman.
- Bepul tarifda so'rovlar soni cheklangan, forma uchun odatda yetarli (aniq chegarani Cloudflare sahifasida tekshiring).

## Himoyaning chegarasi (halollik)
- Token endi **o'g'irlanmaydi**.
- Lekin kimdir Worker manziliga so'rov yuborib, chatingizga **spam** xabar yuborishga urinishi mumkin. `Origin` tekshiruvi oddiy urinishlarni to'xtatadi, qat'iy kafolat emas. Kerak bo'lsa keyin Cloudflare Turnstile (robotga qarshi tekshiruv) qo'shamiz.
