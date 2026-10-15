import { NextResponse } from "next/server";
import { getEvents, splitEvents, countRegistrations } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const tab = searchParams.get("status") ?? searchParams.get("tab") ?? "upcoming";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") ?? "9")));

  const events = await getEvents();
  const { upcoming, past } = splitEvents(events);
  let list = tab === "past" ? past : upcoming;
  if (type) list = list.filter((e) => e.type === type);

  const total = list.length;
  const items = list.slice((page - 1) * limit, page * limit);

  const withCounts = await Promise.all(
    items.map(async (e) => ({
      ...e,
      registered: await countRegistrations(e.id, "participant"),
      volunteers: await countRegistrations(e.id, "volunteer"),
    }))
  );

  return NextResponse.json({ items: withCounts, total, page, limit, pages: Math.ceil(total / limit) });
}
