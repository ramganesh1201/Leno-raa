import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlist.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const wishlistKeys = {
  all: ["wishlist"] as const,
  lists: (userId?: string) => [...wishlistKeys.all, "list", userId] as const,
};

let wishlistChannel: ReturnType<typeof supabase.channel> | null = null;
let wishlistSubscribers = 0;

export function useWishlist() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: wishlistKeys.lists(user?.id),
    queryFn: () => wishlistService.getWishlist(),
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user || !user.id) return;
    
    if (wishlistSubscribers === 0) {
      wishlistChannel = supabase.channel(`wishlist_${user.id}`);
      wishlistChannel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "wishlist",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: wishlistKeys.lists(user.id) });
          }
        )
        .subscribe();
    }
    
    wishlistSubscribers++;

    return () => {
      wishlistSubscribers--;
      if (wishlistSubscribers === 0 && wishlistChannel) {
        supabase.removeChannel(wishlistChannel);
        wishlistChannel = null;
      }
    };
  }, [user?.id, queryClient]);

  const toggleWishlist = useMutation({
    mutationFn: (productId: string) => wishlistService.toggleWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.lists(user?.id) });
      if (data.added) {
        toast.success("Saved to Wishlist");
      } else {
        toast.success("Removed from Wishlist");
      }
    },
  });

  return {
    wishlist,
    isLoading,
    toggleWishlist,
  };
}
