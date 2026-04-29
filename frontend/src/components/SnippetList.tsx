'use client';

import type { PaginatedSnippets } from '@/types';
import { SnippetCard } from './SnippetCard';
import { StatusCard } from './StatusCard';

interface SnippetListProps {
  data: PaginatedSnippets | null;
  deletingId: string | null;
  hasActiveFilters: boolean;
  onDelete: (id: string) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function SnippetList({
  data,
  deletingId,
  hasActiveFilters,
  onDelete,
  onRetry,
  onClearFilters,
}: SnippetListProps) {
  if (!data) {
    return (
      <StatusCard
        title="Unable to load snippets"
        description="Check whether the server is running and try again."
        action={
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
          >
            Refresh
          </button>
        }
      />
    );
  }

  if (data.items.length === 0) {
    return (
      <StatusCard
        title={hasActiveFilters ? 'No results found' : 'Nothing here yet'}
        description={
          hasActiveFilters
            ? 'Try clearing the tags or search and view the results again.'
            : 'Add your first snippet using the form on the right, then try search and facets.'
        }
        action={
          hasActiveFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Clear filters
            </button>
          ) : (
            <a
              href="#snippet-form"
              className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Go to form
            </a>
          )
        }
      />
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
            Snippets
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Showing {data.items.length} of {data.total}.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Page {data.page} of {data.totalPages}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((item) => (
          <SnippetCard
            key={item._id}
            snippet={item}
            isDeleting={deletingId === item._id}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
