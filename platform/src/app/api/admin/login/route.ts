import { NextResponse } from "next/server";
import { checkCredentials, adminLoginResponse, adminLogoutResponse } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`login:${clientIp(req.headers)}`, 10, 3600_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const ok = checkCredentials(String(body.email ?? ""), String(body.password ?? ""));
  // progressive-lockout hook point (production: Upstash + audit log)
  return adminLoginResponse(ok);
}

export async function DELETE() {
  return adminLogoutResponse();
}
