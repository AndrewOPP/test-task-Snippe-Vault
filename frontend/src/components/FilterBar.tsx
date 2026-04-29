'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { mergeTagFacets } from '@/lib/snippet-helpers';
import type { SnippetQueryState, TagFacet } from '@/types';

interface FilterBarProps {
  availableTags: TagFacet[];
  query: SnippetQueryState;
  isPending?: boolean;
  onSearchChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function FilterBar({
  availableTags,
  query,
  isPending = false,
  onSearchChange,
  onToggleTag,
  onClearFilters,
}: FilterBarProps) {
  const [searchValue, setSearchValue] = useState(query.q);
  const lastQueryRef = useRef(query.q);
  const syncingSearchRef = useRef(false);

  useEffect(() => {
    if (lastQueryRef.current === query.q) {
      return;
    }

    lastQueryRef.current = query.q;
    syncingSearchRef.current = true;

    const timer = window.setTimeout(() => {
      setSearchValue(query.q);
      syncingSearchRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(timer);
      syncingSearchRef.current = false;
    };
  }, [query.q]);

  useEffect(() => {
    if (syncingSearchRef.current || searchValue === query.q) {
      return;
    }

    const timer = window.setTimeout(() => {
      onSearchChange(searchValue);
    }, 280);

    return () => window.clearTimeout(timer);
  }, [onSearchChange, query.q, searchValue]);

  const facets = useMemo(
    () => mergeTagFacets(availableTags, query.tags),
    [availableTags, query.tags],
  );
  const hasFilters = query.q.length > 0 || query.tags.length > 0;

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white/75 p-5 shadow-sm backdrop-blur sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
            Search & facets
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600">
            You can select multiple tags at once. Search works across title and content.
          </p>
        </div>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!hasFilters || isPending}
          className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-200 hover:text-teal-700 disabled:cursor-pointer disabled:opacity-50"
        >
          Clear filters
        </button>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Search</span>
          <div className="relative mt-2">
            <input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              type="search"
              placeholder="Title or content"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
            />
          </div>
        </label>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-slate-700">Tags</span>
            <span className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
              {facets.length} available
            </span>
          </div>

          {facets.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {facets.map((facet) => {
                const selected = query.tags.includes(facet.tag);

                return (
                  <button
                    key={facet.tag}
                    type="button"
                    aria-pressed={selected}
                    disabled={isPending}
                    onClick={() => onToggleTag(facet.tag)}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                      selected
                        ? 'border-teal-300 bg-teal-600 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:text-teal-700'
                    } disabled:cursor-pointer disabled:opacity-50`}
                  >
                    <span>#{facet.tag}</span>
                    <span
                      className={`text-[11px] font-semibold ${selected ? 'text-teal-50' : 'text-slate-400'}`}
                    >
                      {facet.count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-5 text-sm leading-6 text-slate-500">
              Tags will appear after you add the first snippet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
