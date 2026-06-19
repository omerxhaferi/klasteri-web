"use client";

import { SourceInfo } from "@/lib/api";
import { MUTED_COOKIE, parseMutedCookie, serializeMuted } from "@/lib/mutes";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

    const sorted = useMemo(
        () => [...sources].sort((a, b) => a.name.localeCompare(b.name, "sq")),
        [sources]
    );

    return (
        <div>
            <div className="flex items-baseline justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                    Burimet e çaktivizuara nuk shfaqen në lajme.
                </p>
                {mounted && mutedCount > 0 && (
                    <button
                        onClick={() => {
                            setMuted(new Set());
                            writeMutedCookie(new Set());
                            router.refresh();
                        }}
                        className="text-sm font-semibold text-primary hover:underline whitespace-nowrap"
                    >
                        Pastro ({mutedCount})
                    </button>
                )}
            </div>

            <div className="rounded-xl border border-border overflow-hidden bg-card">
                {sorted.map((source, i) => {
                    const isMuted = muted.has(source.name);
                    return (
                        <button
                            key={source.name}
                            onClick={() => toggle(source.name)}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                                i > 0 ? "border-t border-border" : ""
                            }`}
                        >
                            <span className={`font-medium ${isMuted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                {source.name}
                            </span>

                            {/* Switch: ON = showing (active), OFF = muted */}
                            <span
                                aria-hidden
                                className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                                    mounted && !isMuted ? "bg-primary" : "bg-muted-foreground/40"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                                        mounted && !isMuted ? "translate-x-5" : "translate-x-1"
                                    }`}
                                />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
