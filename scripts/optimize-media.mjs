// Gera os assets de public/uploads/ a partir dos originais em media-original/.
//
//   node scripts/optimize-media.mjs            # so o que estiver faltando/desatualizado
//   node scripts/optimize-media.mjs --force    # regera tudo
//
// Precisa de ffmpeg no PATH, ou de FFMPEG_PATH apontando para o binario.
// Sem ffmpeg instalado: npm i -D ffmpeg-static e rode com
//   FFMPEG_PATH=$(node -p "require('ffmpeg-static')") node scripts/optimize-media.mjs
//
// Saida por video: .webm (VP9), .mp4 (H.264 fallback) e posters/<nome>.jpg
// Saida por imagem: .avif, .webp e .jpg reotimizado
//
// Os CRFs abaixo foram calibrados contra os originais medindo SSIM (>= 0.98,
// ou seja, sem diferenca visivel). Subir o CRF encolhe mais e degrada mais.
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "media-original");
const OUT = path.join(root, "public", "uploads");
const POSTERS = path.join(OUT, "posters");

const FFMPEG = process.env.FFMPEG_PATH || "ffmpeg";
const FORCE = process.argv.includes("--force");

const VIDEO_CRF_VP9 = 34; // SSIM ~0.988 vs original
const VIDEO_CRF_H264 = 27;
const IMAGE_CRF_AVIF = 30; // SSIM ~0.983 vs original
const IMAGE_Q_WEBP = 80;

const ffmpeg = (args) =>
  execFileSync(FFMPEG, ["-y", "-v", "error", ...args], { stdio: ["ignore", "pipe", "pipe"] });

// Regera so se a saida nao existe ou e mais velha que a entrada.
const stale = (src, out) =>
  FORCE || !existsSync(out) || statSync(out).mtimeMs < statSync(src).mtimeMs;

const kb = (p) => (statSync(p).size / 1024).toFixed(0).padStart(5) + " KB";

mkdirSync(OUT, { recursive: true });
mkdirSync(POSTERS, { recursive: true });

const files = readdirSync(SRC).sort();
let before = 0;
let after = 0;

for (const file of files) {
  const src = path.join(SRC, file);
  const name = file.replace(/\.[^.]+$/, "");
  const ext = path.extname(file).toLowerCase();
  before += statSync(src).size;

  if (ext === ".mp4") {
    const webm = path.join(OUT, `${name}.webm`);
    const mp4 = path.join(OUT, `${name}.mp4`);
    const poster = path.join(POSTERS, `${name}.jpg`);

    // Poster = frame 0, exatamente o que o video mostra antes de tocar. Serve de
    // primeira pintura e e o que fica na tela quando o autoplay e bloqueado
    // (iOS em Modo de Baixo Consumo, por exemplo). JPEG de proposito: o atributo
    // poster aceita uma URL so, sem <source> de fallback.
    if (stale(src, poster)) {
      ffmpeg(["-ss", "0", "-i", src, "-frames:v", "1", "-q:v", "4", poster]);
    }

    // -an: todo video da pagina toca mudo, faixa de audio e byte jogado fora.
    if (stale(src, webm)) {
      ffmpeg([
        "-i", src, "-an",
        "-c:v", "libvpx-vp9", "-crf", String(VIDEO_CRF_VP9), "-b:v", "0",
        "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
        "-pix_fmt", "yuv420p", webm,
      ]);
    }

    // Fallback para quem nao le VP9. +faststart poe o moov na frente para o
    // player comecar sem baixar o arquivo inteiro.
    if (stale(src, mp4)) {
      ffmpeg([
        "-i", src, "-an",
        "-c:v", "libx264", "-preset", "slow", "-crf", String(VIDEO_CRF_H264),
        "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
        "-g", "60", "-movflags", "+faststart", mp4,
      ]);
    }

    after += statSync(webm).size + statSync(poster).size;
    console.log(
      `${file.padEnd(16)} ${kb(src)} -> webm ${kb(webm)} | mp4 ${kb(mp4)} | poster ${kb(poster)}`
    );
    continue;
  }

  if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
    const avif = path.join(OUT, `${name}.avif`);
    const webp = path.join(OUT, `${name}.webp`);
    const jpg = path.join(OUT, `${name}.jpg`);

    if (stale(src, avif)) {
      ffmpeg([
        "-i", src, "-c:v", "libaom-av1", "-crf", String(IMAGE_CRF_AVIF),
        "-cpu-used", "6", "-still-picture", "1", "-pix_fmt", "yuv420p", avif,
      ]);
    }
    if (stale(src, webp)) {
      ffmpeg(["-i", src, "-c:v", "libwebp", "-quality", String(IMAGE_Q_WEBP), webp]);
    }
    if (stale(src, jpg)) {
      ffmpeg(["-i", src, "-q:v", "5", jpg]);
    }

    after += statSync(avif).size;
    console.log(
      `${file.padEnd(16)} ${kb(src)} -> avif ${kb(avif)} | webp ${kb(webp)} | jpg ${kb(jpg)}`
    );
    continue;
  }

  console.log(`${file.padEnd(16)} ignorado`);
}

const mb = (b) => (b / 1048576).toFixed(2);
console.log(
  `\ntotal no caminho preferido (webm + avif + posters): ${mb(before)} MB -> ${mb(after)} MB`
);
