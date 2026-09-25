import BgImage from "./bg-image";
import { media } from "@/lib/site";

const paragraph =
  "m-0 max-w-[40ch] text-[clamp(15px,1.15vw,19px)] font-light leading-[1.75] text-body";

// Respiro entre o hero e as experiencias: fundo claro, muito espaco e uma foto
// so. Texto a esquerda e foto a direita; no celular a foto desce para baixo do
// texto.
export default function Sobre() {
  return (
    <section
      id="sec-sobre"
      aria-labelledby="sec-sobre-titulo"
      className="bg-cream px-[clamp(24px,6vw,96px)] py-[clamp(80px,11vw,160px)]"
    >
      <div className="mx-auto grid max-w-[1180px] items-center gap-[clamp(48px,7vw,120px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="mb-[clamp(18px,2.4vw,34px)] h-px w-[clamp(80px,9vw,140px)] bg-clay" />
          {/*
            A frase de abertura faz as vezes de titulo: e ela que diz do que a
            secao trata, entao e ela o <h2>.
          */}
          <h2
            id="sec-sobre-titulo"
            className="m-0 max-w-[22ch] text-[clamp(26px,2.9vw,42px)] font-extralight leading-[1.25] tracking-[0.01em] text-clay"
          >
            O Aira nasceu do desejo de criar um lugar onde, por alguns instantes, você
            possa simplesmente estar.
          </h2>

          <div className="mt-[clamp(24px,3vw,40px)] flex flex-col gap-[clamp(14px,1.6vw,22px)]">
            <p className={paragraph}>
              Um espaço onde o cuidado acontece sem pressa, o silêncio acolhe e cada
              detalhe convida a deixar o ritmo lá fora.
            </p>
            <p className={paragraph}>
              Mais do que cuidar do corpo, acreditamos em experiências que nos ajudam
              a respirar, sentir e voltar para nós mesmos.
            </p>
          </div>

          <p className="m-0 mt-[clamp(32px,4.4vw,60px)] text-clay">
            <span className="block text-[clamp(11px,1vw,13px)] font-light uppercase tracking-[0.42em]">
              Aira Spa
            </span>
            <span className="font-accent mt-1.5 block text-[clamp(22px,2.2vw,32px)]">
              Onde o acolhimento leva à pausa.
            </span>
          </p>
        </div>

        {/*
          A foto original e 1080x610; 4:3 e o recorte mais alto que ela aguenta
          sem ficar mole numa tela retina.
        */}
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[2px] md:aspect-[4/3]">
          <BgImage
            asset={media.sobre}
            alt="Mão apoiada na nuca, em um momento de pausa"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "45% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
