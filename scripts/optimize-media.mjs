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

  if (name === "hero") {
    // O original foi gravado para redes sociais: 1920x1080 com o conteudo
    // vertical nitido so na faixa central (x 656..1264) e as laterais
    // desfocadas. Dele saem dois videos:
    //   hero-vertical  a faixa central sozinha, para telas em pe
    //   hero           triptico da mesma faixa em 3 paineis, cada um adiantado
    //                  um terco do video, para telas deitadas. Um arquivo so,
    //                  entao continua sendo um download.
    // O corte deixa 4 px de folga de cada lado para nao pegar a borda do blur.
    const crop = "crop=600:1080:660:0,setsar=1";
    const vertical = { name: "hero-vertical", inputs: ["-ss", "1", "-i", src], filter: ["-vf", crop] };

    // Cada painel lateral e o video rotacionado: do offset ate o fim, depois do
    // inicio ate o offset. Emendado assim o loop continua sem salto. Entradas
    // separadas em vez de split+trim para o ffmpeg nao bufferizar segundos de
    // frames crus na memoria.
    const d = 36.37 - 1; // duracao do original menos o 1o segundo pulado
    const off = [Math.round(d / 3), Math.round((2 * d) / 3)];
    const gap = "pad=608:1080:0:0:color=0x1f2b2a"; // 8 px de --ink entre paineis
    const triptych = {
      name: "hero",
      inputs: [
        "-ss", "1", "-i", src,
        "-ss", String(1 + off[0]), "-i", src,
        "-ss", "1", "-t", String(off[0]), "-i", src,
        "-ss", String(1 + off[1]), "-i", src,
        "-ss", "1", "-t", String(off[1]), "-i", src,
      ],
      filter: [
        "-filter_complex",
        [
          `[1:v]${crop}[l1]`, `[2:v]${crop}[l2]`, `[l1][l2]concat=n=2:v=1,${gap}[L]`,
          `[0:v]${crop},${gap}[C]`,
          `[3:v]${crop}[r1]`, `[4:v]${crop}[r2]`, `[r1][r2]concat=n=2:v=1[R]`,
          `[L][C][R]hstack=inputs=3[v]`,
        ].join(";"),
        "-map", "[v]",
      ],
    };

    for (const v of [vertical, triptych]) {
      const webm = path.join(OUT, `${v.name}.webm`);
      const mp4 = path.join(OUT, `${v.name}.mp4`);
      const poster = path.join(POSTERS, `${v.name}.jpg`);
      if (stale(src, webm)) {
        ffmpeg([
          ...v.inputs, "-an", ...v.filter,
          "-c:v", "libvpx-vp9", "-crf", "28", "-b:v", "0",
          "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
          "-pix_fmt", "yuv420p", webm,
        ]);
      }
      if (stale(src, mp4)) {
        ffmpeg([
          ...v.inputs, "-an", ...v.filter,
          "-c:v", "libx264", "-preset", "slow", "-crf", "22",
          "-profile:v", "high", "-level", "4.0", "-pix_fmt", "yuv420p",
          "-g", "60", "-movflags", "+faststart", mp4,
        ]);
      }
      // Primeiro frame do proprio mp4: e exatamente o que o video mostra antes
      // de tocar.
      if (stale(mp4, poster)) {
        ffmpeg(["-i", mp4, "-frames:v", "1", "-q:v", "4", poster]);
      }
      after += statSync(webm).size + statSync(poster).size;
      console.log(
        `${(v.name + ".mp4").padEnd(16)} ${kb(src)} -> webm ${kb(webm)} | mp4 ${kb(mp4)} | poster ${kb(poster)}`
      );
    }
    continue;
  }

  if (ext === ".mp4") {
    const webm = path.join(OUT, `${name}.webm`);
    const mp4 = path.join(OUT, `${name}.mp4`);
    const poster = path.join(POSTERS, `${name}.jpg`);
    const startAt = name === "cha" ? "3" : "0";
    const videoCrfVp9 = name === "cha" ? 28 : VIDEO_CRF_VP9;
    const videoCrfH264 = name === "cha" ? 21 : VIDEO_CRF_H264;
    const videoFilters =
      name === "cha"
        ? ["-vf", "hqdn3d=1.2:1.2:4:4,unsharp=3:3:0.25:3:3:0"]
        : [];
    // Os trechos exp-* tem uma cena so, de 2 a 4 s: em loop o salto de volta ao
    // inicio ficaria visivel. Bumerangue (ida + volta) dobra a duracao e o fim
    // emenda no comeco sem corte. O trim tira o quadro repetido na virada.
    // reverse guarda o trecho inteiro na memoria, por isso so vale para clipes
    // curtos. Nao entra no poster: ele e o primeiro quadro, igual nos dois.
    const encodeFilters = name.startsWith("exp-")
      ? ["-vf", "split[a][b];[b]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[r];[a][r]concat=n=2:v=1:a=0"]
      : videoFilters;

    // Poster = primeiro frame exibido (3 s no cha, 0 nos demais), exatamente o
    // que o video mostra antes de tocar. Serve de
    // primeira pintura e e o que fica na tela quando o autoplay e bloqueado
    // (iOS em Modo de Baixo Consumo, por exemplo). JPEG de proposito: o atributo
    // poster aceita uma URL so, sem <source> de fallback.
    if (stale(src, poster)) {
      ffmpeg([
        "-ss", startAt, "-i", src, ...videoFilters,
        "-frames:v", "1", "-q:v", "4", poster,
      ]);
    }

    // -an: todo video da pagina toca mudo, faixa de audio e byte jogado fora.
    if (stale(src, webm)) {
      ffmpeg([
        "-ss", startAt, "-i", src, "-an", ...encodeFilters,
        "-c:v", "libvpx-vp9", "-crf", String(videoCrfVp9), "-b:v", "0",
        "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
        "-pix_fmt", "yuv420p", webm,
      ]);
    }

    // Fallback para quem nao le VP9. +faststart poe o moov na frente para o
    // player comecar sem baixar o arquivo inteiro.
    if (stale(src, mp4)) {
      ffmpeg([
        "-ss", startAt, "-i", src, "-an", ...encodeFilters,
        "-c:v", "libx264", "-preset", "slow", "-crf", String(videoCrfH264),
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
