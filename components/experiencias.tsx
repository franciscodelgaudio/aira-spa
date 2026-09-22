"use client";

import { useRef, useState } from "react";
import BgImage from "./bg-image";
import BgVideo from "./bg-video";
import { media, type ImageAsset, type VideoAsset } from "@/lib/site";

type Row =
  | {
      label: string;
      description: string;
      video: true;
      asset: VideoAsset;
      position: string;
    }
  | {
      label: string;
      description: string;
      video: false;
      asset: ImageAsset;
      position: string;
    };

const rows: Row[] = [
  {
    label: "Massagem Relaxante",
    description:
      "Uma massagem com movimentos suaves e contínuos, pensada para aliviar a sensação de tensão muscular e proporcionar um momento de descanso profundo.",
    video: true,
    asset: media.massagemVideo,
    position: "50% 10%",
  },
  {
    label: "Massagem Candle",
    description:
      "Uma experiência sensorial feita com óleo morno de vela cosmética, que combina calor, aroma e movimentos relaxantes sobre a pele.",
    video: true,
    asset: media.candleVideo,
    position: "50% 10%",
  },
  {
    label: "Escalpes",
    description:
      "Uma massagem concentrada no couro cabeludo, na nuca e nos ombros, ideal para desacelerar e aliviar a sensação de tensão nessas regiões.",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 22%",
  },
  {
    label: "Drenagem Linfática",
    description:
      "Realizada com movimentos leves, lentos e ritmados, a drenagem oferece uma experiência delicada de cuidado e sensação de leveza para o corpo.",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 10%",
  },
  {
    label: "Pedras Quentes",
    description:
      "Combina o toque da massagem com pedras aquecidas posicionadas sobre o corpo, criando uma sensação envolvente de calor e relaxamento.",
    video: true,
    asset: media.salaVideo,
    position: "50% 10%",
  },
  {
    label: "Facial",
    description:
      "Um cuidado dedicado ao rosto que reúne hidratação, movimentos de massagem e uma pausa relaxante para renovar a sensação da pele.",
    video: false,
    asset: media.facial,
    position: "50% 100%",
  },
];

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
      className="flex min-h-screen flex-wrap items-center gap-[clamp(18px,3vw,56px)] bg-taupe p-[clamp(16px,3vw,56px)]"
    >
      <div className="flex h-[clamp(420px,68vh,760px)] min-w-[260px] flex-1 basis-[420px] flex-col gap-[3px]">
        {rows.map((row, index) => {
          const selected = active === index;

          return (
            <button
              key={row.label}
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
              type="button"
              aria-pressed={selected}
              aria-label={`Selecionar ${row.label}`}
              onClick={() => select(index)}
              className="relative min-h-0 w-full cursor-pointer overflow-hidden border-0 p-0 text-left"
              style={{
                flexGrow: selected ? 2.6 : 1,
                transition: "flex-grow .7s cubic-bezier(.22,.61,.36,1)",
              }}
            >
              {row.video ? (
                <BgVideo
                  asset={row.asset}
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: row.position }}
                />
              ) : (
                <BgImage
                  asset={row.asset}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: row.position }}
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
                {row.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="min-w-[240px] flex-1 basis-[300px] py-[clamp(4px,1.5vw,32px)] text-cream"
      >
        <div className="text-[11px] font-light uppercase tracking-[0.34em] text-cream/70">
          Sobre o serviço
        </div>
        <h2 className="font-accent m-0 mt-3 text-[clamp(32px,4vw,60px)] font-normal leading-[1.08]">
          {rows[active].label}
        </h2>
        <p className="m-0 mt-[clamp(18px,2vw,30px)] max-w-[38ch] border-t border-cream/30 pt-[clamp(18px,2vw,30px)] text-[clamp(16px,1.3vw,21px)] font-light leading-[1.7] text-cream/90">
          {rows[active].description}
        </p>
      </div>
    </section>
  );
}
