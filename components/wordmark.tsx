import Image from "next/image";

export default function Wordmark() {
  return (
    <div className="relative mx-auto h-[clamp(76px,8vw,96px)] w-[clamp(190px,22vw,240px)] overflow-hidden">
      <Image
        src="/LOGOTIPO.png"
        alt="Aira Spa"
        width={1254}
        height={1254}
        priority
        className="absolute left-1/2 top-1/2 h-auto w-full max-w-none -translate-x-1/2 -translate-y-[52%]"
      />
    </div>
  );
}
