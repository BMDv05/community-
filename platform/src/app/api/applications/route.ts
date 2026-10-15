import { NextResponse } from "next/server";
import { createApplication, getEvents } from "@/lib/store";
import { joinApplicationSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`join:${clientIp(req.headers)}`);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ error: "Spam detected." }, { status: 400 });
  }
  const parsed = joinApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const d = parsed.data;
  const event = d.eventId ? (await getEvents()).find((e) => e.id === d.eventId) : undefined;
  const created = await createApplication({
    fullName: d.fullName,
    age: d.age,
    city: d.city ?? "",
    phone: d.phone,
    email: d.email,
    university: d.university,
    major: d.major,
    motivation: d.motivation,
    skill: d.skill,
    areas: [...d.areas],
    achievement: d.achievement,
    hours: d.hours,
    priorTeam: d.priorTeam,
    priorDetails: d.priorDetails,
    tools: d.tools,
    valueAdd: d.valueAdd,
    links: d.links,
    agreement: d.agreement,
    eventId: d.eventId,
    eventTitle: event?.title,
    registrationType: d.registrationType,
  });
  console.log(`[email:applicant] Application received → ${created.email} (${created.fullName})`);
  console.log(`[email:admin] New membership application: ${created.fullName} — ${created.areas.join(", ")}`);
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
