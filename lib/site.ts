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
  // Trechos do video da producao no DoubleTree (airaspa.foz/2026-08-21_15-26-15_UTC.mp4),
  // o unico sem legenda gravada: da para usar o quadro 9:16 inteiro. Cada um e
  // uma cena, cortada nos pontos de troca de plano.
  relaxanteVideo: video("exp-relaxante"), // 12,30–15,55 s
  drenagemVideo: video("exp-drenagem"), // 22,97–26,45 s
  pedrasVideo: video("exp-pedras"), // 15,63–19,90 s
  facialVideo: video("exp-facial"), // 6,90–9,03 s
  // Unico video com vela acesa, mas legendado do comeco ao fim; por isso segue
  // recortado na faixa acima da legenda (720x570).
  candleVideo: video("cha"),
  // Massagem nos pes; nao ha gravacao da bacia do escalda-pes.
  escaldaPesVideo: video("pes"),
  ambienteVideo: video("hidro"),
  facial: image("facial", 1820, 1666),
  // Cortados sem legenda gravada. chegada-momento vem da producao no DoubleTree
  // (media-fonte/2026-08-21_15-26-15_UTC.mp4, 0–4,63 s: chinelos e a sala).
  // chegada-caminho vem do reels da unidade (2026-08-12_18-58-38_UTC.mp4,
  // 4,75–9,63 s: elevador e corredor); antes e depois disso ha texto na tela.
  // Luz baixa e tons de pele e parede: e a unica foto clara o bastante para
  // ficar em fundo creme sem pesar.
  sobre: image("corpo", 1080, 610),
  card1Video: video("chegada-momento"),
  card2: image("hidro", 519, 649),
  card3Video: video("chegada-caminho"),
  local1: image("sala", 1086, 1358),
  local2: image("cha", 1088, 1344),
} as const;

export type Service = {
  name: string;
  /** Um item por paragrafo. */
  description: string[];
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
    name: "Massagens Relaxantes",
    description: [
      "Duas formas de viver o relaxamento, de acordo com a intensidade que você prefere. A Relaxante Clássica combina movimentos fluidos e ritmados, com um toque firme, intencional e envolvente. Já a Relaxante Profunda utiliza movimentos mais profundos e maior pressão, ideal para quem prefere um toque mais intenso.",
      "Ambas preservam a essência do cuidado Aira: presença, acolhimento e bem-estar.",
    ],
    alt: "Massagem relaxante nas costas durante um atendimento no Aira Spa",
    video: true,
    asset: media.relaxanteVideo,
    position: "50% 50%",
  },
  {
    name: "Massagem Candle",
    description: [
      "Uma experiência sensorial envolvente que combina o calor suave das velas com movimentos relaxantes e aromas acolhedores, proporcionando conforto, hidratação profunda e intenso relaxamento.",
    ],
    alt: "Vela cosmética e chá servidos na sala de massagem candle do Aira Spa",
    video: true,
    asset: media.candleVideo,
    position: "50% 10%",
  },
  {
    name: "Massagem Pedras Quentes",
    description: [
      "O calor das pedras aquecidas combinado a movimentos fluidos e contínuos promove relaxamento profundo, alívio das tensões e uma intensa sensação de conforto e bem-estar.",
    ],
    alt: "Pedras quentes sendo posicionadas sobre as costas em um atendimento no Aira Spa",
    video: true,
    asset: media.pedrasVideo,
    position: "50% 50%",
  },
  {
    name: "Drenagem Linfática",
    description: [
      "Uma experiência de cuidado e bem-estar, indicada para auxiliar na retenção de líquidos, sensação de inchaço e pernas cansadas após viagens e longos passeios. Com movimentos lentos e delicados, a drenagem linfática promove alívio de edemas e uma agradável sensação de leveza corporal.",
    ],
    alt: "Drenagem linfática com movimentos leves e ritmados no Aira Spa",
    video: true,
    asset: media.drenagemVideo,
    position: "50% 50%",
  },
  {
    name: "Escalda-pés",
    description: [
      "Um momento de cuidado que começa pelos pés e se reflete no corpo inteiro. Um cuidado completo para pés que também merecem descansar. A experiência começa com a imersão em água morna e sais relaxantes, seguida de esfoliação e hidratação. Para finalizar, uma massagem relaxante com movimentos de reflexologia, proporcionando uma agradável sensação de conforto, leveza e bem-estar.",
    ],
    alt: "Massagem nos pés durante um atendimento de escalda-pés no Aira Spa",
    video: true,
    asset: media.escaldaPesVideo,
    position: "50% 50%",
  },
  {
    name: "Facial",
    description: [
      "Um delicado ritual de cuidado facial com máscara hidratante e drenagem facial suave e cadenciada, ajudando a aliviar tensões e diminuir os níveis de estresse. A experiência proporciona toque macio, hidratação e luminosidade natural à pele, enquanto movimentos relaxantes nos braços, colo, pescoço e couro cabeludo completam esse momento de bem-estar.",
    ],
    alt: "Aplicação de máscara com pincel durante um tratamento facial no Aira Spa",
    video: true,
    asset: media.facialVideo,
    position: "50% 50%",
  },
  {
    name: "Hidro Relax",
    description: [
      "Um momento de relaxamento e bem-estar através da hidromassagem preparada com aromas suaves e sais relaxantes. Ideal para compartilhar entre amigos momentos de descanso e tranquilidade.",
    ],
    alt: "Banheiras de hidromassagem na sala do Aira Spa",
    video: true,
    asset: media.ambienteVideo,
    position: "50% 50%",
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
      "Massagens relaxantes (clássica e profunda), massagem candle, massagem com pedras quentes, drenagem linfática, escalda-pés, tratamento facial e Hidro Relax, a hidromassagem com aromas e sais.",
  },
  {
    question: "O que acontece quando eu chego para o atendimento?",
    answer:
      "Basta se apresentar na recepção do hotel onde fica a unidade escolhida. A equipe indica o caminho até o spa; depois, é só relaxar e aproveitar o seu momento.",
  },
] as const;
