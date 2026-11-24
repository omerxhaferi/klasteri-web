/**
 * The feed. One implementation, three routes.
 *
 *   /              — edition from the cookie (the deployed homepage)
 *   /mk            — edition from the URL
 *   /mk/vendi      — edition and category from the URL
 *
 * Everything that made the homepage what it is lives here — the tonight
 * de-duplication, the daily summary, the muted-publisher cookie, the sidebars —
 * so the country routes cannot end up a stale copy of it. The two things a
 * route decides for itself are which edition to fetch (`country`) and how its
 * links should be spelled (`base`, see lib/routes.ts).
 */

import {
    getNews,
    getNewsByCategory,
    getTonightNews,
    getDailySummary,
    getFuelPrices,
    getWeather,
    Cluster,
    HomePageData,
    TonightData,
    DailySummary,
    FuelPricesData,
    WeatherData,
} from "@/lib/api";
import { NewsCard } from "@/components/news-card";
import { FuelPricesCard } from "@/components/fuel-prices-card";
import { WeatherCard } from "@/components/weather-card";
import { TabHeading } from "@/components/tab-heading";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TonightSidebar } from "@/components/tonight-sidebar";
import { TonightMobileCombined } from "@/components/tonight-mobile-combined";
import { AppDownloadBanner } from "@/components/app-download-banner";
import { MainContentWrapper } from "@/components/main-content-wrapper";
import { cookies } from "next/headers";
import { MUTED_COOKIE, parseMutedCookie, applyMutesToClusters, applyMutesToTonight } from "@/lib/mutes";
import { CategoryColors, CategoryKey } from "@/lib/constants";
import { type CountryCode } from "@/lib/country";
import { NAV_CATEGORIES, categoryHref } from "@/lib/routes";
import Link from "next/link";

function SectionHeader({ title, color, moreHref }: { title: string; color?: string; moreHref?: string }) {
  return (
    <TabHeading
      title={title}
      color={color}
      right={
        moreHref && (
          <Link href={moreHref} className="font-bold text-primary">
            më shumë »
          </Link>
        )
      }
    />
  );
}

function CategorySection({ title, clusters, color, moreHref }: { title: string; clusters: Cluster[]; color?: string; moreHref?: string }) {
  if (clusters.length === 0) return null;

  return (
    <section className="mt-7">
      <SectionHeader title={title} color={color} moreHref={moreHref} />
      <div>
        {clusters.map((cluster) => (
          <NewsCard key={cluster.id} cluster={cluster} />
        ))}
      </div>
    </section>
  );
}

export interface HomeFeedProps {
  /**
   * The edition to fetch. Already resolved by the route: from the URL segment
   * where there is one, from the cookie on `/`. This component never reads the
   * country itself, so there is exactly one place per route that decides it.
   */
  country: CountryCode;
  /** `''` on `/`, `/mk` on a country URL. See lib/routes.ts. */
  base: string;
  /** `'all'` for the homepage, otherwise a category slug. */
  category: string;
  /** `?preview=summary` — forces the briefing player outside its hours. */
  previewSummary?: boolean;
}

export async function HomeFeed({ country, base, category, previewSummary = false }: HomeFeedProps) {
  const selectedCategory = category || "all";

  // Started first and awaited last, so it never adds to the page's wait. A
  // failure only hides the card: prices must not cost anyone the news.
  const fuelRequest: Promise<FuelPricesData | null> = getFuelPrices(country).catch((e) => {
    console.error("Failed to fetch fuel prices:", e);
    return null;
  });
  const weatherRequest: Promise<WeatherData | null> = getWeather(country).catch((e) => {
    console.error("Failed to fetch weather:", e);
    return null;
  });

  let homepageData: HomePageData = {
    top_overall: [], vendi: [], rajoni: [], bota: [], sport: [], tech: []
  };
  let categoryData: Cluster[] = [];
  let tonightData: TonightData = { clusters: [], is_active_hours: false };
  let dailySummary: DailySummary | null = null;
  let error = null;

  try {
    if (selectedCategory === "all") {
      homepageData = await getNews(country);
    } else {
      categoryData = await getNewsByCategory(selectedCategory, country);
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
      tonightData = await getTonightNews(mainFeedClusterIds, country);
    } catch (e) {
      console.error("Failed to fetch tonight news:", e);
    }

    // Fetch daily summary
    try {
      dailySummary = await getDailySummary(country);
    } catch (e) {
      console.error("Failed to fetch daily summary:", e);
    }
  } catch (e) {
    console.error("Failed to fetch news:", e);
    error = "Nuk mund të merren lajmet. Provoni përsëri më vonë.";
  }

  // Apply reader muted-publisher preferences (cookie) before render.
  const muted = parseMutedCookie((await cookies()).get(MUTED_COOKIE)?.value);
  if (muted.size > 0) {
    homepageData = {
      top_overall: applyMutesToClusters(homepageData.top_overall, muted),
      vendi: applyMutesToClusters(homepageData.vendi, muted),
      rajoni: applyMutesToClusters(homepageData.rajoni, muted),
      bota: applyMutesToClusters(homepageData.bota, muted),
      sport: applyMutesToClusters(homepageData.sport, muted),
      tech: applyMutesToClusters(homepageData.tech, muted),
    };
    categoryData = applyMutesToClusters(categoryData, muted);
    tonightData = { ...tonightData, clusters: applyMutesToTonight(tonightData.clusters, muted) };
  }

  // Backend already returns clusters sorted: today first (by article_count DESC),
  // then yesterday (by article_count DESC). Just take up to 12 results.
  const tonightClusters = tonightData.clusters.slice(0, 12);

  const fuelPrices = await fuelRequest;
  const hasFuel = !!fuelPrices && fuelPrices.prices.length > 0;
  const weather = await weatherRequest;
  const hasWeather = !!weather && weather.towns.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader
        selectedCategory={selectedCategory}
        base={base}
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

        {/* Mobile-only install prompt (dismissible); desktop gets footer links */}
        <AppDownloadBanner />

        {error && (
          <div className="mb-5 px-3 py-2.5 border border-hot bg-muted text-hot text-[13px] font-bold">
            {error}
          </div>
        )}

        <div className="flex gap-7">
          {/* Left Sidebar - Trending + Summary Player */}
          <TonightSidebar
            clusters={tonightClusters}
            summary={dailySummary}
            serverIsNight={tonightData.is_active_hours}
            forceShow={previewSummary}
            fuel={fuelPrices}
            weather={weather}
          />

          {/* News Feed */}
          <div className="flex-1 min-w-0">
            {selectedCategory === "all" ? (
              <>
                {homepageData.top_overall.map((cluster) => (
                  <NewsCard key={cluster.id} cluster={cluster} />
                ))}

                {/* Mobile fuel prices, above Titujt kryesor as in the desktop sidebar */}
                {hasFuel && <FuelPricesCard data={fuelPrices!} className="lg:hidden mt-5 mb-5" />}
                {hasWeather && <WeatherCard data={weather!} className="lg:hidden mt-5 mb-5" />}

                {/* Mobile Titujt kryesor - after the top stories */}
                <TonightMobileCombined
                  clusters={tonightClusters}
                  summary={null}
                  serverIsNight={tonightData.is_active_hours}
                  forceShow={previewSummary}
                />

                <CategorySection title="Vendi" clusters={homepageData.vendi} color={CategoryColors.vendi} moreHref={categoryHref(base, "vendi")} />
                <CategorySection title="Rajoni" clusters={homepageData.rajoni} color={CategoryColors.rajoni} moreHref={categoryHref(base, "rajoni")} />
                <CategorySection title="Bota" clusters={homepageData.bota} color={CategoryColors.bota} moreHref={categoryHref(base, "bota")} />
                <CategorySection title="Sport" clusters={homepageData.sport} color={CategoryColors.sport} moreHref={categoryHref(base, "sport")} />
                <CategorySection title="Tech" clusters={homepageData.tech} color={CategoryColors.tech} moreHref={categoryHref(base, "tech")} />
              </>
            ) : (
              <section>
                <SectionHeader
                  title={NAV_CATEGORIES.find(c => c.key === selectedCategory)?.label || "Lajmet"}
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
                <div className="py-16 text-center text-muted-foreground">
                  Nuk ka lajme për momentin.
                </div>
              )}
          </div>

          {/* Right Sidebar - Ads */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-[52px] space-y-4">
              <div className="bg-muted border border-border min-h-[250px]">
                {/* Reserved for advertisements */}
              </div>

              <div className="bg-muted border border-border min-h-[250px]">
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
