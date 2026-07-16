import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useShop } from "@/lib/store";

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        return await authService.getUser();
      } catch (err) {
        return null;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const signIn = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      authService.signIn(credentials.email, credentials.password),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });

  const signUp = useMutation({
    mutationFn: (credentials: { email: string; password: string; fullName: string }) =>
      authService.signUp(credentials.email, credentials.password, credentials.fullName),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });

  const signOut = useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear React Query cache entirely
      queryClient.removeQueries();
      queryClient.clear();

      // Clear local guest cache to prevent leak
      useShop.getState().clearAll();

      // Force redirect to clean state
      window.location.href = "/";
    },
  });

  const resendVerification = useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  });

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resendVerification,
  };
}
