import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterPrefill } from "@/components/RegisterPrefill";

export const metadata: Metadata = { title: "Register / Volunteer" };

/**
 * The registration/volunteering form is the same membership application
 * form as Join Us, with an event picker on top (pre-filled from
 * ?event=<id> when coming from an event page).
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl p-10">Loading…</div>}>
      <RegisterPrefill />
    </Suspense>
  );
}
