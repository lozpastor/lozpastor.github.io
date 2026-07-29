import "./index.css";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");
const heroSource = heroVideo?.querySelector<HTMLSourceElement>("source[data-src]");
const videoWakeEvents: Array<keyof WindowEventMap> = ["pointermove", "touchstart", "scroll", "keydown"];
let videoTriggersArmed = false;

const removeVideoWakeTriggers = () => {
  videoWakeEvents.forEach((eventName) => {
    window.removeEventListener(eventName, loadHeroVideo);
  });
  videoTriggersArmed = false;
};

const loadHeroVideo = () => {
  if (!heroVideo || !heroSource || reducedMotion.matches) return;

  const sourceUrl = heroSource.dataset.src;
  if (sourceUrl) {
    heroSource.src = sourceUrl;
    delete heroSource.dataset.src;
    heroVideo.load();
  }

  removeVideoWakeTriggers();
  void heroVideo.play().catch(() => {
    // The poster remains visible if browser autoplay policy blocks playback.
  });
};

const armVideoWakeTriggers = () => {
  if (videoTriggersArmed || !heroSource?.dataset.src) return;
  videoTriggersArmed = true;
  videoWakeEvents.forEach((eventName) => {
    window.addEventListener(eventName, loadHeroVideo, { passive: true, once: true });
  });
};

const syncVideoPreference = () => {
  if (!heroVideo) return;

  if (reducedMotion.matches) {
    heroVideo.pause();
    removeVideoWakeTriggers();
  } else if (heroSource?.dataset.src) {
    armVideoWakeTriggers();
  } else {
    void heroVideo.play().catch(() => {
      // The poster remains visible if browser autoplay policy blocks playback.
    });
  }
};

syncVideoPreference();
reducedMotion.addEventListener("change", syncVideoPreference);

const evidenceList = document.querySelector<HTMLElement>(".evidence-list");

if (evidenceList && !reducedMotion.matches && "IntersectionObserver" in window) {
  if (evidenceList.getBoundingClientRect().top > window.innerHeight * 0.9) {
    evidenceList.classList.add("is-pending");

    const evidenceObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        evidenceList.classList.add("is-visible");
        evidenceObserver.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    evidenceObserver.observe(evidenceList);
  }
}

const clamp = (value: number, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const initScrollScenes = () => {
  const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-scene]"));
  if (scenes.length === 0) return;

  let animationFrame = 0;

  const render = () => {
    animationFrame = 0;
    if (reducedMotion.matches) return;

    const viewportHeight = window.innerHeight;

    scenes.forEach((scene) => {
      const bounds = scene.getBoundingClientRect();
      if (bounds.bottom < -120 || bounds.top > viewportHeight + 120) return;

      const travel = viewportHeight + bounds.height;
      const progress = clamp((viewportHeight - bounds.top) / travel);
      const revealProgress = clamp((progress - 0.04) / 0.7);
      const parallax = (0.5 - progress) * 34;
      const tilt = scene.classList.contains("story-visual--decision")
        ? (progress - 0.5) * 1.2
        : 0;

      scene.style.setProperty("--scroll-progress", progress.toFixed(4));
      scene.style.setProperty("--reveal-inset", `${((1 - revealProgress) * 26).toFixed(2)}%`);
      scene.style.setProperty("--parallax-y", `${parallax.toFixed(2)}px`);
      scene.style.setProperty("--image-tilt", `${tilt.toFixed(3)}deg`);
      scene.style.setProperty("--signal-scale", revealProgress.toFixed(4));
    });
  };

  const requestRender = () => {
    if (animationFrame) return;
    animationFrame = window.requestAnimationFrame(render);
  };

  const syncPreference = () => {
    scenes.forEach((scene) => {
      scene.classList.toggle("is-scroll-enabled", !reducedMotion.matches);
      if (reducedMotion.matches) {
        scene.style.removeProperty("--reveal-inset");
        scene.style.removeProperty("--parallax-y");
        scene.style.removeProperty("--image-tilt");
        scene.style.removeProperty("--signal-scale");
      }
    });
    requestRender();
  };

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", requestRender, { passive: true });
  reducedMotion.addEventListener("change", syncPreference);
  syncPreference();
};

const initDashboardEmbed = () => {
  const project = document.querySelector<HTMLElement>("[data-dashboard-embed]");
  const stage = project?.querySelector<HTMLElement>("[data-dashboard-stage]");
  const loader = project?.querySelector<HTMLElement>("[data-dashboard-loader]");
  const mount = project?.querySelector<HTMLElement>("[data-dashboard-mount]");
  const fallback = project?.querySelector<HTMLElement>("[data-dashboard-fallback]");
  const fallbackCopy = project?.querySelector<HTMLElement>("[data-dashboard-fallback-copy]");
  const status = project?.querySelector<HTMLElement>("[data-dashboard-status]");
  const fullscreenButton = project?.querySelector<HTMLButtonElement>("[data-dashboard-fullscreen]");

  if (
    !project ||
    !stage ||
    !loader ||
    !mount ||
    !fallback ||
    !fallbackCopy ||
    !status
  ) {
    return;
  }

  const dashboardUrl = "https://lozpastor.github.io/Macroeconomic-Dashboard/";
  const compactViewport = window.matchMedia("(max-width: 760px)");
  let frame: HTMLIFrameElement | null = null;
  let readinessTimer: number | undefined;
  let timeoutTimer: number | undefined;
  let loadObserver: IntersectionObserver | undefined;
  let started = false;

  const clearTimers = () => {
    if (readinessTimer !== undefined) window.clearInterval(readinessTimer);
    if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    readinessTimer = undefined;
    timeoutTimer = undefined;
  };

  const markReady = () => {
    if (!frame) return;
    clearTimers();
    loader.hidden = true;
    fallback.hidden = true;
    stage.setAttribute("aria-busy", "false");
    frame.tabIndex = 0;
    frame.classList.add("is-ready");
    project.classList.add("is-ready");
    status.textContent = "Live dashboard loaded.";
  };

  const dashboardIsReady = () => {
    if (!frame) return false;

    try {
      const document = frame.contentDocument;
      if (!document) return false;
      return Boolean(document.querySelector("header"));
    } catch {
      return false;
    }
  };

  const showFallback = (message: string) => {
    clearTimers();
    frame?.remove();
    frame = null;
    loader.hidden = true;
    fallback.hidden = false;
    fallbackCopy.textContent = message;
    stage.setAttribute("aria-busy", "false");
    status.textContent = "The embedded dashboard is unavailable. A direct link is available.";
  };

  const showCompactFallback = () => {
    clearTimers();
    frame?.remove();
    frame = null;
    started = false;
    loader.hidden = true;
    fallback.hidden = false;
    fallbackCopy.textContent =
      "A static capture is shown. The live dashboard opens in a new tab on smaller screens.";
    stage.setAttribute("aria-busy", "false");
    project.classList.remove("is-ready");
    status.textContent = "Static dashboard preview shown for this screen size.";
  };

  const loadDashboard = () => {
    if (started || compactViewport.matches) return;
    started = true;
    fallback.hidden = true;
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
      const readyState = dashboardIsReady();

      if (readyState === true) {
        markReady();
        return;
      }

      readinessTimer = window.setInterval(() => {
        if (dashboardIsReady() === true) markReady();
      }, 180);
    });

    frame.addEventListener("error", () => {
      showFallback("The live product could not be embedded here.");
    });

    timeoutTimer = window.setTimeout(() => {
      showFallback("The live product is taking longer than expected.");
    }, 20000);
  };

  if ("IntersectionObserver" in window) {
    loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        if (compactViewport.matches) {
          showCompactFallback();
          return;
        }
        loadObserver?.disconnect();
        loadDashboard();
      },
      { rootMargin: "700px 0px", threshold: 0.01 },
    );
    loadObserver.observe(project);
  } else if (!compactViewport.matches) {
    loadDashboard();
  } else {
    showCompactFallback();
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
      fullscreenButton.textContent =
        document.fullscreenElement === project ? "Exit full screen" : "Full screen";
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

initScrollScenes();
initDashboardEmbed();
