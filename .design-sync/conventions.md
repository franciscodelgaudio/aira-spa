# Aira Spa: como desenhar com este pacote

Site de um spa em Foz do Iguaçu, em português (pt-BR). Tom calmo e editorial: muito respiro, texto leve, poucas cores. Os componentes saem de `window.AiraSpa` e o estilo vem de `styles.css` (Tailwind v4 já compilado + tokens + fontes). Não há provider nem wrapper: os componentes renderizam direto.

## Estilo: classes Tailwind com os tokens da marca

Use classes Tailwind. Elas estão compiladas em `_ds_bundle.css`, que só traz as classes que o site e as prévias já usam. Prefira as combinações abaixo, que existem de fato. Valores arbitrários novos (`text-[37px]`) não vão ter CSS.

| Token | Hex | Classes | Uso |
|---|---|---|---|
| `ink` | #1f2b2a | `bg-ink`, `text-ink`, `from-ink/80` | fundo do Hero e do rodapé, véu sobre foto |
| `clay` | #52706d | `bg-clay`, `text-clay`, `border-clay/25` | títulos em fundo claro, filetes, pílulas |
| `clay-deep` | #3f5c59 | `hover:bg-clay-deep` | hover das pílulas |
| `taupe` | #829b98 | `bg-taupe` | blocos de destaque (Experiências, Agendar) |
| `cream` | #f6f4ee | `bg-cream`, `text-cream`, `text-cream/70`, `border-cream/55` | cartões claros e texto sobre escuro |
| `sand` | #e7eceb | `bg-sand` | fundo de página e de seção |
| `body` | #3d4b49 | `text-body` | parágrafos em fundo claro |
| `muted` | #60706e | `text-muted` | texto secundário |

Os mesmos valores existem como `var(--ink)`, `var(--clay)` etc., para estilos inline (gradientes: `rgba(31,43,42,.6)` é o `ink`).

## Tipografia

- **Jost** é a fonte do `body`, em pesos leves: `font-extralight` nos títulos, `font-light` no texto, `font-normal`/`font-medium` só em rótulos.
- **Cormorant Garamond itálico** entra pela classe `font-accent`, para respostas curtas e assinaturas ("Não", "Recomendamos, sim", nomes de serviço).
- Rótulos e títulos de cartão vão em caixa alta, com tracking largo: `uppercase tracking-[0.42em]` (sobretítulo), `tracking-[0.24em]` (botão), `tracking-[0.16em]` (rótulo).
- Os tamanhos são fluidos com `clamp()`, ex.: `text-[clamp(15px,1.15vw,19px)]` no parágrafo.

## Padrões que se repetem

- **Bloco editorial**: filete `h-px w-[clamp(80px,9vw,140px)] bg-clay`, título extralight `text-clay`, parágrafo `font-light text-body`.
- **Botão-contorno** (sobre escuro): `rounded-full border border-cream/55 px-7 py-4 text-cream hover:bg-cream/15`.
- **Pílula cheia**: `rounded-full bg-clay text-cream hover:bg-clay-deep`.
- **Foto/vídeo**: contêiner `relative overflow-hidden rounded-[2px]` com `BgImage`/`BgVideo` em `absolute inset-0 h-full w-full object-cover`.

## Componentes

- **Seções prontas**, sem props e com o conteúdo de `lib/site.ts`: `Hero`, `Sobre`, `Experiencias`, `PrimeiraVez`, `Local`, `Footer`. Uma página completa é `AgendarFab` + `Hero` + `Sobre` + `Experiencias` + `PrimeiraVez` + `Local` dentro de `<main>`, e depois `Footer`.
- **Peças**: `BgImage`, `BgVideo` (mídia), `Wordmark` (logo creme, só em fundo escuro), `InstagramIcon` e `AgendarFab`.
- **Dados reais** no mesmo global, para compor telas novas sem inventar conteúdo: `media` (fotos e vídeos), `services` (catálogo), `units` (duas unidades, com endereço, telefone e WhatsApp), `hours`, `site`, `instagram` e `fullAddress(unit)`. As mídias vêm de www.airaspa.com.br.

Antes de estilizar, leia `styles.css` e seus imports (`_ds_bundle.css`, `fonts/fonts.css`) e o `.prompt.md` de cada componente.

```jsx
const { BgImage, media, units } = window.AiraSpa;

<section className="bg-sand px-[clamp(24px,6vw,96px)] py-[clamp(56px,8vw,120px)]">
  <div className="flex flex-wrap items-center gap-[clamp(16px,3vw,48px)] rounded-[2px] bg-cream p-[clamp(20px,4vw,64px)]">
    <div className="min-w-[200px] flex-1 basis-[240px]">
      <div className="mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay" />
      <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
        PRECISO AGENDAR?
      </h2>
      <div className="font-accent mt-[clamp(16px,2vw,28px)] text-[clamp(24px,2.6vw,38px)] text-clay">
        Recomendamos, sim
      </div>
      <a href={units[0].whatsapp} className="mt-[clamp(24px,3vw,44px)] inline-flex min-h-12 items-center rounded-full bg-clay px-7 py-4 text-cream hover:bg-clay-deep">
        WhatsApp {units[0].phone}
      </a>
    </div>
    <div className="relative h-[clamp(260px,52vh,540px)] flex-[1_1_220px] overflow-hidden rounded-[2px] md:flex-[0_0_42%]">
      <BgImage asset={media.primeira3} alt="Massagem facial à luz de velas" className="h-full w-full object-cover" />
    </div>
  </div>
</section>
```
