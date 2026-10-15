"use client";

import Link from "next/link";
import Image from "next/image";
import type { CommunityEvent } from "@/lib/types";
import { EVENT_TYPE_LABEL, EVENT_TYPE_LABEL_AR } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { formatDateRange } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  workshop: "bg-pine text-white",
  event: "bg-sage text-white",
  lecture: "bg-deep text-white",
  field_trip: "bg-pine text-white",
};

export function TypeBadge({ type }: { type: CommunityEvent["type"] }) {
  const { locale } = useLang();
  const label = locale === "ar" ? EVENT_TYPE_LABEL_AR[type] : EVENT_TYPE_LABEL[type];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${TYPE_STYLES[type]}`}>
      {label}
    </span>
  );
}

export function StatusBadge({ status, past }: { status: string; past?: boolean }) {
  const { t } = useLang();
  if (status === "cancelled")
    return <span className="inline-flex items-center rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{t.home.cancelled}</span>;
  if (past)
    return <span className="inline-flex items-center rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">{t.home.completed}</span>;
  return <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-deep">{t.home.upcomingBadge}</span>;
}

export function EventCard({ event, past, spots }: { event: CommunityEvent; past?: boolean; spots?: number | null }) {
  const { t, locale } = useLang();
  const title = locale === "ar" && event.titleAr ? event.titleAr : event.title;
  const short = locale === "ar" && event.shortDescriptionAr ? event.shortDescriptionAr : event.shortDescription;
  const categoryPath =
    event.type === "workshop" ? "workshops" : event.type === "lecture" ? "lectures" : event.type === "field_trip" ? "field-trips" : "events";
  const detailsHref = `/${categoryPath}/${event.slug}`;

  const actionLabel =
    event.type === "event" && event.allowVolunteers && !event.allowRegistration ? t.home.volunteer : t.home.register;

  return (
    <article className="event-card group flex flex-col overflow-hidden rounded-[1.5rem] border border-deep/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className={`relative h-44 ${event.coverImage ? "" : event.coverGradient}`} role="img" aria-label={title}>
        {event.coverImage && (
          <Image src={event.coverImage} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        <div className="absolute start-3 top-3 flex gap-1.5">
          <TypeBadge type={event.type} />
          <StatusBadge status={event.status} past={past} />
        </div>
        <div className="absolute bottom-3 start-3 end-3 flex items-end justify-between gap-2">
          <span className="rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold text-deep">
            {formatDateRange(event.startDatetime, event.endDatetime, locale)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-extrabold leading-snug text-ink">{title}</h3>
        <p className="text-sm leading-relaxed text-ink/65">{short}</p>
        <p className="flex items-center gap-2 text-sm font-medium text-ink/70"><LocationIcon />{event.locationName}</p>
        <div className="mt-1 flex items-center gap-2 text-xs font-bold">
          {event.price === 0 ? (
            <span className="rounded-full bg-mist px-2.5 py-1 text-pine">{t.home.free}</span>
          ) : (
            <span className="rounded-full bg-mist px-2.5 py-1 text-pine">${event.price}</span>
          )}
          {spots != null && !past && event.status === "published" && (
            <span className="rounded-full bg-deep/5 px-2.5 py-1 text-deep">{t.home.spotsLeft(spots)}</span>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-3">
          <Link href={detailsHref} className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-deep/15 px-3 py-2.5 text-center text-sm font-semibold text-deep transition-colors hover:bg-mist">
            {past ? t.common.viewGallery : t.home.details}
          </Link>
          {!past && event.status === "published" && (
            <Link
              href={event.allowRegistration ? `/register?event=${event.id}` : `/volunteer?event=${event.id}`}
              className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-pine px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-deep"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export function EmptyState({ title, sub, actionHref, actionLabel }: { title: string; sub?: string; actionHref?: string; actionLabel?: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-sage/50 bg-mist/60 px-6 py-14 text-center">
      <div className="text-sage" aria-hidden="true"><CommunityIcon /></div>
      <h3 className="mt-3 text-lg font-extrabold text-deep">{title}</h3>
      {sub && <p className="mt-1 max-w-md text-sm text-ink/60">{sub}</p>}
      {actionHref && (
        <Link href={actionHref} className="mt-4 rounded-full bg-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-pine">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function LocationIcon() {
  return <svg aria-hidden="true" className="shrink-0 text-sage" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

function CommunityIcon() {
  return <svg aria-hidden="true" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7.5-4.6-7.5-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 6.4-7.5 11-7.5 11Z" /><path d="M8.5 13.5h7M12 10v7" /></svg>;
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-deep/10 bg-white" aria-hidden="true">
      <div className="h-44 animate-pulse bg-mist" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-2/3 rounded bg-mist" />
        <div className="h-3 w-full rounded bg-mist" />
        <div className="h-3 w-1/2 rounded bg-mist" />
      </div>
    </div>
  );
}
