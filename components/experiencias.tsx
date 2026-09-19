import { media } from "@/lib/site";

const rows = [
  { label: "Relaxante", src: media.massagemVideo, position: "50% 10%", video: true },
  { label: "Massagem Candle", src: media.candleVideo, position: "50% 10%", video: true },
  { label: "Escalpes", src: media.escalpesVideo, position: "50% 22%", video: true },
  { label: "Drenagem Linfática", src: media.escalpesVideo, position: "50% 10%", video: true },
  { label: "Pedras Quentes", src: media.salaVideo, position: "50% 10%", video: true },
  { label: "Facial", src: media.facial, position: "50% 100%", video: false },
];

export default function Experiencias() {
  return (
    <section
      id="sec-exp"
      data-pin="1"
      data-steps="6"
      className="relative h-[280vh]"
    >
      <div className="sticky top-0 flex h-screen flex-wrap items-center gap-[clamp(18px,3vw,56px)] overflow-hidden bg-taupe p-[clamp(16px,3vw,56px)]">
        <div className="flex h-[clamp(300px,52vh,760px)] min-w-[260px] flex-1 basis-[320px] flex-col gap-[3px]">
          {rows.map((row, index) => (
            <div
              key={row.label}
              data-row={index}
              className="relative min-h-0 flex-1 overflow-hidden"
              style={{ transition: "flex-grow .7s cubic-bezier(.22,.61,.36,1)" }}
            >
              {row.video ? (
                <video
                  data-rowmedia={index}
                  data-lazy="1"
                  muted
                  loop
                  playsInline
                  preload="none"
                  src={row.src}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: row.position }}
                />
              ) : (
                <img
                  src={row.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: row.position }}
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(36,31,27,.55), rgba(36,31,27,.12))",
                }}
              />
              <span
                data-rowlabel={index}
                className="absolute bottom-[clamp(8px,1.2vw,16px)] left-[clamp(12px,1.6vw,24px)] text-[clamp(13px,1.3vw,19px)] font-light uppercase tracking-[0.16em] text-cream/70"
                style={{ transition: "color .5s, font-size .5s" }}
              >
                {row.label}
              </span>
            </div>
          ))}
        </div>

        <div className="min-w-[240px] flex-1 basis-[300px] py-[clamp(4px,1.5vw,32px)] text-cream">
          <h2 className="font-accent m-0 text-[clamp(28px,3.6vw,56px)] font-normal leading-[1.14]">
            Quais experiências posso escolher?
          </h2>
          <p className="m-0 mt-[clamp(14px,1.6vw,24px)] max-w-[34ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-cream/90">
            Temos diferentes experiências de relaxamento e cuidado, para você escolher
            aquela que mais combina com o seu momento.
          </p>
          <div className="mt-[clamp(18px,2.4vw,40px)] min-h-[clamp(66px,7vh,96px)] border-t border-cream/30 pt-[clamp(12px,1.4vw,22px)]">
            <div
              data-desc="1"
              className="font-accent text-[clamp(19px,2vw,30px)] font-light leading-[1.4]"
              style={{ transition: "opacity .4s" }}
            >
              Para soltar tensões e desacelerar.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
