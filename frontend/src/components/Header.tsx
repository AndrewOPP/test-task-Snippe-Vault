import type { SnippetQueryState } from '@/types';

interface HeaderProps {
  total: number;
  page: number;
  totalPages: number;
  query: SnippetQueryState;
}

export function Header({ total, page, totalPages, query }: HeaderProps) {
  const activeFilters = query.tags.length + (query.q ? 1 : 0);

  return (
    <section className="rounded-4xl border border-slate-200/80 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <span className="inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-teal-700">
            Mini Snippet Vault
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Snippet Vault
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Store links, notes, and commands in one place, search by title or content, and combine
              tags with facets.
            </p>
          </div>
        </div>

        <a
          href="#snippet-form"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Add snippet
        </a>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Total</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{total}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Filters
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{activeFilters}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Page</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {page}/{totalPages}
          </p>
        </div>
      </div>
    </section>
  );
}
