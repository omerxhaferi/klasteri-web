"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const CATEGORIES = [
  { key: "top_overall", label: "Top Lajmet", href: "/" },
  { key: "vendi", label: "Vendi", href: "/?category=vendi" },
  { key: "rajoni", label: "Rajoni", href: "/?category=rajoni" },
  { key: "bota", label: "Bota", href: "/?category=bota" },
  { key: "sport", label: "Sport", href: "/?category=sport" },
  { key: "tech", label: "Tech", href: "/?category=tech" },
] as const;

export function SiteHeader({ selectedCategory }: { selectedCategory?: string }) {
  return (
    <>
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Logo width={32} height={32} />
              <span className="text-xl font-bold tracking-tight">Klasteri</span>
            </Link>
            <nav className="flex items-center gap-1 md:gap-2">
              <div className="hidden md:flex items-center gap-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.key}
                    href={cat.href}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      (selectedCategory === "all" && cat.key === "top_overall") ||
                      selectedCategory === cat.key
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
              <div className="h-6 w-px bg-border mx-2 hidden md:block" />
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Category Pills - only show when we have a selected category (home) */}
      {selectedCategory !== undefined && (
        <div className="md:hidden border-b border-border bg-card overflow-x-auto">
          <div className="flex gap-2 px-4 py-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                  (selectedCategory === "all" && cat.key === "top_overall") ||
                  selectedCategory === cat.key
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
