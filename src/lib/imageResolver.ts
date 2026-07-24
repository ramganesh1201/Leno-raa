import { IMAGE_REGISTRY } from "./imageRegistry";

export function resolveImageUrl(dbPath: string | undefined | null): string | undefined {
  if (!dbPath) return undefined;
  
  // 1. Extract filename (handles URLs and paths)
  let filename = "";
  try {
    const urlObj = new URL(dbPath);
    filename = urlObj.pathname.split("/").pop() || "";
  } catch (e) {
    filename = dbPath.split("/").pop() || "";
  }
  
  // 2. Normalize to WebP for checking registry
  const webpFilename = filename.replace(/\.(jpeg|jpg|png)$/i, ".webp");
  
  // 3. Priority 1: Imported local asset
  if (IMAGE_REGISTRY[webpFilename]) {
    return IMAGE_REGISTRY[webpFilename];
  }
  if (IMAGE_REGISTRY[filename]) {
    return IMAGE_REGISTRY[filename];
  }
  
  // 4. Priority 2 & 3: External URL or Supabase Storage URL
  if (dbPath.startsWith("http://") || dbPath.startsWith("https://") || dbPath.startsWith("blob:")) {
    return dbPath;
  }
  
  // 5. Fallback
  return dbPath;
}
