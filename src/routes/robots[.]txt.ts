import { createFileRoute } from "@tanstack/react-router";
import { businessConfig } from "@/config/business";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const txt = `User-agent: *\nAllow: /\n\nSitemap: ${businessConfig.websiteUrl}/sitemap.xml\n`;

        return new Response(txt, {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
