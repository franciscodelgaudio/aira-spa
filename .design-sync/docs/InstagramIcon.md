---
category: Brand
---
# InstagramIcon

Ícone do Instagram em SVG de traço fino (1.4). Herda a cor do texto (`currentColor`) e o tamanho vem só da classe. Sem a classe de tamanho o SVG não tem dimensão.

Tamanhos usados no site: `h-[22px] w-[22px]` no botão flutuante e `h-[18px] w-[18px]` no rodapé, ao lado do `@airaspa.foz`.

```jsx
<a href={instagram.url} className="inline-flex items-center gap-2 text-cream">
  <InstagramIcon className="h-[18px] w-[18px]" />
  {instagram.handle}
</a>
```
