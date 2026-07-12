import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService, UserProfile } from "@/services/profile.service";
import { useAuth } from "./useAuth";

export const profileKeys = {
  all: ["profile"] as const,
  user: (userId: string) => [...profileKeys.all, userId] as const,
};

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: profileKeys.user(user?.id ?? ""),
    queryFn: async () => {
      if (!user?.id) return null;
      return await profileService.getProfile(user);
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateProfile = useMutation({
    mutationFn: (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error("Must be logged in to update profile");
      return profileService.updateProfile(user.id, updates);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.user(user!.id), data);
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
