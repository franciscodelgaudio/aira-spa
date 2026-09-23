"use client";

import { useEffect } from "react";

/**
 * iOS em Modo de Pouca Energia (e quem desliga a reproducao automatica) barra
 * todo autoplay, mesmo mudo. O hero ficava parado para sempre: o botao nativo
 * de play fica escondido e, de qualquer forma, o gradiente e o texto estao por
 * cima dele. Se o play do hero for recusado, o primeiro toque na pagina
 * destrava todos os videos — o WebKit libera o elemento que recebe play()
 * dentro de um gesto, entao os que estao fora da tela levam play()+pause()
 * para que os IntersectionObserver das secoes consigam tocar depois.
 */
export default function AutoplayUnlock() {
  useEffect(() => {
    const hero = document.querySelector<HTMLVideoElement>("#sec-hero video");
    if (!hero) return;

    const events = ["touchend", "click", "keydown"] as const;
    const disarm = () => events.forEach((t) => window.removeEventListener(t, onGesture, true));

    function onGesture() {
      disarm();
      document.querySelectorAll("video").forEach((v) => {
        if (!v.paused) return;
        const p = v.play();
        if (v !== hero) v.pause();
        void p?.catch(() => undefined);
      });
    }

    let cancelled = false;
    hero.play().catch((err: DOMException) => {
      if (cancelled || err?.name !== "NotAllowedError") return;
      events.forEach((t) => window.addEventListener(t, onGesture, { capture: true, passive: true }));
    });

    return () => {
      cancelled = true;
      disarm();
    };
  }, []);

  return null;
}
