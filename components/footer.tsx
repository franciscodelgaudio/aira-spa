import InstagramIcon from "./instagram-icon";
import { agency, fullAddress, hours, instagram, site, units } from "@/lib/site";

/**
 * O rodape carrega o NAP — nome, endereco e telefone completos das duas
 * unidades. E o bloco que o Google cruza com o Google Meu Negocio e com os
 * diretorios (TripAdvisor, sites dos hoteis) para confirmar que se trata do
 * mesmo negocio: quanto mais identicos os tres dados, mais forte o sinal local.
 * Por isso o endereco sai inteiro aqui, com bairro e CEP, e nao abreviado.
 */
export default function Footer() {
  return (
    <footer className="bg-ink px-[clamp(20px,6vw,90px)] py-[clamp(28px,4vw,56px)] pb-28 text-sm font-light text-cream/70 sm:pb-[clamp(28px,4vw,56px)]">
      <div className="flex flex-wrap items-center justify-between gap-[18px]">
        <span>
          {site.name} · {site.city} - {site.region}
        </span>
        <a
          href={instagram.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-cream transition-opacity hover:opacity-70"
        >
          <InstagramIcon className="h-[18px] w-[18px]" />
          {instagram.handle}
        </a>
        <span>{hours.human}</span>
      </div>

      <div className="mt-[clamp(22px,3vw,40px)] flex flex-wrap gap-[clamp(20px,4vw,72px)] border-t border-cream/15 pt-[clamp(20px,2.6vw,34px)]">
        {units.map((unit) => (
          // not-italic: o <address> e o elemento semanticamente certo para
          // contato, mas o navegador o desenha em italico por padrao.
          <address
            key={unit.slug}
            className="min-w-[220px] flex-1 not-italic leading-relaxed"
          >
            <span className="block text-cream/90">{unit.location}</span>
            <span className="block">{fullAddress(unit)}</span>
            <a
              href={unit.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-cream transition-opacity hover:opacity-70"
            >
              WhatsApp {unit.phone}
            </a>
          </address>
        ))}
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
