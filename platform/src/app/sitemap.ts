import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const pages = ["", "/workshops", "/events", "/lectures", "/field-trips", "/join", "/register", "/volunteer", "/request-event", "/about", "/contact", "/privacy"];
  return pages.map((p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "weekly", priority: p === "" ? 1 : 0.7 }));
}
