"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("stringst");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("Login response status:", res.status);
      const data = await res.json();
      console.log("Login response:", data);
      if (!res.ok) throw new Error(data.detail || "Connexion impossible");

      localStorage.setItem("trip_token", data.access_token || "");
      router.push("/plan");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-slate-100 sm:px-6">
      <div className="w-full max-w-md overflow-hidden rounded-[24px] border border-slate-800/80 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(2,8,23,0.55)] backdrop-blur-sm sm:p-8">
        <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium tracking-[0.25em] text-cyan-300">
          TRIP PLANNER
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-white">Connexion</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Accédez à votre espace de planification en toute simplicité.
        </p>

        <div className="mt-6 space-y-3">
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Email</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="vous@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block text-sm text-slate-300">
            <span className="mb-2 block">Mot de passe</span>
            <input
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>

        <p className="mt-5 text-sm text-slate-400">
          Pas encore de compte ? <Link href="/register" className="font-medium text-cyan-300 hover:text-cyan-200">Créer un compte</Link>
        </p>

        {message ? <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm leading-6 text-slate-300">{message}</p> : null}
      </div>
    </main>
  );
}
