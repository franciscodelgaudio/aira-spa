import Wordmark from "./wordmark";
import BgVideo from "./bg-video";
import { hours, media, site } from "@/lib/site";

export default function Hero() {
  return (
    <section id="sec-hero" className="flex h-screen min-h-[620px] flex-col overflow-hidden bg-ink">
      <div className="relative z-10 flex h-[clamp(104px,12vw,132px)] shrink-0 items-center justify-center bg-brand">
        <Wordmark />
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <BgVideo
          asset={media.heroVideo}
          portrait={media.heroVerticalVideo}
          priority
          autoPlay
          aria-label="Massagem relaxante em andamento em uma sala do Aira Spa"
          className="absolute inset-0 h-full w-full origin-center object-cover"
          style={{ objectPosition: "50% 55%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(31,43,42,.5) 0%, rgba(31,43,42,.28) 40%, rgba(31,43,42,.62) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[clamp(24px,5vw,72px)] text-center text-cream">
          {/*
            O <h1> e o texto de maior peso da pagina para um buscador, e sozinha
            "Seu corpo pede pausa." nao diz o que o negocio faz nem onde fica.
            A linha de cima resolve isso sem trocar a frase: quem le comeca pelo
            que o lugar e, e so depois pela promessa.
          */}
          <h1 className="m-0">
            <span className="block text-[clamp(10px,1.1vw,13px)] font-light uppercase tracking-[0.32em] text-cream/75">
              {site.tagline}
            </span>
            <span className="mt-[clamp(16px,2.2vw,30px)] block text-[clamp(34px,6.4vw,92px)] font-extralight leading-[1.08] tracking-[0.01em]">
              Seu corpo pede pausa.
            </span>
          </h1>

          <a
            href="#sec-agendar"
            className="mt-[clamp(28px,4vw,52px)] inline-flex min-h-12 items-center rounded-full border border-cream/55 px-[34px] py-[14px] text-xs font-light uppercase tracking-[0.24em] text-cream transition-colors hover:bg-cream/15"
          >
            Agendar
          </a>

          {/*
            Onde e quando, acima da dobra. Responde a duvida mais comum de quem
            chega pelo Instagram e, de quebra, e o unico ponto em que as duas
            marcas de hotel e o horario aparecem antes de qualquer rolagem.
          */}
          <p className="m-0 mt-[clamp(20px,2.6vw,34px)] max-w-[62ch] text-balance text-[clamp(11px,1.05vw,14px)] font-light leading-[1.7] text-cream/70">
            Unidade DoubleTree by Hilton e Unidade Viale Cataratas · {hours.human}
          </p>
        </div>
      </div>
    </section>
  );
}
