import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6">
      <div className="w-full rounded-4xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          404
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
          Snippet not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The record may have been deleted or the link points to a missing ID.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Back to list
          </Link>
        </div>
      </div>
    </main>
  );
}
