/**
 * `/mk/vendi`, `/ks/sport` — one edition's category page.
 *
 * Both segments are validated. `/cluster/123` cannot land here (the static
 * `cluster` segment wins at that level), but `/mk/foobar` and `/foobar/sport`
 * can, and both are 404s: a category page that quietly fell back to the whole
 * homepage would publish an empty-looking URL for every typo.
 */

import { HomeFeed } from "@/components/home-feed";
import { COUNTRY_NAMES, countryFromSlug, countrySlug } from "@/lib/country";
import { NAV_CATEGORIES, categoryFromSlug, countryBase } from "@/lib/routes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Params = Promise<{ country: string; category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { country: countryParam, category: categoryParam } = await params;
    const country = countryFromSlug(countryParam);
    const category = categoryFromSlug(categoryParam);
    if (!country || !category) return {};

    const name = COUNTRY_NAMES[country];
    const label = NAV_CATEGORIES.find((c) => c.key === category)?.label ?? category;
    return {
        title: `${label} — Klasteri ${name}`,
        description: `Lajmet e kategorisë ${label} për edicionin ${name}, të grupuara sipas temës nga burime të ndryshme.`,
        alternates: { canonical: `/${countrySlug(country)}/${category}` },
    };
}

export default async function CountryCategory({ params }: { params: Params }) {
    const { country: countryParam, category: categoryParam } = await params;
    const country = countryFromSlug(countryParam);
    const category = categoryFromSlug(categoryParam);
    if (!country || !category) notFound();

    return <HomeFeed country={country} base={countryBase(country)} category={category} />;
}
