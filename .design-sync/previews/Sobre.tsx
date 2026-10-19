import { useEffect, useRef } from "react";
import { Sobre } from "aira-spa";

// A foto fica abaixo da dobra com loading="lazy" e nao carregaria numa captura
// estatica. Na previa, carrega ja.
const Eager = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
  }, []);
  return <div ref={ref}>{children}</div>;
};

export const Padrao = () => (
  <Eager>
    <Sobre />
  </Eager>
);
