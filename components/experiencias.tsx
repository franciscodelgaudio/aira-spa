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
    label: "Relaxante",
    description: "Para soltar tensões e desacelerar.",
    video: true,
    asset: media.massagemVideo,
    position: "50% 10%",
  },
  {
    label: "Massagem Candle",
    description: "Calor, aroma e toque em uma experiência sensorial.",
    video: true,
    asset: media.candleVideo,
    position: "50% 10%",
  },
  {
    label: "Escalpes",
    description: "Uma pausa delicada para cabeça e mente.",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 22%",
  },
  {
    label: "Drenagem Linfática",
    description: "Leveza e cuidado para o corpo.",
    video: true,
    asset: media.escalpesVideo,
    position: "50% 10%",
  },
  {
    label: "Pedras Quentes",
    description: "Calor envolvente e relaxamento profundo.",
    video: true,
    asset: media.salaVideo,
    position: "50% 10%",
  },
  {
    label: "Facial",
    description: "Hidratação, massagem e renovação.",
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

      <div className="min-w-[240px] flex-1 basis-[300px] py-[clamp(4px,1.5vw,32px)] text-cream">
        <h2 className="font-accent m-0 text-[clamp(28px,3.6vw,56px)] font-normal leading-[1.14]">
          Quais experiências posso escolher?
        </h2>
        <p className="m-0 mt-[clamp(14px,1.6vw,24px)] max-w-[34ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-cream/90">
          Temos diferentes experiências de relaxamento e cuidado, para você escolher
          aquela que mais combina com o seu momento.
        </p>
        <div
          aria-live="polite"
          className="mt-[clamp(18px,2.4vw,40px)] min-h-[clamp(66px,7vh,96px)] border-t border-cream/30 pt-[clamp(12px,1.4vw,22px)]"
        >
          <div className="font-accent text-[clamp(19px,2vw,30px)] font-light leading-[1.4]">
            {rows[active].description}
          </div>
        </div>
      </div>
    </section>
  );
}
