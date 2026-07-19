import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout/LegalLayout";
import { PolicySection } from "@/components/LegalLayout/PolicySection";
import { generateMetadata } from "@/lib/seo/metadata";
import { businessConfig } from "@/config/business";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: generateMetadata({
      title: "Privacy Policy",
      description: "Our Privacy Policy outlines how Lenoraa collects, uses, and protects your personal data in compliance with Indian laws.",
      path: "/privacy",
    }),
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updatedAt="October 24, 2024">
      <PolicySection title="1. Introduction">
        <p>
          Welcome to {businessConfig.name}. We respect your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, process, and safeguard the information you provide to us when you visit our website, {businessConfig.websiteUrl}, or purchase our products.
        </p>
        <p>
          This policy is designed to comply with applicable data protection laws in India, including the Information Technology Act, 2000, and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
        </p>
      </PolicySection>

      <PolicySection title="2. Information We Collect">
        <p>
          To provide you with our premium skincare products and services, we may collect the following categories of information:
        </p>
        <ul>
          <li><strong>Identity and Contact Data:</strong> Includes your full name, email address, billing address, delivery address, and telephone number.</li>
          <li><strong>Financial Data:</strong> We do not store your credit/debit card details or UPI information on our servers. All financial transactions are handled through secure, PCI-DSS compliant third-party payment gateways.</li>
          <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of products you have purchased from us.</li>
          <li><strong>Technical Data:</strong> Includes your internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types, operating system, and platform.</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. How We Use Your Information">
        <p>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul>
          <li>To process and deliver your order, including managing payments, fees, and charges.</li>
          <li>To manage our relationship with you, such as notifying you about changes to our terms or privacy policy.</li>
          <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, and system maintenance).</li>
          <li>To deliver relevant website content and advertisements to you and measure the effectiveness of our marketing.</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Data Security">
        <p>
          We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. Access to your personal data is limited to those employees, agents, contractors, and other third parties who have a business need to know.
        </p>
      </PolicySection>

      <PolicySection title="5. Data Retention">
        <p>
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements under Indian law.
        </p>
      </PolicySection>

      <PolicySection title="6. Your Rights">
        <p>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to request access to your personal data, request correction of the personal data that we hold about you, and request erasure of your personal data. To exercise any of these rights, please contact us.
        </p>
      </PolicySection>

      <PolicySection title="7. Contact Us">
        <p>
          If you have any questions about this Privacy Policy or our privacy practices, please contact our grievance officer at:
        </p>
        <p>
          Email: <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a><br />
          Phone: {businessConfig.phone}<br />
          Address: {businessConfig.address}
        </p>
      </PolicySection>
    </LegalLayout>
  );
}
