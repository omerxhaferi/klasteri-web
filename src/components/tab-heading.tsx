import type { ReactNode } from "react";

/**
 * A block heading: a filled tab sitting on a rule of its own colour.
 *
 *     ┌────────┐
 *     │ VENDI  │                                   më shumë »
 *     └────────┴──────────────────────────────────────────────
 *
 * Every block on the site is introduced this way — the feed's sections in
 * their category colour, the sidebar's blocks in the default slate — so a
 * reader learns one shape. No hooks: it renders the same on the server and
 * inside client components.
 */
export function TabHeading({
    title,
    color,
    right,
    as: Tag = "h2",
    className = "",
}: {
    title: string;
    /** Fill and rule. Defaults to the slate `--tab`. Must carry white text. */
    color?: string;
    /** Small note or link at the far end of the rule. */
    right?: ReactNode;
    as?: "h1" | "h2" | "h3";
    className?: string;
}) {
    const tone = color ?? "var(--tab)";

    return (
        <div
            className={`flex items-end justify-between gap-3 border-b-2 ${className}`}
            style={{ borderBottomColor: tone }}
        >
            <Tag
                className="font-display text-[15px] font-bold uppercase leading-none text-white px-2.5 pt-[7px] pb-[5px]"
                style={{ backgroundColor: tone }}
            >
                {title}
            </Tag>
            {right ? (
                <div className="pb-[3px] text-[12px] text-muted-foreground whitespace-nowrap">
                    {right}
                </div>
            ) : null}
        </div>
    );
}
