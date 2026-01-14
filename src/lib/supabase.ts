
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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
      teams: {
        Row: {
          id: string
          created_at: string
          name: string
          identifier: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          identifier: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          identifier?: string
          description?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          team_id: string
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          team_id: string
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          team_id?: string
          status?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          status: string
          priority: string
          team_id: string
          project_id: string | null
          assignee_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          status?: string
          priority?: string
          team_id: string
          project_id?: string | null
          assignee_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          status?: string
          priority?: string
          team_id?: string
          project_id?: string | null
          assignee_id?: string | null
        }
        Relationships: []
      }
      labels: {
        Row: {
          id: string
          created_at: string
          name: string
          color: string
          team_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          color: string
          team_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          color?: string
          team_id?: string | null
        }
        Relationships: []
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

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Please verify your .env.local file.')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}
