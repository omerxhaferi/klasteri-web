import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Kushtet e Përdorimit - Klasteri",
  description: "Kushtet dhe rregullat e përdorimit të platformës Klasteri",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-14 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/icon.png" 
                alt="Klasteri" 
                width={32} 
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold tracking-tight">Klasteri</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Kushtet e Përdorimit</h1>
        <p className="text-muted-foreground mb-8">Përditësuar më: Janar 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Pranimi i Kushteve</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Duke përdorur platformën Klasteri, ju pranoni të jeni të lidhur nga këto Kushte të Përdorimit. 
              Nëse nuk pajtoheni me ndonjë pjesë të këtyre kushteve, ju lutemi mos e përdorni shërbimin tonë. 
              Klasteri rezervon të drejtën për të ndryshuar këto kushte në çdo kohë, dhe përdorimi i vazhdueshëm 
              i platformës pas ndryshimeve përbën pranimin e kushteve të reja.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Përshkrimi i Shërbimit</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri është një platformë agregimi lajmesh që grumbullon dhe organizon artikuj nga burime të ndryshme 
              mediatike shqiptare. Ne përdorim teknologji të inteligjencës artificiale për të grupuar lajmet e ngjashme 
              në tema të përbashkëta, duke ju ndihmuar të qëndroni të informuar pa pasur nevojë të vizitoni shumë faqe.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri nuk prodhon përmbajtje origjinale të lajmeve. Të gjitha artikujt që shfaqen në platformën tonë 
              janë pronë e burimeve përkatëse të lajmeve dhe ne thjesht ofrojmë lidhje drejt tyre. Duke klikuar në një 
              artikull, ju do të ridrejtoheni në faqen origjinale të burimit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Përdorimi i Lejuar</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ju mund të përdorni Klasteri për qëllime personale dhe jo-komerciale. Është e ndaluar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Kopjimi, modifikimi ose shpërndarja e përmbajtjes së platformës pa leje të shkruar</li>
              <li>Përdorimi i sistemeve automatike për të mbledhur të dhëna nga platforma (scraping)</li>
              <li>Tentimi për të ndërhyrë në funksionimin e platformës ose infrastrukturës së saj</li>
              <li>Përdorimi i platformës për qëllime të paligjshme ose të dëmshme</li>
              <li>Heqja ose fshehja e informacionit të atribuimit të burimeve</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Pronësia Intelektuale</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Platforma Klasteri, duke përfshirë dizajnin, logon, algoritmet e grupimit dhe ndërfaqen e përdoruesit, 
              janë pronë ekskluzive e Klasteri. Përmbajtja e lajmeve që shfaqet në platformë i përket burimeve 
              përkatëse të lajmeve dhe mbrohet nga ligjet e të drejtës së autorit të tyre.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne respektojmë të drejtat e pronësisë intelektuale të burimeve të lajmeve dhe operojmë në përputhje 
              me parimet e "fair use" dhe agregimit të lajmeve. Nëse jeni përfaqësues i një burimi lajmesh dhe keni 
              shqetësime rreth shfaqjes së përmbajtjes suaj, ju lutemi na kontaktoni.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Mohimi i Përgjegjësisë</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri ofrohet "siç është" pa asnjë garanci të shprehur apo të nënkuptuar. Ne nuk garantojmë:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Saktësinë, plotësinë ose besueshmërinë e përmbajtjes së agreguar</li>
              <li>Disponueshmërinë e pandërprerë të shërbimit</li>
              <li>Se platforma do të jetë pa gabime ose defekte</li>
              <li>Se lidhjet e jashtme do të funksionojnë gjithmonë</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne nuk jemi përgjegjës për përmbajtjen e publikuar nga burimet e lajmeve. Çdo ankesë rreth 
              saktësisë së informacionit duhet t'i drejtohet burimit origjinal të lajmeve.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Kufizimi i Përgjegjësisë</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Në masën maksimale të lejuar nga ligji, Klasteri dhe drejtuesit, punonjësit dhe partnerët e tij 
              nuk do të jenë përgjegjës për asnjë dëm të drejtpërdrejtë, të tërthortë, rastësor, special ose 
              pasojor që rrjedh nga përdorimi ose pamundësia për të përdorur platformën.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Ndryshimet në Shërbim</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri rezervon të drejtën për të modifikuar, pezulluar ose ndërprerë çdo aspekt të shërbimit 
              në çdo kohë, pa njoftim paraprak. Ne nuk do të jemi përgjegjës ndaj jush ose palëve të treta për 
              çdo modifikim, pezullim ose ndërprerje të shërbimit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Ligji i Zbatueshëm</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Këto Kushte Përdorimi rregullohen dhe interpretohen në përputhje me ligjet e Republikës së 
              Maqedonisë së Veriut. Çdo mosmarrëveshje që lind nga këto kushte do të zgjidhet në gjykatat 
              kompetente të Maqedonisë së Veriut.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Kontakti</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nëse keni pyetje rreth këtyre Kushteve të Përdorimit, ju lutemi na kontaktoni në{" "}
              <Link href="/contact" className="text-primary hover:underline">faqen e kontaktit</Link>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Klasteri. Të gjitha të drejtat të rezervuara.
        </div>
      </footer>
    </div>
  );
}
