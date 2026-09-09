/**
 * Which edition the site is showing.
 *
 * All three are Albanian-language and share one taxonomy. What changes is the
 * point of view: `Vendi` is the country you picked, `Rajoni` is its neighbours.
 * A reader in Prishtina wants Kosovo as home news and Albania as regional; a
 * reader in Tirana wants the reverse.
 *
 * There are TWO ways a request names its edition, and the order matters:
 *
 *  1. The URL — `/mk`, `/ks/vendi`. Explicit, linkable, shareable and
 *     indexable, which a cookie can never be: a Kosovar reader sending a link
 *     to a friend sends the Kosovo edition, not "whatever your cookie says".
 *  2. The cookie, `klasteri_country`. This is the fallback, and it is what the
 *     bare `/` runs on — that URL is the deployed homepage and every existing
 *     inbound link and search result points at it, so it must keep behaving
 *     exactly as it always has: cookie, defaulting to MK.
 *
 * A cookie is readable during the server render, and every page here fetches
 * with `cache: 'no-store'`, so the first paint on `/` is already the right
 * country rather than flashing Macedonia and then swapping.
 */

/**
 * Text only. There is deliberately no `flag` here any more: the emoji it used
 * to hold could not be rendered consistently — 🇽🇰 is not a real Unicode flag,
 * because XK is a user-assigned code rather than an ISO country, so most
 * Android builds and several Windows browsers drew it as the letters "XK" next
 * to two proper flags. The switcher draws `components/country-mark.tsx`
 * instead, which also keeps the artwork out of this module: `lib/api.ts`
 * imports it on the server, and nothing here should pull in React.
 */
/*
 * Listed Albania, Kosovo, Macedonia — a display order, nothing more, and the
 * same order the app uses. Nothing indexes this array by position; every
 * consumer maps over it, and the fallback edition is DEFAULT_COUNTRY below,
 * which is unaffected and stays MK.
 */
export const COUNTRIES = [
    { code: 'AL', label: 'Shqipëri' },
    { code: 'KS', label: 'Kosovë' },
    { code: 'MK', label: 'Maqedonia e V.' },
] as const;

export type CountryCode = (typeof COUNTRIES)[number]['code'];

/**
 * What a visitor with no cookie gets. MUST stay 'MK': the site has always shown
 * Macedonian news and the API answers a country-less request with MK for that
 * same reason. Changing it would move every existing reader without asking.
 */
export const DEFAULT_COUNTRY: CountryCode = 'MK';

export const COUNTRY_COOKIE = 'klasteri_country';

/** One year — a country choice is not something to ask about every week. */
export const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isCountryCode(v: unknown): v is CountryCode {
    return typeof v === 'string' && COUNTRIES.some((c) => c.code === v);
}

function fromDocumentCookie(): CountryCode {
    const hit = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${COUNTRY_COOKIE}=`));
    const value = hit?.split('=')[1];
    return isCountryCode(value) ? value : DEFAULT_COUNTRY;
}

/**
 * The active country, in whichever environment the caller is running.
 *
 * `lib/api.ts` is imported by BOTH server pages and `'use client'` components,
 * so this has to work in both. On the server it reads the request's cookie via
 * `next/headers`; on the client it reads `document.cookie`. The import of
 * `next/headers` is dynamic so it is never pulled into the browser bundle,
 * where it does not exist.
 */
export async function getActiveCountry(): Promise<CountryCode> {
    if (typeof document !== 'undefined') return fromDocumentCookie();
    try {
        const { cookies } = await import('next/headers');
        const store = await cookies();
        const value = store.get(COUNTRY_COOKIE)?.value;
        return isCountryCode(value) ? value : DEFAULT_COUNTRY;
    } catch {
        // Rendered outside a request scope (e.g. a static build step).
        return DEFAULT_COUNTRY;
    }
}

/** Append `country=` to an API path, preserving any query it already has. */
export function withCountry(path: string, country: CountryCode): string {
    return `${path}${path.includes('?') ? '&' : '?'}country=${country}`;
}

/**
 * The URL spelling of an edition: lowercase, and the APP's code.
 *
 * Kosovo is `ks`, never `xk`. `KS` is what `COUNTRIES` holds, what the API
 * expects in `?country=` and what the crawler's registry calls it; introducing
 * the ISO user-assigned `XK` purely for the URL would mean a second name for
 * one thing, and every conversion between them is a chance to get it wrong.
 */
export function countrySlug(code: CountryCode): string {
    return code.toLowerCase();
}

/**
 * Read an edition back out of a URL segment, or null if the segment is not one.
 *
 * Null is the interesting case: `/[country]` sits at the site root, so it is
 * offered EVERY unmatched single-segment path. Returning null lets the route
 * call `notFound()` — a typo'd URL has to 404, not quietly serve Macedonia
 * under someone else's name.
 *
 * Case-insensitive on the way in while every link we generate is lowercase, so
 * a hand-typed `/MK` still lands somewhere; the pages set a lowercase canonical
 * so that leniency does not turn into duplicate URLs in a search index.
 */
export function countryFromSlug(slug: string | undefined | null): CountryCode | null {
    if (!slug) return null;
    const upper = slug.toUpperCase();
    return isCountryCode(upper) ? upper : null;
}

/**
 * The edition's name written out, for <title> and meta description.
 *
 * Deliberately not `COUNTRIES[].label`: that one is abbreviated to fit the
 * switcher button ("Maqedonia e V."), which reads as a typo in a page title.
 */
export const COUNTRY_NAMES: Record<CountryCode, string> = {
    AL: 'Shqipëri',
    KS: 'Kosovë',
    MK: 'Maqedoni e Veriut',
};
