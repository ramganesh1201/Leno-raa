import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60 * 1000,
        gcTime: 15 * 60 * 1000,
      },
    },
  });

  // Catalog: Long stale time (15 mins)
  queryClient.setQueryDefaults(["products"], { staleTime: 15 * 60 * 1000 });
  queryClient.setQueryDefaults(["reviews"], { staleTime: 15 * 60 * 1000 });

  // User Data: Medium stale time (2 mins)
  queryClient.setQueryDefaults(["auth"], { staleTime: 2 * 60 * 1000 });
  queryClient.setQueryDefaults(["profile"], { staleTime: 2 * 60 * 1000 });
  queryClient.setQueryDefaults(["preferences"], { staleTime: 2 * 60 * 1000 });

  // Dynamic Data: Short stale time (30s)
  queryClient.setQueryDefaults(["cart"], { staleTime: 30 * 1000 });
  queryClient.setQueryDefaults(["wishlist"], { staleTime: 30 * 1000 });

  // Strict freshness (0s)
  queryClient.setQueryDefaults(["orders"], { staleTime: 0 });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
