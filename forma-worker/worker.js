// Cloudflare Worker: sayt formasidan kelgan ma'lumotni Telegram'ga xavfsiz yuboradi.
// Token (BOT_TOKEN) va chat ID (CHAT_ID) bu yerda YOZILMAYDI, ular Cloudflare'da "Secret" sifatida saqlanadi.

const RUXSAT_ETILGAN_SAYT = 'https://shohruh459.github.io';

export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': RUXSAT_ETILGAN_SAYT,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const javob = (obj, status) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...cors, 'Content-Type': 'application/json' },
      });

    // Brauzer avval "ruxsat bormi?" deb so'raydi (OPTIONS)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return javob({ ok: false, xato: 'Faqat POST' }, 405);

    // Faqat bizning saytimizdan kelgan so'rovni qabul qilamiz
    if (request.headers.get('Origin') !== RUXSAT_ETILGAN_SAYT) {
      return javob({ ok: false, xato: 'Ruxsat yo\'q' }, 403);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return javob({ ok: false, xato: 'JSON noto\'g\'ri' }, 400);
    }

    // Tekshiruv va uzunlikni cheklash (spamdan himoya uchun)
    const ism = String(data.ism || '').trim().slice(0, 100);
    const tel = String(data.tel || '').trim().slice(0, 30);
    const loyiha = String(data.loyiha || '').trim().slice(0, 2000);
    if (!ism || !tel) return javob({ ok: false, xato: 'Ism va telefon kerak' }, 400);

    if (!env.BOT_TOKEN || !env.CHAT_ID) {
      return javob({ ok: false, xato: 'Server sozlanmagan' }, 500);
    }

    const matn = `🌐 SAYTDAN YANGI BUYURTMA!\n\n👤 Ism: ${ism}\n📞 Telefon: ${tel}\n💬 Loyiha: ${loyiha}`;

    const tg = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text: matn }),
    });

    // Telegram javobini tekshiramiz (eski kodda bu yo'q edi)
    if (!tg.ok) return javob({ ok: false, xato: 'Telegram qabul qilmadi' }, 502);
    return javob({ ok: true }, 200);
  },
};
