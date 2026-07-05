import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

const DESKTOP_X = [1415 / 1440, 0.34, 0.3, 0.35, 0.31, 0.42];
const MOBILE_X = [0.9, 0.07, 0.09, 0.07, 0.09, 0.14];
const STAR_VIEWPORT_OFFSET = 0.4;
const TRAIL_LENGTH = 120;
const GLOW_STRENGTH = 0.42;

function createPath(points: Point[]) {
  if (!points.length) return "";

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const deltaY = point.y - previous.y;
    const curve = Math.min(Math.max(deltaY * 0.38, 80), 240);

    return `${path} C ${previous.x} ${previous.y + curve}, ${point.x} ${
      point.y - curve
    }, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

function findLengthAtY(path: SVGPathElement, targetY: number, totalLength: number) {
  let low = 0;
  let high = totalLength;

  for (let index = 0; index < 12; index += 1) {
    const middle = (low + high) / 2;
    if (path.getPointAtLength(middle).y < targetY) {
      low = middle;
    } else {
      high = middle;
    }
  }

  return (low + high) / 2;
}

export function ScrollConstellation() {
  const svgRef = useRef<SVGSVGElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const trailPathRef = useRef<SVGPathElement>(null);
  const starRef = useRef<SVGGElement>(null);
  const pathLengthRef = useRef(0);
  const currentLengthRef = useRef(0);
  const targetLengthRef = useRef(0);
  const frameRef = useRef<number>();
  const geometryFrameRef = useRef<number>();
  const sectionStopsRef = useRef<Array<{ element: HTMLElement; y: number }>>([]);
  const activeStopRef = useRef<HTMLElement | null>(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const svg = svgRef.current;
    const basePath = basePathRef.current;
    const progressPath = progressPathRef.current;
    const trailPath = trailPathRef.current;
    const star = starRef.current;

    if (!svg || !basePath || !progressPath || !trailPath || !star) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = motionQuery.matches;

    const updateGeometry = () => {
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.scrollHeight;
      const compact = width < 768;
      const xPattern = compact ? MOBILE_X : DESKTOP_X;
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-cosmic-section]"),
      );

      const points: Point[] = [
        {
          x: compact
            ? width * xPattern[0]
            : Math.min(width - 25, width * xPattern[0]),
          y: compact ? Math.min(190, window.innerHeight * 0.24) : 292,
        },
      ];

      sections.forEach((section, index) => {
        const heading =
          section.querySelector<HTMLElement>("[data-cosmic-title]") ?? section;
        const bounds = heading.getBoundingClientRect();
        points.push({
          x: width * (xPattern[index + 1] ?? xPattern[xPattern.length - 1]),
          y: bounds.top + window.scrollY + Math.min(bounds.height / 2, 42),
        });
      });

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;

      const pathData = createPath(points);
      [basePath, progressPath, trailPath].forEach((path) =>
        path.setAttribute("d", pathData),
      );

      const totalLength = basePath.getTotalLength();
      pathLengthRef.current = totalLength;
      progressPath.style.strokeDasharray = `${totalLength}`;
      trailPath.style.strokeDasharray = `${TRAIL_LENGTH} ${totalLength + TRAIL_LENGTH}`;

      sectionStopsRef.current = sections.map((section, index) => ({
        element: section,
        y: points[index + 1].y,
      }));

      if (reducedMotionRef.current) {
        progressPath.style.strokeDashoffset = "0";
        progressPath.style.opacity = "0.5";
        trailPath.style.opacity = "0";
        star.style.opacity = "0";
      }
    };

    const scheduleGeometry = () => {
      if (geometryFrameRef.current) cancelAnimationFrame(geometryFrameRef.current);
      geometryFrameRef.current = requestAnimationFrame(() => {
        updateGeometry();
        setScrollTarget();
      });
    };

    const setScrollTarget = () => {
      if (reducedMotionRef.current || !pathLengthRef.current) return;

      const rawY =
        window.scrollY > 3
          ? window.scrollY + window.innerHeight * STAR_VIEWPORT_OFFSET
          : window.innerWidth < 768
            ? Math.min(190, window.innerHeight * 0.24)
            : 292;
      const pauseRadius = window.innerHeight * 0.075;
      const closestStop = sectionStopsRef.current.reduce<number | null>(
        (closest, stop) => {
          if (closest === null) return stop.y;
          return Math.abs(stop.y - rawY) < Math.abs(closest - rawY)
            ? stop.y
            : closest;
        },
        null,
      );
      const distance = closestStop === null ? Infinity : Math.abs(closestStop - rawY);
      const pull = Math.max(0, 1 - distance / pauseRadius) * 0.32;
      const desiredY =
        closestStop === null ? rawY : rawY + (closestStop - rawY) * pull;

      targetLengthRef.current = Math.min(
        pathLengthRef.current,
        findLengthAtY(basePath, desiredY, pathLengthRef.current),
      );

      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    const animate = () => {
      if (!reducedMotionRef.current && pathLengthRef.current) {
        const difference = targetLengthRef.current - currentLengthRef.current;
        currentLengthRef.current += difference * 0.105;

        if (Math.abs(difference) < 0.08) {
          currentLengthRef.current = targetLengthRef.current;
        }

        const current = currentLengthRef.current;
        const total = pathLengthRef.current;
        const point = basePath.getPointAtLength(current);
        const ahead = basePath.getPointAtLength(Math.min(total, current + 1));
        const angle =
          (Math.atan2(ahead.y - point.y, ahead.x - point.x) * 180) / Math.PI;

        progressPath.style.strokeDashoffset = `${total - current}`;
        trailPath.style.strokeDashoffset = `${-(Math.max(0, current - TRAIL_LENGTH))}`;
        star.setAttribute(
          "transform",
          `translate(${point.x} ${point.y}) rotate(${angle})`,
        );

        const hasStarted = window.scrollY > 3;
        star.style.opacity = hasStarted ? "1" : "0";
        trailPath.style.opacity = hasStarted ? `${GLOW_STRENGTH}` : "0";

        const nearest = sectionStopsRef.current.reduce<{
          element: HTMLElement;
          distance: number;
        } | null>((closest, stop) => {
          const candidate = {
            element: stop.element,
            distance: Math.abs(stop.y - point.y),
          };
          return !closest || candidate.distance < closest.distance
            ? candidate
            : closest;
        }, null);

        if (
          nearest &&
          nearest.distance < 34 &&
          nearest.element !== activeStopRef.current
        ) {
          activeStopRef.current?.classList.remove("cosmic-active");
          nearest.element.classList.add("cosmic-active");
          nearest.element
            .querySelectorAll<HTMLElement>("[data-reveal]")
            .forEach((element) => element.classList.add("is-visible"));
          activeStopRef.current = nearest.element;
          window.setTimeout(() => {
            nearest?.element.classList.remove("cosmic-active");
            if (activeStopRef.current === nearest?.element) {
              activeStopRef.current = null;
            }
          }, 900);
        }
      }

      if (
        !reducedMotionRef.current &&
        Math.abs(targetLengthRef.current - currentLengthRef.current) >= 0.08
      ) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = undefined;
      }
    };

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      updateGeometry();
      setScrollTarget();
    };

    updateGeometry();
    setScrollTarget();

    window.addEventListener("scroll", setScrollTarget, { passive: true });
    window.addEventListener("resize", scheduleGeometry, { passive: true });
    motionQuery.addEventListener("change", handleMotionPreference);

    const resizeObserver = new ResizeObserver(scheduleGeometry);
    resizeObserver.observe(document.documentElement);
    document.fonts.ready.then(scheduleGeometry);

    return () => {
      window.removeEventListener("scroll", setScrollTarget);
      window.removeEventListener("resize", scheduleGeometry);
      motionQuery.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      if (geometryFrameRef.current) cancelAnimationFrame(geometryFrameRef.current);
    };
  }, []);

  return (
    <div className="cosmic-guide" aria-hidden="true">
      <svg ref={svgRef} preserveAspectRatio="none">
        <defs>
          <linearGradient id="cosmic-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="0.35" stopColor="#bde8d2" stopOpacity="0.42" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="cosmic-trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#bde8d2" stopOpacity="0" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.72" />
          </linearGradient>
          <filter id="star-glow" x="-300%" y="-300%" width="600%" height="600%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path ref={basePathRef} className="cosmic-path cosmic-path-base" />
        <path ref={progressPathRef} className="cosmic-path cosmic-path-progress" />
        <path ref={trailPathRef} className="cosmic-path cosmic-path-trail" />

        <g ref={starRef} className="cosmic-star">
          <line x1="-18" y1="0" x2="-4" y2="0" />
          <circle r="2.4" filter="url(#star-glow)" />
          <circle r="0.9" className="cosmic-star-core" />
        </g>
      </svg>
    </div>
  );
}
