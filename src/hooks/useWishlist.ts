import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlist.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  lists: () => [...wishlistKeys.all, "list"] as const,
};

export function useWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: wishlistKeys.lists(),
    queryFn: () => wishlistService.getWishlist(),
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user || !user.id) return;
    
    const channelId = `wishlist_${user.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlist",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const toggleWishlist = useMutation({
    mutationFn: (productId: string) => wishlistService.toggleWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists() });
    },
  });

  return {
    wishlist,
    isLoading,
    toggleWishlist,
  };
}
