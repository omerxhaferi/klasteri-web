import { searchNews, SearchResult } from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { cookies } from "next/headers";
import { MUTED_COOKIE, parseMutedCookie, applyMutesToClusters } from "@/lib/mutes";

export const dynamic = 'force-dynamic';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const params = await searchParams;
    const query = params.q?.trim() || "";

    let searchResult: SearchResult | null = null;
    let error: string | null = null;

    // Only search if query is long enough
    if (query.length >= 2) {
        try {
            searchResult = await searchNews(query);
            const muted = parseMutedCookie((await cookies()).get(MUTED_COOKIE)?.value);
            if (muted.size > 0 && searchResult) {
                const clusters = applyMutesToClusters(searchResult.clusters, muted);
                searchResult = { ...searchResult, clusters, total_count: clusters.length };
            }
        } catch (e) {
            console.error("Failed to search news:", e);
            error = "Nuk mund të kërkohen lajmet. Provoni përsëri më vonë.";
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            <main className="w-full flex-1 max-w-3xl mx-auto px-4 py-5">
                {/* No query provided */}
                {!query && (
                    <div className="py-12">
                        <h1 className="text-[20px] font-bold mb-1">Kërko lajme</h1>
                        <p className="text-muted-foreground">
                            Shkruani termin në kutinë e kërkimit për të gjetur lajme.
                        </p>
                    </div>
                )}

                {/* Query too short */}
                {query && query.length < 2 && (
                    <div className="py-12">
                        <h1 className="text-[20px] font-bold mb-1">Termi i shkurtër</h1>
                        <p className="text-muted-foreground">
                            Termi i kërkimit duhet të ketë të paktën 2 karaktere.
                        </p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="mb-5 px-3 py-2.5 border border-hot bg-muted text-hot text-[13px] font-bold">
                        {error}
                    </div>
                )}

                {/* Search results */}
                {searchResult && (
                    <>
                        {/* Not a TabHeading: a tab is uppercase, and a reader's own
                            words should come back exactly as they typed them. */}
                        <div className="pb-1.5 border-b-2 border-tab flex items-baseline justify-between gap-3">
                            <h1 className="text-[20px] font-bold leading-tight">
                                Rezultatet për &quot;{searchResult.query}&quot;
                            </h1>
                            <p className="text-[12px] text-muted-foreground whitespace-nowrap">
                                {searchResult.total_count === 0
                                    ? "Asnjë rezultat"
                                    : `${searchResult.total_count} grupe lajmesh u gjetën`}
                            </p>
                        </div>

                        {/* No results */}
                        {searchResult.clusters.length === 0 && (
                            <div className="py-10">
                                <p>
                                    Nuk u gjetën lajme për &quot;{searchResult.query}&quot;.
                                </p>
                                <p className="text-muted-foreground mt-1">
                                    Provoni me terma të tjerë.
                                </p>
                            </div>
                        )}

                        {/* Results list */}
                        {searchResult.clusters.length > 0 && (
                            <div>
                                {searchResult.clusters.map((cluster) => (
                                    <NewsCard key={cluster.id} cluster={cluster} />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
