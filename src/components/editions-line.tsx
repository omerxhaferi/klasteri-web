import Link from "next/link";
import type { EditionLink } from "@/lib/api";
import { IN_COUNTRY } from "@/lib/country";

/**
 * A story in another edition only counts once that edition has it from a few
 * newsrooms; one outlet's copy is not "the story is big in Kosovo too".
 */
const MIN_OUTLETS = 3;

/**
 * "Edhe në Kosovë: 38 lajme · në Shqipëri: 20 lajme" — the same story in the
 * sibling editions, each a link to that edition's story page. The link carries
 * its country, so it opens there without moving the reader's own edition.
 */
export function EditionsLine({ editions, className = "" }: { editions?: EditionLink[]; className?: string }) {
    const shown = (editions ?? []).filter((e) => e.outlet_count >= MIN_OUTLETS);
    if (shown.length === 0) return null;
    return (
        <div className={`text-muted-foreground ${className}`}>
            {"Edhe "}
            {shown.map((e, i) => (
                <span key={e.country} className="whitespace-nowrap">
                    {i > 0 && " · "}
                    <Link href={`/cluster/${e.cluster_id}?country=${e.country}`} className="font-bold text-primary">
                        {IN_COUNTRY[e.country]}
                    </Link>
                    {`: ${e.article_count} lajme`}
                </span>
            ))}
        </div>
    );
}
