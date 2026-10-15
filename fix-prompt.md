# MASTER PROMPT — Fix the Hard-Test Findings (Performance + Security)

> **How to use:** Paste everything below the line into your AI coding tool with the
> `platform/` repo open and the dev server running on `http://localhost:3000`.
> Work through the findings in priority order. Do not "fix" anything by weakening
> a passing check.

---

## 1. ROLE

You are a **Principal Full-Stack Engineer** doing a hardening pass on the already-built
**Double H Community** platform (Next.js 15 App Router + TypeScript strict + Tailwind,
in `platform/`). You fix root causes, never symptoms. Every fix ships with a test or a
measurement proving it worked.

## 2. BASELINE EVIDENCE (do not regress)

A hard battery ran against `http://localhost:3000` — **26/26 passing**:

| # | Result | Evidence |
|---|---|---|
| S1 | XSS inert | `<script>` / `onerror` payloads stored, never executed; zero `dangerouslySetInnerHTML` / `eval` in `src/` |
| S2 | No crashes | 7 malformed shapes (wrong types, nested objects, 200 KB blob, null/array/string bodies) → 422/400, never 500 |
| S3 | Auth matrix | All 7 admin endpoints unauthenticated → 401; wrong password → 401; admin cookie is httpOnly |
| S4 | Uploads safe | EXE-with-image-MIME → 422; `../../traversal.png` sanitized to random name; magic-byte sniffing works |
| S5 | Headers | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` present |
| S6 | Concurrency | 4-request burst, no crash; rate limiter trips to 429 exactly after 5/hr |
| P1 | Home API (50 req) | avg 243 ms, p95 611 ms, 0 errors |
| P2 | Events list API (50 req) | avg 268 ms, p95 623 ms, 0 errors |
| P3 | Join page SSR (20 req) | avg 879 ms, p95 2349 ms, 0 errors (**includes first-compile; steady-state ~500 ms**) |

## 3. FIX LIST (in order — do not skip, do not reorder)

### F1 — `metadataBase` missing [quick win]
Every page render logs: *"metadataBase property in metadata export is not set…"*.
- Fix: set `metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000")` in `src/app/layout.tsx` metadata.
- Done when: zero warnings in dev output on `/`, `/join`, `/admin`.

### F2 — Rate limit hardcoded at 5/hr, in-memory only [tunable, not weaker]
Legit bursts (e.g., a classroom submitting at once) trip the limiter; it also resets on every restart.
- Fix: `src/lib/rate-limit.ts` reads `RATE_LIMIT_MAX` (default 5 in dev, default 60 in production) and `RATE_LIMIT_WINDOW_MS` (default 3600_000), validated in env handling with safe fallbacks. Keep the in-memory limiter as the default; use Upstash Ratelimit automatically when `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are set (interface must stay identical for callers).
- Add `.env.example` entries + a `docs/RUNBOOK.md` note.
- Done when: default behavior unchanged (5/hr with no env set — prove with the rate test), and setting `RATE_LIMIT_MAX=100` demonstrably raises the ceiling.

### F3 — Join page SSR p95 2349 ms [performance]
- Fix, in this order: (a) move the event-list fetch for the picker behind a cached route handler response (`Cache-Control: s-maxage=60, stale-while-revalidate`), (b) audit the page's client JS (no new deps; `dynamic()` anything below the fold), (c) keep all strings in the existing dict (no runtime i18n cost).
- Done when: steady-state (post-compile) p95 < 800 ms measured over 20 requests, and First Load JS for `/join` does not grow vs. the last build report.

### F4 — No explicit body-size cap on mutations [security]
A 200 KB junk field was silently accepted and stripped. Add a guard: reject bodies > 1 MB with **413** before `JSON.parse` on `/api/registrations`, `/api/applications`, `/api/private-requests` (shared helper in `src/lib/`).
- Done when: a 2 MB POST returns 413 (not 422, not a crash), normal submissions unaffected.

### F5 — No Content-Security-Policy [security, phased]
Only baseline headers exist today.
- Fix phase A (this pass): add a **report-only** CSP via `next.config.mjs` headers + a `/api/csp-report` sink that logs violations; run the full click-through (home, forms, admin) and attach the violation log.
- Phase B (only if zero violations): enforce the policy; document any `unsafe-inline` exceptions in `docs/DECISIONS.md` with justification.
- Done when: report-only header present on all routes, violation log reviewed in your report.

### F6 — Cache the hot read endpoints [performance]
`GET /api/events/home` and `GET /api/events` re-read JSON files on every hit.
- Fix: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` on both; verify admin mutations remain uncached and fresh (write-through is already immediate — prove a create→list round-trip in your test).
- Done when: repeat-request avg drops vs. the P1/P2 baseline above, with a create→list freshness check passing.

## 4. WORKFLOW RULES

1. One finding at a time: implement → `npx tsc --noEmit` → `npx vitest run` → targeted live check → commit (`fix: …`).
2. Recreate the battery as `platform/hard-test.mjs` (+ `-2.mjs` for the rate-burn half, run after a server restart for a fresh budget) and re-run the **full 26 checks** at the end. All must stay green.
3. Never weaken a check to make it pass (e.g., don't raise the default limit, don't delete the honeypot, don't skip validation).
4. Update `docs/DECISIONS.md` (any tradeoff), `docs/RUNBOOK.md` (new env vars), `.env.example` (new keys).
5. End with a report per finding: **what changed · files · commands + trimmed output · before/after numbers · residual risks**.

## 5. DEFINITION OF DONE

- [ ] F1–F6 implemented in priority order, each committed separately
- [ ] `tsc --noEmit` clean, Vitest all passing (add tests for: env-tunable limiter, 413 guard, slug/validation untouched)
- [ ] `npm run build` succeeds (run with the dev server **stopped** — never build while it runs)
- [ ] Full 26-check battery re-run, all green, with new before/after timing numbers quoted
- [ ] Docs updated (DECISIONS, RUNBOOK, `.env.example`)

## START NOW

Begin with F1 (smallest, proves your loop works), then proceed F2 → F6. If any finding turns out to be a false positive, prove it with a measurement and say so explicitly instead of "fixing" it.
