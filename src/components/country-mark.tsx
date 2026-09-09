/**
 * The edition's flag — the official artwork, served from `public/flags`.
 *
 * SVG here, PNG in the mobile app. On the web a vector flag costs a few hundred
 * bytes and stays sharp at any size; React Native has no SVG renderer without a
 * native dependency, so that app bundles rasters at 1x/2x/3x instead. Same three
 * flags, same source, different container.
 *
 * Kosovo's file is `ks.svg` to match the code this codebase uses everywhere,
 * though the flag is published under the ISO code `xk`.
 */

import type { CountryCode } from '@/lib/country';

/**
 * A circle, and every flag is cropped to its middle.
 *
 * That works for these three specifically: all of them put their mark dead
 * centre — Macedonia's sun, Kosovo's map and stars, Albania's eagle — so the
 * crop takes only empty field from the sides. Macedonia loses the most, being
 * 2:1 against the others' 7:5, and loses nothing but red.
 *
 * A circle also settles the ratio problem it would otherwise have: at their
 * true proportions the three are visibly different widths down a menu, which
 * reads as a layout bug rather than as accuracy.
 */
export function CountryMark({
    code,
    size = 18,
    className = '',
}: {
    code: CountryCode;
    size?: number;
    className?: string;
}) {
    return (
        // A static flag of known size: next/image would add a loader and
        // layout machinery to a 400-byte inline asset that never changes, and
        // it is already below the fold of nothing — it ships with the markup.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={`/flags/${code.toLowerCase()}.svg`}
            alt=""
            /*
             * Decorative: every place this renders already has the country name
             * in text beside it, so naming the flag would make a screen reader
             * announce each row twice.
             */
            aria-hidden="true"
            width={size}
            height={size}
            className={`inline-block shrink-0 rounded-full object-cover ${className}`}
            style={{
                width: size,
                height: size,
                // Albania's and Macedonia's red fields bleed into a dark menu
                // without an edge, and Kosovo's white stars do the same on a
                // light one. currentColor tracks the theme, so one rule covers
                // both instead of a media query.
                boxShadow: 'inset 0 0 0 1px currentColor',
                color: 'rgb(0 0 0 / 0.20)',
            }}
        />
    );
}
