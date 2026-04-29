'use client';

import Link from 'next/link';
import { SNIPPET_TYPE_LABELS, SNIPPET_TYPE_STYLES } from '@/constants';
import {
  formatSnippetDate,
  shortenSnippetContent,
  shortenSnippetTag,
  shortenSnippetTitle,
} from '@/lib/snippet-helpers';
import type { Snippet } from '@/types';

interface SnippetCardProps {
  snippet: Snippet;
  isDeleting?: boolean;
  onDelete: (id: string) => void;
}

export function SnippetCard({ snippet, isDeleting = false, onDelete }: SnippetCardProps) {
  const preview = shortenSnippetContent(snippet.content);
  const titlePreview = shortenSnippetTitle(snippet.title);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${SNIPPET_TYPE_STYLES[snippet.type]}`}
        >
          {SNIPPET_TYPE_LABELS[snippet.type]}
        </span>
        <button
          type="button"
          onClick={() => onDelete(snippet._id)}
          disabled={isDeleting}
          className="cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-pointer disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">
        <Link
          href={`/snippet/${snippet._id}`}
          title={snippet.title}
          className="block break-words transition hover:text-teal-700"
        >
          {titlePreview}
        </Link>
      </h3>

      <p
        className={`mt-3 max-h-28 overflow-hidden break-words whitespace-pre-wrap text-sm leading-6 text-slate-600 ${
          snippet.type === 'command' ? 'font-mono' : ''
        }`}
      >
        {preview}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {snippet.tags.length > 0 ? (
          snippet.tags.map((tag) => (
            <span
              key={tag}
              title={tag}
              className="inline-flex max-w-[11rem] items-center truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500"
            >
              #{shortenSnippetTag(tag)}
            </span>
          ))
        ) : (
          <span className="inline-flex items-center rounded-full border border-dashed border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-400">
            No tags
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span>Updated {formatSnippetDate(snippet.updatedAt)}</span>
        <Link
          href={`/snippet/${snippet._id}`}
          className="font-medium text-teal-700 transition hover:text-teal-800"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
