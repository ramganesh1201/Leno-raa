import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  review_text: string | null;
  review_images: string[];
  status: "pending" | "approved" | "rejected";
  verified_purchase: boolean;
  helpful_count: number;
  admin_notes: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  } | null;
}

export function useReviews(productId: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch approved reviews + current user's pending reviews
  const reviewsQuery = useQuery({
    queryKey: ["reviews", productId, user?.id],
    queryFn: async () => {
      const [approvedRes, pendingRes] = await Promise.all([
        supabase
          .from("reviews")
          .select(`*, profiles(full_name, email)`)
          .eq("product_id", productId)
          .eq("status", "approved"),
        user?.id
          ? supabase
              .from("reviews")
              .select(`*, profiles(full_name, email)`)
              .eq("product_id", productId)
              .eq("status", "pending")
              .eq("user_id", user.id)
          : Promise.resolve({ data: [] }),
      ]);

      if (approvedRes.error) throw approvedRes.error;
      if (pendingRes.error) throw pendingRes.error;

      const merged = [...(approvedRes.data || []), ...(pendingRes.data || [])] as Review[];
      // Sort descending by created_at
      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return merged;
    },
  });

  // Submit new review
  const submitReview = useMutation({
    mutationFn: async (reviewData: { 
      rating: number; 
      title: string;
      review_text: string; 
      userId: string;
      is_anonymous: boolean;
      images: File[];
    }) => {
      const imageUrls: string[] = [];
      
      // Upload images if any
      for (const file of reviewData.images) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${reviewData.userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("review_images")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("review_images")
            .getPublicUrl(filePath);
          imageUrls.push(publicUrl);
        }
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: reviewData.userId,
        rating: reviewData.rating,
        title: reviewData.title,
        review_text: reviewData.review_text,
        review_images: imageUrls,
        is_anonymous: reviewData.is_anonymous,
        status: "pending", // Default status
      });
      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate to fetch fresh (if any logic changes) but usually pending reviews won't show
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });

  // Edit existing review
  const editReview = useMutation({
    mutationFn: async (reviewData: {
      id: string;
      rating: number;
      title: string;
      review_text: string;
      userId: string;
      is_anonymous: boolean;
      existing_images: string[];
      new_images: File[];
    }) => {
      const uploadedUrls: string[] = [];
      
      // Upload new images if any
      for (const file of reviewData.new_images) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${reviewData.userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("review_images")
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from("review_images")
            .getPublicUrl(filePath);
          uploadedUrls.push(publicUrl);
        }
      }

      const finalImages = [...reviewData.existing_images, ...uploadedUrls];

      const { error } = await supabase.from("reviews").update({
        rating: reviewData.rating,
        title: reviewData.title,
        review_text: reviewData.review_text,
        review_images: finalImages,
        is_anonymous: reviewData.is_anonymous,
        status: "pending", // Reset status to pending after edit
      }).eq("id", reviewData.id).eq("user_id", reviewData.userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });

  // Delete own review
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      if (!user?.id) throw new Error("Not logged in");
      
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId)
        .eq("user_id", user.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoading: reviewsQuery.isLoading,
    submitReview,
    editReview,
    deleteReview,
  };
}

export function useAdminReviews() {
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin_reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          *,
          profiles (full_name, email),
          products (name)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const updateReviewStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "approved" | "rejected" }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_reviews"] });
    },
  });

  return {
    reviews,
    isLoading,
    updateReviewStatus,
    deleteReview,
  };
}
