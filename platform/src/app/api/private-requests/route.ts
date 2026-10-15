import { NextResponse } from "next/server";
import { createPrivateRequest } from "@/lib/store";
import { privateRequestSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`prq:${clientIp(req.headers)}`);
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
  const parsed = privateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const d = parsed.data;
  const created = await createPrivateRequest({
    contactName: d.contactName,
    jobTitle: d.jobTitle,
    email: d.email,
    phone: d.phone,
    preferredContactMethod: d.preferredContactMethod,
    companyName: d.companyName,
    industry: d.industry,
    companyWebsite: d.companyWebsite,
    companySize: d.companySize,
    eventType: d.eventType,
    eventTypeOther: d.eventTypeOther,
    eventTitle: d.eventTitle,
    eventDescription: d.eventDescription,
    preferredDate: d.preferredDate,
    alternativeDate: d.alternativeDate,
    flexibleDate: d.flexibleDate,
    expectedGuests: d.expectedGuests,
    locationType: d.locationType,
    locationCity: d.locationCity,
    servicesNeeded: d.servicesNeeded,
    budgetRange: d.budgetRange,
    notes: d.notes,
    heardAboutUs: d.heardAboutUs,
    consentAt: new Date().toISOString(),
  });
  console.log(`[email:client] Request received → ${created.email} (${created.companyName})`);
  console.log(`[email:admin] New private request: ${created.eventType} for ${created.companyName}`);
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
