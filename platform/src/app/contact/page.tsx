import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-black text-deep">Contact us</h1>
      <div className="mt-6 rounded-3xl border border-deep/10 bg-white p-6 shadow-card">
        <dl className="space-y-3 text-sm">
          <div><dt className="font-bold text-sage">Email</dt><dd className="font-semibold">hello@doubleh.community</dd></div>
          <div><dt className="font-bold text-sage">Phone</dt><dd className="font-semibold">+961 1 234 567</dd></div>
          <div><dt className="font-bold text-sage">Address</dt><dd className="font-semibold">Community Lane 12</dd></div>
          <div><dt className="font-bold text-sage">Hours</dt><dd className="font-semibold">Mon–Sat, 9:00–18:00</dd></div>
        </dl>
      </div>
    </div>
  );
}
