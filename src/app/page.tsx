import { getNews, getNewsByCategory, getTonightNews, getDailySummary, Cluster, HomePageData, TonightData, DailySummary } from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TonightSidebar } from "@/components/tonight-sidebar";
import { TonightMobileCombined } from "@/components/tonight-mobile-combined";
import { MainContentWrapper } from "@/components/main-content-wrapper";

const CATEGORIES = [
  { key: "top_overall", label: "Top Lajmet", href: "/" },
  { key: "vendi", label: "Vendi", href: "/?category=vendi" },
  { key: "rajoni", label: "Rajoni", href: "/?category=rajoni" },
  { key: "bota", label: "Bota", href: "/?category=bota" },
  { key: "sport", label: "Sport", href: "/?category=sport" },
  { key: "tech", label: "Tech", href: "/?category=tech" },
] as const;

import { CategoryColors, CategoryKey } from "@/lib/constants";

export const dynamic = 'force-dynamic';

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

  // Split clusters into today vs yesterday based on top_article.crawled_at
  const now = new Date();
  const todayClusters = tonightData.clusters.filter(c => {
    const d = new Date(c.top_article.crawled_at.replace("Z", ""));
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const yesterdayClusters = tonightData.clusters.filter(c => {
    const d = new Date(c.top_article.crawled_at.replace("Z", ""));
    return d.getDate() !== now.getDate() || d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear();
  });

  // If today has 5+ clusters, show today + yesterday; otherwise show only yesterday
  const filteredClusters = todayClusters.length >= 5
    ? [...todayClusters, ...yesterdayClusters]
    : yesterdayClusters;

  // Dynamic count algorithm: show 5-10 based on quality
  const qualityThreshold = 5;
  const highQualityClusters = filteredClusters.filter(c => c.today_article_count >= qualityThreshold);
  const displayCount = Math.max(5, Math.min(10, highQualityClusters.length > 0 ? highQualityClusters.length : filteredClusters.length));
  const tonightClusters = filteredClusters.slice(0, displayCount);

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
        {/* Mobile Combined Section - Tonight Focus + Summary Player */}
        <TonightMobileCombined
          clusters={tonightClusters}
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
          {/* Left Sidebar - Tonight Section with Summary Player */}
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

          {/* Right Sidebar - Ads */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-20">
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
