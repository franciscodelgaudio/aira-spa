"use client";

import { useRef, useState } from "react";
import BgImage from "./bg-image";
import BgVideo from "./bg-video";
import { services } from "@/lib/site";

export default function Experiencias() {
  const [active, setActive] = useState(0);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number) => {
    setActive(index);

    rowRefs.current.forEach((row, rowIndex) => {
      const video = row?.querySelector("video");
      if (!video) return;

      if (rowIndex === index) {
        video.currentTime = 0;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  };

  return (
    <section
      id="sec-exp"
      aria-labelledby="sec-exp-titulo"
      className="flex min-h-screen flex-wrap items-center gap-[clamp(18px,3vw,56px)] bg-taupe p-[clamp(16px,3vw,56px)]"
    >
      <div className="flex h-[clamp(420px,68vh,760px)] min-w-[260px] flex-1 basis-[420px] flex-col gap-[3px]">
        {services.map((service, index) => {
          const selected = active === index;

          return (
            <button
              key={service.name}
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
              type="button"
              aria-pressed={selected}
              aria-label={`Selecionar ${service.name}`}
              onClick={() => select(index)}
              className="relative min-h-0 w-full cursor-pointer overflow-hidden border-0 p-0 text-left"
              style={{
                flexGrow: selected ? 2.6 : 1,
                transition: "flex-grow .7s cubic-bezier(.22,.61,.36,1)",
              }}
            >
              {service.video ? (
                <BgVideo
                  asset={service.asset}
                  preload="metadata"
                  aria-label={service.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: service.position }}
                />
              ) : (
                <BgImage
                  asset={service.asset}
                  alt={service.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: service.position }}
                />
              )}
              <span
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(36,31,27,.55), rgba(36,31,27,.12))",
                }}
              />
              <span
                className={`absolute bottom-[clamp(8px,1.2vw,16px)] left-[clamp(12px,1.6vw,24px)] font-light uppercase tracking-[0.16em] transition-[color,font-size] duration-500 ${
                  selected
                    ? "text-[clamp(16px,1.8vw,26px)] text-white"
                    : "text-[clamp(13px,1.3vw,19px)] text-cream/70"
                }`}
              >
                {service.name}
              </span>
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="min-w-[240px] flex-1 basis-[300px] py-[clamp(4px,1.5vw,32px)] text-cream"
      >
        <h2
          id="sec-exp-titulo"
          className="m-0 text-[11px] font-light uppercase tracking-[0.34em] text-cream/70"
        >
          Massagens e tratamentos
        </h2>
        <h3 className="font-accent m-0 mt-3 text-[clamp(32px,4vw,60px)] font-normal leading-[1.08]">
          {services[active].name}
        </h3>
        {/*
          As seis descricoes ficam no HTML, e nao so a do item aberto. Antes, um
          buscador (ou um crawler de IA, que nao clica em nada) via o nome dos
          seis servicos e o texto de um so — cinco descricoes simplesmente nao
          existiam para quem indexa. O atributo hidden cuida do resto: o
          navegador nao pinta, o leitor de tela nao anuncia, e o texto continua
          na pagina. E o mesmo conteudo que aparece no clique.
        */}
        {services.map((service, index) => (
          <p
            key={service.name}
            hidden={index !== active}
            className="m-0 mt-[clamp(18px,2vw,30px)] max-w-[38ch] border-t border-cream/30 pt-[clamp(18px,2vw,30px)] text-[clamp(16px,1.3vw,21px)] font-light leading-[1.7] text-cream/90"
          >
            {service.description}
          </p>
        ))}
      </div>
    </section>
  );
}
