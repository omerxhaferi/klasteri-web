"use client";

import { TonightCluster } from "@/lib/api";
import { CategoryColors, CategoryKey, SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useNightMode } from "@/hooks/use-night-mode";

interface TonightSidebarProps {
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

export function TonightSidebar({ clusters, serverIsNight }: TonightSidebarProps) {
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

    if (!isNight || clusters.length === 0) {
        return null;
    }

    return (
        <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-20 h-[calc(100vh-6rem)]">
                <div className="bg-card rounded-xl border border-border overflow-hidden h-full flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-border shrink-0">
                        <h2 className="text-foreground font-bold text-sm">Sot në fokus</h2>
                        <p className="text-muted-foreground text-xs mt-0.5">
                            Temat më të ndjekura
                        </p>
                    </div>

                    {/* Cluster List - Scrollable */}
                    <div className="divide-y divide-border overflow-y-auto flex-1">
                        {clusters.map((cluster) => {
                            const article = cluster.top_article;
                            const categoryKey = (cluster.category?.toLowerCase() || "vendi") as CategoryKey;
                            const baseColor = SOURCE_COLORS[article.source_name] || CategoryColors[categoryKey] || "#3b82f6";
                            const sourceColor = getAccessibleColor(baseColor, isDarkMode);

                            return (
                                <div key={cluster.id} className="p-3 hover:bg-muted/50 transition-colors">
                                    {/* Title */}
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block group"
                                    >
                                        <h3 className="text-[13px] font-semibold leading-snug text-foreground group-hover:underline decoration-1 line-clamp-2 mb-1.5">
                                            {article.title}
                                        </h3>
                                    </a>

                                    {/* Source & Time */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-[11px]">
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

                                        {/* Article count link */}
                                        {cluster.total_article_count > 1 && (
                                            <Link
                                                href={`/cluster/${cluster.id}`}
                                                className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                                            >
                                                {cluster.total_article_count} lajme
                                                <span className="text-[8px]">›</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
}
