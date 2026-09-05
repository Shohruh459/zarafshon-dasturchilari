# CLAUDE.md

Bu repo — **Zarafshon Dasturchilari** jamoasining marketing/portfolio sayti.
Maqsad: zamonaviy dizayn (3D ko'rinish, effektlar, animatsiyalar) orqali
tayyorlagan shablon va loyihalarni ko'rsatib, yangi mijozlardan buyurtma
olish. Sayt hozircha bitta `index.html` fayl — build tizimi, framework yo'q.

## 1. Xavfsizlik — eng muhim qoida

**Hech qanday API token, bot kaliti, parol yoki maxfiy kalitni
`index.html` yoki boshqa client-side (brauzerda ishlaydigan) faylga
yozmang.** Bu sayt statik bo'lib, uning butun manba kodi har qanday
tashrif buyuruvchiga ochiq — nimaiki koddan ko'rinsa, u darhol ochiq
hisoblanadi.

- Telegram, SMS, email yoki boshqa tashqi xizmatlarga murojaat qiladigan
  har qanday funksiya (masalan, buyurtma formasi) albatta serverga
  (`worker/` papkasidagi Cloudflare Worker kabi) ajratilgan bo'lishi
  kerak. Maxfiy qiymatlar faqat `wrangler secret put` orqali, hech qachon
  kodda emas.
- Yangi forma/integratsiya qo'shsangiz, xuddi shu naqshni takrorlang:
  brauzer → o'z Worker/serveringiz → tashqi API.
- Agar tasodifan biror joyda token yoki parol ko'rib qolsangiz — uni
  darhol kodda o'chirib, foydalanuvchiga eski kalitni bekor qilish
  (revoke/rotate) kerakligini ayting. Kodni tuzatish yetarli emas, chunki
  git tarixida eski qiymat qolib ketishi mumkin.

## 2. Loyihaning tuzilishi

- `index.html` — asosiy sayt (hero, statistika, biz haqimizda, xizmatlar,
  aloqa formasi). Dizayn tokenlari `:root` ichidagi CSS o'zgaruvchilarda
  (`--orange`, `--gold`, `--dark`, ...) — yangi bo'lim qo'shganda shu
  ranglar va shriftlardan (Syne + DM Sans) foydalaning, yangi rang
  palitrasi qo'shishdan oldin foydalanuvchidan so'rang.
- `worker/` — buyurtma formasini Telegram'ga yuboradigan Cloudflare
  Worker (`worker.js`, `wrangler.toml`, `README.md`). Bu GitHub Pages'da
  statik saytdan mustaqil, alohida deploy qilinadi.
- Til: barcha foydalanuvchiga ko'rinadigan matn — o'zbek tilida, lotin
  yozuvida (hozirgi holatga mos).

## 3. Kelajakda ko'zda tutilgan yo'nalish

Foydalanuvchi (agentlik egasi) rejasi: har bir yangi mijoz uchun
tayyorlangan sayt/shablonni shu portfolio saytiga qo'shib borish
(preview rasm/GIF, 3D hover effekt, "Ko'rish" tugmasi bilan demo linki),
va ish jarayonini video qilib ijtimoiy tarmoqlarga joylash orqali yangi
mijoz topish.

- Yangi portfolio/shablon bo'limi qo'shilganda, mavjud `.service-card`
  uslubidagi karta naqshiga (raqam, ikon, sarlavha, tavsif, teglar)
  ergashing — izchillik muhim.
- Har bir karta uchun real skrinshot/GIF ishlating (siqilgan holda,
  sahifa og'irlashmasligi uchun), soxta yoki placeholder rasm bilan
  "tayyor" deb belgilamang.

## 4. Anglashilmovchilik bo'lishi mumkin bo'lgan joylar — ehtiyot bo'ling

- **Mijoz loyihalarini oshkor qilish**: biror mijoz uchun qilingan
  saytni/shablonni portfolioga real loyiha sifatida qo'shishdan oldin,
  bu mijozning roziligi borligini foydalanuvchidan so'rab tasdiqlang —
  bu texnik qaror emas, ishonch/maxfiylik masalasi.
- **Statistika va raqamlar**: hero/stats bo'limidagi raqamlar (`4+`,
  `24h`, `100%` kabi) umumiy formuladagi da'volar. Yangi raqamli
  ko'rsatkich (masalan "500+ mijoz", "50+ loyiha") qo'shishda uni
  o'zingizdan o'ylab topmang — faqat foydalanuvchi tasdiqlagan haqiqiy
  sonlarni yozing.
- **Aloqa ma'lumotlari** (`t.me/...`, Instagram, telefon): bu jonli
  biznes ma'lumotlari. Ularni o'zgartirish yoki almashtirishdan oldin
  foydalanuvchidan tasdiq oling.
- **Katta dizayn o'zgarishlari**: joriy uslub (dark + orange/gold, custom
  cursor, "glitch" hero) ongli tanlangan. Rang sxemasi, umumiy uslub yoki
  tuzilishni tubdan o'zgartirishdan oldin foydalanuvchi bilan
  kelishib oling; kichik qo'shimchalar (yangi bo'lim, yangi karta) uchun
  bu shart emas.
- **Video/ijtimoiy tarmoq ishi**: ish jarayonini videoga olish va
  Instagram/TikTok'ga joylash — bu repo doirasidan tashqari, qo'lda
  qilinadigan ish. Bu haqda so'ralganda kodga tegishli o'zgarish
  kiritish shart emasligini yodda tuting (agar aniq kod/sahifa o'zgarishi
  so'ralmasa).
- **Hosting**: repo o'zi hech qanday deploy konfiguratsiyasini
  o'z ichiga olmaydi (Pages/Netlify/boshqa xizmat sozlamasi yo'q). Agar
  hosting bo'yicha o'zgarish kerak bo'lsa (masalan CI/CD qo'shish), avval
  foydalanuvchidan qaysi platforma ishlatilishini so'rang.

## 5. Git

Barcha o'zgarishlarni `claude/website-design-portfolio-fnuw3b` branch'ida
olib boring, aniq va qisqa commit xabarlari bilan. `main`ga to'g'ridan-
tog'ri push qilmang, agar aniq so'ralmasa.
