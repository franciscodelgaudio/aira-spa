---
category: Media
---
# BgImage

Foto com `<picture>` AVIF → WebP → JPEG. O `<picture>` é `display: contents`, então o `<img>` se posiciona como filho direto do contêiner. O padrão é um contêiner `relative overflow-hidden` com proporção fixa e a imagem `absolute inset-0 h-full w-full object-cover`. O recorte é ajustado com `style={{ objectPosition }}`.

`asset` vem sempre de `media` (lib/site.ts): `sobre`, `primeira1` a `primeira4`, `local1` (sala), `local2` (chá), `doubletreeRecepcao` e `vialeLobby` (fotos dos hotéis). Não invente caminhos. Os arquivos são servidos por www.airaspa.com.br. `priority` só para a imagem acima da dobra.

```jsx
<div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px]">
  <BgImage
    asset={media.sobre}
    alt="Mulher de roupão na borda da banheira de hidromassagem"
    className="absolute inset-0 h-full w-full object-cover"
    style={{ objectPosition: "50% 30%" }}
  />
</div>
```
