import { searchNews, SearchResult } from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Search } from "lucide-react";

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
        } catch (e) {
            console.error("Failed to search news:", e);
            error = "Nuk mund të kërkohen lajmet. Provoni përsëri më vonë.";
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="max-w-5xl mx-auto px-4 py-6">
                {/* No query provided */}
                {!query && (
                    <div className="py-20 text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h1 className="text-xl font-bold text-foreground mb-2">Kërko lajme</h1>
                        <p className="text-muted-foreground">
                            Shkruani termin në kutinë e kërkimit për të gjetur lajme.
                        </p>
                    </div>
                )}

                {/* Query too short */}
                {query && query.length < 2 && (
                    <div className="py-20 text-center">
                        <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h1 className="text-xl font-bold text-foreground mb-2">Termi i shkurtër</h1>
                        <p className="text-muted-foreground">
                            Termi i kërkimit duhet të ketë të paktën 2 karaktere.
                        </p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Search results */}
                {searchResult && (
                    <>
                        <div className="mb-6">
                            <h1 className="text-xl font-bold text-foreground mb-1">
                                Rezultatet për &quot;{searchResult.query}&quot;
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {searchResult.total_count === 0
                                    ? "Asnjë rezultat"
                                    : `${searchResult.total_count} grupe lajmesh u gjetën`}
                            </p>
                        </div>

                        {/* No results */}
                        {searchResult.clusters.length === 0 && (
                            <div className="py-16 text-center">
                                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Nuk u gjetën lajme për &quot;{searchResult.query}&quot;.
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Provoni me terma të tjerë.
                                </p>
                            </div>
                        )}

                        {/* Results list */}
                        {searchResult.clusters.length > 0 && (
                            <div className="space-y-4">
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
