import { media, units } from "@/lib/site";

export default function Local() {
  return (
    <section id="sec-local" className="relative bg-sand">
      <div className="flex min-h-[80vh] flex-wrap items-stretch">
        <div
          data-parallax="1"
          className="relative min-h-[clamp(280px,56vh,720px)] flex-1 basis-[320px] overflow-hidden"
        >
          <img
            src={media.local1}
            alt=""
            className="absolute inset-x-0 h-[116%] w-full object-cover"
            style={{ top: "-8%", bottom: "-8%", objectPosition: "50% 50%" }}
          />
        </div>
        <div className="flex flex-1 basis-[380px] flex-col justify-center p-[clamp(32px,6vw,110px)]">
          <h2
            data-reveal="1"
            className="m-0 text-[clamp(32px,4.4vw,68px)] font-extralight leading-[1.05] tracking-[0.04em] text-clay"
          >
            ONDE FICA?
          </h2>
          <p
            data-reveal="1"
            className="m-0 mt-[clamp(16px,2vw,28px)] max-w-[34ch] text-[clamp(16px,1.2vw,20px)] font-light leading-[1.6] text-body"
          >
            Você encontra o Aira Spa em duas unidades em Foz do Iguaçu:
          </p>
          <div
            data-reveal="1"
            className="mt-[clamp(22px,2.6vw,40px)] flex flex-col gap-[clamp(16px,1.8vw,28px)]"
          >
            {units.map((unit) => (
              <div key={unit.name}>
                <div className="text-[clamp(17px,1.35vw,22px)] font-medium text-clay">
                  {unit.name}
                </div>
                <div className="mt-1 text-[clamp(15px,1.1vw,18px)] font-light text-muted">
                  {unit.address}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-[80vh] flex-wrap items-stretch bg-taupe">
        <div className="flex flex-1 basis-[380px] flex-col justify-center p-[clamp(32px,6vw,110px)] text-cream">
          <h2
            data-reveal="1"
            className="m-0 text-[clamp(32px,4.4vw,68px)] font-extralight leading-[1.05] tracking-[0.04em]"
          >
            COMO FAÇO PARA AGENDAR?
          </h2>
          <div
            data-reveal="1"
            className="font-accent mt-[clamp(18px,2.2vw,32px)] text-[clamp(24px,2.6vw,38px)]"
          >
            É simples.
          </div>
          <p
            data-reveal="1"
            className="m-0 mt-1.5 max-w-[34ch] text-[clamp(16px,1.2vw,20px)] font-light leading-[1.6] text-cream/95"
          >
            Escolha uma unidade e entre em contato pelo WhatsApp.
          </p>
          <div
            data-reveal="1"
            className="mt-[clamp(24px,3vw,44px)] flex flex-wrap gap-3.5"
          >
            {units.map((unit) => (
              <a
                key={unit.name}
                href={unit.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 flex-col gap-1 rounded-full border border-cream/55 px-7 py-4 text-cream transition-colors hover:bg-cream/15"
              >
                <span className="text-[11px] font-light uppercase tracking-[0.2em] opacity-85">
                  {unit.name}
                </span>
                <span className="text-[clamp(16px,1.3vw,20px)] font-normal">
                  {unit.phone}
                </span>
              </a>
            ))}
          </div>
        </div>
        <div
          data-parallax="1"
          className="relative min-h-[clamp(280px,56vh,720px)] flex-1 basis-[320px] overflow-hidden"
        >
          <img
            src={media.local2}
            alt=""
            className="absolute inset-x-0 h-[116%] w-full object-cover"
            style={{ top: "-8%", bottom: "-8%", objectPosition: "50% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
