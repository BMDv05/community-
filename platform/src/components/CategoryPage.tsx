"use client";

import { useEffect, useState } from "react";
import type { CommunityEvent, EventType } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { EventCard, EmptyState, CardSkeleton } from "@/components/EventCard";
import { cx } from "@/lib/utils";

export function CategoryPage({ type, titleEn, titleAr, descEn, descAr }: {
  type: EventType; titleEn: string; titleAr: string; descEn: string; descAr: string;
}) {
  const { t, locale } = useLang();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [items, setItems] = useState<CommunityEvent[] | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setItems(null);
    fetch(`/api/events?type=${type}&status=${tab}&page=${page}&limit=9`)
      .then((r) => r.json())
      .then((d) => { setItems(d.items); setPages(d.pages || 1); })
      .catch(() => setItems([]));
  }, [type, tab, page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-black text-deep">{locale === "ar" ? titleAr : titleEn}</h1>
      <p className="mt-1 text-sm text-ink/60">{locale === "ar" ? descAr : descEn}</p>

      <div className="mt-6 inline-flex rounded-full bg-mist p-1" role="tablist" aria-label="Upcoming or past">
        {(["upcoming", "past"] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => { setTab(k); setPage(1); }}
            className={cx(
              "rounded-full px-6 py-2.5 text-sm font-bold",
              tab === k ? "bg-deep text-white shadow" : "text-pine hover:text-deep"
            )}
          >
            {k === "upcoming" ? t.home.upcoming : t.home.past}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {!items && [0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
        {items && items.length === 0 && (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title={tab === "upcoming" ? t.home.emptyUpcoming : t.home.emptyPast} />
          </div>
        )}
        {items?.map((e) => <EventCard key={e.id} event={e} past={tab === "past"} />)}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={cx("h-10 w-10 rounded-full text-sm font-bold", p === page ? "bg-deep text-white" : "bg-mist text-pine hover:bg-sage hover:text-white")}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
