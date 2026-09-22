import type { MetadataRoute } from "next";
import { media, services, site, siteUrl } from "@/lib/site";

/**
 * Uma pagina so — o sitemap nao serve aqui para o Google "achar" o site, e sim
 * para declarar a URL canonica com barra final (next.config.ts usa
 * trailingSlash) e para entregar as fotos ao Google Imagens, que nao rastreia
 * bem imagem que so existe dentro de <picture> com AVIF/WebP na frente.
 *
 * lastModified sai da hora do build: e a unica data que o export estatico
 * conhece, e ela so muda quando o conteudo e republicado.
 */

/** So o JPEG: e o formato que o Google Imagens indexa em todos os casos. */
const photos = [
  site.ogImage,
  ...services.filter((service) => !service.video).map(({ asset }) => asset.jpg),
  media.local1.jpg,
  media.local2.jpg,
  media.card1.jpg,
  media.card2.jpg,
  media.card3.jpg,
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      images: [...new Set(photos)].map((path) => `${siteUrl}${path}`),
    },
  ];
}
