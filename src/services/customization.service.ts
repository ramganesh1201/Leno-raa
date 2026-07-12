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
    return data.map(item => ({
      ...item,
      engraving_text: item.message,
      estimated_price: item.calculated_price
    })) as unknown as CustomizationType[];
  },

  async addCustomization(customization: Omit<CustomizationType, "id" | "user_id" | "created_at" | "updated_at">) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to save a design");

    const dbItem = {
      ...customization,
      user_id: user.id,
      message: customization.engraving_text,
      calculated_price: customization.estimated_price
    };
    delete (dbItem as any).engraving_text;
    delete (dbItem as any).estimated_price;

    const { data, error } = await supabase
      .from("soap_customizations")
      .insert(dbItem)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      engraving_text: data.message,
      estimated_price: data.calculated_price
    } as unknown as CustomizationType;
  },

  async updateCustomization(id: string, updates: Partial<CustomizationType>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to update a design");

    const dbUpdates = { ...updates } as any;
    if (updates.engraving_text !== undefined) dbUpdates.message = updates.engraving_text;
    if (updates.estimated_price !== undefined) dbUpdates.calculated_price = updates.estimated_price;
    delete dbUpdates.engraving_text;
    delete dbUpdates.estimated_price;

    const { data, error } = await supabase
      .from("soap_customizations")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      engraving_text: data.message,
      estimated_price: data.calculated_price
    } as unknown as CustomizationType;
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
