/**
 * Gera os arquivos de marca que o SEO precisa e que nao existem no design:
 *
 *   public/og.jpg                 1200x630, a previa de link (WhatsApp, Insta, X)
 *   public/icon-192.png           icone do manifesto
 *   public/icon-512.png           icone do manifesto e logo do JSON-LD
 *   public/icon-maskable-512.png  icone Android recortado em circulo/squircle
 *   public/apple-icon.png         180x180, tela inicial do iOS
 *
 * Rode depois de trocar a foto de origem ou o app/icon.svg:
 *   node scripts/make-brand-assets.mjs
 *
 * Sao arquivos GERADOS: nao edite a mao, edite a origem e rode de novo.
 *
 * A previa de link pesa mais do que parece: o link do Aira Spa circula colado
 * em conversa de WhatsApp e na bio do Instagram, e sem og:image o cartao sai
 * cinza. O Facebook descarta imagem acima de 8 MB e o WhatsApp, acima de ~600 KB
 * na previa — por isso o JPEG sai em qualidade 82, ~120 KB.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = (file) => path.join(root, "public", file);

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// A foto de origem tem 1350x624: a proporcao ja e quase a do cartao, entao o
// recorte tira das laterais e o redimensionamento e de 1%. Trocar por uma foto
// retrato aqui cortaria cabeca ou pes.
const SOURCE = path.join(root, "media-original", "massagem.jpg");

const CREAM = "#F6F2EA";

/**
 * O texto vai em SVG composto por cima, e nao "queimado" na foto, para trocar a
 * chamada sem reprocessar a imagem. A pilha de fontes termina em sans-serif
 * porque o renderizador do sharp usa as fontes do sistema, que variam por
 * maquina — o layout nao pode depender de uma fonte especifica existir.
 */
const overlay = Buffer.from(`
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#241F1B" stop-opacity="0.30"/>
      <stop offset="45%"  stop-color="#241F1B" stop-opacity="0.42"/>
      <stop offset="100%" stop-color="#241F1B" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#scrim)"/>
  <g fill="${CREAM}" font-family="Jost, Futura, 'Century Gothic', 'Segoe UI', sans-serif" text-anchor="middle">
    <text x="600" y="296" font-size="96" font-weight="300" letter-spacing="34">AIRA</text>
    <text x="600" y="342" font-size="26" font-weight="300" letter-spacing="26" opacity="0.85">SPA</text>
    <line x1="520" y1="392" x2="680" y2="392" stroke="${CREAM}" stroke-opacity="0.5" stroke-width="1"/>
    <text x="600" y="446" font-size="30" font-weight="300" letter-spacing="4">Massagem e spa em Foz do Iguaçu</text>
    <text x="600" y="492" font-size="21" font-weight="300" letter-spacing="2" opacity="0.8">DoubleTree by Hilton · Viale Cataratas</text>
  </g>
</svg>
`);

/** O icone do app, redesenhado por tamanho para a linha nao sumir no 192. */
const iconSvg = ({ size, inset }) => {
  // inset = margem de seguranca. O Android recorta o icone maskable em circulo
  // ou squircle e come ate 20% de cada lado; o "A" precisa caber no miolo.
  const s = (n) => (n / 64) * size * (1 - inset * 2) + size * inset;
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#8A6A4F"/>
  <g fill="none" stroke="#F6F2EA" stroke-width="${(3.4 / 64) * size * (1 - inset * 2)}" stroke-linecap="round">
    <path d="M${s(32)} ${s(15)} L${s(19.5)} ${s(49)}"/>
    <path d="M${s(32)} ${s(15)} L${s(44.5)} ${s(49)}"/>
    <path d="M${s(23.2)} ${s(39)} L${s(40.8)} ${s(39)}"/>
  </g>
</svg>`);
};

const icon = (size, inset, file) =>
  sharp(iconSvg({ size, inset }), { density: 384 }).png().toFile(out(file));

await mkdir(path.join(root, "public"), { recursive: true });

await sharp(SOURCE)
  .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "attention" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(out("og.jpg"));

await Promise.all([
  icon(192, 0, "icon-192.png"),
  icon(512, 0, "icon-512.png"),
  icon(512, 0.18, "icon-maskable-512.png"),
  icon(180, 0, "apple-icon.png"),
]);

console.log("gerado: og.jpg, icon-192, icon-512, icon-maskable-512, apple-icon");
