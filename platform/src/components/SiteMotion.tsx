"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SiteMotion() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.085 });
    lenis.on("scroll", () => ScrollTrigger.update());
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (progress) {
      gsap.to(progress, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
      });
    }

    const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    reveals.forEach((element) => {
      gsap.fromTo(element, { y: 26, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: element, start: "top 88%", once: true },
      });
    });

    const missionText = document.querySelector<HTMLElement>("[data-mission-text]");
    if (missionText) {
      gsap.fromTo(missionText, { color: "rgba(22,25,25,.48)" }, {
        color: "#161919",
        ease: "none",
        scrollTrigger: { trigger: missionText, start: "top 78%", end: "top 38%", scrub: 0.5 },
      });
    }
    const missionMark = document.querySelector<HTMLElement>(".mission-mark");
    if (missionMark) {
      gsap.fromTo(missionMark, { clipPath: "inset(0 0 100% 0 round 32px)" }, {
        clipPath: "inset(0 0 0% 0 round 32px)",
        ease: "power2.out",
        scrollTrigger: { trigger: missionMark, start: "top 82%", end: "center 58%", scrub: 0.6 },
      });
    }

    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      const track = document.querySelector<HTMLElement>("[data-journey-track]");
      if (!track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 96);
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top 58%",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => {
      gsap.ticker.remove(ticker);
      media.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}
