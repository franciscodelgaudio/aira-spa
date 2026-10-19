// Ponto de entrada do pacote do Claude Design. Os componentes do site usam
// export default; aqui viram exports nomeados em window.AiraSpa.
// O shim vem primeiro: precisa existir antes de lib/site.ts ser avaliado.
import "./shim";

export { default as AgendarFab } from "../components/agendar-fab";
export { default as AutoplayUnlock } from "../components/autoplay-unlock";
export { default as BgImage } from "../components/bg-image";
export { default as BgVideo } from "../components/bg-video";
export { default as Experiencias } from "../components/experiencias";
export { default as Footer } from "../components/footer";
export { default as Hero } from "../components/hero";
export { default as InstagramIcon } from "../components/instagram-icon";
export { default as Local } from "../components/local";
export { default as PrimeiraVez } from "../components/primeira-vez";
export { default as Sobre } from "../components/sobre";
export { default as Wordmark } from "../components/wordmark";

// Dados do negocio (lib/site.ts): textos, catalogo, unidades e midias que as
// secoes usam, para o agente compor telas novas com o conteudo real.
export { agency, assetBase, fullAddress, hours, instagram, media, services, site, unitHotels, units } from "../lib/site";
