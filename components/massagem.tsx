import { media } from "@/lib/site";

export default function Massagem() {
  return (
    <section id="sec-massagem" data-pin="1" className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        <img
          data-anim="1"
          data-range="0,0.62"
          data-zoom="0.06"
          src={media.massagem}
          alt=""
          className="absolute inset-0 h-full w-full origin-center object-cover"
          style={{ objectPosition: "50% 45%" }}
        />
        <video
          data-anim="1"
          data-range="0.58,1"
          data-lazy="1"
          muted
          loop
          playsInline
          preload="none"
          src={media.massagemVideo}
          className="absolute inset-0 h-full w-full object-cover opacity-0"
          style={{ objectPosition: "50% 10%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(36,31,27,.34), rgba(36,31,27,.58))",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-[clamp(24px,6vw,80px)] text-center text-cream">
          <h2
            data-anim="1"
            data-range="0.05,1"
            className="m-0 max-w-[16ch] text-[clamp(32px,5.6vw,80px)] font-light leading-[1.14]"
          >
            Você sabe que precisa de uma{" "}
            <span
              data-grow="1"
              className="inline-block font-normal tracking-[0.02em]"
            >
              massagem…
            </span>
          </h2>
          <p
            data-anim="1"
            data-range="0.4,1"
            className="font-accent m-0 mt-[clamp(18px,2.4vw,34px)] text-[clamp(22px,3vw,44px)] font-light"
          >
            Falta se permitir.
          </p>
        </div>
      </div>
    </section>
  );
}
