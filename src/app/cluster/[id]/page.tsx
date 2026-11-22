import { ClusterDetailContent } from "@/components/cluster-detail-content";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCluster } from "@/lib/api";
import { isCountryCode } from "@/lib/country";
import { CategoryKey } from "@/lib/constants";
import { BackButton } from "@/components/back-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClusterPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ country?: string }>;
}) {
    const { id } = await params;
    /*
     * A shared link carries its own country, and must.
     *
     * Cluster ids are global but the API scopes them: asking for a Kosovo
     * cluster with country=MK is a 404, not a fallback. This page used to send
     * no country at all, so it resolved against the VISITOR's cookie — which
     * meant a Kosovo story shared to anyone reading the Macedonian edition
     * opened as "Nuk u gjet ky grup lajmesh." The link worked only for people
     * who already happened to be on the right edition.
     *
     * Deliberately does NOT write the cookie. Following someone's link should
     * show you their story, not silently move you to their edition.
     */
    const { country } = await searchParams;
    let cluster;

    try {
        cluster = await getCluster(id, isCountryCode(country) ? country : undefined);
    } catch (e) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-hot font-bold mb-3">Nuk u gjet ky grup lajmesh.</p>
                <Link href="/" className="font-bold text-primary">
                    « Kthehu në ballinë
                </Link>
            </div>
        );
    }

    const mainArticle = cluster.articles[0];
    const otherArticles = cluster.articles.slice(1);
    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* The section bar's slab, with the story's size where the sections would be. */}
            <header className="bg-brand text-white sticky top-0 z-50">
                <div className="relative max-w-3xl mx-auto px-4 h-11 flex items-center justify-between">
                    <Link href="/" className="font-display text-[24px] font-bold leading-none hover:no-underline">
                        Klasteri
                    </Link>

                    <div className="absolute left-1/2 -translate-x-1/2 font-display text-[15px] font-bold uppercase whitespace-nowrap">
                        {cluster.article_count} lajme
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-[13px] font-bold hidden sm:inline">
                            Ballina »
                        </Link>
                        <ThemeToggle on="bar" />
                    </div>
                </div>
            </header>

            <main className="w-full flex-1 max-w-3xl mx-auto px-4 py-4">
                {/* Back Button */}
                <BackButton />

                <ClusterDetailContent
                    mainArticle={mainArticle}
                    otherArticles={otherArticles}
                    allArticles={cluster.articles}
                    beats={cluster.beats}
                    articleCount={cluster.article_count}
                    categoryKey={categoryKey}
                />
            </main>

            <SiteFooter />
        </div>
    );
}
