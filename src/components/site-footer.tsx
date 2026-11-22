import Link from "next/link";
import { StoreButtons } from "@/components/store-badges";

/**
 * The footer is the section bar's colour in both themes, so the page is
 * closed by the same slab it opens with. Text on it is therefore always
 * white-on-slate and does not use the theme's foreground variables.
 */
export function SiteFooter() {
  return (
    <footer className="mt-10 bg-brand text-white/70 text-[13px]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <p>
            <span className="font-display text-[22px] font-bold leading-none text-white">Klasteri</span>
            <span className="ml-2.5">Lajmet, me rrënjë e degë</span>
          </p>
          <div className="flex gap-5 text-white">
            <Link href="/privacy">Privatësia</Link>
            <Link href="/terms">Kushtet</Link>
            <Link href="/contact">Kontakt</Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-4">
            <span>Klasteri edhe në telefon:</span>
            <StoreButtons variant="quiet" />
          </div>
          <p className="text-[12px]">
            © {new Date().getFullYear()} Klasteri. Të gjitha të drejtat të rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
}
