"use client";

import { useState } from "react";
import BgImage from "./bg-image";
import { media, units } from "@/lib/site";

export default function Local() {
  const [openUnit, setOpenUnit] = useState<number | null>(null);

  return (
    <section id="sec-local" className="relative bg-sand">
      <div className="flex min-h-[80vh] flex-wrap items-stretch">
        <div
          data-parallax="1"
          className="relative min-h-[clamp(280px,56vh,720px)] flex-1 basis-[320px] overflow-hidden"
        >
          <BgImage
            asset={media.local1}
            className="absolute inset-x-0 h-[116%] w-full object-cover"
            style={{ top: "-8%", bottom: "-8%", objectPosition: "50% 50%" }}
          />
        </div>
        <div className="flex flex-1 basis-[380px] flex-col justify-center p-[clamp(32px,6vw,110px)]">
          <h2
            data-reveal="1"
            className="m-0 text-[clamp(32px,4.4vw,68px)] font-extralight leading-[1.05] tracking-[0.04em] text-clay"
          >
            ONDE FICA?
          </h2>
          <p
            data-reveal="1"
            className="m-0 mt-[clamp(16px,2vw,28px)] max-w-[34ch] text-[clamp(16px,1.2vw,20px)] font-light leading-[1.6] text-body"
          >
            O Aira Spa possui duas unidades em Foz do Iguaçu, localizadas dentro dos
            hotéis DoubleTree by Hilton e Viale Cataratas.
          </p>
          <div
            data-reveal="1"
            className="mt-[clamp(22px,2.6vw,40px)] flex flex-col gap-[clamp(16px,1.8vw,28px)]"
          >
            {units.map((unit, index) => {
              const isOpen = openUnit === index;
              const mapId = `mapa-unidade-${index}`;

              return (
              <div
                key={unit.name}
                className="border-b border-clay/25 pb-[clamp(16px,1.8vw,24px)]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={mapId}
                  onClick={() => setOpenUnit(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-sm border-0 bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-clay/45"
                >
                  <span>
                    <span className="block text-[clamp(17px,1.35vw,22px)] font-medium text-clay">
                      {unit.name}
                    </span>
                    <span className="mt-1 block text-[clamp(15px,1.1vw,18px)] font-normal text-body">
                      {unit.location}
                    </span>
                    <span className="mt-1 block text-[clamp(15px,1.1vw,18px)] font-light text-muted">
                      {unit.address}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border border-clay/35 text-xl font-light text-clay transition-transform duration-500 ease-in-out ${
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
                    <div className="overflow-hidden rounded-sm border border-clay/15 bg-cream">
                      <iframe
                        title={`Mapa da ${unit.name}`}
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          `${unit.name}, ${unit.address}, Foz do Iguaçu - PR`
                        )}&output=embed`}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-[clamp(190px,26vw,280px)] w-full border-0"
                        allowFullScreen
                        tabIndex={isOpen ? 0 : -1}
                      />
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id="sec-agendar"
        className="flex min-h-[80vh] scroll-mt-0 flex-wrap items-stretch bg-taupe"
      >
        <div className="flex flex-1 basis-[380px] flex-col justify-center p-[clamp(32px,6vw,110px)] text-cream">
          <h2
            data-reveal="1"
            className="m-0 text-[clamp(32px,4.4vw,68px)] font-extralight leading-[1.05] tracking-[0.04em]"
          >
            COMO FAÇO PARA AGENDAR?
          </h2>
          <div
            data-reveal="1"
            className="font-accent mt-[clamp(18px,2.2vw,32px)] text-[clamp(24px,2.6vw,38px)]"
          >
            É simples.
          </div>
          <p
            data-reveal="1"
            className="m-0 mt-1.5 max-w-[34ch] text-[clamp(16px,1.2vw,20px)] font-light leading-[1.6] text-cream/95"
          >
            Escolha a unidade do Aira Spa dentro do hotel de sua preferência e entre
            em contato pelo WhatsApp.
          </p>
          <div
            data-reveal="1"
            className="mt-[clamp(24px,3vw,44px)] flex flex-wrap gap-3.5"
          >
            {units.map((unit) => (
              <a
                key={unit.name}
                href={unit.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 flex-col gap-1 rounded-full border border-cream/55 px-7 py-4 text-cream transition-colors hover:bg-cream/15"
              >
                <span className="text-[11px] font-light uppercase tracking-[0.2em] opacity-85">
                  {unit.name}
                </span>
                <span className="text-[clamp(16px,1.3vw,20px)] font-normal">
                  {unit.phone}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div
          data-parallax="1"
          className="relative min-h-[clamp(280px,56vh,720px)] flex-1 basis-[320px] overflow-hidden"
        >
          <BgImage
            asset={media.local2}
            className="absolute inset-x-0 h-[116%] w-full object-cover"
            style={{ top: "-8%", bottom: "-8%", objectPosition: "50% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
