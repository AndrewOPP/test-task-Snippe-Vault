import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SnippetDetails } from '@/components/SnippetDetails';
import { fetchSnippetById, getApiErrorMessage } from '@/lib/api';

interface SnippetPageProps {
  params?:
    | {
        id: string;
      }
    | Promise<{
        id: string;
      }>;
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && /not found/i.test(error.message);
}

export default async function SnippetPage({ params = { id: '' } }: SnippetPageProps) {
  const resolvedParams = await Promise.resolve(params);

  if (!resolvedParams.id) {
    notFound();
  }

  let snippet = null;
  let loadError: unknown = null;

  try {
    snippet = await fetchSnippetById(resolvedParams.id);
  } catch (error) {
    loadError = error;

    if (isNotFoundError(error)) {
      notFound();
    }
  }

  if (!snippet) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 sm:px-6">
        <div className="w-full rounded-4xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Error
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
            Unable to load snippet
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {getApiErrorMessage(loadError, 'Please refresh the page and try again.')}
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

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-teal-700"
        >
          Back to list
        </Link>
      </div>

      <SnippetDetails snippet={snippet} />
    </main>
  );
}
