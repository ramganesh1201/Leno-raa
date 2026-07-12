import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { preferencesService, PreferencesType } from "@/services/preferences.service";
import { useAuth } from "./useAuth";

export const preferencesKeys = {
  all: ["preferences"] as const,
  user: (userId: string) => [...preferencesKeys.all, userId] as const,
};

export function usePreferences() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: preferences, isLoading } = useQuery({
    queryKey: preferencesKeys.user(user?.id ?? ""),
    queryFn: () => preferencesService.getPreferences(),
    enabled: !!user,
  });

  const updatePreferences = useMutation({
    mutationFn: (updates: Partial<PreferencesType>) =>
      preferencesService.updatePreferences(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(preferencesKeys.user(user!.id), data);
    },
  });

  return {
    preferences,
    isLoading,
    updatePreferences,
  };
}
