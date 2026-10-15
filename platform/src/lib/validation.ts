import { z } from "zod";

export const registrationSchema = z.discriminatedUnion("registrationType", [
  z.object({
    registrationType: z.literal("participant"),
    eventId: z.string().min(1, "Choose an event"),
    fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: z.string().trim().min(6, "Enter a valid phone").max(30),
    age: z.coerce.number().int().min(3).max(120).optional(),
    city: z.string().trim().max(80).optional(),
    numberOfAttendees: z.coerce.number().int().min(1).max(10).default(1),
    experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    specialRequirements: z.string().trim().max(1000).optional(),
    heardAboutUs: z.string().optional(),
    notes: z.string().trim().max(2000).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
    website: z.string().max(0).optional(), // honeypot
  }),
  z.object({
    registrationType: z.literal("volunteer"),
    eventId: z.string().min(1, "Choose an event"),
    fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: z.string().trim().min(6, "Enter a valid phone").max(30),
    age: z.coerce.number().int().min(12).max(120).optional(),
    city: z.string().trim().max(80).optional(),
    numberOfAttendees: z.coerce.number().int().min(1).max(1).default(1),
    volunteerRole: z.string().max(80).optional(),
    volunteerSkills: z.string().trim().max(1000).optional(),
    volunteerExperience: z.string().trim().max(2000).optional(),
    volunteerAvailability: z.array(z.string()).max(10).optional(),
    tshirtSize: z.enum(["S", "M", "L", "XL", "XXL"]).optional(),
    emergencyContact: z.string().trim().max(160).optional(),
    heardAboutUs: z.string().optional(),
    notes: z.string().trim().max(2000).optional(),
    consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
    website: z.string().max(0).optional(),
  }),
]);

export const privateRequestSchema = z.object({
  contactName: z.string().trim().min(2).max(120),
  jobTitle: z.string().trim().max(120).optional(),
  email: z.string().trim().toLowerCase().email(),
  phone: z.string().trim().min(6).max(30),
  preferredContactMethod: z.enum(["Email", "Phone", "WhatsApp"]).optional(),
  companyName: z.string().trim().min(2).max(160),
  industry: z.string().trim().max(120).optional(),
  companyWebsite: z.string().trim().max(200).optional(),
  companySize: z.string().max(60).optional(),
  eventType: z.enum(["Company Event", "Shop Opening", "Exhibition", "Workshop for my team", "Other"]),
  eventTypeOther: z.string().trim().max(160).optional(),
  eventTitle: z.string().trim().max(160).optional(),
  eventDescription: z.string().trim().min(10, "Tell us a bit more (min 10 characters)").max(5000),
  preferredDate: z.string().refine((v) => {
    const t = new Date(v).getTime();
    return Number.isFinite(t) && t > Date.now();
  }, "Preferred date must be in the future"),
  alternativeDate: z.string().optional(),
  flexibleDate: z.coerce.boolean().default(false),
  expectedGuests: z.string().min(1, "Choose a guest range"),
  locationType: z.string().max(60).optional(),
  locationCity: z.string().trim().max(120).optional(),
  servicesNeeded: z.array(z.string()).max(20).default([]),
  budgetRange: z.string().max(80).optional(),
  notes: z.string().trim().max(5000).optional(),
  heardAboutUs: z.string().max(80).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  website: z.string().max(0).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type PrivateRequestInput = z.infer<typeof privateRequestSchema>;

// ---- Membership application (استمارة التقديم) — mirrors the Google Form ----

export const JOIN_AREAS = [
  "التنظيم.",
  "التصميم.",
  "التسويق.",
  "صناعة المحتوى",
  "العلاقات العامة",
  "التصوير.",
  "إدارة الفعاليات  Events",
  "التكنولوجيا",
  "التدريب والتعليم",
  "أي مكان أستطيع تقديم المساعدة فيه.....",
] as const;

export const JOIN_HOURS = [
  "ساعتين",
  "من 3 الى 4 ساعات",
  "من 5 الى 8 ساعات",
  "اكثر من 8 ساعات",
] as const;

export const JOIN_YES_NO = ["نعم", "لا"] as const;

const joinBase = z.object({
  fullName: z.string().trim().min(2, "الاسم مطلوب (حرفان على الأقل)").max(120),
  age: z.coerce.number().int().min(10, "العمر غير صالح").max(100, "العمر غير صالح"),
  city: z.string().trim().min(2, "المدينة مطلوبة").max(80),
  phone: z.string().trim().min(6, "رقم الهاتف غير صالح").max(30),
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صالح"),
  university: z.string().trim().max(160).optional(),
  major: z.string().trim().max(160).optional(),
  motivation: z.string().trim().min(10, "أخبرنا أكثر (10 أحرف على الأقل)").max(3000),
  skill: z.string().trim().min(2, "هذا الحقل مطلوب").max(2000),
  areas: z.array(z.enum(JOIN_AREAS)).min(1, "اختر مجالًا واحدًا على الأقل").max(10),
  achievement: z.string().trim().min(3, "هذا الحقل مطلوب").max(3000),
  hours: z.enum(JOIN_HOURS),
  priorTeam: z.enum(JOIN_YES_NO),
  priorDetails: z.string().trim().max(2000).optional(),
  tools: z.string().trim().min(2, "هذا الحقل مطلوب").max(2000),
  valueAdd: z.string().trim().min(10, "أخبرنا أكثر (10 أحرف على الأقل)").max(3000),
  links: z.string().trim().max(500).optional(),
  agreement: z.enum(JOIN_YES_NO),
  eventId: z.string().trim().max(80).optional(),
  eventTitle: z.string().trim().max(160).optional(),
  registrationType: z.enum(["participant", "volunteer"]).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const joinApplicationSchema = joinBase.superRefine((d, ctx) => {
  if (d.priorTeam === "نعم" && !d.priorDetails?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["priorDetails"], message: "يرجى ذكر مشاركتك السابقة باختصار" });
  }
});

export type JoinApplicationInput = z.infer<typeof joinApplicationSchema>;

const APP_FLOW: Record<string, string[]> = {
  new: ["contacted", "accepted", "rejected"],
  contacted: ["accepted", "rejected"],
  accepted: [],
  rejected: [],
};

export function canTransitionApplication(from: string, to: string): boolean {
  return APP_FLOW[from]?.includes(to) ?? false;
}

// ---- Domain rules (pure, unit-tested) ----

export function isUpcoming(endDatetime: string, status: string, now = new Date()): boolean {
  return status === "published" && new Date(endDatetime).getTime() >= now.getTime();
}

const REG_FLOW: Record<string, string[]> = {
  pending: ["confirmed", "waitlist", "cancelled"],
  confirmed: ["cancelled", "attended"],
  waitlist: ["confirmed", "cancelled"],
  cancelled: [],
  attended: [],
};

export function canTransitionRegistration(from: string, to: string): boolean {
  return REG_FLOW[from]?.includes(to) ?? false;
}

const REQ_FLOW: Record<string, string[]> = {
  new: ["in_review", "rejected", "cancelled"],
  in_review: ["contacted", "rejected", "cancelled"],
  contacted: ["quote_sent", "rejected", "cancelled"],
  quote_sent: ["confirmed", "rejected", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  rejected: [],
  cancelled: [],
};

export function canTransitionRequest(from: string, to: string): boolean {
  return REQ_FLOW[from]?.includes(to) ?? false;
}

export function slugify(title: string): string {
  return title.toLowerCase().trim()
    .replace(/['’]/g, "").replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 80);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
