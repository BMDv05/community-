# Decisions (ADR style)

## 1. JSON file store for MVP, Prisma schema ready for production
- **Context:** Master prompt mandates Postgres + Prisma. Local Postgres setup blocks a 5-minute demo.
- **Decision:** Ship `src/lib/store.ts` (JSON files) enforcing identical rules (unique `(eventId,email,type)`, capacity check, eligibility, status machines) + full `prisma/schema.prisma` for Postgres migration.
- **Consequence:** Concurrent capacity races are best-effort locally; production MUST use the Prisma schema with serializable transactions. Documented in RUNBOOK.

## 2. Custom i18n instead of next-intl
- **Context:** Spec asks next-intl with full RTL.
- **Decision:** Lightweight dictionary + provider (no extra dep, instant toggle, persisted).
- **Consequence:** Same UX (EN/AR, RTL, localized strings); message files live in `src/lib/i18n.ts`. Migration to next-intl is straightforward if ICU/plural needs grow.

## 3. Cookie HMAC session instead of Auth.js
- **Context:** Spec asks Auth.js + bcrypt + RBAC.
- **Decision:** Single-admin HMAC-signed httpOnly cookie for MVP; RBAC check on every admin route; credentials via env.
- **Consequence:** Add Auth.js + `admins` table (already in Prisma schema) when multi-admin is needed.

## 4. Stubbed email outbox instead of Resend
- **Decision:** Append to `data/outbox.json` + console log; templates mirror the spec's trigger table.
- **Consequence:** No lost registrations (outbox survives failure); wire Resend in production.

## 5. In-memory rate limit + honeypot instead of Upstash/Turnstile
- **Decision:** 5/hour/IP in-memory + `website` honeypot field now; Turnstile/Upstash keys wired via env later.
- **Consequence:** Single-instance safe; use Upstash for multi-instance prod.

## 6. Theme tokens from brand palette
- Deep `#12393a` (headers/footer/primary buttons), Pine `#134c4b` (CTAs), Mist `#e6ecec` (backgrounds), Sage `#46766f` (accents/badges), Ink `#161919` (text). Type badges tinted within palette for contrast in both modes.
