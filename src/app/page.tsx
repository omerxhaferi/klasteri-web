import { getNews, getNewsByCategory, getTonightNews, getDailySummary, Cluster, HomePageData, TonightData, DailySummary } from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TonightSidebar } from "@/components/tonight-sidebar";
import { TonightMobileCombined } from "@/components/tonight-mobile-combined";
import { MainContentWrapper } from "@/components/main-content-wrapper";
import Link from "next/link";

const CATEGORIES = [
  { key: "top_overall", label: "Kryesore", href: "/" },
  { key: "vendi", label: "Vendi", href: "/?category=vendi" },
  { key: "rajoni", label: "Rajoni", href: "/?category=rajoni" },
  { key: "bota", label: "Bota", href: "/?category=bota" },
  { key: "sport", label: "Sport", href: "/?category=sport" },
  { key: "tech", label: "Tech", href: "/?category=tech" },
] as const;

import { CategoryColors, CategoryKey } from "@/lib/constants";

export const dynamic = 'force-dynamic';

function SectionHeader({ title, color, moreHref }: { title: string; color?: string; moreHref?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-[5px] h-[20px] rounded-sm shrink-0"
        style={{ backgroundColor: color || 'var(--primary)' }}
      />
      <h2 className="font-serif text-[22px] font-bold tracking-tight text-foreground leading-none">
        {title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()}
      </h2>
      <div className="flex-1 h-px bg-border" />
      {moreHref && (
        <Link
          href={moreHref}
          className="text-[12px] font-semibold text-muted-foreground hover:text-foreground whitespace-nowrap"
        >
          Më shumë ›
        </Link>
      )}
    </div>
  );
}

function CategorySection({ title, clusters, color, moreHref }: { title: string; clusters: Cluster[]; color?: string; moreHref?: string }) {
  if (clusters.length === 0) return null;

  return (
    <section className="mt-9">
      <SectionHeader title={title} color={color} moreHref={moreHref} />
      <div>
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
  searchParams: Promise<{ category?: string; preview?: string }>;
}) {
  const params = await searchParams;
  const selectedCategory = params.category || "all";
  const previewSummary = params.preview === "summary";

  let homepageData: HomePageData = {
    top_overall: [], vendi: [], rajoni: [], bota: [], sport: [], tech: []
  };
  let categoryData: Cluster[] = [];
  let tonightData: TonightData = { clusters: [], is_active_hours: false };
  let dailySummary: DailySummary | null = null;
  let error = null;

  try {
    if (selectedCategory === "all") {
      homepageData = await getNews();
    } else {
      categoryData = await getNewsByCategory(selectedCategory);
    }

    // Collect all cluster IDs from main feed for deduplication
    const mainFeedClusterIds: number[] = [];
    if (selectedCategory === "all") {
      Object.values(homepageData).forEach((clusters: Cluster[]) => {
        clusters.forEach((c: Cluster) => mainFeedClusterIds.push(c.id));
      });
    } else {
      categoryData.forEach((c: Cluster) => mainFeedClusterIds.push(c.id));
    }

    // Fetch tonight data with exclusions
    try {
      tonightData = await getTonightNews(mainFeedClusterIds);
    } catch (e) {
      console.error("Failed to fetch tonight news:", e);
    }

    // Fetch daily summary
    try {
      dailySummary = await getDailySummary();
    } catch (e) {
      console.error("Failed to fetch daily summary:", e);
    }
  } catch (e) {
    console.error("Failed to fetch news:", e);
    error = "Nuk mund të merren lajmet. Provoni përsëri më vonë.";
  }

  // Backend already returns clusters sorted: today first (by article_count DESC),
  // then yesterday (by article_count DESC). Just take up to 12 results.
  const tonightClusters = tonightData.clusters.slice(0, 12);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        selectedCategory={selectedCategory}
        hasTonightClusters={tonightClusters.length > 0}
        serverIsNight={tonightData.is_active_hours}
        forceShow={previewSummary}
      />

      {/* Main Content */}
      <MainContentWrapper
        hasTonightClusters={tonightClusters.length > 0}
        serverIsNight={tonightData.is_active_hours}
        forceShow={previewSummary}
      >
        {/* Mobile Summary Player - stays at top */}
        <TonightMobileCombined
          clusters={[]}
          summary={dailySummary}
          serverIsNight={tonightData.is_active_hours}
          forceShow={previewSummary}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Sidebar - Trending + Summary Player */}
          <TonightSidebar
            clusters={tonightClusters}
            summary={dailySummary}
            serverIsNight={tonightData.is_active_hours}
            forceShow={previewSummary}
          />

          {/* News Feed */}
          <div className="flex-1 min-w-0">
            {selectedCategory === "all" ? (
              <>
                {homepageData.top_overall.map((cluster) => (
                  <NewsCard key={cluster.id} cluster={cluster} />
                ))}

                {/* Mobile Titujt kryesor - after the top stories */}
                <TonightMobileCombined
                  clusters={tonightClusters}
                  summary={null}
                  serverIsNight={tonightData.is_active_hours}
                  forceShow={previewSummary}
                />

                <CategorySection title="Vendi" clusters={homepageData.vendi} color={CategoryColors.vendi} moreHref="/?category=vendi" />
                <CategorySection title="Rajoni" clusters={homepageData.rajoni} color={CategoryColors.rajoni} moreHref="/?category=rajoni" />
                <CategorySection title="Bota" clusters={homepageData.bota} color={CategoryColors.bota} moreHref="/?category=bota" />
                <CategorySection title="Sport" clusters={homepageData.sport} color={CategoryColors.sport} moreHref="/?category=sport" />
                <CategorySection title="Tech" clusters={homepageData.tech} color={CategoryColors.tech} moreHref="/?category=tech" />
              </>
            ) : (
              <section>
                <SectionHeader
                  title={CATEGORIES.find(c => c.key === selectedCategory)?.label || "Lajmet"}
                  color={CategoryColors[selectedCategory as CategoryKey]}
                />
                <div>
                  {categoryData.map((cluster) => (
                    <NewsCard key={cluster.id} cluster={cluster} />
                  ))}
                </div>
              </section>
            )}

            {((selectedCategory === "all" && Object.values(homepageData).every(arr => arr.length === 0)) ||
              (selectedCategory !== "all" && categoryData.length === 0)) && !error && (
                <div className="py-20 text-center text-muted-foreground">
                  Nuk ka lajme për momentin.
                </div>
              )}
          </div>

          {/* Right Sidebar - Ads */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-[60px]">
              <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground text-sm min-h-[250px] flex items-center justify-center border border-dashed border-border">
                {/* Reserved for advertisements */}
              </div>

              <div className="mt-6 bg-muted rounded-lg p-6 text-center text-muted-foreground text-sm min-h-[250px] flex items-center justify-center border border-dashed border-border">
                {/* Reserved for advertisements */}
              </div>
            </div>
          </aside>

        </div>
      </MainContentWrapper>

      <SiteFooter />
    </div>
  );
}
