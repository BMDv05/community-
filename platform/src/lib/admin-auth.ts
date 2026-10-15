import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE = "dh_admin";

function secret(): string {
  return process.env.ADMIN_SECRET || "dev-secret-change-me";
}

export function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const v = jar.get(COOKIE)?.value;
  return v === sign("admin");
}

export async function adminLoginResponse(ok: boolean) {
  const { NextResponse } = await import("next/server");
  if (!ok) return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sign("admin"), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 8,
  });
  return res;
}

export async function adminLogoutResponse() {
  const { NextResponse } = await import("next/server");
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(COOKIE);
  return res;
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = (process.env.ADMIN_EMAIL || "admin@doubleh.community").toLowerCase();
  const expectedPass = process.env.ADMIN_PASSWORD || "DoubleH123!";
  const a = Buffer.from(email.toLowerCase().padEnd(64, " "));
  const b = Buffer.from(expectedEmail.padEnd(64, " "));
  const emailOk = a.length === b.length && crypto.timingSafeEqual(a, b) && email.toLowerCase() === expectedEmail;
  const c = Buffer.from(password.padEnd(64, " "));
  const d = Buffer.from(expectedPass.padEnd(64, " "));
  const passOk = c.length === d.length && crypto.timingSafeEqual(c, d) && password === expectedPass;
  return emailOk && passOk;
}
