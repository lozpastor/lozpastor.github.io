type JourneyStop = {
  link: HTMLAnchorElement;
  dot: HTMLElement;
  section: HTMLElement;
  title: HTMLElement | null;
  scrollAnchor: number;
  markerY: number;
};

const clamp = (value: number, minimum = 0, maximum = 1): number =>
  Math.min(maximum, Math.max(minimum, value));

const interpolate = (from: number, to: number, progress: number): number =>
  from + (to - from) * progress;

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
      if (rect.width > 0 || rect.height > 0) return rect;
    }

    node = walker.nextNode();
  }

  return element.getBoundingClientRect();
};

/**
 * Turns the former page-length shooting star into a compact section navigator.
 * The star tracks the current section, then leaves the rail only for the final CTA.
 */
export const initShootingStar = (): (() => void) => {
  const nav = document.querySelector<HTMLElement>("[data-scroll-star]");
  const panel = nav?.querySelector<HTMLElement>(".journey-nav__panel");
  const star = nav?.querySelector<HTMLElement>("[data-journey-star]");
  const progressLine = nav?.querySelector<HTMLElement>("[data-journey-progress]");
  const links = Array.from(
    nav?.querySelectorAll<HTMLAnchorElement>("[data-journey-link]") ?? [],
  );
  const hero = document.querySelector<HTMLElement>("#hero");
  const contact = document.querySelector<HTMLElement>(".contact");
  const contactTitle = contact?.querySelector<HTMLElement>("[data-star-title]");
  const fallSvg = document.querySelector<SVGSVGElement>("[data-journey-fall]");
  const fallPath = fallSvg?.querySelector<SVGPathElement>("[data-journey-fall-path]");
  const fallTrail = fallSvg?.querySelector<SVGPathElement>("[data-journey-fall-trail]");
  const fallStar = fallSvg?.querySelector<SVGGElement>("[data-journey-fall-star]");

  if (
    !nav ||
    !panel ||
    !star ||
    !progressLine ||
    links.length === 0 ||
    !hero ||
    !contact ||
    !contactTitle ||
    !fallSvg ||
    !fallPath ||
    !fallTrail ||
    !fallStar
  ) {
    return () => undefined;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactScreen = window.matchMedia("(max-width: 760px)");
  let stops: JourneyStop[] = [];
  let frameId: number | null = null;
  let geometryDirty = true;
  let destroyed = false;

  const readStops = (): JourneyStop[] =>
    links.flatMap((link) => {
      const targetId = link.hash.slice(1);
      const section = targetId ? document.getElementById(targetId) : null;
      const dot = link.querySelector<HTMLElement>(".journey-nav__dot");
      if (!section || !dot) return [];

      const sectionRect = section.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();

      return [
        {
          link,
          dot,
          section,
          title: section.querySelector<HTMLElement>("[data-star-title]"),
          scrollAnchor:
            sectionRect.top + window.scrollY - window.innerHeight * 0.38,
          markerY: dotRect.top - panelRect.top + dotRect.height / 2,
        },
      ];
    });

  const rebuildGeometry = (): void => {
    stops = readStops();
    fallSvg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${window.innerHeight}`);
    fallSvg.setAttribute("width", String(window.innerWidth));
    fallSvg.setAttribute("height", String(window.innerHeight));
    geometryDirty = false;
  };

  const journeyPosition = (): { index: number; markerY: number } => {
    if (stops.length === 0) return { index: -1, markerY: 0 };

    const currentScroll = window.scrollY;
    let index = 0;

    for (let stopIndex = 1; stopIndex < stops.length; stopIndex += 1) {
      if (currentScroll >= stops[stopIndex].scrollAnchor) index = stopIndex;
    }

    const current = stops[index];
    const next = stops[index + 1];
    if (!next) return { index, markerY: current.markerY };

    const interval = Math.max(1, next.scrollAnchor - current.scrollAnchor);
    const progress = clamp((currentScroll - current.scrollAnchor) / interval);
    return {
      index,
      markerY: interpolate(current.markerY, next.markerY, progress),
    };
  };

  const finalProgress = (): number => {
    const contactRect = contact.getBoundingClientRect();
    const departureLine = window.innerHeight * 0.86;
    const dockingLine = window.innerHeight * 0.54;
    return clamp((departureLine - contactRect.top) / (departureLine - dockingLine));
  };

  const setActiveStop = (index: number, navIsVisible: boolean, departure: number): void => {
    stops.forEach((stop, stopIndex) => {
      const isActive = stopIndex === index && navIsVisible && departure < 0.7;
      stop.link.classList.toggle("is-active", isActive);
      if (isActive) {
        stop.link.setAttribute("aria-current", "location");
      } else {
        stop.link.removeAttribute("aria-current");
      }

      stop.section.classList.toggle(
        "is-star-invoked",
        navIsVisible && stopIndex <= index,
      );
      stop.section.classList.toggle("is-star-active", isActive);
    });
  };

  const renderFall = (progress: number): void => {
    const starRect = star.getBoundingClientRect();
    const titleRect = meaningfulTextRect(contactTitle);
    const startX = starRect.left + starRect.width / 2;
    const startY = starRect.top + starRect.height / 2;
    const endX = Math.max(contact.getBoundingClientRect().left + 18, titleRect.left - 12);
    const endY = titleRect.top + clamp(titleRect.height * 0.44, 24, 72);
    const fallDistance = Math.max(80, endY - startY);
    const pathData = [
      `M ${startX.toFixed(2)} ${startY.toFixed(2)}`,
      `C ${startX.toFixed(2)} ${(startY + fallDistance * 0.45).toFixed(2)},`,
      `${(endX - 62).toFixed(2)} ${(endY - fallDistance * 0.34).toFixed(2)},`,
      `${endX.toFixed(2)} ${endY.toFixed(2)}`,
    ].join(" ");

    fallPath.setAttribute("d", pathData);
    fallTrail.setAttribute("d", pathData);
    const totalLength = Math.max(1, fallPath.getTotalLength());
    const currentLength = totalLength * progress;
    const point = fallPath.getPointAtLength(currentLength);
    const trailLength = clamp(totalLength * 0.24, 34, 86);

    fallPath.style.strokeDasharray = `${totalLength}`;
    fallPath.style.strokeDashoffset = `${totalLength - currentLength}`;
    fallTrail.style.strokeDasharray = `${trailLength} ${totalLength}`;
    fallTrail.style.strokeDashoffset = `${trailLength - currentLength}`;
    fallStar.setAttribute(
      "transform",
      `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`,
    );

    const arrivalFade = 1 - clamp((progress - 0.84) / 0.16);
    fallStar.style.opacity = String(arrivalFade);
    fallPath.style.opacity = String(progress < 0.97 ? 1 : arrivalFade);
    fallTrail.style.opacity = String(progress < 0.97 ? 1 : arrivalFade);
  };

  const render = (): void => {
    frameId = null;
    if (destroyed) return;
    if (geometryDirty) rebuildGeometry();
    if (stops.length === 0) return;

    const navThreshold = hero.getBoundingClientRect().bottom + window.scrollY - 64;
    const navIsVisible = !compactScreen.matches && window.scrollY >= navThreshold;
    const position = journeyPosition();
    const departure = navIsVisible ? finalProgress() : 0;
    const firstMarker = stops[0].markerY;

    nav.style.setProperty("--journey-star-y", `${position.markerY.toFixed(2)}px`);
    nav.style.setProperty(
      "--journey-progress-height",
      `${Math.max(0, position.markerY - firstMarker).toFixed(2)}px`,
    );
    nav.style.setProperty("--departure-progress", departure.toFixed(4));
    nav.classList.toggle("is-visible", navIsVisible);
    nav.classList.toggle("is-departing", departure > 0.01);
    nav.classList.toggle("is-docked", departure >= 0.985);
    nav.inert = !navIsVisible || departure >= 0.985;
    nav.setAttribute(
      "aria-hidden",
      !navIsVisible || departure >= 0.985 ? "true" : "false",
    );
    fallSvg.classList.toggle(
      "is-visible",
      navIsVisible && departure > 0.01 && !reducedMotion.matches,
    );

    setActiveStop(position.index, navIsVisible, departure);

    if (departure > 0.01 && !reducedMotion.matches) {
      renderFall(departure);
    }

    const contactIsActive = departure > 0.78;
    contact.classList.toggle("is-star-active", contactIsActive);
    contact.classList.toggle("is-star-invoked", departure >= 0.96);
  };

  const requestRender = (): void => {
    if (frameId === null && !destroyed) {
      frameId = window.requestAnimationFrame(render);
    }
  };

  const markGeometryDirty = (): void => {
    geometryDirty = true;
    requestRender();
  };

  const onMotionPreference = (): void => {
    nav.classList.toggle("is-reduced-motion", reducedMotion.matches);
    markGeometryDirty();
  };

  const resizeObserver = new ResizeObserver(markGeometryDirty);
  resizeObserver.observe(document.documentElement);
  resizeObserver.observe(panel);
  resizeObserver.observe(hero);
  resizeObserver.observe(contact);
  links.forEach((link) => {
    const section = document.querySelector<HTMLElement>(link.hash);
    if (section) resizeObserver.observe(section);
  });

  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", markGeometryDirty, { passive: true });
  reducedMotion.addEventListener("change", onMotionPreference);
  compactScreen.addEventListener("change", markGeometryDirty);
  document.fonts.ready.then(markGeometryDirty);

  nav.classList.add("is-ready");
  document.documentElement.classList.add("star-ready");
  onMotionPreference();
  requestRender();

  return () => {
    destroyed = true;
    if (frameId !== null) window.cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    window.removeEventListener("scroll", requestRender);
    window.removeEventListener("resize", markGeometryDirty);
    reducedMotion.removeEventListener("change", onMotionPreference);
    compactScreen.removeEventListener("change", markGeometryDirty);
    stops.forEach((stop) => {
      stop.link.classList.remove("is-active");
      stop.link.removeAttribute("aria-current");
      stop.section.classList.remove("is-star-active", "is-star-invoked");
    });
    contact.classList.remove("is-star-active", "is-star-invoked");
    nav.classList.remove(
      "is-ready",
      "is-visible",
      "is-departing",
      "is-docked",
      "is-reduced-motion",
    );
    nav.inert = false;
    nav.removeAttribute("aria-hidden");
    fallSvg.classList.remove("is-visible");
    document.documentElement.classList.remove("star-ready");
  };
};
