import type { Metadata } from "next";
import { Suspense } from "react";
import { VolunteerPrefill } from "@/components/RegisterPrefill";

export const metadata: Metadata = { title: "Volunteer" };

/** Dedicated volunteer form (events only), pre-filled from ?event=<id>. */
export default function VolunteerPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl p-10">Loading…</div>}>
      <VolunteerPrefill />
    </Suspense>
  );
}
