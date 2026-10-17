import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight, BookOpenText, FileDown, Fingerprint, GitBranch, Github, History, Landmark, MapPinned, Scale,
  ShieldCheck, Sparkles, Users, Database, Search, Cloud, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/ui/text-animate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { HeroVideoDialog } from "@/components/ui/hero-video-dialog";
import { Highlighter } from "@/components/ui/highlighter";
import { Marquee } from "@/components/ui/marquee";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { AnimatedList } from "@/components/ui/animated-list";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";
import { DotPattern } from "@/components/ui/dot-pattern";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MEDIA, TOPIC_NAMES, TYPE_NAMES, useCollection } from "./data";

const GITHUB = "https://github.com/mocharil/RuleLab";

/* ---------------------------------------------------------------- shared */

function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand", className)}>{children}</p>;
}

function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return <h2 className={cn("text-balance text-4xl font-bold tracking-[-0.035em] text-ink md:text-6xl", className)}>{children}</h2>;
}

function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2 md:text-xl", className)}>{children}</p>;
}

function Serif({ children }: { children: ReactNode }) {
  return <span className="font-serif font-semibold italic tracking-[-0.01em] text-brand">{children}</span>;
}

function Sample({ children = "Example" }: { children?: ReactNode }) {
  return <span className="rounded-full border border-amber-300/70 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">{children}</span>;
}

function Logo({ size = 32 }: { size?: number }) {
  return <img src="/static/brand/rulelab-icon.png" alt="" width={size} height={size} className="rounded-[22%]" />;
}

/** Plays only while visible; shows its poster under reduced motion. */
function Clip({ name, className }: { name: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { video.removeAttribute("autoplay"); video.pause(); return; }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.25 });
    io.observe(video);
    return () => io.disconnect();
  }, [name]);
  return (
    <video ref={ref} key={name} className={cn("block size-full object-cover", className)} poster={`${MEDIA}/${name}.jpg`}
      muted loop playsInline autoPlay preload="metadata" aria-label="RuleLab product animation">
      <source src={`${MEDIA}/${name}.mp4`} type="video/mp4" />
    </video>
  );
}

function ProductFrame({ name, url, className }: { name: string; url: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_120px_-40px_rgba(20,22,30,0.35)]", className)}>
      <div className="flex h-9 items-center gap-2 border-b border-line bg-mist px-4">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" /><span className="size-2.5 rounded-full bg-[#febc2e]" /><span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto truncate rounded-md bg-white px-3 py-0.5 text-[11px] text-muted ring-1 ring-line">{url}</span>
      </div>
      <div className="aspect-video bg-mist"><Clip name={name} /></div>
    </div>
  );
}

/* ---------------------------------------------------------------- nav */

export function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["#produk", "Product"], ["#cara-kerja", "How it works"], ["#koleksi", "Collection"], ["#sumber", "Trust"]];
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all duration-300", solid ? "border-b border-line/80 bg-white/80 backdrop-blur-xl" : "bg-transparent")}>
      <ScrollProgress className="top-0 h-[2px] bg-brand" />
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6" aria-label="Main">
        <a href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-ink"><Logo size={28} /><span className="text-lg">RuleLab</span></a>
        <div className="hidden items-center gap-8 text-sm font-medium text-ink-2 md:flex">
          {links.map(([href, label]) => <a key={href} href={href} className="transition-colors hover:text-ink">{label}</a>)}
          <a href={GITHUB} className="transition-colors hover:text-ink" rel="noopener">GitHub</a>
        </div>
        <a href="/workspace" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand">Open workspace</a>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- 1 · hero */

export function Hero() {
  return (
    <section data-landing-hero className="relative overflow-hidden px-4 pt-32 pb-20 md:pt-40 md:pb-28" aria-labelledby="hero-title">
      <DotPattern className="pointer-events-none text-neutral-300/70 [mask-image:radial-gradient(720px_circle_at_50%_18%,white,transparent)]" />
      <div className="relative mx-auto max-w-5xl text-center">
        <BlurFade delay={0.05}>
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur">
            <Sparkles className="size-4 text-brand" />
            <AnimatedShinyText className="mx-0 max-w-none text-ink-2">An AI workspace for Indonesian lawmaking · built on Gemini</AnimatedShinyText>
          </div>
        </BlurFade>
        <h1 id="hero-title" className="text-balance text-5xl font-bold leading-[1.02] tracking-[-0.045em] text-ink md:text-7xl lg:text-[5.4rem]">
          <TextAnimate as="span" animation="blurInUp" by="word" once className="block">Regulations that hold up</TextAnimate>
          <BlurFade delay={0.55} inView={false} className="mt-1 block">
            <span className="font-serif text-[1.08em] font-semibold italic tracking-[-0.02em] text-brand">in law and in people’s lives.</span>
          </BlurFade>
        </h1>
        <BlurFade delay={0.75}>
          <p className="mx-auto mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-ink-2 md:text-xl">
            RuleLab drafts Indonesian regulations in the official format, checks every article against the laws it must fit,
            and tests the impact on citizens — before the draft is signed.
          </p>
        </BlurFade>
        <BlurFade delay={0.9}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/workspace" aria-label="Open the RuleLab workspace">
              <ShimmerButton background="#c8102e" shimmerColor="#ffd6dd" className="px-7 py-3.5 text-base font-semibold">
                Open the workspace <ArrowRight className="ml-2 size-4" />
              </ShimmerButton>
            </a>
            <a href="#demo" className="rounded-full border border-line bg-white px-6 py-3.5 text-base font-semibold text-ink transition hover:border-ink/30">Watch the 3-minute demo</a>
          </div>
        </BlurFade>
      </div>
      <BlurFade delay={1.05} className="relative mx-auto mt-16 max-w-5xl md:mt-20">
        <div className="relative rounded-[20px]">
          <ProductFrame name="hero-loop" url="rulelab · Policy Studio" />
          <BorderBeam size={220} duration={9} colorFrom="#c8102e" colorTo="#f4a6b4" className="rounded-2xl" />
        </div>
        <p className="mt-4 text-center text-xs text-muted">Motion graphics of the RuleLab workspace with sample data.</p>
      </BlurFade>
    </section>
  );
}

/* ---------------------------------------------------------------- 2 · the problem */

const PEOPLE = [["a", "Elderly citizens"], ["b", "People with disabilities"], ["c", "Villages without signal"]] as const;

export function Problem() {
  const [served, setServed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { timer = window.setTimeout(() => setServed(true), 2200); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, []);
  return (
    <section className="bg-mist px-4 py-24 md:py-36" aria-labelledby="problem-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>The problem</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-3xl"><span id="problem-title">One sentence can lock people out.</span></Heading></BlurFade>
        <BlurFade inView delay={0.2}>
          <blockquote className="mt-10 max-w-3xl border-l-4 border-brand pl-6 font-serif text-3xl leading-snug text-ink md:text-4xl">
            “Applications may{" "}
            <Highlighter action="highlight" color="#fde2e7" animationDuration={900}>only</Highlighter>{" "}
            be submitted through a digital app.”
          </blockquote>
          <p className="mt-4 max-w-2xl text-ink-2">A draft article can read like progress and still conflict with the Public Service Law and the Disability Law.
            Drafters have to check every article against overlapping regulations, by hand, under tight deadlines.</p>
        </BlurFade>
        <div ref={ref} className="mt-14 grid gap-5 sm:grid-cols-3">
          {PEOPLE.map(([k, label], i) => (
            <BlurFade key={k} inView delay={0.15 + i * 0.12}>
              <figure className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
                <div className="relative aspect-square overflow-hidden">
                  <img src={`${MEDIA}/citizen-${k}-locked.webp`} alt="" loading="lazy" className={cn("absolute inset-0 size-full object-cover transition-all duration-1000", served && "opacity-0")} />
                  <img src={`${MEDIA}/citizen-${k}-served.webp`} alt="" loading="lazy" className={cn("absolute inset-0 size-full object-cover opacity-0 transition-all duration-1000", served && "opacity-100")} />
                  <span className={cn("absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold text-white transition-colors duration-700", served ? "bg-good" : "bg-ink")}>{served ? "Served" : "Locked out"}</span>
                </div>
                <figcaption className="px-5 py-4 font-semibold text-ink">{label}</figcaption>
              </figure>
            </BlurFade>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">Illustrations. RuleLab flags the exclusion while the text is still a draft and proposes an assisted channel.</p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 3 · grounded in the collection (live numbers) */

export function Numbers() {
  const data = useCollection();
  const s = data?.summary;
  const stats = s ? [
    [s.unique_regulations, "regulations", "national and regional"],
    [s.articles, "articles & blocks", "each with its source"],
    [s.mapped_provinces, `of ${s.province_total} provinces`, "with regional documents"],
    [Object.keys(data!.types).length, "regulation types", "from UU to Perbup"],
  ] as const : null;
  const chips = data ? [
    ...Object.entries(data.types).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${TYPE_NAMES[k] ?? k} · ${n.toLocaleString("en-US")}`),
    ...Object.entries(data.topics).sort((a, b) => b[1] - a[1]).map(([k]) => TOPIC_NAMES[k] ?? k.replace(/_/g, " ")),
  ] : [];
  return (
    <section className="px-4 py-24 md:py-32" aria-labelledby="numbers-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>Grounded in sources</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-3xl"><span id="numbers-title">Every check starts from Indonesia’s legal collection.</span></Heading></BlurFade>
        <BlurFade inView delay={0.15}><Lead>Official texts collected from JDIH portals, split into articles, enriched by Gemini and indexed for hybrid search. The figures below are read live from the collection.</Lead></BlurFade>
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4" aria-live="polite">
          {stats ? stats.map(([value, label, hint], i) => (
            <BlurFade key={label} inView delay={0.1 + i * 0.08} className="bg-white p-6 md:p-8">
              <div className="text-4xl font-bold tracking-[-0.04em] text-ink tabular-nums md:text-5xl"><NumberTicker value={value} locale="en-US" /></div>
              <div className="mt-2 font-semibold text-ink">{label}</div>
              <div className="text-sm text-muted">{hint}</div>
            </BlurFade>
          )) : (
            <div className="col-span-full bg-white p-8 text-ink-2">{data === null ? "Collection figures are temporarily unavailable." : "Loading the collection…"}</div>
          )}
        </div>
        {chips.length > 0 && (
          <div className="relative mt-10 overflow-hidden">
            <Marquee pauseOnHover className="[--duration:45s] [--gap:0.75rem]">
              {chips.map((c) => <span key={c} className="whitespace-nowrap rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink-2">{c}</span>)}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white" />
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 4 · how it works (sticky story) */

const STEPS = [
  { key: "step-draft", n: "01", title: "Draft", icon: BookOpenText, url: "rulelab · Policy Studio · Draft",
    text: "Start from a plain-language brief. Gemini writes the draft in the official structure — considerations, legal basis and numbered articles — grounded in retrieved laws. Every edit is saved as a new version." },
  { key: "step-verify", n: "02", title: "Verify sources", icon: ShieldCheck, url: "rulelab · Policy Studio · Verify sources",
    text: "Hybrid search pulls the relevant clauses and specialist agents review each article. Findings link to the exact article, page and document fingerprint; citations outside the evidence are rejected. The reviewer applies a fix with one click." },
  { key: "step-impact", n: "03", title: "Test impact", icon: Users, url: "rulelab · Policy Studio · Test impact",
    text: "Compare two drafts with the same assumptions: who is served, who is left out, cost and staff workload. Then synthetic personas debate both drafts over several rounds, clustered by issue — to prepare public consultation, not replace it." },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)); });
    }, { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section id="cara-kerja" className="bg-mist px-4 py-24 md:py-32" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>How it works</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-3xl"><span id="how-title">Draft. Verify. Test the impact.</span></Heading></BlurFade>
        <BlurFade inView delay={0.15}><Lead>One flow in one workspace. Each stage keeps the version it worked on, so a review can never silently overwrite a newer draft.</Lead></BlurFade>
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            {STEPS.map((s, i) => (
              <div key={s.key} ref={(el) => { refs.current[i] = el; }} data-step={i} className="flex min-h-0 flex-col justify-center py-6 lg:min-h-[62vh]">
                <div className={cn("rounded-3xl border p-7 transition-all duration-500", active === i ? "border-brand/30 bg-white shadow-[0_20px_60px_-30px_rgba(200,16,46,0.35)]" : "border-transparent opacity-60 lg:opacity-45")}>
                  <div className="flex items-center gap-3">
                    <span className={cn("grid size-10 place-items-center rounded-xl transition-colors", active === i ? "bg-brand text-white" : "bg-white text-ink-2 ring-1 ring-line")}><s.icon className="size-5" /></span>
                    <span className="font-mono text-sm text-muted">{s.n}</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-bold tracking-tight text-ink md:text-3xl">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-2">{s.text}</p>
                </div>
                <div className="mt-6 lg:hidden"><ProductFrame name={s.key} url={s.url} /></div>
              </div>
            ))}
          </div>
          <div className="relative hidden lg:block">
            <div className="sticky top-28">
              <ProductFrame name={STEPS[active].key} url={STEPS[active].url} />
              <div className="mt-5 flex justify-center gap-2" aria-hidden="true">
                {STEPS.map((s, i) => <span key={s.key} className={cn("h-1.5 rounded-full transition-all duration-500", active === i ? "w-10 bg-brand" : "w-4 bg-line")} />)}
              </div>
              <p className="mt-3 text-center text-xs text-muted">Motion graphics of the workspace with sample data.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 5 · demo video */

export function Demo() {
  return (
    <section id="demo" className="px-4 py-24 md:py-32" aria-labelledby="demo-title">
      <div className="mx-auto max-w-5xl text-center">
        <BlurFade inView><Eyebrow>Demo</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading><span id="demo-title">See the whole flow in three minutes.</span></Heading></BlurFade>
        <BlurFade inView delay={0.2} className="mt-12">
          <HeroVideoDialog animationStyle="from-center" videoSrc={`${MEDIA}/rulelab-demo.mp4`} thumbnailSrc={`${MEDIA}/demo-poster.jpg`} thumbnailAlt="RuleLab demo video" className="mx-auto max-w-4xl" />
        </BlurFade>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 6 · features (bento) */

const CITES = [
  { ok: true, label: "UU 25/2009 · Pasal 29 ayat (1)", hash: "244cbe9a0ae0" },
  { ok: true, label: "UU 8/2016 · Pasal 19", hash: "cae383fd43c9" },
  { ok: false, label: "UU 25/2009 · Pasal 87 ayat (4)", hash: "not in the evidence" },
];
const AUDIT = [
  ["Brief → Draft v1", "Gemini · 6 articles"], ["Article 2 edited → v2", "Drafter"], ["Source review · 3 findings", "11 citations verified"],
  ["Proposal applied → v3", "Reviewer note attached"], ["A/B projection", "assumption-based model"], ["Exported", "Draft + review report (.docx)"],
];
const PERSONAS = ["SA", "NA", "BI", "DE", "RA", "AN"];

export function Features() {
  return (
    <section id="produk" className="bg-mist px-4 py-24 md:py-32" aria-labelledby="features-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>Product</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-3xl"><span id="features-title">Everything a drafter needs, in one workspace.</span></Heading></BlurFade>
        <BlurFade inView delay={0.2} className="mt-14">
          <BentoGrid className="auto-rows-[26rem] grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3">
            <BentoCard name="Citation guard" className="md:col-span-2" Icon={Fingerprint} href="/workspace" cta="Verify a draft"
              description="Each finding quotes the exact article, page and SHA-256 fingerprint. Anything outside the retrieved evidence is rejected."
              background={
                <div className="absolute inset-x-6 top-6 space-y-2 [mask-image:linear-gradient(to_top,transparent_5%,#000_45%)]">
                  <div className="flex justify-end"><Sample /></div>
                  {CITES.map((c) => (
                    <div key={c.label} className={cn("relative flex items-center justify-between overflow-hidden rounded-xl border bg-white px-4 py-3 text-sm", c.ok ? "border-line" : "border-brand/40")}>
                      <span className="font-semibold text-ink">{c.label}</span>
                      <span className={cn("font-mono text-xs", c.ok ? "text-good" : "text-brand")}>{c.ok ? `✓ ${c.hash}` : `✕ ${c.hash}`}</span>
                      {!c.ok && <BorderBeam size={80} duration={5} colorFrom="#c8102e" colorTo="#f4a6b4" />}
                    </div>
                  ))}
                </div>
              } />
            <BentoCard name="Version history & audit" className="md:col-span-1" Icon={History} href="/workspace?view=activity" cta="Open activity"
              description="Immutable versions, reviewer notes and every agent step are logged, so each change can be explained."
              background={
                <div className="absolute inset-x-5 top-5 h-48 overflow-hidden md:h-56 [mask-image:linear-gradient(to_top,transparent_10%,#000_55%)]">
                  <div className="mb-2 flex justify-end"><Sample /></div>
                  <AnimatedList delay={1600}>
                    {AUDIT.map(([a, b]) => (
                      <div key={a} className="w-full rounded-xl border border-line bg-white px-3 py-2 text-left">
                        <div className="text-sm font-semibold text-ink">{a}</div><div className="text-xs text-muted">{b}</div>
                      </div>
                    ))}
                  </AnimatedList>
                </div>
              } />
            <BentoCard name="Source-cited legal library" className="md:col-span-1" Icon={Search} href="/workspace?view=library" cta="Search the library"
              description="Search regulations, open the original document and ask questions answered only from cited articles."
              background={
                <div className="absolute inset-x-5 top-6 space-y-3 [mask-image:linear-gradient(to_top,transparent_10%,#000_55%)]">
                  <div className="flex justify-end"><Sample /></div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-white">What must agencies provide for people with disabilities?</div>
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm text-ink ring-1 ring-line">Reasonable accommodation in public services… <span className="mt-1 block text-xs font-semibold text-good">UU 8/2016 · Pasal 19 · source-verified</span></div>
                </div>
              } />
            <BentoCard name="Persona & crowd simulation" className="md:col-span-2" Icon={Users} href="/workspace?view=social" cta="Run the forum"
              description="8–32 synthetic personas debate drafts A and B over up to five rounds; a crowd network shows how opinions could spread. Not a survey."
              background={
                <div className="absolute inset-x-0 top-0 flex h-[58%] items-center justify-center [mask-image:linear-gradient(to_top,transparent_5%,#000_45%)] md:left-auto md:right-0 md:h-full md:w-2/3 md:[mask-image:linear-gradient(to_top,transparent_15%,#000_60%)]">
                  <div className="relative flex size-[300px] scale-[0.7] items-center justify-center md:scale-100">
                    <span className="z-10 grid size-16 place-items-center rounded-full bg-ink text-sm font-bold text-white">Draft</span>
                    <OrbitingCircles iconSize={38} radius={95} duration={26}>
                      {PERSONAS.slice(0, 3).map((p) => <span key={p} className="grid size-9 place-items-center rounded-full bg-brand text-xs font-bold text-white">{p}</span>)}
                    </OrbitingCircles>
                    <OrbitingCircles iconSize={30} radius={140} duration={34} reverse>
                      {PERSONAS.slice(3).map((p) => <span key={p} className="grid size-8 place-items-center rounded-full bg-white text-xs font-bold text-ink ring-1 ring-line">{p}</span>)}
                    </OrbitingCircles>
                  </div>
                </div>
              } />
            <BentoCard name="Regulation map of Indonesia" className="md:col-span-1" Icon={MapPinned} href="#koleksi" cta="Explore the map"
              description="Browse the collection by issuer, coverage or regional mentions across all 38 provinces."
              background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,#fde2e7,transparent_55%)]" />} />
            <BentoCard name="Official format & Word export" className="md:col-span-1" Icon={FileDown} href="/workspace" cta="Start a draft"
              description="Fifteen regulation types with considerations, legal basis and numbered articles; export the draft and the review report to .docx."
              background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#eef1f6,transparent_60%)]" />} />
            <BentoCard name="A/B impact model" className="md:col-span-1" Icon={Scale} href="/workspace" cta="Compare drafts"
              description="A transparent, assumption-based model: served = N·p + N·(1−p)·q, with ±10-point sensitivity. No LLM arithmetic."
              background={<div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,#e8f6ee,transparent_60%)]" />} />
          </BentoGrid>
        </BlurFade>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 7 · trust (architecture beams) */

function Node({ refEl, icon: Icon, label, sub, className }: { refEl: React.Ref<HTMLDivElement>; icon: React.ElementType; label: string; sub?: string; className?: string }) {
  return (
    <div ref={refEl} className={cn("z-10 flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-white px-3 py-3 shadow-sm sm:px-4", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-mist text-ink"><Icon className="size-5" /></span>
      <div className="text-left"><div className="text-sm font-bold text-ink">{label}</div>{sub && <div className="text-xs text-muted">{sub}</div>}</div>
    </div>
  );
}

export function Trust() {
  const box = useRef<HTMLDivElement>(null);
  const draft = useRef<HTMLDivElement>(null), core = useRef<HTMLDivElement>(null);
  const gemini = useRef<HTMLDivElement>(null), search = useRef<HTMLDivElement>(null), sql = useRef<HTMLDivElement>(null), gcs = useRef<HTMLDivElement>(null);
  const principles = [
    [Fingerprint, "Every claim has a source", "Article, page and SHA-256 fingerprint of the original document."],
    [ShieldCheck, "Out-of-evidence citations are rejected", "Model output is validated against a strict schema and the retrieved evidence."],
    [GitBranch, "Versions are immutable", "A review bound to an older version can never overwrite a newer draft."],
    [Landmark, "People decide", "RuleLab supports drafters; it does not certify legal validity."],
  ] as const;
  return (
    <section id="sumber" className="px-4 py-24 md:py-32" aria-labelledby="trust-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>Trust</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-3xl"><span id="trust-title">Every claim can be traced.</span></Heading></BlurFade>
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <div ref={box} className="relative flex min-h-[380px] flex-col items-center justify-between gap-8 rounded-3xl border border-line bg-mist p-5 sm:flex-row sm:gap-6 md:p-10">
            <div className="flex flex-col gap-10"><Node refEl={draft} icon={BookOpenText} label="Your draft" sub="brief, article, question" /></div>
            <div ref={core} className="z-10 flex flex-col items-center gap-2 rounded-3xl bg-ink px-5 py-6 text-white shadow-xl"><Logo size={40} /><span className="text-sm font-bold">RuleLab</span><span className="text-[11px] text-white/70">agents + validators</span></div>
            <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-col sm:gap-4">
              <Node refEl={gemini} icon={Brain} label="Gemini" sub="Vertex AI" />
              <Node refEl={search} icon={Search} label="Elasticsearch" sub="BM25 + vectors" />
              <Node refEl={sql} icon={Database} label="Cloud SQL" sub="versions & audit" />
              <Node refEl={gcs} icon={Cloud} label="Cloud Storage" sub="original documents" />
            </div>
            <AnimatedBeam containerRef={box} fromRef={draft} toRef={core} pathColor="#c9ced6" pathWidth={2} pathOpacity={0.6} gradientStartColor="#c8102e" gradientStopColor="#f4a6b4" />
            {[gemini, search, sql, gcs].map((r, i) => <AnimatedBeam key={i} containerRef={box} fromRef={core} toRef={r} curvature={(i - 1.5) * 28} delay={i * 0.4} pathColor="#c9ced6" pathWidth={2} pathOpacity={0.6} gradientStartColor="#c8102e" gradientStopColor="#f4a6b4" />)}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map(([Icon, title, text], i) => (
              <BlurFade key={title} inView delay={0.1 + i * 0.08}>
                <MagicCard className="h-full rounded-2xl" gradientColor="#fde2e7">
                  <div className="p-6">
                    <Icon className="size-6 text-brand" />
                    <h3 className="mt-4 font-bold text-ink">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">{text}</p>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
        <BlurFade inView delay={0.2} className="mt-12">
          <div className="relative">
            <div className="absolute right-4 top-3 z-10"><Sample>Sample log</Sample></div>
            <Terminal className="max-w-none">
              <TypingAnimation>&gt; review draft v2 · 4 articles</TypingAnimation>
              <AnimatedSpan className="text-ink-2">retrieved 27 articles · hybrid BM25 + vector</AnimatedSpan>
              <AnimatedSpan className="text-good">✓ UU 25/2009 Pasal 29 ayat (1) · quote matches · sha256 244cbe9a…</AnimatedSpan>
              <AnimatedSpan className="text-good">✓ UU 8/2016 Pasal 19 · quote matches · sha256 cae383fd…</AnimatedSpan>
              <AnimatedSpan className="text-brand">✕ UU 25/2009 Pasal 87 ayat (4) · not in the evidence → rejected</AnimatedSpan>
              <TypingAnimation className="text-ink">3 findings ready for human review</TypingAnimation>
            </Terminal>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- 8 · participation + closing + footer */

export function Participation() {
  const rights = [["Heard", "People can give their views."], ["Considered", "Their input is weighed in the text."], ["Answered", "They receive an explanation."]];
  return (
    <section id="partisipasi" className="bg-mist px-4 py-24 md:py-32" aria-labelledby="participation-title">
      <div className="mx-auto max-w-6xl">
        <BlurFade inView><Eyebrow>Public participation</Eyebrow></BlurFade>
        <BlurFade inView delay={0.1}><Heading className="max-w-4xl"><span id="participation-title">Prepare public consultation. <Serif>Don’t replace it.</Serif></span></Heading></BlurFade>
        <BlurFade inView delay={0.15}><Lead>The Constitutional Court describes meaningful participation as three rights. Synthetic personas help drafters anticipate concerns; only real people can exercise these rights.</Lead></BlurFade>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {rights.map(([t, d], i) => (
            <BlurFade key={t} inView delay={0.1 + i * 0.1}>
              <div className="rounded-3xl border border-line bg-white p-7">
                <div className="font-mono text-sm text-muted">0{i + 1}</div>
                <div className="mt-3 text-2xl font-bold text-ink">{t}</div>
                <p className="mt-2 text-ink-2">{d}</p>
              </div>
            </BlurFade>
          ))}
        </div>
        <BlurFade inView delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-bold uppercase tracking-[0.18em] text-brand">Next</span>
            {["Practitioner validation", "Real public-input module", "Response report for consultations"].map((x) => (
              <span key={x} className="rounded-full border border-line bg-white px-4 py-2 font-medium text-ink-2">{x}</span>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <section className="relative overflow-hidden px-4 py-28 md:py-40" aria-labelledby="closing-title">
      <DotPattern className="pointer-events-none text-neutral-300/80 [mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <BlurFade inView><Logo size={56} /></BlurFade>
        <BlurFade inView delay={0.1}>
          <h2 id="closing-title" className="mt-8 text-balance text-5xl font-bold tracking-[-0.045em] text-ink md:text-7xl">
            Laws that fit together — <Serif>and fit the people they serve.</Serif>
          </h2>
        </BlurFade>
        <BlurFade inView delay={0.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/workspace"><ShimmerButton background="#c8102e" shimmerColor="#ffd6dd" className="px-7 py-3.5 text-base font-semibold">Open the workspace <ArrowRight className="ml-2 size-4" /></ShimmerButton></a>
            <a href={GITHUB} rel="noopener"><InteractiveHoverButton className="border-line bg-white text-ink">View on GitHub</InteractiveHoverButton></a>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row">
        <div className="flex items-center gap-2.5"><Logo size={22} /><span className="font-semibold text-ink">RuleLab</span><span>· Team RuleLab</span></div>
        <div className="flex flex-wrap items-center justify-center gap-5">
          <a href="/guide" className="hover:text-ink">User guide</a>
          <a href={GITHUB} rel="noopener" className="inline-flex items-center gap-1.5 hover:text-ink"><Github className="size-4" />GitHub</a>
          <span>Built with Gemini · Google Cloud</span>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-6xl text-center text-xs text-muted md:text-left">
        RuleLab supports review; it does not certify legal validity. Source texts are snapshots, not consolidated law in force. Persona opinions are synthetic.
      </p>
    </footer>
  );
}
