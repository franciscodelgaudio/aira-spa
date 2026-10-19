---
category: Sections
---
# Local

Seção "ONDE ESTAMOS" em fundo `bg-sand`, com largura máxima de 1400px. No topo, numa coluna só: filete `bg-clay`, título extralight `text-clay` e, embaixo, o texto das duas unidades (`max-w-[72ch]`, em duas linhas no desktop) e o horário (`text-muted`). Não tem padding em cima: o respiro vem do fim da seção anterior, de mesmo fundo. Embaixo, um cartão `bg-cream` por unidade, lado a lado no desktop e empilhados no celular. Cada cartão tem a foto do hotel em 4:3, o logotipo do hotel (DoubleTree em azul, Viale pintado de `clay`), o nome e o endereço, uma pílula `bg-clay` de WhatsApp e o botão "Ver mapa", que abre o Google Maps dentro do cartão.

Sem props. Unidades, telefones, horário, fotos e logotipos vêm de `units`, `hours` e `unitHotels` (lib/site.ts). A grade dos cartões tem `id="sec-agendar"`, destino dos botões "Agendar".
