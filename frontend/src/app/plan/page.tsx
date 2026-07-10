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
    <main className="min-h-screen px-4 py-8 text-slate-100 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-[0_25px_80px_rgba(2,8,23,0.65)] backdrop-blur-xl sm:p-6 lg:p-8">
        <div className="flex flex-col gap-5 rounded-3xl border border-cyan-400/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800/90 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Trip Planner
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Créez votre itinéraire en quelques secondes
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-[15px]">
              Obtenez une vue claire sur la météo, l’ambiance du lieu et les meilleures activités à faire.
            </p>
          </div>
          <button
            className="rounded-2xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-slate-700"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-inner shadow-black/20">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-lg text-cyan-300">
                ✦
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Choisir une destination</h2>
                <p className="text-sm text-slate-400">Saisissez une ville pour générer un aperçu complet.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block font-medium">Ville</span>
                <input
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Paris, Lyon, Marrakech..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <button
                className="w-full rounded-2xl bg-linear-to-r from-cyan-400 to-sky-500 px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                onClick={handlePlan}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Afficher la météo et les activités"}
              </button>
            </div>

            {message ? (
              <p className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-sm leading-6 text-slate-300 wrap-break-word whitespace-pre-line">
                {message}
              </p>
            ) : null}
          </section>

          <section className="min-w-0 rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-inner shadow-black/20">
            {plan ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-lg text-emerald-300">
                    ✈
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white wrap-break-word">Résultat pour {plan.city}</h2>
                    <p className="text-sm text-slate-400">Un aperçu rapide, propre et lisible.</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="min-w-0 overflow-hidden rounded-[20px] border border-cyan-400/10 bg-linear-to-br from-cyan-500/10 to-slate-900 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Météo</p>
                    <p className="mt-3 text-4xl font-semibold text-white">{plan.weather.temperature}°C</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300 break-all whitespace-pre-line">
                      {plan.weather.description}
                    </p>
                  </div>

                  <div className="min-w-0 overflow-hidden rounded-[20px] border border-emerald-400/10 bg-linear-to-br from-emerald-500/10 to-slate-900 p-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Activités</p>
                    <ul className="mt-3 space-y-2">
                      {plan.activities.map((activity, index) => (
                        <li key={`${activity.name}-${index}`} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-2.5">
                          <p className="font-medium text-white break-all">{activity.name}</p>
                          <p className="mt-1 text-sm text-slate-400 break-all">{activity.category}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-80 items-center justify-center rounded-[20px] border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-sm leading-7 text-slate-400">
                Sélectionnez une ville pour voir la météo et les activités recommandées.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
