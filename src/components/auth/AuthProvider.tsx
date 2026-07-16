import { useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys, useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "@tanstack/react-router";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading: isProfileLoading, error: profileError } = useProfile();

  const isGlobalLoading = isAuthLoading || (!!user && isProfileLoading);

  useEffect(() => {
    if (profileError) {
      console.error("AuthProvider encountered profile load error:", profileError);
    }
  }, [profileError]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        queryClient.setQueryData(authKeys.user(), session?.user ?? null);
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

  // Global Route Guard
  useEffect(() => {
    if (!isGlobalLoading) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.startsWith("/auth");

      if (user && profile) {
        if (profile.role === "admin" && !currentPath.startsWith("/admin")) {
          if (!isAuthPage) {
            router.navigate({ to: "/admin" });
          }
        }

        if (profile.role !== "admin" && currentPath.startsWith("/admin")) {
          router.navigate({ to: "/" });
        }
      } else if (!user || profileError) {
        // If they are on an admin page without a valid user or profile
        if (currentPath.startsWith("/admin")) {
          router.navigate({ to: "/" });
        }
      }
    }
  }, [user, profile, profileError, isGlobalLoading, router]);

  const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
  const isProtected = currentPath.startsWith("/admin") || currentPath.startsWith("/account");

  if (isGlobalLoading && isProtected) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--background)]">
        <div className="h-6 w-6 rounded-full border border-[color:var(--gold)]/30 border-t-[color:var(--gold)] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
