export type SnippetType = 'link' | 'note' | 'command';

export interface Snippet {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
  createdAt: string;
  updatedAt: string;
}

export interface SnippetInput {
  title: string;
  content: string;
  tags: string[];
  type: SnippetType;
}

export interface PaginatedSnippets {
  items: Snippet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
