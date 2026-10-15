"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Row = Record<string, string>;
type Tab = "overview" | "registers" | "volunteers" | "owners" | "events";

interface Overview {
  stats: {
    upcoming: number; totalEvents: number;
    registers: number; volunteers: number;
    requests: number; newRequests: number;
    applications: number; newApplications: number;
  };
  recentRequests: Row[];
  recentApplications: Row[];
}

const KIND_TO_API: Record<Exclude<Tab, "overview">, string> = {
  registers: "applications",
  volunteers: "applications",
  owners: "requests",
  events: "events",
};

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 ring-1 ring-amber-300",
  contacted: "bg-sky-100 text-sky-800 ring-1 ring-sky-300",
  accepted: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300",
  rejected: "bg-red-100 text-red-800 ring-1 ring-red-300",
};

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function ApplicationCard({ r, onStatus }: { r: Row; onStatus: (id: string, status: string) => void }) {
  const [confirm, setConfirm] = useState<"accepted" | "rejected" | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const id = String(r.id);

  function contactVia(channel: "email" | "phone") {
    // Mark as contacted (only legal from "new"; otherwise just open the channel).
    if (r.status === "new") onStatus(id, "contacted");
    setContactOpen(false);
  }

  return (
    <details className="rounded-2xl border border-deep/10 bg-white p-4">
      <summary className="flex cursor-pointer flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-deep text-sm font-black text-white" aria-hidden="true">
          {initials(String(r.fullName || "?"))}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-extrabold text-ink">{r.fullName}</span>
          <span className="block truncate text-xs font-medium text-ink/55" dir="auto">
            {r.city} · <span dir="ltr">{r.email}</span> · <span dir="ltr">{r.phone}</span>
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-1.5">
          {r.eventTitle && (
            <span className="rounded-full bg-pine px-2.5 py-1 text-[11px] font-bold text-white">
              {r.eventTitle}
            </span>
          )}
          {r.registrationType && (
            <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-pine ring-1 ring-pine/25">
              {r.registrationType === "volunteer" ? "Volunteer" : "Participant"}
            </span>
          )}
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_STYLES[String(r.status)] ?? "bg-mist text-pine"}`}>
            {r.status}
          </span>
        </span>
      </summary>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div><dt className="font-bold text-sage">Age</dt><dd>{r.age}</dd></div>
        <div><dt className="font-bold text-sage">University / Work</dt><dd>{r.university || "—"}</dd></div>
        <div><dt className="font-bold text-sage">Major / Workplace</dt><dd>{r.major || "—"}</dd></div>
        <div><dt className="font-bold text-sage">Weekly hours</dt><dd>{r.hours}</dd></div>
        <div><dt className="font-bold text-sage">Prior team</dt><dd>{r.priorTeam}{r.priorDetails ? ` — ${r.priorDetails}` : ""}</dd></div>
        <div><dt className="font-bold text-sage">Agreement</dt><dd>{r.agreement}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Areas</dt><dd>{Array.isArray(r.areas) ? (r.areas as unknown as string[]).join("، ") : r.areas}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Motivation</dt><dd className="whitespace-pre-wrap">{r.motivation}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Skill to develop</dt><dd className="whitespace-pre-wrap">{r.skill}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Achievement</dt><dd className="whitespace-pre-wrap">{r.achievement}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Tools</dt><dd className="whitespace-pre-wrap">{r.tools}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-sage">Value add</dt><dd className="whitespace-pre-wrap">{r.valueAdd}</dd></div>
        {r.links && <div className="sm:col-span-2"><dt className="font-bold text-sage">Links</dt><dd dir="ltr">{r.links}</dd></div>}
      </dl>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button onClick={() => setConfirm("accepted")} className="rounded-full bg-pine px-4 py-1.5 text-[12px] font-bold text-white hover:bg-deep">Accept</button>
        <button onClick={() => setConfirm("rejected")} className="rounded-full border border-red-700 px-4 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-700 hover:text-white">Reject</button>
        <button onClick={() => setContactOpen(true)} className="rounded-full bg-sage px-4 py-1.5 text-[12px] font-bold text-white hover:bg-deep">Contact</button>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-label={`Confirm ${confirm}`}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift">
            <h3 className="text-lg font-black text-deep">
              {confirm === "accepted" ? "Accept this application?" : "Reject this application?"}
            </h3>
            <p className="mt-2 text-sm text-ink/65">
              {confirm === "accepted"
                ? `Are you sure you want to accept ${r.fullName}? They will be counted as part of the team.`
                : `Are you sure you want to reject ${r.fullName}? This cannot be undone.`}
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => { onStatus(id, confirm); setConfirm(null); }}
                className={`flex-1 rounded-2xl px-4 py-2.5 text-sm font-extrabold text-white ${confirm === "accepted" ? "bg-pine hover:bg-deep" : "bg-red-700 hover:bg-red-800"}`}
              >
                Yes, {confirm === "accepted" ? "accept" : "reject"}
              </button>
              <button onClick={() => setConfirm(null)} className="flex-1 rounded-2xl border border-deep/20 px-4 py-2.5 text-sm font-bold text-deep hover:bg-mist">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {contactOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-label="Contact applicant">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift">
            <h3 className="text-lg font-black text-deep">Contact {r.fullName}</h3>
            <p className="mt-1 text-sm text-ink/65">Choose how to reach them:</p>
            <div className="mt-4 grid gap-2">
              <a
                href={`mailto:${r.email}?subject=${encodeURIComponent("Double H Community — your application")}`}
                onClick={() => contactVia("email")}
                className="flex items-center justify-between rounded-2xl bg-pine px-5 py-3.5 text-sm font-extrabold text-white hover:bg-deep"
              >
                <span>✉️ Email</span><span dir="ltr" className="font-semibold text-white/85">{r.email}</span>
              </a>
              <a
                href={`tel:${String(r.phone).replace(/\s/g, "")}`}
                onClick={() => contactVia("phone")}
                className="flex items-center justify-between rounded-2xl border-2 border-pine px-5 py-3 text-sm font-extrabold text-pine hover:bg-mist"
              >
                <span>📞 Call</span><span dir="ltr" className="font-semibold">{r.phone}</span>
              </a>
              <button onClick={() => setContactOpen(false)} className="rounded-2xl border border-deep/20 px-4 py-2.5 text-sm font-bold text-deep hover:bg-mist">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </details>
  );
}

const TABS: Array<{ key: Tab; label: string }> = [
  { key: "overview", label: "Overview" },
  { key: "registers", label: "Registers" },
  { key: "volunteers", label: "Volunteers" },
  { key: "owners", label: "Events Owner" },
  { key: "events", label: "Events" },
];

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

function timeBadge(r: Row): { label: string; cls: string } {
  if (r.status === "cancelled") return { label: "Cancelled", cls: "bg-red-100 text-red-800 ring-1 ring-red-300" };
  if (r.status === "draft") return { label: "Draft", cls: "bg-amber-100 text-amber-800 ring-1 ring-amber-300" };
  const past = new Date(String(r.endDatetime)).getTime() < Date.now();
  return past
    ? { label: "Past", cls: "bg-ink/10 text-ink ring-1 ring-ink/20" }
    : { label: "Upcoming", cls: "bg-deep text-white" };
}

function EventModal({ initial, onClose, onSaved, onError }: {
  initial: Row | null; onClose: () => void; onSaved: () => void; onError: (m: string) => void;
}) {
  const [f, setF] = useState<Record<string, string>>(() => ({
    title: String(initial?.title ?? ""),
    type: String(initial?.type ?? "workshop"),
    shortDescription: String(initial?.shortDescription ?? ""),
    description: String(initial?.description ?? ""),
    price: String(initial?.price ?? "0"),
    startDatetime: initial?.startDatetime ? toLocalInput(String(initial.startDatetime)) : "",
    endDatetime: initial?.endDatetime ? toLocalInput(String(initial.endDatetime)) : "",
    locationName: String(initial?.locationName ?? ""),
    capacity: initial?.capacity ? String(initial.capacity) : "",
    mode: initial ? (String(initial.allowVolunteers) === "true" ? "vol" : "reg") : "reg",
    status: String(initial?.status ?? "draft"),
    coverGradient: String(initial?.coverGradient ?? "g-event-1"),
    coverImage: String(initial?.coverImage ?? ""),
  }));
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  function pickFile(fl: File | null) {
    setFile(fl);
    setUploadError("");
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(fl ? URL.createObjectURL(fl) : null);
  }
  const inputCls = "w-full rounded-xl border border-deep/20 px-3.5 py-2.5 text-sm text-ink focus:border-pine focus:outline-none";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      // 1. Upload the picture from the PC first (if a new one was picked).
      let coverImage: string | undefined = f.coverImage || undefined;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        const up = await fetch("/api/admin/uploads", { method: "POST", body: fd });
        const ud = await up.json().catch(() => ({}));
        if (!up.ok) throw new Error(ud.error || "Picture upload failed");
        coverImage = ud.url;
      }
      const payload = {
        title: (f.title ?? "").trim(),
        type: f.type,
        shortDescription: (f.shortDescription ?? "").trim(),
        description: (f.description ?? "").trim(),
        coverGradient: f.coverGradient,
        startDatetime: f.startDatetime,
        endDatetime: f.endDatetime,
        locationName: (f.locationName ?? "").trim(),
        price: Number(f.price || 0),
        capacity: f.capacity ? Number(f.capacity) : null,
        status: f.status,
        coverImage,
      };
      let res: Response;
      if (initial) {
        res = await fetch("/api/admin/events", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: initial.id, patch: payload, mode: f.mode }),
        });
      } else {
        res = await fetch("/api/admin/events", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...payload,
            allowRegistration: f.mode !== "vol",
            allowVolunteers: f.mode === "vol",
          }),
        });
      }
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Save failed");
      onSaved();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/50 p-4" role="dialog" aria-modal="true" aria-label={initial ? "Edit event" : "Add event"}>
      <form onSubmit={save} className="mx-auto my-8 w-full max-w-2xl space-y-4 rounded-3xl bg-white p-6 shadow-lift sm:p-8">
        <h3 className="text-xl font-black text-deep">{initial ? "Edit event" : "Add new event"}</h3>
        <label className="block text-sm font-bold text-deep">Title*
          <input className={`${inputCls} mt-1`} value={f.title} onChange={(e) => set("title", e.target.value)} required minLength={2} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-deep">Type*
            <select className={`${inputCls} mt-1`} value={f.type} onChange={(e) => set("type", e.target.value)}>
              <option value="workshop">Workshop</option>
              <option value="event">Event (volunteering)</option>
              <option value="lecture">Lecture</option>
              <option value="field_trip">Field Trip</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-deep">Sign-up mode*
            <select className={`${inputCls} mt-1`} value={f.mode} onChange={(e) => set("mode", e.target.value)}>
              <option value="reg">Registration (workshops / lectures)</option>
              <option value="vol">Volunteering (events only)</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-deep">Price (0 = Free)*
            <input type="number" min={0} className={`${inputCls} mt-1`} value={f.price} onChange={(e) => set("price", e.target.value)} required />
          </label>
          <label className="block text-sm font-bold text-deep">Capacity (empty = unlimited)
            <input type="number" min={1} className={`${inputCls} mt-1`} value={f.capacity ?? ""} onChange={(e) => set("capacity", e.target.value)} placeholder="∞" />
          </label>
          <label className="block text-sm font-bold text-deep">Starts*
            <input type="datetime-local" className={`${inputCls} mt-1`} value={f.startDatetime} onChange={(e) => set("startDatetime", e.target.value)} required />
          </label>
          <label className="block text-sm font-bold text-deep">Ends* <span className="font-semibold text-sage">(sets Upcoming / Past automatically)</span>
            <input type="datetime-local" className={`${inputCls} mt-1`} value={f.endDatetime} onChange={(e) => set("endDatetime", e.target.value)} required />
          </label>
        </div>
        <label className="block text-sm font-bold text-deep">Location*
          <input className={`${inputCls} mt-1`} value={f.locationName} onChange={(e) => set("locationName", e.target.value)} required minLength={2} />
        </label>
        <label className="block text-sm font-bold text-deep">Short description* <span className="font-semibold text-sage">(card, min 10 chars)</span>
          <input className={`${inputCls} mt-1`} value={f.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} required minLength={10} />
        </label>
        <label className="block text-sm font-bold text-deep">Full description*
          <textarea rows={4} className={`${inputCls} mt-1`} value={f.description} onChange={(e) => set("description", e.target.value)} required minLength={10} />
        </label>
        <fieldset>
          <legend className="text-sm font-bold text-deep">Cover picture* <span className="font-semibold text-sage">(upload from your PC — PNG/JPG/WEBP/GIF, max 5 MB)</span></legend>
          {(filePreview || f.coverImage) && (
            <div className="relative mt-2 h-36 overflow-hidden rounded-2xl ring-1 ring-deep/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={filePreview ?? (f.coverImage as string)} alt="Cover preview" className="h-full w-full object-cover" />
            </div>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="cursor-pointer rounded-2xl bg-mist px-4 py-2.5 text-sm font-extrabold text-pine hover:bg-deep hover:text-white">
              {file || f.coverImage ? "Change picture…" : "Choose picture…"}
              <input
                type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
                onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {(file || f.coverImage) && (
              <button type="button" onClick={() => { pickFile(null); set("coverImage", ""); }} className="rounded-2xl border border-red-700 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-700 hover:text-white">
                Remove
              </button>
            )}
          </div>
          {uploadError && <p role="alert" className="mt-1 text-xs font-semibold text-red-700">{uploadError}</p>}
        </fieldset>
        <label className="block text-sm font-bold text-deep">Status*
          <select className={`${inputCls} mt-1`} value={f.status} onChange={(e) => set("status", e.target.value)}>
            <option value="draft">Draft (hidden)</option>
            <option value="published">Published (visible)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={busy} className="flex-1 rounded-2xl bg-pine px-4 py-3 text-sm font-extrabold text-white hover:bg-deep disabled:opacity-60">
            {busy ? "Saving…" : initial ? "Save changes" : "Add event"}
          </button>
          <button type="button" onClick={onClose} className="rounded-2xl border border-deep/20 px-5 py-3 text-sm font-bold text-deep hover:bg-mist">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);

  async function refreshEvents() {
    try {
      const r = await fetch("/api/admin/events");
      const d = await r.json();
      setRows(d.items ?? []);
    } catch { /* keep old rows */ }
  }

  useEffect(() => {
    fetch("/api/admin/data").then(async (r) => {
      if (r.status === 401) { router.push("/admin/login"); return; }
      setData(await r.json());
    }).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (tab === "overview") return;
    fetch(`/api/admin/data?kind=${KIND_TO_API[tab]}`).then((r) => r.json()).then((d) => setRows(d.items ?? [])).catch(() => setRows([]));
  }, [tab]);

  async function setStatus(target: string, id: string, status: string) {
    setMsg("");
    const res = await fetch("/api/admin/data", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, id, status }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) { setMsg(d.error || "Update failed"); return; }
    setMsg(`Updated → ${status}`);
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  if (!data) return <div className="mx-auto max-w-6xl p-10">Checking session…</div>;

  const s = data.stats;
  const registers = rows.filter((r) => (r.registrationType ?? "participant") === "participant");
  const volunteers = rows.filter((r) => r.registrationType === "volunteer");
  const recentApps = data.recentApplications ?? [];
  const recentRegisters = recentApps.filter((r) => (r.registrationType ?? "participant") === "participant").slice(0, 5);
  const recentVolunteers = recentApps.filter((r) => r.registrationType === "volunteer").slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-deep">Admin Dashboard</h1>
        <div className="flex gap-2">
          <a href="/api/admin/export?kind=applications" className="rounded-full border border-pine px-4 py-2 text-sm font-bold text-pine">Export CSV</a>
          <button onClick={async () => { await fetch("/api/admin/login", { method: "DELETE" }); router.push("/admin/login"); }} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-white">Sign Out</button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === key ? "bg-deep text-white" : "bg-mist text-pine"}`}>{label}</button>
        ))}
      </div>
      {msg && <p className="mt-3 rounded-xl bg-mist p-2.5 text-sm font-bold text-deep">{msg}</p>}

      {tab === "overview" && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [String(s.upcoming), "Upcoming events"],
              [String(s.registers ?? 0), "Registers"],
              [String(s.volunteers ?? 0), "Volunteers"],
              [String(s.requests), `Events Owner (${s.newRequests} new)`],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-deep p-5 text-white"><div className="text-3xl font-black">{n}</div><div className="text-xs text-white/70">{l}</div></div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-deep/10 p-5">
              <h2 className="font-extrabold text-deep">Recent registers</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {recentRegisters.map((r) => <li key={r.id} className="flex justify-between gap-2 border-b border-mist pb-1.5"><span>{r.fullName} · {r.city}</span><span className="font-bold text-sage">{r.status}</span></li>)}
                {recentRegisters.length === 0 && <li className="text-ink/50">Nothing yet.</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-deep/10 p-5">
              <h2 className="font-extrabold text-deep">Recent volunteers</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {recentVolunteers.map((r) => <li key={r.id} className="flex justify-between gap-2 border-b border-mist pb-1.5"><span>{r.fullName} · {r.city}</span><span className="font-bold text-sage">{r.status}</span></li>)}
                {recentVolunteers.length === 0 && <li className="text-ink/50">Nothing yet.</li>}
              </ul>
            </div>
            <div className="rounded-2xl border border-deep/10 p-5">
              <h2 className="font-extrabold text-deep">Recent owner requests</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {data.recentRequests.slice(0, 5).map((r) => <li key={r.id} className="flex justify-between gap-2 border-b border-mist pb-1.5"><span>{r.companyName} · {r.eventType}</span><span className="font-bold text-sage">{r.status}</span></li>)}
                {data.recentRequests.length === 0 && <li className="text-ink/50">Nothing yet.</li>}
              </ul>
            </div>
          </div>
        </>
      )}

      {(tab === "registers" || tab === "volunteers") && (
        <div className="mt-6 space-y-3">
          {(tab === "registers" ? registers : volunteers).map((r) => (
            <ApplicationCard key={r.id} r={r} onStatus={(id, st) => setStatus("application", id, st)} />
          ))}
          {(tab === "registers" ? registers : volunteers).length === 0 && (
            <p className="text-sm text-ink/55">No {tab} yet.</p>
          )}
        </div>
      )}

      {tab === "owners" && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-deep/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-mist text-deep"><tr><th className="p-3">Company</th><th className="p-3">Contact</th><th className="p-3">Type</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-mist">
                  <td className="p-3 font-semibold">{r.companyName}</td><td className="p-3">{r.contactName} · {r.email}</td><td className="p-3">{r.eventType}</td><td className="p-3 font-bold">{r.status}</td>
                  <td className="p-3"><div className="flex flex-wrap gap-1">
                    {["in_review", "contacted", "quote_sent", "confirmed", "completed", "rejected", "cancelled"].map((st) => (
                      <button key={st} onClick={() => setStatus("request", String(r.id), st)} className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-bold text-pine hover:bg-deep hover:text-white">{st}</button>
                    ))}
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="p-4 text-sm text-ink/55">No owner requests yet.</p>}
        </div>
      )}

      {tab === "events" && (
        <>
          <div className="mt-4">
            <button onClick={() => setEditing("new")} className="rounded-full bg-pine px-5 py-2.5 text-sm font-extrabold text-white hover:bg-deep">
              + Add new event
            </button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {rows.map((r) => {
              const badge = timeBadge(r);
              return (
                <div key={r.id} className="rounded-2xl border border-deep/10 bg-white p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-extrabold text-deep">{r.title}</div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${badge.cls}`}>{badge.label}</span>
                  </div>
                  <div className="mt-1 text-xs text-ink/60">
                    {r.type} · {r.status} · {Number(r.price) === 0 ? "Free" : `$${r.price}`} · cap {r.capacity ?? "∞"}
                  </div>
                  <div className="mt-1 text-xs text-ink/60" dir="auto">
                    {new Date(String(r.startDatetime)).toLocaleString()} → {new Date(String(r.endDatetime)).toLocaleString()}
                  </div>
                  <div className="mt-3 flex gap-1.5">
                    <button onClick={() => setEditing(r)} className="rounded-full bg-mist px-3.5 py-1.5 text-[12px] font-bold text-pine hover:bg-deep hover:text-white">Edit</button>
                    <button onClick={() => setDeleting(r)} className="rounded-full border border-red-700 px-3.5 py-1.5 text-[12px] font-bold text-red-700 hover:bg-red-700 hover:text-white">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
          {editing !== null && (
            <EventModal
              initial={editing === "new" ? null : editing}
              onClose={() => setEditing(null)}
              onSaved={() => refreshEvents()}
              onError={(m) => setMsg(m)}
            />
          )}
          {deleting && (
            <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-label="Confirm delete">
              <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift">
                <h3 className="text-lg font-black text-deep">Delete this event?</h3>
                <p className="mt-2 text-sm text-ink/65">
                  Are you sure you want to permanently delete <strong>{deleting.title}</strong>? This cannot be undone.
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/admin/events?id=${deleting.id}`, { method: "DELETE" });
                      const d = await res.json().catch(() => ({}));
                      if (!res.ok) { setMsg(d.error || "Delete failed"); }
                      else { setMsg("Event deleted."); refreshEvents(); }
                      setDeleting(null);
                    }}
                    className="flex-1 rounded-2xl bg-red-700 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-red-800"
                  >
                    Yes, delete
                  </button>
                  <button onClick={() => setDeleting(null)} className="flex-1 rounded-2xl border border-deep/20 px-4 py-2.5 text-sm font-bold text-deep hover:bg-mist">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
