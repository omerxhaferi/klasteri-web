'use client';

/**
 * Edition picker.
 *
 * Writes the choice to a cookie and calls `router.refresh()`, which re-runs the
 * server render — every page here fetches with `cache: 'no-store'`, so the
 * whole page comes back as the new country's news without a full reload and
 * without any client-side refetch plumbing.
 */

import {
    COUNTRIES,
    COUNTRY_COOKIE,
    COUNTRY_COOKIE_MAX_AGE,
    DEFAULT_COUNTRY,
    isCountryCode,
    type CountryCode,
} from '@/lib/country';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';

export function CountrySwitcher() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, startTransition] = useTransition();
    const boxRef = useRef<HTMLDivElement>(null);

    // Read AFTER mount, not during render. The header is server-rendered and
    // the server has no `document`; reading the cookie inline would make the
    // client's first render disagree with the server's HTML and React would
    // throw a hydration mismatch. One frame of the default label is the cost.
    const [current, setCurrent] = useState<CountryCode>(DEFAULT_COUNTRY);
    useEffect(() => {
        const hit = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${COUNTRY_COOKIE}=`))
            ?.split('=')[1];
        if (isCountryCode(hit)) setCurrent(hit);
    }, []);

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
        document.cookie =
            `${COUNTRY_COOKIE}=${code}; path=/; max-age=${COUNTRY_COOKIE_MAX_AGE}; SameSite=Lax`;
        // Update the label ourselves. `router.refresh()` re-renders the server
        // tree but does NOT remount this client component, so the mount-time
        // cookie read never runs again — without this the page would show
        // Kosovo's news under a button still labelled Macedonia.
        setCurrent(code);
        startTransition(() => router.refresh());
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
                <span aria-hidden>{active.flag}</span>
                <span className="hidden sm:inline">{active.short}</span>
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
                            <span aria-hidden>{c.flag}</span>
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
