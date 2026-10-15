import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEvents, countRegistrations } from "@/lib/store";
import { EventDetailView } from "@/components/EventDetailView";

export async function generateStaticParams() {
  const events = await getEvents();
  return events.filter((e) => e.type === "event").map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const events = await getEvents();
  const e = events.find((x) => x.slug === slug);
  return { title: e ? e.title : "Event" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const events = await getEvents();
  const event = events.find((x) => x.slug === slug && x.type === "event");
  if (!event) notFound();
  const registered = await countRegistrations(event.id, "participant");
  const volunteers = await countRegistrations(event.id, "volunteer");
  return <EventDetailView event={event} registered={registered} volunteers={volunteers} />;
}
