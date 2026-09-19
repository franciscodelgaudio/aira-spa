"use client";

import { useEffect } from "react";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};

const descriptions = [
  "Para soltar tensões e desacelerar.",
  "Calor, aroma e toque em uma experiência sensorial.",
  "Uma pausa delicada para cabeça e mente.",
  "Leveza e cuidado para o corpo.",
  "Calor terapêutico e profundo relaxamento.",
  "Hidratação, massagem e renovação.",
];

export default function ScrollEngine() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeRow = -1;
    let ticking = false;
    let descTimer: ReturnType<typeof setTimeout>;

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
            if (o > 0.05) void v.play().catch(() => {});
            else v.pause();
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
        if (dim) dim.style.background = `rgba(36,31,27,${(0.42 + 0.22 * p).toFixed(3)})`;

        if (sec.dataset.steps) {
          const n = parseInt(sec.dataset.steps, 10);
          const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
          if (idx !== activeRow) {
            activeRow = idx;
            sec.querySelectorAll<HTMLElement>("[data-row]").forEach((row, i) => {
              const on = i === idx;
              row.style.flexGrow = on ? "2.6" : "1";
              const label = row.querySelector<HTMLElement>("[data-rowlabel]");
              if (label) {
                label.style.color = on ? "#FFFFFF" : "rgba(246,242,234,.72)";
                label.style.fontSize = on
                  ? "clamp(16px,1.8vw,26px)"
                  : "clamp(13px,1.3vw,19px)";
              }
              const media = row.querySelector<HTMLVideoElement>("[data-rowmedia]");
              if (media && !reduce) {
                if (on) {
                  if (media.preload === "none") media.preload = "auto";
                  void media.play().catch(() => {});
                } else {
                  media.pause();
                }
              }
            });
            const desc = sec.querySelector<HTMLElement>("[data-desc]");
            if (desc) {
              desc.style.opacity = "0";
              clearTimeout(descTimer);
              descTimer = setTimeout(() => {
                desc.textContent = descriptions[idx];
                desc.style.opacity = "1";
              }, 220);
            }
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

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (el.tagName === "VIDEO") {
            const v = el as HTMLVideoElement;
            if (e.isIntersecting) {
              if (v.preload === "none") v.preload = "auto";
              if (!v.dataset.manual && !reduce) void v.play().catch(() => {});
            } else {
              v.pause();
            }
          } else if (e.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "10% 0px" }
    );

    document
      .querySelectorAll<HTMLVideoElement>("video[data-lazy]")
      .forEach((v) => io.observe(v));
    document
      .querySelectorAll<HTMLElement>("[data-rowmedia]")
      .forEach((v) => (v.dataset.manual = "1"));
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      el.style.opacity = "0";
      if (!reduce) el.style.transform = "translateY(22px)";
      el.style.transition =
        "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)";
      io.observe(el);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(descTimer);
      io.disconnect();
    };
  }, []);

  return null;
}
