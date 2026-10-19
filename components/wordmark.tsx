import { assetBase } from "@/lib/site";

// <img> e nao next/image: com images.unoptimized (export estatico) o next/image
// so devolvia este mesmo <img>, e assim o componente roda fora do Next tambem
// (o pacote do Claude Design).
export default function Wordmark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${assetBase}/LOGOTIPO-transparente.png`}
      alt="Aira Spa"
      width={932}
      height={427}
      fetchPriority="high"
      decoding="async"
      className="mx-auto h-auto w-[clamp(140px,15vw,180px)]"
    />
  );
}
