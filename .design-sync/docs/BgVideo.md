---
category: Media
---
# BgVideo

Vídeo de fundo mudo, em loop e `playsInline`, com WebM → MP4 e poster: nunca fica tela preta. Não toca sozinho. Passe `autoPlay` (acima da dobra) ou dê `play()` quando entrar na tela. Com `portrait`, telas em pé recebem a versão vertical.

`asset` vem de `media` (lib/site.ts): `heroVideo` + `heroVerticalVideo`, `relaxanteVideo`, `candleVideo`, `pedrasVideo`, `drenagemVideo`, `facialVideo`, `hidroVideo` e `escaldaPesVideo`. Os vídeos de serviço foram gravados em pé (9:16). Use em caixas verticais ou com `object-cover`. Ponha um véu escuro por cima (gradiente `rgba(31,43,42,…)`, o `ink`) quando houver texto.

```jsx
<div className="relative aspect-[9/16] w-[320px] overflow-hidden">
  <BgVideo
    asset={media.escaldaPesVideo}
    autoPlay
    aria-label="Escalda-pés com água morna e sais"
    className="absolute inset-0 h-full w-full object-cover"
  />
</div>
```
