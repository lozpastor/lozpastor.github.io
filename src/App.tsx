import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Approach", href: "#approach" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
];

const capabilities = [
  {
    number: "01",
    title: "Frame the right problem",
    copy: "I turn ambiguous business needs into clear product decisions: who we are solving for, what matters now, and how success will be measured.",
    tags: ["Discovery", "Product strategy", "Requirements"],
  },
  {
    number: "02",
    title: "Connect data to decisions",
    copy: "I use product and operational signals to make trade-offs visible—moving teams from opinions to evidence without losing the human context.",
    tags: ["SQL", "KPIs", "Power BI", "Analytics"],
  },
  {
    number: "03",
    title: "Make delivery executable",
    copy: "I translate intent into roadmaps, refined backlogs, user stories, acceptance criteria and UAT plans that teams can actually ship.",
    tags: ["Roadmaps", "Jira", "Agile delivery"],
  },
  {
    number: "04",
    title: "Align the whole system",
    copy: "I work across business, engineering, risk and operations to surface dependencies early and keep complex initiatives moving.",
    tags: ["Stakeholders", "Risk", "Cross-functional"],
  },
];

const caseStudies = [
  {
    index: "01",
    eyebrow: "Analytics platform · Risk",
    title: "From 100+ reports to one decision system",
    summary:
      "A fragmented reporting landscape was slowing down risk teams and creating recurring manual work. I helped reshape it into six unified Power BI dashboards built around the decisions stakeholders needed to make.",
    role: "Requirements · Data modelling · ETL · Delivery",
    impact: "90%+",
    impactLabel: "less operational reporting effort",
    tools: ["Power BI", "SQL", "SAS", "ETL"],
    details: [
      {
        label: "Problem",
        value:
          "Critical information lived across more than 100 reports, making analysis slow and governance difficult.",
      },
      {
        label: "Decision",
        value:
          "Consolidate around shared KPIs and user workflows—not recreate every legacy report in a new interface.",
      },
      {
        label: "Outcome",
        value:
          "Six production dashboards gave stakeholders a clearer, faster operating view while reducing recurring reporting load by over 90%.",
      },
    ],
  },
  {
    index: "02",
    eyebrow: "Automation · Regulatory data",
    title: "Turning regulatory complexity into a reliable pipeline",
    summary:
      "For an international G-SIB, recurring COREP production demanded accuracy, traceability and speed. I built and optimized data flows that converted a fragile manual process into repeatable infrastructure.",
    role: "Process design · Data quality · Automation",
    impact: "50%+",
    impactLabel: "efficiency gain in critical processes",
    tools: ["SAS", "SQL", "COREP", "Data quality"],
    details: [
      {
        label: "Problem",
        value:
          "Regulatory reporting depended on time-intensive processes where errors could affect capital and supervisory reporting.",
      },
      {
        label: "Decision",
        value:
          "Automate the pipeline end to end and add reconciliation controls for RWA, CET1 and provisions at the points of highest risk.",
      },
      {
        label: "Outcome",
        value:
          "Removed recurring manual production work and improved efficiency by more than 50%, while strengthening data integrity.",
      },
    ],
  },
  {
    index: "03",
    eyebrow: "Personal product · Macroeconomics",
    title: "Rebuilding a dashboard as a web product",
    summary:
      "I took a macroeconomic dashboard beyond the constraints of BI software and rebuilt it as a responsive web experience—owning the path from information architecture to deployment.",
    role: "Product concept · UX · Frontend · Launch",
    impact: "0→1",
    impactLabel: "independent product delivery",
    href: "https://lozpastor.github.io/Macroeconomic-Dashboard/",
    tools: ["JavaScript", "Data viz", "Responsive UX", "GitHub"],
    details: [
      {
        label: "Problem",
        value:
          "The original BI format limited navigation, reach and the way multi-country economic signals could be explored.",
      },
      {
        label: "Decision",
        value:
          "Prioritize a lightweight web experience with clear KPI hierarchy, time-series context and country comparison.",
      },
      {
        label: "Learning",
        value:
          "Shipping end to end sharpened how I scope an MVP, make UX trade-offs and balance product ambition with technical constraints.",
      },
    ],
  },
];

const experience = [
  {
    period: "2025 — Now",
    role: "Product Management Office",
    area: "Recoveries & Underwriting",
    company: "Management Solutions · Barcelona",
    description:
      "Working where banking product, risk and delivery meet. I coordinate priorities across business, technology and operations; shape requirements into user stories and acceptance criteria; and support the path from backlog refinement through UAT and release readiness.",
    signal: "Product execution in regulated, core banking domains",
  },
  {
    period: "2023 — 2025",
    role: "Data Engineer",
    area: "Risk & Regulatory Data",
    company: "Management Solutions · Barcelona",
    description:
      "Built decision infrastructure for credit-risk teams: production BI products, SAS and SQL pipelines, regulatory automation and data-quality controls. The role taught me to understand the system beneath the interface—and to design for trust, not just output.",
    signal: "100+ reports consolidated · >50% process efficiency",
  },
];

const toolkitGroups = [
  {
    label: "Product",
    items: ["Discovery", "Strategy", "Roadmaps", "Backlogs", "User stories", "UAT"],
  },
  {
    label: "Data",
    items: ["SQL", "Power BI", "SAS", "KPIs", "ETL", "Data quality"],
  },
  {
    label: "Delivery",
    items: ["Jira", "Confluence", "Agile", "Scrum", "Dependencies", "Risk"],
  },
  {
    label: "Business",
    items: ["Banking", "Credit risk", "Operations", "Regulation", "Stakeholders", "Value"],
  },
];

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-visible"));
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
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openCase, setOpenCase] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-sm text-black transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "px-3 pt-3 sm:px-5" : ""
        }`}
      >
        <nav
          className={`mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
            scrolled
              ? "rounded-full border border-white/15 bg-[#071a23]/70 shadow-[0_12px_40px_rgba(0,0,0,.16)] backdrop-blur-xl"
              : "border-transparent"
          }`}
          aria-label="Main navigation"
        >
          <a
            href="#home"
            className="font-display text-[1.7rem] tracking-tight text-white"
          >
            Alejandro Lozano<sup className="ml-0.5 align-super font-body text-[8px]">PM</sup>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-white/65 transition-colors duration-300 hover:text-white focus-visible:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
            className="liquid-glass hidden rounded-full px-5 py-2.5 text-sm text-white transition-transform duration-300 hover:scale-[1.03] sm:inline-flex"
          >
            Let&apos;s talk
            <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-white/20 text-white md:hidden"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>

        <div
          id="mobile-menu"
          className={`fixed inset-0 -z-10 flex flex-col bg-[#061a24] px-6 pb-8 pt-28 transition-all duration-500 md:hidden ${
            menuOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!menuOpen}
        >
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              className="border-b border-white/10 py-5 font-display text-4xl text-white"
            >
              <span className="mr-4 align-middle font-body text-xs text-white/40">
                0{index + 1}
              </span>
              {item.label}
            </a>
          ))}
          <a
            href="mailto:lozpastor@gmail.com?subject=Product%20opportunity"
            tabIndex={menuOpen ? 0 : -1}
            className="mt-auto flex items-center justify-between rounded-2xl bg-white p-5 text-black"
          >
            Start a conversation
            <ArrowUpRight className="size-5" />
          </a>
        </div>
      </header>

      <main id="main-content">
        <section
          id="home"
          className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#062433]"
        >
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
          <div className="hero-vignette absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-36 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
            <div className="mb-10 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/70 animate-fade-rise sm:text-sm">
              <span className="size-2 rounded-full bg-[#b7efcf] shadow-[0_0_16px_rgba(183,239,207,.8)]" />
              Product Manager · Technical background
            </div>

            <h1 className="animate-fade-rise-delay max-w-[1180px] font-display text-[clamp(3.65rem,9.4vw,9rem)] font-normal leading-[0.84] tracking-[-0.055em] text-white">
              I turn complexity
              <br />
              into <em className="font-normal text-white/55">products</em>
              <br />
              people can move with.
            </h1>

            <div className="mt-10 flex flex-col gap-8 border-t border-white/20 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="animate-fade-rise-delay-2 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
                I connect business, technology and data to build clearer
                decisions—and make complex financial products easier to
                execute, operate and improve.
              </p>

              <div className="flex animate-fade-rise-delay-2 items-center gap-3">
                <a
                  href="#work"
                  className="group inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.03]"
                >
                  See selected work
                  <ArrowDown className="ml-2 size-4 transition-transform group-hover:translate-y-0.5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/alejandro-lozano-pastor-52437a251/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Alejandro Lozano on LinkedIn"
                  className="liquid-glass grid size-12 place-items-center rounded-full text-white transition-transform hover:scale-105"
                >
                  <ArrowUpRight className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-line bg-canvas">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 lg:grid-cols-4">
            {[
              ["3+", "years in banking transformation"],
              ["90%+", "reporting effort reduced"],
              ["50%+", "process efficiency gained"],
              ["100+", "reports consolidated"],
            ].map(([value, label]) => (
              <div
                key={value}
                className="border-r border-t border-line px-5 py-8 last:border-r-0 sm:px-8 lg:border-t-0 lg:py-10"
              >
                <div className="font-display text-4xl tracking-tight sm:text-5xl">
                  {value}
                </div>
                <div className="mt-2 max-w-[180px] text-xs leading-relaxed text-ink-muted sm:text-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="approach" className="section-space bg-canvas">
          <div className="page-shell">
            <div className="section-heading" data-reveal>
              <p className="eyebrow">How I think</p>
              <h2>
                Product thinking is the work
                <br className="hidden sm:block" /> of making{" "}
                <em>trade-offs legible.</em>
              </h2>
              <p>
                My job is not to produce more artefacts. It is to give teams
                enough clarity to make a good decision, commit to it and learn
                quickly.
              </p>
            </div>

            <div className="mt-16 grid border-l border-t border-line md:grid-cols-2 lg:mt-24">
              {capabilities.map((capability, index) => (
                <article
                  key={capability.number}
                  className="group border-b border-r border-line p-6 transition-colors duration-500 hover:bg-white sm:p-9 lg:p-12"
                  data-reveal
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs text-ink-faint">
                      {capability.number}
                    </span>
                    <ArrowUpRight className="size-5 text-ink-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ink" />
                  </div>
                  <h3 className="mt-16 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
                    {capability.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-sm leading-7 text-ink-muted sm:text-base">
                    {capability.copy}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2">
                    {capability.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="section-space bg-[#071d27] text-white">
          <div className="page-shell">
            <div className="section-heading section-heading-dark" data-reveal>
              <p className="eyebrow">Selected work</p>
              <h2>
                Evidence over
                <br className="hidden sm:block" /> adjectives.
              </h2>
              <p>
                Three examples of how I have moved from a complex system to a
                clearer product outcome.
              </p>
            </div>

            <div className="mt-16 border-t border-white/15 lg:mt-24">
              {caseStudies.map((study, index) => {
                const isOpen = openCase === index;
                return (
                  <article
                    key={study.index}
                    className="case-study border-b border-white/15"
                    data-reveal
                  >
                    <button
                      type="button"
                      className="grid w-full gap-7 py-9 text-left sm:py-12 lg:grid-cols-[70px_1fr_220px_48px] lg:items-center"
                      onClick={() => setOpenCase(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`case-${index}`}
                    >
                      <span className="text-xs text-white/35">
                        {study.index}
                      </span>
                      <span>
                        <span className="mb-3 block text-xs uppercase tracking-[0.16em] text-[#b7efcf]">
                          {study.eyebrow}
                        </span>
                        <span className="block max-w-3xl font-display text-3xl leading-[1.05] tracking-tight sm:text-5xl">
                          {study.title}
                        </span>
                      </span>
                      <span className="hidden lg:block">
                        <span className="block font-display text-4xl">
                          {study.impact}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-white/45">
                          {study.impactLabel}
                        </span>
                      </span>
                      <span
                        className={`grid size-11 place-items-center rounded-full border border-white/20 transition-all duration-500 ${
                          isOpen ? "rotate-45 bg-white text-black" : ""
                        }`}
                      >
                        <X className="size-4" />
                      </span>
                    </button>

                    <div
                      id={`case-${index}`}
                      className={`grid transition-[grid-template-rows] duration-700 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="grid gap-10 pb-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20 lg:pb-16 lg:pl-[70px]">
                          <div>
                            <p className="text-base leading-7 text-white/65 sm:text-lg">
                              {study.summary}
                            </p>
                            <p className="mt-8 text-xs uppercase tracking-[0.14em] text-white/35">
                              My role
                            </p>
                            <p className="mt-2 text-sm text-white/80">
                              {study.role}
                            </p>
                            <div className="mt-8 flex flex-wrap gap-2">
                              {study.tools.map((tool) => (
                                <span
                                  key={tool}
                                  className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/55"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                            {"href" in study && study.href ? (
                              <a
                                href={study.href}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-8 inline-flex items-center text-sm text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#b7efcf]"
                              >
                                Explore the live product
                                <ArrowUpRight className="ml-2 size-4" />
                              </a>
                            ) : null}
                          </div>

                          <div className="border-t border-white/15">
                            {study.details.map((detail) => (
                              <div
                                key={detail.label}
                                className="grid gap-3 border-b border-white/15 py-6 sm:grid-cols-[100px_1fr]"
                              >
                                <span className="text-xs uppercase tracking-[0.14em] text-white/35">
                                  {detail.label}
                                </span>
                                <p className="text-sm leading-7 text-white/75">
                                  {detail.value}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="experience" className="section-space bg-canvas">
          <div className="page-shell">
            <div className="section-heading" data-reveal>
              <p className="eyebrow">Experience</p>
              <h2>
                From the data layer
                <br className="hidden sm:block" /> to the{" "}
                <em>product decision.</em>
              </h2>
              <p>
                My path into product started inside the systems, data and
                operational constraints that products have to survive.
              </p>
            </div>

            <div className="mt-16 lg:mt-24">
              {experience.map((item) => (
                <article
                  key={item.period}
                  className="grid gap-6 border-t border-line py-9 last:border-b sm:py-12 lg:grid-cols-[170px_1fr_1.1fr]"
                  data-reveal
                >
                  <div className="text-xs uppercase tracking-[0.14em] text-ink-faint">
                    {item.period}
                  </div>
                  <div>
                    <h3 className="font-display text-3xl leading-none tracking-tight sm:text-4xl">
                      {item.role}
                    </h3>
                    <p className="mt-2 text-sm text-ink-muted">{item.area}</p>
                    <p className="mt-5 text-xs text-ink-faint">
                      {item.company}
                    </p>
                  </div>
                  <div>
                    <p className="max-w-xl text-sm leading-7 text-ink-muted sm:text-base">
                      {item.description}
                    </p>
                    <div className="mt-6 flex items-start gap-2 text-sm font-medium">
                      <Check className="mt-0.5 size-4 shrink-0 text-deep" />
                      {item.signal}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="border-y border-line bg-white">
          <div className="page-shell grid lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-line py-16 lg:border-b-0 lg:border-r lg:py-24 lg:pr-16">
              <p className="eyebrow" data-reveal>
                The through-line
              </p>
              <p
                className="mt-8 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
                data-reveal
              >
                I learned technology to understand what is possible.
                <br />
                <em className="text-ink-faint">
                  I moved into product to decide what is worth building.
                </em>
              </p>
            </div>
            <div className="py-16 lg:py-24 lg:pl-16">
              <div className="max-w-2xl space-y-6 text-base leading-8 text-ink-muted sm:text-lg" data-reveal>
                <p>
                  Computer engineering gave me the mechanics: systems,
                  programming and data. Consulting put those mechanics inside
                  real business constraints—regulation, risk, operations and
                  stakeholder pressure.
                </p>
                <p>
                  Product is where those perspectives become useful together.
                  Today I work on core banking initiatives across recoveries
                  and underwriting, translating business intent into delivery
                  decisions that technical teams can act on.
                </p>
                <p className="font-medium text-ink">
                  The value I bring is range with depth: I can question the
                  metric, follow the data flow, challenge the scope and still
                  bring the room back to the user outcome.
                </p>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-px bg-line sm:grid-cols-4" data-reveal>
                {["Business", "Technology", "Data", "Users"].map((item) => (
                  <div
                    key={item}
                    className="bg-white px-3 py-5 text-center text-xs font-medium uppercase tracking-[0.12em]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-space bg-canvas">
          <div className="page-shell">
            <div className="section-heading" data-reveal>
              <p className="eyebrow">Operating system</p>
              <h2>
                Tools are useful.
                <br className="hidden sm:block" /> Capabilities{" "}
                <em>compound.</em>
              </h2>
              <p>
                A practical toolkit shaped by product delivery, analytics and
                regulated financial environments.
              </p>
            </div>

            <div className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
              {toolkitGroups.map((group, index) => (
                <div
                  key={group.label}
                  className="border-b border-r border-line p-7 sm:p-9"
                  data-reveal
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">
                    {group.label}
                  </p>
                  <ul className="mt-10 space-y-4">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center justify-between border-b border-line pb-3 text-sm"
                      >
                        {item}
                        <span className="size-1 rounded-full bg-ink-faint" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              className="mt-12 flex flex-col justify-between gap-8 rounded-3xl border border-line bg-white p-7 sm:flex-row sm:items-center sm:p-10"
              data-reveal
            >
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">
                  Education & learning
                </p>
                <p className="mt-3 max-w-2xl font-display text-2xl tracking-tight sm:text-3xl">
                  Computer Engineering · Master&apos;s in Business Consulting
                  & Data Science · Generative AI with LLMs
                </p>
              </div>
              <div className="shrink-0 text-sm leading-7 text-ink-muted sm:text-right">
                Spanish & Catalan · Native
                <br />
                English · Professional
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#061a24] text-white">
          <div className="contact-orbit absolute -right-[20vw] top-1/2 size-[65vw] -translate-y-1/2 rounded-full border border-white/10" />
          <div className="page-shell relative py-24 sm:py-32 lg:py-40">
            <p className="eyebrow text-white/45" data-reveal>
              Current focus
            </p>
            <h2
              className="mt-8 max-w-5xl font-display text-[clamp(3.4rem,8vw,8rem)] leading-[0.88] tracking-[-0.05em]"
              data-reveal
            >
              Building the bridge
              <br />
              <em className="text-white/40">from insight to impact.</em>
            </h2>
            <div className="mt-12 flex flex-col gap-8 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-base leading-7 text-white/60">
                Open to Product Manager, Technical Product Manager and Product
                Operations opportunities where complex systems need clear
                thinking and strong execution.
              </p>
              <Button
                asChild
                className="h-auto self-start rounded-full bg-white px-7 py-4 text-sm text-black hover:scale-[1.03] sm:self-auto"
              >
                <a href="mailto:lozpastor@gmail.com?subject=Product%20opportunity">
                  Start a conversation
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#061a24] text-white">
        <div className="page-shell flex flex-col gap-6 border-t border-white/10 py-7 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Alejandro Lozano</p>
          <div className="flex gap-6">
            <a
              href="mailto:lozpastor@gmail.com"
              className="transition-colors hover:text-white"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/alejandro-lozano-pastor-52437a251/"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a href="#home" className="transition-colors hover:text-white">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
