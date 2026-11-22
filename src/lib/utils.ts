import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Normalize hex to 6 chars (strip alpha if 8-digit). */
function normalizeHex(hex: string): string {
    const cleaned = hex.replace('#', '').trim();
    if (cleaned.length === 8) return cleaned.substring(0, 6);
    return cleaned.length === 6 ? cleaned : '';
}

/** WCAG contrast of an sRGB colour against white. */
function contrastOnWhite(r: number, g: number, b: number): number {
    const linear = (v: number) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const luminance = 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
    return 1.05 / (luminance + 0.05);
}

/**
 * Returns a publisher colour that can be read as TEXT on the current
 * background, keeping its hue.
 *
 * Light mode: a brand colour is a logo colour, and plenty of them are too pale
 * to be 12px type on white — Telegrami's yellow is 1.5:1, TV21's cyan 1.9:1.
 * Anything under 4.5:1 is darkened in steps until it clears it.
 * Dark mode: dark colours are lightened so they remain readable.
 */
export function getAccessibleColor(color: string, isDark: boolean): string {
    const hex = normalizeHex(color);
    if (hex.length !== 6) return color;

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    if (!isDark) {
        if (contrastOnWhite(r, g, b) >= 4.5) return color;
        for (let i = 0; i < 24 && contrastOnWhite(r, g, b) < 4.5; i++) {
            r = Math.round(r * 0.92);
            g = Math.round(g * 0.92);
            b = Math.round(b * 0.92);
        }
        return `rgb(${r}, ${g}, ${b})`;
    }

    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance < 0.4) {
        const factor = 1.6;
        const newR = Math.min(255, Math.round(r * factor + 60));
        const newG = Math.min(255, Math.round(g * factor + 60));
        const newB = Math.min(255, Math.round(b * factor + 60));
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    return color;
}
