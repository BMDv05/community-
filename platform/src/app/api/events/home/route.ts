import { NextResponse } from "next/server";
import { getEvents, splitEvents } from "@/lib/store";

export async function GET() {
  const events = await getEvents();
  const { upcoming, past } = splitEvents(events);
  return NextResponse.json({ upcoming: upcoming.slice(0, 6), past: past.slice(0, 6) });
}
