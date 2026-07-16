import { supabase } from "@/lib/supabase";

export const ordersService = {
  async getOrders() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*, product:products(*), customization:soap_customizations(*)),
        shipping_addresses(*)
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (*, product:products(*), customization:soap_customizations(*)),
        shipping_addresses(*),
        payment_proofs(*)
      `,
      )
      .eq("id", orderId)
      .single();

    if (error) throw error;
    return data;
  },

  async createOrder(
    shippingDetails: {
      full_name: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      pincode: string;
    },
    subtotal: number,
    shipping_cost: number,
    tax: number = 0,
    discount: number = 0,
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to create an order");

    const total = subtotal + shipping_cost + tax - discount;
    const order_number = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number,
        user_id: user.id,
        subtotal,
        shipping_cost,
        tax,
        discount,
        total,
        payment_method: "UPI",
        payment_status: "Pending",
        order_status: "Awaiting Payment",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert Shipping Address
    const { error: addressError } = await supabase.from("shipping_addresses").insert({
      order_id: order.id,
      ...shippingDetails,
    });

    if (addressError) throw addressError;

    // 2. Fetch current cart items
    const { data: cartItems, error: cartError } = await supabase
      .from("cart_items")
      .select("*, product:products(price), customization:soap_customizations(calculated_price)")
      .eq("user_id", user.id);

    if (cartError) throw cartError;

    // 3. Move items to order_items
    if (cartItems && cartItems.length > 0) {
      const orderItemsToInsert = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product
          ? item.product.price
          : item.customization
            ? item.customization.calculated_price
            : 0,
        customization_id: item.customization_id,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      await supabase.from("cart_items").delete().eq("user_id", user.id);

      // 5. Notify User
      await supabase.from("notifications").insert({
        user_id: user.id,
        title: "Order Reserved",
        message: `Your order ${order.order_number} has been saved securely.`,
      });
    }

    return order;
  },

  async uploadPaymentProof(orderId: string, utrNumber: string, file: File) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const fileExt = file.name.split(".").pop();
    const fileName = `${orderId}-${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filePath);

    const { error: proofError } = await supabase.from("payment_proofs").insert({
      order_id: orderId,
      screenshot_url: urlData.publicUrl,
      utr_number: utrNumber,
      verification_status: "pending",
    });

    if (proofError) throw proofError;

    const { error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "Awaiting Verification" })
      .eq("id", orderId);

    if (updateError) throw updateError;
  },

  // Admin Methods
  async getAdminOrders() {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (ordersError) {
      console.error("Orders query error:", ordersError);
      throw new Error(ordersError.message);
    }

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone");
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("*, product:products(*), customization:soap_customizations(*)");
    const { data: shipping } = await supabase.from("shipping_addresses").select("*");
    const { data: proofs } = await supabase.from("payment_proofs").select("*");

    return (orders || []).map((o) => ({
      ...o,
      profiles: profiles?.find((p) => p.id === o.user_id) || null,
      order_items: orderItems?.filter((i) => i.order_id === o.id) || [],
      shipping_addresses: shipping?.filter((s) => s.order_id === o.id) || [],
      payment_proofs: proofs?.filter((p) => p.order_id === o.id) || [],
    }));
  },

  async getAdminPayments() {
    const { data: proofs, error: proofsError } = await supabase
      .from("payment_proofs")
      .select("*")
      .order("uploaded_at", { ascending: false });

    if (proofsError) {
      console.error("Payments query error:", proofsError);
      throw new Error(proofsError.message);
    }

    const { data: orders } = await supabase
      .from("orders")
      .select("id, order_number, total, payment_status, user_id");
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone");
    const { data: shipping } = await supabase
      .from("shipping_addresses")
      .select("order_id, full_name, phone");

    return (proofs || []).map((p) => {
      const order = orders?.find((o) => o.id === p.order_id);
      const profile = profiles?.find((pr) => pr.id === order?.user_id);
      const ship = shipping?.find((s) => s.order_id === order?.id);

      return {
        ...p,
        order: order
          ? {
              ...order,
              profiles: profile || null,
              shipping_addresses: ship ? [ship] : [],
            }
          : null,
      };
    });
  },

  async verifyPayment(
    orderId: string,
    proofId: string,
    isApproved: boolean,
    rejectionReason?: string,
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const status = isApproved ? "verified" : "rejected";

    await supabase
      .from("payment_proofs")
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
        verified_by: user.id,
        rejection_reason: rejectionReason || null,
      })
      .eq("id", proofId);

    const newPaymentStatus = isApproved ? "Verified" : "Rejected";
    const newOrderStatus = isApproved ? "Preparing" : "Awaiting Payment";

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: newPaymentStatus,
        order_status: newOrderStatus,
      })
      .eq("id", orderId);

    if (error) throw error;
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    notes?: string,
    courier?: string,
    tracking?: string,
  ) {
    const updateData: any = { order_status: status };
    if (notes !== undefined) updateData.internal_notes = notes;
    if (courier !== undefined) updateData.courier_name = courier;
    if (tracking !== undefined) updateData.tracking_number = tracking;

    const { error } = await supabase.from("orders").update(updateData).eq("id", orderId);

    if (error) throw error;
  },
};
