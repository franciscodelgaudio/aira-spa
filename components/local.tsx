"use client";

import { useState } from "react";
import BgImage from "./bg-image";
import { hours, mapsQuery, site, unitHotels, units, type Unit } from "@/lib/site";

// O PNG horizontal do DoubleTree tem bastante margem transparente: a altura
// passa da linha e a margem negativa alinha a arvore com o texto do cartao.
// O do Viale e branco e vira mascara, pintado de clay.
function HotelLogo({ unit }: { unit: Unit }) {
  const { logo } = unitHotels[unit.slug];

  if (unit.slug === "viale") {
    return (
      <div
        role="img"
        aria-label={unit.hotel}
        className="aspect-[268/142] h-full bg-clay"
        style={{
          maskImage: `url(${logo})`,
          WebkitMaskImage: `url(${logo})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={unit.hotel}
      width={1080}
      height={300}
      loading="lazy"
      decoding="async"
      className="ml-[-11%] h-[125%] w-auto"
    />
  );
}

export default function Local() {
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  // O <iframe> do Google Maps so nasce no primeiro clique: mesmo escondido e
  // com loading="lazy", o Chrome carregava os dois mapas ao passar rolando.
  // Depois de aberto fica montado, para o fechamento animar com o mapa dentro.
  const [mapsShown, setMapsShown] = useState<string[]>([]);

  const toggle = (slug: string) => {
    setOpenUnits((open) =>
      open.includes(slug) ? open.filter((s) => s !== slug) : [...open, slug]
    );
    setMapsShown((shown) => (shown.includes(slug) ? shown : [...shown, slug]));
  };

  return (
    // Sem padding em cima: a secao anterior (PrimeiraVez) tem o mesmo fundo e
    // ja termina com o respiro dela; somados, os dois davam um vao duplo.
    <section
      id="sec-local"
      className="bg-sand px-[clamp(20px,4vw,64px)] pb-[clamp(56px,8vw,120px)]"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-[clamp(32px,4vw,64px)]">
          <div>
            <div className="mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay" />
            <h2 className="m-0 text-[clamp(32px,4.4vw,68px)] font-extralight leading-[1.05] tracking-[0.04em] text-clay">
              ONDE ESTAMOS
            </h2>
          </div>
          <div className="max-w-[40ch]">
            <p className="m-0 mt-[clamp(16px,2vw,28px)] text-pretty text-[clamp(16px,1.2vw,20px)] font-light leading-[1.6] text-body">
              O Aira Spa possui duas unidades em Foz do Iguaçu, localizadas dentro dos
              hotéis DoubleTree by Hilton e Viale Cataratas.
            </p>
            {/*
              O horario precisa estar escrito aqui porque o JSON-LD o declara em
              openingHoursSpecification: o Google desconsidera dado estruturado que
              o visitante nao consegue conferir na propria pagina.
            */}
            <p className="m-0 mt-[clamp(10px,1.2vw,16px)] text-[clamp(15px,1.1vw,18px)] font-light text-muted">
              {hours.human}
            </p>
          </div>
        </div>

        {/*
          #sec-agendar e o destino dos botoes "Agendar" (hero e flutuante): o
          WhatsApp de cada unidade fica nestes cartoes.
        */}
        <div
          id="sec-agendar"
          className="grid scroll-mt-6 grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-[clamp(20px,3vw,48px)]"
        >
          {units.map((unit) => {
            const hotel = unitHotels[unit.slug];
            const isOpen = openUnits.includes(unit.slug);
            const mapId = `mapa-${unit.slug}`;

            return (
              <article
                key={unit.slug}
                className="flex flex-col overflow-hidden rounded-[2px] bg-cream"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <BgImage
                    asset={hotel.photo}
                    alt={hotel.photoAlt}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="flex flex-col gap-[clamp(18px,2vw,28px)] p-[clamp(24px,3vw,44px)]">
                  <div className="flex h-[clamp(56px,5vw,76px)] items-center">
                    <HotelLogo unit={unit} />
                  </div>

                  <div className="border-t border-clay/25 pt-[clamp(16px,1.8vw,24px)]">
                    <h3 className="m-0 text-[clamp(17px,1.35vw,22px)] font-medium text-clay">
                      {unit.name}
                    </h3>
                    <p className="m-0 mt-1 text-[clamp(15px,1.1vw,18px)] font-light text-muted">
                      {unit.address} — {unit.district}, {site.city} - {site.region}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a
                      href={unit.whatsapp}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-12 items-center rounded-full bg-clay px-7 text-[13px] uppercase tracking-[0.16em] text-cream transition-colors hover:bg-clay-deep"
                    >
                      WhatsApp {unit.phone}
                    </a>
                  </div>

                  <div className="border-t border-clay/25 pt-[clamp(14px,1.6vw,20px)]">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={mapId}
                      onClick={() => toggle(unit.slug)}
                      className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm border-0 bg-transparent p-0 text-left text-[13px] uppercase tracking-[0.16em] text-clay outline-none focus-visible:ring-2 focus-visible:ring-clay/45"
                    >
                      {isOpen ? "Ocultar mapa" : "Ver mapa"}
                      <span
                        aria-hidden="true"
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-clay/35 text-xl font-light transition-transform duration-500 ease-in-out ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={mapId}
                      aria-hidden={!isOpen}
                      className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
                        isOpen
                          ? "mt-4 grid-rows-[1fr] opacity-100"
                          : "mt-0 grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="overflow-hidden rounded-[2px] border border-clay/15 bg-sand">
                          {mapsShown.includes(unit.slug) && (
                            <iframe
                              title={`Mapa da ${unit.name}`}
                              src={`https://www.google.com/maps?q=${encodeURIComponent(
                                mapsQuery(unit)
                              )}&output=embed`}
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              className="block h-[clamp(200px,22vw,280px)] w-full border-0"
                              allowFullScreen
                              tabIndex={isOpen ? 0 : -1}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
