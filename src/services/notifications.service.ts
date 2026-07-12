import { supabase } from "@/lib/supabase";

export interface NotificationType {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsService = {
  async getNotifications() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as NotificationType[];
  },

  async markAsRead(notificationId?: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Must be logged in");

    let query = supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id);
    
    if (notificationId) {
      query = query.eq("id", notificationId);
    } else {
      // Mark all as read
      query = query.eq("is_read", false);
    }

    const { error } = await query;
    if (error) throw error;
  }
};
