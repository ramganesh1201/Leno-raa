import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: (userId?: string) => [...notificationKeys.all, "list", userId] as const,
};

let notificationChannel: ReturnType<typeof supabase.channel> | null = null;
let notificationSubscribers = 0;

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: notificationKeys.lists(user?.id),
    queryFn: () => notificationsService.getNotifications(),
    enabled: !!user,
  });

  const notifications = query.data || [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Realtime subscription
  useEffect(() => {
    if (!user || !user.id) return;

    if (notificationSubscribers === 0) {
      notificationChannel = supabase.channel(`notifications_${user.id}`);
      notificationChannel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.lists(user.id) });
          },
        )
        .subscribe();
    }

    notificationSubscribers++;

    return () => {
      notificationSubscribers--;
      if (notificationSubscribers === 0 && notificationChannel) {
        supabase.removeChannel(notificationChannel);
        notificationChannel = null;
      }
    };
  }, [user?.id, queryClient]);

  const markAsRead = useMutation({
    mutationFn: (notificationId?: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists(user?.id) });
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading: query.isLoading,
    markAsRead,
  };
}
