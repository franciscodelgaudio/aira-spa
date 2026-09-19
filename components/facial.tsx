import { media, units } from "@/lib/site";

export default function Facial() {
  return (
    <section id="sec-facial" data-pin="1" className="relative h-[180vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <img
          data-zoom="0.08"
          src={media.facial}
          alt=""
          className="absolute inset-0 h-full w-full origin-center object-cover"
          style={{ objectPosition: "50% 60%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(115deg, rgba(36,31,27,.62) 0%, rgba(36,31,27,.18) 55%, rgba(36,31,27,.05) 100%)",
          }}
        />

        <div className="absolute left-0 top-0 max-w-[min(620px,86vw)] p-[clamp(28px,7vw,110px)] text-cream">
          <div
            data-anim="1"
            data-range="0.02,1"
            className="text-[11px] font-light uppercase tracking-[0.42em] opacity-80"
          >
            Destaque
          </div>
          <h2
            data-anim="1"
            data-range="0.08,1"
            className="m-0 mt-[clamp(12px,1.6vw,22px)] text-[clamp(34px,5.4vw,78px)] font-extralight leading-[1.05] tracking-[0.06em]"
          >
            Facial Aira
          </h2>
          <p
            data-anim="1"
            data-range="0.24,1"
            className="m-0 mt-[clamp(14px,1.8vw,26px)] max-w-[30ch] text-[clamp(16px,1.45vw,23px)] font-light leading-[1.6] text-cream/90"
          >
            Hidratação, massagem e relaxamento em uma experiência completa de cuidado.
          </p>
          <a
            data-anim="1"
            data-range="0.5,1"
            href={units[0].whatsapp}
            target="_blank"
            rel="noreferrer"
            className="mt-[clamp(22px,3vw,40px)] inline-flex min-h-12 items-center rounded-full border border-cream/50 px-8 py-[14px] text-xs font-light uppercase tracking-[0.24em] text-cream transition-colors hover:bg-cream/15"
          >
            Conheça os tratamentos
          </a>
        </div>
      </div>
    </section>
  );
}
