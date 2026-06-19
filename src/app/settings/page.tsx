import { getSources, SourceInfo } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MuteSettings } from "@/components/mute-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    let sources: SourceInfo[] = [];
    let error: string | null = null;

    try {
        sources = await getSources();
    } catch (e) {
        console.error("Failed to fetch sources:", e);
        error = "Nuk mund të merren burimet. Provoni përsëri më vonë.";
    }

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            <main className="max-w-2xl mx-auto px-4 py-8">
                <h1 className="font-serif text-[28px] font-bold tracking-tight text-foreground mb-1">
                    Cilësimet
                </h1>

                <section className="mt-6">
                    <h2 className="font-serif text-[20px] font-bold tracking-tight text-foreground mb-3 pb-2 border-b-2 border-foreground inline-block">
                        Burimet
                    </h2>

                    {error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium">
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
