import { NextResponse } from "next/server";
import { createRegistration } from "@/lib/store";
import { registrationSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const rl = rateLimit(`reg:${clientIp(req.headers)}`);
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
  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed.", issues: parsed.error.flatten() }, { status: 422 });
  }
  const d = parsed.data;
  const result = await createRegistration({
    eventId: d.eventId,
    registrationType: d.registrationType,
    fullName: d.fullName,
    email: d.email,
    phone: d.phone,
    age: (d as { age?: number }).age,
    city: (d as { city?: string }).city,
    numberOfAttendees: (d as { numberOfAttendees?: number }).numberOfAttendees ?? 1,
    experienceLevel: (d as { experienceLevel?: string }).experienceLevel,
    specialRequirements: (d as { specialRequirements?: string }).specialRequirements,
    volunteerRole: (d as { volunteerRole?: string }).volunteerRole,
    volunteerSkills: (d as { volunteerSkills?: string }).volunteerSkills,
    volunteerExperience: (d as { volunteerExperience?: string }).volunteerExperience,
    volunteerAvailability: (d as { volunteerAvailability?: string[] }).volunteerAvailability,
    tshirtSize: (d as { tshirtSize?: string }).tshirtSize,
    emergencyContact: (d as { emergencyContact?: string }).emergencyContact,
    heardAboutUs: (d as { heardAboutUs?: string }).heardAboutUs,
    notes: (d as { notes?: string }).notes,
    consentAt: new Date().toISOString(),
  });
  if (!result.ok) {
    const status = result.error.includes("already registered") ? 409 : result.error.includes("full") ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }
  console.log(`[email:user] Confirmation → ${result.registration.email} for event ${result.registration.eventId}`);
  console.log(`[email:admin] New ${result.registration.registrationType} registration: ${result.registration.fullName}`);
  return NextResponse.json({ ok: true, id: result.registration.id }, { status: 201 });
}

export async function GET() {
  // Public must not list PII. Admin uses /api/admin endpoints.
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
