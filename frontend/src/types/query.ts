export interface SnippetQueryState {
  page: number;
  q: string;
  tags: string[];
}

export interface TagFacet {
  tag: string;
  count: number;
}
