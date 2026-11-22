"use client";

import { DailySummary, getSummaryAudioUrl } from "@/lib/api";
import { X, Square, Volume2, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TabHeading } from "@/components/tab-heading";

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
        displayHour = 18;
    } else {
        displayHour = 22;
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
                    <strong key={partIdx} className="font-bold">
                        {boldText}
                    </strong>
                );
            }
            return part;
        });

        return (
            <p key={idx} className="mb-4 last:mb-0 text-[15px] leading-[1.55]">
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
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

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
        setDuration(0);
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

    const seekToPosition = useCallback((clientX: number) => {
        if (!audioRef.current || !audioRef.current.duration || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        audioRef.current.currentTime = percentage * audioRef.current.duration;
    }, []);

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        seekToPosition(e.clientX);
    }, [seekToPosition]);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            seekToPosition(e.clientX);
        }
    }, [seekToPosition]);

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
            setDuration(audio.duration || 0);
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
            {/* Summary Player Card */}
            <div className="bg-muted border border-border px-2.5 py-2">
                {/* Top row */}
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold truncate flex-1">
                        {timeLabel}
                    </span>

                    {playerActive && (
                        <>
                            <button
                                onClick={togglePause}
                                aria-label={isPaused ? "Vazhdo" : "Ndalo përkohësisht"}
                                className="w-6 h-6 rounded-sm border border-border bg-background flex items-center justify-center shrink-0 text-primary hover:bg-accent"
                            >
                                {isPaused ? (
                                    <Play className="h-2.5 w-2.5 fill-current" />
                                ) : (
                                    <Pause className="h-2.5 w-2.5 fill-current" />
                                )}
                            </button>
                            <button
                                onClick={stopAudio}
                                aria-label="Ndalo"
                                className="w-6 h-6 rounded-sm border border-border bg-background flex items-center justify-center shrink-0 text-primary hover:bg-accent"
                            >
                                <Square className="h-2 w-2 fill-current" />
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-[12px] font-bold text-primary hover:underline shrink-0"
                    >
                        Lexo »
                    </button>

                    {!playerActive && summary.has_audio && (
                        <button
                            onClick={playAudio}
                            disabled={isLoadingAudio}
                            className="h-6 bg-primary text-primary-foreground rounded-sm px-2 text-[12px] font-bold shrink-0 flex items-center gap-1 disabled:opacity-50"
                        >
                            {isLoadingAudio ? (
                                <div className="h-3 w-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                            ) : (
                                <Volume2 className="h-3 w-3" />
                            )}
                            Dëgjo
                        </button>
                    )}
                </div>

                {/* Seekable progress bar */}
                {playerActive && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 w-7 text-right">
                            {formatTimeRemaining(progress * duration)}
                        </span>
                        <div
                            ref={progressBarRef}
                            onPointerDown={handlePointerDown}
                            onPointerMove={handlePointerMove}
                            className="flex-1 h-1.5 bg-background border border-border cursor-pointer relative touch-none"
                        >
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${progress * 100}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-3.5 bg-primary"
                                style={{ left: `${progress * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums shrink-0 w-7">
                            {formatTimeRemaining(timeRemaining)}
                        </span>
                    </div>
                )}
            </div>

            {/* Summary Text Modal - portaled to body to escape stacking contexts */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={handleModalClose}
                    />

                    <div className="relative bg-background border border-border border-t-[3px] border-t-brand shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
                        <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
                            <div>
                                <h2 className="text-[18px] font-bold">
                                    {timeLabel}
                                </h2>
                                <p className="text-[12px] text-muted-foreground">
                                    {formatDate(summary.summary_date)}
                                </p>
                            </div>
                            <button
                                onClick={handleModalClose}
                                aria-label="Mbyll"
                                className="flex items-center justify-center w-8 h-8 rounded-sm border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="px-5 py-5 overflow-y-auto flex-1">
                            <div>
                                {formatSummaryText(summary.summary_text)}
                            </div>

                            {/* AI Disclaimer */}
                            <p className="mt-5 text-[11px] text-muted-foreground">
                                Kjo përmbledhje u gjenerua automatikisht nga inteligjenca artificiale (AI).
                                Për informacion të plotë, lexoni artikujt origjinalë.
                            </p>

                            {summary.clusters && summary.clusters.length > 0 && (
                                <div className="mt-6">
                                    <TabHeading title="Lexo më shumë" as="h3" />
                                    <ul>
                                        {summary.clusters.slice(0, 6).map((cluster) => (
                                            <li
                                                key={cluster.id}
                                                className="py-1.5 border-b border-dotted border-border flex items-baseline gap-1.5"
                                            >
                                                <span aria-hidden className="shrink-0 text-[8px] leading-none -translate-y-px text-muted-foreground/60">■</span>
                                                <Link
                                                    href={`/cluster/${cluster.id}`}
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="min-w-0 truncate text-[13px] text-headline"
                                                >
                                                    {cluster.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
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
