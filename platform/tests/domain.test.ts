import { describe, it, expect } from "vitest";
import {
  isUpcoming, canTransitionRegistration, canTransitionRequest, canTransitionApplication,
  slugify, normalizeEmail, registrationSchema, privateRequestSchema, joinApplicationSchema,
} from "@/lib/validation";
import { uniqueSlug } from "@/lib/store";

describe("upcoming/past computation", () => {
  it("treats future published events as upcoming", () => {
    expect(isUpcoming(new Date(Date.now() + 3600_000).toISOString(), "published")).toBe(true);
  });
  it("moves ended events to past", () => {
    expect(isUpcoming(new Date(Date.now() - 1000).toISOString(), "published")).toBe(false);
  });
  it("excludes drafts and cancelled", () => {
    const f = new Date(Date.now() + 3600_000).toISOString();
    expect(isUpcoming(f, "draft")).toBe(false);
    expect(isUpcoming(f, "cancelled")).toBe(false);
  });
});

describe("status machines", () => {
  it("allows pending → confirmed, rejects confirmed → pending", () => {
    expect(canTransitionRegistration("pending", "confirmed")).toBe(true);
    expect(canTransitionRegistration("confirmed", "pending")).toBe(false);
  });
  it("walks the private-request pipeline", () => {
    expect(canTransitionRequest("new", "in_review")).toBe(true);
    expect(canTransitionRequest("new", "completed")).toBe(false);
    expect(canTransitionRequest("quote_sent", "confirmed")).toBe(true);
  });
});

describe("join application schema (استمارة التقديم)", () => {
  const base = {
    fullName: "Layla Haddad",
    age: 21,
    city: "Beirut",
    phone: "+96170000000",
    email: "layla@example.com",
    motivation: "أرغب بالتعلم وخدمة المجتمع من خلال الفعاليات.",
    skill: "التصميم وصناعة المحتوى",
    areas: ["التصميم.", "صناعة المحتوى"],
    achievement: "نظمت بازارًا خيريًا في جامعتي",
    hours: "من 3 الى 4 ساعات",
    priorTeam: "نعم",
    priorDetails: "نادي التصوير في الجامعة",
    tools: "Photoshop و Canva",
    valueAdd: "أساعد في التصميم والتغطية الإعلامية للفعاليات.",
    agreement: "نعم",
  };
  it("accepts a complete application", () => {
    expect(joinApplicationSchema.safeParse(base).success).toBe(true);
  });
  it("requires prior details when prior team is yes", () => {
    const r = joinApplicationSchema.safeParse({ ...base, priorDetails: "" });
    expect(r.success).toBe(false);
  });
  it("skips prior details when prior team is no", () => {
    const r = joinApplicationSchema.safeParse({ ...base, priorTeam: "لا", priorDetails: undefined });
    expect(r.success).toBe(true);
  });
  it("requires at least one contribution area", () => {
    expect(joinApplicationSchema.safeParse({ ...base, areas: [] }).success).toBe(false);
  });
  it("rejects invalid area values", () => {
    expect(joinApplicationSchema.safeParse({ ...base, areas: ["Hacking"] }).success).toBe(false);
  });
  it("walks the application pipeline", () => {
    expect(canTransitionApplication("new", "contacted")).toBe(true);
    expect(canTransitionApplication("new", "accepted")).toBe(true);
    expect(canTransitionApplication("contacted", "accepted")).toBe(true);
    expect(canTransitionApplication("accepted", "contacted")).toBe(false);
  });
});

describe("upload validation", () => {
  it("sniffs PNG/JPEG/WEBP/GIF magic bytes", async () => {
    const { detectImageExt, validateImageUpload } = await import("@/lib/uploads");
    expect(detectImageExt(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d]))).toBe("png");
    expect(detectImageExt(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpg");
    expect(detectImageExt(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))).toBe("webp");
    expect(detectImageExt(new Uint8Array([0x25, 0x50, 0x44, 0x46]))).toBe(null);
    expect(validateImageUpload(Buffer.from([0x89, 0x50, 0x4e, 0x47]), "image/png").ok).toBe(true);
    expect(validateImageUpload(Buffer.from([0x25, 0x50, 0x44, 0x46]), "application/pdf").ok).toBe(false);
    expect(validateImageUpload(Buffer.alloc(6 * 1024 * 1024), "image/png").ok).toBe(false);
  });
});

describe("slug + email", () => {
  it("slugifies titles", () => {
    expect(slugify("Pottery Basics: Shape Your First Bowl!")).toBe("pottery-basics-shape-your-first-bowl");
  });
  it("normalizes email", () => {
    expect(normalizeEmail("  LAYLA@Example.COM ")).toBe("layla@example.com");
  });
  it("makes slugs unique", () => {
    expect(uniqueSlug("Test Event", [])).toBe("test-event");
    expect(uniqueSlug("Test Event", ["test-event"])).toBe("test-event-2");
    expect(uniqueSlug("Test Event", ["test-event", "test-event-2"])).toBe("test-event-3");
  });
});

describe("schemas", () => {
  it("accepts a participant registration", () => {
    const r = registrationSchema.safeParse({
      registrationType: "participant", eventId: "e1", fullName: "Layla H",
      email: "layla@x.com", phone: "+96170000000", consent: true,
    });
    expect(r.success).toBe(true);
  });
  it("rejects volunteer without consent", () => {
    const r = registrationSchema.safeParse({
      registrationType: "volunteer", eventId: "e1", fullName: "Omar H",
      email: "omar@x.com", phone: "+96170000000",
    });
    expect(r.success).toBe(false);
  });
  it("rejects past preferred dates", () => {
    const r = privateRequestSchema.safeParse({
      contactName: "AB", email: "a@b.com", phone: "+96170000000", companyName: "Co",
      eventType: "Exhibition", eventDescription: "A sufficiently long description here.",
      preferredDate: "2000-01-01", expectedGuests: "20–50", consent: true,
    });
    expect(r.success).toBe(false);
  });
});
