"use client";

import { DailySummary, getSummaryAudioUrl } from "@/lib/api";
import { X, Sparkles, Clock, ArrowRight, Square, BookOpen, Volume2, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function getSummaryTimeLabel(createdAt: string): string {
    const date = new Date(createdAt.replace("Z", ""));
    const hour = date.getHours();
    const now = new Date();

    let displayHour: number;
    if (hour >= 11 && hour <= 13) {
        displayHour = 12;
    } else if (hour >= 14 && hour <= 16) {
        displayHour = 15;
    } else if (hour >= 17 && hour <= 20) {
        displayHour = 19;
    } else {
        displayHour = 23;
    }

    let label = `Lajmet e orës ${displayHour}`;

    const isYesterday =
        date.getDate() !== now.getDate() ||
        date.getMonth() !== now.getMonth() ||
        date.getFullYear() !== now.getFullYear();

    if (isYesterday) {
        label = `Dje - ${label}`;
    }

    return label;
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

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("sq-AL", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });
}

function formatTimeRemaining(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface SummaryPlayerCardProps {
    summary: DailySummary;
}

export function SummaryPlayerCard({ summary }: SummaryPlayerCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [playerActive, setPlayerActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [progress, setProgress] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const timeLabel = getSummaryTimeLabel(summary.created_at);

    const stopAudio = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
        }
        setPlayerActive(false);
        setIsPaused(false);
        setProgress(0);
        setTimeRemaining(0);
    }, []);

    const togglePause = useCallback(() => {
        if (!audioRef.current) return;
        if (isPaused) {
            audioRef.current.play();
            setIsPaused(false);
        } else {
            audioRef.current.pause();
            setIsPaused(true);
        }
    }, [isPaused]);

    const handleModalClose = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const playAudio = useCallback(() => {
        if (playerActive) {
            stopAudio();
            return;
        }

        setIsLoadingAudio(true);
        const audio = new Audio(getSummaryAudioUrl(summary.id));
        audioRef.current = audio;

        audio.addEventListener("canplaythrough", () => {
            setIsLoadingAudio(false);
            setPlayerActive(true);
            setIsPaused(false);
            audio.play();
        }, { once: true });

        audio.addEventListener("timeupdate", () => {
            if (audio.duration && isFinite(audio.duration)) {
                setProgress(audio.currentTime / audio.duration);
                setTimeRemaining(audio.duration - audio.currentTime);
            }
        });

        audio.addEventListener("ended", () => {
            setPlayerActive(false);
            setIsPaused(false);
            setProgress(0);
            setTimeRemaining(0);
            audioRef.current = null;
        }, { once: true });

        audio.addEventListener("error", () => {
            setIsLoadingAudio(false);
            setPlayerActive(false);
            setIsPaused(false);
            audioRef.current = null;
        }, { once: true });

        audio.load();
    }, [playerActive, stopAudio, summary.id]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleModalClose();
        };
        if (isModalOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, handleModalClose]);

    return (
        <>
            {/* Ultra-compact single-line player */}
            <div className="flex items-center gap-2 h-8">
                {playerActive ? (
                    /* Playing/paused state: pause/play + stop + progress + time */
                    <>
                        <button
                            onClick={togglePause}
                            className="w-5 h-5 rounded-full bg-muted-foreground/15 hover:bg-muted-foreground/25 flex items-center justify-center shrink-0 transition-colors"
                        >
                            {isPaused ? (
                                <Play className="h-2.5 w-2.5 fill-muted-foreground text-muted-foreground ml-0.5" />
                            ) : (
                                <Pause className="h-2.5 w-2.5 fill-muted-foreground text-muted-foreground" />
                            )}
                        </button>
                        <button
                            onClick={stopAudio}
                            className="w-5 h-5 rounded-full bg-muted-foreground/15 hover:bg-muted-foreground/25 flex items-center justify-center shrink-0 transition-colors"
                        >
                            <Square className="h-2 w-2 fill-muted-foreground text-muted-foreground" />
                        </button>
                        <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                            {timeLabel}
                        </span>
                        <div className="flex-1 min-w-0">
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-muted-foreground/40 rounded-full transition-all duration-200"
                                    style={{ width: `${progress * 100}%` }}
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">
                            {formatTimeRemaining(timeRemaining)}
                        </span>
                    </>
                ) : (
                    /* Default state: label · icon Lexo · icon Dëgjo */
                    <>
                        <span className="text-[12px] text-foreground font-semibold truncate">
                            {timeLabel}
                        </span>
                        <span className="text-muted-foreground/30 text-[10px]">·</span>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-[12px] text-muted-foreground hover:text-foreground font-medium transition-colors shrink-0 flex items-center gap-1"
                        >
                            <BookOpen className="h-3 w-3" />
                            Lexo
                        </button>
                        {summary.has_audio && (
                            <>
                                <span className="text-muted-foreground/30 text-[10px]">·</span>
                                <button
                                    onClick={playAudio}
                                    disabled={isLoadingAudio}
                                    className="text-[12px] text-muted-foreground hover:text-foreground font-medium transition-colors shrink-0 flex items-center gap-1 disabled:opacity-50"
                                >
                                    {isLoadingAudio ? (
                                        <div className="h-3 w-3 border border-muted-foreground/40 border-t-muted-foreground rounded-full animate-spin" />
                                    ) : (
                                        <Volume2 className="h-3 w-3" />
                                    )}
                                    Dëgjo
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Summary Text Modal - portaled to body to escape stacking contexts */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={handleModalClose}
                    />

                    <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    {timeLabel}
                                </h2>
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(summary.summary_date)}
                                </p>
                            </div>
                            <button
                                onClick={handleModalClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="px-6 py-6 overflow-y-auto flex-1">
                            <div className="text-muted-foreground">
                                {formatSummaryText(summary.summary_text)}
                            </div>

                            {/* AI Disclaimer */}
                            <p className="mt-6 text-[11px] text-muted-foreground/60 italic">
                                Kjo përmbledhje u gjenerua automatikisht nga inteligjenca artificiale (AI).
                                Për informacion të plotë, lexoni artikujt origjinalë.
                            </p>

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
                </div>,
                document.body
            )}
        </>
    );
}
