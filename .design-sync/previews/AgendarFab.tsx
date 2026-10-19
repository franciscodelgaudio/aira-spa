import { AgendarFab } from "aira-spa";

// O transform faz da caixa o bloco de referencia do position: fixed, entao os
// botoes ficam no canto da celula em vez do canto da pagina.
const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="relative h-36 w-[360px] overflow-hidden bg-sand [transform:translateZ(0)]">{children}</div>
);

export const NoHero = () => (
  <Frame>
    <div id="sec-hero" className="absolute inset-0" />
    <AgendarFab />
  </Frame>
);

// Com o hero fora da tela (pagina rolada), aparece a pilula "Agendar".
export const DepoisDoHero = () => (
  <Frame>
    <div id="sec-hero" className="fixed left-0 top-[-4000px] h-10 w-10" />
    <AgendarFab />
  </Frame>
);
