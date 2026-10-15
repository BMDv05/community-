"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";

const inputCls = "w-full rounded-xl border border-deep/20 bg-white px-4 py-2.5 text-sm text-ink focus:border-pine focus:outline-none";
const SERVICES = ["Full Event Planning & Management", "Venue Sourcing", "Catering", "Decoration & Setup", "Entertainment / Speakers", "Photography / Videography", "Marketing & Promotion", "Volunteers / Staff", "Other"];

export default function RequestEventPage() {
  const { t } = useLang();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({ expectedGuests: "20–50", services: "" });
  const [services, setServices] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function validStep(): boolean {
    if (step === 0) return (form.contactName ?? "").trim().length >= 2 && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email ?? "") && (form.phone ?? "").trim().length >= 6;
    if (step === 1) return (form.companyName ?? "").trim().length >= 2;
    if (step === 2) return (form.eventDescription ?? "").trim().length >= 10 && !!form.preferredDate && new Date(form.preferredDate).getTime() > Date.now();
    return true;
  }

  async function submit() {
    if (!form.consent) { setError("Consent is required"); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/private-requests", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: form.contactName, jobTitle: form.jobTitle, email: form.email, phone: form.phone,
          preferredContactMethod: form.contactMethod || undefined,
          companyName: form.companyName, industry: form.industry, companyWebsite: form.website, companySize: form.size,
          eventType: form.eventType || "Other", eventTypeOther: form.eventTypeOther, eventTitle: form.eventTitle,
          eventDescription: form.eventDescription, preferredDate: form.preferredDate, alternativeDate: form.altDate || undefined,
          flexibleDate: !!form.flexible, expectedGuests: form.expectedGuests, locationType: form.locType || undefined,
          locationCity: form.locCity, servicesNeeded: services, budgetRange: form.budget || undefined,
          notes: form.notes, heardAboutUs: form.heard || undefined, consent: true, website: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      router.push("/thank-you?kind=request");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black text-deep">{t.form2.title}</h1>
      <p className="mt-1 text-sm text-ink/60">{t.form2.sub}</p>

      <ol className="mt-6 flex gap-1.5" aria-label="Progress">
        {t.form2.steps.map((s, i) => (
          <li key={s} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-pine" : "bg-mist"}`} title={s} />
        ))}
      </ol>
      <p className="mt-2 text-xs font-bold text-sage">{t.form2.steps[step]} · {step + 1}/5</p>

      <div className="mt-4 rounded-3xl border border-deep/10 bg-white p-6 shadow-card sm:p-8">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-deep">Contact Person Name*<input className={inputCls} value={form.contactName ?? ""} onChange={(e) => set("contactName", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Position / Job Title<input className={inputCls} value={form.jobTitle ?? ""} onChange={(e) => set("jobTitle", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Email*<input type="email" className={inputCls} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Phone*<input type="tel" className={inputCls} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep sm:col-span-2">Preferred Contact Method
              <select className={inputCls} value={form.contactMethod ?? ""} onChange={(e) => set("contactMethod", e.target.value)}>
                <option value="">—</option><option>Email</option><option>Phone</option><option>WhatsApp</option>
              </select>
            </label>
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-deep">Company / Business Name*<input className={inputCls} value={form.companyName ?? ""} onChange={(e) => set("companyName", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Industry<input className={inputCls} value={form.industry ?? ""} onChange={(e) => set("industry", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Website / Instagram<input className={inputCls} value={form.website ?? ""} onChange={(e) => set("website", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Company Size
              <select className={inputCls} value={form.size ?? ""} onChange={(e) => set("size", e.target.value)}>
                <option value="">—</option><option>1–10</option><option>11–50</option><option>51–200</option><option>200+</option>
              </select>
            </label>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-bold text-deep">Event Type*
              <select className={inputCls} value={form.eventType ?? ""} onChange={(e) => set("eventType", e.target.value)}>
                <option value="">—</option><option>Company Event</option><option>Shop Opening</option><option>Exhibition</option><option>Workshop for my team</option><option>Other</option>
              </select>
            </label>
            <label className="block text-sm font-bold text-deep">Event Title / Idea<input className={inputCls} value={form.eventTitle ?? ""} onChange={(e) => set("eventTitle", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep sm:col-span-2">Event Description*<textarea rows={4} className={inputCls} value={form.eventDescription ?? ""} onChange={(e) => set("eventDescription", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Preferred Date*<input type="date" className={inputCls} value={form.preferredDate ?? ""} onChange={(e) => set("preferredDate", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Alternative Date<input type="date" className={inputCls} value={form.altDate ?? ""} onChange={(e) => set("altDate", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">Expected Guests*
              <select className={inputCls} value={form.expectedGuests} onChange={(e) => set("expectedGuests", e.target.value)}>
                <option>1–20</option><option>20–50</option><option>50–100</option><option>100+</option>
              </select>
            </label>
            <label className="block text-sm font-bold text-deep">Location / City<input className={inputCls} value={form.locCity ?? ""} onChange={(e) => set("locCity", e.target.value)} /></label>
            <label className="flex items-center gap-2 text-sm font-bold text-deep"><input type="checkbox" className="h-4 w-4 accent-[#134c4b]" checked={!!form.flexible} onChange={(e) => set("flexible", e.target.checked ? "1" : "")} /> Flexible on date?</label>
          </div>
        )}
        {step === 3 && (
          <fieldset>
            <legend className="text-sm font-bold text-deep">Services Needed</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <label key={s} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${services.includes(s) ? "border-pine bg-mist text-deep" : "border-deep/15 text-ink/70"}`}>
                  <input type="checkbox" className="h-4 w-4 accent-[#134c4b]" checked={services.includes(s)} onChange={() => setServices((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s])} />
                  {s}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {step === 4 && (
          <div className="grid gap-4">
            <label className="block text-sm font-bold text-deep">Budget Range
              <select className={inputCls} value={form.budget ?? ""} onChange={(e) => set("budget", e.target.value)}>
                <option value="">—</option><option>Under $500</option><option>$500 – $2,000</option><option>$2,000+</option><option>Not sure</option>
              </select>
            </label>
            <label className="block text-sm font-bold text-deep">Additional Notes<textarea rows={3} className={inputCls} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} /></label>
            <label className="block text-sm font-bold text-deep">How did you hear about us?
              <select className={inputCls} value={form.heard ?? ""} onChange={(e) => set("heard", e.target.value)}>
                <option value="">—</option><option>Social Media</option><option>Friend</option><option>Website</option><option>Other</option>
              </select>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-mist/60 p-4 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#134c4b]" checked={!!form.consent} onChange={(e) => set("consent", e.target.checked ? "1" : "")} />
              <span className="font-semibold text-ink/80">I agree to the Privacy Policy and to being contacted about this request.</span>
            </label>
          </div>
        )}

        {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

        <div className="mt-6 flex gap-3">
          {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-2xl border border-deep/20 px-6 py-3 font-bold text-deep">{t.form2.back}</button>}
          {step < 4 ? (
            <button type="button" disabled={!validStep()} onClick={() => setStep((s) => s + 1)} className="flex-1 rounded-2xl bg-pine px-6 py-3 font-extrabold text-white hover:bg-deep disabled:opacity-40">{t.form2.next}</button>
          ) : (
            <button type="button" disabled={sending} onClick={submit} className="flex-1 rounded-2xl bg-pine px-6 py-3 font-extrabold text-white hover:bg-deep disabled:opacity-60">{sending ? t.form2.sending : t.form2.submit}</button>
          )}
        </div>
      </div>
    </div>
  );
}
