import { supabase } from "@/lib/supabase";

export interface CartItemType {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  selected_variant?: string;
  customization_id?: string;
  created_at: string;
  updated_at: string;
  product?: any; // joined product data
  customization?: any; // joined custom soap data
}

export const cartService = {
  async getCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        product:products (*),
        customization:soap_customizations (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data as CartItemType[];
  },

  async addToCart(productId: string | null, quantity: number = 1, customizationId: string | null = null) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in to add to cart");

    // Check if item already exists
    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq(productId ? "product_id" : "customization_id", productId || customizationId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          customization_id: customizationId,
          quantity,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (error) throw error;
  },

  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", user.id);
    if (error) throw error;
  },
};
