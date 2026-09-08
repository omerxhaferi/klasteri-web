/**
 * Which edition the site is showing.
 *
 * All three are Albanian-language and share one taxonomy. What changes is the
 * point of view: `Vendi` is the country you picked, `Rajoni` is its neighbours.
 * A reader in Prishtina wants Kosovo as home news and Albania as regional; a
 * reader in Tirana wants the reverse.
 *
 * The choice lives in a cookie rather than the URL because every page here is
 * server-rendered with `cache: 'no-store'` — a cookie is readable during that
 * render, so the first paint is already the right country instead of flashing
 * Macedonia and then swapping.
 */

export const COUNTRIES = [
    { code: 'MK', label: 'Maqedonia e Veriut', short: 'Maqedoni', flag: '🇲🇰' },
    { code: 'KS', label: 'Kosova', short: 'Kosovë', flag: '🇽🇰' },
    { code: 'AL', label: 'Shqipëria', short: 'Shqipëri', flag: '🇦🇱' },
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
