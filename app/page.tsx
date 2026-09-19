import ScrollEngine from "@/components/scroll-engine";
import AgendarFab from "@/components/agendar-fab";
import Hero from "@/components/hero";
import Corpo from "@/components/corpo";
import Massagem from "@/components/massagem";
import Experiencias from "@/components/experiencias";
import Facial from "@/components/facial";
import Ambiente from "@/components/ambiente";
import PrimeiraVez from "@/components/primeira-vez";
import Local from "@/components/local";
import Cta from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <ScrollEngine />
      <AgendarFab />
      <Hero />
      <Corpo />
      <Massagem />
      <Experiencias />
      <Facial />
      <Ambiente />
      <PrimeiraVez />
      <Local />
      <Cta />
      <Footer />
    </>
  );
}
