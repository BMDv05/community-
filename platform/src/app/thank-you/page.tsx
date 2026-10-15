"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";

function Inner() {
  const params = useSearchParams();
  const { t } = useLang();
  const kind = params.get("kind") ?? "register";
  const isRequest = kind === "request";
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-pine text-3xl text-white" aria-hidden="true">✓</div>
      <h1 className="mt-6 text-3xl font-black text-deep">{isRequest ? t.form2.successTitle : t.form1.successTitle}</h1>
      <p className="mt-2 text-ink/65">{isRequest ? t.form2.successSub : t.form1.successSub}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-2xl bg-deep px-6 py-3 font-bold text-white hover:bg-pine">{t.nav.home}</Link>
        <Link href="/events" className="rounded-2xl border-2 border-pine px-6 py-2.5 font-bold text-pine hover:bg-pine hover:text-white">{t.home.viewAll}</Link>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return <Suspense><Inner /></Suspense>;
}
