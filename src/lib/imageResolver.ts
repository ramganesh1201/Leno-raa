const soapImages = import.meta.glob("/src/assets/soaps/*.{jpeg,jpg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export function resolveImageUrl(dbPath: string | undefined | null): string | undefined {
  if (!dbPath) return undefined;
  // If it's already an absolute HTTP URL, just return it
  if (dbPath.startsWith("http://") || dbPath.startsWith("https://")) return dbPath;

  // Resolve from Vite bundled assets
  const bundledPath = soapImages[dbPath];
  if (bundledPath) {
    return bundledPath as string;
  }

  // Fallback
  return dbPath;
}
