import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTheme } from "@/lib/store";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryContent } from "@/components/story/StoryContent";
import { StoryProcess } from "@/components/story/StoryProcess";
import { StoryDifferentiators } from "@/components/story/StoryDifferentiators";
import { StoryPromise } from "@/components/story/StoryPromise";
import { StoryExplore } from "@/components/story/StoryExplore";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "The Atelier — Lenoraa" },
      {
        name: "description",
        content:
          "Doctor-formulated. Handcrafted. Cold-processed. The philosophy behind every Lenoraa bar.",
      },
      { property: "og:title", content: "The Atelier — Lenoraa" },
      { property: "og:description", content: "Nature crafted into luxury." },
    ],
  }),
  component: Story,
});

function Story() {
  const setTheme = useTheme((s) => s.setTheme);

  useEffect(() => {
    setTheme("default");
  }, [setTheme]);

  return (
    <div className="relative bg-[color:var(--background)]">
      <StoryHero />
      <StoryContent />
      <StoryProcess />
      <StoryDifferentiators />
      <StoryPromise />
      <StoryExplore />
    </div>
  );
}
