# design-sync: notas do Aira Spa

Projeto no Claude Design: https://claude.ai/design/p/e4a7d9c3-d188-4290-837d-525cd1661723

## Como este repo vira um pacote

- Isto é um site Next.js (export estático), não uma biblioteca: não há `dist/` nem `.d.ts`. O entry é `.design-sync/entry.ts`, que reexporta os `export default` de `components/` como exports nomeados (`window.AiraSpa.Hero`, etc.) e também os dados de `lib/site.ts` (`media`, `services`, `units`, `hours`, `site`, `instagram`, `agency`, `fullAddress`, `assetBase`).
- Sempre passe `--entry .design-sync/entry.ts` para `package-build.mjs` / `resync.mjs`, com `--node-modules ./node_modules` (raiz).
- `cfg.srcDir: "components"` é obrigatório: sem ele a heurística pega `lib/`, que só tem `.ts`.
- A lista de componentes vem de `componentSrcMap` (não há `.d.ts` para descobrir). Um componente novo em `components/` precisa entrar em `entry.ts` **e** em `componentSrcMap`, além de ganhar doc em `docs/` e prévia em `previews/`.
- `AutoplayUnlock` é exportado no bundle, mas fica fora de `componentSrcMap` (não renderiza nada). `JsonLd` não é exportado.
- Os props são escritos à mão em `dtsPropsFor`, porque não há `.d.ts`. Se mudar a assinatura de `BgImage`, `BgVideo` ou `InstagramIcon`, atualize lá.

## CSS e fontes

- `buildCmd` (`node .design-sync/build-css.mjs`) compila `.design-sync/ds.css` (que importa `app/globals.css`) com o `@tailwindcss/postcss` do site, gerando `.design-sync/.cache/ds.css` (o `cssEntry`). **Rode antes de todo build**: as classes das prévias só entram no CSS se ele for recompilado depois de editá-las.
- A detecção automática do Tailwind parte da raiz e respeita o `.gitignore`, então pega `components/`, `app/` e `.design-sync/previews/`.
- No site, `next/font/google` define `--font-jost` / `--font-cormorant` numa classe do `<html>`. No pacote, `ds.css` as define em `:root`, e `fonts/fonts.css` traz os woff2: Jost variável 200–500 e Cormorant Garamond itálico variável 300–400, subconjuntos latin e latin-ext, copiados de `out/_next/static/media` (OFL).

## Mídia e process.env

- `lib/site.ts` monta as URLs das mídias com `assetBase` (`NEXT_PUBLIC_ASSET_BASE`, vazio no site). `.design-sync/shim.ts` cria `globalThis.process.env` (que não existe fora do Next) e aponta `NEXT_PUBLIC_ASSET_BASE` para `https://www.airaspa.com.br`: fotos, vídeos e logo carregam do site publicado.
- `Wordmark` usa `<img>` em vez de `next/image` (com `images.unoptimized` o resultado era o mesmo, e `next/image` não roda fora do Next).

## Prévias

- As seções (`Hero`, `Sobre`, `Experiencias`, `PrimeiraVez`, `Local`, `Footer`) usam `cardMode: single` com viewport desktop. Elas usam `vh`/`h-screen`, então a altura depende do viewport.
- `AgendarFab` é `position: fixed`. A prévia usa uma caixa com `transform` (vira o bloco de referência) e um `#sec-hero` fora da tela para mostrar a pílula "Agendar". `cardMode: single`, `primaryStory: DepoisDoHero`.
- `BgImage` e `BgVideo` usam `cardMode: column` (as prévias são mais largas que a célula da grade).
- `package-capture.mjs` é lento aqui: cada prévia com vídeo espera o `networkidle` estourar (20s), porque o vídeo continua baixando. É esperado (a rodada completa leva uns 2 min).
- **A captura trava para sempre** se a prévia tiver `<img loading="lazy">` fora da tela: o `settle()` espera `img.decode()`, que nunca resolve para imagem que não carrega. Aconteceu com `PrimeiraVez` (cartões do carrossel) e com `Sobre` (foto abaixo da dobra). As prévias delas envolvem a seção num `Eager` que troca as fotos para `loading="eager"`. Seção nova com foto lazy fora da tela precisa do mesmo. Rode a captura com `timeout 500 node .ds-sync/package-capture.mjs ...` para um travamento não passar despercebido.
- O `Local` em 1280x900 mostra só o bloco "Onde estamos"; o bloco "Agendar" começa abaixo da dobra. Aceito: o cartão rola no Claude Design.
- Nas checagens: `tsc` ignora `.design-sync/` (pasta com ponto) e `eslint.config.mjs` ignora `.ds-sync/`, `ds-bundle/` e `.design-sync/.cache/`. `npm run build` e `npm run lint` continuam limpos.

## Known render warns

- Nenhum. A validação final sai sem avisos.

## Re-sync (comandos)

```sh
cp -r <skill>/package-build.mjs <skill>/package-validate.mjs <skill>/package-capture.mjs <skill>/resync.mjs <skill>/lib <skill>/storybook .ds-sync/
(cd .ds-sync && npm i esbuild ts-morph @types/react playwright@1.63.0)   # clone novo
node .design-sync/build-css.mjs
node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules \
  --entry .design-sync/entry.ts --out ./ds-bundle --remote .design-sync/.cache/remote-sync.json
```

## Re-sync risks

- **Mídia remota**: as prévias e os designs dependem de www.airaspa.com.br no ar e com os mesmos nomes em `/uploads/`. Se o domínio mudar, ajuste `shim.ts`. Se os arquivos forem renomeados, `lib/site.ts` já muda junto, mas o site precisa estar publicado.
- **Fontes copiadas do build**: se `app/layout.tsx` mudar pesos ou famílias, refaça `fonts/` a partir de um `npm run build` novo (os nomes em `out/_next/static/media` mudam a cada build).
- **Props à mão**: `dtsPropsFor` não acompanha o código sozinho.
- **Lista de componentes à mão**: `entry.ts` + `componentSrcMap` + `docs/` + `previews/`.
- Feito com Next 16.3.5, Tailwind 4.3.3 e playwright 1.63.0 instalado em `.ds-sync/` (casa com o chromium-1243 em cache em `%LOCALAPPDATA%\ms-playwright`).
