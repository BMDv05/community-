"use client";

import Link from "next/link";
import type { CommunityEvent } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { TypeBadge, StatusBadge } from "@/components/EventCard";
import { formatDateRange, durationHours } from "@/lib/utils";

export function EventDetailView({ event, registered, volunteers }: { event: CommunityEvent; registered: number; volunteers: number }) {
  const { t, locale } = useLang();
  const title = locale === "ar" && event.titleAr ? event.titleAr : event.title;
  const past = new Date(event.endDatetime).getTime() < Date.now();
  const spots = event.capacity != null ? Math.max(0, event.capacity - registered) : null;
  const full = spots === 0;

  const cta = !past && event.status === "published" && !full && (
    event.allowRegistration || event.allowVolunteers
      ? event.allowRegistration ? `/register?event=${event.id}` : `/volunteer?event=${event.id}`
      : null
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm font-bold text-sage hover:text-deep">← Double H Community</Link>
      <div className={`relative mt-4 h-64 overflow-hidden rounded-3xl sm:h-80 ${event.coverImage ? "bg-deep" : event.coverGradient}`}>
        {event.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
        <div className="absolute start-4 top-4 flex gap-2"><TypeBadge type={event.type} /><StatusBadge status={event.status} past={past} /></div>
        <h1 className="absolute bottom-5 start-5 end-5 text-2xl font-black text-white sm:text-4xl">{title}</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <p className="text-lg leading-relaxed text-ink/80">{event.description}</p>
          {past && (
            <div className="mt-6 rounded-2xl bg-mist/70 p-5">
              <h2 className="font-extrabold text-deep">{t.common.viewGallery}</h2>
              <div className="mt-3 grid grid-cols-3 gap-3" aria-label="Gallery">
                {[event.coverGradient, "g-past-1", "g-past-2"].map((g, i) => (
                  <div key={i} className={`h-24 rounded-xl ${g} ring-1 ring-deep/10`} />
                ))}
              </div>
            </div>
          )}
          {event.speakerName && (
            <p className="mt-6 rounded-2xl border border-deep/10 bg-white p-5 text-sm"><strong>{t.common.speaker}:</strong> {event.speakerName}</p>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-deep/10 bg-white p-6 shadow-card">
            <dl className="space-y-3 text-sm">
              <div><dt className="font-bold text-sage">{t.common.date}</dt><dd className="font-semibold">{formatDateRange(event.startDatetime, event.endDatetime, locale)}</dd></div>
              <div><dt className="font-bold text-sage">{t.common.duration}</dt><dd className="font-semibold">{durationHours(event.startDatetime, event.endDatetime)}</dd></div>
              <div><dt className="font-bold text-sage">{t.common.location}</dt><dd className="font-semibold">{event.locationName}{event.mapUrl && <> · <a className="underline" href={event.mapUrl} target="_blank" rel="noreferrer">Map</a></>}</dd></div>
              <div><dt className="font-bold text-sage">{t.common.price}</dt><dd className="font-semibold">{event.price === 0 ? t.home.free : `$${event.price}`}</dd></div>
              {spots != null && !past && <div><dt className="font-bold text-sage">Spots</dt><dd className="font-semibold">{t.home.spotsLeft(spots)}</dd></div>}
              {event.allowVolunteers && <div><dt className="font-bold text-sage">Volunteers</dt><dd className="font-semibold">{volunteers}{event.volunteerCapacity ? ` / ${event.volunteerCapacity}` : ""}</dd></div>}
            </dl>
            <p className="mt-3 text-[11px] text-ink/50">{t.common.timezoneNote}</p>
            {cta ? (
              <Link href={cta} className="mt-4 block rounded-2xl bg-pine px-5 py-3.5 text-center font-extrabold text-white hover:bg-deep">
                {event.allowRegistration ? t.home.register : t.home.volunteer} →
              </Link>
            ) : full ? (
              <button disabled className="mt-4 w-full cursor-not-allowed rounded-2xl bg-ink/15 px-5 py-3.5 font-extrabold text-ink/50">{t.home.full}</button>
            ) : (
              <div className="mt-4 rounded-2xl bg-mist px-5 py-3.5 text-center text-sm font-bold text-pine">
                {event.status === "cancelled" ? t.home.cancelled : t.home.completed}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
