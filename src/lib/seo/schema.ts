import { businessConfig } from "@/config/business";

type SchemaType = "Organization" | "WebSite" | "Product" | "BreadcrumbList" | "FAQPage";

export const generateSchema = {
  organization: () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: businessConfig.name,
      url: businessConfig.websiteUrl,
      logo: `${businessConfig.websiteUrl}/apple-touch-icon.png`,
      description: businessConfig.organizationDescription,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: businessConfig.phone,
        contactType: "customer support",
        email: businessConfig.supportEmail || businessConfig.email,
        availableLanguage: ["English", "Hindi"],
      },
      sameAs: [businessConfig.socialLinks.instagram, businessConfig.socialLinks.facebook].filter(
        Boolean,
      ),
    };
  },

  website: () => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: businessConfig.name,
      url: businessConfig.websiteUrl,
      description: businessConfig.organizationDescription,
    };
  },

  product: (product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    availability?: "InStock" | "OutOfStock";
    url: string;
  }) => {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.image.startsWith("http")
        ? product.image
        : `${businessConfig.websiteUrl}${product.image}`,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: businessConfig.name,
      },
      offers: {
        "@type": "Offer",
        url: `${businessConfig.websiteUrl}${product.url}`,
        priceCurrency: product.currency || "INR",
        price: product.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: `https://schema.org/${product.availability || "InStock"}`,
      },
    };
  },

  breadcrumb: (items: { name: string; url: string }[]) => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${businessConfig.websiteUrl}${item.url}`,
      })),
    };
  },
};
