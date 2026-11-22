"use client";

import { SourceInfo } from "@/lib/api";
import { MUTED_COOKIE, parseMutedCookie, serializeMuted } from "@/lib/mutes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function readMutedCookie(): Set<string> {
    if (typeof document === "undefined") return new Set();
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${MUTED_COOKIE}=`));
    return parseMutedCookie(match?.split("=").slice(1).join("="));
}

function writeMutedCookie(muted: Set<string>) {
    document.cookie = `${MUTED_COOKIE}=${serializeMuted(muted)}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function MuteSettings({ sources }: { sources: SourceInfo[] }) {
    const router = useRouter();
    const [muted, setMuted] = useState<Set<string>>(new Set());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMuted(readMutedCookie());
        setMounted(true);
    }, []);

    const mutedCount = muted.size;

    const toggle = (name: string) => {
        const next = new Set(muted);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        setMuted(next);
        writeMutedCookie(next);
        // Re-render server components (the feed) with the updated cookie.
        router.refresh();
    };

    // Already in order: the page sorts them on the server. Sorting here as well
    // broke hydration — Node and the browser disagree on Albanian collation
    // ("Sloboden Pečat" before or after "Shenja"), so the two renders differed.
    const sorted = sources;

    return (
        <div>
            <div className="flex items-baseline justify-between mb-3">
                <p className="text-[13px] text-muted-foreground">
                    Burimet e çaktivizuara nuk shfaqen në lajme.
                </p>
                {mounted && mutedCount > 0 && (
                    <button
                        onClick={() => {
                            setMuted(new Set());
                            writeMutedCookie(new Set());
                            router.refresh();
                        }}
                        className="text-[13px] font-bold text-primary hover:underline whitespace-nowrap"
                    >
                        Pastro ({mutedCount})
                    </button>
                )}
            </div>

            <div className="border border-border">
                {sorted.map((source, i) => {
                    const isMuted = muted.has(source.name);
                    const isOn = mounted && !isMuted;
                    return (
                        <button
                            key={source.name}
                            onClick={() => toggle(source.name)}
                            role="checkbox"
                            aria-checked={!isMuted}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[14px] hover:bg-muted ${
                                i > 0 ? "border-t border-dotted border-border" : ""
                            }`}
                        >
                            {/* A checkbox: ticked = shown in the feed, empty = muted */}
                            <span
                                aria-hidden
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-xs border text-[11px] leading-none font-bold ${
                                    isOn
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground bg-background"
                                }`}
                            >
                                {isOn ? "✓" : ""}
                            </span>

                            <span className={isMuted ? "text-muted-foreground line-through" : "font-bold"}>
                                {source.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
