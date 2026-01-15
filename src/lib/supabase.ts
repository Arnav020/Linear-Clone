
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

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
          created_at: string
          email: string
          name: string
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          key: string
          color: string | null
          icon: string | null
          status: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          key: string
          color?: string | null
          icon?: string | null
          status?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          key?: string
          color?: string | null
          icon?: string | null
          status?: string | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      project_members: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string | null
          joined_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      issues: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          status: string | null
          priority: string | null
          project_id: string | null
          assignee_id: string | null
          assignee_name: string | null
          canceled_at: string | null
          duplicate_of: string | null
          due_date: string | null
          labels: string[] | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          canceled_at?: string | null
          duplicate_of?: string | null
          due_date?: string | null
          labels?: string[] | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          status?: string | null
          priority?: string | null
          project_id?: string | null
          assignee_id?: string | null
          assignee_name?: string | null
          canceled_at?: string | null
          duplicate_of?: string | null
          due_date?: string | null
          labels?: string[] | null
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issues_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issues_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      project_stats: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          key: string
          color: string | null
          icon: string | null
          status: string | null
          created_by: string | null
          member_count: number
          issue_count: number
          completed_issues: number
        }
        Relationships: []
      }
    }
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}



export const createClient = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. Please verify your .env.local file.')
  }

  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}
