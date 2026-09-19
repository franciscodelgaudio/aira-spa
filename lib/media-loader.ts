// Controla quando cada <video> da pagina baixa e toca.
//
// O problema que isso resolve: com preload="none" o download so comeca quando
// alguem chama play() ou load(). Se varios videos entram na tela juntos (as seis
// linhas de Experiencias, por exemplo), eles disputam a mesma banda, nenhum
// termina a tempo e o usuario ve o poster parado ou tela preta. Alem disso um
// erro de rede num <video> e definitivo: o browser nao tenta de novo sozinho.
//
// Aqui os videos passam por uma fila com no maximo MAX_CONCURRENT downloads
// simultaneos, ordenada pela distancia ate a viewport, e cada falha (erro ou
// travamento no meio do download) vira nova tentativa com backoff. Esgotadas as
// tentativas o video fica em "failed" e o poster continua na tela — degrada,
// nao quebra.

const MAX_CONCURRENT = 2;
const MAX_RETRIES = 3;
/** Sem progresso por esse tempo com buffer insuficiente = tratado como falha. */
const STALL_MS = 8000;
const RETRY_BASE_MS = 400;

type State = "idle" | "loading" | "ready" | "failed";

type Entry = {
  el: HTMLVideoElement;
  state: State;
  /** Alguem ja pediu esse video (esta perto da viewport). */
  wanted: boolean;
  /** Deve estar tocando assim que houver buffer. */
  wantsPlay: boolean;
  retries: number;
  /** Forca load() na proxima tentativa, mesmo com algo ja bufferizado. */
  forceReload: boolean;
  stallTimer?: ReturnType<typeof setTimeout>;
  retryTimer?: ReturnType<typeof setTimeout>;
  detach: () => void;
};

export type MediaLoader = {
  register: (el: HTMLVideoElement) => void;
  /** Comeca a baixar quando houver vaga na fila. */
  want: (el: HTMLVideoElement) => void;
  /** want() + toca assim que der. Idempotente, pode ser chamado a cada frame. */
  play: (el: HTMLVideoElement) => void;
  pause: (el: HTMLVideoElement) => void;
  /** Limpa a marca de autoplay bloqueado. Chamar apos um gesto do usuario. */
  unblock: () => void;
  destroy: () => void;
};

/** Distancia em pixels entre o elemento e a viewport. 0 = visivel. */
function distance(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.bottom > 0 && r.top < vh) return 0;
  return r.top >= vh ? r.top - vh : -r.bottom;
}

/**
 * Na segunda tentativa em diante troca a query string das <source>. Se a falha
 * veio de uma resposta ruim que ficou no cache (ou de um proxy no meio do
 * caminho), repetir a mesma URL so devolveria o mesmo erro.
 */
function bustCache(el: HTMLVideoElement, attempt: number) {
  el.querySelectorAll("source").forEach((source) => {
    const base = source.src.split("?")[0];
    source.src = `${base}?retry=${attempt}`;
  });
}

export function createMediaLoader(): MediaLoader {
  const entries = new Map<HTMLVideoElement, Entry>();
  let destroyed = false;

  const clearTimers = (e: Entry) => {
    clearTimeout(e.stallTimer);
    clearTimeout(e.retryTimer);
    e.stallTimer = undefined;
    e.retryTimer = undefined;
  };

  /** Arma o watchdog de travamento; so vale enquanto o buffer for insuficiente. */
  const armStall = (e: Entry) => {
    clearTimeout(e.stallTimer);
    e.stallTimer = setTimeout(() => {
      if (e.state === "loading" && e.el.readyState < 3) fail(e);
    }, STALL_MS);
  };

  const tryPlay = (e: Entry) => {
    if (!e.wantsPlay || e.el.readyState < 3 || !e.el.paused) return;
    void e.el.play().catch((err: DOMException) => {
      // Autoplay barrado (iOS em Modo de Baixo Consumo, politica do browser) nao
      // e falha de rede: repetir nao adianta e o poster ja cobre a tela.
      if (err?.name === "NotAllowedError") e.el.dataset.blocked = "1";
    });
  };

  const start = (e: Entry) => {
    e.state = "loading";
    e.el.preload = "auto";
    // load() reseta o elemento e traz o poster de volta, entao so quando ainda
    // nao ha nada bufferizado — caso contrario cortaria um video ja tocando.
    // Numa retentativa e obrigatorio: sem load() o elemento nao releria as
    // <source> reescritas por bustCache().
    if (e.forceReload || e.el.readyState === 0) e.el.load();
    e.forceReload = false;
    armStall(e);
  };

  const fail = (e: Entry) => {
    clearTimers(e);
    if (e.retries >= MAX_RETRIES) {
      e.state = "failed";
      pump();
      return;
    }
    e.retries += 1;
    e.state = "idle";
    e.forceReload = true;
    e.retryTimer = setTimeout(() => {
      e.retryTimer = undefined;
      if (destroyed) return;
      if (e.retries >= 2) bustCache(e.el, e.retries);
      pump();
    }, RETRY_BASE_MS * 2 ** (e.retries - 1));
    // Libera a vaga na hora: outro video aproveita enquanto esse espera o backoff.
    pump();
  };

  /** Preenche as vagas livres com os videos pendentes mais proximos da tela. */
  const pump = () => {
    if (destroyed) return;
    let active = 0;
    const waiting: Entry[] = [];
    entries.forEach((e) => {
      if (e.state === "loading") active += 1;
      else if (e.state === "idle" && e.wanted && !e.retryTimer) waiting.push(e);
    });
    if (active >= MAX_CONCURRENT || waiting.length === 0) return;

    waiting.sort((a, b) => distance(a.el) - distance(b.el));
    for (const e of waiting) {
      if (active >= MAX_CONCURRENT) break;
      start(e);
      active += 1;
    }
  };

  const register = (el: HTMLVideoElement) => {
    if (entries.has(el)) return;

    const e: Entry = {
      el,
      state: "idle",
      wanted: false,
      wantsPlay: false,
      retries: 0,
      forceReload: false,
      detach: () => {},
    };

    const onCanPlay = () => {
      e.state = "ready";
      clearTimeout(e.stallTimer);
      e.stallTimer = undefined;
      tryPlay(e);
      pump();
    };
    // progress = chegou mais buffer, ou seja, a rede nao morreu.
    const onProgress = () => {
      if (e.state === "loading") armStall(e);
    };
    const onWaiting = () => armStall(e);
    const onError = () => fail(e);

    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("progress", onProgress);
    el.addEventListener("playing", onProgress);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("stalled", onWaiting);
    // So o error do proprio <video>. O error de um <source> dispara assim que
    // aquela fonte falha, com o browser ainda por tentar a seguinte: reagir a ele
    // reiniciaria a cadeia no WebM e o fallback MP4 nunca teria vez. O <video>
    // so emite error depois de esgotar todas as <source>, que e o momento certo
    // de contar como falha e reagendar.
    el.addEventListener("error", onError);

    e.detach = () => {
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("playing", onProgress);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("stalled", onWaiting);
      el.removeEventListener("error", onError);
    };

    entries.set(el, e);

    // O hero ja vem com preload="auto" no HTML: o browser comeca a baixar antes
    // do JS rodar, entao ele nao entra na fila, so e observado.
    if (el.preload === "auto") {
      e.wanted = true;
      e.state = el.readyState >= 3 ? "ready" : "loading";
      armStall(e);
    }
  };

  const want = (el: HTMLVideoElement) => {
    const e = entries.get(el);
    if (!e || e.wanted) return;
    e.wanted = true;
    pump();
  };

  const play = (el: HTMLVideoElement) => {
    const e = entries.get(el);
    if (!e || e.el.dataset.blocked) return;
    e.wantsPlay = true;
    if (!e.wanted) {
      e.wanted = true;
      pump();
    }
    tryPlay(e);
  };

  const pause = (el: HTMLVideoElement) => {
    const e = entries.get(el);
    if (!e) return;
    e.wantsPlay = false;
    if (!e.el.paused) e.el.pause();
  };

  // Depois de um gesto do usuario o browser passa a permitir play(). Os videos
  // que tinham sido barrados voltam a tocar em vez de ficar parados no poster
  // pelo resto da sessao.
  const unblock = () => {
    entries.forEach((e) => {
      if (!e.el.dataset.blocked) return;
      delete e.el.dataset.blocked;
      tryPlay(e);
    });
  };

  const destroy = () => {
    destroyed = true;
    entries.forEach((e) => {
      clearTimers(e);
      e.detach();
    });
    entries.clear();
  };

  return { register, want, play, pause, unblock, destroy };
}
