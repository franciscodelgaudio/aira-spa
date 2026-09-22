/**
 * Gera a imagem de compartilhamento que o SEO precisa:
 *
 *   public/og.jpg                 1200x630, a previa de link (WhatsApp, Insta, X)
 *
 * Rode depois de trocar a foto de origem ou o logotipo:
 *   node scripts/make-brand-assets.mjs
 *
 * E um arquivo GERADO: nao edite a mao, edite a origem e rode de novo.
 *
 * A previa de link pesa mais do que parece: o link do Aira Spa circula colado
 * em conversa de WhatsApp e na bio do Instagram, e sem og:image o cartao sai
 * cinza. O Facebook descarta imagem acima de 8 MB e o WhatsApp, acima de ~600 KB
 * na previa — por isso o JPEG sai em qualidade 82, ~120 KB.
 *
 * O cartao e o unico pedaco do site que a pessoa ve ANTES de clicar. Se ele
 * mostra uma foto que nao existe na pagina, a chegada desmente a promessa — por
 * isso a origem aqui e obrigatoriamente uma foto que a pagina renderiza, e as
 * cores sao as mesmas de app/globals.css. Ao trocar a paleta la, troque aqui.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = (file) => path.join(root, "public", file);

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

/**
 * A mesma sala que a secao "Local" mostra (media.local1, 1086x1358). E foto
 * retrato: o recorte "centre" pega a faixa do meio, onde estao as duas macas,
 * os espelhos de palha e o lampiao — o enquadramento que se le como spa na
 * miniatura do WhatsApp. Trocar por um retrato mais fechado (rosto, maos) faz
 * o corte comer a cabeca ou os pes.
 */
const SOURCE = path.join(root, "media-original", "sala.jpg");

/** Arquivo oficial da marca: cream sobre o verde --brand, sem canal alfa. */
const LOGO = path.join(root, "public", "LOGOTIPO.png");

// Espelham app/globals.css. Duas paletas divergindo e como o cartao acaba
// marrom enquanto o site ja e verde.
const CREAM = "#f6f4ee"; // --cream
const INK = "#1f2b2a"; // --ink

/**
 * O wordmark sai do proprio LOGOTIPO.png, e nao de <text> em SVG, porque o
 * renderizador do sharp usa as fontes do sistema: sem Jost instalada (o caso da
 * maioria das maquinas, inclusive a de quem gera este arquivo) o "AIRA" saia em
 * Segoe UI, com desenho de letra diferente do logotipo que a pagina exibe.
 *
 * O PNG nao tem alfa — e cream chapado sobre o verde da marca. Entao o alfa e
 * reconstruido pela luminancia: fundo vira transparente, letra vira opaca.
 */
async function wordmark(width) {
  const { data, info } = await sharp(LOGO).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels } = info;
  const lumAt = (i) => 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

  // O canto e fundo puro; a margem de 24 evita tratar o antialias como letra.
  const floor = lumAt(0) + 24;
  const ceil = 246;

  // Caixa das letras, medida em vez de fixada: o logotipo tem folga em volta, e
  // centralizar o arquivo inteiro deixaria o wordmark visivelmente alto.
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (lumAt((y * w + x) * channels) <= floor) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const pad = 16;
  const box = {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(w, maxX + pad) - Math.max(0, minX - pad) + 1,
    height: Math.min(h, maxY + pad) - Math.max(0, minY - pad) + 1,
  };

  const rgba = Buffer.alloc(box.width * box.height * 4);
  const cut = await sharp(LOGO).extract(box).raw().toBuffer();
  for (let i = 0, j = 0; i < cut.length; i += channels, j += 4) {
    const lum = 0.299 * cut[i] + 0.587 * cut[i + 1] + 0.114 * cut[i + 2];
    const alpha = Math.min(1, Math.max(0, (lum - floor) / (ceil - floor)));
    rgba[j] = 0xf6;
    rgba[j + 1] = 0xf4;
    rgba[j + 2] = 0xee;
    rgba[j + 3] = Math.round(alpha * 255);
  }

  const image = await sharp(rgba, {
    raw: { width: box.width, height: box.height, channels: 4 },
  })
    .resize({ width })
    .png()
    .toBuffer();

  return { image, height: Math.round((width * box.height) / box.width) };
}

const MARK_WIDTH = 360;
const MARK_TOP = 196;
const mark = await wordmark(MARK_WIDTH);
const markBottom = MARK_TOP + mark.height;

/**
 * O scrim escurece a foto o suficiente para o cream passar em contraste sem
 * apagar a sala. Mais forte embaixo, onde ficam as duas linhas de texto.
 */
const scrim = Buffer.from(`
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${INK}" stop-opacity="0.34"/>
      <stop offset="45%"  stop-color="${INK}" stop-opacity="0.46"/>
      <stop offset="100%" stop-color="${INK}" stop-opacity="0.74"/>
    </linearGradient>
  </defs>
  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#scrim)"/>
</svg>
`);

/**
 * As duas linhas de apoio continuam em SVG para trocar a chamada sem
 * reprocessar a foto. A pilha de fontes termina em sans-serif porque o
 * renderizador usa as fontes do sistema, que variam por maquina — nenhuma
 * dessas linhas pode depender de uma fonte especifica existir. O wordmark, que
 * e o que precisa bater com a marca, nao passa por aqui.
 */
const caption = Buffer.from(`
<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <g fill="${CREAM}" font-family="Jost, Futura, 'Century Gothic', 'Segoe UI', sans-serif" text-anchor="middle">
    <line x1="530" y1="${markBottom + 40}" x2="670" y2="${markBottom + 40}" stroke="${CREAM}" stroke-opacity="0.45" stroke-width="1"/>
    <text x="600" y="${markBottom + 92}" font-size="30" font-weight="300" letter-spacing="4">Massagem e spa em Foz do Iguaçu</text>
    <text x="600" y="${markBottom + 136}" font-size="21" font-weight="300" letter-spacing="2" opacity="0.82">DoubleTree by Hilton · Viale Cataratas</text>
  </g>
</svg>
`);

await mkdir(path.join(root, "public"), { recursive: true });

await sharp(SOURCE)
  .resize(OG_WIDTH, OG_HEIGHT, { fit: "cover", position: "centre" })
  .composite([
    { input: scrim, top: 0, left: 0 },
    { input: mark.image, top: MARK_TOP, left: Math.round((OG_WIDTH - MARK_WIDTH) / 2) },
    { input: caption, top: 0, left: 0 },
  ])
  .jpeg({ quality: 82, chromaSubsampling: "4:4:4", mozjpeg: true })
  .toFile(out("og.jpg"));

console.log("gerado: og.jpg");
