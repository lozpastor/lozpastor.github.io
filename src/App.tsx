import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  BarChart3,
  Blocks,
  Menu,
  PanelsTopLeft,
  Target,
  X,
} from "lucide-react";
import { ScrollConstellation } from "@/components/scroll-constellation";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const navItems = [
  ["Profile", "#profile"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

const evolution = [
  {
    title: "Data",
    body: "I learned to separate signal from noise: SQL, SAS, reporting logic, data quality and the operational truth behind every KPI.",
  },
  {
    title: "Business",
    body: "Banking taught me that a useful solution is not the most elegant one; it is the one that survives risk, priorities and real stakeholders.",
  },
  {
    title: "Technology",
    body: "My engineering background helps me translate ambiguity into systems, dependencies, acceptance criteria and delivery constraints.",
  },
  {
    title: "Product",
    body: "Today I use that mix to shape product decisions: what to build, why it matters, how it ships and how success is measured.",
  },
];

const capabilities = [
  {
    title: "Business Thinking",
    icon: Target,
    items: ["Product Strategy", "Product Performance", "Stakeholder Management", "Banking Knowledge", "KPI Definition"],
  },
  {
    title: "Technical Foundation",
    icon: Blocks,
    items: ["SQL", "Power BI", "SAS", "Jira", "Confluence", "ETL", "APIs"],
  },
  {
    title: "Product Execution",
    icon: PanelsTopLeft,
    items: ["Backlog Management", "User Stories", "Roadmaps", "Agile", "Scrum", "UAT", "Cross-functional Collaboration"],
  },
  {
    title: "Data-driven Decisions",
    icon: BarChart3,
    items: ["Dashboards", "Analytics", "Reporting", "Data Modelling", "Metrics", "Decision Making"],
  },
];

const experience = [
  {
    company: "Banco Sabadell",
    role: "Product Management Office · Recoveries & Underwriting",
    period: "2025 — Present",
    context: "A regulated banking environment where product decisions must balance business value, operational reality, risk and technical feasibility.",
    mission: "Create alignment across business, technology, risk and operations so product delivery moves with clearer scope, stronger sequencing and fewer surprises.",
    contribution:
      "I connect roadmap intent with backlog structure, user stories, UAT criteria and stakeholder decisions—turning complex requirements into work teams can actually ship.",
    impact: ["Stronger delivery alignment", "Clearer decision-making", "Reduced ambiguity across teams"],
    tools: ["Jira", "Confluence", "UAT", "Roadmaps", "Stakeholders"],
  },
  {
    company: "Management Solutions",
    role: "Data Engineer · Risk & Regulatory Data",
    period: "2023 — 2025",
    context: "Risk and regulatory reporting processes with fragmented outputs, repeated manual effort and high dependency on data reliability.",
    mission: "Transform reporting complexity into dependable analytics systems for teams that needed faster, cleaner and more auditable decisions.",
    contribution:
      "I consolidated legacy reports, built SQL/SAS logic, modelled data flows and created Power BI dashboards that made reporting easier to understand and maintain.",
    impact: ["100+ reports consolidated", "90%+ reporting effort reduced", "50%+ efficiency improvement"],
    tools: ["SQL", "SAS", "Power BI", "ETL", "Data Quality"],
  },
];

const projects = [
  {
    title: "Macroeconomic Dashboard",
    problem: "Economic data is often powerful but hard to navigate: scattered indicators, weak hierarchy and too much friction before insight.",
    role: "Product owner, UX structure and frontend implementation.",
    process:
      "I reframed the dashboard as a web product: clearer navigation, sharper metric hierarchy, responsive behaviour and a more intentional reading flow.",
    result: "A live analytical product that makes multi-country macroeconomic comparison faster, cleaner and easier to present.",
    tools: ["React", "Data Visualisation", "UX", "KPIs"],
    impact: "From report to product experience",
    href: "https://lozpastor.github.io/Macroeconomic-Dashboard/",
    image: "/project-atlas.svg",
    imageAlt: "Editorial preview of the Macroeconomic Atlas dashboard",
  },
  {
    title: "Portfolio System",
    problem: "A recruiter has seconds to understand positioning, credibility and fit. A static CV cannot carry that narrative well enough.",
    role: "Product strategy, information architecture and interface direction.",
    process:
      "I treated the portfolio as a product surface: first impression, reading path, proof of impact, technical signal and conversion to conversation.",
    result: "A focused PM narrative that communicates business, technology and data without becoming a CV online.",
    tools: ["React", "TypeScript", "Storytelling", "SEO"],
    impact: "Positioning designed for PM recruiters",
    href: "#contact",
    image: "/project-portfolio.svg",
    imageAlt: "Information architecture of the portfolio narrative",
  },
];

const achievements = [
  ["100+", "Legacy reports consolidated into more manageable reporting flows"],
  ["90%+", "Reduction in manual reporting effort through automation and data structure"],
  ["50%+", "Improvement in operational efficiency across recurring analytical processes"],
  ["XFN", "Business, technology, risk and operations aligned around delivery decisions"],
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
      { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
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
                <span>01 / 08</span>
                <p>From Data to Product</p>
                <small>Not a biography. A trajectory.</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">The through-line: turning complexity into product clarity.</p>
                <h2 className="editorial-title">
                  My path started with data,
                  <br />
                  moved through business,
                  <br />
                  and now points to <em>product.</em>
                </h2>
                <figure className="story-figure">
                  <img
                    src="/career-trajectory.svg"
                    alt="A continuous path connecting Data, Business, Technology and Product"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>One trajectory, four complementary lenses.</figcaption>
                </figure>
                <ol className="evolution-ledger" aria-label="Professional evolution from data to product">
                  {evolution.map((item, index) => (
                    <li key={item.title}>
                      <span>0{index + 1}</span>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <section className="capabilities-chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">02</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>02 / 08</span>
                <p>What I Bring</p>
                <small>Four capabilities. One operating model.</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">A PM profile built at the intersection of outcomes, systems and evidence.</p>
                <h2 className="editorial-title">
                  I can speak strategy
                  <br />
                  without losing the thread
                  <br />
                  of <em>implementation.</em>
                </h2>
                <div className="capability-index">
                  {capabilities.map((capability) => {
                    const Icon = capability.icon;
                    return (
                      <article className="capability-row" key={capability.title}>
                        <Icon className="capability-icon" aria-hidden="true" />
                        <h3>{capability.title}</h3>
                        <p>{capability.items.join(" · ")}</p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section id="experience" className="chapter shell" data-cosmic-section>
            <span className="chapter-ghost" aria-hidden="true">03</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>03 / 08</span>
                <p>Professional Experience</p>
                <small>Case studies, not job descriptions.</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">The work is less about tasks and more about removing friction from decisions.</p>
                <h2 className="editorial-title">
                  Experience shaped by
                  <br />
                  regulated products,
                  <br />
                  data systems and <em>delivery.</em>
                </h2>
                <div className="case-stack">
                  {experience.map((item, index) => (
                    <article className="experience-case" key={item.company + item.period}>
                      <div className="case-topline">
                        <span>0{index + 1}</span>
                        <p>{item.period}</p>
                      </div>
                      <div className="case-main">
                        <div>
                          <p className="case-company">{item.company}</p>
                          <h3>{item.role}</h3>
                        </div>
                        <div className="case-copy-grid">
                          <div><span>Context</span><p>{item.context}</p></div>
                          <div><span>Mission</span><p>{item.mission}</p></div>
                          <div><span>Contribution</span><p>{item.contribution}</p></div>
                        </div>
                      </div>
                      <div className="case-footer">
                        <div className="impact-pills">
                          {item.impact.map((impact) => <span key={impact}>{impact}</span>)}
                        </div>
                        <div className="tool-row">
                          {item.tools.map((tool) => <span key={tool}>{tool}</span>)}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mindset-chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">04</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>04 / 08</span>
                <p>Product Mindset</p>
                <small>How I frame decisions.</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">Good product work is a tension system, not a checklist.</p>
                <h2 className="editorial-title">
                  I look for the point
                  <br />
                  where value, need,
                  <br />
                  data and tech <em>agree.</em>
                </h2>
                <figure className="mindset-figure">
                  <img
                    src="/product-judgement.svg"
                    alt="Product judgement at the intersection of business value, user needs, technology and data"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>
                    A decision is ready when value, desirability, feasibility and evidence can coexist.
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section id="projects" className="project-chapter" data-cosmic-section>
            <div className="shell">
              <div className="project-heading" data-reveal>
                <div className="chapter-meta">
                  <span>05 / 08</span>
                  <p>Featured Projects</p>
                  <small>Personal product practice</small>
                </div>
                <div data-cosmic-title>
                  <p className="chapter-intro">Projects where I can own the problem, the structure and the experience.</p>
                  <h2 className="editorial-title">
                    Small products,
                    <br />
                    built to show how
                    <br />
                    I <em>think.</em>
                  </h2>
                </div>
              </div>

              <div className="project-case-grid">
                {projects.map((project, index) => (
                  <a href={project.href} target={project.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="project-case-card group" data-reveal key={project.title}>
                    <div className="project-case-visual">
                      <span className="project-number">0{index + 1}</span>
                      <img src={project.image} alt={project.imageAlt} loading="lazy" decoding="async" />
                    </div>
                    <div className="project-case-content">
                      <div className="project-title-row">
                        <h3>{project.title}</h3>
                        <span>View more <ArrowUpRight className="size-4" /></span>
                      </div>
                      <dl>
                        <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                        <div><dt>My role</dt><dd>{project.role}</dd></div>
                        <div><dt>Process</dt><dd>{project.process}</dd></div>
                        <div><dt>Result</dt><dd>{project.result}</dd></div>
                      </dl>
                      <div className="case-footer project-footer">
                        <div className="impact-pills"><span>{project.impact}</span></div>
                        <div className="tool-row">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="signal-strip achievements-strip" aria-label="Selected achievements" data-cosmic-section>
            <div className="shell" data-reveal data-cosmic-title>
              <p className="signal-caption">06 / 08 · Selected achievements</p>
              <div className="signal-line">
                {achievements.map(([value, label], index) => (
                  <div key={value} className="signal">
                    <span className="signal-index">0{index + 1}</span>
                    <strong>{value}</strong>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="why-chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">07</span>
            <div className="chapter-grid">
              <div className="chapter-meta" data-reveal>
                <span>07 / 08</span>
                <p>Why Product?</p>
                <small>The direction was already inside the work.</small>
              </div>
              <div className="chapter-body" data-reveal data-cosmic-title>
                <p className="chapter-intro">I moved toward product because the most interesting questions were no longer only technical.</p>
                <h2 className="editorial-title">
                  I want to build the thing
                  <br />
                  behind the dashboard,
                  <br />
                  not only measure <em>afterwards.</em>
                </h2>
                <div className="why-editorial">
                  <p>
                    Data work taught me how decisions are made once a product exists. Product work lets me move earlier: framing the problem, choosing the trade-offs, aligning the stakeholders and defining what success should mean before delivery starts.
                  </p>
                  <p>
                    That is where my background becomes useful: I can sit with business ambiguity, understand technical constraints and still keep the conversation anchored in outcomes for users and teams.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="contact-chapter shell" data-cosmic-section>
            <span className="chapter-ghost chapter-ghost-right" aria-hidden="true">08</span>
            <div data-reveal data-cosmic-title>
              <div className="chapter-meta">
                <span>08 / 08</span>
                <p>Contact</p>
                <small>Open to the right product conversation</small>
              </div>
              <h2>
                Let&apos;s make complex
                <br />
                feel <em>obvious.</em>
              </h2>
              <div className="contact-row">
                <p>Product Management · Technical Product · Product Operations</p>
                <div className="contact-actions">
                  <a href="mailto:lozpastor@gmail.com?subject=Product%20opportunity" className="glass-button">
                    Email <ArrowUpRight className="ml-2 size-4" />
                  </a>
                  <a href="https://www.linkedin.com/in/alejandro-lozano-pastor-52437a251/" target="_blank" rel="noreferrer" className="circle-link" aria-label="Alejandro Lozano on LinkedIn">in</a>
                  <a href="https://github.com/lozpastor" target="_blank" rel="noreferrer" className="circle-link" aria-label="Alejandro Lozano on GitHub">gh</a>
                  <a href="/CV%20-%20Alejandro%20Lozano%20-%20PM%20Banking.html" className="circle-link" aria-label="Open CV">cv</a>
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
