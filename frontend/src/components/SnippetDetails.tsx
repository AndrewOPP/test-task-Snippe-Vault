'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SNIPPET_TYPE_LABELS, SNIPPET_TYPE_STYLES } from '@/constants';

import { deleteSnippet, getApiErrorMessage, updateSnippet } from '@/lib/api';
import type { Snippet, SnippetInput } from '@/types';
import { SnippetForm } from './SnippetForm';
import { formatSnippetDateTime, shortenSnippetTag } from '@/lib/snippet-helpers';

interface SnippetDetailsProps {
  snippet: Snippet;
}

export function SnippetDetails({ snippet }: SnippetDetailsProps) {
  const router = useRouter();
  const [currentSnippet, setCurrentSnippet] = useState(snippet);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [successMessage]);

  const handleSubmit = async (values: SnippetInput) => {
    const updatedSnippet = await updateSnippet(currentSnippet._id, values);
    setCurrentSnippet(updatedSnippet);
    setDeleteError(null);
    setSuccessMessage('Changes saved.');
  };

  const handleDelete = async () => {
    setDeleteError(null);
    setIsDeleting(true);

    try {
      await deleteSnippet(currentSnippet._id);
      router.push('/');
    } catch (error) {
      setDeleteError(getApiErrorMessage(error, 'Failed to delete the snippet.'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <article className="rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${SNIPPET_TYPE_STYLES[currentSnippet.type]}`}
            >
              {SNIPPET_TYPE_LABELS[currentSnippet.type]}
            </span>
            <h2 className="mt-4 max-w-[500px] break-words text-3xl font-semibold leading-tight tracking-tight text-slate-950">
              {currentSnippet.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Created {formatSnippetDateTime(currentSnippet.createdAt)} · Updated{' '}
              {formatSnippetDateTime(currentSnippet.updatedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-rose-200 hover:text-rose-600 disabled:cursor-pointer disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>

        {deleteError ? (
          <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {deleteError}
          </div>
        ) : null}

        <section className="mt-6 space-y-5">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Content
            </h3>
            <div
              className={`mt-3 max-h-[60vh] overflow-auto rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words ${
                currentSnippet.type === 'command' ? 'font-mono' : ''
              }`}
            >
              {currentSnippet.content}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Tags
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {currentSnippet.tags.length > 0 ? (
                currentSnippet.tags.map((tag) => (
                  <span
                    key={tag}
                    title={tag}
                    className="inline-flex max-w-[14rem] items-center truncate rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                  >
                    #{shortenSnippetTag(tag)}
                  </span>
                ))
              ) : (
                <span className="inline-flex items-center rounded-full border border-dashed border-slate-200 px-3 py-1 text-xs font-medium text-slate-400">
                  No tags
                </span>
              )}
            </div>
          </div>
        </section>
      </article>

      <SnippetForm
        key={`${currentSnippet._id}-${currentSnippet.updatedAt}`}
        title="Edit snippet"
        description="Update the title, type, content, or tags. Changes are saved without reloading the page."
        submitLabel="Save changes"
        initialValues={{
          title: currentSnippet.title,
          content: currentSnippet.content,
          tags: currentSnippet.tags,
          type: currentSnippet.type,
        }}
        successMessage={successMessage}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
