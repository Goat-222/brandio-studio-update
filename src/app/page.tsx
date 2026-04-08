"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const EASE = [0.65, 0.05, 0, 1] as const;

// Lando-style split text reveal: each word in a clipping mask, slides up on view
function RevealText({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.15em] -mb-[0.15em]">
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.95, delay: delay + i * 0.06, ease: EASE }}
            className="inline-block"
          >
            {w}
            {i < words.length - 1 && "\u00A0"}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Magnetic button wrapper
function Magnetic({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.4);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };
  const onLeave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy, display: "inline-block" }} className={className}>
      {children}
    </motion.div>
  );
}

// Animated number counter
function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(value.replace(/\D/g, ""));
    const suffix = value.replace(/[\d]/g, "");
    const controls = animate(0, num, {
      duration: 1.8,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref}>{display}</span>;
}

const services = [
  { num: "01", icon: "✦", title: "Création de logo", desc: "Un symbole unique, intemporel, qui incarne l'âme de votre marque.", color: "#ff4d1f" },
  { num: "02", icon: "◐", title: "Identité visuelle", desc: "Charte complète : couleurs, typographies, supports.", color: "#ffb347" },
  { num: "03", icon: "◢", title: "Web design & dev", desc: "Sites modernes, performants, conçus pour convertir.", color: "#0a0a0a" },
  { num: "04", icon: "⬡", title: "Stratégie de marque", desc: "Positionnement, message, ton de voix.", color: "#ff4d1f" },
  { num: "05", icon: "♺", title: "Social media", desc: "Création de contenu et gestion de vos réseaux.", color: "#0a0a0a" },
  { num: "06", icon: "✺", title: "Accompagnement IA", desc: "Intégrez l'IA dans vos processus créatifs et marketing.", color: "#ffb347" },
];

const processSteps = [
  { num: "01", title: "Découverte", desc: "On apprend à connaître votre univers, vos objectifs et votre audience." },
  { num: "02", title: "Stratégie", desc: "On définit le positionnement, le ton et la direction artistique." },
  { num: "03", title: "Création", desc: "On donne vie à votre identité visuelle et à vos supports." },
  { num: "04", title: "Lancement", desc: "On déploie, on optimise et on vous accompagne après la mise en ligne." },
];

const faqs = [
  { q: "Quels services propose Brandio Studio ?", a: "Création de logo, identité visuelle complète, web design, stratégie de marque, social media management et accompagnement IA." },
  { q: "Travaillez-vous avec des clients en France ?", a: "Oui, nous accompagnons des clients en France, Belgique, Suisse, Luxembourg et à l'international." },
  { q: "Quels sont les délais d'un projet ?", a: "Logo : 1-2 semaines · Identité complète : 3-5 semaines · Site web : 4-8 semaines." },
  { q: "Quels sont vos tarifs ?", a: "Les tarifs varient selon le périmètre. Nous proposons un devis gratuit et personnalisé sous 24h." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.8, 0.2, 1] as const } },
};

function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ring, setRing] = useState({ x: 0, y: 0 });
  const [big, setBig] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Disable on touch devices / small screens
    const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouch) { document.body.style.cursor = "auto"; return; }
    setEnabled(true);

    let rx = 0, ry = 0, mx = 0, my = 0;
    const move = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; setPos({ x: mx, y: my }); };
    const loop = () => { rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15; setRing({ x: rx, y: ry }); requestAnimationFrame(loop); };
    window.addEventListener("mousemove", move);
    loop();
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setBig(!!t.closest("a, button, .interactive"));
    };
    window.addEventListener("mouseover", onOver);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", onOver); };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ background: "#ff4d1f", x: pos.x, y: pos.y, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: big ? 60 : 14, height: big ? 60 : 14 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-fg/40 rounded-full pointer-events-none z-[9998]"
        style={{ transform: `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)` }}
      />
    </>
  );
}

// === SIMULATOR ===
const simServices = [
  { id: "logo", label: "Création de logo", min: 600, max: 1500 },
  { id: "identity", label: "Identité visuelle complète", min: 1500, max: 4000 },
  { id: "web", label: "Site web (vitrine / one-page)", min: 2000, max: 5000 },
  { id: "ecom", label: "Site e-commerce", min: 4000, max: 12000 },
  { id: "strategy", label: "Stratégie de marque", min: 1200, max: 3500 },
  { id: "social", label: "Social media (mois)", min: 800, max: 2500 },
  { id: "ai", label: "Accompagnement IA", min: 1000, max: 4000 },
];
const urgencyOptions = [
  { id: "normal", label: "Standard", mult: 1 },
  { id: "fast", label: "Accéléré (-20% délai)", mult: 1.25 },
  { id: "urgent", label: "Urgent (-40% délai)", mult: 1.5 },
];

function Simulator() {
  const [selected, setSelected] = useState<string[]>(["logo", "identity"]);
  const [urgency, setUrgency] = useState("normal");
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const mult = urgencyOptions.find((u) => u.id === urgency)!.mult;
  const min = Math.round(simServices.filter((s) => selected.includes(s.id)).reduce((a, b) => a + b.min, 0) * mult);
  const max = Math.round(simServices.filter((s) => selected.includes(s.id)).reduce((a, b) => a + b.max, 0) * mult);
  const fmt = (n: number) => new Intl.NumberFormat("fr-BE").format(n);

  const subject = encodeURIComponent("Demande de devis Brandio Studio");
  const body = encodeURIComponent(
    `Bonjour,\n\nJe souhaite un devis pour :\n${selected
      .map((id) => `• ${simServices.find((s) => s.id === id)?.label}`)
      .join("\n")}\n\nDélai souhaité : ${urgencyOptions.find((u) => u.id === urgency)?.label}\nEstimation indicative : ${fmt(min)}€ - ${fmt(max)}€\n\nMerci !`,
  );

  return (
    <section id="simulator" className="py-20 md:py-32 bg-fg text-bg relative overflow-hidden">
      <div className="absolute inset-0 dotted-bg opacity-15" />
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 relative">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
            <span className="w-8 h-px bg-accent" /> Simulateur
          </div>
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-medium leading-[1.05]">
            <RevealText>Estimez votre </RevealText><em className="italic text-accent inline-block"><RevealText delay={0.15}>projet.</RevealText></em>
          </h2>
          <p className="text-bg/70 text-lg mt-6">Une estimation indicative en quelques clics. Le devis final dépend du périmètre exact.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-5 font-bold">1 · Sélectionnez vos services</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {simServices.map((s) => {
                const on = selected.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggle(s.id)}
                    className={`interactive text-left p-5 rounded-2xl border-2 transition-all ${
                      on ? "bg-accent border-accent text-white" : "border-bg/30 hover:border-accent"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-medium">{s.label}</span>
                      <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${on ? "bg-white text-accent border-white" : "border-bg/40"}`}>
                        {on ? "✓" : ""}
                      </span>
                    </div>
                    <div className={`text-xs mt-2 ${on ? "text-white/80" : "text-bg/50"}`}>
                      à partir de {fmt(s.min)}€
                    </div>
                  </button>
                );
              })}
            </div>

            <h3 className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-5 font-bold">2 · Délai souhaité</h3>
            <div className="flex flex-wrap gap-3">
              {urgencyOptions.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setUrgency(u.id)}
                  className={`interactive px-5 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                    urgency === u.id ? "bg-accent border-accent text-white" : "border-bg/30 hover:border-accent"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          <motion.div
            layout
            className="lg:sticky lg:top-28 p-8 rounded-3xl border-2 border-bg/30 bg-bg/[0.04] backdrop-blur-sm"
          >
            <div className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-3 font-bold">Estimation indicative</div>
            <div className="font-display font-medium leading-none mb-2">
              {selected.length === 0 ? (
                <div className="text-3xl text-bg/40">Sélectionnez un service</div>
              ) : (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl gradient-text">{fmt(min)}€</span>
                  <span className="text-bg/40 text-2xl">—</span>
                  <span className="text-4xl sm:text-5xl gradient-text">{fmt(max)}€</span>
                </div>
              )}
            </div>
            <div className="text-bg/50 text-sm mt-4">
              {selected.length} service{selected.length > 1 ? "s" : ""} · Délai {urgencyOptions.find((u) => u.id === urgency)?.label.toLowerCase()}
            </div>
            <div className="mt-6 pt-6 border-t border-bg/20 text-bg/60 text-sm">
              ✦ Devis personnalisé sous 24h<br />
              ✦ Sans engagement<br />
              ✦ Paiement échelonné possible
            </div>
            <a
              href={`mailto:contact@brandio-studio.com?subject=${subject}&body=${body}`}
              className="mt-6 w-full inline-flex justify-center items-center gap-3 px-6 py-4 bg-accent hover:bg-[#ff6a3d] text-white rounded-full font-medium transition-colors"
            >
              Recevoir mon devis →
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const { scrollYProgress: pageProgress } = useScroll();
  const progressX = useSpring(pageProgress, { stiffness: 100, damping: 30 });

  // Lenis smooth scroll (Lando Norris style)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <main className="bg-bg text-fg">
      <Cursor />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[9997] origin-left"
        style={{ scaleX: progressX }}
      />

      {/* Floating decorative shapes */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[20%] right-[5%] w-16 h-16 hidden lg:block pointer-events-none z-10"
      >
        <div className="w-full h-full rounded-full border-2 border-fg" />
      </motion.div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl bg-bg/70 border-b border-border">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3">
            <Image src="/brandio-logo.png" alt="Brandio Studio logo" width={56} height={56} priority className="w-12 h-12 sm:w-14 sm:h-14 object-contain" />
            <span className="font-display text-xl sm:text-2xl font-bold">Brandio<span className="text-accent">.</span></span>
          </a>
          <div className="hidden md:flex gap-10 text-sm font-medium">
            <a href="#services" className="hover:text-accent transition-colors">Services</a>
            <a href="#simulator" className="hover:text-accent transition-colors">Simulateur</a>
            <a href="#about" className="hover:text-accent transition-colors">À propos</a>
            <a href="#process" className="hover:text-accent transition-colors">Process</a>
            <a href="#faq" className="hover:text-accent transition-colors">FAQ</a>
          </div>
          <a href="#contact" className="hidden md:inline-flex px-6 py-3 bg-fg text-bg rounded-full text-sm font-medium hover:bg-accent transition-all items-center gap-2">
            Démarrer <span>→</span>
          </a>
          <button
            type="button"
            aria-label={navOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((v) => !v)}
            className="md:hidden interactive w-11 h-11 flex flex-col items-center justify-center gap-1.5 border-2 border-fg rounded-full"
          >
            <span className={`block w-5 h-0.5 bg-fg transition-transform ${navOpen ? "translate-y-1 rotate-45" : ""}`} />
            <span className={`block w-5 h-0.5 bg-fg transition-transform ${navOpen ? "-translate-y-1 -rotate-45" : ""}`} />
          </button>
        </div>
        {/* Mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: navOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden border-t border-border"
        >
          <div className="px-5 py-6 flex flex-col gap-4 text-lg font-medium">
            {[
              ["Services", "#services"],
              ["Simulateur", "#simulator"],
              ["À propos", "#about"],
              ["Process", "#process"],
              ["FAQ", "#faq"],
              ["Contact", "#contact"],
            ].map(([l, h]) => (
              <a key={h} href={h} onClick={() => setNavOpen(false)} className="py-2 border-b border-border hover:text-accent">
                {l}
              </a>
            ))}
          </div>
        </motion.div>
      </nav>

      {/* Hero */}
      <motion.header ref={heroRef} className="min-h-screen flex items-center pt-32 pb-20 relative overflow-hidden">
        {/* Blobs */}
        <div className="hero-blob w-[500px] h-[500px] top-[10%] -left-40" style={{ background: "rgba(255,77,31,0.35)" }} />
        <div className="hero-blob w-[400px] h-[400px] bottom-[10%] right-[5%]" style={{ background: "rgba(255,179,71,0.4)" }} />
        <div className="hero-blob w-[300px] h-[300px] top-[40%] left-[40%]" style={{ background: "rgba(120,80,255,0.15)" }} />

        <motion.div style={{ y: heroY }} className="max-w-[1320px] mx-auto px-5 sm:px-8 relative w-full">
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="sticker"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Disponible · 2 places en avril 2026
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="px-4 py-2 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              ✦ De l'idée à l'identité
            </motion.div>
          </div>

          <h1 className="font-display text-[clamp(56px,9vw,160px)] mb-10 font-medium leading-[0.95]">
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              >
                Façonnons
              </motion.div>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex items-center gap-[0.25em] flex-wrap"
              >
                <span className="outline-text">une</span>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-[0.8em] h-[0.8em] rounded-full flex-shrink-0"
                  style={{ background: "conic-gradient(from 0deg, #ff4d1f, #ffb347, #ff4d1f)" }}
                />
                <span>marque</span>
              </motion.div>
            </div>
            <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="italic gradient-text font-black"
              >
                inoubliable.
              </motion.div>
            </div>
          </h1>

          <div className="flex flex-wrap items-end justify-between gap-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl text-fg/80 max-w-xl"
            >
              <span className="italic gradient-text font-semibold">De l'idée à l'identité.</span><br />Studio de branding, identité visuelle & web design basé à Bruxelles.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-3 flex-wrap"
            >
              <Magnetic>
                <a href="#contact" className="px-6 sm:px-8 py-4 sm:py-5 bg-fg text-bg rounded-full text-base font-medium hover:bg-accent transition-colors flex items-center gap-3 shadow-[6px_6px_0_0_var(--color-accent)]">
                  Devis gratuit <span>→</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#services" className="px-6 sm:px-8 py-4 sm:py-5 border-2 border-fg rounded-full text-base font-medium hover:bg-fg hover:text-bg transition-colors inline-block">
                  Nos services
                </a>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </motion.header>

      {/* Marquee */}
      <div className="bg-fg text-bg py-6 overflow-hidden border-y-2 border-fg -rotate-1 -mx-4">
        <div className="marquee-track font-display text-4xl sm:text-5xl md:text-7xl italic font-medium">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="inline-flex gap-16 items-center">
              {["Branding", "Identité", "Web Design", "Stratégie", "IA"].map((w, i) => (
                <span key={i} className="inline-flex items-center gap-16">
                  <span>{w}</span>
                  <span className="text-accent text-4xl not-italic">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="services" className="py-20 md:py-32 relative">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="flex items-end justify-between flex-wrap gap-8 mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
                <span className="w-8 h-px bg-accent" /> Services
              </div>
              <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
                <RevealText>Une expertise</RevealText><br />
                <em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.1}>complète.</RevealText></em>
              </h2>
            </div>
            <p className="text-fg/70 text-xl max-w-md">De la stratégie à la mise en ligne, chaque étape est pensée pour faire rayonner votre identité.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                onMouseMove={handleCardMove}
                className="service-card interactive p-8 bg-bg-2 border-2 border-fg rounded-3xl min-h-[280px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:translate-x-1 shadow-[6px_6px_0_0_var(--color-fg)] hover:shadow-[2px_2px_0_0_var(--color-fg)]"
              >
                <div className="flex justify-between items-center font-display text-sm relative z-10">
                  <span className="font-bold" style={{ color: s.color }}>{s.num}</span>
                  <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: s.color, color: s.color === "#0a0a0a" ? "#fff" : "#fff" }}>{s.icon}</span>
                </div>
                <div className="relative z-10">
                  <h3 className="font-display text-3xl mb-3 font-medium">{s.title}</h3>
                  <p className="text-fg/70 text-base">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 md:py-32 bg-fg text-bg relative overflow-hidden">
        <div className="absolute inset-0 dotted-bg opacity-20" />
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 relative">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-20 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
              <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
                <span className="w-8 h-px bg-accent" /> À propos
              </div>
              <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
                <RevealText>Un studio.</RevealText><br />
                <span className="outline-text" style={{ WebkitTextStroke: "1.5px #f6f4ef" }}><RevealText delay={0.1}>Une vision.</RevealText></span><br />
                <RevealText delay={0.2}>Votre </RevealText><em className="italic text-accent inline-block"><RevealText delay={0.3}>succès.</RevealText></em>
              </h2>
              <p className="text-bg/70 text-lg mt-8 max-w-lg">
                Basés à Bruxelles, nous accompagnons des marques ambitieuses en France, Belgique, Suisse, Luxembourg et Canada. Notre obsession : créer des identités fortes qui durent.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-5">
              {[
                { num: "120+", label: "Projets livrés" },
                { num: "5", label: "Pays couverts" },
                { num: "98%", label: "Satisfaction" },
                { num: "6", label: "Services" },
              ].map((s) => (
                <div key={s.label} className="p-7 border-2 border-bg/30 rounded-2xl bg-bg/[0.04]">
                  <div className="font-display text-5xl md:text-6xl gradient-text leading-none font-medium"><Counter value={s.num} /></div>
                  <div className="text-bg/60 text-sm mt-2">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-20 md:py-32">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mb-20">
            <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
              <span className="w-8 h-px bg-accent" /> Process
            </div>
            <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
              <RevealText>4 étapes pour</RevealText><br />
              <RevealText delay={0.1}>une marque </RevealText><em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.25}>solide.</RevealText></em>
            </h2>
          </motion.div>
          <div>
            {processSteps.map((p) => (
              <motion.div
                key={p.num}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ paddingLeft: 24, backgroundColor: "rgba(255,77,31,0.04)" }}
                className="interactive py-12 border-t border-border last:border-b grid md:grid-cols-[100px_1fr_auto] gap-8 items-center"
              >
                <div className="font-display text-3xl text-accent font-medium">{p.num}</div>
                <h3 className="font-display text-4xl md:text-5xl font-medium">{p.title}</h3>
                <p className="text-fg/60 max-w-md md:text-right">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Simulator />

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mb-20">
            <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
              <span className="w-8 h-px bg-accent" /> FAQ
            </div>
            <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
              <RevealText>Questions </RevealText><em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.15}>fréquentes.</RevealText></em>
            </h2>
          </motion.div>
          <div className="max-w-3xl">
            {faqs.map((f, i) => (
              <div
                key={i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="interactive border-t-2 border-fg last:border-b-2 py-8"
              >
                <div className="flex justify-between items-center font-display text-2xl md:text-3xl font-medium">
                  <span>{f.q}</span>
                  <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} className="text-accent text-4xl ml-4 flex-shrink-0">+</motion.span>
                </div>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0, marginTop: openFaq === i ? 16 : 0 }}
                  className="overflow-hidden text-fg/70 text-lg"
                >
                  {f.a}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-40 text-center relative overflow-hidden">
        <div className="hero-blob w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: "rgba(255,77,31,0.2)" }} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-[1320px] mx-auto px-5 sm:px-8 relative">
          <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 justify-center font-bold">
            <span className="w-8 h-px bg-accent" /> Contact
          </div>
          <h2 className="font-display text-[clamp(40px,6vw,88px)] max-w-5xl mx-auto mb-8 font-medium leading-[1.15] pb-8 px-8">
            <RevealText>Prêt à donner vie</RevealText><br /><RevealText delay={0.1}>à votre </RevealText><em className="italic gradient-text inline-block pr-[0.25em]"><RevealText delay={0.25}>marque&nbsp;?</RevealText></em>
          </h2>
          <p className="text-fg/70 text-xl mb-12">Devis gratuit sous 24h.</p>
          <a href="mailto:contact@brandio-studio.com" className="font-display text-[clamp(28px,5vw,64px)] underline decoration-accent decoration-4 underline-offset-8 italic block my-10 hover:gradient-text transition-all">
            contact@brandio-studio.com
          </a>
          <Magnetic>
            <a href="mailto:contact@brandio-studio.com" className="inline-flex items-center gap-3 px-10 py-6 bg-fg text-bg rounded-full text-lg font-medium hover:bg-accent transition-colors shadow-[8px_8px_0_0_var(--color-accent)]">
              Démarrer maintenant <span>→</span>
            </a>
          </Magnetic>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-fg py-16 bg-bg-2">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 grid md:grid-cols-[2fr_1fr_1fr] gap-16">
          <div>
            <a href="/" className="flex items-center gap-3 mb-5">
              <Image src="/brandio-logo.png" alt="Brandio" width={64} height={64} className="w-16 h-16 object-contain" />
              <span className="font-display text-2xl font-bold">Brandio<span className="text-accent">.</span></span>
            </a>
            <p className="text-fg/60 max-w-xs"><em className="italic">De l'idée à l'identité.</em> Studio de branding & web design basé à Bruxelles.</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-fg/50 mb-5 font-bold">Navigation</h4>
            {["Services", "À propos", "Process", "FAQ"].map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="block py-1.5 hover:text-accent transition-colors font-medium">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-fg/50 mb-5 font-bold">Suivez-nous</h4>
            {[
              { name: "Instagram", url: "https://www.instagram.com/brandio.studio/" },
              { name: "LinkedIn", url: "https://www.linkedin.com/in/ermal-ibraj-97379b337/" },
              { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61574321065084" },
            ].map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="block py-1.5 hover:text-accent transition-colors font-medium">{s.name} ↗</a>
            ))}
          </div>
        </div>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 mt-16 pt-8 border-t border-border flex justify-between text-fg/50 text-xs">
          <span>© 2026 Brandio Studio · Bruxelles</span>
          <span>Made with ✦ in Brussels</span>
        </div>
      </footer>
    </main>
  );
}
