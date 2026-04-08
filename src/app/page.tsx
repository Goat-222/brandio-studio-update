"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useMotionValue, animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const EASE = [0.65, 0.05, 0, 1] as const;

// === I18N ===
type Lang = "fr" | "en" | "nl";
const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "nl", label: "NL" },
];

const dict = {
  fr: {
    nav: { services: "Services", simulator: "Simulateur", about: "À propos", process: "Process", faq: "FAQ", contact: "Contact", cta: "Démarrer", openMenu: "Ouvrir le menu", closeMenu: "Fermer le menu" },
    hero: {
      badge1: "Disponible · 2 places en avril 2026",
      badge2: "✦ De l'idée à l'identité",
      line1: "Façonnons",
      line2a: "une",
      line2b: "marque",
      line3: "inoubliable.",
      sloganLead: "De l'idée à l'identité.",
      subtitle: "Studio de branding, identité visuelle & web design basé à Bruxelles.",
      cta1: "Devis gratuit",
      cta2: "Nos services",
    },
    marquee: ["Branding", "Identité", "Web Design", "Stratégie", "IA"],
    services: {
      eyebrow: "Services",
      h1: "Une expertise",
      h2: "complète.",
      intro: "De la stratégie à la mise en ligne, chaque étape est pensée pour faire rayonner votre identité.",
      items: [
        { title: "Création de logo", desc: "Un symbole unique, intemporel, qui incarne l'âme de votre marque." },
        { title: "Identité visuelle", desc: "Charte complète : couleurs, typographies, supports." },
        { title: "Web design & dev", desc: "Sites modernes, performants, conçus pour convertir." },
        { title: "Stratégie de marque", desc: "Positionnement, message, ton de voix." },
        { title: "Social media", desc: "Création de contenu et gestion de vos réseaux." },
        { title: "Accompagnement IA", desc: "Intégrez l'IA dans vos processus créatifs et marketing." },
      ],
    },
    about: {
      eyebrow: "À propos",
      h1: "Un studio.", h2: "Une vision.", h3a: "Votre", h3b: "succès.",
      text: "Basés à Bruxelles, nous accompagnons des marques ambitieuses en France, Belgique, Suisse, Luxembourg et Canada. Notre obsession : créer des identités fortes qui durent.",
      stats: ["Projets livrés", "Pays couverts", "Satisfaction", "Services"],
    },
    process: {
      eyebrow: "Process",
      h1: "4 étapes pour", h2: "une marque", h3: "solide.",
      items: [
        { title: "Découverte", desc: "On apprend à connaître votre univers, vos objectifs et votre audience." },
        { title: "Stratégie", desc: "On définit le positionnement, le ton et la direction artistique." },
        { title: "Création", desc: "On donne vie à votre identité visuelle et à vos supports." },
        { title: "Lancement", desc: "On déploie, on optimise et on vous accompagne après la mise en ligne." },
      ],
    },
    sim: {
      eyebrow: "Simulateur",
      h1: "Estimez votre", h2: "projet.",
      intro: "Une estimation indicative en quelques clics. Le devis final dépend du périmètre exact.",
      step1: "1 · Sélectionnez vos services",
      step2: "2 · Délai souhaité",
      from: "à partir de",
      services: ["Création de logo", "Identité visuelle complète", "Site web (vitrine / one-page)", "Site e-commerce", "Stratégie de marque", "Social media (mois)", "Accompagnement IA"],
      urgency: ["Standard", "Accéléré (-20% délai)", "Urgent (-40% délai)"],
      resultLabel: "Estimation indicative",
      placeholder: "Sélectionnez un service",
      serviceWord: "service",
      delayPrefix: "Délai",
      perks: ["✦ Devis personnalisé sous 24h", "✦ Sans engagement", "✦ Paiement échelonné possible"],
      cta: "Recevoir mon devis →",
      mailSubject: "Demande de devis Brandio Studio",
      mailIntro: "Bonjour,\n\nJe souhaite un devis pour :",
      mailDelay: "Délai souhaité",
      mailEstimate: "Estimation indicative",
      mailEnd: "Merci !",
    },
    faq: {
      eyebrow: "FAQ",
      h1: "Questions", h2: "fréquentes.",
      items: [
        { q: "Quels services propose Brandio Studio ?", a: "Création de logo, identité visuelle complète, web design, stratégie de marque, social media management et accompagnement IA." },
        { q: "Travaillez-vous avec des clients en France ?", a: "Oui, nous accompagnons des clients en France, Belgique, Suisse, Luxembourg et à l'international." },
        { q: "Quels sont les délais d'un projet ?", a: "Logo : 1-2 semaines · Identité complète : 3-5 semaines · Site web : 4-8 semaines." },
        { q: "Quels sont vos tarifs ?", a: "Les tarifs varient selon le périmètre. Nous proposons un devis gratuit et personnalisé sous 24h." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      h1: "Prêt à donner vie", h2: "à votre", h3: "marque ?",
      sub: "Devis gratuit sous 24h.",
      cta: "Démarrer maintenant",
    },
    footer: {
      tagline: "Studio de branding & web design basé à Bruxelles.",
      navTitle: "Navigation",
      socialTitle: "Suivez-nous",
      navLinks: [["Services", "#services"], ["À propos", "#about"], ["Process", "#process"], ["FAQ", "#faq"]] as [string, string][],
      copyright: "© 2026 Brandio Studio · Bruxelles",
      made: "Made with ✦ in Brussels",
    },
  },
  en: {
    nav: { services: "Services", simulator: "Estimator", about: "About", process: "Process", faq: "FAQ", contact: "Contact", cta: "Start", openMenu: "Open menu", closeMenu: "Close menu" },
    hero: {
      badge1: "Available · 2 spots in April 2026",
      badge2: "✦ From idea to identity",
      line1: "Crafting",
      line2a: "an",
      line2b: "unforgettable",
      line3: "brand.",
      sloganLead: "From idea to identity.",
      subtitle: "Branding, visual identity & web design studio based in Brussels.",
      cta1: "Free quote",
      cta2: "Our services",
    },
    marquee: ["Branding", "Identity", "Web Design", "Strategy", "AI"],
    services: {
      eyebrow: "Services",
      h1: "A complete",
      h2: "expertise.",
      intro: "From strategy to launch, every step is designed to make your identity shine.",
      items: [
        { title: "Logo design", desc: "A unique, timeless symbol that captures the soul of your brand." },
        { title: "Visual identity", desc: "Full guidelines: colours, typography, assets." },
        { title: "Web design & dev", desc: "Modern, fast websites built to convert." },
        { title: "Brand strategy", desc: "Positioning, messaging, tone of voice." },
        { title: "Social media", desc: "Content creation and channel management." },
        { title: "AI consulting", desc: "Integrate AI into your creative and marketing workflows." },
      ],
    },
    about: {
      eyebrow: "About",
      h1: "One studio.", h2: "One vision.", h3a: "Your", h3b: "success.",
      text: "Based in Brussels, we partner with ambitious brands across France, Belgium, Switzerland, Luxembourg and Canada. Our obsession: building strong identities that last.",
      stats: ["Projects delivered", "Countries served", "Satisfaction", "Services"],
    },
    process: {
      eyebrow: "Process",
      h1: "4 steps to", h2: "a brand", h3: "that lasts.",
      items: [
        { title: "Discovery", desc: "We get to know your world, your goals and your audience." },
        { title: "Strategy", desc: "We define positioning, tone and creative direction." },
        { title: "Creation", desc: "We bring your visual identity and assets to life." },
        { title: "Launch", desc: "We deploy, optimise and support you after going live." },
      ],
    },
    sim: {
      eyebrow: "Estimator",
      h1: "Estimate your", h2: "project.",
      intro: "An indicative estimate in a few clicks. The final quote depends on the exact scope.",
      step1: "1 · Select your services",
      step2: "2 · Desired timeline",
      from: "from",
      services: ["Logo design", "Full visual identity", "Website (landing / one-page)", "E-commerce site", "Brand strategy", "Social media (per month)", "AI consulting"],
      urgency: ["Standard", "Accelerated (-20% time)", "Urgent (-40% time)"],
      resultLabel: "Indicative estimate",
      placeholder: "Select a service",
      serviceWord: "service",
      delayPrefix: "Timeline",
      perks: ["✦ Personalised quote within 24h", "✦ No commitment", "✦ Instalment payments available"],
      cta: "Get my quote →",
      mailSubject: "Brandio Studio quote request",
      mailIntro: "Hello,\n\nI'd like a quote for:",
      mailDelay: "Desired timeline",
      mailEstimate: "Indicative estimate",
      mailEnd: "Thanks!",
    },
    faq: {
      eyebrow: "FAQ",
      h1: "Frequently asked", h2: "questions.",
      items: [
        { q: "What services does Brandio Studio offer?", a: "Logo design, full visual identity, web design, brand strategy, social media management and AI consulting." },
        { q: "Do you work with clients in France?", a: "Yes, we work with clients in France, Belgium, Switzerland, Luxembourg and internationally." },
        { q: "What are your project timelines?", a: "Logo: 1-2 weeks · Full identity: 3-5 weeks · Website: 4-8 weeks." },
        { q: "What are your rates?", a: "Rates vary depending on scope. We offer a free, personalised quote within 24h." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      h1: "Ready to bring", h2: "your brand", h3: "to life?",
      sub: "Free quote within 24h.",
      cta: "Start now",
    },
    footer: {
      tagline: "Branding & web design studio based in Brussels.",
      navTitle: "Navigation",
      socialTitle: "Follow us",
      navLinks: [["Services", "#services"], ["About", "#about"], ["Process", "#process"], ["FAQ", "#faq"]] as [string, string][],
      copyright: "© 2026 Brandio Studio · Brussels",
      made: "Made with ✦ in Brussels",
    },
  },
  nl: {
    nav: { services: "Diensten", simulator: "Simulator", about: "Over ons", process: "Aanpak", faq: "FAQ", contact: "Contact", cta: "Starten", openMenu: "Menu openen", closeMenu: "Menu sluiten" },
    hero: {
      badge1: "Beschikbaar · 2 plekken in april 2026",
      badge2: "✦ Van idee tot identiteit",
      line1: "Wij bouwen",
      line2a: "een",
      line2b: "merk",
      line3: "om nooit te vergeten.",
      sloganLead: "Van idee tot identiteit.",
      subtitle: "Branding-, visuele identiteit- en webdesignstudio gevestigd in Brussel.",
      cta1: "Gratis offerte",
      cta2: "Onze diensten",
    },
    marquee: ["Branding", "Identiteit", "Webdesign", "Strategie", "AI"],
    services: {
      eyebrow: "Diensten",
      h1: "Een complete",
      h2: "expertise.",
      intro: "Van strategie tot lancering, elke stap zorgt dat jouw identiteit straalt.",
      items: [
        { title: "Logo-ontwerp", desc: "Een uniek, tijdloos symbool dat de ziel van je merk vastlegt." },
        { title: "Visuele identiteit", desc: "Volledige huisstijl: kleuren, typografie, dragers." },
        { title: "Webdesign & dev", desc: "Moderne, snelle sites die converteren." },
        { title: "Merkstrategie", desc: "Positionering, boodschap en tone of voice." },
        { title: "Social media", desc: "Contentcreatie en beheer van je kanalen." },
        { title: "AI-begeleiding", desc: "Integreer AI in je creatieve en marketingprocessen." },
      ],
    },
    about: {
      eyebrow: "Over ons",
      h1: "Eén studio.", h2: "Eén visie.", h3a: "Jouw", h3b: "succes.",
      text: "Gevestigd in Brussel begeleiden we ambitieuze merken in Frankrijk, België, Zwitserland, Luxemburg en Canada. Onze obsessie: sterke identiteiten bouwen die blijven.",
      stats: ["Projecten geleverd", "Landen bereikt", "Tevredenheid", "Diensten"],
    },
    process: {
      eyebrow: "Aanpak",
      h1: "4 stappen naar", h2: "een sterk", h3: "merk.",
      items: [
        { title: "Ontdekking", desc: "We leren je wereld, doelen en publiek kennen." },
        { title: "Strategie", desc: "We bepalen positionering, toon en artistieke richting." },
        { title: "Creatie", desc: "We brengen je visuele identiteit tot leven." },
        { title: "Lancering", desc: "We zetten live, optimaliseren en begeleiden je daarna." },
      ],
    },
    sim: {
      eyebrow: "Simulator",
      h1: "Schat jouw", h2: "project.",
      intro: "Een indicatieve schatting in enkele kliks. De definitieve offerte hangt af van de exacte scope.",
      step1: "1 · Kies je diensten",
      step2: "2 · Gewenste timing",
      from: "vanaf",
      services: ["Logo-ontwerp", "Volledige visuele identiteit", "Website (one-page)", "E-commerce site", "Merkstrategie", "Social media (per maand)", "AI-begeleiding"],
      urgency: ["Standaard", "Versneld (-20% tijd)", "Urgent (-40% tijd)"],
      resultLabel: "Indicatieve schatting",
      placeholder: "Kies een dienst",
      serviceWord: "dienst",
      delayPrefix: "Timing",
      perks: ["✦ Persoonlijke offerte binnen 24u", "✦ Geen verplichtingen", "✦ Gespreide betaling mogelijk"],
      cta: "Mijn offerte ontvangen →",
      mailSubject: "Offerteaanvraag Brandio Studio",
      mailIntro: "Hallo,\n\nIk wens een offerte voor:",
      mailDelay: "Gewenste timing",
      mailEstimate: "Indicatieve schatting",
      mailEnd: "Bedankt!",
    },
    faq: {
      eyebrow: "FAQ",
      h1: "Veelgestelde", h2: "vragen.",
      items: [
        { q: "Welke diensten biedt Brandio Studio aan?", a: "Logo-ontwerp, volledige visuele identiteit, webdesign, merkstrategie, social media management en AI-begeleiding." },
        { q: "Werken jullie met klanten in Frankrijk?", a: "Ja, we werken met klanten in Frankrijk, België, Zwitserland, Luxemburg en internationaal." },
        { q: "Wat zijn de doorlooptijden van een project?", a: "Logo: 1-2 weken · Volledige identiteit: 3-5 weken · Website: 4-8 weken." },
        { q: "Wat zijn jullie tarieven?", a: "Tarieven hangen af van de scope. We bieden een gratis, persoonlijke offerte binnen 24u." },
      ],
    },
    contact: {
      eyebrow: "Contact",
      h1: "Klaar om je", h2: "merk leven", h3: "in te blazen?",
      sub: "Gratis offerte binnen 24u.",
      cta: "Nu starten",
    },
    footer: {
      tagline: "Branding- & webdesignstudio gevestigd in Brussel.",
      navTitle: "Navigatie",
      socialTitle: "Volg ons",
      navLinks: [["Diensten", "#services"], ["Over ons", "#about"], ["Aanpak", "#process"], ["FAQ", "#faq"]] as [string, string][],
      copyright: "© 2026 Brandio Studio · Brussel",
      made: "Made with ✦ in Brussels",
    },
  },
} as const;

const SERVICE_META = [
  { num: "01", icon: "✦", color: "#ff4d1f" },
  { num: "02", icon: "◐", color: "#ffb347" },
  { num: "03", icon: "◢", color: "#0a0a0a" },
  { num: "04", icon: "⬡", color: "#ff4d1f" },
  { num: "05", icon: "♺", color: "#0a0a0a" },
  { num: "06", icon: "✺", color: "#ffb347" },
];
const PROCESS_NUMS = ["01", "02", "03", "04"];
const STATS_NUMS = ["120+", "5", "98%", "6"];

// Lando-style split text reveal
function RevealText({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) {
  const words = children.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.3em] -mb-[0.3em] pr-[0.1em] -mr-[0.1em]">
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

const SIM_PRICES = [
  { min: 600, max: 1500 },
  { min: 1500, max: 4000 },
  { min: 2000, max: 5000 },
  { min: 4000, max: 12000 },
  { min: 1200, max: 3500 },
  { min: 800, max: 2500 },
  { min: 1000, max: 4000 },
];
const URGENCY_MULT = [1, 1.25, 1.5];

function Simulator({ lang }: { lang: Lang }) {
  const t = dict[lang].sim;
  const [selected, setSelected] = useState<number[]>([0, 1]);
  const [urgency, setUrgency] = useState(0);
  const toggle = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  const mult = URGENCY_MULT[urgency];
  const min = Math.round(selected.reduce((a, i) => a + SIM_PRICES[i].min, 0) * mult);
  const max = Math.round(selected.reduce((a, i) => a + SIM_PRICES[i].max, 0) * mult);
  const locale = lang === "fr" ? "fr-BE" : lang === "nl" ? "nl-BE" : "en-GB";
  const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);

  const subject = encodeURIComponent(t.mailSubject);
  const body = encodeURIComponent(
    `${t.mailIntro}\n${selected.map((i) => `• ${t.services[i]}`).join("\n")}\n\n${t.mailDelay} : ${t.urgency[urgency]}\n${t.mailEstimate} : ${fmt(min)}€ - ${fmt(max)}€\n\n${t.mailEnd}`,
  );

  return (
    <section id="simulator" className="py-20 md:py-32 bg-fg text-bg relative overflow-hidden">
      <div className="absolute inset-0 dotted-bg opacity-15" />
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 relative">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
            <span className="w-8 h-px bg-accent" /> {t.eyebrow}
          </div>
          <h2 className="font-display text-[clamp(40px,6vw,88px)] font-medium leading-[1.05]">
            <RevealText>{t.h1}</RevealText> <em className="italic text-accent inline-block"><RevealText delay={0.15}>{t.h2}</RevealText></em>
          </h2>
          <p className="text-bg/70 text-lg mt-6">{t.intro}</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-start">
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-5 font-bold">{t.step1}</h3>
            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {t.services.map((label, i) => {
                const on = selected.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className={`interactive text-left p-5 rounded-2xl border-2 transition-all ${
                      on ? "bg-accent border-accent text-white" : "border-bg/30 hover:border-accent"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="font-medium">{label}</span>
                      <span className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center text-xs ${on ? "bg-white text-accent border-white" : "border-bg/40"}`}>
                        {on ? "✓" : ""}
                      </span>
                    </div>
                    <div className={`text-xs mt-2 ${on ? "text-white/80" : "text-bg/50"}`}>
                      {t.from} {fmt(SIM_PRICES[i].min)}€
                    </div>
                  </button>
                );
              })}
            </div>

            <h3 className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-5 font-bold">{t.step2}</h3>
            <div className="flex flex-wrap gap-3">
              {t.urgency.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setUrgency(i)}
                  className={`interactive px-5 py-3 rounded-full border-2 text-sm font-medium transition-all ${
                    urgency === i ? "bg-accent border-accent text-white" : "border-bg/30 hover:border-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="lg:sticky lg:top-28 p-8 rounded-3xl border-2 border-bg/30 bg-bg/[0.04] backdrop-blur-sm"
          >
            <div className="text-xs uppercase tracking-[0.15em] text-bg/50 mb-3 font-bold">{t.resultLabel}</div>
            <div className="font-display font-medium leading-none mb-2">
              {selected.length === 0 ? (
                <div className="text-3xl text-bg/40">{t.placeholder}</div>
              ) : (
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-4xl sm:text-5xl gradient-text">{fmt(min)}€</span>
                  <span className="text-bg/40 text-2xl">—</span>
                  <span className="text-4xl sm:text-5xl gradient-text">{fmt(max)}€</span>
                </div>
              )}
            </div>
            <div className="text-bg/50 text-sm mt-4">
              {selected.length} {t.serviceWord}{selected.length > 1 ? "s" : ""} · {t.delayPrefix} {t.urgency[urgency].toLowerCase()}
            </div>
            <div className="mt-6 pt-6 border-t border-bg/20 text-bg/60 text-sm">
              {t.perks.map((p, i) => (<div key={i}>{p}</div>))}
            </div>
            <a
              href={`mailto:contact@brandio-studio.com?subject=${subject}&body=${body}`}
              className="mt-6 w-full inline-flex justify-center items-center gap-3 px-6 py-4 bg-accent hover:bg-[#ff6a3d] text-white rounded-full font-medium transition-colors"
            >
              {t.cta}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("fr");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const { scrollYProgress: pageProgress } = useScroll();
  const progressX = useSpring(pageProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (stored && ["fr", "en", "nl"].includes(stored)) setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
    if (typeof window !== "undefined") localStorage.setItem("lang", lang);
  }, [lang]);

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

  const T = dict[lang];

  const LangSwitcher = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-1 text-xs font-bold ${className}`}>
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          aria-label={l.label}
          className={`interactive px-2.5 py-1.5 rounded-full transition-colors ${
            lang === l.code ? "bg-fg text-bg" : "text-fg/60 hover:text-fg"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );

  return (
    <main className="bg-bg text-fg">
      <Cursor />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[9997] origin-left"
        style={{ scaleX: progressX }}
      />

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
            <a href="#services" className="hover:text-accent transition-colors">{T.nav.services}</a>
            <a href="#simulator" className="hover:text-accent transition-colors">{T.nav.simulator}</a>
            <a href="#about" className="hover:text-accent transition-colors">{T.nav.about}</a>
            <a href="#process" className="hover:text-accent transition-colors">{T.nav.process}</a>
            <a href="#faq" className="hover:text-accent transition-colors">{T.nav.faq}</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <LangSwitcher />
            <a href="#contact" className="inline-flex px-6 py-3 bg-fg text-bg rounded-full text-sm font-medium hover:bg-accent transition-all items-center gap-2">
              {T.nav.cta} <span>→</span>
            </a>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <LangSwitcher />
            <button
              type="button"
              aria-label={navOpen ? T.nav.closeMenu : T.nav.openMenu}
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
              className="interactive w-11 h-11 flex flex-col items-center justify-center gap-1.5 border-2 border-fg rounded-full"
            >
              <span className={`block w-5 h-0.5 bg-fg transition-transform ${navOpen ? "translate-y-1 rotate-45" : ""}`} />
              <span className={`block w-5 h-0.5 bg-fg transition-transform ${navOpen ? "-translate-y-1 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ height: navOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden border-t border-border"
        >
          <div className="px-5 py-6 flex flex-col gap-4 text-lg font-medium">
            {[
              [T.nav.services, "#services"],
              [T.nav.simulator, "#simulator"],
              [T.nav.about, "#about"],
              [T.nav.process, "#process"],
              [T.nav.faq, "#faq"],
              [T.nav.contact, "#contact"],
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
              {T.hero.badge1}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="px-4 py-2 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-wider"
            >
              {T.hero.badge2}
            </motion.div>
          </div>

          <h1 className="font-display text-[clamp(56px,9vw,160px)] mb-10 font-medium leading-[0.95]">
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {T.hero.line1}
              </motion.div>
            </div>
            <div className="overflow-hidden pb-[0.15em] -mb-[0.15em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex items-center gap-[0.25em] flex-wrap"
              >
                <span className="outline-text">{T.hero.line2a}</span>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-[0.8em] h-[0.8em] rounded-full flex-shrink-0"
                  style={{ background: "conic-gradient(from 0deg, #ff4d1f, #ffb347, #ff4d1f)" }}
                />
                <span>{T.hero.line2b}</span>
              </motion.div>
            </div>
            <div className="overflow-hidden pb-[0.2em] -mb-[0.2em]">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                className="italic gradient-text font-black"
              >
                {T.hero.line3}
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
              <span className="italic gradient-text font-semibold">{T.hero.sloganLead}</span><br />{T.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-3 flex-wrap"
            >
              <Magnetic>
                <a href="#contact" className="px-6 sm:px-8 py-4 sm:py-5 bg-fg text-bg rounded-full text-base font-medium hover:bg-accent transition-colors flex items-center gap-3 shadow-[6px_6px_0_0_var(--color-accent)]">
                  {T.hero.cta1} <span>→</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#services" className="px-6 sm:px-8 py-4 sm:py-5 border-2 border-fg rounded-full text-base font-medium hover:bg-fg hover:text-bg transition-colors inline-block">
                  {T.hero.cta2}
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
              {T.marquee.map((w, i) => (
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
                <span className="w-8 h-px bg-accent" /> {T.services.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
                <RevealText>{T.services.h1}</RevealText><br />
                <em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.1}>{T.services.h2}</RevealText></em>
              </h2>
            </div>
            <p className="text-fg/70 text-xl max-w-md">{T.services.intro}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {T.services.items.map((s, i) => {
              const meta = SERVICE_META[i];
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.06, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                  onMouseMove={handleCardMove}
                  className="service-card interactive p-8 bg-bg-2 border-2 border-fg rounded-3xl min-h-[280px] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:translate-x-1 shadow-[6px_6px_0_0_var(--color-fg)] hover:shadow-[2px_2px_0_0_var(--color-fg)]"
                >
                  <div className="flex justify-between items-center font-display text-sm relative z-10">
                    <span className="font-bold" style={{ color: meta.color }}>{meta.num}</span>
                    <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-white" style={{ background: meta.color }}>{meta.icon}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-display text-3xl mb-3 font-medium">{s.title}</h3>
                    <p className="text-fg/70 text-base">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
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
                <span className="w-8 h-px bg-accent" /> {T.about.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
                <RevealText>{T.about.h1}</RevealText><br />
                <span className="outline-text" style={{ WebkitTextStroke: "1.5px #f6f4ef" }}><RevealText delay={0.1}>{T.about.h2}</RevealText></span><br />
                <RevealText delay={0.2}>{`${T.about.h3a} `}</RevealText><em className="italic text-accent inline-block"><RevealText delay={0.3}>{T.about.h3b}</RevealText></em>
              </h2>
              <p className="text-bg/70 text-lg mt-8 max-w-lg">{T.about.text}</p>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 gap-5">
              {T.about.stats.map((label, i) => (
                <div key={label} className="p-7 border-2 border-bg/30 rounded-2xl bg-bg/[0.04]">
                  <div className="font-display text-5xl md:text-6xl gradient-text leading-none font-medium"><Counter value={STATS_NUMS[i]} /></div>
                  <div className="text-bg/60 text-sm mt-2">{label}</div>
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
              <span className="w-8 h-px bg-accent" /> {T.process.eyebrow}
            </div>
            <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
              <RevealText>{T.process.h1}</RevealText><br />
              <RevealText delay={0.1}>{`${T.process.h2} `}</RevealText><em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.25}>{T.process.h3}</RevealText></em>
            </h2>
          </motion.div>
          <div>
            {T.process.items.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                whileHover={{ paddingLeft: 24, backgroundColor: "rgba(255,77,31,0.04)" }}
                className="interactive py-12 border-t border-border last:border-b grid md:grid-cols-[100px_1fr_auto] gap-8 items-center"
              >
                <div className="font-display text-3xl text-accent font-medium">{PROCESS_NUMS[i]}</div>
                <h3 className="font-display text-4xl md:text-5xl font-medium">{p.title}</h3>
                <p className="text-fg/60 max-w-md md:text-right">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Simulator lang={lang} />

      {/* FAQ */}
      <section id="faq" className="py-20 md:py-32">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-2xl mb-20">
            <div className="inline-flex items-center gap-3 text-accent text-xs uppercase tracking-[0.2em] mb-6 font-bold">
              <span className="w-8 h-px bg-accent" /> {T.faq.eyebrow}
            </div>
            <h2 className="font-display text-[clamp(48px,7vw,96px)] font-medium">
              <RevealText>{`${T.faq.h1} `}</RevealText><em className="italic gradient-text inline-block pr-[0.15em]"><RevealText delay={0.15}>{T.faq.h2}</RevealText></em>
            </h2>
          </motion.div>
          <div className="max-w-3xl">
            {T.faq.items.map((f, i) => (
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
            <span className="w-8 h-px bg-accent" /> {T.contact.eyebrow}
          </div>
          <h2 className="font-display text-[clamp(36px,6vw,88px)] max-w-5xl mx-auto mb-8 font-medium leading-[1.15] pb-12 px-2 sm:px-8">
            <RevealText>{T.contact.h1}</RevealText><br /><RevealText delay={0.1}>{`${T.contact.h2} `}</RevealText><em className="italic gradient-text inline-block pr-[0.5em]"><RevealText delay={0.25}>{T.contact.h3}</RevealText></em>
          </h2>
          <p className="text-fg/70 text-xl mb-12">{T.contact.sub}</p>
          <a href="mailto:contact@brandio-studio.com" className="font-display text-[clamp(28px,5vw,64px)] underline decoration-accent decoration-4 underline-offset-8 italic block my-10 hover:gradient-text transition-all">
            contact@brandio-studio.com
          </a>
          <Magnetic>
            <a href="mailto:contact@brandio-studio.com" className="inline-flex items-center gap-3 px-10 py-6 bg-fg text-bg rounded-full text-lg font-medium hover:bg-accent transition-colors shadow-[8px_8px_0_0_var(--color-accent)]">
              {T.contact.cta} <span>→</span>
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
            <p className="text-fg/60 max-w-xs"><em className="italic">{T.hero.sloganLead}</em> {T.footer.tagline}</p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-fg/50 mb-5 font-bold">{T.footer.navTitle}</h4>
            {T.footer.navLinks.map(([l, h]) => (
              <a key={h} href={h} className="block py-1.5 hover:text-accent transition-colors font-medium">{l}</a>
            ))}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] text-fg/50 mb-5 font-bold">{T.footer.socialTitle}</h4>
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
          <span>{T.footer.copyright}</span>
          <span>{T.footer.made}</span>
        </div>
      </footer>
    </main>
  );
}
