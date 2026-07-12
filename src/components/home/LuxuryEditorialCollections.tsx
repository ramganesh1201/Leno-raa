import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { collections, type Collection } from "@/lib/catalog";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import { FloatingBenefits } from "@/components/product/FloatingBenefits";
import { useTheme } from "@/lib/store";

function MinimalIcon({ type }: { type: "natural" | "handmade" | "quality" | "eco" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-5 h-5 text-[color:var(--foreground)] group-hover:text-[color:var(--gold)] transition-colors duration-500">
      {type === "natural" && (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 009-9c0-4.97-4.03-9-9-9S3 7.03 3 12c0 1.96.63 3.77 1.68 5.24" />
      )}
      {type === "handmade" && (
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
      )}
      {type === "quality" && (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      )}
      {type === "eco" && (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      )}
    </svg>
  );
}

export function LuxuryEditorialCollections() {
  const setTheme = useTheme((s) => s.setTheme);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse Drag to Scroll (Desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const onMouseLeave = () => {
    setIsDragging(false);
    setHoveredIndex(null);
    setTheme("radiance", "goldDust"); // Revert to default
  };
  const onMouseUp = () => {
    setIsDragging(false);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleCardHover = (index: number, collection: Collection) => {
    if (isDragging) return;
    setHoveredIndex(index);
    setTheme(collection.slug, collection.ambience);
  };

  const features = [
    { label: "Natural Ingredients", type: "natural" as const },
    { label: "Handmade", type: "handmade" as const },
    { label: "Premium Quality", type: "quality" as const },
  ];

  return (
    <section className="relative py-32 bg-transparent transition-colors duration-1000">
      <div className="mx-auto w-full px-6 md:px-12 max-w-[1800px]">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="flex-1">
            <Reveal preset="label" className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted-foreground)] mb-4 font-semibold">
              Our Collections
            </Reveal>
            <SplitText as="h2" text="Find Your Perfect Soap" delay={0.1} className="text-display text-4xl md:text-5xl text-[color:var(--foreground)] tracking-tight" />
            <Reveal as="p" preset="paragraph" delay={0.2} className="mt-6 max-w-lg text-[color:var(--muted-foreground)] leading-relaxed">
              Every soap tells a different story. Hover to experience their atmosphere and discover the perfect ritual for your skin.
            </Reveal>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap gap-6 shrink-0"
          >
            {features.map((feature, i) => (
              <div key={i} className="group flex items-center gap-3 cursor-default">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--card)] shadow-sm border border-[color:var(--border)] group-hover:border-[color:var(--gold)]/30 transition-colors duration-500">
                  <MinimalIcon type={feature.type} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--muted-foreground)] group-hover:text-[color:var(--foreground)] transition-colors duration-500">
                  {feature.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Horizontal Luxury Carousel */}
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide pb-16 pt-4 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
          {collections.map((collection, index) => {
            const isHovered = hoveredIndex === index;
            const isOthersHovered = hoveredIndex !== null && hoveredIndex !== index;
            
            const scaleClass = isHovered ? "scale-[1.04]" : isOthersHovered ? "scale-[0.97]" : "scale-100";
            const opacityClass = isOthersHovered ? "opacity-60" : "opacity-100";

            // Intelligent text contrast mapping based on specific image composition
            const config = {
              radiance: {
                imagePosition: "object-[center_25%]",
                overlayOpacity: "0.85",
                padding: "pb-16",
              },
              calm: {
                imagePosition: "object-[center_10%]", // Shifts bright reflections upward
                overlayOpacity: "0.90",
                padding: "pb-16",
              },
              nourish: {
                imagePosition: "object-[80%_20%]", // Focuses on honey to leave negative space bottom-left
                overlayOpacity: "0.85",
                padding: "pb-16",
              },
              relax: {
                imagePosition: "object-center", // Naturally dark
                overlayOpacity: "0.60",
                padding: "pb-12",
              },
              herbal: {
                imagePosition: "object-center", // Naturally dark
                overlayOpacity: "0.60",
                padding: "pb-12",
              },
            }[collection.slug as string] || {
              imagePosition: "object-center",
              overlayOpacity: "0.75",
              padding: "pb-12",
            };

            return (
              <motion.div
                key={collection.slug}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => handleCardHover(index, collection)}
                className={`group relative shrink-0 w-[85vw] sm:w-[340px] md:w-[380px] h-[500px] md:h-[520px] rounded-[24px] overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1] ${scaleClass} ${opacityClass}`}
              >
                <Link to="/collections/$slug" params={{ slug: collection.slug }} className="block w-full h-full relative" draggable={false}>
                  
                  {/* Background Image */}
                  <div className="absolute inset-0 w-full h-full bg-[color:var(--card)]">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      draggable={false}
                      className={`w-full h-full ${config.imagePosition} object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110`}
                    />
                  </div>

                  {/* Localized Cinematic Overlay & Content-Safe Zone */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-full pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100"
                    style={{ background: `radial-gradient(110% 80% at 0% 100%, rgba(17,17,17,${config.overlayOpacity}) 0%, rgba(17,17,17,0) 100%)` }}
                  />
                  {/* Readability Layer Gradient */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none transition-opacity duration-500 opacity-90 group-hover:opacity-100" />

                  {/* Floating Benefits Layer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <FloatingBenefits benefits={collection.benefits} />
                  </div>

                  {/* Content Wrapper */}
                  <div className={`relative h-full w-full flex flex-col justify-end p-8 ${config.padding} z-10 transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:-translate-y-3`}>
                    <div className="flex items-end justify-between gap-4">
                      <div className="flex-1">
                        <span className="block text-[color:var(--gold)]/90 mb-3 uppercase tracking-[0.25em] text-[10px] font-medium opacity-90 transition-all duration-[400ms] group-hover:opacity-100 group-hover:brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                          {collection.eyebrow}
                        </span>
                        <h3 className="font-serif text-3xl md:text-4xl text-white/95 mb-2 transition-all duration-[400ms] group-hover:text-white group-hover:brightness-110 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                          {collection.name}
                        </h3>
                        <p className="text-white/90 text-sm max-w-[260px] font-normal leading-[1.8] transition-all duration-[400ms] group-hover:text-white group-hover:brightness-110 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
                          {collection.purpose}
                        </p>
                      </div>

                      {/* Ripple Arrow Button */}
                      <div className="shrink-0 mb-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-[400ms] group-hover:border-[color:var(--gold)] group-hover:bg-[color:var(--gold)]/20 group-hover:shadow-[0_0_20px_rgba(217,119,6,0.3)] backdrop-blur-sm relative overflow-hidden">
                          <span className="text-white transition-transform duration-[400ms] group-hover:translate-x-1 group-hover:text-[color:var(--gold)] z-10">
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
