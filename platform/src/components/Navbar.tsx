"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useLang } from "@/components/LanguageProvider";
import { cx } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 48);
      if (y < 96) setHidden(false);
      else if (Math.abs(y - lastY) > 5) setHidden(y > lastY);
      lastY = y;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const links = [
    { href: isHome ? "#about" : "/about", route: "/about", label: t.nav.about },
    { href: isHome ? "#programs" : "/workshops", route: "/workshops", label: t.nav.programs },
    { href: isHome ? "#upcoming-h" : "/events", route: "/events", label: t.nav.events },
    { href: "/contact", route: "/contact", label: t.nav.contact },
  ];
  const light = isHome && !scrolled;

  return (
    <header className={cx(
      "site-header fixed inset-x-0 top-0 z-50 transition-transform duration-300",
      hidden && "-translate-y-full",
      light ? "site-header-hero" : isHome ? "site-header-solid" : "site-header-light"
    )}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Double H Community home" className="shrink-0 rounded-md">
          <Logo variant={light ? "light" : "dark"} compact priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.route ? "page" : undefined} className={cx("nav-link rounded-full px-3.5 py-2 text-sm font-medium", light ? "text-white/85 hover:text-white" : "text-ink/80 hover:text-deep", pathname === link.route && !light && "bg-mist")}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className={cx("min-h-11 rounded-full px-3 text-sm font-semibold transition-colors", light ? "text-white hover:bg-white/10" : "text-pine hover:bg-mist")}
            aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className={cx("min-h-11 min-w-11 rounded-full px-3 text-sm font-semibold", light ? "text-white" : "text-pine")}
            aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
          >
            {locale === "en" ? "ع" : "EN"}
          </button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={open ? "mobile-navigation" : undefined}
            aria-label={open ? t.nav.close : t.nav.menu}
            className={cx("grid min-h-11 min-w-11 place-items-center rounded-full border", light ? "border-white/35 text-white" : "border-deep/15 text-deep")}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" className="border-t border-deep/10 bg-mist px-4 py-3 shadow-lift lg:hidden" aria-label="Mobile">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.route ? "page" : undefined} className={cx("min-h-11 rounded-xl px-4 py-3 text-sm font-semibold text-ink hover:bg-white", pathname === link.route && "bg-white")}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function MenuIcon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
}

function CloseIcon() {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}
