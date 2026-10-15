"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import type { CommunityEvent } from "@/lib/types";
import { EVENT_TYPE_LABEL, EVENT_TYPE_LABEL_AR } from "@/lib/types";
import { useLang } from "@/components/LanguageProvider";
import { EventCard, EmptyState, CardSkeleton } from "@/components/EventCard";

const CATEGORIES = [
  { href: "/workshops", key: "workshops", icon: "workshop", descEn: "Hands-on learning in small groups.", descAr: "تعلّم تطبيقي بمجموعات صغيرة." },
  { href: "/events", key: "events", icon: "event", descEn: "Gatherings shaped by the community.", descAr: "لقاءات يصنعها المجتمع." },
  { href: "/lectures", key: "lectures", icon: "lecture", descEn: "Ideas, stories and heritage talks.", descAr: "أفكار وحكايات وأحاديث تراثية." },
  { href: "/field-trips", key: "fieldTrips", icon: "trip", descEn: "Guided days out together.", descAr: "أيام ميدانية بصحبة المجموعة." },
] as const;

const TAKE_PART = [
  { number: "01", titleKey: "stepOneTitle", bodyKey: "stepOneBody", href: "/events" },
  { number: "02", titleKey: "stepTwoTitle", bodyKey: "stepTwoBody", href: "/register" },
  { number: "03", titleKey: "stepThreeTitle", bodyKey: "stepThreeBody", href: "/join" },
] as const;

export default function HomePage() {
  const { t, locale } = useLang();
  const reduceMotion = useReducedMotion();
  const [data, setData] = useState<{ upcoming: CommunityEvent[]; past: CommunityEvent[] } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/events/home", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Events could not be loaded")))
      .then(setData)
      .catch((error) => { if (error.name !== "AbortError") setData({ upcoming: [], past: [] }); });
    return () => controller.abort();
  }, []);

  const nextEvent = data?.upcoming[0];

  return (
    <div className="home-page">
      <section className="hero-section relative isolate -mt-20 overflow-hidden bg-deep text-mist" aria-labelledby="hero-title">
        <div className="hero-orb hero-orb-one" aria-hidden="true" />
        <div className="hero-orb hero-orb-two" aria-hidden="true" />
        <div className="hero-grid absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto grid min-h-[660px] max-w-7xl items-center gap-12 px-4 pb-24 pt-36 sm:px-6 lg:min-h-[760px] lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:pt-32">
          <div className="hero-copy max-w-3xl">
            <p className="eyebrow mb-6 text-mist/75">{t.home.missionEyebrow}</p>
            <h1 id="hero-title" className="max-w-3xl text-[clamp(3.25rem,8vw,6rem)] font-semibold leading-[.98] tracking-[-.065em]">
              <span className="block"><WordReveal text={t.hero.titleA} reduceMotion={reduceMotion} /></span>
              <span className="block text-mist"><WordReveal text={t.hero.titleB} reduceMotion={reduceMotion} delay={0.18} /></span>
            </h1>
            <motion.p className="mt-7 max-w-2xl text-base leading-7 text-mist/80 sm:text-lg sm:leading-8" initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.25 }}>
              {t.hero.sub}
            </motion.p>
            <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: reduceMotion ? 0 : 0.36 }}>
              <Link href="/volunteer" className="button-primary min-h-12 rounded-full bg-mist px-7 py-4 text-center text-sm font-semibold text-deep transition hover:-translate-y-0.5 hover:bg-white">
                {t.home.volunteer}<span className="ms-3" aria-hidden="true">↗</span>
              </Link>
              <Link href="/register" className="button-secondary min-h-12 rounded-full border border-mist/40 px-7 py-4 text-center text-sm font-semibold text-mist transition hover:border-mist hover:bg-mist/10">
                {t.home.register}
              </Link>
              <Link href="#private-event" className="button-secondary min-h-12 rounded-full border border-mist/40 px-7 py-4 text-center text-sm font-semibold text-mist transition hover:border-mist hover:bg-mist/10">
                {t.hero.cta2}
              </Link>
            </motion.div>
          </div>

          <div className="hero-art relative mx-auto w-full max-w-[500px] lg:ms-auto" aria-label={nextEvent ? `${t.home.nextEvent}: ${locale === "ar" ? nextEvent.titleAr || nextEvent.title : nextEvent.title}` : undefined}>
            <div className="hero-art-frame relative aspect-[.92] overflow-hidden rounded-[2rem] border border-white/20 bg-pine shadow-lift">
              {nextEvent?.coverImage ? (
                <Image src={nextEvent.coverImage} alt="" fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover opacity-75" />
              ) : null}
              <div className="hero-art-wash absolute inset-0" aria-hidden="true" />
              <div className="hero-art-lines absolute inset-0" aria-hidden="true" />
              <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs font-semibold uppercase tracking-[.22em] text-mist/75 sm:inset-x-8 sm:top-8">
                <span>{nextEvent ? t.home.nextEvent : t.home.categories}</span>
              </div>
              {nextEvent ? (
                <Link href={`/events/${nextEvent.slug}`} className="absolute inset-x-6 bottom-6 rounded-2xl border border-mist/20 bg-deep/75 p-5 backdrop-blur-md transition hover:bg-deep/90 sm:inset-x-8 sm:bottom-8 sm:p-6">
                  <p className="eyebrow text-mist/75">{locale === "ar" ? EVENT_TYPE_LABEL_AR[nextEvent.type] : EVENT_TYPE_LABEL[nextEvent.type]}</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-mist sm:text-3xl">{locale === "ar" ? nextEvent.titleAr || nextEvent.title : nextEvent.title}</h2>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-mist/75">{locale === "ar" ? nextEvent.shortDescriptionAr || nextEvent.shortDescription : nextEvent.shortDescription}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mist">{t.home.details}<span aria-hidden="true">↗</span></span>
                </Link>
              ) : (
                <div className="absolute inset-x-6 bottom-6 sm:inset-x-8 sm:bottom-8">
                  <Image src="/logo-on-dark.png" alt="Double H Community" width={641} height={204} className="h-auto w-4/5 max-w-[340px] opacity-95" priority />
                  <p className="mt-6 max-w-xs text-sm leading-6 text-mist/70">{t.hero.sub}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <a href="#about" className="scroll-cue absolute bottom-6 start-1/2 flex -translate-x-1/2 items-center gap-3 text-xs font-medium text-mist/70" aria-label={t.home.missionEyebrow}>
          <span className="scroll-cue-line" aria-hidden="true" />
          <span>{t.home.explore}</span>
        </a>
      </section>

      <section id="about" className="mission-section scroll-mt-24 bg-mist" aria-labelledby="mission-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:grid-cols-[.8fr_1.2fr] md:items-center md:gap-20 md:py-32">
          <div data-reveal className="mission-mark relative min-h-[280px] overflow-hidden rounded-[2rem] bg-deep p-8 sm:min-h-[360px] sm:p-10">
            <div className="mission-rings" aria-hidden="true" />
            <Image src="/logo-on-dark.png" alt="Double H Community" width={641} height={204} className="absolute bottom-8 start-8 h-auto w-[78%] max-w-[360px]" />
          </div>
          <div data-reveal className="mission-copy">
            <p className="eyebrow text-pine">{t.home.missionEyebrow}</p>
            <h2 id="mission-title" className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-.055em] text-ink">{t.home.missionTitle}</h2>
            <p data-mission-text className="mission-text mt-7 max-w-2xl text-lg leading-8 text-ink/65">{t.home.missionBody}</p>
            <Link href="/about" className="text-link mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-deep">{t.nav.about}<span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section id="programs" className="programs-section scroll-mt-24 bg-white" aria-labelledby="programs-title">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
          <div className="section-heading grid gap-5 md:grid-cols-[.7fr_1.3fr] md:items-end" data-reveal>
            <div>
              <p className="eyebrow text-pine">{t.home.programsEyebrow}</p>
              <h2 id="programs-title" className="mt-4 text-4xl font-semibold tracking-[-.05em] text-deep sm:text-5xl">{t.home.categories}</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-ink/65 md:justify-self-end">{t.home.categoriesSub}</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((category, index) => (
              <motion.div key={category.href} data-reveal whileHover={reduceMotion ? undefined : { y: -5 }} transition={{ duration: 0.22 }}>
                <Link href={category.href} className="program-card group flex min-h-[270px] flex-col rounded-[1.5rem] border border-deep/10 bg-mist/65 p-6 transition-colors hover:border-sage/50 hover:bg-deep hover:text-mist sm:min-h-[300px] sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="program-icon grid h-12 w-12 place-items-center rounded-full bg-white text-pine transition-colors group-hover:bg-mist/10 group-hover:text-mist"><CategoryIcon kind={category.icon} /></span>
                    <span className="text-xs font-semibold tabular-nums text-pine group-hover:text-mist/75">0{index + 1}</span>
                  </div>
                  <h3 className="mt-auto pt-12 text-xl font-semibold tracking-tight text-deep group-hover:text-mist">{(t.nav as Record<string, string>)[category.key]}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65 group-hover:text-mist/75">{locale === "ar" ? category.descAr : category.descEn}</p>
                  <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-deep group-hover:text-mist">{t.home.explore}<span aria-hidden="true">↗</span></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="take-part-section relative bg-deep text-mist" aria-labelledby="journey-title">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
          <div data-reveal className="mb-12 max-w-2xl">
            <p className="eyebrow text-mist/75">{t.home.journeyEyebrow}</p>
            <h2 id="journey-title" className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">{t.home.journeyTitle}</h2>
            <p className="mt-4 text-base leading-7 text-mist/70">{t.home.journeySub}</p>
          </div>
          <div className="journey-track grid gap-4 md:grid-cols-3" data-journey-track>
            {TAKE_PART.map((step, index) => (
              <article key={step.number} className="journey-card relative flex min-h-[300px] flex-col rounded-[1.5rem] border border-mist/20 bg-pine/70 p-6 sm:min-h-[350px] sm:p-8" data-reveal>
                <div className="flex items-center justify-between border-b border-mist/20 pb-5">
                  <span className="text-sm font-semibold tabular-nums text-mist/75">{step.number}</span>
                  {index < TAKE_PART.length - 1 && <span className="hidden h-px w-20 bg-sage/70 md:block" aria-hidden="true" />}
                </div>
                <h3 className="mt-8 max-w-xs text-2xl font-semibold leading-tight tracking-tight">{t.home[step.titleKey]}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-mist/70">{t.home[step.bodyKey]}</p>
                <Link href={step.href} className="mt-auto inline-flex min-h-11 items-end gap-2 pt-6 text-sm font-semibold text-mist">{index === 0 ? t.home.viewAll : index === 1 ? t.nav.register : t.nav.join}<span aria-hidden="true">↗</span></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="upcoming-h" className="events-section scroll-mt-24 bg-mist" aria-labelledby="upcoming-title">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
            <div>
              <p className="eyebrow text-pine">{t.home.eventSectionEyebrow}</p>
              <h2 id="upcoming-title" className="mt-4 text-4xl font-semibold tracking-[-.05em] text-deep sm:text-5xl">{t.home.upcoming}</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-ink/65">{t.home.upcomingSub}</p>
            </div>
            <Link href="/events" className="button-outline min-h-11 self-start rounded-full border border-deep/25 px-5 py-3 text-sm font-semibold text-deep transition hover:bg-deep hover:text-mist sm:self-auto">{t.home.viewAll}<span className="ms-2" aria-hidden="true">↗</span></Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {!data && [0, 1, 2].map((index) => <CardSkeleton key={index} />)}
            {data && data.upcoming.length === 0 && <div className="sm:col-span-2 lg:col-span-3"><EmptyState title={t.home.emptyUpcoming} actionHref="/events" actionLabel={t.home.browsePast} /></div>}
            {data?.upcoming.map((event, index) => (
              <motion.div key={event.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {data && data.past.length > 0 && (
        <section className="past-section bg-white" aria-labelledby="past-title">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end" data-reveal>
              <div>
                <h2 id="past-title" className="text-4xl font-semibold tracking-[-.05em] text-deep sm:text-5xl">{t.home.pastHighlights}</h2>
                <p className="mt-3 text-base leading-7 text-ink/65">{t.home.pastSub}</p>
              </div>
              <Link href="/events" className="button-outline min-h-11 self-start rounded-full border border-deep/25 px-5 py-3 text-sm font-semibold text-deep transition hover:bg-deep hover:text-mist sm:self-auto">{t.home.viewAll}<span className="ms-2" aria-hidden="true">↗</span></Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.past.slice(0, 3).map((event, index) => (
                <motion.div key={event.id} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}>
                  <EventCard event={event} past />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="private-event" className="scroll-mt-24 bg-white px-4 pb-4 sm:px-6" aria-labelledby="own-event-title">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-deep px-6 py-12 text-mist sm:px-12 sm:py-16 lg:px-16" data-reveal>
          <div className="hero-pattern absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <h2 id="own-event-title" className="text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">{t.home.ctaTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-mist/75">{t.home.ctaSub}</p>
            </div>
            <Link href="/request-event" className="min-h-12 shrink-0 rounded-full bg-mist px-7 py-4 text-sm font-semibold text-deep transition hover:-translate-y-0.5 hover:bg-white">{t.hero.cta2}<span className="ms-3" aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>

      <section className="join-section bg-white px-4 pb-24 sm:px-6 md:pb-32" aria-labelledby="join-title">
        <div className="join-panel relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-pine px-6 py-12 text-mist sm:px-12 sm:py-16 lg:px-16" data-reveal>
          <div className="join-ornament" aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-mist/65">{t.nav.join}</p>
              <h2 id="join-title" className="mt-4 text-4xl font-semibold leading-tight tracking-[-.05em] sm:text-5xl">{t.home.joinTitle}</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-mist/75">{t.home.joinSub}</p>
            </div>
            <Link href="/join" className="button-primary min-h-12 shrink-0 rounded-full bg-mist px-7 py-4 text-sm font-semibold text-deep transition hover:-translate-y-0.5 hover:bg-white">{t.nav.join}<span className="ms-3" aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryIcon({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.65, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    workshop: <><path d="m14.5 6.5 3 3M4 20l4.5-1 9.8-9.8a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z" /><path d="M12 5h-7v14h14v-7" /></>,
    event: <><path d="M4 8h16v12H4zM8 4v4m8-4v4M4 12h16" /><path d="m9 16 2 2 4-4" /></>,
    lecture: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M4 17a2.5 2.5 0 0 1 2.5-2.5H20M8 7h8M8 10h6" /></>,
    trip: <><path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" /><path d="M9 4v13.5m6-11v13.5" /></>,
  };
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" {...common}>{paths[kind] || paths.event}</svg>;
}

function WordReveal({ text, reduceMotion, delay = 0 }: { text: string; reduceMotion: boolean | null; delay?: number }) {
  return <>{text.split(" ").map((word, index) => <span key={`${word}-${index}`} className="me-[.16em] inline-block overflow-hidden align-top"><motion.span className="block" initial={{ y: reduceMotion ? 0 : "110%", opacity: reduceMotion ? 1 : 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}>{word}</motion.span></span>)}</>;
}
