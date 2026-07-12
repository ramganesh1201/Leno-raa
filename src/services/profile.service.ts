import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(user: any): Promise<UserProfile | null> {
    if (!user || !user.id) return null;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found: The database trigger might have failed or the user existed before it.
        // Auto-recover by creating the profile row now.
        const newProfile = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        };
        
        const { data: createdData, error: createError } = await supabase
          .from("profiles")
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) throw createError;
        return createdData;
      }
      throw error;
    }
    
    return data;
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
