import { supabase } from "@/lib/supabase";
import { productService } from "@/services/product.service";
import { AsyncLock } from "@/lib/asyncLock";

const wishlistLock = new AsyncLock();
export const wishlistService = {
  async getWishlist() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("wishlist")
      .select("*, product:products(*)")
      .eq("user_id", user.id);

    if (error) throw error;
    return data;
  },

  async toggleWishlist(productId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to wishlist items");

    const release = await wishlistLock.acquire();
    try {
      // Check if exists
      const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existing.id);
      if (error) {
        console.error("Supabase Error removing from wishlist:", error);
        throw error;
      }
      
      const prod = await productService.getProductById(productId);
      const productName = prod?.name || "Soap";
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Removed Saved Soap",
        message: `Removed ${productName} from your saved soaps.`
      });
      
      return { added: false };
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });
        
        if (error) {
          if (error.code === '23505') {
            // Already saved concurrently by another tab.
            return { added: true };
          }
          console.error("Supabase Error adding to wishlist:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }
      
      const prod = await productService.getProductById(productId);
      const productName = prod?.name || "Soap";
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Saved Soap",
        message: `Saved ${productName} to your saved soaps.`
      });
      
      return { added: true };
    }
    } finally {
      release();
    }
  }
};
