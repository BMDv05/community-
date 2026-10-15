"use client";

import { useSearchParams } from "next/navigation";
import { JoinForm } from "@/components/JoinForm";

/** /register renders the participant form, pre-selecting ?event=<id>. */
export function RegisterPrefill() {
  const params = useSearchParams();
  return <JoinForm eventPicker fixedKind="participant" initialEventId={params.get("event") ?? ""} />;
}

/** /volunteer renders the volunteer form, pre-selecting ?event=<id>. */
export function VolunteerPrefill() {
  const params = useSearchParams();
  return <JoinForm eventPicker fixedKind="volunteer" initialEventId={params.get("event") ?? ""} />;
}
