"use client";

import { DailySummary } from "@/lib/api";
import { useNightMode } from "@/hooks/use-night-mode";
import { X, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DailySummaryCardProps {
    summary: DailySummary | null;
    serverIsNight: boolean;
    forceShow?: boolean;
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

export function DailySummaryCard({ summary, serverIsNight, forceShow = false }: DailySummaryCardProps) {
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

    if ((!isNight && !forceShow) || !summary) {
        return null;
    }

    return (
        <>
            {/* Compact Trigger */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-6 w-full group"
            >
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between hover:border-primary/40 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                            Çfarë ndodhi sot?
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-primary group-hover:gap-3 transition-all">
                        <span>Lexo përmbledhjen</span>
                        <ArrowRight className="h-3 w-3" />
                    </div>
                </div>
            </button>

            {/* Modal */}
            {isModalOpen && (
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
