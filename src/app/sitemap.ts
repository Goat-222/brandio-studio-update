import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://brandio-studio.com";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/#services`, lastModified: now, priority: 0.9 },
    { url: `${base}/#about`, lastModified: now, priority: 0.8 },
    { url: `${base}/#process`, lastModified: now, priority: 0.7 },
    { url: `${base}/#faq`, lastModified: now, priority: 0.7 },
    { url: `${base}/#contact`, lastModified: now, priority: 0.9 },
  ];
}
