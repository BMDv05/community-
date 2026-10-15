import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "double-h-community", time: new Date().toISOString() });
}
