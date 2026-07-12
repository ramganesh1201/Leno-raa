import { supabase } from "@/lib/supabase";

export interface CustomizationType {
  id: string;
  user_id: string;
  soap_base: string;
  shape: string;
  size: string;
  color: string;
  fragrance: string;
  essential_oils: string[];
  ingredients: string[];
  packaging: string;
  engraving_text: string | null;
  gift_wrap: boolean;
  preview_image: string | null;
  notes: string | null;
  estimated_price: number;
  created_at: string;
  updated_at: string;
}

export const customizationService = {
  async getCustomizations() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("soap_customizations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as CustomizationType[];
  },

  async addCustomization(customization: Omit<CustomizationType, "id" | "user_id" | "created_at" | "updated_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to save a design");

    const { data, error } = await supabase
      .from("soap_customizations")
      .insert({ ...customization, user_id: user.id })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCustomization(id: string, updates: Partial<CustomizationType>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to update a design");

    const { data, error } = await supabase
      .from("soap_customizations")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomization(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to delete a design");

    const { error } = await supabase
      .from("soap_customizations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
  }
};
