import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdmin } from "@/lib/admin-auth";
import { getEvents, createEvent, updateEvent, deleteEvent, COVER_THEMES } from "@/lib/store";

const eventBase = z.object({
  title: z.string().trim().min(2).max(160),
  type: z.enum(["workshop", "event", "lecture", "field_trip"]),
  shortDescription: z.string().trim().min(10).max(300),
  description: z.string().trim().min(10).max(8000),
  coverGradient: z.enum(COVER_THEMES as unknown as [string, ...string[]]).default("g-event-1"),
  coverImage: z.string().trim().max(500).optional(),
  startDatetime: z.string().refine((v) => Number.isFinite(new Date(v).getTime()), "Invalid start date"),
  endDatetime: z.string().refine((v) => Number.isFinite(new Date(v).getTime()), "Invalid end date"),
  locationName: z.string().trim().min(2).max(160),
  price: z.coerce.number().min(0).max(100000).default(0),
  capacity: z.coerce.number().int().min(1).max(100000).nullable().optional(),
  allowRegistration: z.coerce.boolean().default(true),
  allowVolunteers: z.coerce.boolean().default(false),
  speakerName: z.string().trim().max(160).optional(),
  status: z.enum(["draft", "published", "cancelled"]).default("draft"),
});

const eventSchema = eventBase.refine((d) => new Date(d.endDatetime).getTime() >= new Date(d.startDatetime).getTime(), {
  message: "End must be after start",
  path: ["endDatetime"],
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ items: await getEvents() });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = eventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const d = parsed.data;
  const created = await createEvent({
    title: d.title,
    type: d.type,
    shortDescription: d.shortDescription,
    description: d.description,
    coverGradient: d.coverGradient,
    startDatetime: new Date(d.startDatetime).toISOString(),
    endDatetime: new Date(d.endDatetime).toISOString(),
    locationName: d.locationName,
    price: d.price,
    capacity: d.capacity ?? null,
    coverImage: d.coverImage || undefined,
    volunteerCapacity: null,
    allowRegistration: d.allowRegistration,
    allowVolunteers: d.allowVolunteers,
    speakerName: d.speakerName || undefined,
    status: d.status,
  });
  return NextResponse.json({ ok: true, event: created }, { status: 201 });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (!body.id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const parsed = eventBase.partial().safeParse(body.patch ?? {});
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const patch = { ...parsed.data } as Record<string, unknown>;
  // Normalize flags the form sends as "reg" | "vol" | "both".
  if (typeof body.mode === "string") {
    if (body.mode === "vol") { patch.allowRegistration = false; patch.allowVolunteers = true; }
    else if (body.mode === "reg") { patch.allowRegistration = true; patch.allowVolunteers = false; }
  }
  if (patch.startDatetime) patch.startDatetime = new Date(String(patch.startDatetime)).toISOString();
  if (patch.endDatetime) patch.endDatetime = new Date(String(patch.endDatetime)).toISOString();
  const updated = await updateEvent(String(body.id), patch as never);
  if (!updated) return NextResponse.json({ error: "Event not found." }, { status: 404 });
  return NextResponse.json({ ok: true, event: updated });
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const result = await deleteEvent(id);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 409 });
  return NextResponse.json({ ok: true });
}
