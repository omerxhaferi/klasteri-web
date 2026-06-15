"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { CategoryColors, CategoryKey } from "@/lib/constants";

const CATEGORIES = [
  { key: "top_overall", label: "Kryesore", href: "/" },
  { key: "vendi", label: "Vendi", href: "/?category=vendi" },
  { key: "rajoni", label: "Rajoni", href: "/?category=rajoni" },
  { key: "bota", label: "Bota", href: "/?category=bota" },
  { key: "sport", label: "Sport", href: "/?category=sport" },
  { key: "tech", label: "Tech", href: "/?category=tech" },
] as const;

interface SiteHeaderProps {
  selectedCategory?: string;
  hasTonightClusters?: boolean;
  serverIsNight?: boolean;
  forceShow?: boolean;
}

const WEEKDAYS_SQ = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];
const MONTHS_SQ = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];

export function SiteHeader({ selectedCategory }: SiteHeaderProps) {
  const now = new Date();
  const today = `${WEEKDAYS_SQ[now.getDay()]}, ${now.getDate()} ${MONTHS_SQ[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <>
      {/* Masthead */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative h-16 md:h-20 flex items-center justify-between">
            <p
              className="hidden lg:block text-[12.5px] text-muted-foreground"
              suppressHydrationWarning
            >
              {today}
            </p>

            <Link
              href="/"
              className="flex items-center gap-2.5 lg:absolute lg:left-1/2 lg:-translate-x-1/2 hover:no-underline"
            >
              <Logo width={34} height={34} />
              <span className="font-serif text-[26px] md:text-[30px] font-bold tracking-tight leading-none">
                Klasteri
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <SearchBar />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky category nav */}
      <nav className="sticky top-0 z-50 border-y border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-stretch justify-start md:justify-center gap-1 overflow-x-auto scrollbar-hide h-11">
            {CATEGORIES.map((cat) => {
              const isActive =
                (selectedCategory === "all" && cat.key === "top_overall") ||
                selectedCategory === cat.key;
              const color =
                CategoryColors[cat.key as CategoryKey] || "var(--primary)";

              return (
                <Link
                  key={cat.key}
                  href={cat.href}
                  className={`relative flex items-center px-3.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap transition-colors hover:no-underline ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <span
                      className="absolute left-2 right-2 bottom-0 h-[2.5px] rounded-t-full"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
