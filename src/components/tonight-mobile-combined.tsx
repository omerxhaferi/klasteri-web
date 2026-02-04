"use client";

import { DailySummary, TonightCluster } from "@/lib/api";
import { SOURCE_COLORS, CategoryColors, CategoryKey } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { useNightMode } from "@/hooks/use-night-mode";
import { X, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TonightMobileCombinedProps {
    clusters: TonightCluster[];
    summary: DailySummary | null;
    serverIsNight: boolean;
    forceShow?: boolean;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString.replace("Z", ""));
    return date.toLocaleTimeString("sq-AL", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

function formatSummaryText(text: string): React.ReactNode[] {
    const paragraphs = text.split('\n\n').filter(p => p.trim());

    return paragraphs.map((paragraph, idx) => {
        const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);

        const rendered = parts.map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const boldText = part.slice(2, -2);
                return (
                    <span key={partIdx} className="font-semibold text-primary">
                        {boldText}
                    </span>
                );
            }
            return part;
        });

        return (
            <p key={idx} className="mb-5 last:mb-0 text-[15px] leading-7">
                {rendered}
            </p>
        );
    });
}

function isToday(dateString: string): boolean {
    const summaryDate = new Date(dateString);
    const today = new Date();
    return summaryDate.toDateString() === today.toDateString();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

export function TonightMobileCombined({
    clusters,
    summary,
    serverIsNight,
    forceShow = false
}: TonightMobileCombinedProps) {
    const clientIsNight = useNightMode();
    const [mounted, setMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close modal on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsModalOpen(false);
        };
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    const isNight = mounted ? clientIsNight : serverIsNight;

    const isDarkMode = mounted && typeof document !== "undefined"
        ? document.documentElement.classList.contains("dark")
        : false;

    // Don't show if not night and not forced, or if there are no clusters
    if ((!isNight && !forceShow) || clusters.length === 0) return null;

    const hasSummary = summary !== null;

    return (
        <>
            <div className="lg:hidden mb-6 -mx-4 px-4">
                {/* Combined Header with "Çfarë ndodhi sot" as main title */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                Çfarë ndodhi sot?
                            </h2>
                            <p className="text-xs text-muted-foreground">Temat më të ndjekura</p>
                        </div>
                    </div>

                    {/* Read summary button - only show if we have a summary */}
                    {hasSummary && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
                        >
                            <span>Përmbledhje</span>
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    )}
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

            {/* Summary Modal - only if we have a summary */}
            {isModalOpen && hasSummary && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Çfarë ndodhi sot?
                                </h2>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(summary.summary_date)}
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6 overflow-y-auto flex-1">
                            <div className="text-muted-foreground">
                                {formatSummaryText(summary.summary_text)}
                            </div>

                            {/* Related Clusters at the end */}
                            {summary.clusters && summary.clusters.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border">
                                    <p className="text-sm font-medium text-foreground mb-4">
                                        Lexo më shumë rreth këtyre temave
                                    </p>
                                    <div className="grid gap-2 overflow-hidden">
                                        {summary.clusters.slice(0, 6).map((cluster) => (
                                            <Link
                                                key={cluster.id}
                                                href={`/cluster/${cluster.id}`}
                                                onClick={() => setIsModalOpen(false)}
                                                className="group flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors min-w-0"
                                            >
                                                <span className="text-sm text-foreground truncate flex-1 min-w-0">
                                                    {cluster.title}
                                                </span>
                                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
