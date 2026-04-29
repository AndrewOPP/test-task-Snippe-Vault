'use client';

import { useCallback, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createSnippet, deleteSnippet, getApiErrorMessage } from '@/lib/api';
import { buildSnippetHref } from '@/lib/snippet-query';
import type { PaginatedSnippets, SnippetInput, SnippetQueryState, TagFacet } from '@/types';
import { FilterBar } from './FilterBar';
import { SnippetForm } from './SnippetForm';
import { SnippetList } from './SnippetList';
import { SnippetPager } from './SnippetPager';

interface SnippetVaultProps {
  data: PaginatedSnippets | null;
  query: SnippetQueryState;
  tagFacets: TagFacet[];
}

export function SnippetVault({ data, query, tagFacets }: SnippetVaultProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [createFormVersion, setCreateFormVersion] = useState(0);

  const navigate = useCallback(
    (patch: Partial<SnippetQueryState>) => {
      const href = buildSnippetHref(pathname, query, patch);

      setActionError(null);

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, query, router, startTransition],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      navigate({ q: value, page: 1 });
    },
    [navigate],
  );

  const handleToggleTag = useCallback(
    (tag: string) => {
      const nextTags = query.tags.includes(tag)
        ? query.tags.filter((currentTag) => currentTag !== tag)
        : [...query.tags, tag];

      navigate({ tags: nextTags, page: 1 });
    },
    [navigate, query.tags],
  );

  const handleClearFilters = useCallback(() => {
    navigate({ q: '', tags: [], page: 1 });
  }, [navigate]);

  const handlePageChange = useCallback(
    (page: number) => {
      navigate({ page });
    },
    [navigate],
  );

  const handleCreateSnippet = useCallback(
    async (values: SnippetInput) => {
      await createSnippet(values);
      setCreateFormVersion((current) => current + 1);
      router.refresh();
    },
    [router],
  );

  const handleDeleteSnippet = useCallback(
    async (id: string) => {
      setActionError(null);
      setDeletingId(id);

      try {
        await deleteSnippet(id);
        router.refresh();
      } catch (error) {
        setActionError(getApiErrorMessage(error, 'Failed to delete the snippet.'));
      } finally {
        setDeletingId(null);
      }
    },
    [router],
  );

  const hasActiveFilters = query.q.length > 0 || query.tags.length > 0;

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_380px]">
      <div className="space-y-6">
        <FilterBar
          availableTags={tagFacets}
          query={query}
          isPending={isPending}
          onSearchChange={handleSearchChange}
          onToggleTag={handleToggleTag}
          onClearFilters={handleClearFilters}
        />

        {actionError ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-700">
            {actionError}
          </div>
        ) : null}

        <SnippetList
          data={data}
          deletingId={deletingId}
          hasActiveFilters={hasActiveFilters}
          onDelete={handleDeleteSnippet}
          onRetry={() => router.refresh()}
          onClearFilters={handleClearFilters}
        />

        {data ? (
          <SnippetPager
            page={data.page}
            totalPages={data.totalPages}
            isPending={isPending}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>

      <aside className="lg:sticky lg:top-6 h-fit">
        <SnippetForm
          key={createFormVersion}
          title="Create snippet"
          description="Fill in the required fields and separate tags with commas. After creating the snippet, the list updates in place."
          submitLabel="Create snippet"
          onSubmit={handleCreateSnippet}
        />
      </aside>
    </section>
  );
}
