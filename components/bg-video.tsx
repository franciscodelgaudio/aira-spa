import type { VideoHTMLAttributes } from "react";
import type { VideoAsset } from "@/lib/site";

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src" | "poster"> & {
  asset: VideoAsset;
  /** Video acima da dobra, carregado com prioridade pelo navegador. */
  priority?: boolean;
  /**
   * Versao para telas em pe (celular). O navegador escolhe a <source> uma vez,
   * no carregamento, pela orientacao da viewport.
   */
  portrait?: VideoAsset;
};

/**
 * Video de fundo. Sempre com poster, para a tela nunca ficar preta enquanto o
 * arquivo baixa nem quando o autoplay e bloqueado. O WebM (VP9) vem primeiro e
 * pesa ~45% menos; quem nao le VP9 cai no MP4 (H.264).
 *
 */
export default function BgVideo({
  asset,
  priority = false,
  portrait,
  className = "",
  ...rest
}: Props) {
  return (
    <video
      muted
      loop
      playsInline
      preload={priority ? "auto" : "none"}
      poster={asset.poster}
      // bg-ink cobre o instante entre o layout e o poster decodificar.
      className={`bg-ink ${className}`}
      {...rest}
    >
      {portrait && (
        <>
          <source src={portrait.webm} type="video/webm" media="(orientation: portrait)" />
          <source src={portrait.mp4} type="video/mp4" media="(orientation: portrait)" />
        </>
      )}
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
