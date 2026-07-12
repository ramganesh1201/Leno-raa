import { supabase } from "@/lib/supabase";

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

    // Check if exists
    const { data: existing } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", existing.id);
      if (error) throw error;
      return { added: false };
    } else {
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });
      if (error) throw error;
      return { added: true };
    }
  }
};
