import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout/LegalLayout";
import { PolicySection } from "@/components/LegalLayout/PolicySection";
import { generateMetadata } from "@/lib/seo/metadata";
import { businessConfig } from "@/config/business";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: generateMetadata({
      title: "Terms & Conditions",
      description: "Terms and conditions for using the Lenoraa website and purchasing our handcrafted skincare products.",
      path: "/terms",
    }),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updatedAt="October 24, 2024">
      <PolicySection title="1. Agreement to Terms">
        <p>
          These Terms and Conditions constitute a legally binding agreement made between you and {businessConfig.name} ("we," "us," or "our"), concerning your access to and use of the {businessConfig.websiteUrl} website as well as any other media form related or connected thereto.
        </p>
        <p>
          By accessing the site, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the site and must discontinue use immediately.
        </p>
      </PolicySection>

      <PolicySection title="2. Products and Pricing">
        <p>
          All of our skincare products are handcrafted in small batches. Due to the nature of natural ingredients, slight variations in color, texture, or scent may occur between batches. These variations do not affect the quality or efficacy of the products.
        </p>
        <p>
          All prices displayed on the website are in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST) unless otherwise stated. We reserve the right to change prices at any time without prior notice.
        </p>
      </PolicySection>

      <PolicySection title="3. Health and Safety Disclaimer">
        <p>
          Our products are formulated with natural ingredients and botanical extracts. However, natural ingredients can still cause allergic reactions in some individuals. We strongly recommend reading the full ingredient list provided on each product page before purchase.
        </p>
        <p>
          It is advisable to perform a patch test prior to full application. If any irritation occurs, discontinue use immediately and consult a physician. The information on this website is for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </PolicySection>

      <PolicySection title="4. Ordering and Payment">
        <p>
          By placing an order, you warrant that you are legally capable of entering into binding contracts and are at least 18 years old. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase, inaccuracies in product or pricing information, or problems identified by our fraud avoidance department.
        </p>
      </PolicySection>

      <PolicySection title="5. Intellectual Property Rights">
        <p>
          Unless otherwise indicated, the website is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws of India.
        </p>
      </PolicySection>

      <PolicySection title="6. Governing Law and Jurisdiction">
        <p>
          These Terms shall be governed by and defined following the laws of India. {businessConfig.name} and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
        </p>
      </PolicySection>

      <PolicySection title="7. Contact Information">
        <p>
          In order to resolve a complaint regarding the site or to receive further information regarding use of the site, please contact us at:
        </p>
        <p>
          Email: <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
        </p>
      </PolicySection>
    </LegalLayout>
  );
}
