import { businessConfig } from "@/config/business";

interface MetadataProps {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
}

export function generateMetadata({
  title,
  description,
  path,
  image = businessConfig.defaultSeoImage,
  type = "website",
}: MetadataProps) {
  const pageTitle = title ? `${title} | ${businessConfig.name}` : businessConfig.name;
  const pageDescription = description || businessConfig.organizationDescription;
  const url = `${businessConfig.websiteUrl}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${businessConfig.websiteUrl}${image}`;

  return [
    { title: pageTitle },
    { name: "description", content: pageDescription },
    { rel: "canonical", href: url },
    // Open Graph
    { property: "og:title", content: pageTitle },
    { property: "og:description", content: pageDescription },
    { property: "og:url", content: url },
    { property: "og:image", content: imageUrl },
    { property: "og:type", content: type },
    { property: "og:site_name", content: businessConfig.name },
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: pageTitle },
    { name: "twitter:description", content: pageDescription },
    { name: "twitter:image", content: imageUrl },
  ];
}
