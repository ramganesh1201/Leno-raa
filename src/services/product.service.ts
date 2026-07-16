import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/catalog";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((row) => {
      const meta = (row.ui_metadata as any) || {};
      const collections = Array.isArray(meta.collections)
        ? [...new Set(meta.collections.filter(Boolean))]
        : meta.collection
          ? [meta.collection]
          : [];

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        description: row.description || "",
        price: row.price,
        tagline: meta.tagline || "",
        skinType: meta.skinType || "",
        collection: meta.collection ?? collections[0] ?? null,
        collections,
        ingredients: meta.ingredients || [],
        benefits: meta.benefits || [],
        notes: meta.notes || "",
        ambience: meta.ambience || "mist",
        accentColor: meta.accentColor || "#000",
        bgTint: meta.bgTint || "transparent",
        image: meta.image || "",
        images: meta.images || [],
      } as Product;
    });
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return undefined;

    const meta = (data.ui_metadata as any) || {};
    const collections = Array.isArray(meta.collections)
      ? [...new Set(meta.collections.filter(Boolean))]
      : meta.collection
        ? [meta.collection]
        : [];

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || "",
      price: data.price,
      tagline: meta.tagline || "",
      skinType: meta.skinType || "",
      collection: meta.collection ?? collections[0] ?? null,
      collections,
      ingredients: meta.ingredients || [],
      benefits: meta.benefits || [],
      notes: meta.notes || "",
      ambience: meta.ambience || "mist",
      accentColor: meta.accentColor || "#000",
      bgTint: meta.bgTint || "transparent",
      image: meta.image || "",
      images: meta.images || [],
    } as Product;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();

    if (error || !data) return undefined;

    const meta = (data.ui_metadata as any) || {};
    const collections = Array.isArray(meta.collections)
      ? [...new Set(meta.collections.filter(Boolean))]
      : meta.collection
        ? [meta.collection]
        : [];

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description || "",
      price: data.price,
      tagline: meta.tagline || "",
      skinType: meta.skinType || "",
      collection: meta.collection ?? collections[0] ?? null,
      collections,
      ingredients: meta.ingredients || [],
      benefits: meta.benefits || [],
      notes: meta.notes || "",
      ambience: meta.ambience || "mist",
      accentColor: meta.accentColor || "#000",
      bgTint: meta.bgTint || "transparent",
      image: meta.image || "",
      images: meta.images || [],
    } as Product;
  },
};
