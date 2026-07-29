// Serverless-функція: приймає заявку з сайту і пересилає в Telegram.
// Токен бота і chat_id зберігаються тут як змінні середовища (env vars) на сервері Netlify —
// вони НІКОЛИ не потрапляють у код сторінки, яку бачить відвідувач.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: 'TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID не задані в налаштуваннях Netlify (Environment variables).' })
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Невалідний JSON' }) };
  }

  // Обмежуємо довжину тексту про всяк випадок — щоб ніхто не закинув мегабайт сміття в чат
  const text = String(payload.text || '').slice(0, 2000);
  if (!text) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Порожнє повідомлення' }) };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });
    const data = await res.json();
    if (!data.ok) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: data.description || 'Telegram API помилка' }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: err.message }) };
  }
};
