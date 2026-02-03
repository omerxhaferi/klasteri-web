"use client";

import { TonightCluster } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useNightMode } from "@/hooks/use-night-mode";

interface TonightMobileProps {
    clusters: TonightCluster[];
    serverIsNight: boolean;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString.replace("Z", ""));
    return date.toLocaleTimeString("sq-AL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

export function TonightMobile({ clusters, serverIsNight }: TonightMobileProps) {
    const clientIsNight = useNightMode();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Use server value until after hydration so server and client first paint match
    const isNight = mounted ? clientIsNight : serverIsNight;

    const isDarkMode = mounted && typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false;

    if (!isNight || clusters.length === 0) return null;

    return (
        <div className="lg:hidden mb-6 -mx-4 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-sm font-bold text-foreground">Sot në fokus</h2>
                    <p className="text-xs text-muted-foreground">Temat më të ndjekura</p>
                </div>
            </div>

            {/* Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {clusters.slice(0, 6).map((cluster) => {
                    const article = cluster.top_article;
                    const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                    const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                    const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                    return (
                        <div
                            key={cluster.id}
                            className="flex-shrink-0 w-[200px] bg-card border border-border rounded-lg p-3"
                        >
                            {/* Title */}
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

                            {/* Source & Time */}
                            <div className="flex items-center justify-between">
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
                                </div>
                            </div>

                            {/* Article count */}
                            {cluster.total_article_count > 1 && (
                                <Link
                                    href={`/cluster/${cluster.id}`}
                                    className="text-[10px] text-primary hover:underline mt-2 inline-block"
                                >
                                    {cluster.total_article_count} lajme ›
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
