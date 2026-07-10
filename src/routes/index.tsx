import { createFileRoute } from "@tanstack/react-router";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atheon — Architecting Digital Presence" },
      {
        name: "description",
        content:
          "Atheon distills complex systems into essential, high-performance digital experiences for the modern era.",
      },
      { property: "og:title", content: "Atheon — Architecting Digital Presence" },
      {
        property: "og:description",
        content:
          "Distilling complex systems into essential, high-performance digital experiences for the modern era.",
      },
    ],
  }),
  component: Index,
});

const EASE = [0.2, 0.8, 0.2, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  }),
};

function Index() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.4 });

  // 3D sphere reacts to scroll
  const sphereScale = useTransform(smooth, [0, 0.6], [1, 1.35]);
  const sphereX = useTransform(smooth, [0, 1], ["0%", "18%"]);
  const sphereRotate = useTransform(smooth, [0, 1], [0, 45]);
  const sphereOpacity = useTransform(smooth, [0, 0.7, 1], [0.9, 0.5, 0]);

  // Nav slides up + fades
  const navY = useTransform(smooth, [0, 0.3], [0, -60]);
  const navOpacity = useTransform(smooth, [0, 0.25], [1, 0]);

  // Hero parallax
  const heroY = useTransform(smooth, [0, 1], [0, -180]);
  const heroOpacity = useTransform(smooth, [0, 0.6], [1, 0]);
  const heroScale = useTransform(smooth, [0, 0.6], [1, 0.94]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[320vh] overflow-hidden bg-background font-sans text-foreground"
    >
      {/* Animated colour blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
          style={{
            background: "radial-gradient(circle at 30% 30%, var(--neon-violet), transparent 60%)",
            animation: "var(--animate-blob)",
          }}
        />
        <div
          className="absolute right-[-8%] top-[20%] h-[600px] w-[600px] rounded-full opacity-70 blur-3xl"
          style={{
            background: "radial-gradient(circle at 60% 40%, var(--neon-pink), transparent 65%)",
            animation: "var(--animate-blob)",
            animationDelay: "-6s",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[20%] h-[520px] w-[520px] rounded-full opacity-60 blur-3xl"
          style={{
            background: "radial-gradient(circle at 40% 60%, var(--neon-cyan), transparent 60%)",
            animation: "var(--animate-blob)",
            animationDelay: "-12s",
          }}
        />
      </div>

      {/* 3D sphere */}
      <motion.div
        style={{
          scale: sphereScale,
          x: sphereX,
          rotate: sphereRotate,
          opacity: sphereOpacity,
        }}
        className="pointer-events-none fixed inset-y-0 right-[-10%] left-[40%] will-change-transform"
      >
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 2, 4]} intensity={1.4} color="#ff5cf7" />
          <directionalLight position={[-4, -2, -3]} intensity={1.1} color="#5cf0ff" />
          <pointLight position={[0, 0, 3]} intensity={1.2} color="#a855f7" />
          <Suspense fallback={null}>
            <Float speed={1.8} rotationIntensity={1.2} floatIntensity={2}>
              <Sphere args={[1.7, 128, 128]}>
                <MeshDistortMaterial
                  color="#8b3df5"
                  distort={0.55}
                  speed={2.2}
                  roughness={0.05}
                  metalness={0.9}
                  emissive="#ff2fd6"
                  emissiveIntensity={0.35}
                />
              </Sphere>
            </Float>
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Vignette + grain overlays */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Hero */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-8 py-8 md:px-14 md:py-10">
        <motion.header
          style={{ y: navY, opacity: navOpacity }}
          className="sticky top-6 z-20 flex items-center justify-between"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={0}
            className="text-2xl font-bold tracking-[0.35em] text-foreground"
          >
            ATHEON
          </motion.div>
          <nav className="hidden gap-8 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground md:flex">
            {["Work", "Philosophy", "Process"].map((item, i) => (
              <motion.a
                key={item}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={i + 1}
                href={`#${item.toLowerCase()}`}
                className="relative transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-neon-pink after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <motion.a
            href="tel:+2349162831373"
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={5}
            className="hidden rounded-full bg-neon-pink px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground shadow-[0_0_40px_-8px_var(--neon-pink)] transition-transform hover:scale-105 md:inline-flex"
          >
            Get in touch
          </motion.a>
        </motion.header>

        <motion.main
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="flex flex-1 flex-col justify-center py-20 md:max-w-3xl"
        >
          <motion.span
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-neon-violet/40 bg-card/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]" />
            Digital Architecture
          </motion.span>
          <h1 className="text-5xl font-bold uppercase leading-[0.92] tracking-tight md:text-[7.5rem]">
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="block text-foreground"
            >
              Architecting
            </motion.span>
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--neon-pink), var(--neon-violet), var(--neon-cyan), var(--neon-pink))",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                animation: "var(--animate-shimmer)",
              }}
            >
              digital
            </motion.span>
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="block text-foreground"
            >
              presence.
            </motion.span>
          </h1>
          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={5}
            className="mt-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Distilling complex systems into essential, high-performance digital
            experiences for the modern era.
          </motion.p>
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={6}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-[0.25em] text-foreground shadow-[0_0_60px_-10px_var(--neon-violet)] transition-transform hover:scale-[1.03]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, var(--neon-violet), var(--neon-pink), var(--neon-violet))",
                backgroundSize: "200% 100%",
                animation: "var(--animate-shimmer)",
              }}
            >
              Inquire for architecture
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#philosophy"
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.25em] text-foreground backdrop-blur transition-colors hover:border-neon-cyan hover:text-neon-cyan"
            >
              Our philosophy
            </a>
          </motion.div>
        </motion.main>

        <footer className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          <span>Est. MMXXVI</span>
          <div className="hidden items-center gap-2 md:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-cyan shadow-[0_0_10px_var(--neon-cyan)]" />
            Available for new projects
          </div>
          <span>New York / Remote</span>
        </footer>
      </div>

      {/* Scroll-reveal sections */}
      <ScrollSection
        id="philosophy"
        eyebrow="01 — Philosophy"
        title="Precision over ornament."
        body="Every pixel earns its place. Every interaction has a purpose. We reduce until only the essential remains — then we make it sing."
      >
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <PhilosophyCard
            title="Minimalism as Strategy"
            body="We strip away the unnecessary to reveal the essential, ensuring every interaction serves a defined purpose."
          />
          <PhilosophyCard
            title="Performance-First Engineering"
            body="We build for speed and scalability, ensuring that your digital architecture is as robust as it is elegant."
          />
        </div>
      </ScrollSection>

      <ScrollSection
        id="practice"
        eyebrow="02 — Practice"
        title="Systems that scale."
        body="We design systems, motion languages, and interface frameworks engineered to grow with the ambitions of the brands we build for."
        align="right"
      />

      <ScrollSection
        id="process"
        eyebrow="03 — Process"
        title="Our process."
        body="A disciplined workflow that turns ambiguity into architecture — from first discovery to shipped code."
      >
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <ProcessStep
            number="01"
            title="Discovery & Strategy"
            body="Mapping the brand’s DNA to define its digital roadmap."
          />
          <ProcessStep
            number="02"
            title="Architectural Design"
            body="Creating cohesive design systems that maintain consistency across all platforms."
          />
          <ProcessStep
            number="03"
            title="Execution & Optimization"
            body="Deploying high-fidelity, scalable code that grows with your business."
          />
        </div>
      </ScrollSection>

      <ScrollSection
        id="contact"
        eyebrow="Contact"
        title="Inquire for architecture."
        body="Ready to build something essential? Reach out directly and we'll map the first steps together."
        align="center"
      >
        <motion.a
          href="tel:+2349110308721"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-neon-pink px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-foreground shadow-[0_0_60px_-12px_var(--neon-pink)] transition-transform hover:scale-105"
        >
          <span>Get in touch</span>
          <span className="text-base">+234 911 030 8721</span>
        </motion.a>
      </ScrollSection>
    </div>
  );
}

function ScrollSection({
  id,
  eyebrow,
  title,
  body,
  align = "left",
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  body: string;
  align?: "left" | "right" | "center";
  children?: React.ReactNode;
}) {
  const alignClass =
    align === "right" ? "ml-auto text-right" : align === "center" ? "mx-auto text-center" : "";
  return (
    <section id={id} className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-8 py-24 md:px-14">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
        className={`max-w-3xl ${alignClass}`}
      >
        <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.4em] text-neon-cyan">
          {eyebrow}
        </span>
        <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight md:text-7xl">
          {title}
        </h2>
        <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
          {body}
        </p>
        {children}
      </motion.div>
    </section>
  );
}

function PhilosophyCard({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="rounded-2xl border border-border/50 bg-card/40 p-8 backdrop-blur transition-colors hover:border-neon-violet/60"
    >
      <h3 className="text-lg font-bold uppercase tracking-[0.15em] text-foreground">{title}</h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function ProcessStep({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative rounded-2xl border border-border/50 bg-card/30 p-8 backdrop-blur transition-colors hover:border-neon-cyan/50"
    >
      <span className="text-xs font-bold uppercase tracking-[0.3em] text-neon-pink">{number}</span>
      <h3 className="mt-4 text-xl font-bold uppercase tracking-[0.1em] text-foreground">{title}</h3>
      <p className="mt-4 leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}
