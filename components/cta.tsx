import Wordmark from "./wordmark";
import BgVideo from "./bg-video";
import { instagram, media, units } from "@/lib/site";

const layers = [
  { range: "0,0.36", src: media.escalpesVideo, first: true },
  { range: "0.32,0.68", src: media.candleVideo, first: false },
  { range: "0.64,1", src: media.massagemVideo, first: false },
];

const screens = [
  {
    range: "0,0.3",
    className:
      "max-w-[18ch] text-[clamp(30px,5vw,74px)] font-extralight leading-[1.12]",
    text: "Bem-estar também faz parte da rotina.",
  },
  {
    range: "0.32,0.6",
    className:
      "max-w-[18ch] text-[clamp(30px,5vw,74px)] font-extralight leading-[1.12]",
    text: "Reserve um tempo na agenda só para si.",
  },
  {
    range: "0.62,0.82",
    className: "max-w-[16ch] text-[clamp(34px,5.8vw,86px)] font-light leading-[1.1]",
    text: "Você não precisa esperar mais.",
  },
];

export default function Cta() {
  return (
    <section id="sec-cta" data-pin="1" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {layers.map((layer) => (
          <BgVideo
            key={layer.range}
            asset={layer.src}
            data-anim="1"
            data-range={layer.range}
            className={`absolute inset-0 h-full w-full object-cover ${
              layer.first ? "" : "opacity-0"
            }`}
            style={{ objectPosition: "50% 10%" }}
          />
        ))}
        <div data-dim="1" className="absolute inset-0 bg-[rgba(36,31,27,.42)]" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[clamp(24px,6vw,90px)] text-center text-cream">
          {screens.map((screen) => (
            <div
              key={screen.range}
              data-anim="1"
              data-range={screen.range}
              className={`absolute ${screen.className}`}
            >
              {screen.text}
            </div>
          ))}

          <div
            data-anim="1"
            data-range="0.84,1"
            className="absolute flex flex-col items-center gap-[clamp(18px,2.4vw,34px)]"
          >
            <Wordmark />
            <h2 className="m-0 text-[clamp(28px,4vw,58px)] font-extralight leading-[1.1]">
              Agende sua experiência
            </h2>
            <div className="flex flex-wrap justify-center gap-3.5">
              <a
                href={units[0].whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center rounded-full bg-cream px-[30px] py-[15px] text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-white"
              >
                WhatsApp DoubleTree
              </a>
              <a
                href={units[1].whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center rounded-full border border-cream/60 px-[30px] py-[15px] text-xs font-light uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream/15"
              >
                WhatsApp Viale
              </a>
            </div>
            <a
              href={instagram.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-light uppercase tracking-[0.2em] text-cream/75 underline-offset-8 transition-opacity hover:opacity-70 hover:underline"
            >
              {instagram.handle}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
