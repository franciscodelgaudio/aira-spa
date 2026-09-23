"use client";

import { useEffect, useRef, useState } from "react";
import BgImage from "./bg-image";
import BgVideo from "./bg-video";
import { media, units } from "@/lib/site";

const cardShell =
  "flex shrink-0 basis-[calc(100vw-72px)] snap-start flex-wrap items-center gap-[clamp(16px,3vw,48px)] rounded-[2px] bg-cream p-[clamp(20px,4vw,64px)] md:basis-[min(84vw,1000px)] md:snap-center";
const cardText = "min-w-[200px] flex-1 basis-[240px]";
// A midia ocupa ~42% do cartao: com base fixa de 200px ela sumia ao lado do texto.
const cardMedia = "relative h-[clamp(260px,52vh,540px)] flex-[1_1_220px] overflow-hidden rounded-[2px] md:flex-[0_0_42%]";
const rule = "mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay";
const paragraph =
  "m-0 mt-[clamp(14px,1.8vw,26px)] max-w-[32ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body";

export default function PrimeiraVez() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentCard, setCurrentCard] = useState(0);

  // Cada video toca so enquanto o cartao dele esta de fato na tela (o
  // observer ja considera o recorte do carrossel) e pausa ao sair. Com
  // movimento reduzido fica no poster.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const video = target as HTMLVideoElement;
          if (isIntersecting) void video.play().catch(() => undefined);
          else video.pause();
        });
      },
      { threshold: 0.6 }
    );
    track.querySelectorAll("video").forEach((video) => io.observe(video));
    return () => io.disconnect();
  }, []);

  const goToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("article"));
    const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
    const target = cards[nextIndex];
    if (!target) return;

    const scrollPadding = parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft - scrollPadding,
      behavior: "smooth",
    });
    setCurrentCard(nextIndex);
  };

  const syncCurrentCard = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("article"));
    const trackLeft = track.getBoundingClientRect().left;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - trackLeft);
      if (distance < nearestDistance) {
        nearest = index;
        nearestDistance = distance;
      }
    });

    setCurrentCard(nearest);
  };

  return (
    <section
      id="sec-primeira"
      className="relative bg-sand py-[clamp(56px,8vw,120px)]"
    >
      <div className="relative flex items-center overflow-hidden">
        <div
          ref={trackRef}
          aria-label="Informações para a primeira visita ao Aira Spa"
          onScroll={syncCurrentCard}
          className="flex w-full snap-x snap-mandatory gap-[clamp(16px,2.4vw,44px)] overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-4 md:scroll-px-0 touch-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[clamp(64px,8vw,160px)] md:pb-0"
        >
          <article className={cardShell}>
            <div className={cardText}>
              <div className={rule} />
              {/*
                O rotulo e o nome eram duas caixas soltas: o titulo da secao,
                lido isolado, era so "AIRA SPA?". Juntos em um <h2> viram a
                pergunta inteira, que e como ela aparece num resultado de busca.
              */}
              <h2 className="m-0 text-clay">
                <span className="block text-[clamp(12px,1.1vw,15px)] font-light uppercase tracking-[0.42em]">
                  Primeira vez no
                </span>
                <span className="mt-2 block text-[clamp(30px,4.2vw,62px)] font-extralight leading-[1.05] tracking-[0.06em]">
                  AIRA SPA?
                </span>
              </h2>
              <p className={paragraph}>
                Criamos uma experiência simples, acolhedora e pensada para você relaxar
                desde a chegada.
              </p>
            </div>
            <div className={cardMedia}>
              <BgVideo
                asset={media.card1Video}
                aria-label="Cliente de roupão e chinelos chegando à sala do Aira Spa, em Foz do Iguaçu"
                className="h-full w-full object-cover"
              />
            </div>
          </article>

          <article className={cardShell}>
            <div className={cardText}>
              <div className={rule} />
              <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
                PRECISO ESTAR HOSPEDADO?
              </h2>
              <div className="font-accent mt-[clamp(16px,2vw,28px)] text-[clamp(24px,2.6vw,38px)] text-clay">
                Não
              </div>
              <p className="m-0 mt-1.5 max-w-[32ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body">
                Não é necessário se hospedar. As unidades do Aira Spa ficam dentro dos
                hotéis DoubleTree by Hilton e Viale Cataratas, mas atendem hóspedes,
                moradores de Foz do Iguaçu e visitantes.
              </p>
            </div>
            <div className={cardMedia}>
              <BgImage
                asset={media.card2}
                alt="Hidromassagem do Aira Spa dentro do hotel, em Foz do Iguaçu"
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
              {/*
                A foto sozinha nao responde a pergunta do cartao; os dois hoteis
                por cima dela, sim.
              */}
              <ul className="absolute inset-x-0 bottom-0 m-0 flex list-none flex-col gap-2 bg-gradient-to-t from-ink/80 via-ink/50 to-transparent p-3 pt-12 text-cream">
                {units.map((unit) => (
                  <li key={unit.slug} className="leading-tight">
                    <span className="block text-[13px] font-normal">{unit.name.replace("Unidade ", "")}</span>
                    <span className="block text-[11px] font-light opacity-85">{unit.address}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <article className={cardShell}>
            <div className={`${cardMedia} order-2`}>
              <BgVideo
                asset={media.card3Video}
                aria-label="Elevador e corredor do DoubleTree by Hilton, no caminho até o Aira Spa"
                className="h-full w-full object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-normal uppercase tracking-[0.14em] text-clay">
                Unidade DoubleTree
              </span>
            </div>
            <div className={cardText}>
              <div className={rule} />
              <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
                E QUANDO EU CHEGAR?
              </h2>
              <p className="m-0 mt-[clamp(16px,2vw,28px)] max-w-[34ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body">
                É só se apresentar na recepção do hotel onde fica a unidade do Aira Spa
                escolhida. A equipe indicará o caminho; depois, é só relaxar e aproveitar
                o seu momento.
              </p>
            </div>
          </article>
        </div>

        <button
          type="button"
          aria-label="Ver cartão anterior"
          disabled={currentCard === 0}
          onClick={() => goToCard(currentCard - 1)}
          className="absolute left-3 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-clay/25 bg-cream/95 text-clay shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-30 md:flex"
        >
          <span aria-hidden="true" className="text-2xl leading-none">←</span>
        </button>
        <button
          type="button"
          aria-label="Ver próximo cartão"
          disabled={currentCard === 2}
          onClick={() => goToCard(currentCard + 1)}
          className="absolute right-3 top-1/2 z-10 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-clay/25 bg-cream/95 text-clay shadow-lg transition hover:bg-white disabled:pointer-events-none disabled:opacity-30 md:flex"
        >
          <span aria-hidden="true" className="text-2xl leading-none">→</span>
        </button>
      </div>

      {/*
        No celular as setas ficam escondidas; sem estes pontos o primeiro
        cartao parecia ser o conteudo inteiro da secao.
      */}
      <div className="mt-5 flex items-center justify-center gap-2 md:mt-8">
        {[0, 1, 2].map((index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ver cartão ${index + 1} de 3`}
            aria-current={currentCard === index}
            onClick={() => goToCard(index)}
            className="flex h-6 items-center px-1"
          >
            <span
              aria-hidden="true"
              className={`block h-1.5 rounded-full bg-clay transition-all ${
                currentCard === index ? "w-6 opacity-100" : "w-1.5 opacity-35"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
