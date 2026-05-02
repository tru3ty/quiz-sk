# Starquiz — landing concept

Космический квиз-лендинг (Y2K / неон). Расписание квизов на месяц + запись через модалку.

## Стек

Чистый статический сайт — никакого билда:
- HTML + React 18 (UMD CDN)
- JSX через Babel Standalone (in-browser)
- Шрифты: Unbounded, JetBrains Mono, Inter (Google Fonts)

## Запуск локально

Любой статический сервер. Например:

```bash
npx serve .
# или
python3 -m http.server 8000
```

Открой `http://localhost:8000` (или порт, который покажет команда).

> Просто открыть `index.html` двойным кликом не получится — браузер не загрузит `.jsx` файлы по `file://`. Нужен любой HTTP-сервер.

## Деплой на Vercel

1. Залей папку в GitHub-репозиторий.
2. На [vercel.com](https://vercel.com) → **Add New Project** → импорт репозитория.
3. Framework Preset: **Other** (статика).
4. Build Command: оставить пустым.
5. Output Directory: `./` (или `.`).
6. **Deploy**.

Vercel сам отдаст `index.html` и подтянет остальные файлы.

## Структура

```
index.html          — точка входа
app.jsx             — корневой компонент + роутинг модалки
orbital.jsx         — landing (hero / расписание / правила / контакты)
booking-modal.jsx   — форма записи (имя, команда, кол-во, телефон)
data.jsx            — расписание квизов и контакты
```

## Что менять

- **Расписание**: `data.jsx` → массив `SQ_EVENTS`. Каждый объект — дата (1–31), время, название, тема, свободные места, бар, теги.
- **Контакты**: `data.jsx` → `SQ_CONTACTS`.
- **Палитра**: `orbital.jsx` → объект `ORBITAL_PALETTES` (`neon` используется по умолчанию).
- **Подключение записи к бэку**: `booking-modal.jsx`, функция `submit` — сейчас просто переключает в success-state, нужно отправить `fetch` куда нужно.

## Производительность

Babel-in-browser удобен для прототипа, но медленнее чем pre-built. Когда дойдёт до прода — стоит мигрировать на Vite/Next и убрать Babel из рантайма.
