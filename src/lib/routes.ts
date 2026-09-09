/**
 * Where the feed's links point.
 *
 * The site serves the same feed from two shapes of URL and they must not drift:
 *
 *   /            + ?category=vendi   — the legacy, cookie-scoped homepage
 *   /mk          + /mk/vendi         — an edition named in the URL
 *
 * Both are real. `/` is the deployed homepage and cannot be redirected away,
 * and the country URLs are the shareable ones. Rather than teach every link in
 * the header and every "Më shumë ›" to know which shape it is in, each render
 * carries ONE string — the base — and asks these helpers.
 *
 * The base is `''` for the cookie-scoped root and `/mk` for an edition. It is
 * empty rather than `/` so that `base + '/' + key` is never `//vendi`.
 */

import { type CountryCode, countrySlug } from '@/lib/country';

/**
 * The category segments a URL may carry. All three editions share one taxonomy
 * (they are all Albanian-language and the API maps the same six slugs for
 * each), so this list is not per country. `top_overall` is absent on purpose:
 * it is the homepage, not a category, and its URL is the base itself.
 */
export const CATEGORY_SLUGS = ['vendi', 'rajoni', 'bota', 'sport', 'tech'] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

/**
 * Accepts only the five real slugs, lowercased. `/mk/foobar` must 404: a
 * category page that silently falls back to the full homepage would publish an
 * empty-looking URL for every typo, and search engines would index them.
 */
export function categoryFromSlug(slug: string | undefined | null): CategorySlug | null {
    if (!slug) return null;
    const lower = slug.toLowerCase();
    return (CATEGORY_SLUGS as readonly string[]).includes(lower) ? (lower as CategorySlug) : null;
}

/**
 * The nav, in display order. Single source of truth — this list was duplicated
 * in `site-header.tsx` and `page.tsx`, and both copies carried their own hard
 * coded hrefs, which is exactly the pair that would have gone out of sync the
 * first time one of them learned about countries.
 */
export const NAV_CATEGORIES = [
    { key: 'top_overall', label: 'Kryesore' },
    { key: 'vendi', label: 'Vendi' },
    { key: 'rajoni', label: 'Rajoni' },
    { key: 'bota', label: 'Bota' },
    { key: 'sport', label: 'Sport' },
    { key: 'tech', label: 'Tech' },
] as const;

/** `''` when the edition is implied (cookie), `/mk` when it is in the URL. */
export function countryBase(country: CountryCode | null | undefined): string {
    return country ? `/${countrySlug(country)}` : '';
}

/** The homepage for this base. */
export function homeHref(base: string): string {
    return base || '/';
}

/**
 * A category page for this base.
 *
 * Under a country base this is a path (`/mk/vendi`). Under the empty base it
 * stays `/?category=vendi` — those are the URLs the live site already links to
 * and that are already indexed, and `/` is defined by the cookie, so moving its
 * nav onto `/mk/...` would silently relocate every reader on the first click.
 */
export function categoryHref(base: string, key: string): string {
    if (key === 'top_overall') return homeHref(base);
    return base ? `${base}/${key}` : `/?category=${key}`;
}
