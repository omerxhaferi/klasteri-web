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

/**
 * Returns a color that has good contrast on the current background.
 * In dark mode, dark publisher/source colors are lightened so they remain readable.
 */
export function getAccessibleColor(color: string, isDark: boolean): string {
    if (!isDark) return color;

    const hex = normalizeHex(color);
    if (hex.length !== 6) return color;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

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
