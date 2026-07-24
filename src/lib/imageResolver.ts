const soapImages = import.meta.glob("/src/assets/soaps/*.{jpeg,jpg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function resolveImageUrl(dbPath: string | undefined | null): string | undefined {
  if (!dbPath) return undefined;
  // If it's already an absolute HTTP URL, just return it
  if (dbPath.startsWith("http://") || dbPath.startsWith("https://")) return dbPath;

  // 1. Check if a WebP version exists in our local bundle
  const webpPath = dbPath.replace(/\.(jpeg|jpg|png)$/i, ".webp");
  const bundledWebP = soapImages[webpPath];
  if (bundledWebP) {
    return bundledWebP as string;
  }

  // 2. Resolve original format from Vite bundled assets
  const bundledPath = soapImages[dbPath];
  if (bundledPath) {
    return bundledPath as string;
  }

  // 3. Fallback
  return dbPath;
}
