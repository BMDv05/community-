import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getRegistrations, getApplications } from "@/lib/store";

function csvCell(v: unknown): string {
  const s = Array.isArray(v) ? v.join("; ") : String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const kind = new URL(req.url).searchParams.get("kind") ?? "registrations";
  if (kind === "applications") {
    const apps = await getApplications();
    const header = ["id", "fullName", "age", "city", "phone", "email", "university", "major", "motivation", "skill", "areas", "achievement", "hours", "priorTeam", "priorDetails", "tools", "valueAdd", "links", "agreement", "eventId", "eventTitle", "registrationType", "status", "createdAt"];
    const lines = [header.join(",")].concat(
      apps.map((r) =>
        [r.id, r.fullName, r.age, r.city, r.phone, r.email, r.university, r.major, r.motivation, r.skill, r.areas, r.achievement, r.hours, r.priorTeam, r.priorDetails, r.tools, r.valueAdd, r.links, r.agreement, r.eventId, r.eventTitle, r.registrationType, r.status, r.createdAt]
          .map(csvCell).join(",")
      )
    );
    return new NextResponse(lines.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=applications.csv",
      },
    });
  }
  const regs = await getRegistrations();
  const header = ["id", "eventId", "type", "fullName", "email", "phone", "city", "attendees", "status", "createdAt"];
  const lines = [header.join(",")].concat(
    regs.map((r) =>
      [r.id, r.eventId, r.registrationType, r.fullName, r.email, r.phone, r.city, r.numberOfAttendees, r.status, r.createdAt]
        .map(csvCell).join(",")
    )
  );
  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=registrations.csv",
    },
  });
}
