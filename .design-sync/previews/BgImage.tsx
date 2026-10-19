import { BgImage, media } from "aira-spa";

export const Retrato = () => (
  <div className="relative aspect-[4/5] w-[320px] overflow-hidden rounded-[2px]">
    <BgImage
      asset={media.sobre}
      alt="Mulher de roupão sentada na borda da banheira de hidromassagem, molhando o pé na espuma"
      className="absolute inset-0 h-full w-full object-cover"
      style={{ objectPosition: "50% 30%" }}
    />
  </div>
);

export const PaisagemComSelo = () => (
  <div className="relative aspect-[3/2] w-[420px] overflow-hidden rounded-[2px]">
    <BgImage
      asset={media.primeira4}
      alt="Banheiras de hidromassagem e deck de madeira do Aira Spa no DoubleTree by Hilton"
      className="h-full w-full object-cover"
    />
    <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-normal uppercase tracking-[0.14em] text-clay">
      Unidade DoubleTree
    </span>
  </div>
);
