// Simple in-memory rate limiter (5 mutations / hour / IP).
// Production: replace with Upstash Ratelimit (see docs/RUNBOOK.md).

const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 5, windowMs = 3600_000): { ok: boolean; remaining: number } {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) {
    hits.set(key, arr);
    return { ok: false, remaining: 0 };
  }
  arr.push(now);
  hits.set(key, arr);
  return { ok: true, remaining: limit - arr.length };
}

export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
