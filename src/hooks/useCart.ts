import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, CartItemType } from "@/services/cart.service";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { productService } from "@/services/product.service";

export const cartKeys = {
  all: ["cart"] as const,
  lists: (userId?: string) => [...cartKeys.all, "list", userId] as const,
};

let cartChannel: ReturnType<typeof supabase.channel> | null = null;
let cartSubscribers = 0;

export function useCart() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const query = useQuery({
    queryKey: cartKeys.lists(user?.id),
    queryFn: () => cartService.getCart(),
    enabled: !!user,
  });

  const cart = query.data || [];
  const isLoading = query.isLoading;

  // Realtime subscription
  useEffect(() => {
    if (!user || !user.id) return;

    if (cartSubscribers === 0) {
      cartChannel = supabase.channel(`cart_items_${user.id}`);
      cartChannel
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "cart_items",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: cartKeys.lists(user.id) });
          },
        )
        .subscribe();
    }

    cartSubscribers++;

    return () => {
      cartSubscribers--;
      if (cartSubscribers === 0 && cartChannel) {
        supabase.removeChannel(cartChannel);
        cartChannel = null;
      }
    };
  }, [user?.id, queryClient]);

  const addToCart = useMutation({
    mutationFn: (params: {
      productId: string | null;
      quantity?: number;
      customizationId?: string | null;
    }) => cartService.addToCart(params.productId, params.quantity, params.customizationId),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists(user?.id) });
      const previousCart = queryClient.getQueryData<CartItemType[]>(cartKeys.lists(user?.id));

      // Optimistically update
      if (previousCart) {
        // Find product from catalog to prevent UI flash
        let mockProduct = null;
        if (newItem.productId) {
          mockProduct = await productService.getProductById(newItem.productId);
        }

        queryClient.setQueryData<CartItemType[]>(cartKeys.lists(user?.id), [
          ...previousCart,
          {
            id: Math.random().toString(),
            user_id: user?.id || "",
            product_id: newItem.productId || "",
            customization_id: newItem.customizationId || undefined,
            quantity: newItem.quantity || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: mockProduct || undefined,
            customization: newItem.customizationId
              ? { estimated_price: 480, preview_image: null }
              : undefined,
          },
        ]);
      }
      return { previousCart };
    },
    onError: (err, newItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(user?.id), context.previousCart);
      }
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists(user?.id) });
      if (!error) {
        toast.success("Added to Bag");
      }
    },
  });

  const updateQuantity = useMutation({
    mutationFn: (params: { id: string; quantity: number }) =>
      cartService.updateQuantity(params.id, params.quantity),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists(user?.id) });
      const previousCart = queryClient.getQueryData<CartItemType[]>(cartKeys.lists(user?.id));
      if (previousCart) {
        queryClient.setQueryData<CartItemType[]>(
          cartKeys.lists(user?.id),
          previousCart.map((item) => (item.id === id ? { ...item, quantity } : item)),
        );
      }
      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(user?.id), context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists(user?.id) });
    },
  });

  const removeFromCart = useMutation({
    mutationFn: (id: string) => cartService.removeFromCart(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cartKeys.lists(user?.id) });
      const previousCart = queryClient.getQueryData<CartItemType[]>(cartKeys.lists(user?.id));
      if (previousCart) {
        queryClient.setQueryData<CartItemType[]>(
          cartKeys.lists(user?.id),
          previousCart.filter((item) => item.id !== id),
        );
      }
      return { previousCart };
    },
    onError: (err, id, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(cartKeys.lists(user?.id), context.previousCart);
      }
    },
    onSettled: (data, error) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists(user?.id) });
      if (!error) {
        toast.success("Removed from Bag");
      }
    },
  });

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeFromCart,
  };
}
