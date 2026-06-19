/**
 * Reader-side "mute sources" support.
 *
 * Muted publishers are stored in a cookie so the server-rendered feed can be
 * filtered before render (no flash of muted content). The toggle UI writes the
 * cookie client-side; the server components read it via next/headers.
 */

import { Cluster, TonightCluster } from "@/lib/api";

export const MUTED_COOKIE = "muted_sources";

/** Parse the muted-sources cookie value (comma-joined, URL-encoded names). */
export function parseMutedCookie(value: string | undefined | null): Set<string> {
    if (!value) return new Set();
    try {
        return new Set(
            decodeURIComponent(value)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
        );
    } catch {
        return new Set();
    }
}

export function serializeMuted(muted: Iterable<string>): string {
    return encodeURIComponent([...muted].join(","));
}

/**
 * Remove muted publishers from each cluster's articles. The next non-muted
 * article becomes the lead automatically (order is preserved). Clusters left
 * with no articles are dropped. The visible "other articles" count is adjusted
 * down by how many visible articles were muted.
 */
export function applyMutesToClusters(clusters: Cluster[], muted: Set<string>): Cluster[] {
    if (muted.size === 0) return clusters;

    const result: Cluster[] = [];
    for (const cluster of clusters) {
        const kept = cluster.articles.filter((a) => !muted.has(a.source_name));
        if (kept.length === 0) continue; // every source muted → hide the story

        const removed = cluster.articles.length - kept.length;
        result.push({
            ...cluster,
            articles: kept,
            // Best-effort: decrement the total by the muted articles we could see.
            article_count: Math.max(kept.length, cluster.article_count - removed),
        });
    }
    return result;
}

/**
 * "Titujt kryesor" items only carry a single representative article, so we can't
 * re-pick a lead — hide the item when its lead publisher is muted.
 */
export function applyMutesToTonight(clusters: TonightCluster[], muted: Set<string>): TonightCluster[] {
    if (muted.size === 0) return clusters;
    return clusters.filter((c) => !muted.has(c.top_article.source_name));
}
