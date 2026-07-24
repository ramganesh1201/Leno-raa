import { motion } from "framer-motion";
import { Reveal } from "@/components/immersive/Reveal";
import { SplitText } from "@/components/immersive/SplitText";
import heroIntro from "@/assets/hero-intro.webp";

export function StoryHero() {
  return (
    <section className="relative flex flex-col md:flex-row min-h-[90svh] items-center justify-center pt-32 pb-16 px-6 md:px-12 bg-gradient-to-b from-[color:var(--ivory)] to-[color:var(--background)]">
      <div className="w-full max-w-[1400px] grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Text Content */}
        <div className="order-2 md:order-1 flex flex-col justify-center max-w-xl">
          <Reveal preset="label" className="text-eyebrow text-[color:var(--gold)] mb-6">
            Our Story
          </Reveal>

          <SplitText
            as="h1"
            text="Every bar begins with care."
            delay={0.1}
            className="text-display text-5xl md:text-6xl leading-[1.1] text-[color:var(--foreground)] mb-6"
          />

          <p className="text-lg md:text-xl leading-relaxed text-[color:var(--muted-foreground)] mb-6">
            Lenoraa was born from a desire to return to the essentials. We craft doctor-formulated,
            cold-processed soap that honors the intelligence of your skin and the purity of nature.
          </p>
        </div>

        {/* Hero Image */}
        <div className="order-1 md:order-2 w-full h-[50vh] md:h-[70vh] relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl">
          <motion.img
            src={heroIntro}
            alt="Handcrafted Lenoraa Soap"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[color:var(--muted-foreground)]">
          Scroll
        </span>
        <div className="w-[1px] h-12 bg-[color:var(--border)] overflow-hidden relative">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-0 bg-[color:var(--gold)] w-full h-1/2"
          />
        </div>
      </motion.div>
    </section>
  );
}
