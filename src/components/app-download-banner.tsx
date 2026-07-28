"use client";

import { Logo } from "@/components/logo";
import { StoreButtons } from "@/components/store-badges";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const DISMISS_KEY = "klasteri:app-banner-dismissed";

/**
 * Mobile-only prompt to install the native apps. Desktop readers get the
 * footer links instead (see SiteFooter) — a phone-install banner on a laptop
 * is just noise.
 *
 * Dismissal is remembered in localStorage so returning readers aren't nagged.
 * Renders nothing until mounted: the dismissed flag only exists client-side,
 * and rendering the banner on the server would flash it for readers who
 * already closed it.
 */
export function AppDownloadBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (localStorage.getItem(DISMISS_KEY) !== "1") setVisible(true);
        } catch {
            // Storage blocked (private mode / embedded webview) — show it anyway.
            setVisible(true);
        }
    }, []);

    if (!visible) return null;

    const dismiss = () => {
        setVisible(false);
        try {
            localStorage.setItem(DISMISS_KEY, "1");
        } catch {
            // Non-persistent dismissal is still better than ignoring the click.
        }
    };

    return (
        <div className="lg:hidden mb-4 rounded-xl bg-primary/4 dark:bg-primary/8 border border-primary/15 px-3 py-3">
            <div className="flex items-center gap-3">
                <Logo width={36} height={36} />

                <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-foreground leading-tight">
                        Klasteri në telefonin tënd
                    </p>
                    <p className="text-[11.5px] text-muted-foreground leading-tight mt-0.5">
                        Shkarko aplikacionin falas për iPhone dhe Android
                    </p>
                </div>

                <button
                    onClick={dismiss}
                    aria-label="Mbyll"
                    className="shrink-0 -mr-1 p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <StoreButtons className="mt-2.5" />
        </div>
    );
}
