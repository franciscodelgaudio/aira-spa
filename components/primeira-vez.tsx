"use client";

import { useRef, useState } from "react";
import BgImage from "./bg-image";
import { media } from "@/lib/site";

const cardShell =
  "flex shrink-0 basis-[calc(100vw-40px)] snap-center flex-wrap items-center gap-[clamp(16px,3vw,48px)] rounded-[2px] bg-cream p-[clamp(20px,4vw,64px)] md:basis-[min(78vw,780px)]";
const cardText = "min-w-[200px] flex-1 basis-[240px]";
const cardMedia = "h-[clamp(220px,42vh,420px)] flex-[0_1_200px] overflow-hidden";
const rule = "mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay";
const paragraph =
  "m-0 mt-[clamp(14px,1.8vw,26px)] max-w-[32ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body";

export default function PrimeiraVez() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentCard, setCurrentCard] = useState(0);

  const goToCard = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("article"));
    const nextIndex = Math.max(0, Math.min(cards.length - 1, index));
    const target = cards[nextIndex];
    if (!target) return;

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
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
          className="flex w-full snap-x snap-mandatory gap-[clamp(16px,2.4vw,44px)] overflow-x-auto overscroll-x-contain px-5 pb-4 touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-[clamp(64px,8vw,160px)] md:pb-0"
        >
          <article className={cardShell}>
            <div className={cardText}>
              <div className={rule} />
              <div className="text-[clamp(12px,1.1vw,15px)] font-light uppercase tracking-[0.42em] text-clay">
                Primeira vez no
              </div>
              <h2 className="m-0 mt-2 text-[clamp(30px,4.2vw,62px)] font-extralight leading-[1.05] tracking-[0.06em] text-clay">
                AIRA SPA?
              </h2>
              <p className={paragraph}>
                Criamos uma experiência simples, acolhedora e pensada para você relaxar
                desde a chegada.
              </p>
            </div>
            <div className={cardMedia}>
              <BgImage
                asset={media.card1}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
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
                Recebemos hóspedes, moradores de Foz e visitantes.
              </p>
            </div>
            <div className={cardMedia}>
              <BgImage
                asset={media.card2}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>
          </article>

          <article className={cardShell}>
            <div className={`${cardMedia} order-2`}>
              <BgImage
                asset={media.card3}
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>
            <div className={cardText}>
              <div className={rule} />
              <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
                E QUANDO EU CHEGAR?
              </h2>
              <p className="m-0 mt-[clamp(16px,2vw,28px)] max-w-[34ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body">
                É só se apresentar na recepção do hotel, que você será encaminhado até o
                Aira Spa. Depois, é só relaxar e aproveitar o seu momento.
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
    </section>
  );
}
