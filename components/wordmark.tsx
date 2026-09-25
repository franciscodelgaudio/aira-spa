import Image from "next/image";

export default function Wordmark() {
  return (
    <Image
      src="/LOGOTIPO-transparente.png"
      alt="Aira Spa"
      width={932}
      height={427}
      priority
      className="mx-auto h-auto w-[clamp(140px,15vw,180px)]"
    />
  );
}
