# ITCodeCraft Roblox Edition

Лендінг для безкоштовного уроку з Roblox Studio. Повна карта проєкту — у [README.md](./README.md).

## Run & Operate

- `bun dev` — сайт + API разом
- `pnpm run dev:web` — тільки Astro-сайт (порт 5173)
- `pnpm run dev:api` — тільки API (порт з `.env`, за замовчуванням 5001)
- `pnpm run check` — перевірка Astro
- `pnpm run build` — typecheck + збірка monorepo
- `pnpm --filter @workspace/db run push` — схема БД (dev)
- Потрібно: `DATABASE_URL` у `.env` (див. `.env.example`)

## Stack

- pnpm workspaces, TypeScript 5.9
- Сайт: Astro 5 + Tailwind 4 (`artifacts/itcodecraft`)
- API: Express 5 (`artifacts/api-server`)
- DB: PostgreSQL + Drizzle

## Where things live

- `artifacts/itcodecraft/src/data/data.json` — тексти лендингу
- `artifacts/itcodecraft/src/sections/` — секції сторінки
- `lib/api-spec/openapi.yaml` — API contract
- `lib/db/src/schema/leads.ts` — таблиця leads
- `artifacts/api-server/src/routes/lead.ts` — POST /api/lead

## Gotchas

- Встановлення: `pnpm install` (не `bun i` для першого install у monorepo)
- Після змін OpenAPI: `pnpm --filter @workspace/api-spec run codegen`
- Roblox® disclaimer обовʼязковий у футері
