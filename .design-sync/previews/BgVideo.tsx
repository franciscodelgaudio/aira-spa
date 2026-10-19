import { BgVideo, media } from "aira-spa";

export const Vertical = () => (
  <div className="relative aspect-[9/16] w-[260px] overflow-hidden bg-ink">
    <BgVideo
      asset={media.escaldaPesVideo}
      aria-label="Escalda-pés com água morna e sais relaxantes"
      className="absolute inset-0 h-full w-full object-cover"
    />
    <span className="absolute bottom-4 left-4 text-[16px] font-light uppercase tracking-[0.16em] text-white">
      Escalda-pés
    </span>
  </div>
);

export const ComVeuETexto = () => (
  <div className="relative aspect-video w-[480px] overflow-hidden bg-ink">
    <BgVideo
      asset={media.heroVideo}
      aria-label="Massagem relaxante em andamento em uma sala do Aira Spa"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: "50% 55%" }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, rgba(31,43,42,.5) 0%, rgba(31,43,42,.28) 40%, rgba(31,43,42,.62) 100%)",
      }}
    />
    <p className="absolute inset-0 m-0 flex items-center justify-center text-[28px] font-extralight text-cream">
      Onde o acolhimento leva à pausa.
    </p>
  </div>
);
