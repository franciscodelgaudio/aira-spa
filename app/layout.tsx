import type { Metadata } from "next";
import { Jost, Cormorant_Garamond } from "next/font/google";
import { media } from "@/lib/site";
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
  title: "Aira Spa — Massagem e relaxamento em Foz do Iguaçu",
  description:
    "Duas unidades em Foz do Iguaçu: DoubleTree by Hilton e Viale Cataratas. Massagem relaxante, candle, pedras quentes, drenagem linfática e facial. Agende pelo WhatsApp.",
  openGraph: {
    title: "Aira Spa — Foz do Iguaçu",
    description: "Seu corpo pede pausa. Um instante para desacelerar.",
    locale: "pt_BR",
    type: "website",
  },
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
          href={media.heroVideo.poster}
          fetchPriority="high"
        />
      </head>
      <body className="w-full overflow-x-hidden bg-sand text-ink">{children}</body>
    </html>
  );
}
