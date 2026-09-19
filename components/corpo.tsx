import { media } from "@/lib/site";

const shadow = { textShadow: "0 2px 24px rgba(36,31,27,.35)" };

const screens = [
  {
    range: "0,0.23",
    width: "max-w-[18ch]",
    size: "text-[clamp(30px,5.2vw,72px)] leading-[1.16]",
    body: (
      <>
        Seu corpo fala.
        <br />
        <em className="font-accent font-normal">Você escuta?</em>
      </>
    ),
  },
  {
    range: "0.25,0.47",
    width: "max-w-[20ch]",
    size: "text-[clamp(26px,4.4vw,60px)] leading-[1.22]",
    body: (
      <>
        Ombros pesados.
        <br />
        Pernas cansadas.
        <br />
        Vontade de simplesmente <em className="font-accent">parar.</em>
      </>
    ),
  },
  {
    range: "0.49,0.71",
    width: "max-w-[20ch]",
    size: "text-[clamp(28px,4.8vw,64px)] leading-[1.2]",
    body: (
      <>
        Às vezes, o corpo está pedindo um pouco de{" "}
        <em className="font-accent">cuidado.</em>
      </>
    ),
  },
  {
    range: "0.73,1",
    width: "max-w-[18ch]",
    size: "text-[clamp(34px,6vw,86px)] leading-[1.12]",
    body: (
      <>
        Não espere ele pedir mais alto.
        <br />
        <em className="font-accent font-normal">Escute-se.</em>
      </>
    ),
  },
];

export default function Corpo() {
  return (
    <section id="sec-corpo" data-pin="1" className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-stone">
        <img
          data-zoom="0.09"
          src={media.corpo}
          alt=""
          className="absolute inset-0 h-full w-full origin-center object-cover"
          style={{ objectPosition: "50% 35%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(233,229,220,.18), rgba(60,48,40,.46))",
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-[clamp(24px,6vw,80px)] text-center text-white">
          {screens.map((screen) => (
            <div
              key={screen.range}
              data-anim="1"
              data-range={screen.range}
              className={`absolute font-light ${screen.width} ${screen.size}`}
              style={shadow}
            >
              {screen.body}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
