import { supabase } from "@/lib/supabase";
import { productService } from "@/services/product.service";
import { AsyncLock } from "@/lib/asyncLock";

const cartLock = new AsyncLock();
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

    const release = await cartLock.acquire();
    try {
      // Check if item already exists
      let query = supabase
        .from("cart_items")
        .select("id, quantity")
        .eq("user_id", user.id);
      
    if (productId) {
      query = query.eq("product_id", productId).is("customization_id", null);
    } else if (customizationId) {
      query = query.eq("customization_id", customizationId).is("product_id", null);
    }

    const { data: existing, error: fetchError } = await query.maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (existing) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + (quantity || 1) })
        .eq("id", existing.id);
      
      if (error) {
        console.error("Supabase Error updating cart:", error);
        throw error;
      }
    } else {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId || null,
          customization_id: customizationId || null,
          quantity,
        })
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') {
          // Fallback just in case another tab fired a request
          const { data: recheck } = await query.maybeSingle();
          if (recheck) {
            const { error: updateError } = await supabase
              .from("cart_items")
              .update({ quantity: recheck.quantity + (quantity || 1) })
              .eq("id", recheck.id);
            if (updateError) throw updateError;
            return;
          }
        }
        console.error("Supabase Error inserting to cart:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      let productName = "Custom Soap";
      if (productId) {
        const prod = await productService.getProductById(productId);
        productName = prod?.name || "Soap";
      }
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Added to Bag",
        message: `Added ${productName} to your bag.`
      });
      
      return data;
    }
    } finally {
      release();
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
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch item first to get product info for notification
    const { data: item } = await supabase
      .from("cart_items")
      .select("product_id, customization_id")
      .eq("id", cartItemId)
      .maybeSingle();
      
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (error) throw error;
    
    if (user && item) {
      let productName = "Custom Soap";
      if (item.product_id) {
        const prod = await productService.getProductById(item.product_id);
        productName = prod?.name || "Soap";
      }
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Removed from Bag",
        message: `Removed ${productName} from your bag.`
      });
    }
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
