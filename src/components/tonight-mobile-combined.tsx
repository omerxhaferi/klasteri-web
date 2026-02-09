"use client";

import { DailySummary, TonightCluster } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SummaryPlayerCard } from "@/components/summary-player-card";

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

    if (clusters.length === 0) return null;

    return (
        <div className="lg:hidden mb-4 -mx-4 px-4">
            {/* Summary Player - standalone line above Titujt kryesor */}
            {summary && (
                <div className="mb-2">
                    <SummaryPlayerCard summary={summary} />
                </div>
            )}

            {/* "Titujt kryesor" header */}
            <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3 w-3 text-muted-foreground/50" />
                <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Titujt kryesor
                </h2>
            </div>

            {/* Horizontal Scroll - Topics in Focus */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {clusters.slice(0, 6).map((cluster) => {
                    const article = cluster.top_article;
                    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                    const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                    const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                    return (
                        <div
                            key={cluster.id}
                            className="shrink-0 w-[200px] bg-card border border-border rounded-lg p-3"
                        >
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <h3 className="text-[12px] font-semibold leading-snug line-clamp-3 mb-2 group-hover:underline">
                                    {article.title}
                                </h3>
                            </a>

                            <div className="flex items-center gap-1 text-[10px]">
                                <span
                                    className="font-bold uppercase"
                                    style={{ color: sourceColor }}
                                >
                                    {article.source_name}
                                </span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">
                                    {formatTime(article.crawled_at)}
                                </span>
                                {cluster.total_article_count > 1 && (
                                    <>
                                        <span className="text-muted-foreground">·</span>
                                        <Link
                                            href={`/cluster/${cluster.id}`}
                                            className="text-primary hover:underline whitespace-nowrap"
                                        >
                                            {cluster.total_article_count} lajme ›
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
