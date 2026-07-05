import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const navItems = [
  ["Profile", "#profile"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

const experience = [
  {
    period: "2025 — Now",
    role: "Product Management Office",
    focus: "Recoveries & Underwriting",
    body: "I coordinate product delivery across business, technology, risk and operations in core banking domains. My work connects roadmap, backlog, functional definition, UAT and stakeholder decisions.",
  },
  {
    period: "2023 — 2025",
    role: "Data Engineer",
    focus: "Risk & Regulatory Data",
    body: "I built analytics and regulatory data products with SQL, SAS and Power BI—turning complex reporting processes into reliable systems used by risk teams and decision-makers.",
  },
];

const capabilities = [
  ["Product direction", "Discovery, prioritisation and roadmaps"],
  ["Delivery", "Backlogs, user stories, UAT and release readiness"],
  ["Data", "SQL, KPIs, Power BI, SAS and ETL"],
  ["Alignment", "Business, engineering, risk and operations"],
];

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-night text-white">
      <a href="#content" className="skip-link">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-white/10 bg-night/80 backdrop-blur-xl" : ""
        }`}
      >
        <nav className="shell flex h-20 items-center justify-between" aria-label="Main navigation">
          <a href="#home" className="font-display text-2xl tracking-tight sm:text-3xl">
            Alejandro Lozano
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>

          <a
            href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
            className="glass-button hidden sm:inline-flex"
          >
            Let&apos;s talk
            <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-white/20 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        <div
          id="mobile-navigation"
          className={`fixed inset-0 -z-10 flex flex-col bg-night px-6 pb-8 pt-28 transition-opacity duration-300 md:hidden ${
            menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="border-b border-white/10 py-5 font-display text-4xl"
            >
              {label}
            </a>
          ))}
          <a
            href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
            tabIndex={menuOpen ? 0 : -1}
            className="mt-auto flex items-center justify-between border-t border-white/10 pt-6 text-sm text-white/70"
          >
            lozpastor@gmail.com
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </header>

      <main id="content">
        <section id="home" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
          <video
            className="absolute inset-0 size-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>
          <div className="video-shade absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-20 text-center">
            <p className="animate-fade-rise text-xs font-medium uppercase tracking-[0.22em] text-white/62 sm:text-sm">
              Product Manager · Technical background
            </p>
            <h1 className="animate-fade-rise-delay mt-7 font-display text-[clamp(3.4rem,8vw,7.8rem)] font-normal leading-[0.9] tracking-[-0.045em]">
              Product thinking,
              <br />
              <em className="font-normal text-white/58">grounded in systems.</em>
            </h1>
            <p className="animate-fade-rise-delay-2 mt-7 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              I connect business, technology and data to move complex products forward.
            </p>
          </div>

          <a
            href="#profile"
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/55 transition-colors hover:text-white"
            aria-label="Continue to profile"
          >
            <ArrowDown className="size-5 animate-breathe" />
          </a>
        </section>

        <div className="continuation">
          <section id="profile" className="shell section-y">
            <div className="grid gap-14 lg:grid-cols-[0.42fr_1fr] lg:gap-24">
              <p className="section-label" data-reveal>
                Profile
              </p>
              <div data-reveal>
                <h2 className="max-w-4xl font-display text-[clamp(2.8rem,5.8vw,6rem)] leading-[0.96] tracking-[-0.04em]">
                  I work between the product decision and the system that has to deliver it.
                </h2>
                <div className="mt-12 grid gap-8 border-t border-white/12 pt-8 sm:grid-cols-2">
                  <p className="copy">
                    My background started in computer engineering and data. It taught me to understand
                    dependencies, question metrics and look beneath the interface.
                  </p>
                  <p className="copy">
                    Today I apply that technical foundation to product work in banking—aligning teams,
                    clarifying scope and turning business needs into executable delivery.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/10">
            <div className="shell grid grid-cols-2 lg:grid-cols-4">
              {[
                ["3+", "years in banking transformation"],
                ["100+", "reports consolidated"],
                ["90%+", "reporting effort reduced"],
                ["50%+", "process efficiency gained"],
              ].map(([value, label]) => (
                <div key={value} className="metric">
                  <span>{value}</span>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="experience" className="shell section-y">
            <div className="grid gap-14 lg:grid-cols-[0.42fr_1fr] lg:gap-24">
              <p className="section-label" data-reveal>
                Experience
              </p>
              <div className="border-t border-white/12" data-reveal>
                {experience.map((item) => (
                  <article
                    key={item.period}
                    className="grid gap-6 border-b border-white/12 py-10 sm:grid-cols-[130px_1fr] lg:grid-cols-[150px_0.8fr_1fr]"
                  >
                    <p className="text-xs text-white/38">{item.period}</p>
                    <div>
                      <h3 className="font-display text-3xl leading-none sm:text-4xl">{item.role}</h3>
                      <p className="mt-2 text-sm text-white/45">{item.focus}</p>
                    </div>
                    <p className="copy sm:col-start-2 lg:col-start-auto">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="projects" className="border-y border-white/10 bg-white/[0.025]">
            <div className="shell section-y">
              <div className="grid gap-14 lg:grid-cols-[0.42fr_1fr] lg:gap-24">
                <p className="section-label" data-reveal>
                  Personal projects
                </p>
                <div data-reveal>
                  <p className="mb-8 max-w-xl text-sm leading-7 text-white/48">
                    Side projects are where I explore product decisions without inherited constraints:
                    from framing the problem to shipping the final experience.
                  </p>

                  <a
                    href="https://lozpastor.github.io/Macroeconomic-Dashboard/"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link group"
                  >
                    <div className="project-visual" aria-hidden="true">
                      <div className="project-browser">
                        <div className="project-browser-bar">
                          <span />
                          <span />
                          <span />
                        </div>
                        <div className="project-screen">
                          <div className="project-chart">
                            {[38, 62, 45, 78, 68, 88, 73, 94].map((height, index) => (
                              <span key={index} style={{ height: `${height}%` }} />
                            ))}
                          </div>
                          <div className="project-lines">
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-7 flex items-start justify-between gap-6">
                      <div>
                        <p className="section-label">Data product · 2025</p>
                        <h3 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                          Macroeconomic Dashboard
                        </h3>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/52 sm:text-base">
                          A responsive web product for exploring macroeconomic KPIs, time-series and
                          multi-country comparisons. Rebuilt from a BI dashboard to improve clarity,
                          navigation and reach.
                        </p>
                        <p className="mt-5 text-xs text-white/35">
                          Product concept · Information architecture · Frontend · Data visualisation
                        </p>
                      </div>
                      <span className="grid size-12 shrink-0 place-items-center rounded-full border border-white/18 transition-all duration-300 group-hover:bg-white group-hover:text-night">
                        <ArrowUpRight className="size-5" />
                      </span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section className="shell section-y">
            <div className="grid gap-14 lg:grid-cols-[0.42fr_1fr] lg:gap-24">
              <p className="section-label" data-reveal>
                How I work
              </p>
              <div className="border-t border-white/12" data-reveal>
                {capabilities.map(([title, body]) => (
                  <div
                    key={title}
                    className="grid gap-3 border-b border-white/12 py-7 sm:grid-cols-[0.7fr_1fr] sm:items-center"
                  >
                    <h3 className="font-display text-2xl sm:text-3xl">{title}</h3>
                    <p className="text-sm text-white/48">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="shell pb-10 pt-20 sm:pt-28 lg:pt-36">
            <div className="border-t border-white/12 pb-16 pt-12 sm:pb-24 sm:pt-16" data-reveal>
              <p className="section-label">Contact</p>
              <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                <h2 className="max-w-4xl font-display text-[clamp(3rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.045em]">
                  Let&apos;s build something
                  <br />
                  <em className="font-normal text-white/38">worth using.</em>
                </h2>
                <div className="flex gap-3">
                  <a
                    href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
                    className="glass-button"
                  >
                    Email me <ArrowUpRight className="ml-2 size-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/alejandro-lozano-pastor-52437a251/"
                    target="_blank"
                    rel="noreferrer"
                    className="circle-link"
                    aria-label="Alejandro Lozano on LinkedIn"
                  >
                    <ArrowUpRight className="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 bg-night">
        <div className="shell flex flex-col gap-4 py-7 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alejandro Lozano</p>
          <p>Barcelona · Product × Technology × Data</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
