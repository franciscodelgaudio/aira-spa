/**
 * Gera a imagem de compartilhamento que o SEO precisa:
 *
 *   public/og.jpg                 1200x630, a previa de link (WhatsApp, Insta, X)
 *
 * Rode depois de trocar a foto de origem:
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

await mkdir(path.join(root, "public"), { recursive: true });

await sharp(SOURCE)
  .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "attention" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .jpeg({ quality: 82, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(out("og.jpg"));

console.log("gerado: og.jpg");
