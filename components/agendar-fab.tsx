import InstagramIcon from "./instagram-icon";
import { instagram } from "@/lib/site";

const pill =
  "flex min-h-12 items-center rounded-full bg-clay text-cream shadow-[0_10px_30px_rgba(36,31,27,.22)] transition-colors hover:bg-clay-deep";

export default function AgendarFab() {
  return (
    <div className="fixed bottom-[clamp(14px,2.2vw,28px)] right-[clamp(14px,2.2vw,28px)] z-60 flex items-center gap-2.5">
      <a
        href={instagram.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Instagram do Aira Spa, ${instagram.handle}`}
        className={`${pill} min-w-12 justify-center px-3.5`}
      >
        <InstagramIcon className="h-[22px] w-[22px]" />
      </a>
      <a
        href="#sec-agendar"
        className={`${pill} gap-2.5 px-[22px] py-3.5 text-[13px] font-light uppercase tracking-[0.16em]`}
      >
        Agendar
      </a>
    </div>
  );
}
