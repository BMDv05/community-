# Runbook

## Local
1. `cd platform && cp .env.example .env`
2. `npm.cmd install && npm.cmd run dev` → http://localhost:3000
3. Admin: http://localhost:3000/admin (default `admin@doubleh.community` / `DoubleH123!`)

## Production deploy (Vercel)
1. Push `platform/` to GitHub. Import in Vercel, root = `platform`.
2. Env: `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, `DATABASE_URL` (Neon/Supabase), `RESEND_API_KEY`.
3. Run Prisma: `prisma migrate deploy`. Switch `store.ts` to Prisma client (interfaces match).
4. Enable Turnstile + Upstash Ratelimit keys; set `STRIP` honeypot stays.
5. Email domain: SPF/DKIM/DMARC for Resend. Health: `GET /api/health`.

## Docker (alternative)
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY platform/package*.json ./
RUN npm ci
COPY platform/ ./
RUN npm run build
CMD ["npm", "start"]
```

## Backups
- MVP: back up `data/*.json` nightly. Prod: managed Postgres PITR + storage versioning.

## Pre-launch checklist
DNS · SSL · SPF/DKIM/DMARC · `ADMIN_PASSWORD` rotated · `ADMIN_SECRET` 32+ chars ·
rate limits tuned · `npm audit` clean · Lighthouse ≥ targets · axe zero serious ·
`sitemap.xml`/`robots.txt` verified · legal pages (About/Contact/Privacy) live.
