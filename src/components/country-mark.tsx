/**
 * The edition's mark: one dot, two colours, split on the diagonal.
 *
 * It replaces the emoji flags, which could not render consistently — 🇽🇰 is not
 * a real Unicode flag, because XK is a user-assigned code rather than an ISO
 * country, so most Android builds and several Windows browsers drew it as the
 * bare letters "XK" next to two proper flags.
 *
 * Deliberately not a drawing. At the 18px this renders at, an illustrated flag
 * is a smudge — detail costs work and buys nothing the reader can actually see.
 * Two flat colours at that size still separate three editions instantly, which
 * is the entire job. The diagonal cut is the only flourish, and it earns its
 * place: a vertical split reads as a bland half-and-half, while the 135° cut
 * gives the dot a direction and keeps both colours on the optical centre line.
 *
 * Colours are each flag's two carrying colours, not a literal palette match:
 * Macedonia's gold-on-red sun, Kosovo's gold-on-blue, Albania's black-on-red
 * eagle.
 */

import type { CountryCode } from '@/lib/country';

/** [start, end] — the diagonal runs start (top-left) to end (bottom-right). */
const MARK_COLORS: Record<CountryCode, readonly [string, string]> = {
    MK: ['#F5C400', '#D20000'],
    KS: ['#D0A650', '#244AA5'],
    AL: ['#111111', '#E41E20'],
};

export function CountryMark({
    code,
    size = 18,
    className = '',
}: {
    code: CountryCode;
    size?: number;
    className?: string;
}) {
    const [from, to] = MARK_COLORS[code];
    return (
        <span
            /*
             * aria-hidden, deliberately. Every place this renders already has
             * the country name in text beside it, so naming the mark would make
             * assistive tech announce each row twice.
             */
            aria-hidden="true"
            className={`inline-block shrink-0 rounded-full ${className}`}
            style={{
                width: size,
                height: size,
                // Hard stops at 50% — a gradient with no transition, which is
                // just two triangles without the markup of two triangles.
                backgroundImage: `linear-gradient(135deg, ${from} 0 50%, ${to} 50% 100%)`,
                // Black on a dark menu and gold on a light one both lose their
                // edge without this. currentColor tracks the theme, so one rule
                // covers both instead of a media query.
                boxShadow: 'inset 0 0 0 1px currentColor',
                color: 'rgb(0 0 0 / 0.18)',
            }}
        />
    );
}
