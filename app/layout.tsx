import type { Metadata, Viewport } from "next";
import { Jost, Cormorant_Garamond } from "next/font/google";
import JsonLd from "@/components/json-ld";
import { instagram, media, site, siteUrl } from "@/lib/site";
import "./globals.css";

const jost = Jost({
  variable: "--font-jost",
  weight: ["200", "300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["300", "400"],
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Sem metadataBase o Next emite URL relativa em og:image, e o WhatsApp, o
  // Facebook e o X descartam a imagem em vez de resolver o caminho.
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s | ${site.name} ${site.city}`,
  },
  description: site.description,
  applicationName: site.name,
  // Uma so URL indexavel: sem canonical, cada variante (www, http, ?fbclid=,
  // link do Instagram com utm) vira uma pagina concorrente aos olhos do Google.
  alternates: { canonical: "/" },
  keywords: [
    "spa em Foz do Iguaçu",
    "massagem em Foz do Iguaçu",
    "massagem relaxante Foz do Iguaçu",
    "drenagem linfática Foz do Iguaçu",
    "massagem com pedras quentes",
    "massagem candle",
    "limpeza de pele e facial Foz do Iguaçu",
    "spa DoubleTree by Hilton Foz do Iguaçu",
    "spa Viale Cataratas",
    "day spa Cataratas",
  ],
  category: "Spa e bem-estar",
  authors: [{ name: site.name, url: `${siteUrl}/` }],
  creator: site.name,
  publisher: site.name,
  // Os numeros ja estao dentro de links de WhatsApp. A auto-deteccao do iOS
  // tentaria embrulha-los em um tel: proprio, aninhando <a> dentro de <a>.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.ogImageAlt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [{ url: site.ogImage, alt: site.ogImageAlt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sem isso o Google usa a miniatura pequena nos resultados e corta o
      // trecho de texto — os dois derrubam o clique.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/FAVICON.png?v=3", sizes: "1254x1254", type: "image/png" }],
    apple: [{ url: "/FAVICON.png?v=3", sizes: "1254x1254", type: "image/png" }],
  },
  // O <link rel="manifest"> sai de app/manifest.ts — declarar aqui duplicaria a tag.
  other: {
    // Sinais de negocio local que alguns agregadores e crawlers ainda leem.
    "geo.region": `BR-${site.region}`,
    "geo.placename": site.city,
  },
};

export const viewport: Viewport = {
  // Pinta a barra do navegador na cor do site antes do CSS carregar.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7eceb" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2b2a" },
  ],
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${cormorant.variable}`}>
      <head>
        {/*
          O poster do hero e a primeira pintura da pagina. Sem esse preload ele
          so entra na fila depois do parser achar o <video>, e o topo fica preto
          ate o MP4/WebM ter buffer — que e justamente o que demora no 4G.
        */}
        <link
          rel="preload"
          as="image"
          href={media.massagemVideo.poster}
          fetchPriority="high"
        />
        {/* O <iframe> do mapa so e criado no clique; o DNS pode ir adiantando. */}
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="me" href={instagram.url} />
        <JsonLd />
      </head>
      <body className="w-full overflow-x-hidden bg-sand text-ink">{children}</body>
    </html>
  );
}
