import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "About us" };

const waysToConnect = [
  { number: "01", title: "Learn", body: "Join hands-on workshops and lectures led by people who love their craft." },
  { number: "02", title: "Volunteer", body: "Lend a hand at community gatherings, markets, cleanups and festivals." },
  { number: "03", title: "Celebrate", body: "Plan a private occasion with support from the Double H team." },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="bg-deep text-mist">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.2fr_.8fr] md:items-center md:py-28">
          <div>
            <p className="eyebrow text-mist/75">About Double H Community</p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.8rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-.06em]">A place to learn, volunteer and celebrate together.</h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-mist/80 sm:text-lg sm:leading-8">Double H Community is a neighborhood hub for learning, volunteering and celebration. We run hands-on workshops, open events, heritage lectures and guided field trips, and help businesses create private occasions.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/join" className="min-h-12 rounded-full bg-mist px-6 py-4 text-sm font-semibold text-deep transition hover:-translate-y-0.5 hover:bg-white">Join the community <span className="ms-2" aria-hidden="true">↗</span></Link>
              <Link href="/#private-event" scroll className="min-h-12 rounded-full border border-mist/40 px-6 py-4 text-sm font-semibold text-mist transition hover:bg-mist/10">Host Your Own Event</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-mist/15 bg-pine p-4 shadow-lift sm:p-6">
            <div className="about-rings" aria-hidden="true" />
            <Image src="/logo-on-dark.png" alt="Double H Community" width={641} height={204} className="relative z-10 h-auto w-full" priority />
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28">
          <div className="max-w-3xl">
            <p className="eyebrow text-pine">How we come together</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.05em] text-deep sm:text-5xl">Many ways to be part of the community.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {waysToConnect.map((item) => (
              <article key={item.number} className="rounded-[1.5rem] border border-deep/10 bg-white p-7 sm:p-8">
                <span className="text-sm font-semibold tabular-nums text-pine">{item.number}</span>
                <h3 className="mt-12 text-2xl font-semibold tracking-tight text-deep">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/70">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
