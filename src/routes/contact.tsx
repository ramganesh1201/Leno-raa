import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { generateMetadata } from "@/lib/seo/metadata";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: generateMetadata({
      title: "Contact Us",
      description: "Get in touch with the Lenoraa team for inquiries, support, or feedback.",
      path: "/contact",
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="relative min-h-screen bg-[color:var(--background)] pt-32 pb-24">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 lg:gap-24">
          {/* Left Column: Contact Info */}
          <div>
            <ContactInfo />
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-[color:var(--ivory)]/40 p-8 md:p-12 rounded-[24px] border border-[color:var(--border)]">
            <h2 className="text-display text-3xl mb-8">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
