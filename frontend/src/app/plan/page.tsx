"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

type PlanResponse = {
  city: string;
  weather: { temperature: number; description: string };
  activities: Array<{ name: string; category: string }>;
};

export default function PlanPage() {
  const router = useRouter();
  const [city, setCity] = useState("Paris");
  const [token, setToken] = useState("");
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("trip_token");
    if (!storedToken) {
      router.replace("/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  async function handlePlan() {
    if (!token) {
      setMessage("Vous devez être connecté.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ city }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Impossible de générer le plan");
      setPlan(data as PlanResponse);
      setMessage("Plan généré avec succès.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erreur inattendue");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("trip_token");
    router.replace("/login");
  }

  return (
    <main className="min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-900/80 p-5 shadow-[0_20px_80px_rgba(2,8,23,0.55)] backdrop-blur-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium tracking-[0.25em] text-cyan-300">
              TRIP PLANNER
            </div>
            <h1 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Planifiez votre voyage
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Découvrez la météo et des activités adaptées à votre destination.
            </p>
          </div>
          <button
            className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-700"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="min-w-0 rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold text-white">Choisir une ville</h2>
            <div className="mt-4 space-y-3">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Ville</span>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Paris, Lyon, Marrakech..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <button
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={handlePlan}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Afficher la météo et les activités"}
              </button>
            </div>
            {message ? <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm leading-6 text-slate-300 break-words whitespace-pre-line">{message}</p> : null}
          </section>

          <section className="min-w-0 rounded-[24px] border border-slate-800 bg-slate-950/70 p-5">
            {plan ? (
              <>
                <h2 className="text-xl font-semibold text-white break-words">Résultat pour {plan.city}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Météo</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{plan.weather.temperature}°C</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400 break-all whitespace-pre-line">{plan.weather.description}</p>
                  </div>
                  <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Activités</p>
                    <ul className="mt-3 space-y-2">
                      {plan.activities.map((activity, index) => (
                        <li key={`${activity.name}-${index}`} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
                          <p className="font-medium text-white break-all">{activity.name}</p>
                          <p className="mt-1 text-sm text-slate-400 break-all">{activity.category}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm leading-7 text-slate-400">
                Sélectionnez une ville pour voir la météo et les activités recommandées.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
