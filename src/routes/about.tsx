import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout/LegalLayout";
import { PolicySection } from "@/components/LegalLayout/PolicySection";
import { generateMetadata } from "@/lib/seo/metadata";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: generateMetadata({
      title: "About Us",
      description: "Discover the story behind Lenoraa's handcrafted luxury skincare. We believe in the restorative power of nature and uncompromising quality.",
      path: "/about",
    }),
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalLayout title="About Lenoraa">
      <PolicySection title="Our Mission">
        <p>
          At Lenoraa, our mission is to redefine luxury skincare by returning to the fundamentals of nature. We believe that true luxury lies in purity, intention, and the slow, deliberate process of craftsmanship. Our goal is to provide skincare that not only nourishes the body but also respects the earth from which our ingredients are sourced.
        </p>
      </PolicySection>

      <PolicySection title="Our Vision">
        <p>
          We envision a world where personal care is not merely a routine, but a restorative ritual. We seek to create moments of pause in a fast-paced world, allowing the therapeutic qualities of botanicals to deeply nourish both skin and spirit. We aspire to be the standard-bearer for uncompromising quality in handcrafted skincare across India and beyond.
        </p>
      </PolicySection>

      <PolicySection title="Uncompromising Craftsmanship">
        <p>
          Every bar of Lenoraa soap is meticulously crafted by hand in small, controlled batches. We employ the traditional cold-process method, a time-honored technique that requires patience and precision. This slow curing process—often taking several weeks—ensures that the natural glycerin, a vital byproduct of saponification, is fully retained to draw moisture into your skin.
        </p>
      </PolicySection>

      <PolicySection title="The Power of Natural Ingredients">
        <p>
          We source only the finest botanicals, mineral-rich clays, and pure essential oils. Our formulations are doctor-developed, rooted in a profound respect for both ancient Ayurvedic wisdom and modern dermatological science. Each ingredient is selected for its specific therapeutic benefits.
        </p>
        <p>
          You will never find harsh synthetic chemicals, parabens, sulfates, or artificial fragrances in our atelier. Nature provides exactly what we need to thrive, and we distill that essence into every product we create.
        </p>
      </PolicySection>

      <PolicySection title="Why Choose Lenoraa?">
        <p>
          Choosing Lenoraa is choosing a mindful approach to personal care. It is a commitment to uncompromising quality, environmental sustainability, and the profound belief that your skin deserves the absolute best. Experience the difference of genuine, handcrafted luxury—made with intention, for you.
        </p>
      </PolicySection>
    </LegalLayout>
  );
}
