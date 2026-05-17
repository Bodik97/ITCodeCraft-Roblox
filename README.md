# ITCodeCraft · Roblox Edition

Лендінг школи програмування для дітей (8–16): одна сторінка, форма заявки, API + PostgreSQL.

## Швидкий старт

```bash
pnpm install
cp .env.example .env          # налаштуйте DATABASE_URL
pnpm --filter @workspace/db run push
bun dev                       # сайт :5173 + API :5001 (див. PORT у .env)
```

Перевірка та збірка:

```bash
pnpm run check
pnpm run build
```

---

## Структура репозиторію

```
Code-Craft-Roblox/
│
├── artifacts/                 # Застосунки (те, що запускається)
│   ├── itcodecraft/           # 🌐 Сайт — Astro лендінг
│   ├── api-server/            # 🔌 API — Express, POST /api/lead
│   └── mockup-sandbox/        # 🎨 Пісочниця дизайну (окремо)
│
├── lib/                       # Спільні пакети
│   ├── api-spec/              # OpenAPI-контракт (джерело правди)
│   ├── api-zod/               # Zod-схеми з OpenAPI
│   ├── api-client-react/      # React-хуки (якщо потрібні в інших apps)
│   └── db/                    # Drizzle + PostgreSQL
│
├── scripts/                   # Dev-утиліти
│   ├── dev.ts                 # bun dev — піднімає API + сайт
│   └── dev-stop.ts            # bun run dev:stop — звільнити порти
│
├── .env                       # DATABASE_URL, PORT (не комітити)
├── package.json               # Кореневі скрипти
└── pnpm-workspace.yaml        # Monorepo
```

---

## Сайт (`artifacts/itcodecraft`)

Один вхід — одна сторінка. Контент у JSON, секції окремими файлами.

```
itcodecraft/src/
├── pages/
│   └── index.astro            # Збирає всі секції
├── sections/                  # Великі блоки лендингу
│   ├── Header.astro
│   ├── Hero.astro
│   ├── GamesShowcase.astro
│   ├── … FAQ, RegisterForm, Footer
├── components/                # Дрібні UI
│   ├── layouts/Layout.astro   # HTML, meta, глобальні скрипти
│   ├── Logo.astro
│   ├── form/                  # React-форма → POST /api/lead
│   └── modal/
├── data/
│   └── data.json              # ✏️ Тексти, CTA, посилання (placeholders)
├── styles/
│   ├── global.css
│   ├── base/
│   └── components/
├── lib/                       # assets.ts, utils, reportError
└── assets/                    # Зображення (.png)
```

| Що змінити | Де |
|------------|-----|
| Тексти, посилання, CTA | `src/data/data.json` |
| Секція лендингу | `src/sections/*.astro` |
| Логотип | `src/components/Logo.astro` + `styles/components/logo.css` |
| Форма заявки | `src/components/form/` |
| Стилі, анімації | `src/styles/global.css` |
| Meta / OG | `src/components/layouts/Layout.astro` |

---

## API (`artifacts/api-server`)

```
api-server/src/
├── index.ts       # Старт сервера
├── app.ts         # Express app
└── routes/
    ├── health.ts  # GET /api/healthz
    └── lead.ts    # POST /api/lead → PostgreSQL
```

| Що змінити | Де |
|------------|-----|
| Контракт API | `lib/api-spec/openapi.yaml` |
| Таблиця leads | `lib/db/src/schema/leads.ts` |
| Логіка роута | `artifacts/api-server/src/routes/lead.ts` |

Після змін OpenAPI:

```bash
pnpm --filter @workspace/api-spec run codegen
```

---

## Кореневі команди

| Команда | Дія |
|---------|-----|
| `bun dev` | API + сайт разом |
| `bun run dev:stop` | Зупинити процеси на 5173 і PORT |
| `pnpm run dev:web` | Тільки сайт |
| `pnpm run dev:api` | Тільки API |
| `pnpm run check` | Astro check (сайт) |
| `pnpm run build` | Typecheck + збірка всього monorepo |
| `pnpm --filter @workspace/db run push` | Схема БД (dev) |

---

## Стек

- **Monorepo:** pnpm workspaces (`pnpm install`)
- **Сайт:** Astro 5, Tailwind 4, React islands (форма, карусель, лічильники)
- **API:** Express 5, esbuild
- **БД:** PostgreSQL, Drizzle ORM

---

## Порти (локально)

| Сервіс | URL |
|--------|-----|
| Сайт | http://localhost:5173 |
| API | http://localhost:5001 (з `.env` → `PORT`) |

Форма на сайті шле запити на `/api/lead` — у dev Astro проксує їх на API.
