"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { JOIN_AREAS, JOIN_HOURS } from "@/lib/validation";
import type { CommunityEvent } from "@/lib/types";

const inputCls = "w-full rounded-xl border border-deep/20 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-pine focus:outline-none";

function Field({ label, error, children, htmlFor, optional }: {
  label: string; error?: string; children: React.ReactNode; htmlFor?: string; optional?: boolean;
}) {
  const { t } = useLang();
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-bold text-deep">
        {label} {optional && <span className="font-semibold text-sage">({t.join.optional})</span>}
      </label>
      {children}
      {error && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

/**
 * The Double H membership application form (استمارة التقديم), shared by
 * /join and /register so both pages ask exactly the same questions.
 * When `eventPicker` is true (the /register page), an event dropdown is
 * shown on top and its id is stored with the application.
 */
export function JoinForm({ eventPicker = false, initialEventId = "", showKindToggle = false, initialKind = "participant", fixedKind = null }: {
  eventPicker?: boolean; initialEventId?: string; showKindToggle?: boolean; initialKind?: "participant" | "volunteer"; fixedKind?: "participant" | "volunteer" | null;
}) {
  const { t, locale } = useLang();
  const [form, setForm] = useState<Record<string, string>>({});
  const [areas, setAreas] = useState<string[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [eventId, setEventId] = useState(initialEventId);
  const [kind, setKind] = useState<"participant" | "volunteer">(fixedKind ?? initialKind);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!eventPicker) return;
    fetch("/api/events?status=upcoming&limit=50")
      .then((r) => r.json())
      .then((d) => setEvents(d.items ?? []))
      .catch(() => setEvents([]));
  }, [eventPicker]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  // Volunteering is for Events only; registration is for Workshops/Lectures/Field Trips.
  const eligible = events.filter((e) =>
    kind === "volunteer"
      ? e.type === "event" && e.allowVolunteers
      : e.type !== "event" && e.allowRegistration
  );
  function pickKind(k: "participant" | "volunteer") {
    setKind(k);
    setEventId("");
  }
  const areaLabels = t.join.areasOptions as unknown as string[];
  const hourLabels = t.join.hoursOptions as unknown as string[];
  const yesNo: Array<{ value: string; label: string }> = [
    { value: "نعم", label: t.join.yes },
    { value: "لا", label: t.join.no },
  ];

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (eventPicker && !eventId) e.eventId = "✕";
    if ((form.fullName ?? "").trim().length < 2) e.fullName = "✕";
    const age = Number(form.age);
    if (!form.age || !Number.isInteger(age) || age < 10 || age > 100) e.age = "✕";
    if ((form.city ?? "").trim().length < 2) e.city = "✕";
    if ((form.phone ?? "").trim().length < 6) e.phone = "✕";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email ?? "")) e.email = "✕";
    if ((form.motivation ?? "").trim().length < 10) e.motivation = "✕";
    if ((form.skill ?? "").trim().length < 2) e.skill = "✕";
    if (areas.length === 0) e.areas = "✕";
    if ((form.achievement ?? "").trim().length < 3) e.achievement = "✕";
    if (!form.hours) e.hours = "✕";
    if (!form.priorTeam) e.priorTeam = "✕";
    if (form.priorTeam === "نعم" && !(form.priorDetails ?? "").trim()) e.priorDetails = "✕";
    if ((form.tools ?? "").trim().length < 2) e.tools = "✕";
    if ((form.valueAdd ?? "").trim().length < 10) e.valueAdd = "✕";
    if (!form.agreement) e.agreement = "✕";
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName?.trim(),
          age: Number(form.age),
          city: form.city?.trim(),
          phone: form.phone?.trim(),
          email: form.email?.trim(),
          university: form.university?.trim() || undefined,
          major: form.major?.trim() || undefined,
          motivation: form.motivation?.trim(),
          skill: form.skill?.trim(),
          areas,
          achievement: form.achievement?.trim(),
          hours: form.hours,
          priorTeam: form.priorTeam,
          priorDetails: form.priorDetails?.trim() || undefined,
          tools: form.tools?.trim(),
          valueAdd: form.valueAdd?.trim(),
          links: form.links?.trim() || undefined,
          agreement: form.agreement,
          eventId: eventId || undefined,
          registrationType: fixedKind ?? (showKindToggle ? kind : undefined),
          website: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pine text-3xl text-white" aria-hidden="true">✓</div>
        <h1 className="mt-6 text-3xl font-black text-deep">{t.join.successTitle}</h1>
        <p className="mt-2 text-ink/65">{t.join.successSub}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black text-deep">{t.join.title}</h1>
      <p className="mt-3 rounded-2xl bg-mist/70 p-5 text-sm leading-relaxed text-ink/75 ring-1 ring-deep/10">{t.join.intro}</p>

      <form onSubmit={submit} className="mt-6 space-y-8" noValidate>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        {/* Section 1 — personal info */}
        <section className="space-y-5 rounded-3xl border border-deep/10 bg-white p-6 shadow-card sm:p-8" aria-labelledby="join-sec1">
          <h2 id="join-sec1" className="border-b border-mist pb-3 text-lg font-black text-pine">{t.join.personalInfo}</h2>
          {showKindToggle && !fixedKind && (
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-mist p-1.5" role="radiogroup" aria-label="Registration type">
              {(["participant", "volunteer"] as const).map((k) => (
                <button
                  key={k} type="button" role="radio" aria-checked={kind === k}
                  onClick={() => pickKind(k)}
                  className={`rounded-xl px-4 py-3 text-sm font-extrabold ${kind === k ? "bg-deep text-white shadow" : "text-pine hover:bg-white"}`}
                >
                  {k === "participant" ? t.form1.participant : t.form1.volunteer}
                </button>
              ))}
            </div>
          )}
          {eventPicker && (
            <Field label={t.join.event} error={errors.eventId} htmlFor="j-event">
              <select id="j-event" className={inputCls} value={eventId} onChange={(e) => setEventId(e.target.value)}>
                <option value="">—</option>
                {eligible.map((e) => (
                  <option key={e.id} value={e.id}>
                    {(locale === "ar" && e.titleAr ? e.titleAr : e.title)} · {new Date(e.startDatetime).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field label={t.join.fullName} error={errors.fullName} htmlFor="j-name">
            <input id="j-name" className={inputCls} value={form.fullName ?? ""} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.join.age} error={errors.age} htmlFor="j-age">
              <input id="j-age" type="number" min={10} max={100} className={inputCls} value={form.age ?? ""} onChange={(e) => set("age", e.target.value)} />
            </Field>
            <Field label={t.join.city} error={errors.city} htmlFor="j-city">
              <input id="j-city" className={inputCls} value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
            </Field>
            <Field label={t.join.phone} error={errors.phone} htmlFor="j-phone">
              <input id="j-phone" type="tel" className={inputCls} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" dir="ltr" />
            </Field>
            <Field label={t.join.email} error={errors.email} htmlFor="j-email">
              <input id="j-email" type="email" className={inputCls} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} autoComplete="email" dir="ltr" />
            </Field>
            <Field label={t.join.university} htmlFor="j-uni" optional>
              <input id="j-uni" className={inputCls} value={form.university ?? ""} onChange={(e) => set("university", e.target.value)} />
            </Field>
            <Field label={t.join.major} htmlFor="j-major" optional>
              <input id="j-major" className={inputCls} value={form.major ?? ""} onChange={(e) => set("major", e.target.value)} />
            </Field>
          </div>
        </section>

        {/* Section 2 — tell us more */}
        <section className="space-y-5 rounded-3xl border border-deep/10 bg-white p-6 shadow-card sm:p-8" aria-labelledby="join-sec2">
          <h2 id="join-sec2" className="border-b border-mist pb-3 text-lg font-black text-pine">{t.join.tellUsMore}</h2>
          <Field label={t.join.motivation} error={errors.motivation} htmlFor="j-mot">
            <textarea id="j-mot" rows={4} className={inputCls} value={form.motivation ?? ""} onChange={(e) => set("motivation", e.target.value)} />
          </Field>
          <Field label={t.join.skill} error={errors.skill} htmlFor="j-skill">
            <textarea id="j-skill" rows={3} className={inputCls} value={form.skill ?? ""} onChange={(e) => set("skill", e.target.value)} />
          </Field>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-bold text-deep">{t.join.areas}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {JOIN_AREAS.map((value, i) => (
                <label key={value} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${areas.includes(value) ? "border-pine bg-mist text-deep" : "border-deep/15 text-ink/70 hover:border-sage"}`}>
                  <input
                    type="checkbox"
                    className="h-4 w-4 shrink-0 accent-[#134c4b]"
                    checked={areas.includes(value)}
                    onChange={() => setAreas((a) => (a.includes(value) ? a.filter((x) => x !== value) : [...a, value]))}
                  />
                  {locale === "ar" ? value : (areaLabels[i] ?? value)}
                </label>
              ))}
            </div>
            {errors.areas && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{errors.areas}</p>}
          </fieldset>
          <Field label={t.join.achievement} error={errors.achievement} htmlFor="j-ach">
            <textarea id="j-ach" rows={3} className={inputCls} value={form.achievement ?? ""} onChange={(e) => set("achievement", e.target.value)} />
          </Field>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-bold text-deep">{t.join.hours}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {JOIN_HOURS.map((value, i) => (
                <label key={value} className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-semibold transition ${form.hours === value ? "border-pine bg-mist text-deep" : "border-deep/15 text-ink/70 hover:border-sage"}`}>
                  <input type="radio" name="hours" className="h-4 w-4 shrink-0 accent-[#134c4b]" checked={form.hours === value} onChange={() => set("hours", value)} />
                  {locale === "ar" ? value : (hourLabels[i] ?? value)}
                </label>
              ))}
            </div>
            {errors.hours && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{errors.hours}</p>}
          </fieldset>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-bold text-deep">{t.join.priorTeam}</legend>
            <div className="flex gap-2">
              {yesNo.map((o) => (
                <label key={o.value} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${form.priorTeam === o.value ? "border-pine bg-mist text-deep" : "border-deep/15 text-ink/70 hover:border-sage"}`}>
                  <input type="radio" name="priorTeam" className="h-4 w-4 accent-[#134c4b]" checked={form.priorTeam === o.value} onChange={() => set("priorTeam", o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.priorTeam && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{errors.priorTeam}</p>}
          </fieldset>
          {form.priorTeam === "نعم" && (
            <Field label={t.join.priorDetails} error={errors.priorDetails} htmlFor="j-prior">
              <textarea id="j-prior" rows={2} className={inputCls} value={form.priorDetails ?? ""} onChange={(e) => set("priorDetails", e.target.value)} />
            </Field>
          )}
          <Field label={t.join.tools} error={errors.tools} htmlFor="j-tools">
            <textarea id="j-tools" rows={2} className={inputCls} value={form.tools ?? ""} onChange={(e) => set("tools", e.target.value)} dir="auto" />
          </Field>
          <Field label={t.join.valueAdd} error={errors.valueAdd} htmlFor="j-value">
            <textarea id="j-value" rows={4} className={inputCls} value={form.valueAdd ?? ""} onChange={(e) => set("valueAdd", e.target.value)} />
          </Field>
          <Field label={t.join.links} htmlFor="j-links" optional>
            <input id="j-links" className={inputCls} dir="ltr" placeholder="https://…" value={form.links ?? ""} onChange={(e) => set("links", e.target.value)} />
          </Field>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-bold text-deep">{t.join.agreement}</legend>
            <div className="flex gap-2">
              {yesNo.map((o) => (
                <label key={o.value} className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition ${form.agreement === o.value ? "border-pine bg-mist text-deep" : "border-deep/15 text-ink/70 hover:border-sage"}`}>
                  <input type="radio" name="agreement" className="h-4 w-4 accent-[#134c4b]" checked={form.agreement === o.value} onChange={() => set("agreement", o.value)} />
                  {o.label}
                </label>
              ))}
            </div>
            {errors.agreement && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{errors.agreement}</p>}
          </fieldset>
        </section>

        {serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{serverError}</p>}

        <button type="submit" disabled={sending} className="w-full rounded-2xl bg-pine px-6 py-4 font-extrabold text-white hover:bg-deep disabled:opacity-60">
          {sending ? t.join.sending : t.join.submit}
        </button>
      </form>
    </div>
  );
}
