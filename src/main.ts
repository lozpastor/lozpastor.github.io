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

  document.documentElement.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        element.classList.add("is-visible");
        observer.unobserve(element);
      });
    },
    { rootMargin: "0px 0px -16% 0px", threshold: 0.12 },
  );

  elements.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.76) {
      element.classList.add("is-visible");
    } else {
      observer.observe(element);
    }
  });
};

const initCareerTrajectory = () => {
  const trajectory = document.querySelector<HTMLElement>("[data-career-trajectory]");
  const steps = Array.from(
    trajectory?.querySelectorAll<HTMLElement>("[data-trajectory-step]") ?? [],
  );
  if (!trajectory || steps.length === 0) return;
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    trajectory.classList.add("is-complete");
    return;
  }

  trajectory.classList.add("is-sequenced");
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      trajectory.classList.add("is-complete");
      observer.disconnect();
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.3 },
  );
  observer.observe(trajectory);
};

type CanvasPoint = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  curve: number;
  delay: number;
};

const initReconciliation = () => {
  const figure = document.querySelector<HTMLElement>("[data-reconcile]");
  const canvas = figure?.querySelector<HTMLCanvasElement>("[data-reconcile-canvas]");
  const context = canvas?.getContext("2d");
  if (!figure || !canvas || !context) return;

  const pointCount = 100;
  let points: CanvasPoint[] = [];
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
        curve: (random() - 0.5) * Math.min(52, height * 0.14),
        delay: random() * 0.09,
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

    points.forEach((point, index) => {
      const localProgress = clamp((progress - point.delay) / 0.91);
      const eased =
        localProgress < 0.5
          ? 4 * localProgress * localProgress * localProgress
          : 1 - Math.pow(-2 * localProgress + 2, 3) / 2;
      const inverse = 1 - eased;
      const middleX = (point.fromX + point.toX) / 2;
      const middleY = (point.fromY + point.toY) / 2 + point.curve;
      const x = inverse * inverse * point.fromX + 2 * inverse * eased * middleX + eased * eased * point.toX;
      const y = inverse * inverse * point.fromY + 2 * inverse * eased * middleY + eased * eased * point.toY;
      context.beginPath();
      context.fillStyle =
        index % 10 === 0 ? "rgba(242, 245, 243, 0.94)" : "rgba(126, 230, 209, 0.72)";
      context.arc(x, y, index % 10 === 0 ? 2.15 : 1.45, 0, Math.PI * 2);
      context.fill();
    });
  };

  const replayDelay = 3200;
  let progress = reducedMotion.matches ? 1 : 0;
  let isVisible = false;
  let frameId = 0;
  let timerId = 0;
  let cycle = 0;
  let startedAt = 0;

  const render = (time: number) => {
    if (!isVisible) return;
    if (!startedAt) startedAt = time;
    progress = clamp((time - startedAt) / 1900);
    draw(progress);
    if (progress < 1) {
      frameId = window.requestAnimationFrame(render);
    } else {
      scheduleReplay();
    }
  };

  const clearCycle = () => {
    window.cancelAnimationFrame(frameId);
    window.clearTimeout(timerId);
    frameId = 0;
    timerId = 0;
    figure.classList.remove("is-restarting");
  };

  const startAnimation = () => {
    if (!isVisible || reducedMotion.matches) return;
    clearCycle();
    cycle += 1;
    figure.dataset.visualCycle = String(cycle);
    progress = 0;
    startedAt = 0;
    draw(0);
    frameId = window.requestAnimationFrame(render);
  };

  const scheduleReplay = () => {
    if (!isVisible || reducedMotion.matches) return;
    timerId = window.setTimeout(() => {
      if (!isVisible) return;
      figure.classList.add("is-restarting");
      timerId = window.setTimeout(() => {
        progress = 0;
        draw(0);
        timerId = window.setTimeout(() => {
          figure.classList.remove("is-restarting");
          startAnimation();
        }, 380);
      }, 460);
    }, replayDelay);
  };

  const resizeObserver = new ResizeObserver(() => {
    rebuild();
    draw(progress);
  });
  resizeObserver.observe(canvas);
  rebuild();
  draw(progress);

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    if (reducedMotion.matches) {
      draw(1);
    } else {
      isVisible = true;
      startAnimation();
    }
  } else {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else {
          clearCycle();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.32 },
    );
    observer.observe(figure);
  }
};

const initWorkVisuals = () => {
  const visuals = Array.from(document.querySelectorAll<HTMLElement>("[data-work-visual]"));
  if (visuals.length === 0 || reducedMotion.matches) return;

  const updateVisual = (visual: HTMLElement, progress: number) => {
    visual.style.setProperty("--visual-progress", progress.toFixed(4));
    if (!visual.hasAttribute("data-performance-visual")) return;

    const runtime = 1 - progress * 0.5;
    visual.style.setProperty("--runtime-width", `${(runtime * 100).toFixed(2)}%`);
    const output = visual.querySelector<HTMLElement>("[data-runtime-output]");
    if (output) output.textContent = `${runtime.toFixed(2)}×`;
  };

  type VisualLoop = {
    visible: boolean;
    frameId: number;
    timerId: number;
    cycle: number;
  };

  const loops = new Map<HTMLElement, VisualLoop>();
  const replayDelay = 3200;

  const clearLoop = (visual: HTMLElement, loop: VisualLoop) => {
    window.cancelAnimationFrame(loop.frameId);
    window.clearTimeout(loop.timerId);
    loop.frameId = 0;
    loop.timerId = 0;
    visual.classList.remove("is-restarting");
  };

  const animateVisual = (visual: HTMLElement, loop: VisualLoop) => {
    if (!loop.visible) return;
    clearLoop(visual, loop);
    loop.cycle += 1;
    visual.dataset.visualCycle = String(loop.cycle);
    updateVisual(visual, 0);
    let startedAt = 0;

    const render = (time: number) => {
      if (!loop.visible) return;
      if (!startedAt) startedAt = time;
      const progress = clamp((time - startedAt) / 1450);
      updateVisual(visual, progress);
      if (progress < 1) {
        loop.frameId = window.requestAnimationFrame(render);
      } else {
        loop.timerId = window.setTimeout(() => {
          if (!loop.visible) return;
          visual.classList.add("is-restarting");
          loop.timerId = window.setTimeout(() => {
            updateVisual(visual, 0);
            loop.timerId = window.setTimeout(() => {
              visual.classList.remove("is-restarting");
              animateVisual(visual, loop);
            }, 380);
          }, 460);
        }, replayDelay);
      }
    };
    loop.frameId = window.requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const visual = entry.target as HTMLElement;
        const loop = loops.get(visual);
        if (!loop) return;
        loop.visible = entry.isIntersecting;
        if (loop.visible) {
          animateVisual(visual, loop);
        } else {
          clearLoop(visual, loop);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.32 },
  );

  visuals.forEach((visual) => {
    updateVisual(visual, 0);
    loops.set(visual, { visible: false, frameId: 0, timerId: 0, cycle: 0 });
    observer.observe(visual);
  });
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

const initAdoptEmbed = () => {
  const project = document.querySelector<HTMLElement>(".live-project--adopt[data-live-project]");
  const stage = project?.querySelector<HTMLElement>("[data-project-stage]");
  const loader = project?.querySelector<HTMLElement>("[data-project-loader]");
  const mount = project?.querySelector<HTMLElement>("[data-project-mount]");
  const fallback = project?.querySelector<HTMLElement>("[data-project-fallback]");
  const fallbackCopy = project?.querySelector<HTMLElement>("[data-project-fallback-copy]");
  const status = project?.querySelector<HTMLElement>("[data-project-status]");
  const interactionButton =
    project?.querySelector<HTMLButtonElement>("[data-adopt-interact]");
  const fullscreenButton =
    project?.querySelector<HTMLButtonElement>("[data-dashboard-fullscreen]");

  if (!project || !stage || !loader || !mount || !fallback || !fallbackCopy || !status) return;

  const projectUrl = project.dataset.projectUrl;
  const sourceWidth = Number(project.dataset.projectWidth) || 1440;
  const viewportHeight = Number(project.dataset.projectHeight) || 780;
  const contentHeight =
    Number(project.dataset.projectContentHeight) || viewportHeight;
  const compactViewport = window.matchMedia("(max-width: 760px)");
  const localPreview = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (!projectUrl) return;

  stage.style.setProperty("--project-ratio", `${sourceWidth} / ${viewportHeight}`);
  stage.style.setProperty("--project-source-width", `${sourceWidth}px`);
  stage.style.setProperty("--project-source-height", `${contentHeight}px`);

  let frame: HTMLIFrameElement | null = null;
  let timeoutTimer: number | undefined;
  let started = false;
  let isVisible = false;
  let isInteractive = false;
  let panAnimation: Animation | null = null;

  const stopAutoScroll = () => {
    panAnimation?.cancel();
    panAnimation = null;
    mount.style.removeProperty("transform");
  };

  const syncAutoScroll = () => {
    stopAutoScroll();
    if (
      !frame ||
      !mount.classList.contains("is-ready") ||
      !isVisible ||
      isInteractive ||
      reducedMotion.matches ||
      compactViewport.matches
    ) {
      return;
    }

    const scale = stage.clientWidth / sourceWidth;
    const travel = Math.max(0, contentHeight * scale - stage.clientHeight);
    if (travel < 12) return;

    panAnimation = mount.animate(
      [
        { transform: "translate3d(0, 0, 0)", offset: 0 },
        { transform: `translate3d(0, ${(-travel).toFixed(2)}px, 0)`, offset: 0.88 },
        { transform: `translate3d(0, ${(-travel).toFixed(2)}px, 0)`, offset: 1 },
      ],
      {
        delay: 1_000,
        duration: 11_000,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
        direction: "alternate",
        iterations: Number.POSITIVE_INFINITY,
      },
    );
  };

  const setInteractiveMode = (enabled: boolean) => {
    if (!frame || enabled === isInteractive) return;
    isInteractive = enabled;
    stopAutoScroll();
    project.classList.toggle("is-interactive", enabled);
    stage.style.setProperty(
      "--project-source-height",
      `${enabled ? viewportHeight : contentHeight}px`,
    );
    interactionButton?.setAttribute("aria-pressed", String(enabled));

    if (enabled) {
      frame.removeAttribute("scrolling");
      if (interactionButton) interactionButton.textContent = "Resume preview";
      status.textContent =
        "Interactive AdoptAI mode enabled. The automatic preview is paused.";
      window.requestAnimationFrame(() => frame?.focus());
    } else {
      frame.setAttribute("scrolling", "no");
      if (interactionButton) interactionButton.textContent = "Explore";
      status.textContent = "Automatic AdoptAI preview resumed.";
      window.requestAnimationFrame(syncAutoScroll);
    }
  };

  const syncScale = () => {
    stage.style.setProperty("--project-scale", (stage.clientWidth / sourceWidth).toFixed(5));
    if (mount.classList.contains("is-ready")) {
      window.requestAnimationFrame(syncAutoScroll);
    }
  };
  const stageObserver = new ResizeObserver(syncScale);
  stageObserver.observe(stage);
  syncScale();

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
      if (isVisible) {
        syncAutoScroll();
      } else {
        panAnimation?.pause();
      }
    },
    { rootMargin: "0px", threshold: 0.18 },
  );
  visibilityObserver.observe(project);

  const showFallback = (message: string) => {
    if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    frame?.remove();
    frame = null;
    mount.classList.remove("is-ready");
    fallback.classList.remove("is-hidden");
    loader.hidden = true;
    stage.setAttribute("aria-busy", "false");
    stopAutoScroll();
    project.classList.remove("is-interactive");
    isInteractive = false;
    if (interactionButton) interactionButton.disabled = true;
    fallbackCopy.textContent = message;
    status.textContent = "Static AdoptAI preview shown. A direct link is available.";
  };

  const markReady = () => {
    if (!frame) return;
    if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    loader.hidden = true;
    fallback.classList.add("is-hidden");
    mount.classList.add("is-ready");
    stage.setAttribute("aria-busy", "false");
    frame.tabIndex = 0;
    if (interactionButton) {
      interactionButton.disabled = false;
      interactionButton.setAttribute("aria-pressed", "false");
    }
    status.textContent = "Live AdoptAI product loaded. The page preview scrolls automatically.";
    syncAutoScroll();
  };

  const loadProject = () => {
    if (started || compactViewport.matches || localPreview) return;
    started = true;
    loader.hidden = false;
    stage.setAttribute("aria-busy", "true");
    status.textContent = "Connecting to AdoptAI…";

    frame = document.createElement("iframe");
    frame.src = projectUrl;
    frame.title = project.dataset.projectTitle ?? "AdoptAI live product";
    frame.loading = "eager";
    frame.tabIndex = -1;
    frame.setAttribute("scrolling", "no");
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    mount.append(frame);

    frame.addEventListener("load", markReady, { once: true });
    frame.addEventListener(
      "error",
      () => showFallback("AdoptAI could not be embedded here. Use the direct link above."),
      { once: true },
    );
    timeoutTimer = window.setTimeout(
      () => showFallback("AdoptAI is taking longer than expected. Use the direct link above."),
      20_000,
    );
  };

  if (compactViewport.matches || localPreview) {
    showFallback("A static capture is shown. AdoptAI opens in a new tab on this screen.");
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        loadProject();
      },
      { rootMargin: "700px 0px", threshold: 0.01 },
    );
    observer.observe(project);
  } else {
    loadProject();
  }

  if (fullscreenButton && typeof project.requestFullscreen === "function") {
    fullscreenButton.hidden = compactViewport.matches;
    fullscreenButton.addEventListener("click", () => {
      if (document.fullscreenElement === project) {
        void document.exitFullscreen();
      } else {
        loadProject();
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
      window.requestAnimationFrame(syncAutoScroll);
    });
  }

  interactionButton?.addEventListener("click", () => {
    setInteractiveMode(!isInteractive);
  });
  window.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (frame && document.activeElement === frame) setInteractiveMode(true);
    }, 0);
  });

  reducedMotion.addEventListener("change", syncAutoScroll);
  compactViewport.addEventListener("change", syncAutoScroll);
};

type PointerTrailPoint = {
  x: number;
  y: number;
  life: number;
};

const initContactInteraction = () => {
  const contact = document.querySelector<HTMLElement>(".contact");
  const canvas = contact?.querySelector<HTMLCanvasElement>("[data-contact-trail]");
  const context = canvas?.getContext("2d");
  if (!contact || !canvas || !context || reducedMotion.matches) return;

  let width = 1;
  let height = 1;
  let frameId = 0;
  let lastPoint: PointerTrailPoint | null = null;
  let points: PointerTrailPoint[] = [];

  const resize = () => {
    const bounds = contact.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const render = () => {
    frameId = 0;
    context.clearRect(0, 0, width, height);
    points = points
      .map((point) => ({ ...point, life: point.life - 0.028 }))
      .filter((point) => point.life > 0);

    points.forEach((point, index) => {
      const previous = points[index - 1];
      if (previous) {
        context.beginPath();
        context.moveTo(previous.x, previous.y);
        context.lineTo(point.x, point.y);
        context.strokeStyle = `rgba(126, 230, 209, ${point.life * 0.3})`;
        context.lineWidth = 1.2 + point.life * 1.4;
        context.stroke();
      }

      context.beginPath();
      context.fillStyle = `rgba(226, 255, 249, ${point.life * 0.42})`;
      context.arc(point.x, point.y, 1.2 + point.life * 2.2, 0, Math.PI * 2);
      context.fill();
    });

    if (points.length > 0) frameId = window.requestAnimationFrame(render);
  };

  const requestRender = () => {
    if (!frameId) frameId = window.requestAnimationFrame(render);
  };

  contact.addEventListener("pointermove", (event) => {
    const bounds = contact.getBoundingClientRect();
    const point: PointerTrailPoint = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      life: 1,
    };
    contact.style.setProperty("--pointer-x", `${point.x.toFixed(1)}px`);
    contact.style.setProperty("--pointer-y", `${point.y.toFixed(1)}px`);
    contact.classList.add("is-pointer-active");

    if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 5) {
      points.push(point);
      if (points.length > 42) points.shift();
      lastPoint = point;
    }
    requestRender();
  });

  contact.addEventListener("pointerleave", () => {
    contact.classList.remove("is-pointer-active");
    lastPoint = null;
    requestRender();
  });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(contact);
  resize();
};

const year = document.querySelector<HTMLElement>("[data-current-year]");
if (year) year.textContent = String(new Date().getFullYear());

initHeroVideo();
initReveals();
initCareerTrajectory();
initReconciliation();
initWorkVisuals();
initDashboardEmbed();
initAdoptEmbed();
initContactInteraction();
initShootingStar();
