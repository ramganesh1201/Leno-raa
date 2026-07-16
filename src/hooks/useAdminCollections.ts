import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAdminCollections() {
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["admin_collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select(
          `
          *,
          product_collections (count)
        `,
        )
        .order("name");

      if (error) throw error;
      return data.map((c: any) => ({
        ...c,
        productsCount: c.product_collections[0]?.count || 0,
      }));
    },
  });

  const createCollection = useMutation({
    mutationFn: async (coll: { name: string; slug: string; featured: boolean }) => {
      const { error } = await supabase.from("collections").insert(coll);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_collections"] }),
  });

  const updateCollection = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase.from("collections").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_collections"] }),
  });

  const deleteCollection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin_collections"] }),
  });

  return { collections, isLoading, createCollection, updateCollection, deleteCollection };
}
