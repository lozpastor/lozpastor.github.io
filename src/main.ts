import "./index.css";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const heroVideo = document.querySelector<HTMLVideoElement>(".hero-video");

if (prefersReducedMotion.matches) {
  heroVideo?.pause();
} else if (heroVideo) {
  const source = heroVideo.querySelector<HTMLSourceElement>("source[data-src]");

  const startHeroVideo = () => {
    if (!source?.dataset.src) return;
    source.src = source.dataset.src;
    delete source.dataset.src;
    heroVideo.load();
    void heroVideo.play().catch(() => undefined);
  };

  ["pointermove", "touchstart", "scroll", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, startHeroVideo, { once: true, passive: true });
  });
}

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const hashTarget = window.location.hash
    ? document.querySelector<HTMLElement>(window.location.hash)
    : null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  document.querySelectorAll<HTMLElement>(".reveal").forEach((section) => {
    if (section === hashTarget) return;
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.92) return;
    section.classList.add("reveal-pending");
    observer.observe(section);
  });
}
