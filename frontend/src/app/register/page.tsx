"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Inscription impossible");
      setMessage("Compte créé avec succès. Connectez-vous pour continuer.");
      setTimeout(() => router.push("/login"), 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Trip Planner</p>
        <h1 className="mt-3 text-3xl font-semibold">Créer un compte</h1>
        <p className="mt-2 text-sm text-slate-400">Commencez à planifier vos voyages.</p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
            placeholder="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full rounded-xl bg-emerald-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-emerald-400"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </div>

        <p className="mt-4 text-sm text-slate-400">
          Déjà inscrit ? <Link href="/login" className="text-cyan-400">Se connecter</Link>
        </p>

        {message ? <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">{message}</p> : null}
      </div>
    </main>
  );
}
