"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { Logo } from "@/components/logo";
import { CountrySwitcher } from "@/components/country-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { CategoryColors, CategoryKey } from "@/lib/constants";
import { NAV_CATEGORIES, categoryHref, homeHref } from "@/lib/routes";

interface SiteHeaderProps {
  selectedCategory?: string;
  /**
   * How this page's links should be spelled: `''` when the edition comes from
   * the cookie (`/`, `/search`, `/settings`, `/cluster/:id`) and `/mk` when it
   * is in the URL. Defaults to `''`, so the pages that do not pass it keep
   * exactly the links they had.
   */
  base?: string;
  hasTonightClusters?: boolean;
  serverIsNight?: boolean;
  forceShow?: boolean;
}

const WEEKDAYS_SQ = ["E diel", "E hënë", "E martë", "E mërkurë", "E enjte", "E premte", "E shtunë"];
const MONTHS_SQ = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];

export function SiteHeader({ selectedCategory, base = "" }: SiteHeaderProps) {
  const now = new Date();
  const today = `${WEEKDAYS_SQ[now.getDay()]}, ${now.getDate()} ${MONTHS_SQ[now.getMonth()]} ${now.getFullYear()}`;

  return (
    <>
      {/* Masthead */}
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative h-14 md:h-[68px] flex items-center justify-between">
            <p
              className="hidden lg:block text-[12px] text-muted-foreground"
              suppressHydrationWarning
            >
              {today}
            </p>

            <Link
              href={homeHref(base)}
              className="flex items-center gap-2 lg:absolute lg:left-1/2 lg:-translate-x-1/2 hover:no-underline"
            >
              <Logo width={34} height={34} />
              <span className="font-display text-[28px] md:text-[34px] font-bold leading-none">
                Klasteri
              </span>
            </Link>

            <div className="flex items-center gap-1.5">
              <CountrySwitcher />
              <SearchBar />
              <Link
                href="/settings"
                aria-label="Cilësimet"
                className="flex items-center justify-center w-8 h-8 rounded-sm border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/*
        The section bar. Solid, not translucent: it is the one heavy element on
        the page and it stays put while the feed scrolls under it. The current
        section is a tab cut out of the bar in the page's own colour, capped
        with that section's colour — the same colour its heading tab carries in
        the feed.
      */}
      <nav className="sticky top-0 z-50 bg-brand">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-stretch justify-start md:justify-center overflow-x-auto scrollbar-hide h-10">
            {NAV_CATEGORIES.map((cat) => {
              const isActive =
                (selectedCategory === "all" && cat.key === "top_overall") ||
                selectedCategory === cat.key;
              const color =
                CategoryColors[cat.key as CategoryKey] || "var(--primary)";

              return (
                <Link
                  key={cat.key}
                  href={categoryHref(base, cat.key)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center px-4 font-display text-[15px] font-bold uppercase whitespace-nowrap border-t-[3px] hover:no-underline ${
                    isActive
                      ? "bg-background text-foreground"
                      : "border-transparent text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                  style={isActive ? { borderTopColor: color } : undefined}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
