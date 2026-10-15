import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SiteMotion } from "@/components/SiteMotion";

export const metadata: Metadata = {
  title: {
    default: "Double H Community — Workshops, Events, Lectures & Field Trips",
    template: "%s · Double H Community",
  },
  description:
    "A community hub for workshops, events, lectures and field trips. Register, volunteer, or request your private event.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Double H Community",
    description: "Learn. Volunteer. Celebrate. Together.",
    type: "website",
    images: [{ url: "/logo-on-light.png", width: 708, height: 298, alt: "Double H Community" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <LanguageProvider>
          <SiteMotion />
          <Navbar />
          <main id="main-content" tabIndex={-1} className="min-h-[60vh] pt-20">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
