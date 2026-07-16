import { supabase } from "@/lib/supabase";

export interface PreferencesType {
  id: string;
  theme: string;
  language: string;
  marketing_emails: boolean;
  notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const preferencesService = {
  async getPreferences() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error in getPreferences:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }

    if (!data) {
      const newPrefs = {
        id: user.id,
        theme: "system",
        language: "en",
        marketing_emails: false,
        notifications: true,
      };
      const { data: createdData, error: createError } = await supabase
        .from("user_preferences")
        .insert(newPrefs)
        .select()
        .single();
      if (createError) throw createError;
      return createdData as PreferencesType;
    }

    return data as PreferencesType;
  },

  async updatePreferences(updates: Partial<PreferencesType>) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in to update preferences");

    const { data, error } = await supabase
      .from("user_preferences")
      .update(updates)
      .eq("id", user.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase Error in updatePreferences:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      throw error;
    }
    if (!data) throw new Error("Preferences not found to update");
    return data as PreferencesType;
  },
};
