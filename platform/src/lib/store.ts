import { promises as fs } from "fs";
import path from "path";
import type { CommunityEvent, Registration, PrivateRequest, JoinApplication, ApplicationStatus } from "@/lib/types";
import { seedEvents } from "@/lib/seed";
import { normalizeEmail, slugify } from "@/lib/validation";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf8");
}

export async function getEvents(): Promise<CommunityEvent[]> {
  const override = await readJson<CommunityEvent[]>("events.json", []);
  const base = override.length > 0 ? override : seedEvents;
  return base;
}

export async function saveEvents(events: CommunityEvent[]): Promise<void> {
  await writeJson("events.json", events);
}

/** Pure helper: build a unique URL slug for a title given existing slugs. */
export function uniqueSlug(title: string, existing: string[]): string {
  const base = slugify(title) || "event";
  if (!existing.includes(base)) return base;
  let i = 2;
  while (existing.includes(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export const COVER_THEMES = [
  "g-workshop-1", "g-workshop-2", "g-workshop-3",
  "g-event-1", "g-event-2", "g-lecture-1",
  "g-trip-1", "g-past-1", "g-past-2",
  "g-past-3", "g-past-4", "g-cancelled",
];

export async function createEvent(
  input: Omit<CommunityEvent, "id" | "slug">
): Promise<CommunityEvent> {
  const events = await getEvents();
  const event: CommunityEvent = {
    ...input,
    id: `ev_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    slug: uniqueSlug(input.title, events.map((e) => e.slug)),
  };
  events.push(event);
  await saveEvents(events);
  return event;
}

export async function updateEvent(
  id: string, patch: Partial<CommunityEvent>
): Promise<CommunityEvent | null> {
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) return null;
  // Slug stays stable after publishing (spec); regenerate only for drafts.
  if (patch.title && patch.title !== event.title && event.status === "draft") {
    event.slug = uniqueSlug(patch.title, events.filter((e) => e.id !== id).map((e) => e.slug));
  }
  // Never allow id/slug overwrite via patch.
  const { id: _dropId, slug: _dropSlug, ...safe } = patch;
  Object.assign(event, safe);
  await saveEvents(events);
  return event;
}

export async function deleteEvent(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) return { ok: false, error: "Event not found." };
  const [regs, apps] = await Promise.all([getRegistrations(), getApplications()]);
  const linked = regs.filter((r) => r.eventId === id).length + apps.filter((a) => a.eventId === id).length;
  // Events with history are archived (cancelled), never hard-deleted.
  if (linked > 0) return { ok: false, error: `Cannot delete: ${linked} application(s) linked to this event. Cancel it instead to preserve history.` };
  await saveEvents(events.filter((e) => e.id !== id));
  return { ok: true };
}

export function splitEvents(events: CommunityEvent[], now = new Date()) {
  const upcoming = events
    .filter((e) => e.status === "published" && new Date(e.endDatetime).getTime() >= now.getTime())
    .sort((a, b) => +new Date(a.startDatetime) - +new Date(b.startDatetime));
  const past = events
    .filter((e) => e.status === "published" && new Date(e.endDatetime).getTime() < now.getTime())
    .sort((a, b) => +new Date(b.startDatetime) - +new Date(a.startDatetime));
  return { upcoming, past };
}

export async function getRegistrations(): Promise<Registration[]> {
  return readJson<Registration[]>("registrations.json", []);
}

export async function countRegistrations(eventId: string, type?: string): Promise<number> {
  const all = await getRegistrations();
  return all.filter(
    (r) => r.eventId === eventId && (!type || r.registrationType === type) && r.status !== "cancelled"
  ).reduce((n, r) => n + (r.numberOfAttendees || 1), 0);
}

export type CreateRegistrationResult = { ok: true; registration: Registration } | { ok: false; error: string };

export async function createRegistration(input: Omit<Registration, "id" | "createdAt" | "status"> & { status?: Registration["status"] }): Promise<CreateRegistrationResult> {
  const events = await getEvents();
  const event = events.find((e) => e.id === input.eventId);
  if (!event) return { ok: false, error: "Event not found." };
  if (event.status === "cancelled") return { ok: false, error: "This event was cancelled." };
  if (event.status !== "published") return { ok: false, error: "This event is not open for registration." };
  if (new Date(event.endDatetime).getTime() < Date.now()) return { ok: false, error: "This event has ended." };
  if (input.registrationType === "participant" && !event.allowRegistration)
    return { ok: false, error: "Participant registration is not enabled for this event." };
  if (input.registrationType === "volunteer" && !event.allowVolunteers)
    return { ok: false, error: "Volunteering is not enabled for this event." };

  const email = normalizeEmail(input.email);
  const all = await getRegistrations();
  const dup = all.find(
    (r) => r.eventId === input.eventId && r.email === email && r.registrationType === input.registrationType && r.status !== "cancelled"
  );
  if (dup) return { ok: false, error: "You're already registered for this event." };

  // capacity (atomic in production via DB transaction — see prisma/schema.prisma)
  const cap = input.registrationType === "participant" ? event.capacity : event.volunteerCapacity;
  if (cap != null) {
    const used = all
      .filter((r) => r.eventId === input.eventId && r.registrationType === input.registrationType && r.status !== "cancelled")
      .reduce((n, r) => n + (r.numberOfAttendees || 1), 0);
    const need = input.registrationType === "participant" ? input.numberOfAttendees || 1 : 1;
    if (used + need > cap) return { ok: false, error: "This event is full." };
  }

  const reg: Registration = {
    ...input,
    email,
    id: `reg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    status: input.status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  all.push(reg);
  await writeJson("registrations.json", all);
  await appendOutbox("registration", reg.id, `New ${reg.registrationType} registration for ${event.title} — ${reg.fullName} <${reg.email}>`);
  return { ok: true, registration: reg };
}

export async function getPrivateRequests(): Promise<PrivateRequest[]> {
  return readJson<PrivateRequest[]>("private-requests.json", []);
}

export async function createPrivateRequest(
  input: Omit<PrivateRequest, "id" | "createdAt" | "updatedAt" | "status" | "attachments"> & { attachments?: string[] }
): Promise<PrivateRequest> {
  const all = await getPrivateRequests();
  const now = new Date().toISOString();
  const req: PrivateRequest = {
    ...input,
    attachments: input.attachments ?? [],
    id: `prq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  all.push(req);
  await writeJson("private-requests.json", all);
  await appendOutbox("private-request", req.id, `New private event request from ${req.companyName} — ${req.contactName} <${req.email}>`);
  return req;
}

export async function updateRegistrationStatus(id: string, status: Registration["status"]): Promise<boolean> {
  const all = await getRegistrations();
  const r = all.find((x) => x.id === id);
  if (!r) return false;
  r.status = status;
  await writeJson("registrations.json", all);
  return true;
}

export async function updatePrivateRequest(id: string, patch: Partial<PrivateRequest>): Promise<boolean> {
  const all = await getPrivateRequests();
  const r = all.find((x) => x.id === id);
  if (!r) return false;
  Object.assign(r, patch, { updatedAt: new Date().toISOString() });
  await writeJson("private-requests.json", all);
  return true;
}

async function appendOutbox(kind: string, refId: string, summary: string) {
  const outbox = await readJson<Array<Record<string, unknown>>>("outbox.json", []);
  outbox.push({ kind, refId, summary, at: new Date().toISOString(), sent: false });
  await writeJson("outbox.json", outbox);
  // Production: Resend worker drains outbox with retry. Dev: logged to console by API route.
}

export function spotsLeft(event: CommunityEvent, used: number): number | null {
  const cap = event.capacity;
  if (cap == null) return null;
  return Math.max(0, cap - used);
}

export async function getApplications(): Promise<JoinApplication[]> {
  return readJson<JoinApplication[]>("applications.json", []);
}

export async function createApplication(
  input: Omit<JoinApplication, "id" | "createdAt" | "status">
): Promise<JoinApplication> {
  const all = await getApplications();
  const app: JoinApplication = {
    ...input,
    status: "new",
    email: normalizeEmail(input.email),
    id: `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  all.push(app);
  await writeJson("applications.json", all);
  await appendOutbox("application", app.id, `New join application — ${app.fullName} <${app.email}> (${app.city})`);
  return app;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<boolean> {
  const all = await getApplications();
  const r = all.find((x) => x.id === id);
  if (!r) return false;
  r.status = status;
  await writeJson("applications.json", all);
  return true;
}
