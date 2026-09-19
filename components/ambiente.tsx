import BgVideo from "./bg-video";
import { media } from "@/lib/site";

export default function Ambiente() {
  return (
    <section id="sec-ambiente" data-pin="1" className="relative h-[240vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <BgVideo
          asset={media.ambienteVideo}
          data-anim="1"
          data-range="0,0.66"
          data-zoom="0.05"
          className="absolute inset-0 h-full w-full origin-center object-cover object-[75%_50%] md:object-[50%_10%]"
        />
        <BgVideo
          asset={media.salaVideo}
          data-anim="1"
          data-range="0.62,1"
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          style={{ objectPosition: "50% 10%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(36,31,27,.28), rgba(36,31,27,.66))",
          }}
        />

        <div className="absolute inset-0 flex flex-col justify-end p-[clamp(28px,6vw,96px)] text-cream">
          <h2
            data-anim="1"
            data-range="0.22,1"
            className="m-0 max-w-[16ch] text-[clamp(30px,5vw,74px)] font-extralight leading-[1.1]"
          >
            Cada detalhe convida você a desacelerar.
          </h2>
          <p
            data-anim="1"
            data-range="0.42,1"
            className="m-0 mt-[clamp(14px,1.8vw,26px)] max-w-[44ch] text-[clamp(16px,1.35vw,22px)] font-light leading-[1.6] text-cream/90"
          >
            Do ambiente ao toque, tudo foi pensado para transformar o seu momento em
            experiência.
          </p>
        </div>
      </div>
    </section>
  );
}
