This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Mídia

Os arquivos em `public/uploads/` são **gerados** — não edite nem substitua
manualmente. A fonte é `media-original/`, e o pipeline é:

```bash
# com ffmpeg no PATH
node scripts/optimize-media.mjs

# sem ffmpeg instalado
npm i -D ffmpeg-static
FFMPEG_PATH=$(node -p "require('ffmpeg-static')") node scripts/optimize-media.mjs
```

Para trocar uma foto ou um vídeo: coloque o arquivo novo em `media-original/`
com o mesmo nome e rode o script. Ele só reprocessa o que está desatualizado
(use `--force` para refazer tudo).

Cada vídeo vira três arquivos e cada imagem, três formatos:

| entrada | saída | por quê |
| --- | --- | --- |
| `x.mp4` | `x.webm` (VP9) | caminho preferido, ~45% menor que o H.264 |
| | `x.mp4` (H.264) | fallback de quem não lê VP9 |
| | `posters/x.jpg` | primeira pintura e tela de autoplay bloqueado |
| `x.jpg` | `x.avif` | caminho preferido, ~⅕ do JPEG original |
| | `x.webp` | fallback intermediário |
| | `x.jpg` | fallback final |

Os CRFs em `scripts/optimize-media.mjs` foram calibrados medindo SSIM contra os
originais (≥ 0,98, ou seja, sem diferença visível). Subir o CRF encolhe mais e
degrada mais.

### Como usar nos componentes

Nunca escreva `<img>` ou `<video>` direto — use `components/bg-image.tsx` e
`components/bg-video.tsx`, que montam o `<picture>`/`<source>` com os fallbacks,
o poster e os atributos de prioridade. Os assets ficam declarados em
`lib/site.ts`.

O download e o play dos vídeos são coordenados por `lib/media-loader.ts`: fila
com no máximo 2 downloads simultâneos ordenada pela distância até a viewport,
retry com backoff exponencial e cache-bust, e watchdog de travamento. Vídeo que
esgota as tentativas fica no poster em vez de deixar a tela preta.

### Cache no servidor

O deploy é estático (`output: "export"`) e os nomes em `public/uploads/` **não**
têm hash de conteúdo. Não sirva esses arquivos com `Cache-Control: immutable` —
uma troca de mídia não chegaria aos visitantes antigos. Algo como
`public, max-age=86400, stale-while-revalidate=604800` é o adequado.
