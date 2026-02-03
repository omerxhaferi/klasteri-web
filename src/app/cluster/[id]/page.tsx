import { ClusterDetailContent } from "@/components/cluster-detail-content";
import { Logo } from "@/components/logo";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { getCluster } from "@/lib/api";
import { CategoryKey } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClusterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    let cluster;

    try {
        cluster = await getCluster(id);
    } catch (e) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <p className="text-red-500 font-bold mb-4">Nuk u gjet ky grup lajmesh.</p>
                <Link href="/" className="text-primary hover:underline flex items-center gap-1">
                    <ChevronLeft size={20} /> Kthehu në ballinë
                </Link>
            </div>
        );
    }

    const mainArticle = cluster.articles[0];
    const otherArticles = cluster.articles.slice(1);
    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;

    return (
        <div className="min-h-screen bg-background">
            {/* Header (Same as Page) */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo width={32} height={32} />
                        <span className="text-xl font-bold tracking-tight hidden sm:inline">Klasteri</span>
                    </Link>

                    {/* Total Articles Count (Mobile Style) */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {cluster.article_count} lajme
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:inline">
                            Ballina
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Kthehu
                </Link>

                <ClusterDetailContent
                    mainArticle={mainArticle}
                    otherArticles={otherArticles}
                    articleCount={cluster.article_count}
                    categoryKey={categoryKey}
                />
            </main>

            <SiteFooter />
        </div>
    );
}
