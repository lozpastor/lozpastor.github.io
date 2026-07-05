import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { ScrollConstellation } from "@/components/scroll-constellation";

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
      <ScrollConstellation />
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

          <div className="hero-copy relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pt-20 text-center">
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
          <section id="profile" className="chapter shell" data-cosmic-section>
            <span className="chapter-ghost" aria-hidden="true">01</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>01 / 05</span>
                <p>Profile</p>
                <small>Barcelona · 41.38° N</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">A product perspective shaped from inside the system.</p>
                <h2 className="editorial-title">
                  I work between the
                  <br />
                  <em>decision</em> and the thing
                  <br />
                  that has to deliver it.
                </h2>
                <div className="profile-notes">
                  <p>
                    Computer engineering taught me to see dependencies, question metrics and look
                    beneath the interface.
                  </p>
                  <p>
                    Product work lets me use that depth to align teams, clarify scope and move
                    complex banking products forward.
                  </p>
                  <aside>
                    Business <i>×</i> Technology <i>×</i> Data <i>×</i> Users
                  </aside>
                </div>
              </div>
            </div>
          </section>

          <section className="signal-strip" aria-label="Selected impact">
            <div className="shell">
              <p className="signal-caption">Selected signals / not vanity metrics</p>
              <div className="signal-line">
                {[
                  ["3+", "years in banking transformation"],
                  ["100+", "reports consolidated"],
                  ["90%+", "reporting effort reduced"],
                  ["50%+", "process efficiency gained"],
                ].map(([value, label], index) => (
                  <div key={value} className="signal">
                    <span className="signal-index">0{index + 1}</span>
                    <strong>{value}</strong>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="experience" className="chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">02</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>02 / 05</span>
                <p>Experience</p>
                <small>From infrastructure to intent</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">Two roles. One continuous line of thought.</p>
                <h2 className="editorial-title">
                  Close enough to the data
                  <br />
                  to know when a product
                  <br />
                  <em>story is true.</em>
                </h2>

                <div className="experience-ledger">
                  {experience.map((item, index) => (
                    <article key={item.period} className="experience-note">
                      <div className="experience-heading">
                        <span>0{index + 1}</span>
                        <p>{item.period}</p>
                      </div>
                      <div>
                        <h3>{item.role}</h3>
                        <p className="experience-focus">{item.focus}</p>
                      </div>
                      <p className="experience-copy">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="project-chapter" data-cosmic-section>
            <div className="shell">
              <div className="project-heading" data-reveal>
                <div className="chapter-meta">
                  <span>03 / 05</span>
                  <p>Personal project</p>
                  <small>Independent product practice</small>
                </div>
                <div data-cosmic-title>
                  <p className="chapter-intro">A product built without inherited constraints.</p>
                  <h2 className="editorial-title">
                    From BI report
                    <br />
                    to <em>web product.</em>
                  </h2>
                </div>
              </div>

              <a
                href="https://lozpastor.github.io/Macroeconomic-Dashboard/"
                target="_blank"
                rel="noreferrer"
                className="project-piece group"
                data-reveal
              >
                <div className="project-art" aria-hidden="true">
                  <span className="art-coordinate">40.4168° N / 3.7038° W</span>
                  <span className="art-year">2025</span>
                  <div className="project-orbit" />
                  <div className="project-browser">
                    <div className="project-browser-bar"><span /><span /><span /></div>
                    <div className="project-screen">
                      <div className="project-chart">
                        {[38, 62, 45, 78, 68, 88, 73, 94].map((height, index) => (
                          <span key={index} style={{ height: `${height}%` }} />
                        ))}
                      </div>
                      <div className="project-lines"><span /><span /><span /></div>
                    </div>
                  </div>
                </div>

                <div className="project-caption">
                  <div>
                    <span className="project-number">01</span>
                    <h3>Macroeconomic Dashboard</h3>
                  </div>
                  <p>
                    A responsive product for reading economic KPIs, time-series and multi-country
                    comparisons—reframed around navigation, hierarchy and reach.
                  </p>
                  <span className="project-launch">
                    View live <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </a>
            </div>
          </section>

          <section id="skills" className="chapter shell" data-cosmic-section>
            <span className="chapter-ghost" aria-hidden="true">04</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>04 / 05</span>
                <p>Practice</p>
                <small>How the work moves</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">Tools change. The operating model compounds.</p>
                <h2 className="editorial-title">
                  Clarity before velocity.
                  <br />
                  <em>Evidence before theatre.</em>
                </h2>
                <ol className="practice-list">
                  {capabilities.map(([title, body], index) => (
                    <li key={title}>
                      <span>0{index + 1}</span>
                      <h3>{title}</h3>
                      <p>{body}</p>
                    </li>
                  ))}
                </ol>
                <div className="education-note">
                  <p>Computer Engineering</p>
                  <span>→</span>
                  <p>Business Consulting & Data Science</p>
                  <span>→</span>
                  <p>Product Management</p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="contact-chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">05</span>
            <div data-reveal data-cosmic-title>
              <div className="chapter-meta">
                <span>05 / 05</span>
                <p>Contact</p>
                <small>Open to the right conversation</small>
              </div>
              <h2>
                Let&apos;s make complex
                <br />
                feel <em>obvious.</em>
              </h2>
              <div className="contact-row">
                <p>Product Management · Technical Product · Product Operations</p>
                <div className="flex gap-3">
                  <a
                    href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
                    className="glass-button"
                  >
                    Start a conversation <ArrowUpRight className="ml-2 size-4" />
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
