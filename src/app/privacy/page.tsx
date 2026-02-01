import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Politika e Privatësisë - Klasteri",
  description: "Si i trajtojmë dhe mbrojmë të dhënat tuaja në Klasteri",
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold mb-2">Politika e Privatësisë</h1>
        <p className="text-muted-foreground mb-8">Përditësuar më: Janar 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Hyrje</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri ("ne", "tonë", "platforma") respekton privatësinë tuaj dhe është e përkushtuar për të 
              mbrojtur të dhënat tuaja personale. Kjo Politikë e Privatësisë shpjegon se si mbledhim, përdorim, 
              ruajmë dhe mbrojmë informacionin tuaj kur përdorni platformën tonë të agregimit të lajmeve.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Duke përdorur Klasteri, ju pranoni praktikat e përshkruara në këtë politikë. Ne ju inkurajojmë 
              ta lexoni me kujdes këtë dokument për të kuptuar qasjen tonë ndaj privatësisë.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Informacioni që Mbledhim</h2>
            
            <h3 className="text-lg font-medium mb-3 mt-6">2.1 Informacioni i Mbledhur Automatikisht</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Kur vizitoni Klasteri, serverat tanë mund të mbledhin automatikisht informacion të caktuar teknik:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Adresa IP (e anonimizuar për analitikë)</li>
              <li>Lloji i shfletuesit dhe versioni</li>
              <li>Sistemi operativ i pajisjes</li>
              <li>Faqet e vizituara dhe koha e kaluar</li>
              <li>Burimi i referimit (si arritët tek ne)</li>
              <li>Preferencat e gjuhës</li>
            </ul>

            <h3 className="text-lg font-medium mb-3 mt-6">2.2 Cookies dhe Teknologji të Ngjashme</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri përdor cookies të nevojshme për funksionimin e duhur të platformës:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Cookies Teknike:</strong> Të nevojshme për funksionalitetin bazë të faqes</li>
              <li><strong>Cookies Preferencash:</strong> Ruajnë zgjedhjet tuaja (p.sh., tema e ndriçimit)</li>
              <li><strong>Cookies Analitike:</strong> Na ndihmojnë të kuptojmë si përdoret platforma</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ju mund të menaxhoni preferencat e cookies përmes cilësimeve të shfletuesit tuaj. Megjithatë, 
              çaktivizimi i disa cookies mund të ndikojë në përvojën tuaj të përdorimit.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Si e Përdorim Informacionin</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Informacioni i mbledhur përdoret për:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Ofrimin dhe mirëmbajtjen e shërbimit të agregimit të lajmeve</li>
              <li>Përmirësimin e përformancës dhe përvojës së përdoruesit</li>
              <li>Analizën e tendencave të përdorimit për të optimizuar platformën</li>
              <li>Identifikimin dhe zgjidhjen e problemeve teknike</li>
              <li>Mbrojtjen nga keqpërdorimi dhe aktivitetet e dyshimta</li>
              <li>Përmbushjen e detyrimeve ligjore</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Ndarja e Informacionit</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne NUK shesim, tregtojmë ose transferojmë të dhënat tuaja personale te palë të treta. 
              Informacioni mund të ndahet vetëm në këto rrethana të kufizuara:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>Ofruesit e Shërbimeve:</strong> Partnerë të besuar që na ndihmojnë të operojmë 
              platformën (p.sh., hosting), të cilët janë të detyruar të mbrojnë të dhënat tuaja</li>
              <li><strong>Kërkesat Ligjore:</strong> Kur kërkohet nga ligji ose për të mbrojtur të drejtat tona ligjore</li>
              <li><strong>Të Dhëna të Agregatuara:</strong> Statistika anonime që nuk identifikojnë individë</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Siguria e të Dhënave</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne zbatojmë masa të përshtatshme teknike dhe organizative për të mbrojtur informacionin tuaj:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li>Enkriptimi SSL/TLS për të gjitha komunikimet</li>
              <li>Serverë të sigurt me akses të kufizuar</li>
              <li>Monitorim i rregullt i sigurisë</li>
              <li>Backup të rregullta të të dhënave</li>
              <li>Protokolle të qarta për trajtimin e incidenteve të sigurisë</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Megjithëse përpiqemi të përdorim mjete të pranuara komerciale për të mbrojtur informacionin tuaj, 
              asnjë metodë transmetimi në internet ose ruajtje elektronike nuk është 100% e sigurt.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Ruajtja e të Dhënave</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne ruajmë të dhënat e mbledhura vetëm për aq kohë sa është e nevojshme për qëllimet e 
              përshkruara në këtë politikë, përveç kur periudha më e gjatë e ruajtjes kërkohet ose lejohet 
              nga ligji. Të dhënat analitike zakonisht ruhen për maksimum 26 muaj.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Të Drejtat Tuaja</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Në varësi të ligjeve të zbatueshme, ju mund të keni të drejta të caktuara në lidhje me 
              të dhënat tuaja personale:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
              <li><strong>E Drejta e Aksesit:</strong> Të kërkoni kopje të të dhënave që kemi për ju</li>
              <li><strong>E Drejta e Korrigjimit:</strong> Të kërkoni korrigjimin e të dhënave të pasakta</li>
              <li><strong>E Drejta e Fshirjes:</strong> Të kërkoni fshirjen e të dhënave tuaja</li>
              <li><strong>E Drejta e Kufizimit:</strong> Të kërkoni kufizimin e përpunimit</li>
              <li><strong>E Drejta e Transportueshmërisë:</strong> Të merrni të dhënat tuaja në format të strukturuar</li>
              <li><strong>E Drejta e Kundërshtimit:</strong> Të kundërshtoni përpunimin e caktuar</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Për të ushtruar këto të drejta, ju lutemi na kontaktoni përmes{" "}
              <Link href="/contact" className="text-primary hover:underline">faqes së kontaktit</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Privatësia e Fëmijëve</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri nuk është i destinuar për fëmijë nën moshën 13 vjeç. Ne nuk mbledhim me vetëdije 
              informacion personal nga fëmijët. Nëse zbuloni që fëmija juaj na ka dhënë informacion 
              personal, ju lutemi na kontaktoni dhe ne do të marrim hapa për të fshirë atë informacion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Lidhjet e Jashtme</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Klasteri përmban lidhje drejt faqeve të jashtme të burimeve të lajmeve. Ne nuk jemi përgjegjës 
              për praktikat e privatësisë të këtyre faqeve. Ju inkurajojmë të lexoni politikat e privatësisë 
              të çdo faqeje që vizitoni përmes platformës sonë.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Ndryshimet në Politikë</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ne mund të përditësojmë këtë Politikë të Privatësisë herë pas here. Ndryshimet do të publikohen 
              në këtë faqe me datën e përditësimit. Për ndryshime të rëndësishme, do të përpiqemi t'ju 
              njoftojmë përmes platformës. Përdorimi i vazhdueshëm i Klasteri pas ndryshimeve përbën 
              pranimin e politikës së re.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">11. Kontakti</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nëse keni pyetje ose shqetësime rreth kësaj Politike të Privatësisë ose trajtimit të të 
              dhënave tuaja, ju lutemi na kontaktoni përmes{" "}
              <Link href="/contact" className="text-primary hover:underline">faqes së kontaktit</Link>.
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
