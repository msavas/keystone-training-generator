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
      users: {
        Row: {
          id: string
          email: string
          generations_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          generations_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          generations_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          topic: string
          level: string
          duration: number
          industry: string
          status: string
          slide_deck_url: string | null
          instructor_guide_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic: string
          level: string
          duration: number
          industry: string
          status?: string
          slide_deck_url?: string | null
          instructor_guide_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          topic?: string
          level?: string
          duration?: number
          industry?: string
          status?: string
          slide_deck_url?: string | null
          instructor_guide_url?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}