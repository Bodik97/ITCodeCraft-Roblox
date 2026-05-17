# ITCodeCraft Roblox Edition

Landing page for ITCodeCraft — an online school teaching kids 8–16 to build and publish Roblox games in Lua. Primary goal: convert visitors into free trial lesson signups.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/itcodecraft run dev` — run the landing page frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifacts/itcodecraft)
- API: Express 5 (artifacts/api-server)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/leads.ts` — leads table schema
- `artifacts/api-server/src/routes/lead.ts` — POST /api/lead route
- `artifacts/itcodecraft/src/` — landing page React app

## Architecture decisions

- Single-page landing at `/` with 13 sections, all in-page anchor navigation
- Lead form submits to `/api/lead` which stores to PostgreSQL
- Design system uses Fredoka + Inter fonts, indigo/amber palette, Roblox-inspired 3D button shadows
- No external image dependencies — all visuals are CSS-drawn or generated

## Product

A conversion-focused landing page for ITCodeCraft Roblox Edition that:
1. Showcases what games kids can build (Obby, Tycoon, Battle Arena, Racing)
2. Explains why Roblox is a real learning platform for parents
3. Shows student games, mentors, testimonials
4. Captures leads via a free trial lesson form

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always re-run `pnpm --filter @workspace/api-spec run codegen` + `pnpm run typecheck:libs` after OpenAPI spec changes before starting the frontend
- Google Fonts `@import url(...)` must be the very first line in index.css
- `--color-*` CSS vars must be in space-separated HSL format (no `hsl()` wrapper) for Tailwind compatibility
- Roblox® trademark disclaimer is required in footer

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
