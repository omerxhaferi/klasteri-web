"use client";

import { Cluster, Article } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";

interface NewsCardProps {
    cluster: Cluster;
}

const RECENT_THRESHOLD_MINUTES = 18;

function getTimeAgo(dateString: string): { text: string; isRecent: boolean } {
    const now = new Date();
    const date = new Date(dateString.replace("Z", ""));
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < RECENT_THRESHOLD_MINUTES) {
        return { text: "tani", isRecent: true };
    }

    if (minutes < 60) return { text: `${minutes} min`, isRecent: false };

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return { text: `${hours} orë`, isRecent: false };

    const days = Math.floor(hours / 24);
    if (days < 7) return { text: `${days} ditë`, isRecent: false };

    return { text: date.toLocaleDateString("sq-AL", { day: "numeric", month: "short" }), isRecent: false };
}

function isRecentArticle(dateString: string): boolean {
    const now = new Date();
    const date = new Date(dateString.replace("Z", ""));
    const minutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return minutes < RECENT_THRESHOLD_MINUTES;
}

const subscribe = () => () => {};
function useIsDarkMode() {
    return useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains("dark"),
        () => false
    );
}

/** Source + time meta line under a headline */
function MetaLine({ article, sourceColor }: { article: Article; sourceColor: string }) {
    const timeInfo = getTimeAgo(article.crawled_at);
    return (
        <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
            <span className="font-bold uppercase tracking-tight" style={{ color: sourceColor }}>
                {article.source_name}
            </span>
            <span className="text-border">|</span>
            <span className={timeInfo.isRecent ? "font-semibold text-hot" : ""}>
                {timeInfo.text}
            </span>
        </div>
    );
}

/** Up to 3 other sources covering the same story */
function SubArticles({ articles, color }: { articles: Article[]; color: string }) {
    if (articles.length === 0) return null;
    return (
        <div className="mt-3 space-y-1.5">
            {articles.map((article) => {
                const isRecent = isRecentArticle(article.crawled_at);
                return (
                    <a
                        key={article.id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-baseline gap-2 group/item relative"
                    >
                        {isRecent && (
                            <span
                                className="absolute rounded-full bg-hot"
                                style={{ left: "-10px", top: 2, bottom: 2, width: "3px" }}
                            />
                        )}
                        <span
                            className="text-[12px] font-bold whitespace-nowrap shrink-0"
                            style={{ color }}
                        >
                            {article.source_name}
                        </span>
                        <span className="text-[13px] text-muted-foreground group-hover/item:text-foreground group-hover/item:underline decoration-1 transition-colors truncate flex-1">
                            {article.title}
                        </span>
                    </a>
                );
            })}
        </div>
    );
}

/** Stacked source-color dots + "N lajme tjera" link into the cluster */
function CoverageLink({ cluster, isDarkMode }: { cluster: Cluster; isDarkMode: boolean }) {
    const remaining = Math.max(0, cluster.article_count - 4);
    if (remaining < 1) return null;

    const dotColors: string[] = [];
    const seen = new Set<string>();
    for (const a of cluster.articles.slice(4)) {
        if (dotColors.length >= 5) break;
        if (!seen.has(a.source_name)) {
            seen.add(a.source_name);
            const base = SOURCE_COLORS[a.source_name] || "#6b7280";
            dotColors.push(getAccessibleColor(base, isDarkMode));
        }
    }

    return (
        <Link
            href={`/cluster/${cluster.id}`}
            className="mt-3 inline-flex items-center gap-2 group/cov hover:no-underline"
        >
            {dotColors.length > 0 && (
                <span className="flex -space-x-1">
                    {dotColors.map((c, i) => (
                        <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full ring-2 ring-background"
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </span>
            )}
            <span className="text-[12.5px] font-semibold text-muted-foreground group-hover/cov:text-foreground transition-colors">
                edhe {remaining} lajme tjera
                <span className="ml-0.5">›</span>
            </span>
        </Link>
    );
}

export function NewsCard({ cluster }: NewsCardProps) {
    const isDarkMode = useIsDarkMode();

    const mainArticle = cluster.articles[0];
    if (!mainArticle) return null;

    const subArticles = cluster.articles.slice(1, 4);

    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
    const categoryColor = CategoryColors[categoryKey] || CategoryColors.vendi;

    const baseSourceColor = SOURCE_COLORS[mainArticle.source_name] || categoryColor;
    const mainSourceColor = getAccessibleColor(baseSourceColor, isDarkMode);
    // Uniform accent for similar publishers so the main one's brand color stands out
    const subSourceColor = "var(--primary)";

    const description = mainArticle.content
        ? (mainArticle.content.length >= 200 ? mainArticle.content.slice(0, 200) + "..." : mainArticle.content)
        : "";

    return (
        <article className="py-5 border-b border-border last:border-b-0">
            <div className="flex gap-5">
                <div className="flex-1 min-w-0">
                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group mb-1.5"
                    >
                        <h3 className="font-serif text-[19px] font-bold leading-snug tracking-tight text-foreground group-hover:underline decoration-1 underline-offset-2">
                            {mainArticle.title}
                        </h3>
                    </a>

                    {description && (
                        <p className="hidden md:block mb-2 text-[13.5px] text-muted-foreground leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}

                    <MetaLine article={mainArticle} sourceColor={mainSourceColor} />
                </div>

                {/* Max 100x100 — larger article images are not allowed (NMK rules) */}
                {mainArticle.image_url && (
                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                    >
                        <img
                            src={mainArticle.image_url}
                            alt=""
                            className="w-[100px] h-[100px] rounded-xl object-cover bg-muted shadow-sm"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </a>
                )}
            </div>

            <SubArticles articles={subArticles} color={subSourceColor} />
            <CoverageLink cluster={cluster} isDarkMode={isDarkMode} />
        </article>
    );
}
