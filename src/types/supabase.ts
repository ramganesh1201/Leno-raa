export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          image: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          image?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          image?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          discount_price: number | null;
          category_id: string | null;
          stock: number;
          status: "active" | "draft" | "archived";
          featured: boolean;
          new_arrival: boolean;
          rating: number;
          review_count: number;
          seo_metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          discount_price?: number | null;
          category_id?: string | null;
          stock?: number;
          status?: "active" | "draft" | "archived";
          featured?: boolean;
          new_arrival?: boolean;
          rating?: number;
          review_count?: number;
          seo_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          discount_price?: number | null;
          category_id?: string | null;
          stock?: number;
          status?: "active" | "draft" | "archived";
          featured?: boolean;
          new_arrival?: boolean;
          rating?: number;
          review_count?: number;
          seo_metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          customization_id: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string | null;
          customization_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string | null;
          customization_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      wishlist: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      soap_customizations: {
        Row: {
          id: string;
          user_id: string;
          base_soap: string;
          color: string;
          shape: string;
          size: string;
          fragrance: string;
          essential_oils: string[];
          ingredients: string[];
          packaging: string;
          ribbon: string | null;
          message: string | null;
          gift_wrap: boolean;
          quantity: number;
          preview_image: string | null;
          calculated_price: number;
          skin_type: string | null;
          core_active: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          base_soap: string;
          color: string;
          shape: string;
          size: string;
          fragrance: string;
          essential_oils?: string[];
          ingredients?: string[];
          packaging: string;
          ribbon?: string | null;
          message?: string | null;
          gift_wrap?: boolean;
          quantity?: number;
          preview_image?: string | null;
          calculated_price: number;
          skin_type?: string | null;
          core_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          base_soap?: string;
          color?: string;
          shape?: string;
          size?: string;
          fragrance?: string;
          essential_oils?: string[];
          ingredients?: string[];
          packaging?: string;
          ribbon?: string | null;
          message?: string | null;
          gift_wrap?: boolean;
          quantity?: number;
          preview_image?: string | null;
          calculated_price?: number;
          skin_type?: string | null;
          core_active?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          type: string;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
          type?: string;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          type?: string;
          action_url?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string;
          address_id: string | null;
          subtotal: number;
          shipping_cost: number;
          discount: number;
          tax: number;
          total: number;
          payment_method: string;
          payment_status: string;
          order_status: string;
          courier_name: string | null;
          tracking_number: string | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id: string;
          address_id?: string | null;
          subtotal: number;
          shipping_cost: number;
          discount?: number;
          tax?: number;
          total: number;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          courier_name?: string | null;
          tracking_number?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          user_id?: string;
          address_id?: string | null;
          subtotal?: number;
          shipping_cost?: number;
          discount?: number;
          tax?: number;
          total?: number;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          courier_name?: string | null;
          tracking_number?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      shipping_addresses: {
        Row: {
          id: string;
          order_id: string;
          full_name: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          pincode: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          full_name: string;
          phone: string;
          address: string;
          city: string;
          state: string;
          pincode: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          full_name?: string;
          phone?: string;
          address?: string;
          city?: string;
          state?: string;
          pincode?: string;
          created_at?: string;
        };
      };
      payment_proofs: {
        Row: {
          id: string;
          order_id: string;
          screenshot_url: string;
          utr_number: string;
          uploaded_at: string;
          verification_status: "pending" | "verified" | "rejected";
          verified_at: string | null;
          verified_by: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          screenshot_url: string;
          utr_number: string;
          uploaded_at?: string;
          verification_status?: "pending" | "verified" | "rejected";
          verified_at?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          screenshot_url?: string;
          utr_number?: string;
          uploaded_at?: string;
          verification_status?: "pending" | "verified" | "rejected";
          verified_at?: string | null;
          verified_by?: string | null;
          rejection_reason?: string | null;
        };
      };
      site_settings: {
        Row: {
          id: string;
          merchant_name: string;
          upi_id: string;
          upi_qr_url: string | null;
          support_phone: string | null;
          support_email: string | null;
          shipping_charge: number;
          free_shipping_threshold: number | null;
          logo_url: string | null;
          favicon_url: string | null;
          return_policy: string | null;
          privacy_policy: string | null;
          terms_of_service: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          whatsapp_url: string | null;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          merchant_name: string;
          upi_id: string;
          upi_qr_url?: string | null;
          support_phone?: string | null;
          support_email?: string | null;
          shipping_charge?: number;
          free_shipping_threshold?: number | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          return_policy?: string | null;
          privacy_policy?: string | null;
          terms_of_service?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          whatsapp_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          merchant_name?: string;
          upi_id?: string;
          upi_qr_url?: string | null;
          support_phone?: string | null;
          support_email?: string | null;
          shipping_charge?: number;
          free_shipping_threshold?: number | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          return_policy?: string | null;
          privacy_policy?: string | null;
          terms_of_service?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          whatsapp_url?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_value: number;
          max_discount: number | null;
          usage_limit: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: "percentage" | "fixed";
          discount_value: number;
          min_order_value?: number;
          max_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: "percentage" | "fixed";
          discount_value?: number;
          min_order_value?: number;
          max_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      product_collections: {
        Row: {
          collection_id: string;
          product_id: string;
        };
        Insert: {
          collection_id: string;
          product_id: string;
        };
        Update: {
          collection_id?: string;
          product_id?: string;
        };
      };
    };
  };
}
