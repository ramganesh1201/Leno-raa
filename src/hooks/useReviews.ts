import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

export function useReviews(productId: string) {
  const queryClient = useQueryClient();

  // Fetch approved reviews
  const reviewsQuery = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    }
  });

  // Submit new review
  const submitReview = useMutation({
    mutationFn: async (reviewData: { rating: number; comment: string; userId: string }) => {
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        status: 'pending' // Default status
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate to fetch fresh (if any logic changes) but usually pending reviews won't show
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
    }
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    submitReview
  };
}

export function useAdminReviews() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin_reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (full_name, email),
          products (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    }
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_reviews'] });
    }
  });

  return {
    reviews,
    isLoading,
    updateReviewStatus,
    deleteReview
  };
}
