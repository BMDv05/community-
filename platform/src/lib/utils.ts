export function formatDate(iso: string, locale = "en"): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  }).format(d);
}

export function formatTime(iso: string, locale = "en"): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    hour: "2-digit", minute: "2-digit",
  }).format(d);
}

export function formatDateRange(start: string, end: string, locale = "en"): string {
  return `${formatDate(start, locale)} · ${formatTime(start, locale)} – ${formatTime(end, locale)}`;
}

export function durationHours(start: string, end: string): string {
  const h = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 3600000);
  return h >= 24 ? `${Math.round(h / 24)}d` : `${h}h`;
}

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
