import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Exigido por output: "export" — sem isso o Next trata a rota de metadata como
 * dinamica e o build para, porque um export estatico nao tem servidor para
 * responder em tempo de requisicao.
 */
export const dynamic = "force-static";


/**
 * O manifesto vale menos como PWA e mais como identidade: e o que da nome e
 * icone corretos quando alguem salva o site na tela inicial do celular, que e
 * de onde vem a maior parte do trafego de um spa.
 *
 * display "browser" de proposito — nada aqui se comporta como aplicativo, e
 * "standalone" so tiraria a barra de endereco de quem quer compartilhar o link.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: site.locale,
    dir: "ltr",
    categories: ["health", "lifestyle", "travel"],
    background_color: "#e9e5dc",
    theme_color: "#8a6a4f",
    icons: [
      {
        src: "/FAVICON.png?v=3",
        type: "image/png",
        sizes: "1254x1254",
        purpose: "any",
      },
    ],
  };
}
