"use client";

import { DailySummary, FuelPricesData, TonightCluster } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { SummaryPlayerCard } from "@/components/summary-player-card";
import { FuelPricesCard } from "@/components/fuel-prices-card";
import { TabHeading } from "@/components/tab-heading";

interface TonightSidebarProps {
    clusters: TonightCluster[];
    summary: DailySummary | null;
    serverIsNight: boolean;
    forceShow?: boolean;
    /** Above "Titujt kryesor"; the list scrolls to make room for it. */
    fuel?: FuelPricesData | null;
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

export function TonightSidebar({ clusters, summary, fuel }: TonightSidebarProps) {
    const isDarkMode = useSyncExternalStore(
        subscribe,
        () => document.documentElement.classList.contains("dark"),
        () => false
    );

    const hasFuel = !!fuel && fuel.prices.length > 0;

    if (clusters.length === 0 && !summary && !hasFuel) {
        return null;
    }

    return (
        <aside className="hidden lg:block w-[280px] shrink-0">
            {/* 52px: the 40px section bar plus a little air. */}
            <div className="sticky top-[52px] max-h-[calc(100vh-4rem)] flex flex-col gap-5">
                {summary && (
                    <div className="shrink-0">
                        <SummaryPlayerCard summary={summary} />
                    </div>
                )}

                {hasFuel && <FuelPricesCard data={fuel!} className="shrink-0" />}

                {clusters.length > 0 && (
                    <div className="flex flex-col min-h-0">
                        <TabHeading
                            title="Titujt kryesor"
                            right="më të ndjekurat"
                            className="shrink-0"
                        />

                        <ol className="overflow-y-auto min-h-0 scrollbar-hide">
                            {clusters.map((cluster, index) => {
                                const article = cluster.top_article;
                                const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                                const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                                const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                                return (
                                    <li
                                        key={cluster.id}
                                        className="py-2 flex gap-2.5 border-b border-dotted border-border last:border-b-0"
                                    >
                                        <span className="font-display text-[21px] font-bold leading-none text-hot w-6 text-right tabular-nums shrink-0">
                                            {index + 1}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-headline"
                                            >
                                                <h3 className="text-[13px] font-bold leading-[1.3] line-clamp-2">
                                                    {article.title}
                                                </h3>
                                            </a>

                                            <div className="mt-0.5 text-[11px] text-muted-foreground">
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
