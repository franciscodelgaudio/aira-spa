import AgendarFab from "@/components/agendar-fab";
import Hero from "@/components/hero";
import Experiencias from "@/components/experiencias";
import PrimeiraVez from "@/components/primeira-vez";
import Local from "@/components/local";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <AgendarFab />
      {/*
        <main> marca onde comeca o conteudo. Serve para o "pular para o conteudo"
        dos leitores de tela e para os extratores de texto (incluindo os de IA),
        que usam esse limite para separar conteudo de navegacao e rodape.
      */}
      <main>
        <Hero />
        <Experiencias />
        <PrimeiraVez />
        <Local />
      </main>
      <Footer />
    </>
  );
}
