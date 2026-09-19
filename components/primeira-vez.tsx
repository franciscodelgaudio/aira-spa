import { media } from "@/lib/site";

const cardShell =
  "flex flex-[0_0_min(78vw,780px)] flex-wrap items-center gap-[clamp(16px,2vw,36px)] rounded-[2px] bg-cream p-[clamp(20px,3vw,52px)]";
const cardText = "min-w-[200px] flex-1 basis-[240px]";
const cardMedia = "h-[clamp(220px,42vh,420px)] flex-[0_1_200px] overflow-hidden";
const rule = "mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay";
const paragraph =
  "m-0 mt-[clamp(14px,1.8vw,26px)] max-w-[32ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body";

export default function PrimeiraVez() {
  return (
    <section id="sec-primeira" data-pin="1" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-sand">
        <div
          data-cards="1"
          className="flex gap-[clamp(16px,2.4vw,44px)] px-[clamp(20px,8vw,160px)] will-change-transform"
        >
          <article className={cardShell}>
            <div className={cardText}>
              <div className={rule} />
              <div className="text-[clamp(12px,1.1vw,15px)] font-light uppercase tracking-[0.42em] text-clay">
                Primeira vez no
              </div>
              <h2 className="m-0 mt-2 text-[clamp(30px,4.2vw,62px)] font-extralight leading-[1.05] tracking-[0.06em] text-clay">
                AIRA SPA?
              </h2>
              <p className={paragraph}>
                Criamos uma experiência simples, acolhedora e pensada para você relaxar
                desde a chegada.
              </p>
            </div>
            <div className={cardMedia}>
              <img
                src={media.card1}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>
          </article>

          <article className={cardShell}>
            <div className={cardText}>
              <div className={rule} />
              <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
                PRECISO ESTAR HOSPEDADO?
              </h2>
              <div className="font-accent mt-[clamp(16px,2vw,28px)] text-[clamp(24px,2.6vw,38px)] text-clay">
                Não
              </div>
              <p className="m-0 mt-1.5 max-w-[32ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body">
                Recebemos hóspedes, moradores de Foz e visitantes.
              </p>
            </div>
            <div className={cardMedia}>
              <img
                src={media.card2}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>
          </article>

          <article className={cardShell}>
            <div className={`${cardMedia} order-2`}>
              <img
                src={media.card3}
                alt=""
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 50%" }}
              />
            </div>
            <div className={cardText}>
              <div className={rule} />
              <h2 className="m-0 text-[clamp(28px,3.8vw,56px)] font-extralight leading-[1.08] tracking-[0.05em] text-clay">
                E QUANDO EU CHEGAR?
              </h2>
              <p className="m-0 mt-[clamp(16px,2vw,28px)] max-w-[34ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.65] text-body">
                É só se apresentar na recepção do hotel, que você será encaminhado até o
                Aira Spa. Depois, é só relaxar e aproveitar o seu momento.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
