import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService, AddressType } from "@/services/address.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export const addressKeys = {
  all: ["addresses"] as const,
  lists: (userId?: string) => [...addressKeys.all, "list", userId] as const,
};

export function useAddresses() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: addressKeys.lists(user?.id),
    queryFn: () => addressService.getAddresses(),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user || !user.id) return;

    const channelId = `addresses_${user.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_addresses",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: addressKeys.lists(user.id) });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const addAddress = useMutation({
    mutationFn: (address: Omit<AddressType, "id" | "user_id" | "created_at" | "updated_at">) =>
      addressService.addAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists(user?.id) });
    },
  });

  const updateAddress = useMutation({
    mutationFn: (params: { id: string; updates: Partial<AddressType> }) =>
      addressService.updateAddress(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists(user?.id) });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists(user?.id) });
    },
  });

  return {
    addresses,
    isLoading,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}
