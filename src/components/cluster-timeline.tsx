"use client";

import type { Article, Beat } from "@/lib/api";
import { SOURCE_COLORS } from "@/lib/constants";
import { getAccessibleColor } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { TabHeading } from "@/components/tab-heading";

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
        <section className="mt-2">
            <TabHeading title="Si u zhvillua lajmi" className="mb-4" />

            <ol className="relative pl-5">
                <span className="absolute left-[4px] top-1 bottom-1 w-px bg-border" />
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
                        <li key={idx} className="relative pb-4 last:pb-0">
                            {/* A filled square where the story broke, an open one for each update. */}
                            <span
                                className={`absolute -left-5 top-[3px] w-[9px] h-[9px] border-2 border-hot ${
                                    isBreak ? "bg-hot" : "bg-background"
                                }`}
                            />

                            <div className="text-[12px] text-muted-foreground">
                                <span className="font-bold text-foreground tabular-nums">
                                    {formatBeatTime(beat.timestamp)}
                                </span>
                                {" - "}
                                {formatBeatDate(beat.timestamp)}
                                {" - "}
                                <span className={`font-bold ${isBreak ? "text-hot" : ""}`}>
                                    {isBreak ? "Filloi" : "Përditësim"}
                                </span>
                            </div>

                            {anchor ? (
                                <>
                                    <a
                                        href={anchor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-headline"
                                    >
                                        <h3 className="mt-0.5 text-[15px] font-bold leading-[1.3]">
                                            {beat.label || anchor.title}
                                        </h3>
                                    </a>
                                    <div
                                        className="mt-0.5 text-[12px] font-bold"
                                        style={{ color: sourceColor }}
                                    >
                                        {anchor.source_name}
                                    </div>
                                </>
                            ) : (
                                <h3 className="mt-0.5 text-[15px] font-bold leading-[1.3]">
                                    {beat.label}
                                </h3>
                            )}

                            {copies.length > 0 && (
                                <div className="mt-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpanded((s) => ({
                                                ...s,
                                                [idx]: !isOpen,
                                            }))
                                        }
                                        className="text-[12px] text-primary hover:underline"
                                    >
                                        +{copies.length} burime tjera{" "}
                                        <span aria-hidden>{isOpen ? "▴" : "▾"}</span>
                                    </button>
                                    {isOpen && (
                                        <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
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
                                                            className="text-[12px] font-bold"
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
