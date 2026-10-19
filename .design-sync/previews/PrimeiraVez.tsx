import { useEffect, useRef } from "react";
import { PrimeiraVez } from "aira-spa";

// Os cartoes fora da tela tem loading="lazy" e nunca carregam numa captura
// estatica (o carrossel nao rola). Na previa, todas as fotos carregam ja.
const Eager = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
  }, []);
  return <div ref={ref}>{children}</div>;
};

export const Padrao = () => (
  <Eager>
    <PrimeiraVez />
  </Eager>
);
