import { InstagramIcon, instagram } from "aira-spa";

export const Tamanhos = () => (
  <div className="flex items-end gap-6 bg-cream p-8 text-clay">
    <InstagramIcon className="h-[18px] w-[18px]" />
    <InstagramIcon className="h-[22px] w-[22px]" />
    <InstagramIcon className="h-8 w-8" />
  </div>
);

export const ComArroba = () => (
  <div className="bg-ink p-8 text-sm font-light">
    <a href={instagram.url} className="inline-flex items-center gap-2 text-cream">
      <InstagramIcon className="h-[18px] w-[18px]" />
      {instagram.handle}
    </a>
  </div>
);
