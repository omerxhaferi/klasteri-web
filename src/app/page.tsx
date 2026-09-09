/**
 * The site root, unchanged in behaviour.
 *
 * This is the deployed homepage: every inbound link, every search result and
 * the app's own store listing point here, and it has always meant "the edition
 * in your cookie, MK if you have none". That contract survives the move to
 * country URLs untouched — this route does not redirect to `/mk`, and its
 * category links stay on `?category=`, which are the URLs already indexed.
 *
 * The page itself now lives in `components/home-feed.tsx`, shared with `/[country]`
 * and `/[country]/[category]`, so the three cannot drift apart.
 */

import { HomeFeed } from "@/components/home-feed";
import { getActiveCountry } from "@/lib/country";

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; preview?: string }>;
}) {
  const params = await searchParams;

  return (
    <HomeFeed
      country={await getActiveCountry()}
      base=""
      // Unvalidated on purpose: an unknown `?category=` has always fallen
      // through to the API and surfaced as the "no news" state here, and this
      // URL is not the one that should start 404ing. The path form validates,
      // because there a bad segment IS a bad page.
      category={params.category || "all"}
      previewSummary={params.preview === "summary"}
    />
  );
}
