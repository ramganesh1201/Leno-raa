import { IMAGE_REGISTRY } from "./imageRegistry";

export function resolveImageUrl(dbPath: string | undefined | null): string | undefined {
  if (!dbPath) return undefined;
  
  // 1. If it's already an absolute HTTP URL (e.g. Supabase or external), return it
  if (dbPath.startsWith("http://") || dbPath.startsWith("https://")) return dbPath;

  // 2. Normalize the path to just the filename
  const filename = dbPath.split("/").pop() || "";
  
  // 3. Fallback to WebP if legacy jpg/png
  const webpFilename = filename.replace(/\.(jpeg|jpg|png)$/i, ".webp");

  // 4. Check registry
  if (IMAGE_REGISTRY[webpFilename]) {
    return IMAGE_REGISTRY[webpFilename];
  }
  
  if (IMAGE_REGISTRY[filename]) {
    return IMAGE_REGISTRY[filename];
  }

  // 5. Fallback
  return dbPath;
}
