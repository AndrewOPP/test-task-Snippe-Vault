'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  SNIPPET_CONTENT_MAX_LENGTH,
  SNIPPET_TAGS_TEXT_MAX_LENGTH,
  SNIPPET_TITLE_MAX_LENGTH,
  SNIPPET_TYPE_OPTIONS,
} from '@/constants';
import {
  parseSnippetTags,
  toSnippetFormState,
  type SnippetFormErrors,
  type SnippetFormState,
  validateSnippetForm,
} from '@/lib/snippet-helpers';
import { getApiErrorMessage } from '@/lib/api';
import type { SnippetInput, SnippetType } from '@/types';

interface SnippetFormProps {
  title: string;
  description: string;
  submitLabel: string;
  initialValues?: SnippetInput;
  successMessage?: string | null;
  onSubmit: (values: SnippetInput) => Promise<void>;
}

export function SnippetForm({
  title,
  description,
  submitLabel,
  initialValues,
  successMessage,
  onSubmit,
}: SnippetFormProps) {
  const [values, setValues] = useState<SnippetFormState>(() => toSnippetFormState(initialValues));
  const [fieldErrors, setFieldErrors] = useState<SnippetFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = <Key extends keyof SnippetFormState>(
    key: Key,
    value: SnippetFormState[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setSubmitError(null);

    if (key === 'title' || key === 'content' || key === 'type') {
      setFieldErrors((current) => ({ ...current, [key]: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateSnippetForm(values);
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        title: values.title.trim(),
        content: values.content.trim(),
        tags: parseSnippetTags(values.tagsText),
        type: values.type,
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Failed to save the snippet.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBusy = isSubmitting;

  return (
    <form
      id="snippet-form"
      noValidate
      onSubmit={handleSubmit}
      className="rounded-4xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      {successMessage ? (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      {submitError ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
          {submitError}
        </div>
      ) : null}

      <div className="mt-5 space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Title *</span>
          <input
            value={values.title}
            onChange={(event) => updateValue('title', event.target.value)}
            type="text"
            maxLength={SNIPPET_TITLE_MAX_LENGTH}
            placeholder="For example: deployment command"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          />
          {fieldErrors.title ? <p className="text-sm text-rose-600">{fieldErrors.title}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Type *</span>
          <select
            value={values.type}
            onChange={(event) => updateValue('type', event.target.value as SnippetType)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          >
            {SNIPPET_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-slate-500">
            {SNIPPET_TYPE_OPTIONS.find((option) => option.value === values.type)?.description}
          </p>
          {fieldErrors.type ? <p className="text-sm text-rose-600">{fieldErrors.type}</p> : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Content *</span>
          <textarea
            value={values.content}
            onChange={(event) => updateValue('content', event.target.value)}
            rows={8}
            maxLength={SNIPPET_CONTENT_MAX_LENGTH}
            placeholder="Paste a link, note text, or command"
            className={`w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10 ${
              values.type === 'command' ? 'font-mono' : ''
            }`}
          />
          {fieldErrors.content ? (
            <p className="text-sm text-rose-600">{fieldErrors.content}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Tags</span>
          <input
            value={values.tagsText}
            onChange={(event) => updateValue('tagsText', event.target.value)}
            type="text"
            maxLength={SNIPPET_TAGS_TEXT_MAX_LENGTH}
            placeholder="frontend, react, api"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          />
          <p className="text-xs leading-5 text-slate-500">
            Separate tags with commas. Empty values are ignored automatically.
          </p>
        </label>
      </div>

      <button
        type="submit"
        disabled={isBusy}
        className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-pointer disabled:opacity-60"
      >
        {isBusy ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
