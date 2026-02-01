"use client";

import { Cluster } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import Link from "next/link";

interface NewsCardProps {
    cluster: Cluster;
}

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

export function NewsCard({ cluster }: NewsCardProps) {
    const mainArticle = cluster.articles[0];
    const otherSources = cluster.articles.slice(1, 4); // Show top 3 similar news
    const remainingCount = cluster.article_count > 4 ? cluster.article_count - 4 : 0;

    if (!mainArticle) return null;

    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
    const categoryColor = CategoryColors[categoryKey] || CategoryColors.vendi;

    // Use explicit source color if available, otherwise fallback to category color
    const mainSourceColor = SOURCE_COLORS[mainArticle.source_name] || categoryColor;
    const SIMILAR_SOURCE_COLOR = '#3b82f6';

    // Get description - add ellipsis if it looks truncated
    const description = mainArticle.content
        ? (mainArticle.content.length >= 200 ? mainArticle.content.slice(0, 200) + "..." : mainArticle.content)
        : "";

    return (
        <article className="py-5 border-b border-border last:border-b-0 transition-colors">
            {/* Top Section: Everything grouped next to Thumbnail */}
            <div className="flex gap-5 mb-4">
                <div className="flex-1 min-w-0">
                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group mb-1.5"
                    >
                        <h3 className="text-[17px] font-bold leading-snug text-foreground group-hover:underline decoration-1 transition-colors">
                            {mainArticle.title}
                        </h3>
                    </a>

                    {/* Description - Inside the same column as title */}
                    {description && (
                        <p className="hidden md:block mb-2 text-[14px] text-muted-foreground leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}

                    {/* Source info - Also grouped on the left */}
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <span
                            className="font-bold uppercase tracking-tight"
                            style={{ color: mainSourceColor }}
                        >
                            {mainArticle.source_name}
                        </span>
                        <span>·</span>
                        <span>{getTimeAgo(mainArticle.crawled_at)}</span>
                    </div>
                </div>

                {mainArticle.image_url && (
                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                    >
                        <div className="relative">
                            <img
                                src={mainArticle.image_url}
                                alt=""
                                className="w-[100px] h-[100px] rounded-xl object-cover bg-muted shadow-sm"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                                }}
                            />
                        </div>
                    </a>
                )}
            </div>

            {/* Other sources covering this story - Full Width below the top section */}
            {otherSources.length > 0 && (
                <div className="space-y-1.5 mb-3">
                    {otherSources.map((article) => (
                        <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 group/item"
                        >
                            <span className="text-[13px] font-bold whitespace-nowrap min-w-[60px]" style={{ color: SIMILAR_SOURCE_COLOR }}>
                                {article.source_name}
                            </span>
                            <span className="text-[13px] text-muted-foreground hover:underline decoration-1 transition-all truncate flex-1">
                                {article.title}
                            </span>
                        </a>
                    ))}
                </div>
            )}

            {/* Remaining Count - At the absolute bottom */}
            {remainingCount > 0 && (
                <div>
                    <Link
                        href={`/cluster/${cluster.id}`}
                        className="text-[13px] font-bold text-foreground hover:underline flex items-center gap-1"
                    >
                        {remainingCount} lajme tjera
                        <span className="text-[10px]">›</span>
                    </Link>
                </div>
            )}
        </article>
    );
}
