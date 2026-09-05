// Cloudflare Worker: proxies the contact form to Telegram so the bot
// token never appears in client-side code. Deploy this separately from
// the static site (see worker/README.md) — it works regardless of where
// index.html itself is hosted.

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405, headers });
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400, headers });
    }

    const ism = String(data.ism || '').trim().slice(0, 200);
    const tel = String(data.tel || '').trim().slice(0, 50);
    const loyiha = String(data.loyiha || '').trim().slice(0, 2000);

    if (!ism || !tel || !loyiha) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), { status: 400, headers });
    }

    const text = `🌐 SAYTDAN YANGI BUYURTMA!\n\n👤 Ism: ${ism}\n📞 Telefon: ${tel}\n💬 Loyiha: ${loyiha}`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: env.CHAT_ID, text }),
    });

    if (!tgResponse.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'telegram_failed' }), { status: 502, headers });
    }

    return new Response(JSON.stringify({ ok: true }), { headers });
  },
};
