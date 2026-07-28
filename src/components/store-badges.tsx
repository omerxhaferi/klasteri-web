import type { SVGProps } from "react";

export const APP_STORE_URL =
    "https://apps.apple.com/mk/app/klasteri-lajmet-n%C3%AB-fokus/id6759223617";
export const PLAY_STORE_URL =
    "https://play.google.com/store/apps/details?id=com.klasteri.news";

export function AppleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
    );
}

export function GooglePlayIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
            <path d="M3 20.5V3.5c0-.59.34-1.11.84-1.35L13.69 12 3.84 21.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19 0 .5-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66Z" />
        </svg>
    );
}

/**
 * Store links. `solid` is the in-feed call to action; `quiet` matches the
 * muted text links already in the footer.
 *
 * Two globals.css quirks shape this:
 *  - `a { color: inherit }` is unlayered, and unlayered CSS wins over Tailwind's
 *    layered utilities, so a `text-*` class on an <a> does nothing. Colour is
 *    therefore set inline on the solid buttons, and inherited from the wrapper
 *    on the quiet ones (the same way the existing footer links get their tone).
 *  - `a:hover { text-decoration: underline }` applies to everything, hence
 *    `hover:no-underline` on the buttons.
 */
export function StoreButtons({
    variant = "solid",
    className = "",
}: {
    variant?: "solid" | "quiet";
    className?: string;
}) {
    const isSolid = variant === "solid";

    const linkClass = isSolid
        ? "flex-1 inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-colors hover:no-underline"
        : "inline-flex items-center gap-1.5 transition-opacity hover:opacity-70 hover:no-underline";

    const linkStyle = isSolid
        ? { color: "var(--primary-foreground)" }
        : undefined;

    return (
        <div
            className={`flex ${isSolid ? "gap-2" : "gap-5 text-sm text-muted-foreground"} ${className}`}
        >
            <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                style={linkStyle}
            >
                <AppleIcon className="h-3.5 w-3.5" />
                App Store
            </a>
            <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                style={linkStyle}
            >
                <GooglePlayIcon className="h-3.5 w-3.5" />
                Google Play
            </a>
        </div>
    );
}
