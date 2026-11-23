"use client";

/**
 * "Karburantet" — the regulator's maximum fuel prices, each beside the price
 * it replaced, the way a station's sign changes:
 *
 *     Dizel                    92  88,5 den   ▼ 3,5      (92 struck through)
 *
 * Between a decision and the day it applies — MK: Monday afternoon until
 * 00:01 Tuesday; AL: a Board decision "from tomorrow" — the price at the pump
 * is still the OLD one. Then a line over the same rows says so, as gorivo.mk
 * does:
 *
 *     Lirohen nga mesnata
 *     Dizel                    92  88,5 den   ▼ 3,5
 *
 * Until 2026-11-23 the card showed only the new price there, i.e. told a
 * reader filling up tonight a price they could not get until tomorrow. (An
 * arrow, "92 → 88,5", was tried for that window; the owner chose the struck
 * price for both.)
 *
 * The numbers are each edition's regulator's: North Macedonia's Energy
 * Regulatory Commission (KRE / ERC) and Albania's Transparency Board. The
 * previous price is the regulator's previous decision, which the crawler
 * keeps because neither publishes history. Kosovo has no official price
 * (stations set their own), so the API returns none for it and this renders
 * nothing — as for any edition without an entry in EDITIONS below.
 *
 * Motion: the new price rolls in from the old one (down when cheaper, up when
 * dearer), row by row, then the old one is struck through. The animation is
 * CSS (globals.css, "Fuel prices") and its resting state is the final one, so
 * a page whose script never runs still shows the right numbers. The one hook
 * below only holds it back until the card is on screen — on a phone it sits
 * below the top stories, where it would otherwise play to nobody.
 */

import { useEffect, useRef, type CSSProperties } from "react";
import type { FuelPrice, FuelPricesData } from "@/lib/api";
import { TabHeading } from "@/components/tab-heading";

interface Edition {
    /** In display order. Mazut (MK) is left out: sold by the kilo, to industry. */
    products: { product: string; label: string }[];
    /** After the price: "84 den". */
    currency: string;
    /** In the screen-reader sentence: "U ul për 2 denarë". */
    currencyWord: string;
    /** "Çmimet maksimale për litër, sipas …" */
    source: { name: string; href: string };
    /** Whose midnight "nga mesnata" means. */
    timeZone: string;
}

const EDITIONS: Record<string, Edition> = {
    MK: {
        products: [
            { product: "bs95", label: "Benzinë 95" },
            { product: "bs98", label: "Benzinë 98" },
            { product: "diesel", label: "Dizel" },
            { product: "el1", label: "Nafta për ngrohje" },
        ],
        currency: "den",
        currencyWord: "denarë",
        source: { name: "KRE", href: "https://www.erc.org.mk/Default_al.aspx" },
        timeZone: "Europe/Skopje",
    },
    AL: {
        // Diesel first: in Albania it is the headline number of every decision.
        products: [
            { product: "diesel", label: "Naftë" },
            { product: "petrol", label: "Benzinë" },
            { product: "lpg", label: "Gaz (LPG)" },
        ],
        currency: "lekë",
        currencyWord: "lekë",
        source: { name: "Bordit të Transparencës", href: "https://ata.gov.al/?s=Bordi+i+Transparences" },
        timeZone: "Europe/Tirane",
    },
};

const MONTHS = [
    "janar", "shkurt", "mars", "prill", "maj", "qershor",
    "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor",
];

/** Albanian decimal comma, no trailing zeros: 84, 100,5, 2,5. */
function amount(n: number): string {
    return (Math.round(n * 100) / 100).toString().replace(".", ",");
}

/** "2026-11-17" -> "17 nëntor". Parsed by hand so server and browser agree. */
function dayAndMonth(isoDate: string): string {
    const [, month, day] = isoDate.split("-").map(Number);
    return `${day} ${MONTHS[month - 1]}`;
}

/** Today in `timeZone` as YYYY-MM-DD, the shape of `valid_from`. */
function todayIn(timeZone: string): string {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

function nextDay(isoDate: string): string {
    const d = new Date(`${isoDate}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
}

interface Row {
    label: string;
    price: FuelPrice;
    /** The price it replaces, when it differs. */
    before: number | null;
    /** Decided, but not at the pump until `valid_from`: `before` is today's price. */
    pending: boolean;
}

/** The new price, rolling in from the old one — down when cheaper, up when dearer. */
function Roll({ from, to }: { from: number | null; to: number }) {
    if (from === null) return <>{amount(to)}</>;
    return (
        <span className="fp-roll" data-dir={to < from ? "down" : "up"}>
            <span className="fp-to">{amount(to)}</span>
            <span className="fp-from" aria-hidden="true">
                {amount(from)}
            </span>
        </span>
    );
}

function Change({ row, currencyWord }: { row: Row; currencyWord: string }) {
    const { change } = row.price;
    if (change === null) return null;

    if (row.before === null) {
        return (
            <span className="text-muted-foreground">
                <span aria-hidden="true">—</span>
                <span className="sr-only">Pa ndryshim</span>
            </span>
        );
    }

    const cheaper = change < 0;
    const size = amount(Math.abs(change));
    const meaning = row.pending
        ? `${cheaper ? "Ulet" : "Rritet"} për ${size} ${currencyWord}`
        : `${cheaper ? "U ul" : "U rrit"} për ${size} ${currencyWord}`;
    return (
        <span
            className="fp-later font-bold"
            style={{ color: cheaper ? "var(--price-down)" : "var(--price-up)" }}
            title={meaning}
        >
            <span aria-hidden="true">{cheaper ? "▼" : "▲"} {size}</span>
            <span className="sr-only">{meaning}</span>
        </span>
    );
}

/** "Lirohen nga mesnata" over the rows that change at the next decision. */
function pendingNotice(rows: Row[], today: string): { text: string; color: string } | null {
    const coming = rows.filter((r) => r.pending && r.before !== null);
    if (coming.length === 0) return null;

    const down = coming.every((r) => r.price.price < r.before!);
    const up = coming.every((r) => r.price.price > r.before!);
    const from = coming.map((r) => r.price.valid_from).sort()[0];
    const when = from === nextDay(today) ? "nga mesnata" : `nga ${dayAndMonth(from)}`;

    if (down) return { text: `Lirohen ${when}`, color: "var(--price-down)" };
    if (up) return { text: `Shtrenjtohen ${when}`, color: "var(--price-up)" };
    return { text: `Çmime të reja ${when}`, color: "var(--headline)" };
}

/**
 * Holds the roll back until the card is on screen. On first paint the CSS has
 * already started it; when the card is below the fold at that moment, rewind
 * and pause it there, out of sight, and play it once the card scrolls in.
 */
function usePlayWhenSeen() {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || typeof el.getAnimations !== "function" || !("IntersectionObserver" in window)) return;

        // None under prefers-reduced-motion, or while the card is display:none
        // (the desktop copy on a phone and the reverse).
        const animations = el.getAnimations({ subtree: true });
        if (animations.length === 0) return;
        if (el.getBoundingClientRect().top < window.innerHeight) return;

        for (const a of animations) {
            a.pause();
            a.currentTime = 0;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (!entries.some((e) => e.isIntersecting)) return;
                for (const a of animations) a.play();
                observer.disconnect();
            },
            { threshold: 0.5 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return ref;
}

export function FuelPricesCard({ data, className = "" }: { data: FuelPricesData; className?: string }) {
    const ref = usePlayWhenSeen();
    const edition = EDITIONS[data.country];
    if (!edition) return null;

    const today = todayIn(edition.timeZone);
    const rows: Row[] = edition.products.flatMap(({ product, label }) => {
        const price = data.prices.find((p) => p.product === product);
        if (!price) return [];
        const before =
            price.previous_price !== null && Math.abs(price.price - price.previous_price) >= 0.005
                ? price.previous_price
                : null;
        return [{ label, price, before, pending: price.valid_from > today }];
    });

    if (rows.length === 0) return null;

    const notice = pendingNotice(rows, today);
    // Once a decision applies, the date it applied from; before, the notice says when.
    const inEffect = rows.filter((r) => !r.pending).map((r) => r.price.valid_from).sort().at(-1);
    const heading = notice || !inEffect ? undefined : `nga ${dayAndMonth(inEffect)}`;

    return (
        <section ref={ref} className={className} aria-label="Çmimet e karburanteve">
            <TabHeading title="Karburantet" right={heading} />

            {notice && (
                <p
                    className="py-[5px] text-[13px] font-bold border-b border-dotted border-border"
                    style={{ color: notice.color }}
                >
                    {notice.text}
                </p>
            )}

            <table className="w-full border-collapse tabular-nums">
                <thead className="sr-only">
                    <tr>
                        <th scope="col">Karburanti</th>
                        <th scope="col">{notice ? "Sot" : "Më parë"}</th>
                        <th scope="col">{notice ? "Nga mesnata" : "Tani"}</th>
                        <th scope="col">Ndryshimi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={row.price.product}
                            className="border-b border-dotted border-border"
                            style={{ "--fp-delay": `${250 + i * 110}ms` } as CSSProperties}
                        >
                            <th scope="row" className="w-full py-[5px] pr-2 text-left text-[13px] font-normal">
                                {row.label}
                            </th>
                            <td className="py-[5px] pl-2 text-right whitespace-nowrap">
                                {row.before !== null && (
                                    <span className="fp-was text-[12px] text-muted-foreground">
                                        {amount(row.before)}
                                    </span>
                                )}
                            </td>
                            {/* Old right-aligned, new left-aligned: they meet in the middle. */}
                            <td className="py-[5px] pl-1.5 text-left whitespace-nowrap">
                                <span className="text-[14px] font-bold">
                                    <Roll from={row.before} to={row.price.price} />
                                </span>{" "}
                                <span
                                    className={`text-[11px] text-muted-foreground ${row.before !== null ? "fp-later" : ""}`}
                                >
                                    {edition.currency}
                                </span>
                            </td>
                            <td className="py-[5px] pl-2.5 text-right text-[11px] whitespace-nowrap">
                                <Change row={row} currencyWord={edition.currencyWord} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="pt-1.5 text-[11px] text-muted-foreground">
                Çmimet maksimale për litër, sipas{" "}
                <a
                    href={edition.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                >
                    {edition.source.name}
                </a>
            </p>
        </section>
    );
}
