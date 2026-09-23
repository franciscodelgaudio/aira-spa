"use client";

import { useEffect, useRef, useState } from "react";
import BgImage from "./bg-image";
import BgVideo from "./bg-video";
import { services } from "@/lib/site";

export default function Experiencias() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // O item aberto toca sozinho quando a secao entra na tela e pausa quando sai,
  // sem esperar um clique. Com movimento reduzido fica no poster ate o clique.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const video = rowRefs.current[activeRef.current]?.querySelector("video");
        if (!video) return;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  const select = (index: number) => {
    setActive(index);
    activeRef.current = index;

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
      ref={sectionRef}
      id="sec-exp"
      aria-labelledby="sec-exp-titulo"
      className="flex min-h-screen flex-wrap items-center gap-[clamp(18px,3vw,56px)] bg-taupe p-[clamp(16px,3vw,56px)]"
    >
      {/*
        Os videos foram gravados no celular, em pe. No desktop a sanfona abre na
        horizontal: a coluna ativa tem exatamente 9:16 da altura (--h) e mostra a
        cena inteira; as fechadas viram tiras com o nome na vertical. No celular
        a tela ja e em pe, entao as linhas empilham: a ativa ocupa quase toda a
        altura e fica perto do 9:16, as outras viram faixas de 44px.
      */}
      <div className="flex h-[var(--h)] min-w-0 flex-[2] basis-[560px] flex-col gap-[3px] [--h:clamp(520px,88svh,820px)] md:flex-row md:[--h:clamp(420px,72vh,780px)]">
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
              className={`relative min-h-0 min-w-0 cursor-pointer overflow-hidden border-0 p-0 text-left transition-[flex] duration-700 ease-[cubic-bezier(.22,.61,.36,1)] ${
                selected
                  ? "flex-[1_1_0%] md:flex-[0_0_calc(var(--h)*9/16)]"
                  : "flex-[0_0_44px] md:min-w-[56px] md:flex-[1_1_0%]"
              }`}
            >
              {service.video ? (
                <BgVideo
                  asset={service.asset}
                  preload={index === 0 ? "metadata" : "none"}
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
                className="absolute inset-0 transition-[background-color] duration-700"
                style={{
                  backgroundColor: selected ? "rgba(31,43,42,.12)" : "rgba(31,43,42,.5)",
                  backgroundImage:
                    "linear-gradient(0deg, rgba(31,43,42,.6), rgba(31,43,42,0) 45%)",
                }}
              />
              <span
                className={`absolute font-light uppercase tracking-[0.16em] transition-[color,font-size] duration-500 ${
                  selected
                    ? "bottom-[clamp(12px,1.4vw,20px)] left-[clamp(12px,1.6vw,24px)] text-[clamp(16px,1.8vw,26px)] text-white"
                    : "left-[clamp(12px,1.6vw,24px)] top-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(12px,1.1vw,16px)] text-cream/80 md:top-auto md:bottom-[clamp(12px,1.4vw,20px)] md:left-1/2 md:-translate-x-1/2 md:translate-y-0 md:rotate-180 md:[writing-mode:vertical-rl]"
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
