import { getNews, getNewsByCategory, Cluster, HomePageData } from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

const CATEGORIES = [
  { key: "top_overall", label: "Top Lajmet", href: "/" },
  { key: "vendi", label: "Vendi", href: "/?category=vendi" },
  { key: "rajoni", label: "Rajoni", href: "/?category=rajoni" },
  { key: "bota", label: "Bota", href: "/?category=bota" },
  { key: "sport", label: "Sport", href: "/?category=sport" },
  { key: "tech", label: "Tech", href: "/?category=tech" },
] as const;

import { CategoryColors, CategoryKey } from "@/lib/constants";

function CategorySection({ title, clusters, color, hideTitle }: { title: string; clusters: Cluster[]; color?: string; hideTitle?: boolean }) {
  if (clusters.length === 0) return null;

  return (
    <section className="mb-5">
      {!hideTitle && (
        <h2
          className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2 inline-block transition-all"
          style={{ borderBottomColor: color || 'var(--primary)' }}
        >
          {title === 'Top Lajmet' ? title : title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
        </h2>
      )}
      <div className="space-y-4">
        {clusters.map((cluster) => (
          <NewsCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </section>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";

  let homepageData: HomePageData = {
    top_overall: [], vendi: [], rajoni: [], bota: [], sport: [], tech: []
  };
  let categoryData: Cluster[] = [];
  let error = null;

  try {
    if (selectedCategory === "all") {
      homepageData = await getNews();
    } else {
      categoryData = await getNewsByCategory(selectedCategory);
    }
  } catch (e) {
    console.error("Failed to fetch news:", e);
    error = "Nuk mund të merren lajmet. Provoni përsëri më vonë.";
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${(selectedCategory === "all" && cat.key === "top_overall") ||
                        selectedCategory === cat.key
                        ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
              <div className="h-6 w-[1px] bg-border mx-2 hidden md:block" />
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Category Pills */}
      <div className="md:hidden border-b border-border bg-card overflow-x-auto">
        <div className="flex gap-2 px-4 py-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={cat.href}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${(selectedCategory === "all" && cat.key === "top_overall") ||
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

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 ">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-8">
          {/* News Feed */}
          <div className="flex-1 min-w-0">
            {selectedCategory === "all" ? (
              <>
                <CategorySection title="Top Lajmet" clusters={homepageData.top_overall} color={CategoryColors.top_overall} hideTitle={true} />
                <CategorySection title="Vendi" clusters={homepageData.vendi} color={CategoryColors.vendi} />
                <CategorySection title="Rajoni" clusters={homepageData.rajoni} color={CategoryColors.rajoni} />
                <CategorySection title="Bota" clusters={homepageData.bota} color={CategoryColors.bota} />
                <CategorySection title="Sport" clusters={homepageData.sport} color={CategoryColors.sport} />
                <CategorySection title="Tech" clusters={homepageData.tech} color={CategoryColors.tech} />
              </>
            ) : (
              <CategorySection
                title={CATEGORIES.find(c => c.key === selectedCategory)?.label || "Lajmet"}
                clusters={categoryData}
                color={CategoryColors[selectedCategory as CategoryKey]}
              />
            )}

            {((selectedCategory === "all" && Object.values(homepageData).every(arr => arr.length === 0)) ||
              (selectedCategory !== "all" && categoryData.length === 0)) && !error && (
                <div className="py-20 text-center text-muted-foreground">
                  Nuk ka lajme për momentin.
                </div>
              )}
          </div>

          {/* Sidebar - Reserved for Ads */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-20">
              {/* Ad Space Placeholder */}
              <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground text-sm min-h-[250px] flex items-center justify-center border border-dashed border-border">
                {/* Reserved for advertisements */}
              </div>

              <div className="mt-6 bg-muted rounded-lg p-6 text-center text-muted-foreground text-sm min-h-[250px] flex items-center justify-center border border-dashed border-border">
                {/* Reserved for advertisements */}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
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
    </div>
  );
}
