"use client";

import { DailySummary, TonightCluster } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SummaryPlayerCard } from "@/components/summary-player-card";
import { TabHeading } from "@/components/tab-heading";

interface TonightMobileCombinedProps {
    clusters: TonightCluster[];
    summary: DailySummary | null;
    serverIsNight: boolean;
    forceShow?: boolean;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString.replace("Z", ""));
    const now = new Date();
    const isYesterday =
        date.getDate() !== now.getDate() ||
        date.getMonth() !== now.getMonth() ||
        date.getFullYear() !== now.getFullYear();
    const time = date.toLocaleTimeString("sq-AL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    return isYesterday ? `Dje ${time}` : time;
}

const subscribe = () => () => {};
function useIsDarkMode() {
    return useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains("dark"),
        () => false
    );
}

export function TonightMobileCombined({
    clusters,
    summary,
}: TonightMobileCombinedProps) {
    const isDarkMode = useIsDarkMode();

    const showSummary = !!summary;
    const showClusters = clusters.length > 0;

    if (!showSummary && !showClusters) return null;

    return (
        <div className="lg:hidden mb-4 -mx-4 px-4">
            {/* Summary Player - standalone line above Titujt kryesor */}
            {showSummary && (
                <div className="mb-2">
                    <SummaryPlayerCard summary={summary} />
                </div>
            )}

            {showClusters && <>
            <TabHeading title="Titujt kryesor" right="më të ndjekurat" className="mb-2.5" />

            {/* Horizontal Scroll - Topics in Focus */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {clusters.slice(0, 6).map((cluster, index) => {
                    const article = cluster.top_article;
                    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                    const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                    const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                    return (
                        <div
                            key={cluster.id}
                            className="shrink-0 w-[210px] bg-muted border border-border p-2.5 flex gap-2"
                        >
                            <span className="font-display text-[19px] font-bold leading-none text-hot tabular-nums shrink-0">
                                {index + 1}
                            </span>

                            <div className="min-w-0">
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-headline"
                                >
                                    <h3 className="text-[13px] font-bold leading-[1.3] line-clamp-3">
                                        {article.title}
                                    </h3>
                                </a>

                                <div className="mt-1 text-[11px] text-muted-foreground">
                                    <span className="font-bold" style={{ color: sourceColor }}>
                                        {article.source_name}
                                    </span>
                                    {" - "}
                                    {formatTime(article.crawled_at)}
                                    {cluster.total_article_count > 1 && (
                                        <>
                                            {" - "}
                                            <Link
                                                href={`/cluster/${cluster.id}`}
                                                className="text-primary whitespace-nowrap"
                                            >
                                                {cluster.total_article_count} lajme »
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            </>}
        </div>
    );
}
