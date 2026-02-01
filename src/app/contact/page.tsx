import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Kontakt - Klasteri",
  description: "Na kontaktoni për çdo pyetje ose sugjerim",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Na Kontaktoni</h1>
        <p className="text-muted-foreground mb-8">
          Jemi këtu për t'ju ndihmuar. Zgjidhni mënyrën më të përshtatshme për të na kontaktuar.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Informacione Kontakti</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <a 
                    href="mailto:info@klasteri.com" 
                    className="text-primary hover:underline"
                  >
                    info@klasteri.com
                  </a>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Mbështetje Teknike</h3>
                  <a 
                    href="mailto:info@klasteri.com" 
                    className="text-primary hover:underline"
                  >
                    info@klasteri.com
                  </a>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Për Median</h3>
                  <a 
                    href="mailto:info@klasteri.com" 
                    className="text-primary hover:underline"
                  >
                    info@klasteri.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Koha e Përgjigjes</h2>
              <p className="text-muted-foreground">
                Përpiqemi t'u përgjigjemi të gjitha mesazheve brenda 24-48 orëve gjatë ditëve të punës. 
                Për çështje urgjente teknike, ju lutemi specifikoni "URGJENT" në temën e emailit.
              </p>
            </div>
          </div>

          {/* FAQ & Categories */}
          <div className="space-y-6">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Pyetje të Shpeshta</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Çfarë është Klasteri?</h3>
                  <p className="text-sm text-muted-foreground">
                    Klasteri është një platformë agregimi lajmesh që përdor inteligjencën artificiale për 
                    të grupuar lajmet e ngjashme nga burime të ndryshme mediatike shqiptare.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">A është Klasteri falas?</h3>
                  <p className="text-sm text-muted-foreground">
                    Po, Klasteri është plotësisht falas për t'u përdorur. Ne nuk kërkojmë regjistrim ose 
                    pagesë për të aksesuar lajmet.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Si mund të shtoj burimin tim të lajmeve?</h3>
                  <p className="text-sm text-muted-foreground">
                    Nëse përfaqësoni një burim lajmesh dhe dëshironi të përfshiheni në Klasteri, na dërgoni 
                    email me detajet e faqes suaj dhe do të shqyrtojmë kërkesën.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Si mund të raportoj një problem?</h3>
                  <p className="text-sm text-muted-foreground">
                    Për probleme teknike ose gabime, na shkruani në info@klasteri.com me përshkrim 
                    të detajuar të problemit dhe screenshots nëse është e mundur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Për Burimet e Lajmeve</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nëse përfaqësoni një organizatë mediatike dhe keni pyetje rreth mënyrës se si Klasteri 
              agragon përmbajtjen tuaj, ose nëse dëshironi të diskutoni bashkëpunime të mundshme, 
              jemi të hapur për bisedë.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne respektojmë të drejtat e pronësisë intelektuale dhe punojmë në përputhje me parimet 
              e agregimit të lajmeve. Çdo artikull i shfaqur në platformën tonë lidhet drejtpërdrejt 
              me burimin origjinal, duke siguruar që lexuesit të vizitojnë faqen tuaj për përmbajtjen e plotë.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Për Reklamuesit</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri ofron mundësi reklamimi për bizneset që dëshirojnë të arrijnë audiencën 
              shqipfolëse të interesuar për lajmet aktuale. Hapësirat tona reklamuese janë të 
              dizajnuara për të qenë jo-ndërhyrëse dhe të integruara natyrshëm me përvojën e leximit.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Për informacione mbi tarifat dhe mundësitë e reklamimit, ju lutemi na kontaktoni 
              në <a href="mailto:info@klasteri.com" className="text-primary hover:underline">info@klasteri.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Feedback dhe Sugjerime</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Vlerësojmë shumë feedback-un tuaj! Nëse keni sugjerime për të përmirësuar platformën, 
              veçori të reja që do të dëshironit të shihni, ose thjesht doni të ndani mendimin tuaj, 
              na shkruani. Çdo mesazh lexohet dhe merret parasysh.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Misioni ynë është të bëjmë informimin më të lehtë dhe më të shpejtë për të gjithë 
              shqipfolësit, dhe kontributi juaj na ndihmon të arrijmë këtë qëllim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Rrjetet Sociale</h2>
            <p className="text-muted-foreground leading-relaxed">
              Na ndiqni në rrjetet sociale për të qenë të informuar rreth përditësimeve të platformës 
              dhe lajmeve të fundit. Lidhjet do të shtohen së shpejti.
            </p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
