"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@doubleh.community");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setBusy(false);
    if (!res.ok) { setError("Invalid credentials."); return; }
    router.push("/admin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-deep/10 bg-white p-8 shadow-card">
        <h1 className="text-2xl font-black text-deep">Admin Login</h1>
        <p className="mt-1 text-xs text-ink/55">Default: admin@doubleh.community · DoubleH123! (change via env)</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-bold text-deep">Email
            <input className="mt-1 w-full rounded-xl border border-deep/20 px-4 py-2.5" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" />
          </label>
          <label className="block text-sm font-bold text-deep">Password
            <input className="mt-1 w-full rounded-xl border border-deep/20 px-4 py-2.5" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" />
          </label>
          {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
          <button disabled={busy} className="w-full rounded-2xl bg-deep px-6 py-3 font-extrabold text-white hover:bg-pine disabled:opacity-60">
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
