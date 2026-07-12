import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customizationService, CustomizationType } from "@/services/customization.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export const customizationKeys = {
  all: ["customizations"] as const,
  lists: () => [...customizationKeys.all, "list"] as const,
};

export function useCustomizations() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: customizationKeys.lists(),
    queryFn: () => customizationService.getCustomizations(),
    enabled: !!user,
  });

  const customizations = query.data || [];
  const isLoading = query.isLoading;

  useEffect(() => {
    if (!user || !user.id) return;
    
    const channelId = `customizations_${user.id}_${Math.random().toString(36).substring(7)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "soap_customizations",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const addCustomization = useMutation({
    mutationFn: (customization: Omit<CustomizationType, "id" | "user_id" | "created_at" | "updated_at">) =>
      customizationService.addCustomization(customization),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
    },
  });

  const updateCustomization = useMutation({
    mutationFn: (params: { id: string; updates: Partial<CustomizationType> }) =>
      customizationService.updateCustomization(params.id, params.updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
    },
  });

  const deleteCustomization = useMutation({
    mutationFn: (id: string) => customizationService.deleteCustomization(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customizationKeys.lists() });
    },
  });

  return {
    customizations,
    isLoading,
    addCustomization,
    updateCustomization,
    deleteCustomization,
  };
}
