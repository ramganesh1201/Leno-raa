import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { collections, type Collection } from "@/lib/catalog";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import { useTheme } from "@/lib/store";

export function LuxuryEditorialCollections() {
  const setTheme = useTheme((s) => s.setTheme);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCardHover = (index: number | null, collection?: Collection) => {
    setHoveredIndex(index);
    if (index !== null && collection) {
      setTheme(collection.slug, collection.ambience);
    } else {
      setTheme("radiance", "goldDust"); // Revert to default
    }
  };

  return (
    <section className="relative pt-6 md:pt-10 pb-16 md:pb-24 bg-transparent transition-colors duration-1000">
      <div className="mx-auto w-full px-6 md:px-12 max-w-[1400px]">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-1">
            <Reveal
              preset="label"
              className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted-foreground)] mb-4 font-semibold"
            >
              Our Collections
            </Reveal>
            <SplitText
              as="h2"
              text="Find Your Perfect Soap"
              delay={0.1}
              className="text-display text-4xl md:text-5xl text-[color:var(--foreground)] tracking-tight"
            />
            <Reveal
              as="p"
              preset="paragraph"
              delay={0.2}
              className="mt-4 max-w-lg text-[color:var(--muted-foreground)] leading-relaxed"
            >
              Every soap tells a different story. Discover the perfect ritual for your skin through
              our curated chapters.
            </Reveal>
          </div>
        </div>

        {/* Bento Grid Editorial Layout */}
        <div
          onMouseLeave={() => handleCardHover(null)}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-6"
        >
          {collections.map((collection, index) => {
            const isFeatured = index === 0;
            const isHovered = hoveredIndex === index;
            const isOthersHovered = hoveredIndex !== null && hoveredIndex !== index;

            const opacityClass = isOthersHovered
              ? "opacity-60 saturate-50"
              : "opacity-100 saturate-100";

            // Positioning configuration
            const config = {
              radiance: {
                imagePosition: "object-[center_25%]",
                overlayOpacity: isFeatured ? "0.85" : "0.7",
              },
              calm: {
                imagePosition: "object-[center_10%]",
                overlayOpacity: isFeatured ? "0.90" : "0.7",
              },
              nourish: {
                imagePosition: "object-[80%_20%]",
                overlayOpacity: isFeatured ? "0.85" : "0.7",
              },
              relax: {
                imagePosition: "object-center",
                overlayOpacity: isFeatured ? "0.60" : "0.5",
              },
              herbal: {
                imagePosition: "object-center",
                overlayOpacity: isFeatured ? "0.60" : "0.5",
              },
            }[collection.slug as string] || {
              imagePosition: "object-center",
              overlayOpacity: "0.75",
            };

            return (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => handleCardHover(index, collection)}
                className={`group relative rounded-2xl md:rounded-[24px] overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1] shadow-sm hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5 ${opacityClass} ${
                  isFeatured
                    ? "col-span-2 sm:col-span-2 lg:col-span-6 lg:row-span-2 h-[350px] min-[375px]:h-[370px] md:h-[500px] lg:h-[520px]"
                    : "col-span-1 sm:col-span-1 lg:col-span-3 lg:row-span-1 h-[250px] min-[375px]:h-[275px] lg:h-[248px]"
                }`}
              >
                <Link
                  to="/collections/$slug"
                  params={{ slug: collection.slug }}
                  className="block w-full h-full relative focus:outline-none"
                  draggable={false}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full bg-[color:var(--card)] overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      draggable={false}
                      className={`w-full h-full ${config.imagePosition} object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105`}
                    />
                  </div>

                  {/* Localized Cinematic Overlay */}
                  <div
                    className="absolute bottom-0 left-0 w-full h-full pointer-events-none transition-opacity duration-500 opacity-80 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(110% 80% at 0% 100%, rgba(17,17,17,${config.overlayOpacity}) 0%, rgba(17,17,17,0) 100%)`,
                    }}
                  />

                  {/* Readability Layer Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none transition-opacity duration-700 opacity-90 group-hover:opacity-100" />

                  {/* Content Wrapper */}
                  <div
                    className={`relative h-full w-full flex flex-col justify-end z-10 transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:-translate-y-2 ${isFeatured ? "p-6 min-[375px]:p-8 md:p-10 pb-8 min-[375px]:pb-10" : "p-4 min-[375px]:p-5 min-[412px]:p-6 pb-5 min-[375px]:pb-6"}`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between w-full gap-3 lg:gap-4 h-full lg:h-auto justify-end">
                      
                      {/* Text Block */}
                      <div className="flex flex-col min-w-0 w-full lg:w-auto lg:flex-1">
                        <span className="block text-[color:var(--gold)]/80 mb-1.5 md:mb-3 uppercase tracking-[0.25em] text-[8px] min-[375px]:text-[9px] lg:text-[10px] font-medium transition-all duration-[400ms] group-hover:opacity-100 group-hover:brightness-110">
                          {collection.eyebrow}
                        </span>
                        <h3
                          className={`font-serif text-white/95 mb-1 lg:mb-2 transition-all duration-[400ms] group-hover:text-white line-clamp-2 text-balance leading-[1.15] ${isFeatured ? "text-3xl md:text-4xl" : "text-xl min-[375px]:text-2xl"}`}
                        >
                          {collection.name}
                        </h3>
                        {isFeatured && (
                          <p className="text-white/90 text-[13px] min-[375px]:text-sm max-w-[280px] font-normal leading-[1.6] min-[375px]:leading-[1.8] transition-all duration-[400ms] group-hover:text-white mt-1 min-[375px]:mt-2">
                            {collection.purpose}
                          </p>
                        )}
                        {!isFeatured && (
                          <p className="text-white/80 text-[11px] lg:text-xs line-clamp-1 font-normal mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms] hidden lg:block">
                            {collection.purpose}
                          </p>
                        )}
                      </div>

                      {/* Ripple Arrow Button */}
                      <div className="shrink-0 flex justify-end w-full lg:w-auto mt-2 lg:mt-0 lg:mb-1">
                        <div
                          className={`flex items-center justify-center rounded-full border border-white/20 transition-all duration-[400ms] group-hover:border-[color:var(--gold)] group-hover:bg-[color:var(--gold)]/20 backdrop-blur-sm relative overflow-hidden ${isFeatured ? "h-12 w-12" : "h-[40px] w-[40px] min-[375px]:h-[44px] min-[375px]:w-[44px]"}`}
                        >
                          <span
                            className={`text-white transition-transform duration-[400ms] group-hover:translate-x-1 group-hover:text-[color:var(--gold)] z-10 ${isFeatured ? "text-base" : "text-[13px] min-[375px]:text-sm"}`}
                          >
                            →
                          </span>
                          <div className="absolute inset-0 bg-[color:var(--gold)] scale-0 rounded-full transition-transform duration-[400ms] ease-out group-hover:scale-100 opacity-10" />
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
