"use client";

import { DailySummary, TonightCluster } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SummaryPlayerCard } from "@/components/summary-player-card";

interface TonightSidebarProps {
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

export function TonightSidebar({ clusters, summary }: TonightSidebarProps) {
    const isDarkMode = useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains("dark"),
        () => false
    );

    if (clusters.length === 0 && !summary) {
        return null;
    }

    return (
        <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-[60px] max-h-[calc(100vh-4.5rem)] flex flex-col gap-4">
                {summary && (
                    <div className="shrink-0">
                        <SummaryPlayerCard summary={summary} />
                    </div>
                )}

                {clusters.length > 0 && (
                    <div className="flex flex-col min-h-0">
                        <div className="flex items-baseline justify-between pb-2 border-b-2 border-foreground shrink-0">
                            <h2 className="font-serif text-[19px] font-bold tracking-tight text-foreground">
                                Titujt kryesor
                            </h2>
                            <span className="text-[11px] text-muted-foreground">
                                më të ndjekurat
                            </span>
                        </div>

                        <ol className="divide-y divide-border overflow-y-auto min-h-0 scrollbar-hide">
                            {clusters.map((cluster, index) => {
                                const article = cluster.top_article;
                                const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                                const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                                const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                                return (
                                    <li key={cluster.id} className="py-3 flex gap-3">
                                        <span className="font-serif text-[24px] font-bold leading-none text-muted-foreground/35 w-7 text-right tabular-nums shrink-0 pt-0.5">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block group"
                                            >
                                                <h3 className="text-[13px] font-semibold leading-snug text-foreground group-hover:underline decoration-1 line-clamp-2 mb-1">
                                                    {article.title}
                                                </h3>
                                            </a>

                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                                                <span className="font-bold uppercase" style={{ color: sourceColor }}>
                                                    {article.source_name}
                                                </span>
                                                <span>·</span>
                                                <span>{formatTime(article.crawled_at)}</span>
                                                {cluster.total_article_count > 1 && (
                                                    <>
                                                        <span>·</span>
                                                        <Link
                                                            href={`/cluster/${cluster.id}`}
                                                            className="hover:text-foreground hover:underline whitespace-nowrap"
                                                        >
                                                            {cluster.total_article_count} lajme ›
                                                        </Link>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                )}
            </div>
        </aside>
    );
}
