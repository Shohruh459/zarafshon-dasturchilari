# Buyurtma formasi uchun Cloudflare Worker

Sayt statik (`index.html`) bo'lgani uchun Telegram bot tokenini saytning
o'zida saqlab bo'lmaydi — u darhol hamma uchun ochiq bo'lib qoladi. Shu
sababli forma endi to'g'ridan-to'g'ri Telegram API'ga emas, shu papkadagi
Cloudflare Worker'ga (`worker.js`) murojaat qiladi, token esa faqat Worker
tomonida, "secret" sifatida saqlanadi.

## ⚠️ Birinchi qadam: eski tokenni bekor qiling

Avvalgi bot tokeni ushbu repo ochiq (public) bo'lgan paytda kodda ochiq
turgan edi — uni allaqachon buzilgan (compromised) deb hisoblang:

1. Telegram'da **@BotFather** ga o'ting.
2. `/mybots` → botingizni tanlang → **API Token** → **Revoke current token**.
3. Yangi tokenni faqat quyidagi 3-qadamda, `wrangler secret put` orqali
   kiriting — boshqa hech qayerga (kodga, chatga, screenshotga) yozmang.

## Deploy qilish

```bash
cd worker
npm install -g wrangler   # yoki: npx wrangler ...
wrangler login
wrangler deploy
wrangler secret put BOT_TOKEN   # yangi tokenni shu yerda kiritasiz
wrangler secret put CHAT_ID
```

Deploy tugagach, terminalda shunga o'xshash manzil chiqadi:

```
https://zarafshon-order-proxy.<sizning-subdomeningiz>.workers.dev
```

Shu manzilni nusxalab, repo ildizidagi `index.html` faylida
`FORM_ENDPOINT` o'zgaruvchisiga qo'ying (`<script>` blokining oxiridagi
`handleSubmit` funksiyasidan oldin turibdi).

## Domenni cheklash (ixtiyoriy, lekin tavsiya etiladi)

`wrangler.toml` faylidagi `[vars]` bo'limiga `ALLOWED_ORIGIN` qo'shsangiz,
forma faqat shu domendan yuborilgan so'rovlarni qabul qiladi.
