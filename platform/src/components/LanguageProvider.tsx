"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Locale } from "@/lib/i18n";

const Ctx = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: typeof dict.en }>({
  locale: "en",
  setLocale: () => {},
  t: dict.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = (localStorage.getItem("dh-locale") as Locale) || "en";
    if (saved === "ar" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("font-arabic", locale === "ar");
    localStorage.setItem("dh-locale", locale);
  }, [locale]);

  const setLocale = (l: Locale) => setLocaleState(l);

  return <Ctx.Provider value={{ locale, setLocale, t: dict[locale] as typeof dict.en }}>{children}</Ctx.Provider>;
}

export function useLang() {
  return useContext(Ctx);
}
