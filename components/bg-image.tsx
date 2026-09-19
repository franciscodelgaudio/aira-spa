import type { ImgHTMLAttributes } from "react";
import type { ImageAsset } from "@/lib/site";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  asset: ImageAsset;
  /** Imagem acima da dobra: carrega junto com a pagina e com prioridade alta. */
  priority?: boolean;
};

/**
 * Imagem com AVIF -> WebP -> JPEG. O AVIF pesa cerca de um quinto do JPEG
 * original nessas fotos; o <picture> garante que quem nao suporta ainda receba
 * um arquivo valido em vez de um icone quebrado.
 *
 * width/height saem de lib/site.ts e reservam a caixa antes do download, o que
 * evita o layout shift.
 */
export default function BgImage({
  asset,
  priority = false,
  alt = "",
  className = "",
  ...rest
}: Props) {
  return (
    // display:contents apaga a caixa do <picture>, para o <img> continuar
    // posicionado em relacao ao mesmo ancestral de antes.
    <picture className="contents">
      <source srcSet={asset.avif} type="image/avif" />
      <source srcSet={asset.webp} type="image/webp" />
      <img
        src={asset.jpg}
        alt={alt}
        width={asset.width}
        height={asset.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "auto" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        {...rest}
      />
    </picture>
  );
}
