"use client";

import { Cluster, Article } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { hideIfBroken, hideOnError } from "@/lib/images";
import Link from "next/link";
import { useSyncExternalStore } from "react";

interface NewsCardProps {
    cluster: Cluster;
}

const RECENT_THRESHOLD_MINUTES = 18;

/** How many more newsrooms are named before the "edhe N lajme tjera »" link. */
const MAX_NAMED_SOURCES = 4;

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

/** "TV21 - 51 min", directly under the headline. */
function MetaLine({ article, sourceColor }: { article: Article; sourceColor: string }) {
    const timeInfo = getTimeAgo(article.crawled_at);
    return (
        <div className="mt-1 text-[12px] text-muted-foreground">
            <span className="font-bold" style={{ color: sourceColor }}>
                {article.source_name}
            </span>
            {" - "}
            <span className={timeInfo.isRecent ? "font-bold text-hot" : ""}>
                {timeInfo.text}
            </span>
        </div>
    );
}

/**
 * Up to 3 other newsrooms on the same story, one line each: the NEWSROOM first,
 * bold in the accent, then its headline in ink.
 *
 * Name first is the owner's call (2026-11-22). With the headline first and the
 * name trailing in grey, the three kinds of text in a card — the lead's
 * description, the other headlines and their newsrooms — read as one block.
 * One accent for every name here, not each outlet's brand colour, so the lead
 * newsroom's own colour above stays the one that stands out. A red bar at the
 * left marks an article that has only just appeared.
 */
function SubArticles({ articles }: { articles: Article[] }) {
    if (articles.length === 0) return null;
    return (
        <ul className="mt-2.5 space-y-1">
            {articles.map((article) => {
                const isRecent = isRecentArticle(article.crawled_at);
                return (
                    <li key={article.id} className="relative flex items-baseline gap-2 text-[13px] leading-[1.35]">
                        {isRecent && (
                            <span
                                aria-hidden
                                className="absolute -left-2.5 top-[2px] bottom-[2px] w-[3px] bg-hot"
                            />
                        )}
                        <span className="shrink-0 text-[12px] font-bold text-primary whitespace-nowrap">
                            {article.source_name}
                        </span>
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-w-0 truncate text-headline"
                        >
                            {article.title}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
}

/**
 * The rest of the coverage: a few more newsrooms by name, then the link into
 * the cluster. Names, not coloured dots — a name says who else has the story.
 */
function CoverageLine({ cluster }: { cluster: Cluster }) {
    const remaining = Math.max(0, cluster.article_count - 4);
    if (remaining < 1) return null;

    const shown = new Set(cluster.articles.slice(0, 4).map((a) => a.source_name));
    const names: string[] = [];
    for (const a of cluster.articles.slice(4)) {
        if (names.length >= MAX_NAMED_SOURCES) break;
        if (!shown.has(a.source_name)) {
            shown.add(a.source_name);
            names.push(a.source_name);
        }
    }

    return (
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 text-[12px] text-muted-foreground">
            {names.length > 0 && (
                <span className="hidden sm:inline">{names.join(" · ")} ·</span>
            )}
            <Link
                href={`/cluster/${cluster.id}`}
                className="font-bold text-primary whitespace-nowrap"
            >
                edhe {remaining} lajme tjera »
            </Link>
        </div>
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

    const description = mainArticle.content
        ? (mainArticle.content.length >= 200 ? mainArticle.content.slice(0, 200) + "..." : mainArticle.content)
        : "";

    return (
        <article className="py-3.5 border-b border-border last:border-b-0">
            <div className="flex gap-4">
                <div className="flex-1 min-w-0">
                    <a
                        href={mainArticle.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-headline"
                    >
                        <h3 className="text-[17px] md:text-[18px] font-bold leading-[1.25]">
                            {mainArticle.title}
                        </h3>
                    </a>

                    <MetaLine article={mainArticle} sourceColor={mainSourceColor} />

                    {/* Grey, so it can never be mistaken for one of the headlines below. */}
                    {description && (
                        <p className="hidden md:block mt-1.5 text-[13px] leading-[1.45] text-muted-foreground line-clamp-2">
                            {description}
                        </p>
                    )}
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
                            className="w-[100px] h-[100px] object-cover bg-muted border border-border"
                            ref={hideIfBroken}
                            onError={hideOnError}
                        />
                    </a>
                )}
            </div>

            <SubArticles articles={subArticles} />
            <CoverageLine cluster={cluster} />
        </article>
    );
}
