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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kërko lajme..."
                        className="w-48 pl-9 pr-3 py-1.5 text-sm bg-muted rounded-md border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
                    />
                </div>
            </form>

            {/* Mobile Search Icon */}
            <button
                onClick={openMobileSearch}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Kërko"
            >
                <Search className="h-5 w-5" />
            </button>

            {/* Mobile Search Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-[100] bg-background md:hidden">
                    <form onSubmit={handleSubmit} className="h-14 flex items-center gap-3 px-4 border-b border-border">
                        <button
                            type="button"
                            onClick={closeMobileSearch}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Mbyll"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="flex-1 relative">
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Kërko lajme..."
                                className="w-full py-2 px-3 text-base bg-muted rounded-md border border-transparent focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors placeholder:text-muted-foreground"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                            Kërko
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
