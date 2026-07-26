import "./index.css";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
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
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.92) return;
    section.classList.add("reveal-pending");
    observer.observe(section);
  });
}
