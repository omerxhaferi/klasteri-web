"use client";

import { Cluster } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";

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

export function NewsCard({ cluster }: NewsCardProps) {
    const mainArticle = cluster.articles[0];
    if (!mainArticle) return null;

    // Top 3 other articles get full display (source + title)
    const fullArticles = cluster.articles.slice(1, 4);

    // Remaining articles: show up to 6 unique source names inline
    const MAX_INLINE = 6;
    const inlineSources: { name: string; url: string }[] = [];
    const seenInline = new Set<string>();
    for (const a of cluster.articles.slice(4)) {
        if (inlineSources.length >= MAX_INLINE) break;
        if (!seenInline.has(a.source_name)) {
            seenInline.add(a.source_name);
            inlineSources.push({ name: a.source_name, url: a.url });
        }
    }

    const desktopRemainingCount = Math.max(0, cluster.article_count - 4 - inlineSources.length);
    const mobileRemainingCount = Math.max(0, cluster.article_count - 4);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isDarkMode = mounted && typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false;

    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
    const categoryColor = CategoryColors[categoryKey] || CategoryColors.vendi;

    const baseSourceColor = SOURCE_COLORS[mainArticle.source_name] || categoryColor;
    const mainSourceColor = getAccessibleColor(baseSourceColor, isDarkMode);
    const similarSourceColor = getAccessibleColor('#3b82f6', isDarkMode);

    const description = mainArticle.content
        ? (mainArticle.content.length >= 200 ? mainArticle.content.slice(0, 200) + "..." : mainArticle.content)
        : "";

    return (
        <article className="py-5 border-b border-border last:border-b-0 transition-colors">
            {/* Top Section: Title + image */}
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

                    {description && (
                        <p className="hidden md:block mb-2 text-[14px] text-muted-foreground leading-relaxed line-clamp-2">
                            {description}
                        </p>
                    )}

                    {(() => {
                        const timeInfo = getTimeAgo(mainArticle.crawled_at);
                        return (
                            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                                <span
                                    className="font-bold uppercase tracking-tight"
                                    style={{ color: mainSourceColor }}
                                >
                                    {mainArticle.source_name}
                                </span>
                                <span>·</span>
                                <span
                                    className={timeInfo.isRecent ? "font-semibold" : ""}
                                    style={timeInfo.isRecent ? { color: "#f97316" } : undefined}
                                >
                                    {timeInfo.text}
                                </span>
                            </div>
                        );
                    })()}
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

            {/* Full articles: source + title (top 2 other articles) */}
            {fullArticles.length > 0 && (
                <div className="space-y-1 mb-2">
                    {fullArticles.map((article) => {
                        const isRecent = isRecentArticle(article.crawled_at);
                        return (
                            <a
                                key={article.id}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 group/item relative"
                            >
                                {isRecent && (
                                    <span
                                        className="absolute rounded-full"
                                        style={{ left: "-10px", top: 2, bottom: 2, width: "3px", backgroundColor: "#f97416c9" }}
                                    />
                                )}
                                <span className="text-[13px] font-bold whitespace-nowrap min-w-[60px]" style={{ color: similarSourceColor }}>
                                    {article.source_name}
                                </span>
                                <span className="text-[13px] text-muted-foreground hover:underline decoration-1 transition-all truncate flex-1">
                                    {article.title}
                                </span>
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Inline source names (single line) */}
            {inlineSources.length > 0 && (
                <div className="hidden md:block text-[13px] overflow-hidden whitespace-nowrap truncate" style={{ color: '#0d9489f9' }}>
                    {inlineSources.map((src, i) => (
                        <span key={src.name}>
                            <a
                                href={src.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold hover:underline"
                            >
                                {src.name}
                            </a>
                            {i < inlineSources.length - 1 && (
                                <span className="text-muted-foreground"> - </span>
                            )}
                        </span>
                    ))}
                </div>
            )}

            {mobileRemainingCount > 1 && (
                <Link
                    href={`/cluster/${cluster.id}`}
                    className="text-[13px] font-semibold text-foreground hover:underline flex md:hidden items-center gap-0.5 mt-1"
                >
                    {mobileRemainingCount} lajme tjera
                    <span className="text-[10px]">&#8250;</span>
                </Link>
            )}
            {desktopRemainingCount > 1 && (
                <Link
                    href={`/cluster/${cluster.id}`}
                    className="text-[13px] font-semibold text-foreground hover:underline hidden md:flex items-center gap-0.5 mt-1"
                >
                    {desktopRemainingCount} lajme tjera
                    <span className="text-[10px]">&#8250;</span>
                </Link>
            )}

        </article>
    );
}
