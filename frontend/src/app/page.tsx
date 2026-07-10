import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">Trip Planner</p>
        <h1 className="mt-3 text-4xl font-semibold">Bienvenue sur votre assistant de voyage</h1>
        <p className="mt-3 text-slate-400">
          Créez un compte, connectez-vous puis demandez un plan selon la ville de votre destination.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/register" className="rounded-xl bg-emerald-500 px-4 py-3 text-center font-medium text-slate-950 transition hover:bg-emerald-400">
            Créer un compte
          </Link>
          <Link href="/login" className="rounded-xl border border-slate-700 px-4 py-3 text-center font-medium transition hover:bg-slate-800">
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
