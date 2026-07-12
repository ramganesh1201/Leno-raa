import { useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys, useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoading } = useAuth();

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

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[color:var(--background)]"
          >
            <div className="h-6 w-6 rounded-full border border-[color:var(--gold)]/30 border-t-[color:var(--gold)] animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
      {!isLoading && children}
    </>
  );
}
