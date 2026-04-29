import type { Snippet, SnippetQueryState, TagFacet } from '@/types';

type RawQueryParams = Record<string, string | string[] | undefined>;

function normalizeTagValues(value: string | string[] | undefined): string[] {
  const rawValues = Array.isArray(value) ? value : value ? value.split(',') : [];
  const tags: string[] = [];
  const seen = new Set<string>();

  for (const rawValue of rawValues) {
    const tag = rawValue.trim();
    if (!tag || seen.has(tag)) {
      continue;
    }

    seen.add(tag);
    tags.push(tag);
  }

  return tags;
}

function normalizePage(value: string | string[] | undefined): number {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(normalizedValue ?? '', 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

function normalizeSearch(value: string | string[] | undefined): string {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  return normalizedValue ? normalizedValue.trim() : '';
}

export function parseSnippetQuery(searchParams: RawQueryParams): SnippetQueryState {
  return {
    page: normalizePage(searchParams.page),
    q: normalizeSearch(searchParams.q),
    tags: normalizeTagValues(searchParams.tag),
  };
}

function buildSearchParams(query: SnippetQueryState): URLSearchParams {
  const params = new URLSearchParams();
  const normalizedPage = Number.isFinite(query.page) && query.page > 0 ? Math.floor(query.page) : 1;

  params.set('page', String(normalizedPage));

  if (query.q.trim()) {
    params.set('q', query.q.trim());
  }

  for (const tag of normalizeTagValues(query.tags)) {
    params.append('tag', tag);
  }

  return params;
}

export function buildSnippetHref(
  pathname: string,
  currentQuery: SnippetQueryState,
  patch: Partial<SnippetQueryState>,
): string {
  const nextQuery: SnippetQueryState = {
    page: patch.page ?? currentQuery.page,
    q: patch.q ?? currentQuery.q,
    tags: patch.tags ?? currentQuery.tags,
  };
  const params = buildSearchParams(nextQuery);
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function collectTagFacets(items: Snippet[]): TagFacet[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const tag of item.tags) {
      const normalizedTag = tag.trim();
      if (!normalizedTag) {
        continue;
      }

      counts.set(normalizedTag, (counts.get(normalizedTag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([tag, count]) => ({ tag, count }));
}
