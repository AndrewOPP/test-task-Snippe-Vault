import { Header } from '@/components/Header';
import { SnippetVault } from '@/components/SnippetVault';
import { SNIPPETS_PAGE_LIMIT } from '@/constants';
import { fetchSnippets } from '@/lib/api';
import { collectTagFacets, parseSnippetQuery } from '@/lib/snippet-query';

type QueryParams = Record<string, string | string[] | undefined>;

interface HomePageProps {
  searchParams?: QueryParams | Promise<QueryParams>;
}

export default async function Home({ searchParams = {} }: HomePageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = parseSnippetQuery(resolvedSearchParams);
  const [snippetData, tagData] = await Promise.all([
    fetchSnippets({
      page: query.page,
      limit: SNIPPETS_PAGE_LIMIT,
      q: query.q,
      tags: query.tags,
    }),
    fetchSnippets({ page: 1, limit: 1000 }),
  ]);
  const tagFacets = collectTagFacets(tagData?.items ?? []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Header
        total={snippetData?.total ?? 0}
        page={query.page}
        totalPages={snippetData?.totalPages ?? 1}
        query={query}
      />
      <SnippetVault data={snippetData} query={query} tagFacets={tagFacets} />
    </main>
  );
}
