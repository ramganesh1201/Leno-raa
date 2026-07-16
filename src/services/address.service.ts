import { supabase } from "@/lib/supabase";

export interface AddressType {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const addressService = {
  async getAddresses() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data.map((addr) => ({
      ...addr,
      address: addr.address_line1,
      zipcode: addr.postal_code,
    })) as unknown as AddressType[];
  },

  async addAddress(address: Omit<AddressType, "id" | "user_id" | "created_at" | "updated_at">) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to add an address");

    if (address.is_default) {
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    const dbAddress = {
      ...address,
      user_id: user.id,
      address_line1: address.address,
      postal_code: address.zipcode,
    };
    delete (dbAddress as any).address;
    delete (dbAddress as any).zipcode;

    const { data, error } = await supabase
      .from("user_addresses")
      .insert(dbAddress)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      address: data.address_line1,
      zipcode: data.postal_code,
    } as unknown as AddressType;
  },

  async updateAddress(id: string, updates: Partial<AddressType>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to update an address");

    if (updates.is_default) {
      await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
    }

    const dbUpdates = { ...updates } as any;
    if (updates.address) dbUpdates.address_line1 = updates.address;
    if (updates.zipcode) dbUpdates.postal_code = updates.zipcode;
    delete dbUpdates.address;
    delete dbUpdates.zipcode;

    const { data, error } = await supabase
      .from("user_addresses")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      address: data.address_line1,
      zipcode: data.postal_code,
    } as unknown as AddressType;
  },

  async deleteAddress(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to delete an address");

    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  },
};
