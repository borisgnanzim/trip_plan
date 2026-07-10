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
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-black/30">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Trip Planner</p>
            <h1 className="text-3xl font-semibold">Planifiez votre voyage</h1>
          </div>
          <button
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm transition hover:bg-slate-800"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-xl font-medium">Choisir une ville</h2>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2"
                placeholder="Entrez une ville"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <button
                className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400"
                onClick={handlePlan}
                disabled={loading}
              >
                {loading ? "Chargement..." : "Afficher la météo et les activités"}
              </button>
            </div>
            {message ? <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300">{message}</p> : null}
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            {plan ? (
              <>
                <h2 className="text-xl font-medium">Résultat pour {plan.city}</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Météo</p>
                    <p className="mt-2 text-2xl font-semibold">{plan.weather.temperature}°C</p>
                    <p className="text-slate-400">{plan.weather.description}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 p-4">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Activités</p>
                    <ul className="mt-2 space-y-2">
                      {plan.activities.map((activity, index) => (
                        <li key={`${activity.name}-${index}`} className="rounded-lg bg-slate-900 px-3 py-2">
                          <p className="font-medium">{activity.name}</p>
                          <p className="text-sm text-slate-400">{activity.category}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-400">
                Sélectionnez une ville pour voir la météo et les activités recommandées.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
