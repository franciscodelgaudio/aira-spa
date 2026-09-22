"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/**
 * Aviso de rolagem do hero.
 *
 * O hero e uma tela cheia presa (sticky) dentro de uma secao de 200vh: nada se
 * move sozinho e, em telas com scrollbar sobreposta, nem barra aparece. Quem
 * chega fica esperando a pagina "acontecer" sem saber que precisa rolar. Aqui o
 * convite fica escrito, clicavel e, se passar NUDGE_DELAY sem ninguem rolar,
 * ele deixa de ser discreto.
 */

/** Tempo parado no topo antes do aviso ficar mais evidente. */
const NUDGE_DELAY = 3500;
/** Rolagem ja feita que considera o recado entendido. */
const SCROLLED = 40;

const subscribe = (cb: () => void) => {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
};

// No servidor ninguem rolou nada ainda, entao o aviso sai no HTML — ele aparece
// na primeira pintura, antes mesmo do JS hidratar.
const hasScrolled = () => window.scrollY > SCROLLED;
const serverSnapshot = () => false;

export default function ScrollCue() {
  const hidden = useSyncExternalStore(subscribe, hasScrolled, serverSnapshot);
  const [waited, setWaited] = useState(false);
  const nudge = waited && !hidden;

  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), NUDGE_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Rola pouco menos de uma tela: o suficiente para a narrativa se mover na
  // frente da pessoa e ela entender o mecanismo, sem pular o hero inteiro.
  const advance = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: window.scrollY + window.innerHeight * 0.85,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={advance}
      aria-label="Rolar para continuar"
      className="absolute bottom-[88px] left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2.5 border-0 bg-transparent p-2 text-cream md:bottom-[22px]"
      style={{
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition: "opacity .55s ease",
      }}
    >
      <span
        className="text-[11px] font-light uppercase tracking-[0.26em] transition-opacity duration-700"
        style={{
          opacity: nudge ? 1 : 0.72,
          textShadow: "0 1px 12px rgba(31,43,42,.45)",
        }}
      >
        {/* No toque nao existe "rolar o mouse": o gesto e outro e o verbo tambem.
            Quem escolhe e o CSS, para o HTML ja sair certo do servidor. */}
        <span className="aira-cue-mouse">Role</span>
        <span className="aira-cue-touch">Deslize</span> para continuar
      </span>
      <span
        className={`aira-cue flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-700 ${
          nudge ? "aira-cue-strong border-cream/80 bg-cream/15" : "border-cream/45"
        }`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" />
        </svg>
      </span>
    </button>
  );
}
