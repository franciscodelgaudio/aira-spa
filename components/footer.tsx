import InstagramIcon from "./instagram-icon";
import { agency, instagram, units } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-ink px-[clamp(20px,6vw,90px)] py-[clamp(28px,4vw,56px)] pb-28 text-sm font-light text-cream/70 sm:pb-[clamp(28px,4vw,56px)]">
      <div className="flex flex-wrap items-center justify-between gap-[18px]">
        <span>Aira Spa · Foz do Iguaçu</span>
        <a
          href={instagram.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-cream transition-opacity hover:opacity-70"
        >
          <InstagramIcon className="h-[18px] w-[18px]" />
          {instagram.handle}
        </a>
        <span>{units.map((unit) => unit.address).join(" · ")}</span>
      </div>

      <p className="mt-[clamp(20px,2.6vw,34px)] text-[11px] font-light leading-relaxed text-cream/30 sm:max-w-[70%]">
        <a
          href={agency.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="transition-opacity hover:opacity-70"
        >
          {agency.name} · CNPJ {agency.cnpj} · {agency.phone}
        </a>
      </p>
    </footer>
  );
}
