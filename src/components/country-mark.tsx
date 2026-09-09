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
 * 4:3, and every flag is framed to it.
 *
 * The three do not share a ratio — Macedonia is 2:1 where Kosovo and Albania
 * are 7:5 — so at their true proportions they would be visibly different widths
 * down a menu, which reads as a layout bug rather than as accuracy. One box with
 * `object-cover` keeps the column straight; the crop takes a few pixels off
 * Macedonia's left and right edges and touches nothing that identifies any of
 * them.
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
            width={Math.round(size * (4 / 3))}
            height={size}
            className={`inline-block shrink-0 rounded-[3px] object-cover ${className}`}
            style={{
                width: Math.round(size * (4 / 3)),
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
