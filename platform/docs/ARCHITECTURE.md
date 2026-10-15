# Architecture

## Overview
Next.js 15 (App Router) + TypeScript strict + Tailwind. Server Components for browsing;
small Client Components for interactivity (language, menus, tabs, forms, admin).
Zero-config persistence: `src/lib/store.ts` over `data/*.json` with the same domain rules
the production Prisma/Postgres schema enforces.

## Layering
`UI → Route Handler / Server logic → store (service) → JSON / Postgres`.
Validation with Zod on the server for every mutation (`src/lib/validation.ts`).
Pure domain helpers (`isUpcoming`, status machines, `slugify`, `normalizeEmail`) are unit-tested.

## Routes
- Public pages: `/`, category listings with Upcoming/Past tabs + pagination, `/{category}/{slug}` detail with sticky action sidebar + JSON-LD.
- Mutations: `POST /api/registrations` (discriminated-union validation, honeypot, 5/hour/IP rate limit, duplicate + capacity + eligibility guards), `POST /api/private-requests` (future-date, services enum array).
- Admin: cookie session (`dh_admin` HMAC), `GET/PATCH /api/admin/data` with RBAC + transition guards, `GET /api/admin/export` CSV.

## i18n
Custom lightweight dictionary (`src/lib/i18n.ts` + `LanguageProvider`): `en`/`ar`, full RTL via
`document.dir`, logical properties (`start-/end-`), Arabic font stack. No `next-intl` runtime cost.

## Email
Outbox pattern: every mutation appends to `data/outbox.json` and logs `[email:*]` lines.
Production: Resend worker drains the outbox with retry (see RUNBOOK).

## Security
Zod everywhere, honeypot, in-memory rate limit (Upstash in prod), security headers in
`next.config.mjs`, httpOnly admin cookie, no PII in logs, upload allowlist documented.
