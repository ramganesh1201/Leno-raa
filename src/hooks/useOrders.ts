import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { cartKeys } from "./useCart";

export const ordersKeys = {
  all: ["orders"] as const,
  lists: (userId?: string) => [...ordersKeys.all, "list", userId] as const,
};

export function useOrders() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ordersKeys.lists(user?.id),
    queryFn: () => ordersService.getOrders(),
    enabled: !!user,
  });

  // Realtime subscription
  useEffect(() => {
    if (!user || !user.id) return;
    
    const channelId = `orders_${user.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ordersKeys.lists(user.id) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const createOrder = useMutation({
    mutationFn: (params: { addressId: string | null; subtotal: number; shipping: number; tax?: number; discount?: number }) =>
      ordersService.createOrder(params.addressId, params.subtotal, params.shipping, params.tax, params.discount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists(user?.id) });
      // cart is cleared in service, invalidate cart too
      queryClient.invalidateQueries({ queryKey: cartKeys.lists(user?.id) });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
  };
}
