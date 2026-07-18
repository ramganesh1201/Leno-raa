import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/immersive/Reveal";
import { Magnetic } from "@/components/immersive/Magnetic";

export function StoryExplore() {
  return (
    <section className="relative py-24 md:py-32 bg-[color:var(--ivory)] border-t border-[color:var(--border)]/50">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-6">
          Continue Your Journey
        </Reveal>
        
        <Reveal as="h2" preset="heading" className="text-display text-3xl md:text-4xl mb-12">
          Explore Lenoraa
        </Reveal>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 w-full max-w-3xl mx-auto">
          <Magnetic className="w-full md:w-auto">
            <Link
              to="/collections/$slug"
              params={{ slug: "radiance" }}
              className="btn-lux w-full justify-center"
            >
              Explore Collection
            </Link>
          </Magnetic>
          
          <Magnetic className="w-full md:w-auto">
            <Link
              to="/customize"
              className="btn-ghost-lux w-full justify-center"
            >
              Customize Your Soap
            </Link>
          </Magnetic>
          
          <Magnetic className="w-full md:w-auto">
            <Link
              to="/catalog"
              className="btn-ghost-lux w-full justify-center"
            >
              Shop Now
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
