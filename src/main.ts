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

const initDashboardDialog = () => {
  const dialog = document.querySelector<HTMLDialogElement>("#dashboard-dialog");
  const triggers = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-dashboard-open]"));
  const closeButton = dialog?.querySelector<HTMLButtonElement>("[data-dashboard-close]");
  const loader = dialog?.querySelector<HTMLElement>("[data-dashboard-loader]");
  const mount = dialog?.querySelector<HTMLElement>("[data-dashboard-mount]");
  const fallback = dialog?.querySelector<HTMLElement>("[data-dashboard-fallback]");
  const fallbackCopy = dialog?.querySelector<HTMLElement>("[data-dashboard-fallback-copy]");
  const status = dialog?.querySelector<HTMLElement>("[data-dashboard-status]");

  if (
    !dialog ||
    !closeButton ||
    !loader ||
    !mount ||
    !fallback ||
    !fallbackCopy ||
    !status ||
    typeof dialog.showModal !== "function"
  ) {
    return;
  }

  const dashboardPath = "/Macroeconomic-Dashboard/";
  const compactViewport = window.matchMedia("(max-width: 767px), (max-height: 619px)");
  let activeTrigger: HTMLAnchorElement | null = null;
  let activeFrame: HTMLIFrameElement | null = null;
  let readinessTimer: number | undefined;
  let timeoutTimer: number | undefined;
  let backdropPointerDown = false;

  triggers.forEach((trigger) => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-controls", dialog.id);
  });

  const clearTimers = () => {
    if (readinessTimer !== undefined) window.clearInterval(readinessTimer);
    if (timeoutTimer !== undefined) window.clearTimeout(timeoutTimer);
    readinessTimer = undefined;
    timeoutTimer = undefined;
  };

  const removeFrame = () => {
    clearTimers();
    activeFrame?.remove();
    activeFrame = null;
  };

  const showFallback = (message: string) => {
    removeFrame();
    loader.hidden = true;
    fallback.hidden = false;
    fallbackCopy.textContent = message;
    status.textContent = "Static preview shown. A direct link to the full dashboard is available.";
  };

  const markFrameReady = () => {
    if (!activeFrame) return;
    clearTimers();
    loader.hidden = true;
    fallback.hidden = true;
    activeFrame.tabIndex = 0;
    activeFrame.classList.add("is-ready");
    status.textContent = "Live dashboard loaded.";

    try {
      activeFrame.contentWindow?.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && dialog.open) dialog.close();
      });
    } catch {
      // The parent dialog remains fully operable if iframe access changes.
    }
  };

  const frameIsReady = () => {
    try {
      return Boolean(activeFrame?.contentDocument?.querySelector("header"));
    } catch {
      return false;
    }
  };

  const loadDashboard = () => {
    loader.hidden = false;
    fallback.hidden = true;
    status.textContent = "Connecting to the live dataset…";

    const frame = document.createElement("iframe");
    frame.title = "Interactive Macroeconomic Dashboard";
    frame.src = dashboardPath;
    frame.loading = "eager";
    frame.tabIndex = -1;
    frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    activeFrame = frame;
    mount.append(frame);

    frame.addEventListener("load", () => {
      if (frameIsReady()) {
        markFrameReady();
        return;
      }

      readinessTimer = window.setInterval(() => {
        if (frameIsReady()) markFrameReady();
      }, 160);
    });

    frame.addEventListener("error", () => {
      showFallback("The live preview could not be loaded inside this page.");
    });

    timeoutTimer = window.setTimeout(() => {
      showFallback("The live preview is taking longer than expected.");
    }, 15000);
  };

  const lockPage = () => {
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-compensation", `${scrollbarGap}px`);
    document.documentElement.classList.add("dialog-open");
  };

  const unlockPage = () => {
    document.documentElement.classList.remove("dialog-open");
    document.documentElement.style.removeProperty("--scrollbar-compensation");
  };

  const openDialog = (trigger: HTMLAnchorElement) => {
    activeTrigger = trigger;
    dialog.showModal();
    lockPage();
    closeButton.focus({ preventScroll: true });

    if (compactViewport.matches) {
      showFallback("The interactive dashboard is best used in a larger viewport.");
    } else {
      loadDashboard();
    }
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      openDialog(trigger);
    });
  });

  closeButton.addEventListener("click", closeDialog);

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  dialog.addEventListener("pointerdown", (event) => {
    backdropPointerDown = event.target === dialog;
  });

  dialog.addEventListener("pointerup", (event) => {
    if (backdropPointerDown && event.target === dialog) closeDialog();
    backdropPointerDown = false;
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.getClientRects().length > 0);

    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  dialog.addEventListener("close", () => {
    removeFrame();
    loader.hidden = false;
    fallback.hidden = true;
    unlockPage();
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  });

  compactViewport.addEventListener("change", (event) => {
    if (event.matches && dialog.open && activeFrame) {
      showFallback("The viewport is now too compact for the embedded dashboard.");
    }
  });
};

initDashboardDialog();
