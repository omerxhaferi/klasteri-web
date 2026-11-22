import { getSources, SourceInfo } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MuteSettings } from "@/components/mute-settings";
import { TabHeading } from "@/components/tab-heading";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    let sources: SourceInfo[] = [];
    let error: string | null = null;

    try {
        // Sorted here, once, and not again in the browser: see MuteSettings.
        sources = (await getSources()).sort((a, b) => a.name.localeCompare(b.name, "sq"));
    } catch (e) {
        console.error("Failed to fetch sources:", e);
        error = "Nuk mund të merren burimet. Provoni përsëri më vonë.";
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SiteHeader />

            <main className="w-full flex-1 max-w-2xl mx-auto px-4 py-5">
                <h1 className="text-[24px] font-bold leading-tight">
                    Cilësimet
                </h1>

                <section className="mt-4">
                    <TabHeading title="Burimet" className="mb-3" />

                    {error ? (
                        <div className="px-3 py-2.5 border border-hot bg-muted text-hot text-[13px] font-bold">
                            {error}
                        </div>
                    ) : (
                        <MuteSettings sources={sources} />
                    )}
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
