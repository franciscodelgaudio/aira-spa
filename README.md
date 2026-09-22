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

## SEO e GEO

O site e uma pagina so, entao tudo que um buscador ou um motor de resposta
(ChatGPT, Perplexity, AI Overviews) sabe sobre o Aira Spa vem deste HTML. Os
dados do negocio moram todos em `lib/site.ts` — nome, enderecos, telefones,
horario, servicos e FAQ. **Mudou horario, telefone, endereco ou servico? Mude
la e so la.** Dai saem, automaticamente:

| saida | de onde vem | o que faz |
| --- | --- | --- |
| `<title>`, description, Open Graph, canonical | `app/layout.tsx` | o que aparece no resultado de busca e na previa de link |
| JSON-LD (`DaySpa` x2, `Organization`, `FAQPage`) | `lib/structured-data.ts` | painel de negocio local e o que a IA le antes do HTML |
| `/robots.txt` | `app/robots.ts` | libera crawlers, inclusive os de IA, e aponta o sitemap |
| `/sitemap.xml` | `app/sitemap.ts` | URL canonica + fotos para o Google Imagens |
| `/manifest.webmanifest` | `app/manifest.ts` | nome e icone ao salvar na tela inicial |
| `/llms.txt` | `public/llms.txt` | ficha do negocio em texto, para motores de resposta |

O `public/llms.txt` e o unico escrito a mao: ao mexer em `lib/site.ts`,
atualize-o junto.

### Domínio

A URL canonica esta em `siteUrl` (`lib/site.ts`), com `https://airaspa.com.br`
como padrao. Para publicar em outro dominio (preview, staging):

```bash
NEXT_PUBLIC_SITE_URL=https://preview.exemplo.com npm run build
```

### Arquivos de marca gerados

`public/og.jpg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` e
`apple-icon.png` sao **gerados** por `scripts/make-brand-assets.mjs` a partir de
`media-original/massagem.jpg` e de `app/icon.svg`. Nao edite a mao:

```bash
node scripts/make-brand-assets.mjs
```

### Cuidados ao editar os componentes

Tres coisas parecem enfeite e nao sao:

- **`hidden` nas descricoes de `experiencias.tsx`.** As seis descricoes ficam no
  HTML, nao so a do item aberto. Trocar por renderizacao condicional
  (`{services[active].description}`) tira cinco das seis do alcance de quem
  indexa — crawler nenhum clica nos botoes.
- **A primeira linha do `<h1>` no hero.** "Seu corpo pede pausa." sozinha nao
  diz o que o negocio faz nem onde fica. A linha de cima e o que conecta a
  pagina a busca por "massagem em Foz do Iguacu".
- **O horario escrito em `local.tsx` e no rodape.** O JSON-LD declara
  `openingHoursSpecification`; o Google descarta dado estruturado que o
  visitante nao consegue conferir na pagina. O mesmo vale para as respostas do
  FAQ, que precisam existir em texto visivel.

### O que falta, fora do codigo

1. **Perfil da Empresa no Google** (Google Business Profile) para as duas
   unidades. Pesa mais que tudo aqui para aparecer no mapa e no "perto de mim".
   O NAP do perfil precisa bater caractere a caractere com o do rodape.
2. **Google Search Console**: cadastrar o dominio e enviar
   `https://airaspa.com.br/sitemap.xml`.
3. **Coordenadas das unidades**: `lib/structured-data.ts` omite `geo` de
   proposito, para nao publicar pino chutado. Pegue latitude/longitude no Google
   Maps (botao direito no ponto certo) e adicione.
4. **Versao em espanhol e ingles**: Foz do Iguacu recebe turista argentino,
   paraguaio e estrangeiro, e hoje o site so existe em portugues. E o maior
   ganho de alcance ainda disponivel — e o unico que exige mudanca de estrutura
   (rotas por idioma + `hreflang`).

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
