"use client";

import type { Article, Beat } from "@/lib/api";
import { SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ALBANIAN_MONTHS_SHORT = [
    "jan", "shk", "mar", "pri", "maj", "qer",
    "kor", "gus", "sht", "tet", "nën", "dhj",
];

function formatBeatTime(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const hh = d.getHours().toString().padStart(2, "0");
    const mm = d.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
}

function formatBeatDate(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return `${d.getDate()} ${ALBANIAN_MONTHS_SHORT[d.getMonth()]}`;
}

type Props = {
    beats: Beat[];
    articles: Article[];
};

export function ClusterTimeline({ beats, articles }: Props) {
    const [mounted, setMounted] = useState(false);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});
    useEffect(() => setMounted(true), []);

    const isDarkMode =
        mounted &&
        typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark");

    const articleById = useMemo(() => {
        const map = new Map<number, Article>();
        for (const a of articles) map.set(a.id, a);
        return map;
    }, [articles]);

    if (!beats || beats.length <= 1) return null;

    return (
        <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-primary rounded-full" />
                <h2 className="text-lg font-bold">Si u zhvillua lajmi</h2>
            </div>

            <ol className="relative pl-6">
                <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
                {beats.map((beat, idx) => {
                    const anchor = articleById.get(beat.anchor_article_id);
                    const baseColor = anchor
                        ? SOURCE_COLORS[anchor.source_name] || "#3b82f6"
                        : "#3b82f6";
                    const sourceColor = getAccessibleColor(baseColor, isDarkMode);
                    const isBreak = beat.type === "break";
                    const copies = beat.copy_article_ids
                        .map((id) => articleById.get(id))
                        .filter((a): a is Article => Boolean(a));
                    const isOpen = expanded[idx] ?? false;

                    return (
                        <li key={idx} className="relative pb-6 last:pb-0">
                            <span
                                className={`absolute -left-6 top-1 w-3 h-3 rounded-full border-2 ${
                                    isBreak
                                        ? "bg-primary border-primary"
                                        : "bg-card border-primary"
                                }`}
                            />

                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
                                <span className="font-mono">
                                    {formatBeatTime(beat.timestamp)}
                                </span>
                                <span>·</span>
                                <span>{formatBeatDate(beat.timestamp)}</span>
                                <span
                                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        isBreak
                                            ? "bg-primary/15 text-primary"
                                            : "bg-muted text-foreground/70"
                                    }`}
                                >
                                    {isBreak ? "Filloi" : "Përditësim"}
                                </span>
                            </div>

                            {anchor ? (
                                <a
                                    href={anchor.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="text-[11px] font-bold uppercase tracking-tight"
                                            style={{ color: sourceColor }}
                                        >
                                            {anchor.source_name}
                                        </span>
                                        <ExternalLink
                                            size={11}
                                            className="text-muted-foreground"
                                        />
                                    </div>
                                    <h3 className="text-[15px] font-bold leading-snug group-hover:underline decoration-1">
                                        {beat.label || anchor.title}
                                    </h3>
                                </a>
                            ) : (
                                <h3 className="text-[15px] font-bold leading-snug">
                                    {beat.label}
                                </h3>
                            )}

                            {copies.length > 0 && (
                                <div className="mt-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpanded((s) => ({
                                                ...s,
                                                [idx]: !isOpen,
                                            }))
                                        }
                                        className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                    >
                                        +{copies.length} burime tjera
                                        <span aria-hidden>{isOpen ? "▴" : "▾"}</span>
                                    </button>
                                    {isOpen && (
                                        <ul className="mt-2 ml-1 flex flex-wrap gap-x-3 gap-y-1">
                                            {copies.map((c) => {
                                                const cBase =
                                                    SOURCE_COLORS[c.source_name] ||
                                                    "#3b82f6";
                                                const cColor = getAccessibleColor(
                                                    cBase,
                                                    isDarkMode
                                                );
                                                return (
                                                    <li key={c.id}>
                                                        <a
                                                            href={c.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-[11px] font-bold uppercase tracking-tight hover:underline"
                                                            style={{ color: cColor }}
                                                        >
                                                            {c.source_name}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}
