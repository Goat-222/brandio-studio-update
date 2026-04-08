import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

const SITE_URL = "https://brandio-studio.com";
const SITE_NAME = "Brandio Studio";
const DEFAULT_TITLE = "Brandio Studio — De l'idée à l'identité · Branding & Web Design Bruxelles";
const DEFAULT_DESC =
  "Brandio Studio est une agence de branding, création de logo, identité visuelle et web design basée à Bruxelles. Nous façonnons des marques inoubliables pour startups et entreprises en France, Belgique, Suisse, Luxembourg et Canada.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Brandio Studio",
  },
  description: DEFAULT_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "Brandio Studio",
    "Brandio",
    "agence de branding Bruxelles",
    "agence branding Belgique",
    "création de logo Bruxelles",
    "identité visuelle",
    "web design Bruxelles",
    "agence web design Belgique",
    "stratégie de marque",
    "studio créatif Bruxelles",
    "design de marque",
    "graphiste Bruxelles",
    "création site internet Bruxelles",
    "social media management",
    "accompagnement IA",
    "agence digitale Belgique",
    "branding France",
    "branding Suisse",
    "branding Luxembourg",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr-BE": SITE_URL,
      "fr-FR": SITE_URL,
      "fr": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_BE",
    alternateLocale: ["fr_FR", "fr_CH", "fr_LU", "fr_CA"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description:
      "Studio de branding, identité visuelle & web design basé à Bruxelles. Nous façonnons des marques inoubliables.",
    images: [
      { url: "/brandio-logo.png", width: 1080, height: 1080, alt: "Brandio Studio — Agence de branding à Bruxelles" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandio Studio — Branding & Web Design à Bruxelles",
    description: "Studio de branding, identité visuelle & web design — Bruxelles.",
    images: ["/brandio-logo.png"],
    creator: "@brandiostudio",
    site: "@brandiostudio",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/brandio-logo.png", type: "image/png" },
    ],
    apple: "/brandio-logo.png",
    shortcut: "/brandio-logo.png",
  },
  category: "Design Agency",
  formatDetection: { telephone: false, email: false, address: false },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: "#f6f4ef",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const sameAs = [
  "https://www.instagram.com/brandio.studio/",
  "https://www.linkedin.com/in/ermal-ibraj-97379b337/",
  "https://www.facebook.com/profile.php?id=61574321065084",
];

const services = [
  { name: "Création de logo", description: "Conception de logo professionnel et mémorable adapté à votre marque." },
  { name: "Identité visuelle", description: "Système d'identité complet : logo, couleurs, typographie, charte graphique." },
  { name: "Web design & développement", description: "Sites vitrines et e-commerce performants, rapides, optimisés SEO." },
  { name: "Stratégie de marque", description: "Positionnement, plateforme de marque et stratégie créative." },
  { name: "Social media management", description: "Gestion et création de contenu pour vos réseaux sociaux." },
  { name: "Accompagnement IA", description: "Intégration d'outils IA pour booster votre productivité créative." },
];

const faqList = [
  { q: "Quels services propose Brandio Studio ?", a: "Création de logo, identité visuelle complète, web design, stratégie de marque, social media management et accompagnement IA." },
  { q: "Travaillez-vous avec des clients en France ?", a: "Oui, nous accompagnons des clients en France, Belgique, Suisse, Luxembourg et à l'international." },
  { q: "Quels sont les délais d'un projet ?", a: "Logo : 1-2 semaines · Identité complète : 3-5 semaines · Site web : 4-8 semaines." },
  { q: "Quels sont vos tarifs ?", a: "Les tarifs varient selon le périmètre. Nous proposons un devis gratuit et personnalisé sous 24h." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
      "@id": `${SITE_URL}/#organization`,
      name: "Brandio Studio",
      alternateName: ["Brandio", "Brandio.Studio"],
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/brandio-logo.png`,
        width: 1080,
        height: 1080,
      },
      image: `${SITE_URL}/brandio-logo.png`,
      description:
        "Agence de branding, création de logo, identité visuelle et web design pour startups et entreprises, basée à Bruxelles.",
      email: "contact@brandio-studio.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bruxelles",
        addressRegion: "Bruxelles-Capitale",
        addressCountry: "BE",
      },
      areaServed: [
        { "@type": "Country", name: "Belgique" },
        { "@type": "Country", name: "France" },
        { "@type": "Country", name: "Suisse" },
        { "@type": "Country", name: "Luxembourg" },
        { "@type": "Country", name: "Canada" },
      ],
      priceRange: "€€",
      foundingDate: "2024",
      founder: { "@type": "Person", name: "Ermal Ibraj" },
      knowsAbout: [
        "Branding",
        "Logo design",
        "Identité visuelle",
        "Web design",
        "Stratégie de marque",
        "UI/UX design",
      ],
      slogan: "De l'idée à l'identité.",
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      sameAs,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services Brandio Studio",
        itemListElement: services.map((s, i) => ({
          "@type": "Offer",
          position: i + 1,
          itemOffered: {
            "@type": "Service",
            name: s.name,
            description: s.description,
            provider: { "@id": `${SITE_URL}/#organization` },
          },
        })),
      },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "contact@brandio-studio.com",
        availableLanguage: ["French", "English"],
        areaServed: ["BE", "FR", "CH", "LU", "CA"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Brandio Studio",
      description: DEFAULT_DESC,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "fr-BE",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: DEFAULT_TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      description: DEFAULT_DESC,
      inLanguage: "fr-BE",
      breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqList.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable} antialiased`} suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
