# 📘 Documentation — Community Website for Events / Workshops / Lectures / Field Trips

> This document describes the website in detail (concept, pages, forms, data, admin panel, and flows) so you can build it step by step.
> Items marked **(Assumption)** are decisions I made because they weren't specified in the brief. You can change them freely. The final section, **Open Questions**, lists what you should decide before starting.

---

## 1. Overview

### 1.1 What is the website?
A community website that organizes and manages:

| Type | Description |
|---|---|
| **Workshops** | Interactive hands-on sessions (participant registration) |
| **Events** | General events (volunteering and/or attendance) |
| **Lectures** | Talks and lectures |
| **Field Trips** | Guided trips outside the venue |

### 1.2 The additional service (B2B)
Any **business owner or shop owner** can ask us to organize a **private event for them**, for example:
- A company event.
- A shop opening.
- An exhibition.
- Any other occasion.

### 1.3 Main goals
1. Present upcoming and past events clearly and attractively.
2. Let visitors **register for a workshop** or **volunteer at an event** easily.
3. Let businesses **request a private event** through a form.
4. Let the admin manage everything (events, requests, registrations).

---

## 2. User Roles

| Role | Permissions |
|---|---|
| **Visitor** | Browses pages, views events, fills in forms. **No account required** (Assumption). |
| **Participant** | A visitor who registered for a Workshop / Lecture / Field Trip. |
| **Volunteer** | A visitor who applied to volunteer at an Event. |
| **Business Client** | A person/company who submitted a private event request. |
| **Admin** | Logs in and manages all content and requests. |

> **(Assumption):** Regular users don't need to create an account or log in. They just fill in the form and receive a confirmation email. Only admins log in to the dashboard.

---

## 3. Site Map

```
/                           → Home Page
├── /workshops              → Workshops list
│     └── /workshops/:slug  → Workshop details
├── /events                 → Events list
│     └── /events/:slug     → Event details
├── /lectures               → Lectures list
│     └── /lectures/:slug   → Lecture details
├── /field-trips            → Field trips list
│     └── /field-trips/:slug→ Field trip details
├── /register               → Form 1: Registration / Volunteering
├── /request-event          → Form 2: Private event request
├── /about                  → (Optional) About us
├── /contact                → (Optional) Contact us
└── /admin                  → Admin dashboard (login required)
```

---

## 4. Navigation Bar

Displayed **at the top of every page** (sticky — stays visible while scrolling).

### 4.1 Items in order

```
[Logo]   Home | Workshops | Events | Lectures | Field Trips      [Register / Volunteer] [Request an Event]
```

| Item | Link | Notes |
|---|---|---|
| Logo | `/` | Goes to Home |
| Home | `/` | |
| Workshops | `/workshops` | |
| Events | `/events` | |
| Lectures | `/lectures` | |
| Field Trips | `/field-trips` | |
| **Register / Volunteer** button | `/register` | Primary button |
| **Request an Event** button | `/request-event` | Secondary (outline) button |

### 4.2 Behavior
- The current page's item is **Active** (different color / underline).
- On mobile: the bar collapses into a **hamburger menu** (☰) with a vertical dropdown; the two buttons appear at the bottom of the menu.
- The logo must remain visible on mobile.

---

## 5. Home Page

Top to bottom:

### 5.1 Navbar
(See section 4)

### 5.2 Hero Section
- A strong headline (e.g., "Learn. Volunteer. Celebrate. Together.").
- A short sentence describing the community.
- **Two large buttons (the Two Main Buttons)** 👇

| Button | Goes to | Purpose |
|---|---|---|
| 🟢 **Register / Volunteer** | `/register` | For people who want to register for a workshop or volunteer at an event |
| 🔵 **Request a Private Event** | `/request-event` | For business/shop owners who want their own event |

- Background image/video (optional).

### 5.3 Upcoming Events section ⬅️ **First section**
- Heading: **Upcoming Events**
- Shows **cards** for upcoming events only (date ≥ today).
- Sorted **nearest to farthest**.
- Shows the first **6** events (Assumption) + a **"View All"** button.
- Each card contains:
  - Event image
  - Type badge (Workshop / Event / Lecture / Field Trip), a different color per type
  - Title
  - Date and time
  - Location
  - Remaining spots (if the event has a capacity), e.g. `12 spots left`
  - **"Details"** button + **"Register"** or **"Volunteer"** button depending on the event (see section 7.4)

### 5.4 Past Events section ⬅️ **Second section**
- Heading: **Past Events**
- Shows events that have **ended** (date < today).
- Sorted **newest to oldest**.
- Shows the first **6** + a **"View All"** button.
- Cards look like the Upcoming ones, but:
  - **No Register/Volunteer button**.
  - A `Completed` badge.
  - A **"View Gallery"** / **"Details"** button (opens the event page with photos and a recap).

### 5.5 Categories section — optional
Four large cards: Workshops / Events / Lectures / Field Trips, each linking to its page.

### 5.6 "Want your own event?" CTA — optional
A banner explaining the private event service with a `Request a Private Event` button.

### 5.7 Footer
- Quick links.
- Contact information.
- Social media.
- Copyright.

---

## 6. Category Pages (Workshops / Events / Lectures / Field Trips)

All four pages share the **same layout**; only the type filter differs.

### 6.1 Page structure
1. Section title + short description.
2. **Tabs:** `Upcoming` | `Past`
3. Card grid: 3 columns on desktop, 2 on tablet, 1 on mobile.
4. **Pagination** or "Load More" (Assumption: 9 cards per page).
5. (Optional) Search + filter by date/city.

### 6.2 Rules
- `/workshops` → only events with `type = workshop`.
- `/events` → only events with `type = event`.
- `/lectures` → only events with `type = lecture`.
- `/field-trips` → only events with `type = field_trip`.

---

## 7. Event Details Page

### 7.1 Content
- Large cover image.
- Type badge + status badge (`Upcoming` / `Full` / `Completed` / `Cancelled`).
- Title.
- Quick info: date, time, duration, location (with map link), price (free/paid), remaining spots.
- Full description.
- Speaker / instructor / organizer (if any).
- Agenda / schedule (optional).
- Gallery (mainly for past events).
- Sticky sidebar containing the action button.

### 7.2 Call-to-action button by type and status

| Situation | Button |
|---|---|
| Upcoming workshop with spots available | **Register for this Workshop** |
| Upcoming event with volunteering enabled | **Volunteer for this Event** |
| Upcoming event/lecture/field trip with registration enabled | **Register** |
| No spots left | Disabled button: **Full** (+ optional "Join Waitlist") |
| Event has ended | No button, just a `Completed` badge + gallery |
| Event cancelled | No button, `Cancelled` badge |

### 7.3 Linking to the form
When the user clicks the button, they go to `/register?event=<event_id>&type=attendee` or `type=volunteer`.
The form opens with the event and type **pre-selected**.

### 7.4 Registration/volunteering rules per event (Assumption, changeable)
Each event has two flags that control what's allowed:

| Field | Meaning |
|---|---|
| `allow_registration` | Users can register as participants |
| `allow_volunteers` | Users can volunteer |

Default setup by type:

| Type | Registration | Volunteers |
|---|---|---|
| Workshop | ✅ | ❌ |
| Event | ❌ (or ✅ if you want) | ✅ |
| Lecture | ✅ | ❌ |
| Field Trip | ✅ | ❌ |

The admin can change these for any individual event.

---

## 8. Form 1 — Workshop Registration / Event Volunteering 🟢

**URL:** `/register`
**Purpose:** Let the user sign up as a **participant** or a **volunteer**.

### 8.1 Flow
```
User clicks "Register / Volunteer"
        ↓
/register opens
        ↓
User chooses: [ ○ Register as Participant ]  [ ○ Volunteer ]
        ↓
User picks the event from a dropdown (only upcoming events open for the chosen type)
        ↓
User fills in the fields
        ↓
Submit
        ↓
Validation + save to database
        ↓
"Thank You" page + confirmation email + email to admin
```

### 8.2 Fields

#### A) Shared fields (both types)

| Field | Type | Required | Notes |
|---|---|---|---|
| Registration Type | Radio | ✅ | `Participant` or `Volunteer` |
| Event | Select | ✅ | List changes based on the chosen type. Auto-filled when coming from an event page |
| Full Name | Text | ✅ | Minimum 2 characters |
| Email | Email | ✅ | Format validation |
| Phone | Tel | ✅ | With country code |
| Age / Date of Birth | Number/Date | ⬜ | (Assumption: Age) |
| City | Text | ⬜ | |
| How did you hear about us? | Select | ⬜ | Social Media / Friend / Website / Other |
| Notes | Textarea | ⬜ | Any notes |
| Consent Checkbox | Checkbox | ✅ | Agree to the privacy policy |

#### B) Extra fields shown **only if Participant is selected**

| Field | Type | Required |
|---|---|---|
| Number of Attendees | Number | ⬜ (Assumption: 1) |
| Experience Level | Select (Beginner/Intermediate/Advanced) | ⬜ |
| Special Requirements / Accessibility | Textarea | ⬜ |

#### C) Extra fields shown **only if Volunteer is selected**

| Field | Type | Required |
|---|---|---|
| Preferred Role | Select | ⬜ (Registration Desk / Logistics / Media / Guest Support / Setup & Cleanup / Any) |
| Skills | Textarea / Tags | ⬜ |
| Previous Volunteering Experience | Textarea | ⬜ |
| Availability | Checkbox (Setup day / Event day / Cleanup) | ⬜ |
| T-shirt Size | Select (S/M/L/XL/XXL) | ⬜ |
| Emergency Contact (Name + Phone) | Text | ⬜ |

### 8.3 Validation rules
- Prevent duplicate registration: the same **Email + Event + Type** isn't accepted twice → message: *"You're already registered for this event."*
- If the event reached `capacity` → message: *"This event is full."* (or add to a waitlist).
- If the event has ended or is cancelled, it doesn't appear in the dropdown.
- Required fields can't be skipped.
- Spam protection: **reCAPTCHA / hCaptcha / honeypot** (Assumption: honeypot + rate limit).

### 8.4 After submit
1. Save to the `registrations` table with status `pending` (or `confirmed` if you want automatic confirmation).
2. Thank-you page: *"Thank you! We've received your registration for [Event Name]."*
3. Email to the user with event details.
4. Email/notification to the admin.

---

## 9. Form 2 — Private Event Request 🔵

**URL:** `/request-event`
**Purpose:** A business/shop owner asks us to organize a private event for them.

### 9.1 Flow
```
Business clicks "Request a Private Event"
        ↓
/request-event opens
        ↓
Business fills in the form (split into sections / steps)
        ↓
Submit
        ↓
Validation + save
        ↓
Thank You page ("We'll contact you within 48 hours")
        ↓
Confirmation email to client + notification to admin
```

### 9.2 Fields — grouped by section

#### Section 1: Contact Info

| Field | Type | Required |
|---|---|---|
| Contact Person Name | Text | ✅ |
| Position / Job Title | Text | ⬜ |
| Email | Email | ✅ |
| Phone | Tel | ✅ |
| Preferred Contact Method | Radio (Email / Phone / WhatsApp) | ⬜ |

#### Section 2: Company Info

| Field | Type | Required |
|---|---|---|
| Company / Business Name | Text | ✅ |
| Industry | Select / Text | ⬜ |
| Website / Instagram | URL | ⬜ |
| Company Size | Select | ⬜ |

#### Section 3: Event Details

| Field | Type | Required | Notes |
|---|---|---|---|
| Event Type | Select | ✅ | `Company Event` / `Shop Opening` / `Exhibition` / `Workshop for my team` / `Other` |
| Other (specify) | Text | ⬜ | Shown if Other is selected |
| Event Title / Idea | Text | ⬜ | |
| Event Description | Textarea | ✅ | What exactly they want |
| Preferred Date | Date | ✅ | |
| Alternative Date | Date | ⬜ | |
| Flexible on Date? | Checkbox | ⬜ | |
| Expected Number of Guests | Number / Range | ✅ | 1–20 / 20–50 / 50–100 / 100+ |
| Location Type | Radio | ⬜ | `Their Venue` / `We Suggest a Venue` / `Not Sure` |
| Location / City | Text | ⬜ | |

#### Section 4: Services Needed — checkboxes

- ☐ Full Event Planning & Management
- ☐ Venue Sourcing
- ☐ Catering
- ☐ Decoration & Setup
- ☐ Entertainment / Speakers
- ☐ Photography / Videography
- ☐ Marketing & Promotion
- ☐ Volunteers / Staff
- ☐ Other

#### Section 5: Budget & Attachments

| Field | Type | Required |
|---|---|---|
| Budget Range | Select | ⬜ (Under X / X–Y / Y+ / Not sure) |
| Attachments | File Upload (PDF/JPG/PNG, max 10MB) | ⬜ |
| Additional Notes | Textarea | ⬜ |
| How did you hear about us? | Select | ⬜ |
| Consent Checkbox | Checkbox | ✅ |

### 9.3 Validation rules
- The preferred date must be **in the future**.
- Email and phone must be in a valid format.
- File size and type must be within limits.
- Spam protection same as Form 1.

### 9.4 Request statuses — visible to admin only

```
new → in_review → contacted → quote_sent → confirmed → completed
                                    ↓
                              rejected / cancelled
```

---

## 10. Database (Data Model)

### 10.1 `events` table

| Field | Type | Notes |
|---|---|---|
| id | UUID / INT (PK) | |
| title | string | |
| slug | string (unique) | For the URL |
| type | enum | `workshop` / `event` / `lecture` / `field_trip` |
| short_description | string | Shown on the card |
| description | text (rich) | |
| cover_image | string (URL) | |
| gallery | array/json | Extra images |
| start_datetime | datetime | |
| end_datetime | datetime | |
| location_name | string | |
| location_address | string | |
| map_url | string | |
| price | decimal | 0 = Free |
| capacity | int (nullable) | null = no limit |
| volunteer_capacity | int (nullable) | |
| allow_registration | boolean | |
| allow_volunteers | boolean | |
| speaker_name | string (nullable) | Lecturer / instructor |
| status | enum | `draft` / `published` / `cancelled` |
| is_featured | boolean | |
| created_at / updated_at | datetime | |

> **Important:** Whether an event is "Upcoming" or "Past" is **not stored** in the database. It's computed automatically:
> - Upcoming: `end_datetime >= NOW()` and `status = published`
> - Past: `end_datetime < NOW()` and `status = published`

### 10.2 `registrations` table

| Field | Type |
|---|---|
| id | PK |
| event_id | FK → events |
| registration_type | enum (`participant` / `volunteer`) |
| full_name | string |
| email | string |
| phone | string |
| age | int (nullable) |
| city | string (nullable) |
| number_of_attendees | int (default 1) |
| experience_level | string (nullable) |
| special_requirements | text (nullable) |
| volunteer_role | string (nullable) |
| volunteer_skills | text (nullable) |
| volunteer_experience | text (nullable) |
| volunteer_availability | json (nullable) |
| tshirt_size | string (nullable) |
| emergency_contact | string (nullable) |
| heard_about_us | string (nullable) |
| notes | text (nullable) |
| status | enum (`pending` / `confirmed` / `waitlist` / `cancelled` / `attended`) |
| created_at | datetime |

**Unique constraint:** `(event_id, email, registration_type)`

### 10.3 `private_event_requests` table

| Field | Type |
|---|---|
| id | PK |
| contact_name | string |
| job_title | string (nullable) |
| email | string |
| phone | string |
| preferred_contact_method | string (nullable) |
| company_name | string |
| industry | string (nullable) |
| company_website | string (nullable) |
| company_size | string (nullable) |
| event_type | enum |
| event_type_other | string (nullable) |
| event_title | string (nullable) |
| event_description | text |
| preferred_date | date |
| alternative_date | date (nullable) |
| flexible_date | boolean |
| expected_guests | string/int |
| location_type | string (nullable) |
| location_city | string (nullable) |
| services_needed | json (array) |
| budget_range | string (nullable) |
| attachments | json (array of URLs) |
| notes | text (nullable) |
| heard_about_us | string (nullable) |
| status | enum (see 9.4) |
| admin_notes | text (nullable) |
| created_at / updated_at | datetime |

### 10.4 `admins` table

| Field | Type |
|---|---|
| id | PK |
| name | string |
| email | string (unique) |
| password_hash | string |
| role | enum (`super_admin` / `editor`) |
| created_at | datetime |

### 10.5 Relationships

```
events (1) ────< (many) registrations
private_event_requests  (standalone table)
admins                  (standalone table)
```

---

## 11. Admin Dashboard

**URL:** `/admin` (login-protected)

### 11.1 Pages

| Page | Functions |
|---|---|
| **Dashboard** | Quick stats: upcoming events, new registrations, new requests, volunteers |
| **Events** | List all events + Create / Edit / Delete / Duplicate / Cancel / Publish-Unpublish |
| **Registrations** | List all registrations + filters (Event / Type / Status) + change status + Export CSV/Excel |
| **Volunteers** | Same as Registrations but filtered to `volunteer` with extra details |
| **Private Requests** | Request list + details + change status + add admin notes + download attachments |
| **Media / Gallery** | Upload and manage images |
| **Settings** | Contact info, social links, email templates |
| **Admins** | (Super Admin only) manage admin users |

### 11.2 Create/Edit Event page
All fields from the `events` table + a rich text editor for the description + image upload + preview before publishing.

### 11.3 Useful extras
- Search + sort in all tables.
- Bulk actions (confirm/cancel multiple registrations).
- Send a bulk email to the registrants of a specific event.
- Export an attendance sheet.

---

## 12. Emails & Notifications

| Trigger | Recipient | Content |
|---|---|---|
| New registration (Participant) | User | Confirmation + event details |
| New registration (Participant) | Admin | New registration notice |
| New volunteer application | User | Thanks + "we'll contact you" |
| New volunteer application | Admin | Notice |
| New private event request | Client | Request received confirmation |
| New private event request | Admin | Notice with request summary |
| Registration status changed to Confirmed | User | Final confirmation |
| Event cancelled | All registrants | Cancellation notice |
| Reminder (optional) | Registrants | 24 hours before the event |

---

## 13. API Endpoints (if building separate Frontend + Backend)

### Public

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events?type=&status=upcoming\|past&page=&limit=` | List events |
| GET | `/api/events/:slug` | Event details |
| GET | `/api/events/home` | Returns `{ upcoming: [...], past: [...] }` for the Home page |
| POST | `/api/registrations` | Form 1 |
| POST | `/api/private-requests` | Form 2 |
| POST | `/api/uploads` | Upload attachments |

### Admin (token-protected)

| Method | Endpoint |
|---|---|
| POST | `/api/admin/login` |
| GET/POST | `/api/admin/events` |
| GET/PUT/DELETE | `/api/admin/events/:id` |
| GET | `/api/admin/registrations` |
| PATCH | `/api/admin/registrations/:id` |
| GET | `/api/admin/registrations/export` |
| GET | `/api/admin/private-requests` |
| GET/PATCH | `/api/admin/private-requests/:id` |

---

## 14. UI/UX Guidelines

- **Responsive:** Mobile-first; works great on phones (most visitors will likely be on mobile).
- **Languages:** (Assumption) Arabic + English with full **RTL** support. *(If you want a single language, remove this item.)*
- **Type colors:** A fixed badge color per type so they're recognizable at a glance:
  - Workshop 🟠 / Event 🟣 / Lecture 🔵 / Field Trip 🟢
- **Buttons:** Register/Volunteer = Primary (filled); Request Event = Secondary (outline).
- **Cards:** Image + clear info + hover effect.
- **Loading states:** Skeletons instead of blank pages.
- **Empty states:** If there are no upcoming events → *"No upcoming events right now. Check back soon!"* + a button to Past Events.
- **Form UX:**
  - Clear error messages under each field.
  - Progress bar on the long form (Form 2).
  - Conditional fields appear/disappear smoothly.
  - Disable the submit button while sending to prevent double submits.
- **Accessibility:** Alt text for images, labels for fields, good contrast, keyboard navigation.

---

## 15. Security & Privacy

- HTTPS required.
- Validation on the **backend** as well (not just the frontend).
- Protection against SQL injection, XSS, CSRF.
- **Rate limiting** on forms (e.g., 5 requests/hour/IP).
- Honeypot field or reCAPTCHA.
- Hashed admin passwords (bcrypt/argon2).
- Check uploaded file type and size.
- **Privacy Policy** page and a consent checkbox on forms.
- Ability to delete a user's data on request.

---

## 16. SEO & Performance

- `<title>` and `meta description` on every page.
- Open Graph tags (so social shares look good).
- Clean URLs with `slug`.
- `sitemap.xml` and `robots.txt`.
- Structured data (Schema.org `Event`) on event pages.
- Image compression + lazy loading.

---

## 17. Suggested Tech Stack (suggestion, not mandatory)

| Layer | Option 1 (fast) | Option 2 (flexible) |
|---|---|---|
| Frontend | Next.js + Tailwind CSS | React/Vue + Tailwind |
| Backend | Next.js API Routes / Node (Express) | Laravel / Django |
| Database | PostgreSQL | MySQL |
| ORM | Prisma | Eloquent / Django ORM |
| Auth (Admin) | NextAuth / JWT | Laravel Breeze / Django Auth |
| Email | Resend / SendGrid / Nodemailer | SMTP |
| File Storage | Cloudinary / S3 | Local storage |
| Hosting | Vercel + Supabase/Neon | VPS / cPanel |

> For the fastest and simplest route: **Next.js + Tailwind + Supabase (DB + Auth + Storage) + Resend for emails.**

---

## 18. Development Phases

### Phase 1 — Foundations
- [ ] Project setup + database
- [ ] Navbar + footer + layout
- [ ] `events` table + seed sample data

### Phase 2 — Showing events
- [ ] Home page (Hero + Upcoming + Past)
- [ ] The four category pages
- [ ] Event details page

### Phase 3 — Forms
- [ ] Form 1: Register / Volunteer
- [ ] Form 2: Request Private Event
- [ ] Validation + spam protection
- [ ] Thank-you pages

### Phase 4 — Emails
- [ ] Confirmation emails to users
- [ ] Admin notifications

### Phase 5 — Admin Dashboard
- [ ] Login
- [ ] Event management
- [ ] Registration management + export
- [ ] Private request management

### Phase 6 — Polish & Launch
- [ ] Responsive testing
- [ ] SEO + performance
- [ ] Security check
- [ ] Deploy + domain + SSL

---

## 19. Acceptance Criteria

The site is considered ready when:

1. ✅ The top bar contains Workshops / Events / Lectures / Field Trips, and each link opens the correct page.
2. ✅ The Home page shows **Upcoming Events** then **Past Events**, in that order.
3. ✅ Events move from Upcoming to Past **automatically** after they end.
4. ✅ There are two clear buttons on the Home page: **Register/Volunteer** and **Request a Private Event**.
5. ✅ Form 1 works for both types (Participant/Volunteer) and shows the correct conditional fields.
6. ✅ Form 2 saves all data and attachments.
7. ✅ Duplicate registrations are blocked, and registering for a full/ended event is blocked.
8. ✅ The user receives a confirmation email, and the admin receives a notification.
9. ✅ The admin can add/edit/cancel events and view all registrations and requests.
10. ✅ The site works great on mobile.

---

## 20. Open Questions (you need to decide)

| # | Question | Current assumption |
|---|---|---|
| 1 | Single language or Arabic + English? | Arabic + English (RTL) |
| 2 | Does registration require a user account (login)? | No, form only |
| 3 | Are there paid events (online payment)? | No; free / external payment at first |
| 4 | Can an event allow both registration and volunteering? | Yes, via flags |
| 5 | Is registration confirmed automatically or approved by admin? | Starts as `pending` → admin confirms |
| 6 | Is there a waitlist when spots run out? | Optional (later phase) |
| 7 | Do you want attendance certificates? | No (possible later) |
| 8 | What are the site name / colors / logo? | Not yet defined |
| 9 | How many admins, and who manages content? | At least one admin |
| 10 | Are there separate About / Contact / Gallery pages? | Optional |
| 11 | Should Past Events show a photo gallery? | Yes |
| 12 | Which email address receives admin notifications? | Not yet defined |

---

## 21. TL;DR

- **Navbar:** Home · Workshops · Events · Lectures · Field Trips + two buttons (Register/Volunteer, Request Event).
- **Home:** Hero (with the two buttons) ← **Upcoming Events** ← **Past Events** ← Footer.
- **Form 1** (`/register`): Register for a workshop or volunteer at an event.
- **Form 2** (`/request-event`): Request a private event (company / shop opening / exhibition).
- **Admin Dashboard:** Manage events + registrations + requests.
- **Upcoming/Past** is determined automatically from the date.
