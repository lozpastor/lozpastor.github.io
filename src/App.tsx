import { Button } from "@/components/ui/button";

const navigation = ["Home", "Studio", "About", "Journal", "Reach Us"];

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      <nav
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-8 py-6"
        aria-label="Primary navigation"
      >
        <a
          href="#home"
          className="font-display text-3xl tracking-tight text-foreground"
          aria-label="Velorah home"
        >
          Velorah<sup className="text-xs">®</sup>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item, index) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={`text-sm transition-colors hover:text-foreground ${
                index === 0 ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <Button
          variant="glass"
          size="nav"
          className="hover:scale-[1.03]"
          onClick={() => document.querySelector("#journey")?.scrollIntoView()}
        >
          Begin Journey
        </Button>
      </nav>

      <section
        id="home"
        className="relative z-10 flex min-h-[calc(100vh-96px)] flex-col items-center justify-center px-6 pb-40 pt-32 text-center sm:py-[90px]"
      >
        <h1
          className="animate-fade-rise max-w-7xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where <em className="not-italic text-muted-foreground">dreams</em>{" "}
          rise
          <br className="hidden sm:block" />{" "}
          <em className="not-italic text-muted-foreground">
            through the silence.
          </em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We&apos;re designing tools for deep thinkers, bold creators, and
          quiet rebels. Amid the chaos, we build digital spaces for sharp focus
          and inspired work.
        </p>

        <Button
          id="journey"
          variant="glass"
          size="hero"
          className="animate-fade-rise-delay-2 mt-12 cursor-pointer hover:scale-[1.03]"
        >
          Begin Journey
        </Button>
      </section>
    </main>
  );
}

export default App;
