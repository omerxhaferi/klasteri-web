"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed.length >= 2) {
            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            setIsMobileOpen(false);
        }
    };

    const openMobileSearch = () => {
        setIsMobileOpen(true);
    };

    const closeMobileSearch = () => {
        setIsMobileOpen(false);
        setQuery("");
    };

    // Focus input when mobile search opens
    useEffect(() => {
        if (isMobileOpen && mobileInputRef.current) {
            mobileInputRef.current.focus();
        }
    }, [isMobileOpen]);

    // Handle escape key to close mobile search
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isMobileOpen) {
                closeMobileSearch();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isMobileOpen]);

    return (
        <>
            {/* Desktop Search Bar */}
            <form onSubmit={handleSubmit} className="hidden md:flex items-center">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kërko lajme..."
                        className="w-44 h-8 pl-7 pr-2 text-[13px] bg-background rounded-sm border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </form>

            {/* Mobile Search Icon */}
            <button
                onClick={openMobileSearch}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-sm border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Kërko"
            >
                <Search className="h-4 w-4" />
            </button>

            {/* Mobile Search Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[100] bg-background md:hidden">
                    <form onSubmit={handleSubmit} className="h-14 flex items-center gap-2 px-4 border-b-2 border-brand">
                        <button
                            type="button"
                            onClick={closeMobileSearch}
                            className="p-1 text-muted-foreground hover:text-foreground"
                            aria-label="Mbyll"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex-1 relative">
                            {/* 16px: anything smaller makes iOS Safari zoom the page on focus. */}
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Kërko lajme..."
                                className="w-full h-9 px-2.5 text-base bg-background rounded-sm border border-border focus:border-primary focus:outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-9 px-4 text-[13px] font-bold bg-primary text-primary-foreground rounded-sm"
                        >
                            Kërko
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
