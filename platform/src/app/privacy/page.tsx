import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-deep">Privacy Policy</h1>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/75">
        <p>We collect only what we need to run events: your name, contact details, and the answers you give on our forms — plus consent timestamp.</p>
        <p>We use your data to confirm registrations, coordinate volunteers, reply to private-event requests, and send essential updates. We never sell your data.</p>
        <p>You may request export or deletion of your data at any time by emailing <strong>hello@doubleh.community</strong>. Admins can action this from the dashboard.</p>
        <p>Attachments are stored privately with type/size checks (max 10 MB). Logs never contain passwords or full PII.</p>
      </div>
    </div>
  );
}
