import "./index.css";
import { initShootingStar } from "./shooting-star";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const initHeroVideo = () => {
  const video = document.querySelector<HTMLVideoElement>(".hero-video");
  const source = video?.querySelector<HTMLSourceElement>("source[data-src]");
  const wakeEvents: Array<keyof WindowEventMap> = [
    "pointermove",
    "touchstart",
    "scroll",
    "keydown",
  ];
  let triggersArmed = false;

  const removeWakeTriggers = () => {
    wakeEvents.forEach((eventName) => window.removeEventListener(eventName, loadVideo));
    triggersArmed = false;
  };

  const loadVideo = () => {
    if (!video || !source || reducedMotion.matches) return;

    const sourceUrl = source.dataset.src;
    if (sourceUrl) {
      source.src = sourceUrl;
      delete source.dataset.src;
      video.load();
    }

    removeWakeTriggers();
    void video.play().catch(() => {
      // The optimised poster remains visible if autoplay is unavailable.
    });
  };

  const armWakeTriggers = () => {
    if (triggersArmed || !source?.dataset.src) return;
    triggersArmed = true;
    wakeEvents.forEach((eventName) => {
      window.addEventListener(eventName, loadVideo, { passive: true, once: true });
    });
  };

  const syncPreference = () => {
    if (!video) return;

    if (reducedMotion.matches) {
      video.pause();
      removeWakeTriggers();
    } else if (source?.dataset.src) {
      armWakeTriggers();
    } else {
      void video.play().catch(() => undefined);
    }
  };

  syncPreference();
  reducedMotion.addEventListener("change", syncPreference);
};

const initReveals = () => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
  if (elements.length === 0 || reducedMotion.matches || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  elements.forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight * 0.78) {
      element.classList.add("is-pending");
    } else {
      element.classList.add("is-visible");
    }
  });
  document.documentElement.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.remove("is-pending");
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.04 },
  );

  elements
    .filter((element) => element.classList.contains("is-pending"))
    .forEach((element) => observer.observe(element));
};

const initCareerTrajectory = () => {
  const trajectory = document.querySelector<HTMLElement>("[data-career-trajectory]");
  const steps = Array.from(
    trajectory?.querySelectorAll<HTMLElement>("[data-trajectory-step]") ?? [],
  );
  if (!trajectory || steps.length === 0 || reducedMotion.matches) return;

  trajectory.classList.add("is-scroll-driven");
  let animationFrame = 0;

  const render = () => {
    animationFrame = 0;
    const bounds = trajectory.getBoundingClientRect();
    const travel = Math.max(window.innerHeight * 0.62, bounds.height * 0.72);
    const progress = clamp((window.innerHeight * 0.84 - bounds.top) / travel);

    trajectory.style.setProperty("--trajectory-progress", progress.toFixed(4));
    steps.forEach((step, index) => {
      const start = index * 0.23;
      const stepProgress = clamp((progress - start) / 0.3);
      step.style.setProperty("--step-progress", stepProgress.toFixed(4));
    });
  };

  const requestRender = () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  requestRender();
};

type CanvasPoint = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

const initReconciliation = () => {
  const figure = document.querySelector<HTMLElement>("[data-reconcile]");
  const canvas = figure?.querySelector<HTMLCanvasElement>("[data-reconcile-canvas]");
  const context = canvas?.getContext("2d");
  if (!figure || !canvas || !context) return;

  const pointCount = 100;
  let points: CanvasPoint[] = [];
  let animationFrame = 0;
  let width = 1;
  let height = 1;

  const randomSequence = () => {
    let state = 1709;
    return () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };
  };

  const rebuild = () => {
    const bounds = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const random = randomSequence();
    const pad = Math.max(18, width * 0.035);
    const sourceWidth = width * 0.34;
    const sourceHeight = height - pad * 2;
    const targetLeft = width * 0.52;
    const targetWidth = width - targetLeft - pad;
    const gap = Math.max(10, width * 0.018);
    const groupWidth = (targetWidth - gap * 2) / 3;
    const groupHeight = (sourceHeight - gap) / 2;

    points = Array.from({ length: pointCount }, (_, index) => {
      const column = index % 10;
      const row = Math.floor(index / 10);
      const targetBlock = index % 6;
      const targetColumn = targetBlock % 3;
      const targetRow = Math.floor(targetBlock / 3);
      const withinX = 0.18 + random() * 0.64;
      const withinY = 0.2 + random() * 0.6;

      return {
        fromX: pad + (column / 9) * sourceWidth + (random() - 0.5) * 8,
        fromY: pad + (row / 9) * sourceHeight + (random() - 0.5) * 8,
        toX: targetLeft + targetColumn * (groupWidth + gap) + withinX * groupWidth,
        toY: pad + targetRow * (groupHeight + gap) + withinY * groupHeight,
      };
    });
  };

  const draw = (progress: number) => {
    context.clearRect(0, 0, width, height);
    const pad = Math.max(18, width * 0.035);
    const targetLeft = width * 0.52;
    const targetWidth = width - targetLeft - pad;
    const gap = Math.max(10, width * 0.018);
    const groupWidth = (targetWidth - gap * 2) / 3;
    const groupHeight = (height - pad * 2 - gap) / 2;

    if (progress > 0.48) {
      const groupProgress = clamp((progress - 0.48) / 0.42);
      context.strokeStyle = "rgba(126, 230, 209, 0.2)";
      context.lineWidth = 1;
      context.globalAlpha = groupProgress;
      for (let index = 0; index < 6; index += 1) {
        const column = index % 3;
        const row = Math.floor(index / 3);
        context.beginPath();
        context.roundRect(
          targetLeft + column * (groupWidth + gap),
          pad + row * (groupHeight + gap),
          groupWidth,
          groupHeight,
          5,
        );
        context.stroke();
      }
      context.globalAlpha = 1;
    }

    const eased = progress * progress * (3 - 2 * progress);
    points.forEach((point, index) => {
      const x = point.fromX + (point.toX - point.fromX) * eased;
      const y = point.fromY + (point.toY - point.fromY) * eased;
      context.beginPath();
      context.fillStyle =
        index % 10 === 0 ? "rgba(242, 245, 243, 0.94)" : "rgba(126, 230, 209, 0.72)";
      context.arc(x, y, index % 10 === 0 ? 2.15 : 1.45, 0, Math.PI * 2);
      context.fill();
    });
  };

  const render = () => {
    animationFrame = 0;
    if (reducedMotion.matches) {
      draw(1);
      return;
    }
    const bounds = figure.getBoundingClientRect();
    const travel = Math.max(window.innerHeight * 0.5, bounds.height * 0.72);
    const progress = clamp((window.innerHeight * 0.82 - bounds.top) / travel);
    draw(progress);
  };

  const resizeObserver = new ResizeObserver(() => {
    rebuild();
    render();
  });
  resizeObserver.observe(canvas);
  rebuild();
  const requestRender = () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  requestRender();
};

const initDashboardEmbed = () => {
  const project = document.querySelector<HTMLElement>("[data-dashboard-embed]");
  const stage = project?.querySelector<HTMLElement>("[data-dashboard-stage]");
  const loader = project?.querySelector<HTMLElement>("[data-dashboard-loader]");
  const mount = project?.querySelector<HTMLElement>("[data-dashboard-mount]");
  const fallback = project?.querySelector<HTMLElement>("[data-dashboard-fallback]");
  const fallbackCopy = project?.querySelector<HTMLElement>("[data-dashboard-fallback-copy]");
  const status = project?.querySelector<HTMLElement>("[data-dashboard-status]");
  const fullscreenButton =
    project?.querySelector<HTMLButtonElement>("[data-dashboard-fullscreen]");

  if (!project || !stage || !loader || !mount || !fallback || !fallbackCopy || !status) return;

  const dashboardUrl = "https://lozpastor.github.io/Macroeconomic-Dashboard/";
  const compactViewport = window.matchMedia("(max-width: 760px)");
  const locallyCrossOrigin =
    window.location.hostname !== "lozpastor.github.io" &&
    new URL(dashboardUrl).origin !== window.location.origin;
  let frame: HTMLIFrameElement | null = null;
  let readinessTimer: number | undefined;
  let timeoutTimer: number | undefined;
  let loadObserver: IntersectionObserver | undefined;
  let started = false;

  const syncDashboardScale = () => {
    const scale = stage.clientWidth / 1440;
    stage.style.setProperty("--dashboard-scale", scale.toFixed(5));
  };
  const stageObserver = new ResizeObserver(syncDashboardScale);
  stageObserver.observe(stage);
  syncDashboardScale();

  const clearTimers = () => {
    if (readinessTimer !== undefined) window.clearInterval(readinessTimer);
    if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    readinessTimer = undefined;
    timeoutTimer = undefined;
  };

  const showFallback = (message: string) => {
    clearTimers();
    frame?.remove();
    frame = null;
    mount.classList.remove("is-ready");
    fallback.classList.remove("is-hidden");
    loader.hidden = true;
    stage.setAttribute("aria-busy", "false");
    fallbackCopy.textContent = message;
    status.textContent = "Static dashboard preview shown. A direct link is available.";
  };

  const markReady = () => {
    if (!frame) return;
    clearTimers();
    loader.hidden = true;
    fallback.classList.add("is-hidden");
    mount.classList.add("is-ready");
    stage.setAttribute("aria-busy", "false");
    frame.tabIndex = 0;
    status.textContent = "Live dashboard loaded.";
  };

  const dashboardIsReady = () => {
    if (!frame) return false;
    try {
      const frameDocument = frame.contentDocument;
      if (!frameDocument) return false;
      const visibleText = frameDocument.body?.innerText ?? "";
      const geometryCount = frameDocument.querySelectorAll("svg path").length;
      return (
        Boolean(frameDocument.querySelector("header")) &&
        geometryCount > 200 &&
        !visibleText.includes("Cargando datos macroeconomicos")
      );
    } catch {
      return false;
    }
  };

  const loadDashboard = () => {
    if (started || compactViewport.matches || locallyCrossOrigin) return;
    started = true;
    loader.hidden = false;
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Connecting to the live dashboard…";

    frame = document.createElement("iframe");
    frame.src = dashboardUrl;
    frame.title = "Alejandro Lozano’s live Macroeconomic Dashboard";
    frame.loading = "eager";
    frame.tabIndex = -1;
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    mount.append(frame);

    frame.addEventListener("load", () => {
      if (dashboardIsReady()) {
        markReady();
        return;
      }
      readinessTimer = window.setInterval(() => {
        if (dashboardIsReady()) markReady();
      }, 180);
    });
    frame.addEventListener("error", () => showFallback("The live product could not be embedded here."));
    timeoutTimer = window.setTimeout(
      () => showFallback("The live product is taking longer than expected."),
      20_000,
    );
  };

  const showCompactFallback = () => {
    clearTimers();
    frame?.remove();
    frame = null;
    started = false;
    mount.classList.remove("is-ready");
    fallback.classList.remove("is-hidden");
    loader.hidden = true;
    stage.setAttribute("aria-busy", "false");
    fallbackCopy.textContent =
      "A static capture is shown. The live dashboard opens in a new tab on smaller screens.";
    status.textContent = "Static dashboard preview shown for this screen size.";
  };

  if (compactViewport.matches || locallyCrossOrigin) {
    showCompactFallback();
  } else if ("IntersectionObserver" in window) {
    loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        loadObserver?.disconnect();
        loadDashboard();
      },
      { rootMargin: "700px 0px", threshold: 0.01 },
    );
    loadObserver.observe(project);
  } else {
    loadDashboard();
  }

  if (fullscreenButton && typeof project.requestFullscreen === "function") {
    fullscreenButton.hidden = compactViewport.matches;
    fullscreenButton.addEventListener("click", () => {
      if (document.fullscreenElement === project) {
        void document.exitFullscreen();
      } else {
        loadDashboard();
        void project.requestFullscreen().catch(() => {
          status.textContent = "Full-screen mode is unavailable in this browser.";
        });
      }
    });
    document.addEventListener("fullscreenchange", () => {
      const isFullscreen = document.fullscreenElement === project;
      project.classList.toggle("is-fullscreen", isFullscreen);
      document.body.classList.toggle("is-dashboard-fullscreen", isFullscreen);
      fullscreenButton.textContent = isFullscreen ? "Exit full screen" : "Full screen";
    });
  }

  compactViewport.addEventListener("change", (event) => {
    if (fullscreenButton && typeof project.requestFullscreen === "function") {
      fullscreenButton.hidden = event.matches;
    }
    if (event.matches) {
      showCompactFallback();
      return;
    }
    const bounds = project.getBoundingClientRect();
    if (bounds.top < window.innerHeight + 700 && bounds.bottom > -700) {
      loadObserver?.disconnect();
      loadDashboard();
    }
  });
};

const year = document.querySelector<HTMLElement>("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

initHeroVideo();
initReveals();
initCareerTrajectory();
initReconciliation();
initDashboardEmbed();
initShootingStar();
