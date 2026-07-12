import { SplitText } from "../immersive/SplitText";
import { Reveal } from "../immersive/Reveal";

interface ProductStoryProps {
  productName: string;
  theme: string;
}

export function ProductStory({ productName, theme }: ProductStoryProps) {
  return (
    <section className="relative my-32 py-24 overflow-hidden rounded-[32px] bg-[color:var(--foreground)] px-6 md:px-12 text-[color:var(--background)]">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none">
        {/* Subtle texture/noise background could go here */}
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent blur-3xl" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <Reveal preset="label" className="text-eyebrow text-white/50 mb-8">
          The Craftsmanship
        </Reveal>
        
        <SplitText
          as="h2"
          text={`The ${productName} Ritual`}
          className="text-display text-4xl md:text-5xl"
        />
        
        <Reveal as="p" preset="paragraph" delay={0.2} className="mt-8 text-lg leading-relaxed text-white/80">
          Rooted in ancient traditions and perfected through modern cold-process techniques, 
          each bar is cured for six weeks to preserve its natural glycerin and botanical integrity.
        </Reveal>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-white/10 pt-16">
          <Reveal delay={0.3} className="text-left">
            <h3 className="font-serif text-xl mb-3 text-[color:var(--gold)]">Origin</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Sourced from the finest growers, capturing the essence of the {theme} environment at its peak.
            </p>
          </Reveal>
          <Reveal delay={0.4} className="text-left">
            <h3 className="font-serif text-xl mb-3 text-[color:var(--gold)]">Method</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Hand-poured and cut in small batches. The slow curing process ensures a harder, longer-lasting bar.
            </p>
          </Reveal>
          <Reveal delay={0.5} className="text-left">
            <h3 className="font-serif text-xl mb-3 text-[color:var(--gold)]">Experience</h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Transforms the daily shower into a meditative sanctuary, leaving skin velvet-soft and nourished.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
