import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

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
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
