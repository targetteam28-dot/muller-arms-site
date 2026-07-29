# Muller Arms — сайт + безпечна вигрузка лідів у Telegram

## Структура
```
index.html                       — сам сайт
netlify/functions/send-lead.js   — серверна функція, яка шле заявку в Telegram
netlify.toml                     — конфіг Netlify (де лежать функції)
```

Токен бота і chat_id **ніде в коді сайту не зберігаються** — тільки на сервері
Netlify, в Environment variables. Відвідувач сайту фізично не може їх побачити
навіть через "View Source" чи консоль розробника.

## Кроки деплою (Netlify через GitHub — рекомендовано)

1. Створіть новий репозиторій на GitHub і залийте туди всі файли з цієї папки
   (включно з `netlify.toml` і папкою `netlify/functions`).
2. Зайдіть на app.netlify.com → **Add new site → Import an existing project**
   → підключіть цей репозиторій.
3. Build settings можна лишити порожніми (publish directory: `.`) — Netlify
   сам підхопить `netlify.toml`.
4. Після деплою: **Site configuration → Environment variables → Add a variable**
   і додайте:
   - `TELEGRAM_BOT_TOKEN` = токен вашого бота від @BotFather
   - `TELEGRAM_CHAT_ID` = chat_id, куди приходитимуть заявки
5. **Deploys → Trigger deploy** (щоб функція підхопила нові змінні середовища).

## Як отримати TELEGRAM_BOT_TOKEN і TELEGRAM_CHAT_ID

1. У Telegram напишіть **@BotFather** → `/newbot` → дайте боту ім'я →
   отримаєте токен виду `123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.
2. Напишіть щойно створеному боту будь-яке повідомлення (просто "привіт"),
   або додайте його в групу, куди мають прилітати заявки.
3. Відкрийте в браузері:
   `https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates`
4. У відповіді знайдіть `"chat":{"id": 123456789, ...}` — це і є ваш CHAT_ID.
   (Якщо відповідь порожня — напишіть боту ще раз і оновіть сторінку.)

## Альтернатива без GitHub — Netlify CLI

Якщо не хочете створювати репозиторій:
```bash
npm install -g netlify-cli
cd muller-arms-site
netlify login
netlify init
netlify deploy --prod
```
Далі так само додайте змінні середовища через `netlify env:set TELEGRAM_BOT_TOKEN <токен>`
і `netlify env:set TELEGRAM_CHAT_ID <chat_id>`, після чого `netlify deploy --prod` ще раз.

⚠️ Просте перетягування файлу на app.netlify.com/drop **не підходить** —
Netlify Drop деплоїть тільки статичні файли й не піднімає serverless-функції.
Потрібен саме варіант через GitHub або Netlify CLI, описаний вище.

## Фото

У `index.html` вже прописані шляхи до фото (тренери, зброя, клуб, відгуки) —
файлів поки немає в цій папці. Як тільки отримаю фото від вас, додам їх сюди
з правильними іменами файлів.
