/**
 * `/mk`, `/ks`, `/al` — an edition's homepage, named in the URL.
 *
 * This segment sits at the site root, so Next offers it every single-segment
 * path that no static route claimed. Static segments win at the same level, so
 * `/search`, `/settings`, `/contact`, `/privacy` and `/terms` never reach here;
 * anything else that is not one of the three editions must `notFound()`, or
 * every typo'd URL would render a full Macedonian homepage under its own name
 * and be indexed as one.
 */

import { HomeFeed } from "@/components/home-feed";
import { COUNTRY_NAMES, countryFromSlug, countrySlug } from "@/lib/country";
import { countryBase } from "@/lib/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

/*
 * No `generateStaticParams`: the feed is `force-dynamic` (every fetch is
 * `cache: 'no-store'`), so there is nothing to prerender and the list would be
 * a second, silently ignored copy of the country registry. `countryFromSlug`
 * is the one gate.
 */

type Params = Promise<{ country: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const country = countryFromSlug((await params).country);
    if (!country) return {};

    const name = COUNTRY_NAMES[country];
    return {
        title: `Klasteri ${name} — Lajmet e fundit`,
        description: `Edicioni ${name} i Klasterit: lajmet nga shumë burime, të grupuara sipas temës.`,
        // The slug is matched case-insensitively so a hand-typed /MK still
        // lands; this keeps that leniency from becoming two indexable URLs.
        alternates: { canonical: `/${countrySlug(country)}` },
    };
}

export default async function CountryHome({
    params,
    searchParams,
}: {
    params: Params;
    searchParams: Promise<{ preview?: string }>;
}) {
    const country = countryFromSlug((await params).country);
    if (!country) notFound();

    return (
        <HomeFeed
            country={country}
            base={countryBase(country)}
            category="all"
            previewSummary={(await searchParams).preview === "summary"}
        />
    );
}
