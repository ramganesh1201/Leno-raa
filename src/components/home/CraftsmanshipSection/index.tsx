import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { craftsmanshipSlides } from "./data";
import { StoryText, StoryImage } from "./StorySlide";
import { Navigation } from "./Navigation";
import { Progress } from "./Progress";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";

const AUTOPLAY_DURATION = 6000;

export function CraftsmanshipSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % craftsmanshipSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + craftsmanshipSlides.length) % craftsmanshipSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.touches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      touchStartX.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    setIsPaused(false);
  };

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden bg-[color:var(--background)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl text-left">
            <Reveal preset="label" className="text-eyebrow text-[color:var(--muted-foreground)]">
              The House of Lenoraa
            </Reveal>
            <SplitText
              as="h2"
              text="Why we pour by hand."
              delay={0.1}
              className="text-display mt-4 text-4xl"
            />
          </div>
          <Reveal
            as="p"
            preset="paragraph"
            delay={0.2}
            className="text-[color:var(--muted-foreground)] max-w-sm text-sm leading-relaxed"
          >
            A journey through our artisanal process. We believe luxury is found in the time taken to
            craft something beautiful.
          </Reveal>
        </div>

        {/* Editorial Carousel Card */}
        <div className="relative mt-12 md:mt-20 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-[color:var(--card)] to-[color:var(--card)]/50 p-6 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[color:var(--border)]/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            {/* Left Content Column */}
            <div className="order-2 md:order-1 md:col-span-5 flex flex-col justify-center">
              <div className="min-h-[220px] md:min-h-[260px] flex items-center">
                <AnimatePresence mode="wait">
                  <StoryText
                    key={currentIndex}
                    index={currentIndex}
                    slide={craftsmanshipSlides[currentIndex]}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation & Progress Area aligned under text */}
              <div className="mt-8 md:mt-12 pt-8 border-t border-[color:var(--border)] w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-0">
                <Progress
                  currentIndex={currentIndex}
                  total={craftsmanshipSlides.length}
                  duration={AUTOPLAY_DURATION}
                  isPaused={isPaused}
                />
                <Navigation
                  onPrev={prevSlide}
                  onNext={nextSlide}
                  isPaused={isPaused}
                  setIsPaused={setIsPaused}
                />
              </div>
            </div>

            {/* Right Image Column */}
            <div className="order-1 md:order-2 md:col-span-7 w-full">
              <div className="relative aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-[1.5rem] md:rounded-[2rem] shadow-xl">
                <AnimatePresence mode="wait">
                  <StoryImage key={currentIndex} slide={craftsmanshipSlides[currentIndex]} />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/5 mix-blend-overlay pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
