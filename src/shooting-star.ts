type Point = {
  x: number;
  y: number;
};

type SectionStop = {
  section: HTMLElement;
  title: HTMLElement;
  length: number;
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

const meaningfulTextRect = (element: HTMLElement): DOMRect => {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const value = node.textContent ?? "";
    const firstCharacter = value.search(/\S/);

    if (firstCharacter !== -1) {
      const range = document.createRange();
      range.setStart(node, firstCharacter);
      range.setEnd(node, Math.min(value.length, firstCharacter + 1));
      const rect = range.getBoundingClientRect();
      range.detach();

      if (rect.width > 0 || rect.height > 0) {
        return rect;
      }
    }

    node = walker.nextNode();
  }

  return element.getBoundingClientRect();
};

const createBezierPath = (points: Point[]): string => {
  if (points.length === 0) {
    return "";
  }

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const verticalDistance = Math.max(1, point.y - previous.y);
    const handle = clamp(verticalDistance * 0.42, 48, 260);
    const firstControl: Point = {
      x: previous.x,
      y: previous.y + handle,
    };
    const secondControl: Point = {
      x: point.x,
      y: point.y - handle,
    };

    return `${path} C ${firstControl.x.toFixed(2)} ${firstControl.y.toFixed(2)}, ${secondControl.x.toFixed(2)} ${secondControl.y.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);
};

/**
 * Connects the hero to the page chapters with one scroll-driven shooting star.
 * The returned function removes every observer, listener and pending animation.
 */
export const initShootingStar = (): (() => void) => {
  const guide = document.querySelector<HTMLElement>("[data-scroll-star]");
  const svg = guide?.querySelector<SVGSVGElement>("[data-star-svg]");
  const basePath = guide?.querySelector<SVGPathElement>("[data-star-base]");
  const progressPath = guide?.querySelector<SVGPathElement>("[data-star-progress]");
  const trailPath = guide?.querySelector<SVGPathElement>("[data-star-trail]");
  const launchFlare = guide?.querySelector<SVGGElement>("[data-star-launch]");
  const comet = guide?.querySelector<SVGGElement>("[data-star-comet]");
  const hero = document.querySelector<HTMLElement>("#hero");
  const heroTitle = document.querySelector<HTMLElement>("#hero-title");
  const shell = document.querySelector<HTMLElement>(".shell");
  const sectionElements = Array.from(
    document.querySelectorAll<HTMLElement>("[data-star-section]"),
  );

  if (
    !guide ||
    !svg ||
    !basePath ||
    !progressPath ||
    !trailPath ||
    !launchFlare ||
    !comet ||
    !hero ||
    !heroTitle ||
    !shell ||
    sectionElements.length === 0
  ) {
    return () => undefined;
  }

  const geometryPath = basePath;
  const drawnPath = progressPath;
  const movingTrail = trailPath;
  const movingComet = comet;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const titleTimers = new Set<number>();
  const titleAnimations = new Set<Animation>();

  let destroyed = false;
  let geometryDirty = true;
  let frameId: number | null = null;
  let previousFrameTime = performance.now();
  let pageHeight = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  let totalLength = 1;
  let currentLength = 0;
  let targetLength = 0;
  let furthestLengthRatio = 0;
  let hasPositionedComet = false;
  let hasLaunched = false;
  let latestScrollY = window.scrollY;
  let lastMovementDirection = 1;
  let activeStopIndex = -1;
  let startPoint: Point = { x: 0, y: 0 };
  let sectionStops: SectionStop[] = [];

  const setPathGeometry = (pathData: string): void => {
    basePath.setAttribute("d", pathData);
    progressPath.setAttribute("d", pathData);
    trailPath.setAttribute("d", pathData);
  };

  const findLengthAtY = (targetY: number): number => {
    let low = 0;
    let high = totalLength;

    for (let index = 0; index < 22; index += 1) {
      const middle = (low + high) / 2;
      const point = basePath.getPointAtLength(middle);

      if (point.y < targetY) {
        low = middle;
      } else {
        high = middle;
      }
    }

    return (low + high) / 2;
  };

  const railPosition = (): number => {
    const shellRect = shell.getBoundingClientRect();
    const outerGap = clamp(shellRect.left * 0.34, 10, 30);
    return Math.max(10, shellRect.left - outerGap);
  };

  const buildGeometry = (): void => {
    const oldTotalLength = totalLength;
    const oldCurrentRatio = oldTotalLength > 0 ? currentLength / oldTotalLength : 0;
    const titleRect = meaningfulTextRect(heroTitle);
    const heroRect = hero.getBoundingClientRect();
    const documentTop = window.scrollY;
    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      window.innerHeight,
    );
    const compact = window.innerWidth < 720;
    const railX = railPosition();
    const startOffset = compact ? 10 : 28;

    pageHeight = documentHeight;
    startPoint = {
      x: clamp(titleRect.left - startOffset, compact ? 12 : 22, window.innerWidth - 18),
      y: titleRect.top + documentTop - (compact ? 14 : 18),
    };

    const heroBottom = heroRect.bottom + documentTop;
    const launchExitY = Math.max(startPoint.y + 120, heroBottom - (compact ? 12 : 28));
    const shellLeft = shell.getBoundingClientRect().left;
    const safeRightEdge = Math.max(10, shellLeft - (compact ? 6 : 12));
    const variation = compact ? 2.5 : 7;
    const points: Point[] = [
      startPoint,
      {
        x: Math.min(safeRightEdge, railX + variation),
        y: launchExitY,
      },
    ];

    const stopsWithoutLengths: Array<Omit<SectionStop, "length">> = [];

    sectionElements.forEach((section, index) => {
      const title = section.querySelector<HTMLElement>("[data-star-title]");

      if (!title) {
        return;
      }

      const titleBox = title.getBoundingClientRect();
      const sectionShell =
        section.querySelector<HTMLElement>(".shell")?.getBoundingClientRect() ??
        shell.getBoundingClientRect();
      const sectionOuterGap = clamp(sectionShell.left * 0.34, 10, 30);
      const sectionRail = Math.max(10, sectionShell.left - sectionOuterGap);
      const sectionSafeRight = Math.max(10, sectionShell.left - (compact ? 6 : 12));
      const offset = Math.sin(index * 1.71 + 0.5) * variation;

      points.push({
        x: Math.min(sectionSafeRight, sectionRail + offset),
        y: titleBox.top + documentTop + clamp(titleBox.height * 0.34, 18, 54),
      });
      stopsWithoutLengths.push({ section, title });
    });

    const lastPoint = points[points.length - 1] ?? startPoint;
    const footer = document.querySelector<HTMLElement>(".site-footer");
    const footerRect = footer?.getBoundingClientRect();
    const finalY = Math.max(
      lastPoint.y + 180,
      footerRect ? footerRect.bottom + documentTop - 36 : documentHeight - 36,
    );

    points.push({
      x: railX,
      y: Math.min(documentHeight - 18, finalY),
    });

    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${documentHeight}`);
    svg.setAttribute("width", String(window.innerWidth));
    svg.setAttribute("height", String(documentHeight));
    svg.style.height = `${documentHeight}px`;

    setPathGeometry(createBezierPath(points));
    totalLength = Math.max(1, basePath.getTotalLength());

    basePath.style.strokeDasharray = `${totalLength}`;
    basePath.style.strokeDashoffset = "0";
    progressPath.style.strokeDasharray = `${totalLength}`;
    const trailLength = clamp(totalLength * 0.018, 96, 180);
    trailPath.style.strokeDasharray = `${trailLength} ${totalLength + 100}`;

    sectionStops = stopsWithoutLengths.map((stop, index) => ({
      ...stop,
      length: findLengthAtY(points[index + 2].y),
    }));

    launchFlare.setAttribute(
      "transform",
      `translate(${startPoint.x.toFixed(2)} ${startPoint.y.toFixed(2)})`,
    );

    if (hasPositionedComet) {
      currentLength = clamp(oldCurrentRatio * totalLength, 0, totalLength);
    }

    geometryDirty = false;
    updateTarget();

    if (!hasPositionedComet) {
      currentLength = targetLength;
      hasPositionedComet = true;
    }

    renderPaths(0);
    guide.classList.add("is-ready");
  };

  const scrollProgress = (): number => {
    const maximumScroll = Math.max(1, pageHeight - window.innerHeight);
    return clamp(latestScrollY / maximumScroll, 0, 1);
  };

  const applySectionMagnet = (length: number): number => {
    let adjusted = length;
    const zone = clamp(window.innerHeight * 0.085, 54, 112);

    for (const stop of sectionStops) {
      const distance = adjusted - stop.length;
      const absoluteDistance = Math.abs(distance);

      if (absoluteDistance >= zone) {
        continue;
      }

      const normalisedDistance = absoluteDistance / zone;
      const resistance = 0.24 + 0.76 * normalisedDistance * normalisedDistance;
      adjusted = stop.length + distance * resistance;
      break;
    }

    return adjusted;
  };

  function updateTarget(): void {
    const progress = scrollProgress();
    const initialViewportPosition = clamp(
      startPoint.y - latestScrollY,
      window.innerHeight * 0.2,
      window.innerHeight * 0.44,
    );
    const finalViewportPosition = window.innerHeight * 0.78;
    const viewportPosition =
      initialViewportPosition + (finalViewportPosition - initialViewportPosition) * progress;
    const targetY = clamp(
      latestScrollY + viewportPosition,
      startPoint.y,
      pageHeight - 24,
    );

    targetLength = applySectionMagnet(findLengthAtY(targetY));
  }

  const pulseSection = (index: number): void => {
    if (reducedMotionQuery.matches || index < 0 || index >= sectionStops.length) {
      return;
    }

    const { section, title } = sectionStops[index];
    section.classList.add("is-star-active");
    title.classList.add("is-star-pulsing");

    const animation = title.animate(
      [
        { filter: "brightness(1)", opacity: 1 },
        {
          filter: "brightness(1.18)",
          opacity: 0.9,
          offset: 0.34,
        },
        { filter: "brightness(1)", opacity: 1 },
      ],
      {
        duration: 460,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );

    titleAnimations.add(animation);
    animation.addEventListener(
      "finish",
      () => {
        titleAnimations.delete(animation);
      },
      { once: true },
    );

    const timer = window.setTimeout(() => {
      section.classList.remove("is-star-active");
      title.classList.remove("is-star-pulsing");
      titleTimers.delete(timer);
    }, 520);
    titleTimers.add(timer);
  };

  const updateSectionArrival = (): void => {
    const arrivalRadius = clamp(window.innerHeight * 0.018, 10, 18);
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    sectionStops.forEach((stop, index) => {
      const distance = Math.abs(currentLength - stop.length);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    if (nearestDistance <= arrivalRadius) {
      if (nearestIndex !== activeStopIndex) {
        activeStopIndex = nearestIndex;
        pulseSection(nearestIndex);
      }
    } else if (nearestDistance > arrivalRadius * 2.2) {
      activeStopIndex = -1;
    }
  };

  function renderPaths(movement: number): void {
    const point = geometryPath.getPointAtLength(currentLength);
    const tangentDistance = Math.min(2.5, Math.max(0.8, totalLength * 0.001));
    const previousPoint = geometryPath.getPointAtLength(
      clamp(currentLength - tangentDistance, 0, totalLength),
    );
    const nextPoint = geometryPath.getPointAtLength(
      clamp(currentLength + tangentDistance, 0, totalLength),
    );
    const tangentAngle =
      (Math.atan2(nextPoint.y - previousPoint.y, nextPoint.x - previousPoint.x) * 180) /
      Math.PI;

    if (Math.abs(movement) > 0.01) {
      lastMovementDirection = movement > 0 ? 1 : -1;
    }

    const cometAngle = tangentAngle + (lastMovementDirection < 0 ? 180 : 0);
    movingComet.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) rotate(${cometAngle.toFixed(2)})`,
    );

    const permanentLength = reducedMotionQuery.matches
      ? totalLength
      : Math.max(currentLength, totalLength * furthestLengthRatio);
    drawnPath.style.strokeDashoffset = `${Math.max(0, totalLength - permanentLength)}`;

    const trailLength = clamp(totalLength * 0.018, 96, 180);
    movingTrail.style.strokeDashoffset =
      lastMovementDirection < 0
        ? `${-currentLength}`
        : `${trailLength - currentLength}`;

    updateSectionArrival();
  }

  const renderFrame = (time: number): void => {
    frameId = null;

    if (destroyed) {
      return;
    }

    if (geometryDirty) {
      buildGeometry();
    } else {
      updateTarget();
    }

    if (reducedMotionQuery.matches) {
      furthestLengthRatio = 1;
      currentLength = targetLength;
      renderPaths(0);
      return;
    }

    const deltaTime = clamp(time - previousFrameTime, 1, 34);
    previousFrameTime = time;
    const previousLength = currentLength;
    const smoothing = 1 - Math.exp(-deltaTime * 0.0105);
    currentLength += (targetLength - currentLength) * smoothing;

    if (Math.abs(targetLength - currentLength) < 0.08) {
      currentLength = targetLength;
    }

    furthestLengthRatio = Math.max(furthestLengthRatio, currentLength / totalLength);
    renderPaths(currentLength - previousLength);

    if (Math.abs(targetLength - currentLength) > 0.08) {
      requestFrame();
    }
  };

  function requestFrame(): void {
    if (frameId === null && !destroyed) {
      frameId = window.requestAnimationFrame(renderFrame);
    }
  }

  const triggerLaunch = (): void => {
    if (hasLaunched || reducedMotionQuery.matches || latestScrollY <= 2) {
      return;
    }

    hasLaunched = true;
    guide.classList.add("is-launched");
    launchFlare.classList.add("is-flaring");

    const animation = launchFlare.animate(
      [
        { opacity: 0, filter: "brightness(1)" },
        { opacity: 1, filter: "brightness(1.34)", offset: 0.18 },
        { opacity: 0, filter: "brightness(1)" },
      ],
      {
        duration: 820,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
    titleAnimations.add(animation);
    animation.addEventListener(
      "finish",
      () => {
        titleAnimations.delete(animation);
        launchFlare.classList.remove("is-flaring");
      },
      { once: true },
    );
  };

  const onScroll = (): void => {
    latestScrollY = window.scrollY;
    triggerLaunch();
    requestFrame();
  };

  const markGeometryDirty = (): void => {
    geometryDirty = true;
    requestFrame();
  };

  const applyMotionPreference = (): void => {
    const isReduced = reducedMotionQuery.matches;
    guide.classList.toggle("is-reduced-motion", isReduced);
    comet.style.display = isReduced ? "none" : "";
    trailPath.style.display = isReduced ? "none" : "";
    launchFlare.style.display = isReduced ? "none" : "";

    if (isReduced) {
      guide.classList.remove("is-launched");
      launchFlare.classList.remove("is-flaring");
      titleAnimations.forEach((animation) => animation.cancel());
      titleAnimations.clear();
      sectionStops.forEach(({ section, title }) => {
        section.classList.remove("is-star-active");
        title.classList.remove("is-star-pulsing");
      });
      activeStopIndex = -1;
    }

    geometryDirty = true;
    requestFrame();
  };

  const resizeObserver = new ResizeObserver(markGeometryDirty);
  resizeObserver.observe(document.documentElement);
  resizeObserver.observe(hero);
  resizeObserver.observe(shell);
  sectionElements.forEach((section) => resizeObserver.observe(section));

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", markGeometryDirty, { passive: true });
  reducedMotionQuery.addEventListener("change", applyMotionPreference);

  document.fonts.ready.then(() => {
    if (!destroyed) {
      markGeometryDirty();
    }
  });

  applyMotionPreference();
  requestFrame();

  return () => {
    destroyed = true;

    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }

    resizeObserver.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", markGeometryDirty);
    reducedMotionQuery.removeEventListener("change", applyMotionPreference);
    titleTimers.forEach((timer) => window.clearTimeout(timer));
    titleTimers.clear();
    titleAnimations.forEach((animation) => animation.cancel());
    titleAnimations.clear();
    sectionStops.forEach(({ section, title }) => {
      section.classList.remove("is-star-active");
      title.classList.remove("is-star-pulsing");
    });

    guide.classList.remove("is-ready", "is-launched", "is-reduced-motion");
    comet.style.display = "";
    trailPath.style.display = "";
    launchFlare.style.display = "";
  };
};
