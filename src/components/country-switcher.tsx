'use client';

/**
 * Edition picker.
 *
 * Two behaviours, chosen by the URL rather than by a prop — the switcher can
 * read the path itself, and a prop would have to be threaded through every
 * page that renders a header:
 *
 *  - On a country URL (`/ks`, `/ks/sport`) it NAVIGATES, swapping the country
 *    segment and keeping the category. The URL names the edition there, so
 *    leaving it on `/ks` while showing Macedonian news would be a lie, and a
 *    reader who then copied the link would send the wrong edition.
 *  - Everywhere else (`/`, `/search`, `/settings`, `/cluster/:id`) it keeps the
 *    original behaviour: write the cookie, `router.refresh()`. That re-runs the
 *    server render, and every page here fetches with `cache: 'no-store'`, so
 *    the whole page comes back as the new country's news without a full reload.
 *
 * The cookie is written in BOTH cases. It is what `/` reads, and someone who
 * picks Kosovo on `/ks` and later opens the bare homepage should still get
 * Kosovo.
 */

import { CountryMark } from '@/components/country-mark';
import {
    COUNTRIES,
    COUNTRY_COOKIE,
    COUNTRY_COOKIE_MAX_AGE,
    DEFAULT_COUNTRY,
    countryFromSlug,
    countrySlug,
    isCountryCode,
    type CountryCode,
} from '@/lib/country';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

export function CountrySwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const boxRef = useRef<HTMLDivElement>(null);

    // `['', 'ks', 'sport']` for /ks/sport. Non-null only on a country URL,
    // which is what selects navigate-vs-cookie below.
    const segments = pathname.split('/');
    const urlCountry = countryFromSlug(segments[1]);
    const restOfPath = segments.slice(2).filter(Boolean).join('/');

    // Read AFTER mount, not during render. The header is server-rendered and
    // the server has no `document`; reading the cookie inline would make the
    // client's first render disagree with the server's HTML and React would
    // throw a hydration mismatch. One frame of the default label is the cost.
    const [cookieCountry, setCookieCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
    useEffect(() => {
        const hit = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${COUNTRY_COOKIE}=`))
            ?.split('=')[1];
        if (isCountryCode(hit)) setCookieCountry(hit);
    }, []);

    // The URL wins, and it is known during render on both server and client —
    // so on /ks the button reads "Kosovë" in the very first paint, even for a
    // reader whose cookie still says MK. Falling back to the cookie would put
    // the wrong label over the right feed.
    const current = urlCountry ?? cookieCountry;

    const active = COUNTRIES.find((c) => c.code === current) ?? COUNTRIES[0];

    // Close on outside click and on Escape — a menu that traps the reader is
    // worse than no menu.
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    function choose(code: CountryCode) {
        setOpen(false);
        if (code === current) return;

        // Written on both paths. On a country URL the URL is what decides the
        // feed, but this is still the reader's choice and `/` has no other way
        // to learn it.
        document.cookie =
            `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COUNTRY_COOKIE_MAX_AGE}; SameSite=Lax`;
        // Update the label ourselves. `router.refresh()` re-renders the server
        // tree but does NOT remount this client component, so the mount-time
        // cookie read never runs again — without this the page would show
        // Kosovo's news under a button still labelled Macedonia. (On the
        // navigate path the label follows `pathname` instead, but keeping this
        // in sync costs nothing and matters the moment the reader lands back
        // on a cookie-scoped page.)
        setCookieCountry(code);

        startTransition(() => {
            if (urlCountry) {
                // /ks/sport → /mk/sport. The category segment is kept: all
                // three editions share one taxonomy, so the reader who was on
                // Sport wants Sport.
                router.push(`/${countrySlug(code)}${restOfPath ? `/${restOfPath}` : ''}`);
            } else {
                router.refresh();
            }
        });
    }

    return (
        <div className="relative" ref={boxRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Shteti: ${active.label}`}
                disabled={pending}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium
                           text-foreground/80 transition-colors hover:bg-foreground/5
                           hover:text-foreground disabled:opacity-50"
            >
                {/*
                 * Deliberately unnamed. The button already carries
                 * aria-label="Shteti: …", which replaces its entire subtree for
                 * assistive tech — a name on the mark would be discarded, and
                 * on narrow screens where `active.label` is display:none that
                 * aria-label is the only name the control has.
                 */}
                <CountryMark code={active.code} size={18} className="shrink-0" />
                <span className="hidden sm:inline">{active.label}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden
                     className={`transition-transform ${open ? 'rotate-180' : ''}`}>
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {open && (
                /*
                 * z-[60], not z-50, and that is the whole bug fix.
                 *
                 * The category bar below the header is `sticky top-0 z-50`. This menu
                 * was also z-50, nothing between them creates a stacking context, and
                 * equal z-index is resolved by DOM ORDER — the nav comes later, so it
                 * painted over the top of this menu and swallowed the clicks landing
                 * there.
                 *
                 * Only the FIRST option sits in that band, which made the symptom
                 * oddly specific: Kosova and Shqiperia worked, and Maqedonia — always
                 * first, being the default — could never be chosen again once you had
                 * left it.
                 *
                 * whitespace-nowrap and the wider min-width go together: "Maqedonia e
                 * Veriut" wrapped to two lines at 11rem, making that row 56px tall
                 * against the others' 36px.
                 */
                <div
                    role="listbox"
                    aria-label="Zgjidh shtetin"
                    className="absolute right-0 z-[60] mt-1 min-w-[12.5rem] overflow-hidden rounded-lg
                               border border-foreground/10 bg-background shadow-lg"
                >
                    {COUNTRIES.map((c) => (
                        <button
                            key={c.code}
                            type="button"
                            role="option"
                            aria-selected={c.code === current}
                            onClick={() => choose(c.code)}
                            className={`flex w-full items-center gap-2 whitespace-nowrap px-3 py-2
                                        text-left text-sm transition-colors hover:bg-foreground/5
                                        ${c.code === current ? 'font-semibold' : 'text-foreground/80'}`}
                        >
                            {/*
                             * Also unnamed: `c.label` on the next line is always
                             * rendered, so naming the mark would make every
                             * option announce its country twice.
                             */}
                            <CountryMark code={c.code} size={18} className="shrink-0" />
                            <span className="flex-1">{c.label}</span>
                            {c.code === current && (
                                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                                    <path d="M2 6.5l3 3 5-6" fill="none" stroke="currentColor"
                                          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
