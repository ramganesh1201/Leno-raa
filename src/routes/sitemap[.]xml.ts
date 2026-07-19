import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || "https://leno-raa-zeta.vercel.app";

interface SitemapEntry {
  path: string;
  changefreq?: "weekly" | "monthly" | "daily";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/story", changefreq: "monthly", priority: "0.7" },
          { path: "/about", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
          { path: "/privacy", changefreq: "monthly", priority: "0.3" },
          { path: "/terms", changefreq: "monthly", priority: "0.3" },
          { path: "/shipping", changefreq: "monthly", priority: "0.3" },
          { path: "/refunds", changefreq: "monthly", priority: "0.3" },
          { path: "/collections/radiance", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/calm", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/nourish", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/relax", changefreq: "weekly", priority: "0.9" },
          { path: "/collections/herbal", changefreq: "weekly", priority: "0.9" },
          { path: "/products/orange", changefreq: "monthly", priority: "0.6" },
          { path: "/products/tomato", changefreq: "monthly", priority: "0.6" },
          { path: "/products/manjistha", changefreq: "monthly", priority: "0.6" },
          { path: "/products/aloe-vera", changefreq: "monthly", priority: "0.6" },
          { path: "/products/sandalwood", changefreq: "monthly", priority: "0.6" },
          { path: "/products/menthol", changefreq: "monthly", priority: "0.6" },
          { path: "/products/goat-milk", changefreq: "monthly", priority: "0.6" },
          { path: "/products/liquorice", changefreq: "monthly", priority: "0.6" },
          { path: "/products/lavender", changefreq: "monthly", priority: "0.6" },
          { path: "/products/ayurvedic-herbal", changefreq: "monthly", priority: "0.6" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
