export type EventType = "workshop" | "event" | "lecture" | "field_trip";
export type EventStatus = "draft" | "published" | "cancelled";

export interface CommunityEvent {
  id: string;
  title: string;
  titleAr?: string;
  slug: string;
  type: EventType;
  shortDescription: string;
  shortDescriptionAr?: string;
  description: string;
  coverGradient: string; // css gradient key (fallback when no uploaded picture)
  coverImage?: string; // uploaded picture URL (/uploads/...)
  startDatetime: string; // ISO UTC
  endDatetime: string;   // ISO UTC
  locationName: string;
  locationAddress?: string;
  mapUrl?: string;
  price: number; // 0 = free
  capacity: number | null;
  volunteerCapacity: number | null;
  allowRegistration: boolean;
  allowVolunteers: boolean;
  speakerName?: string;
  status: EventStatus;
  isFeatured?: boolean;
}

export type RegistrationType = "participant" | "volunteer";
export type RegistrationStatus = "pending" | "confirmed" | "waitlist" | "cancelled" | "attended";

export interface Registration {
  id: string;
  eventId: string;
  registrationType: RegistrationType;
  fullName: string;
  email: string; // normalized lowercase
  phone: string;
  age?: number;
  city?: string;
  numberOfAttendees: number;
  experienceLevel?: string;
  specialRequirements?: string;
  volunteerRole?: string;
  volunteerSkills?: string;
  volunteerExperience?: string;
  volunteerAvailability?: string[];
  tshirtSize?: string;
  emergencyContact?: string;
  heardAboutUs?: string;
  notes?: string;
  consentAt: string;
  status: RegistrationStatus;
  createdAt: string;
}

export type PrivateRequestStatus =
  | "new" | "in_review" | "contacted" | "quote_sent" | "confirmed" | "completed" | "rejected" | "cancelled";
export interface PrivateRequest {
  id: string;
  contactName: string;
  jobTitle?: string;
  email: string;
  phone: string;
  preferredContactMethod?: string;
  companyName: string;
  industry?: string;
  companyWebsite?: string;
  companySize?: string;
  eventType: string;
  eventTypeOther?: string;
  eventTitle?: string;
  eventDescription: string;
  preferredDate: string;
  alternativeDate?: string;
  flexibleDate: boolean;
  expectedGuests: string;
  locationType?: string;
  locationCity?: string;
  servicesNeeded: string[];
  budgetRange?: string;
  attachments: string[];
  notes?: string;
  heardAboutUs?: string;
  consentAt: string;
  status: PrivateRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  workshop: "Workshop",
  event: "Event",
  lecture: "Lecture",
  field_trip: "Field Trip",
};

export const EVENT_TYPE_LABEL_AR: Record<EventType, string> = {
  workshop: "ورشة عمل",
  event: "فعالية",
  lecture: "محاضرة",
  field_trip: "رحلة ميدانية",
};

// ---- Membership / team application (استمارة التقديم, mirrored from Google Form) ----

export type ApplicationStatus = "new" | "contacted" | "accepted" | "rejected";

export interface JoinApplication {
  id: string;
  fullName: string;
  age: number;
  city: string;
  phone: string;
  email: string;
  university?: string;
  major?: string;
  motivation: string;
  skill: string;
  areas: string[];
  achievement: string;
  hours: string;
  priorTeam: string;
  priorDetails?: string;
  tools: string;
  valueAdd: string;
  links?: string;
  agreement: string;
  eventId?: string;
  eventTitle?: string;
  registrationType?: string;
  status: ApplicationStatus;
  createdAt: string;
}
