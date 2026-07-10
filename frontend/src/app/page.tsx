import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-slate-800/80 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(2,8,23,0.55)] backdrop-blur-sm sm:p-8 lg:p-10">
        <div className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium tracking-[0.25em] text-cyan-300">
          TRIP PLANNER
        </div>
        <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          Planifiez vos voyages avec une interface claire et moderne.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Créez un compte, connectez-vous et obtenez instantanément la météo ainsi que des idées d’activités pour votre destination.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/register"
            className="rounded-2xl bg-emerald-400 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-slate-700 bg-slate-800/70 px-5 py-3 text-center font-semibold text-slate-100 transition hover:border-cyan-400/50 hover:bg-slate-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}
