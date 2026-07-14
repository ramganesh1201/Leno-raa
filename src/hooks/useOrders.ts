import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services/orders.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { cartKeys } from "./useCart";

export const ordersKeys = {
  all: ["orders"] as const,
  lists: (userId?: string) => [...ordersKeys.all, "list", userId] as const,
  admin: ["adminOrders"] as const,
  adminPayments: ["adminPayments"] as const,
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
    mutationFn: (params: { 
      shippingDetails: { full_name: string; phone: string; address: string; city: string; state: string; pincode: string };
      subtotal: number; 
      shipping_cost: number; 
      tax?: number; 
      discount?: number 
    }) => ordersService.createOrder(params.shippingDetails, params.subtotal, params.shipping_cost, params.tax, params.discount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists(user?.id) });
      // cart is cleared in service, invalidate cart too
      queryClient.invalidateQueries({ queryKey: cartKeys.lists(user?.id) });
    },
  });

  const uploadProof = useMutation({
    mutationFn: (params: { orderId: string; utrNumber: string; file: File }) =>
      ordersService.uploadPaymentProof(params.orderId, params.utrNumber, params.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists(user?.id) });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
    uploadProof,
  };
}

export function useAdminOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ordersKeys.admin,
    queryFn: () => ordersService.getAdminOrders(),
  });

  const verifyPayment = useMutation({
    mutationFn: (params: { orderId: string; proofId: string; isApproved: boolean; rejectionReason?: string }) =>
      ordersService.verifyPayment(params.orderId, params.proofId, params.isApproved, params.rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.admin });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: (params: { orderId: string; status: string; notes?: string; courier?: string; tracking?: string }) =>
      ordersService.updateOrderStatus(params.orderId, params.status, params.notes, params.courier, params.tracking),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.admin });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });

  return {
    orders,
    isLoading,
    isError,
    error,
    verifyPayment,
    updateStatus,
  };
}

export function useAdminPayments() {
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, isError, error } = useQuery({
    queryKey: ordersKeys.adminPayments,
    queryFn: () => ordersService.getAdminPayments(),
  });

  const verifyPayment = useMutation({
    mutationFn: (params: { orderId: string; proofId: string; isApproved: boolean; rejectionReason?: string }) =>
      ordersService.verifyPayment(params.orderId, params.proofId, params.isApproved, params.rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ordersKeys.adminPayments });
      queryClient.invalidateQueries({ queryKey: ordersKeys.admin });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
  });

  return {
    payments,
    isLoading,
    isError,
    error,
    verifyPayment,
  };
}
