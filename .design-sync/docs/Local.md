---
category: Sections
---
# Local

Seção "ONDE ESTAMOS" em fundo `bg-sand`, com largura máxima de 1400px. No topo: filete `bg-clay` e título extralight `text-clay` à esquerda; à direita, o texto das duas unidades e o horário (`text-muted`). Embaixo, um cartão `bg-cream` por unidade, lado a lado no desktop e empilhados no celular. Cada cartão tem a foto do hotel em 4:3, o logotipo do hotel (DoubleTree em azul, Viale pintado de `clay`), o nome e o endereço, uma pílula `bg-clay` de WhatsApp e o botão "Ver mapa", que abre o Google Maps dentro do cartão.

Sem props. Unidades, telefones, horário, fotos e logotipos vêm de `units`, `hours` e `unitHotels` (lib/site.ts). A grade dos cartões tem `id="sec-agendar"`, destino dos botões "Agendar".
