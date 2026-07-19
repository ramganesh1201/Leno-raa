import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout/LegalLayout";
import { PolicySection } from "@/components/LegalLayout/PolicySection";
import { generateMetadata } from "@/lib/seo/metadata";
import { businessConfig } from "@/config/business";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: generateMetadata({
      title: "Refund & Return Policy",
      description: "Learn about Lenoraa's return policy, eligibility criteria, and refund timelines for our handcrafted skincare.",
      path: "/refunds",
    }),
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <LegalLayout title="Refund & Return Policy" updatedAt="October 24, 2024">
      <PolicySection title="1. Overview">
        <p>
          At {businessConfig.name}, we hold our craftsmanship to the highest standard. Because our skincare products are handcrafted, natural, and personal care items, maintaining hygiene and safety is our utmost priority. Therefore, we have a strict policy regarding returns and exchanges.
        </p>
      </PolicySection>

      <PolicySection title="2. Return Eligibility">
        <p>
          Due to the nature of our products, we do not accept returns or exchanges on opened, unsealed, or used items. 
        </p>
        <p>
          Returns are only accepted if:
        </p>
        <ul>
          <li>The wrong product was delivered to you.</li>
          <li>The product arrived damaged or defective.</li>
        </ul>
        <p>
          If you meet the above criteria, you must contact us within 48 hours of receiving your delivery to initiate a return request.
        </p>
      </PolicySection>

      <PolicySection title="3. Initiating a Return">
        <p>
          To raise a return request for a damaged or incorrect item, please email us at <a href={`mailto:${businessConfig.supportEmail}`}>{businessConfig.supportEmail}</a> with the following details:
        </p>
        <ul>
          <li>Your Order Number</li>
          <li>Clear photographs or an unboxing video showing the damage or incorrect product</li>
          <li>A brief description of the issue</li>
        </ul>
        <p>
          Our team will review your request within 2 business days. If approved, we will arrange for a reverse pickup from your delivery address.
        </p>
      </PolicySection>

      <PolicySection title="4. The Refund Process">
        <p>
          Once we receive the returned item at our facility, it will undergo a quality inspection. If the claim is validated, we will process your refund or dispatch a replacement within 3 business days.
        </p>
        <p>
          Refunds will be credited back to the original method of payment. Please note that it may take an additional 5 to 7 business days for the funds to reflect in your bank account or credit card statement, depending on your financial institution.
        </p>
      </PolicySection>

      <PolicySection title="5. Cancellations">
        <p>
          If you wish to cancel your order, you must do so before it has been dispatched from our facility. Once an order has been handed over to our courier partner, it cannot be canceled. To request a cancellation, please contact us immediately with your order number.
        </p>
      </PolicySection>
    </LegalLayout>
  );
}
