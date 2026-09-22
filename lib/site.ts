export const units = [
  {
    name: "Unidade DoubleTree by Hilton",
    location: "Dentro do hotel DoubleTree by Hilton",
    address: "Av. das Cataratas, 2930",
    phone: "(45) 99133-1717",
    whatsapp: "https://wa.me/5545991331717",
  },
  {
    name: "Unidade Viale Cataratas",
    location: "Dentro do hotel Viale Cataratas",
    address: "Av. das Cataratas, 2420",
    phone: "(45) 99103-1666",
    whatsapp: "https://wa.me/5545991031666",
  },
] as const;

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
  massagemVideo: video("costas"),
  candleVideo: video("cha"),
  escalpesVideo: video("pes"),
  ambienteVideo: video("hidro"),
  salaVideo: video("sala-spa"),
  facial: image("facial", 1820, 1666),
  card1: image("chegada", 720, 1280),
  card2: image("hidro", 519, 649),
  card3: image("banho", 720, 1280),
  local1: image("sala", 1086, 1358),
  local2: image("cha", 1088, 1344),
} as const;
