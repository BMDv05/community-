"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { useLang } from "@/components/LanguageProvider";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-20 bg-deep text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">{t.footer.tagline}</p>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">{t.footer.quickLinks}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:underline" href="/workshops">{t.nav.workshops}</Link></li>
            <li><Link className="hover:underline" href="/events">{t.nav.events}</Link></li>
            <li><Link className="hover:underline" href="/lectures">{t.nav.lectures}</Link></li>
            <li><Link className="hover:underline" href="/field-trips">{t.nav.fieldTrips}</Link></li>
            <li><Link className="hover:underline" href="/about">{t.footer.about}</Link></li>
            <li><Link className="hover:underline" href="/privacy">{t.footer.privacy}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">{t.footer.contact}</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>hello@doubleh.community</li>
            <li>+961 1 234 567</li>
            <li>Community Lane 12</li>
            <li><Link className="underline" href="/contact">{t.footer.contactUs}</Link> <Link className="sr-only" href="/admin">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-white/70 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} Double H Community. {t.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
