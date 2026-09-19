import type { VideoHTMLAttributes } from "react";
import type { VideoAsset } from "@/lib/site";

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> & {
  asset: VideoAsset;
  /**
   * Video acima da dobra. Sai da fila do media-loader e ja vem com preload="auto"
   * no HTML, para o browser comecar o download antes do JS executar.
   */
  priority?: boolean;
};

/**
 * Video de fundo. Sempre com poster, para a tela nunca ficar preta enquanto o
 * arquivo baixa nem quando o autoplay e bloqueado. O WebM (VP9) vem primeiro e
 * pesa ~45% menos; quem nao le VP9 cai no MP4 (H.264).
 *
 * Quem decide o momento do download e do play e o media-loader, via scroll-engine.
 */
export default function BgVideo({
  asset,
  priority = false,
  className = "",
  ...rest
}: Props) {
  return (
    <video
      data-video="1"
      muted
      loop
      playsInline
      preload={priority ? "auto" : "none"}
      poster={asset.poster}
      // bg-ink cobre o instante entre o layout e o poster decodificar.
      className={`bg-ink ${className}`}
      {...rest}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
