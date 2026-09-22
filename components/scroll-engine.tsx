"use client";

import { useEffect } from "react";
import { createMediaLoader } from "@/lib/media-loader";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Antecipacao do download: comeca a buscar o video quando ele ainda esta a duas
 * telas de distancia. Com a margem curta de antes o download de 1 MB so comecava
 * com o video praticamente na tela, e ele sempre chegava atrasado.
 */
const PRELOAD_MARGIN = "200% 0px";
/** Margem curta, so para revelar textos na hora certa. */
const REVEAL_MARGIN = "10% 0px";

const descriptions = [
  "Para soltar tensões e desacelerar.",
  "Calor, aroma e toque em uma experiência sensorial.",
  "Uma pausa delicada para cabeça e mente.",
  "Leveza e cuidado para o corpo.",
  "Calor envolvente e relaxamento profundo.",
  "Hidratação, massagem e renovação.",
];

export default function ScrollEngine() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loader = createMediaLoader();
    let activeRow = -1;
    let ticking = false;
    let descTimer: ReturnType<typeof setTimeout>;

    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[data-video]"));

    // Com movimento reduzido nenhum video toca. Nesse caso nao ha motivo para
    // baixar megabyte nenhum: o poster ja mostra exatamente o mesmo quadro.
    if (!reduce) videos.forEach((v) => loader.register(v));

    const update = () => {
      const vh = window.innerHeight;

      document.querySelectorAll<HTMLElement>("[data-pin]").forEach((sec) => {
        const r = sec.getBoundingClientRect();
        const total = Math.max(1, sec.offsetHeight - vh);
        const p = clamp(-r.top / total, 0, 1);
        if (r.top >= vh || r.bottom <= 0) return;

        sec.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
          const [a, b] = (el.dataset.range || "0,1").split(",").map(Number);
          const t = (p - a) / Math.max(0.0001, b - a);
          if (t < -0.2 || t > 1.2) {
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
            return;
          }
          const fin = a <= 0.001 ? 1 : smooth(0, 0.3, t);
          const fout = b >= 0.999 ? 0 : smooth(0.74, 1, t);
          const o = clamp(fin * (1 - fout), 0, 1);
          el.style.opacity = String(o);
          el.style.pointerEvents = o > 0.5 ? "auto" : "none";

          const isMedia = el.tagName === "VIDEO" || el.tagName === "IMG";
          if (!isMedia && !reduce) {
            el.style.transform = `translateY(${((1 - fin) * 26 - fout * 16).toFixed(2)}px)`;
          }
          if (el.tagName === "VIDEO" && !reduce) {
            const v = el as HTMLVideoElement;
            if (o > 0.05) loader.play(v);
            else loader.pause(v);
          }
        });

        if (!reduce) {
          sec.querySelectorAll<HTMLElement>("[data-zoom]").forEach((el) => {
            const amt = parseFloat(el.dataset.zoom || "") || 0.06;
            el.style.transform = `scale(${(1 + amt * p).toFixed(4)})`;
          });

          const grow = sec.querySelector<HTMLElement>("[data-grow]");
          if (grow) {
            grow.style.transform = `scale(${(1 + 0.12 * smooth(0.3, 0.62, p)).toFixed(3)})`;
          }
        }

        const dim = sec.querySelector<HTMLElement>("[data-dim]");
        if (dim) dim.style.background = `rgba(31,43,42,${(0.42 + 0.22 * p).toFixed(3)})`;

        if (sec.dataset.steps) {
          const n = parseInt(sec.dataset.steps, 10);
          const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
          if (idx !== activeRow) {
            activeRow = idx;
            const rows = sec.querySelectorAll<HTMLElement>("[data-row]");
            rows.forEach((row, i) => {
              const on = i === idx;
              row.style.flexGrow = on ? "2.6" : "1";
              const label = row.querySelector<HTMLElement>("[data-rowlabel]");
              if (label) {
                label.style.color = on ? "#FFFFFF" : "rgba(246,244,238,.72)";
                label.style.fontSize = on
                  ? "clamp(16px,1.8vw,26px)"
                  : "clamp(13px,1.3vw,19px)";
              }
              const media = row.querySelector<HTMLVideoElement>("[data-rowmedia]");
              if (media && !reduce) {
                // Toca so a linha ativa, mas ja pede a proxima: quando o scroll
                // chegar nela o arquivo tende a estar bufferizado. Sem isso as
                // seis linhas entram na tela juntas e brigam pela mesma banda.
                if (on) loader.play(media);
                else {
                  loader.pause(media);
                  if (i === idx + 1) loader.want(media);
                }
              }
            });
          }
          const desc = sec.querySelector<HTMLElement>("[data-desc]");
          if (desc && desc.dataset.shown !== String(idx)) {
            desc.dataset.shown = String(idx);
            desc.style.opacity = "0";
            clearTimeout(descTimer);
            descTimer = setTimeout(() => {
              desc.textContent = descriptions[idx];
              desc.style.opacity = "1";
            }, 220);
          }
        }

        const cards = sec.querySelector<HTMLElement>("[data-cards]");
        if (cards) {
          const max = Math.max(0, cards.scrollWidth - window.innerWidth + 40);
          cards.style.transform = `translateX(${(-max * smooth(0.04, 0.96, p)).toFixed(1)}px)`;
        }
      });

      if (!reduce) {
        document
          .querySelectorAll<HTMLImageElement>("[data-parallax] img")
          .forEach((img) => {
            const r = img.parentElement!.getBoundingClientRect();
            if (r.top > vh || r.bottom < 0) return;
            const q = (r.top + r.height / 2 - vh / 2) / vh;
            img.style.transform = `translateY(${(q * -28).toFixed(1)}px)`;
          });
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    };

    // Observer largo: so enfileira o download, nao decide o play.
    const preloadIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          loader.want(e.target as HTMLVideoElement);
          preloadIo.unobserve(e.target);
        });
      },
      { rootMargin: PRELOAD_MARGIN }
    );

    // Observer curto: pausa o que saiu da tela e revela os textos.
    const viewIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (el.tagName === "VIDEO") {
            if (!e.isIntersecting) loader.pause(el as HTMLVideoElement);
          } else if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            viewIo.unobserve(el);
          }
        });
      },
      { rootMargin: REVEAL_MARGIN }
    );

    if (!reduce) {
      videos.forEach((v) => {
        // O hero ja esta baixando desde o HTML, nao precisa passar pela fila.
        if (v.preload !== "auto") preloadIo.observe(v);
        viewIo.observe(v);
      });
    }

    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "0";
      if (!reduce) el.style.transform = "translateY(22px)";
      el.style.transition =
        "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)";
      viewIo.observe(el);
    });

    // Um toque/clique do usuario derruba a restricao de autoplay do browser.
    const onGesture = () => loader.unblock();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointerdown", onGesture, { passive: true });
    window.addEventListener("keydown", onGesture);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      clearTimeout(descTimer);
      preloadIo.disconnect();
      viewIo.disconnect();
      loader.destroy();
    };
  }, []);

  return null;
}
