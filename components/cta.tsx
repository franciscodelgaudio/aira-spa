import BgVideo from "./bg-video";
import { media, units } from "@/lib/site";

const layers = [
  { range: "0,0.36", src: media.escalpesVideo, first: true },
  { range: "0.32,0.68", src: media.candleVideo, first: false },
  { range: "0.64,1", src: media.massagemVideo, first: false },
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

        <div className="absolute inset-0 flex items-center justify-center p-[clamp(24px,6vw,90px)] text-center text-cream">
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
        </div>
      </div>
    </section>
  );
}
