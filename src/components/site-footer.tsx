import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted mt-12">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo width={24} height={24} />
            <span className="font-semibold">Klasteri</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Agregatori i lajmeve shqip
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privatësia</Link>
            <Link href="/terms" className="hover:text-foreground">Kushtet</Link>
            <Link href="/contact" className="hover:text-foreground">Kontakt</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Klasteri. Të gjitha të drejtat të rezervuara.
        </div>
      </div>
    </footer>
  );
}
