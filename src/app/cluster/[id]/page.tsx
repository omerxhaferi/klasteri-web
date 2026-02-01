import { getCluster } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

function getTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString.replace("Z", ""));
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "tani";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} orë`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ditë`;
    return date.toLocaleDateString("sq-AL", { day: "numeric", month: "short" });
}

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
    const categoryColor = CategoryColors[categoryKey] || CategoryColors.vendi;
    const mainSourceColor = SOURCE_COLORS[mainArticle?.source_name] || categoryColor;

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

                {/* Cluster Header / Main Article */}
                {mainArticle && (
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            {mainArticle.image_url ? (
                                <img
                                    src={mainArticle.image_url}
                                    alt=""
                                    className="w-[140px] h-[140px] rounded-2xl object-cover bg-muted shadow-xl"
                                />
                            ) : (
                                <div className="w-[140px] h-[140px] rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                    Nuk ka imazh
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black leading-tight tracking-tight mb-4">
                            {mainArticle.title}
                        </h1>

                        <p className="text-muted-foreground text-base leading-relaxed mb-6 px-2">
                            {mainArticle.content}...
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-bold uppercase tracking-tight" style={{ color: mainSourceColor }}>
                                    {mainArticle.source_name}
                                </span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{getTimeAgo(mainArticle.crawled_at)}</span>
                            </div>

                            <a
                                href={mainArticle.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] !text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Lexo artikullin <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>
                )}

                {/* Other Articles List */}
                {otherArticles.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 bg-primary rounded-full" />
                            <h2 className="text-lg font-bold">{cluster.article_count - 1} lajme tjera</h2>
                        </div>

                        <div className="space-y-4">
                            {otherArticles.map((article) => {
                                const articleSourceColor = SOURCE_COLORS[article.source_name] || "#3b82f6";
                                return (
                                    <a
                                        key={article.id}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-xs font-bold uppercase" style={{ color: articleSourceColor }}>
                                                    {article.source_name}
                                                </span>
                                            </div>
                                            <h3 className="text-[15px] font-bold leading-snug group-hover:underline decoration-1 transition-all mb-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                                <span>{getTimeAgo(article.crawled_at)}</span>
                                                <span>·</span>
                                                <ExternalLink size={10} />
                                            </div>
                                        </div>
                                        {article.image_url && (
                                            <img
                                                src={article.image_url}
                                                alt=""
                                                className="w-20 h-20 rounded-lg object-cover bg-muted shrink-0"
                                            />
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <SiteFooter />
        </div>
    );
}
