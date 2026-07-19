import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout/LegalLayout";
import { PolicySection } from "@/components/LegalLayout/PolicySection";
import { generateMetadata } from "@/lib/seo/metadata";
import { businessConfig } from "@/config/business";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: generateMetadata({
      title: "Shipping Policy",
      description:
        "Information on Lenoraa's order processing times, shipping methods across India, and delivery estimates.",
      path: "/shipping",
    }),
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <LegalLayout title="Shipping Policy" updatedAt="October 24, 2024">
      <PolicySection title="1. Order Processing Time">
        <p>
          All our products are crafted with care and intention. Please allow 1 to 3 business days
          (excluding weekends and public holidays) for your order to be processed, packed, and
          dispatched from our facility. You will receive an email confirmation once your order has
          been successfully placed, and another notification containing your tracking details once
          the package is on its way.
        </p>
      </PolicySection>

      <PolicySection title="2. Shipping Destinations">
        <p>
          We currently ship across all major pin codes in India. Unfortunately, we do not offer
          international shipping at this time.
        </p>
      </PolicySection>

      <PolicySection title="3. Shipping Rates and Delivery Estimates">
        <p>
          We partner with premium courier services to ensure your handcrafted skincare reaches you
          safely and promptly.
        </p>
        <ul>
          <li>
            <strong>Standard Shipping:</strong> Typically delivered within 4 to 7 business days
            depending on your location.
          </li>
          <li>
            <strong>Express Shipping:</strong> Typically delivered within 2 to 4 business days
            (available for select metro cities).
          </li>
        </ul>
        <p>
          Shipping charges are calculated at checkout based on the delivery location and the weight
          of your package. We offer complimentary standard shipping on all orders exceeding ₹2,500.
        </p>
      </PolicySection>

      <PolicySection title="4. Order Tracking">
        <p>
          Once your order has been dispatched, you will receive a tracking link via email and/or
          SMS. You can use this link to monitor the journey of your package. Please note that it may
          take up to 24 hours for the tracking information to become active on the courier partner's
          website.
        </p>
      </PolicySection>

      <PolicySection title="5. Non-Delivery or Delays">
        <p>
          While we strive to ensure timely delivery, external factors such as extreme weather
          conditions, public holidays, or unforeseen logistical challenges may occasionally cause
          delays. If your order is significantly delayed beyond the estimated delivery date, please
          reach out to our support team at{" "}
          <a href={`mailto:${businessConfig.supportEmail}`}>{businessConfig.supportEmail}</a> and we
          will assist you promptly.
        </p>
      </PolicySection>

      <PolicySection title="6. Damaged or Lost Packages">
        <p>
          We package our products securely to prevent any damage during transit. However, if you
          receive a parcel that appears tampered with or damaged, please do not accept it from the
          delivery personnel. Contact us immediately so we can arrange a replacement.
        </p>
      </PolicySection>
    </LegalLayout>
  );
}
