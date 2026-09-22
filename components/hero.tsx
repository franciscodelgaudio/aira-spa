import Wordmark from "./wordmark";
import BgVideo from "./bg-video";
import { media } from "@/lib/site";

export default function Hero() {
  return (
    <section id="sec-hero" className="relative h-screen min-h-[620px] overflow-hidden bg-ink">
        <BgVideo
          asset={media.massagemVideo}
          priority
          autoPlay
          className="absolute inset-0 h-full w-full origin-center object-cover"
          style={{ objectPosition: "50% 55%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(36,31,27,.5) 0%, rgba(36,31,27,.28) 40%, rgba(36,31,27,.62) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[clamp(24px,5vw,72px)] text-center text-cream">
          <div className="absolute inset-x-0 top-[clamp(24px,4vw,44px)]">
            <Wordmark />
          </div>

          <h1 className="m-0 text-[clamp(34px,6.4vw,92px)] font-extralight leading-[1.08] tracking-[0.01em]">
            Seu corpo pede pausa.
          </h1>

          <p className="font-accent m-0 mt-[clamp(16px,2vw,28px)] text-[clamp(20px,2.8vw,40px)] font-light opacity-95">
            Um instante para desacelerar.
          </p>

          <a
            href="#sec-exp"
            className="mt-[clamp(28px,4vw,52px)] inline-flex min-h-12 items-center rounded-full border border-cream/55 px-[34px] py-[14px] text-xs font-light uppercase tracking-[0.24em] text-cream transition-colors hover:bg-cream/15"
          >
            Conheça a experiência
          </a>
        </div>

    </section>
  );
}
