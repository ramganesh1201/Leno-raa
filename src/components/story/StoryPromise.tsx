import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";

export function StoryPromise() {
  return (
    <section className="relative py-32 md:py-48 bg-gradient-to-b from-[color:var(--background)] to-[color:var(--ivory)] overflow-hidden">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12 relative z-10">
        <Reveal preset="label" className="ornament-rule text-eyebrow mb-12">
          Our Promise
        </Reveal>
        
        <SplitText
          as="h2"
          text='"We never rush what touches your skin."'
          className="text-display text-4xl md:text-5xl leading-tight text-[color:var(--foreground)] font-serif"
        />
        
        <Reveal
          as="p"
          preset="paragraph"
          delay={0.2}
          className="mt-10 text-sm md:text-base uppercase tracking-[0.2em] md:tracking-[0.28em] text-[color:var(--muted-foreground)]"
        >
          — The Lenoraa Philosophy
        </Reveal>
      </div>

      {/* Subtle abstract background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[color:var(--gold)]/5 rounded-full blur-[100px] pointer-events-none" />
    </section>
  );
}
