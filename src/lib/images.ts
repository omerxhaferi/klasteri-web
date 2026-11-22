import type { SyntheticEvent } from "react";

/**
 * Thumbnails come from the outlets' own servers and some of them fail. A
 * thumbnail has a border now, so a failed one is an empty framed box — it has
 * to go, not just stay blank.
 *
 * Two hooks, because one is not enough: the page is server-rendered, and an
 * image that fails BEFORE React hydrates never fires `onError` for React (the
 * event has already happened and is not replayed). `hideIfBroken` as the `ref`
 * catches those on mount; `hideOnError` catches the ones that fail later.
 *
 *     <img ref={hideIfBroken} onError={hideOnError} … />
 */
export function hideIfBroken(img: HTMLImageElement | null) {
    if (img && img.complete && img.naturalWidth === 0) {
        img.style.display = "none";
    }
}

export function hideOnError(e: SyntheticEvent<HTMLImageElement>) {
    e.currentTarget.style.display = "none";
}
