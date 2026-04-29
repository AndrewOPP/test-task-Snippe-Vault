import type { PaginatedSnippets, Snippet, SnippetInput } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3002';
const SNIPPETS_BASE_URL = `${API_BASE_URL}/snippets`;

export interface FetchSnippetsParams {
  page?: number;
  limit?: number;
  q?: string;
  tags?: string[];
}

function normalizeTagValues(tags: string[] | undefined): string[] {
  const normalizedTags: string[] = [];
  const seen = new Set<string>();

  for (const tag of tags ?? []) {
    const trimmedTag = tag.trim();
    if (!trimmedTag || seen.has(trimmedTag)) {
      continue;
    }

    seen.add(trimmedTag);
    normalizedTags.push(trimmedTag);
  }

  return normalizedTags;
}

function buildSnippetsUrl(params: FetchSnippetsParams = {}): string {
  const searchParams = new URLSearchParams();

  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('limit', String(params.limit ?? 9));

  if (params.q?.trim()) {
    searchParams.set('q', params.q.trim());
  }

  for (const tag of normalizeTagValues(params.tags)) {
    searchParams.append('tag', tag);
  }

  const queryString = searchParams.toString();

  return queryString ? `${SNIPPETS_BASE_URL}?${queryString}` : SNIPPETS_BASE_URL;
}

async function readErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const payload = await response.json();

    if (Array.isArray(payload?.message)) {
      return payload.message.join(', ');
    }

    if (typeof payload?.message === 'string') {
      return payload.message;
    }

    if (typeof payload?.error === 'string') {
      return payload.error;
    }

    if (typeof payload === 'string') {
      return payload;
    }
  } catch {}

  return response.statusText || fallbackMessage;
}

async function requestJson<T>(
  input: RequestInfo | URL,
  init: RequestInit,
  fallbackMessage: string,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, fallbackMessage));
  }

  return response.json() as Promise<T>;
}

export function getApiErrorMessage(error: unknown, fallbackMessage = 'Something went wrong.') {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export async function fetchSnippets(
  params: FetchSnippetsParams = {},
): Promise<PaginatedSnippets | null> {
  try {
    const response = await fetch(buildSnippetsUrl(params), { cache: 'no-store' });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as PaginatedSnippets;
  } catch {
    return null;
  }
}

export async function fetchSnippetById(id: string): Promise<Snippet> {
  const response = await fetch(`${SNIPPETS_BASE_URL}/${id}`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Snippet not found.'));
  }

  return response.json() as Promise<Snippet>;
}

export async function createSnippet(data: SnippetInput): Promise<Snippet> {
  return requestJson<Snippet>(
    SNIPPETS_BASE_URL,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    'Failed to create the snippet.',
  );
}

export async function updateSnippet(id: string, data: SnippetInput): Promise<Snippet> {
  return requestJson<Snippet>(
    `${SNIPPETS_BASE_URL}/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    'Failed to save changes.',
  );
}

export async function deleteSnippet(id: string): Promise<void> {
  const response = await fetch(`${SNIPPETS_BASE_URL}/${id}`, { method: 'DELETE' });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, 'Failed to delete the snippet.'));
  }
}
