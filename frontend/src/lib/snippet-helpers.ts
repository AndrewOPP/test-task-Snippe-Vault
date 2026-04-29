import {
  SNIPPET_CONTENT_MAX_LENGTH,
  SNIPPET_CONTENT_PREVIEW_MAX_LENGTH,
  SNIPPET_TAG_MAX_LENGTH,
  SNIPPET_TAG_PREVIEW_MAX_LENGTH,
  SNIPPET_TAGS_TEXT_MAX_LENGTH,
  SNIPPET_TITLE_MAX_LENGTH,
  SNIPPET_TITLE_PREVIEW_MAX_LENGTH,
} from '../constants';
import type { SnippetInput, SnippetType, TagFacet } from '../types';

export interface SnippetFormState {
  title: string;
  content: string;
  tagsText: string;
  type: SnippetType;
}

export type SnippetFormErrors = Partial<Record<'title' | 'content' | 'type', string>>;

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatSnippetDate(value: string): string {
  return SHORT_DATE_FORMATTER.format(new Date(value));
}

export function formatSnippetDateTime(value: string): string {
  return DATE_TIME_FORMATTER.format(new Date(value));
}

function normalizeSnippetText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function shortenSnippetText(value: string, maxLength: number): string {
  const normalizedValue = normalizeSnippetText(value);

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}…`;
}

export function shortenSnippetContent(
  value: string,
  maxLength = SNIPPET_CONTENT_PREVIEW_MAX_LENGTH,
): string {
  return shortenSnippetText(value, maxLength);
}

export function shortenSnippetTitle(
  value: string,
  maxLength = SNIPPET_TITLE_PREVIEW_MAX_LENGTH,
): string {
  return shortenSnippetText(value, maxLength);
}

export function shortenSnippetTag(
  value: string,
  maxLength = SNIPPET_TAG_PREVIEW_MAX_LENGTH,
): string {
  return shortenSnippetText(value, maxLength);
}

export function mergeTagFacets(availableTags: TagFacet[], selectedTags: string[]): TagFacet[] {
  const facetMap = new Map<string, number>();

  for (const facet of availableTags) {
    facetMap.set(facet.tag, facet.count);
  }

  for (const tag of selectedTags) {
    if (!facetMap.has(tag)) {
      facetMap.set(tag, 0);
    }
  }

  return Array.from(facetMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
}

export function buildVisiblePages(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  if (left > 2) {
    pages.push('ellipsis');
  }

  for (let currentPage = left; currentPage <= right; currentPage += 1) {
    pages.push(currentPage);
  }

  if (right < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

function clampSnippetText(value: string, maxLength: number): string {
  return value.slice(0, maxLength);
}

export function toSnippetFormState(values?: SnippetInput): SnippetFormState {
  return values
    ? {
        title: clampSnippetText(values.title, SNIPPET_TITLE_MAX_LENGTH),
        content: clampSnippetText(values.content, SNIPPET_CONTENT_MAX_LENGTH),
        tagsText: clampSnippetText(values.tags.join(', '), SNIPPET_TAGS_TEXT_MAX_LENGTH),
        type: values.type,
      }
    : {
        title: '',
        content: '',
        tagsText: '',
        type: 'note',
      };
}

export function parseSnippetTags(value: string): string[] {
  const tags: string[] = [];
  const seen = new Set<string>();

  for (const tag of value.split(',')) {
    const normalizedTag = tag.trim();
    if (!normalizedTag || seen.has(normalizedTag)) {
      continue;
    }

    if (normalizedTag.length > SNIPPET_TAG_MAX_LENGTH) {
      continue;
    }

    seen.add(normalizedTag);
    tags.push(normalizedTag);
  }

  return tags;
}

export function validateSnippetForm(values: SnippetFormState): SnippetFormErrors {
  const errors: SnippetFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Please enter a snippet title.';
  } else if (values.title.length > SNIPPET_TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${SNIPPET_TITLE_MAX_LENGTH} characters or less.`;
  }

  if (!values.content.trim()) {
    errors.content = 'Content cannot be empty.';
  } else if (values.content.length > SNIPPET_CONTENT_MAX_LENGTH) {
    errors.content = `Content must be ${SNIPPET_CONTENT_MAX_LENGTH} characters or less.`;
  }

  if (!values.type) {
    errors.type = 'Please choose a snippet type.';
  }

  return errors;
}
