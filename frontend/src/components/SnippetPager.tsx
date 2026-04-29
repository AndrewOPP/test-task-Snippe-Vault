'use client';

import { buildVisiblePages } from '@/lib/snippet-helpers';

interface SnippetPagerProps {
  page: number;
  totalPages: number;
  isPending?: boolean;
  onPageChange: (page: number) => void;
}

export function SnippetPager({
  page,
  totalPages,
  isPending = false,
  onPageChange,
}: SnippetPagerProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(page, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/75 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={page <= 1 || isPending}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-pointer disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {visiblePages.map((currentPage, index) =>
            currentPage === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-400">
                …
              </span>
            ) : (
              <button
                key={currentPage}
                type="button"
                disabled={isPending}
                onClick={() => onPageChange(currentPage)}
                className={`inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-medium transition ${
                  currentPage === page
                    ? 'border-teal-300 bg-teal-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:text-teal-700'
                } disabled:cursor-pointer disabled:opacity-50`}
              >
                {currentPage}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          disabled={page >= totalPages || isPending}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-pointer disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
