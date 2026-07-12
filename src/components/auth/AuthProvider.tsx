import { useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        queryClient.setQueryData(authKeys.user(), session?.user ?? null);
        
        // Redirect verified users away from auth pages
        const currentPath = window.location.pathname;
        if (event === "SIGNED_IN" && session?.user && currentPath.startsWith("/auth/")) {
          router.navigate({ to: "/account" });
        }
      } else if (event === "SIGNED_OUT") {
        queryClient.setQueryData(authKeys.user(), null);
        // Clear all queries (like profile, cart, wishlist, etc.)
        queryClient.clear();
        router.navigate({ to: "/" });
      } else if (event === "PASSWORD_RECOVERY") {
        router.navigate({ to: "/auth/update-password" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  return <>{children}</>;
}
