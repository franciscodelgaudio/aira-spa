/**
 * Fonte unica de verdade do negocio. Tudo que descreve o Aira Spa para pessoas
 * (o que a pagina renderiza) e para maquinas (metadados, JSON-LD, sitemap,
 * llms.txt) sai daqui. Se o mesmo dado for escrito em dois lugares, os
 * buscadores acabam vendo duas versoes do mesmo negocio — e NAP inconsistente
 * (nome/endereco/telefone) e o erro classico que derruba SEO local.
 */

/**
 * URL canonica. Sobrescrevivel no build para preview/staging:
 *   NEXT_PUBLIC_SITE_URL=https://preview.exemplo.com npm run build
 * A barra final e removida para as concatenacoes nunca gerarem "//".
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://airaspa.com.br"
).replace(/\/+$/, "");

export const site = {
  name: "Aira Spa",
  tagline: "Massagem e spa em Foz do Iguaçu",
  title: "Aira Spa — Massagem e Spa em Foz do Iguaçu",
  description:
    "Massagem relaxante, pedras quentes, drenagem linfática e facial em Foz do Iguaçu. Duas unidades: DoubleTree by Hilton e Viale Cataratas. Aberto todos os dias.",
  /**
   * Paragrafo de contexto para GEO: uma resposta completa e autocontida, do
   * jeito que um modelo de linguagem consegue citar sem precisar do resto da
   * pagina. Quem, o que, onde, para quem e como agendar em um bloco so.
   */
  summary:
    "O Aira Spa é um spa de massagem em Foz do Iguaçu (PR), com duas unidades instaladas dentro dos hotéis DoubleTree by Hilton e Viale Cataratas, ambas na Avenida das Cataratas. Atende hóspedes, moradores e visitantes — não é preciso estar hospedado. Os atendimentos são agendados por WhatsApp e acontecem todos os dias, das 15h às 21h.",
  locale: "pt-BR",
  city: "Foz do Iguaçu",
  region: "PR",
  regionName: "Paraná",
  country: "BR",
  /** Previa de link, gerada por scripts/make-brand-assets.mjs. */
  ogImage: "/og.jpg",
  /** Descreve o que a imagem gerada mostra: troque junto com a foto de origem. */
  ogImageAlt:
    "Sala de massagem do Aira Spa em Foz do Iguaçu, com duas macas preparadas, toalhas e espelhos de palha, dentro dos hotéis DoubleTree by Hilton e Viale Cataratas",
} as const;

/** Mesmo horario nas duas unidades. Formato 24h, como o schema.org exige. */
export const hours = {
  opens: "15:00",
  closes: "21:00",
  days: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  /** A mesma informacao em texto, para a pagina mostrar o que o schema afirma. */
  human: "Todos os dias, das 15h às 21h",
} as const;

export const units = [
  {
    slug: "doubletree",
    name: "Unidade DoubleTree by Hilton",
    hotel: "DoubleTree by Hilton Foz do Iguaçu",
    location: "Unidade DoubleTree by Hilton",
    address: "Av. das Cataratas, 2930",
    district: "Vila Yolanda",
    postalCode: "85853-000",
    phone: "(45) 99133-1717",
    /** E.164 — o formato que o schema.org espera em telephone. */
    phoneE164: "+5545991331717",
    whatsapp: "https://wa.me/5545991331717",
  },
  {
    slug: "viale",
    name: "Unidade Viale Cataratas",
    hotel: "Viale Cataratas Hotel",
    location: "Unidade Viale Cataratas",
    address: "Av. das Cataratas, 2420",
    district: "Vila Yolanda",
    postalCode: "85853-000",
    phone: "(45) 99103-1666",
    phoneE164: "+5545991031666",
    whatsapp: "https://wa.me/5545991031666",
  },
] as const;

export type Unit = (typeof units)[number];

/** Endereco completo em uma linha, do jeito que o Google espera ver no rodape. */
export const fullAddress = (unit: Unit) =>
  `${unit.address} — ${unit.district}, ${site.city} - ${site.region}, ${unit.postalCode}`;

/** Busca pelo nome do hotel: cai no pino certo sem depender de coordenada. */
export const mapsQuery = (unit: Unit) =>
  `${unit.hotel}, ${unit.address}, ${site.city} - ${site.region}`;

export const mapsUrl = (unit: Unit) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapsQuery(unit)
  )}`;

export const instagram = {
  handle: "@airaspa.foz",
  url: "https://instagram.com/airaspa.foz",
} as const;

export const agency = {
  name: "Triad Soluções Inteligentes",
  cnpj: "62.262.799/0001-41",
  phone: "(45) 98835-1168",
  whatsapp: "https://wa.me/5545988351168",
} as const;

export type VideoAsset = {
  webm: string;
  mp4: string;
  /** Primeira pintura, e o que fica na tela se o autoplay for bloqueado. */
  poster: string;
};

export type ImageAsset = {
  avif: string;
  webp: string;
  jpg: string;
  width: number;
  height: number;
};

// Os arquivos sao gerados por scripts/optimize-media.mjs a partir de media-original/.
const video = (name: string): VideoAsset => ({
  webm: `/uploads/${name}.webm`,
  mp4: `/uploads/${name}.mp4`,
  poster: `/uploads/posters/${name}.jpg`,
});

// width/height sao os do arquivo, usados para reservar a caixa e nao dar layout shift.
const image = (name: string, width: number, height: number): ImageAsset => ({
  avif: `/uploads/${name}.avif`,
  webp: `/uploads/${name}.webp`,
  jpg: `/uploads/${name}.jpg`,
  width,
  height,
});

export const media = {
  /** Triptico para telas deitadas; a versao vertical e a faixa central dele. */
  heroVideo: video("hero"),
  heroVerticalVideo: video("hero-vertical"),
  massagemVideo: video("costas"),
  candleVideo: video("cha"),
  escalpesVideo: video("pes"),
  ambienteVideo: video("hidro"),
  salaVideo: video("sala-spa"),
  facial: image("facial", 1820, 1666),
  // Dois trechos do mesmo reels da unidade DoubleTree (media-fonte/2026-08-12_18-58-38_UTC.mp4):
  // o ambiente do spa (14,3–22,7 s) e o caminho do saguao ate a porta (0,5–12,2 s).
  card1Video: video("chegada-momento"),
  card2: image("hidro", 519, 649),
  card3Video: video("chegada-caminho"),
  local1: image("sala", 1086, 1358),
  local2: image("cha", 1088, 1344),
} as const;

export type Service = {
  name: string;
  description: string;
  /** Descricao da midia: vira o alt da imagem ou o aria-label do video. */
  alt: string;
  /** object-position do recorte. */
  position: string;
} & ({ video: true; asset: VideoAsset } | { video: false; asset: ImageAsset });

/**
 * O catalogo. Alimenta ao mesmo tempo a secao "Experiencias" e o hasOfferCatalog
 * do JSON-LD: o que o visitante le e exatamente o que o buscador indexa.
 */
export const services: Service[] = [
  {
    name: "Massagem Relaxante",
    description:
      "Uma massagem com movimentos suaves e contínuos, pensada para aliviar a sensação de tensão muscular e proporcionar um momento de descanso profundo.",
    alt: "Massagem relaxante nas costas durante um atendimento no Aira Spa",
    video: true,
    asset: media.massagemVideo,
    position: "50% 10%",
  },
  {
    name: "Massagem Candle",
    description:
      "Uma experiência sensorial feita com óleo morno de vela cosmética, que combina calor, aroma e movimentos relaxantes sobre a pele.",
    alt: "Vela cosmética e chá servidos na sala de massagem candle do Aira Spa",
    video: true,
    asset: media.candleVideo,
    position: "50% 10%",
  },
  {
    name: "Escalpes",
    description:
      "Uma massagem concentrada no couro cabeludo, na nuca e nos ombros, ideal para desacelerar e aliviar a sensação de tensão nessas regiões.",
    alt: "Massagem de escalpe no couro cabeludo e na nuca no Aira Spa",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 22%",
  },
  {
    name: "Drenagem Linfática",
    description:
      "Realizada com movimentos leves, lentos e ritmados, a drenagem oferece uma experiência delicada de cuidado e sensação de leveza para o corpo.",
    alt: "Drenagem linfática com movimentos leves e ritmados no Aira Spa",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 10%",
  },
  {
    name: "Pedras Quentes",
    description:
      "Combina o toque da massagem com pedras aquecidas posicionadas sobre o corpo, criando uma sensação envolvente de calor e relaxamento.",
    alt: "Sala de massagem com pedras quentes do Aira Spa em Foz do Iguaçu",
    video: true,
    asset: media.salaVideo,
    position: "50% 10%",
  },
  {
    name: "Facial",
    description:
      "Um cuidado dedicado ao rosto que reúne hidratação, movimentos de massagem e uma pausa relaxante para renovar a sensação da pele.",
    alt: "Tratamento facial com hidratação e massagem no rosto no Aira Spa",
    video: false,
    asset: media.facial,
    position: "50% 100%",
  },
];

/**
 * Perguntas frequentes. Viram FAQPage no JSON-LD, e por isso cada resposta aqui
 * precisa existir tambem em texto visivel na pagina — o Google desqualifica FAQ
 * marcado que o visitante nao consegue ler.
 */
export const faqs = [
  {
    question: "Preciso estar hospedado no hotel para ir ao Aira Spa?",
    answer:
      "Não. As unidades do Aira Spa ficam dentro dos hotéis DoubleTree by Hilton e Viale Cataratas, mas atendem hóspedes, moradores de Foz do Iguaçu e visitantes.",
  },
  {
    question: "Onde fica o Aira Spa em Foz do Iguaçu?",
    answer:
      "São duas unidades, as duas na Avenida das Cataratas, em Vila Yolanda: uma dentro do DoubleTree by Hilton (Av. das Cataratas, 2930) e outra dentro do Viale Cataratas (Av. das Cataratas, 2420).",
  },
  {
    question: "Qual é o horário de funcionamento do Aira Spa?",
    answer:
      "O Aira Spa atende todos os dias, das 15h às 21h, nas duas unidades de Foz do Iguaçu.",
  },
  {
    question: "Como faço para agendar uma massagem no Aira Spa?",
    answer:
      "Escolha a unidade dentro do hotel de sua preferência e chame pelo WhatsApp: (45) 99133-1717 para a unidade DoubleTree by Hilton e (45) 99103-1666 para a unidade Viale Cataratas.",
  },
  {
    question: "Quais massagens e tratamentos o Aira Spa oferece?",
    answer:
      "Massagem relaxante, massagem candle, escalpes, drenagem linfática, massagem com pedras quentes e tratamento facial.",
  },
  {
    question: "O que acontece quando eu chego para o atendimento?",
    answer:
      "Basta se apresentar na recepção do hotel onde fica a unidade escolhida. A equipe indica o caminho até o spa; depois, é só relaxar e aproveitar o seu momento.",
  },
] as const;
