---
name: Starquiz monorepo architecture
description: Monorepo structure, stack choices, and DB schema for Starquiz project
type: project
---

Starquiz is a quiz bar event platform being built as a bun monorepo.

**Structure:**
```
apps/landing  — Vite + React 18 + Tailwind v4 (existing landing page)
apps/admin    — Next.js 15 + Hono API + Better Auth (in progress)
packages/db   — Drizzle ORM + Neon PostgreSQL (shared)
```

**Stack:** bun workspaces + Turborepo, Next.js 15 App Router, Hono on /api/[[...route]], Better Auth (single admin, email+password), Drizzle ORM, Neon PostgreSQL 18, deployed on Vercel.

**Why:** pnpm was timing out on Next.js download, switched to bun which installed everything in 185s.

**DB schema tables:** events, venues, bookings, contacts, rules — all in packages/db/src/schema.ts

**Neon limits:** 0.5 GB storage, 2 CPU cores — use pooler URL for serverless API (DATABASE_URL_POOL), direct URL for migrations (DATABASE_URL).

**Status as of 2026-05-11:** monorepo initialized, bun install done, Next.js admin app package.json created but no app/ directory yet. Next step: create Next.js app structure in apps/admin, then wire up Hono + Better Auth.

**How to apply:** When working on this project, always use bun (not npm/pnpm). Admin runs on port 3001. Landing on port 5173.
