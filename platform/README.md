# Double H Community — Platform

Professional community events platform (Workshops · Events · Lectures · Field Trips) themed on the
Double H Community logo & palette: `#12393a` · `#134c4b` · `#e6ecec` · `#46766f` · `#161919`.

## Quick start (under 5 minutes)

```bash
cd platform
cp .env.example .env   # or copy manually on Windows
npm.cmd install
npm.cmd run dev        # → http://localhost:3000
```

Seed data (12 bilingual events: upcoming + past + full + cancelled) ships in code
(`src/lib/seed.ts`) — no DB setup needed. Registrations / private requests persist to
`data/*.json` (git-ignored at runtime).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` / `npm start` | Production build & serve |
| `npm run typecheck` | `tsc --noEmit` (strict + `noUncheckedIndexedAccess`) |
| `npm test` | Vitest domain suite (eligibility, status machines, schemas) |

## Admin

- URL: `/admin` → redirects to `/admin/login` when signed out.
- Default: `admin@doubleh.community` / `DoubleH123!` — override via `ADMIN_EMAIL` / `ADMIN_PASSWORD` env.
- Dashboard: stats, registrations (status changes with illegal-transition guard), private requests pipeline, events list, CSV export (`/api/admin/export`).

## Key routes

`/` · `/workshops` · `/events` · `/lectures` · `/field-trips` · `/{category}/{slug}` ·
`/register?event=&type=` · `/request-event` · `/thank-you` · `/about` · `/contact` · `/privacy` · `/admin`

## Production path

See `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (why JSON-store MVP + Prisma schema ready),
`RUNBOOK.md` (deploy to Vercel/Docker, Postgres, Resend, rate limits, Turnstile), `FUTURE.md`.
`prisma/schema.prisma` is the production Postgres schema with unique constraints + indexes.
