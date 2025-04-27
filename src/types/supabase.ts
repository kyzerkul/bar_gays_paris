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
      bars: {
        Row: {
          id: number
          name: string
          slug: string
          site?: string
          subtypes?: string
          category?: string
          type?: string
          phone?: string
          full_address?: string
          street?: string
          postal_code?: string
          latitude?: number
          longitude?: number
          h3?: string
          rating?: number
          reviews?: number
          reviews_link?: string
          photos_count?: number
          photo?: string
          street_view?: string
          working_hours?: string
          other_hours?: string
          business_status?: string
          about?: string
          range?: string
          logo?: string
          description?: string
          reservation_links?: string
          booking_appointment_link?: string
          order_links?: string
          location_link?: string
          location_reviews_link?: string
          reviews_id?: string
          email_1?: string
          phone_1?: string
          facebook?: string
          instagram?: string
          tiktok?: string
          twitter?: string
          created_at?: string
          updated_at?: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          site?: string
          subtypes?: string
          category?: string
          type?: string
          phone?: string
          full_address?: string
          street?: string
          postal_code?: string
          latitude?: number
          longitude?: number
          h3?: string
          rating?: number
          reviews?: number
          reviews_link?: string
          photos_count?: number
          photo?: string
          street_view?: string
          working_hours?: string
          other_hours?: string
          business_status?: string
          about?: string
          range?: string
          logo?: string
          description?: string
          reservation_links?: string
          booking_appointment_link?: string
          order_links?: string
          location_link?: string
          location_reviews_link?: string
          reviews_id?: string
          email_1?: string
          phone_1?: string
          facebook?: string
          instagram?: string
          tiktok?: string
          twitter?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          site?: string
          subtypes?: string
          category?: string
          type?: string
          phone?: string
          full_address?: string
          street?: string
          postal_code?: string
          latitude?: number
          longitude?: number
          h3?: string
          rating?: number
          reviews?: number
          reviews_link?: string
          photos_count?: number
          photo?: string
          street_view?: string
          working_hours?: string
          other_hours?: string
          business_status?: string
          about?: string
          range?: string
          logo?: string
          description?: string
          reservation_links?: string
          booking_appointment_link?: string
          order_links?: string
          location_link?: string
          location_reviews_link?: string
          reviews_id?: string
          email_1?: string
          phone_1?: string
          facebook?: string
          instagram?: string
          tiktok?: string
          twitter?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Types pour notre application
export type Bar = Database['public']['Tables']['bars']['Row']
export type BarsList = Bar[]

export type Quartier = {
  id: string
  name: string
}

export type BarType = {
  id: string
  name: string
}

export type FilterParams = {
  quartier?: string
  type?: string
}
