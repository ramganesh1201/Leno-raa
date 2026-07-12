import { supabase } from "@/lib/supabase";

export const ordersService = {
  async getOrders() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*, product:products(*), customization:soap_customizations(*)),
        address:user_addresses(*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async createOrder(addressId: string | null, subtotal: number, shipping: number, tax: number = 0, discount: number = 0) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to create an order");

    const total = subtotal + shipping + tax - discount;

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address_id: addressId,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        payment_method: 'Manual',
        payment_status: 'Pending',
        order_status: 'Awaiting Payment'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Fetch current cart items
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*, product:products(price), customization:soap_customizations(estimated_price)")
      .eq("user_id", user.id);

    if (cartError) throw cartError;

    // 3. Move items to order_items
    if (cartItems && cartItems.length > 0) {
      const orderItemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product ? item.product.price : (item.customization ? item.customization.estimated_price : 0),
        customization_id: item.customization_id
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 4. Clear Cart
      await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);
    }

    return order;
  }
};
