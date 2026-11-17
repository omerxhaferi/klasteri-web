/**
 * "Karburantet" — this week's maximum fuel prices and how they moved.
 *
 * The numbers are each edition's regulator's: North Macedonia's Energy
 * Regulatory Commission (KRE / ERC) and Albania's Transparency Board. The
 * change is against the regulator's previous decision, which the crawler keeps
 * because neither publishes history. Kosovo has no official price (stations
 * set their own), so the API returns none for it and this renders nothing —
 * as for any edition without an entry in EDITIONS below.
 *
 * No hooks, no client state: it renders the same on the server (mobile, in the
 * feed) and inside the client-side left sidebar (desktop).
 */

import type { FuelPrice, FuelPricesData } from "@/lib/api";

interface Edition {
    /** In display order. Mazut (MK) is left out: sold by the kilo, to industry. */
    products: { product: string; label: string }[];
    /** After the price: "84 den". */
    currency: string;
    /** In the screen-reader sentence: "U ul për 2 denarë". */
    currencyWord: string;
    /** "Çmimet maksimale për litër, sipas …" */
    source: { name: string; href: string };
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

function Change({ value, currencyWord }: { value: number | null; currencyWord: string }) {
    if (value === null) return <span className="w-12 shrink-0" />;

    if (Math.abs(value) < 0.005) {
        return (
            <span className="w-12 shrink-0 text-right text-[11px] text-muted-foreground" title="Pa ndryshim">
                —
            </span>
        );
    }

    const cheaper = value < 0;
    const size = amount(Math.abs(value));
    const meaning = cheaper ? `U ul për ${size} ${currencyWord}` : `U rrit për ${size} ${currencyWord}`;
    return (
        <span
            className="w-12 shrink-0 text-right text-[11px] font-semibold tabular-nums"
            // Theme variables (globals.css), not dark: utilities — see there.
            style={{ color: cheaper ? "var(--price-down)" : "var(--price-up)" }}
            title={meaning}
            aria-label={meaning}
        >
            {cheaper ? "▼" : "▲"} {size}
        </span>
    );
}

export function FuelPricesCard({ data, className = "" }: { data: FuelPricesData; className?: string }) {
    const edition = EDITIONS[data.country];
    if (!edition) return null;

    const rows = edition.products
        .map(({ product, label }) => ({ label, price: data.prices.find((p) => p.product === product) }))
        .filter((r): r is { label: string; price: FuelPrice } => r.price !== undefined);

    if (rows.length === 0) return null;

    const validFrom = rows.map((r) => r.price.valid_from).sort().at(-1)!;

    return (
        <section className={className} aria-label="Çmimet e karburanteve">
            <div className="flex items-baseline justify-between pb-2 border-b-2 border-foreground">
                <h2 className="font-serif text-[19px] font-bold tracking-tight text-foreground">
                    Karburantet
                </h2>
                <span className="text-[11px] text-muted-foreground">
                    nga {dayAndMonth(validFrom)}
                </span>
            </div>

            <ul className="divide-y divide-border">
                {rows.map(({ label, price }) => (
                    <li key={price.product} className="py-2 flex items-baseline gap-2">
                        <span className="flex-1 min-w-0 truncate text-[13px] text-foreground">
                            {label}
                        </span>
                        <span className="text-[14px] font-semibold tabular-nums text-foreground whitespace-nowrap">
                            {amount(price.price)}{" "}
                            <span className="text-[11px] font-normal text-muted-foreground">{edition.currency}</span>
                        </span>
                        <Change value={price.change} currencyWord={edition.currencyWord} />
                    </li>
                ))}
            </ul>

            <p className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Çmimet maksimale për litër, sipas{" "}
                <a
                    href={edition.source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground hover:underline"
                >
                    {edition.source.name}
                </a>
            </p>
        </section>
    );
}
