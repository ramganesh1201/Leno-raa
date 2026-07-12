export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          image: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          image?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          image?: string | null
          description?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          description: string | null
          price: number
          discount_price: number | null
          category_id: string | null
          stock: number
          status: 'active' | 'draft' | 'archived'
          featured: boolean
          new_arrival: boolean
          rating: number
          review_count: number
          seo_metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          price: number
          discount_price?: number | null
          category_id?: string | null
          stock?: number
          status?: 'active' | 'draft' | 'archived'
          featured?: boolean
          new_arrival?: boolean
          rating?: number
          review_count?: number
          seo_metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          price?: number
          discount_price?: number | null
          category_id?: string | null
          stock?: number
          status?: 'active' | 'draft' | 'archived'
          featured?: boolean
          new_arrival?: boolean
          rating?: number
          review_count?: number
          seo_metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          customization_id: string | null
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          customization_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string | null
          customization_id?: string | null
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      soap_customizations: {
        Row: {
          id: string
          user_id: string
          base_soap: string
          color: string
          shape: string
          size: string
          fragrance: string
          essential_oils: string[]
          ingredients: string[]
          packaging: string
          ribbon: string | null
          message: string | null
          gift_wrap: boolean
          quantity: number
          preview_image: string | null
          calculated_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          base_soap: string
          color: string
          shape: string
          size: string
          fragrance: string
          essential_oils?: string[]
          ingredients?: string[]
          packaging: string
          ribbon?: string | null
          message?: string | null
          gift_wrap?: boolean
          quantity?: number
          preview_image?: string | null
          calculated_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          base_soap?: string
          color?: string
          shape?: string
          size?: string
          fragrance?: string
          essential_oils?: string[]
          ingredients?: string[]
          packaging?: string
          ribbon?: string | null
          message?: string | null
          gift_wrap?: boolean
          quantity?: number
          preview_image?: string | null
          calculated_price?: number
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          type: string
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          type?: string
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          is_read?: boolean
          type?: string
          action_url?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          address_id: string | null
          subtotal: number
          shipping: number
          discount: number
          tax: number
          total: number
          payment_method: string
          payment_status: string
          order_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          address_id?: string | null
          subtotal: number
          shipping: number
          discount?: number
          tax?: number
          total: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          address_id?: string | null
          subtotal?: number
          shipping?: number
          discount?: number
          tax?: number
          total?: number
          payment_method?: string
          payment_status?: string
          order_status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
