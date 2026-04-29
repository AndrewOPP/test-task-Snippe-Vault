import type { SnippetType } from '@/types';

export const SNIPPET_TYPE_LABELS: Record<SnippetType, string> = {
  link: 'Link',
  note: 'Note',
  command: 'Command',
};

export const SNIPPET_TYPE_STYLES: Record<SnippetType, string> = {
  link: 'border-cyan-200 bg-cyan-50 text-cyan-700',
  note: 'border-amber-200 bg-amber-50 text-amber-700',
  command: 'border-slate-200 bg-slate-100 text-slate-700',
};

export const SNIPPET_TYPE_OPTIONS: Array<{
  value: SnippetType;
  label: string;
  description: string;
}> = [
  { value: 'link', label: 'Link', description: 'A URL you want to keep' },
  { value: 'note', label: 'Note', description: 'A short text note' },
  { value: 'command', label: 'Command', description: 'A terminal or shell command' },
];
