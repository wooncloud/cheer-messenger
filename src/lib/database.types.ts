export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          owner_id: string
          invite_code: string
          max_members: number
          praise_cooldown_value: number
          praise_cooldown_unit: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          owner_id: string
          invite_code: string
          max_members?: number
          praise_cooldown_value?: number
          praise_cooldown_unit?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          owner_id?: string
          invite_code?: string
          max_members?: number
          praise_cooldown_value?: number
          praise_cooldown_unit?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
          left_at: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: string
          joined_at?: string
          left_at?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
          left_at?: string | null
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      praise_messages: {
        Row: {
          id: string
          group_id: string
          sender_id: string
          receiver_id: string
          emoji: string
          message: string | null
          is_public: boolean
          is_anonymous: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          sender_id: string
          receiver_id: string
          emoji?: string
          message?: string | null
          is_public?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          sender_id?: string
          receiver_id?: string
          emoji?: string
          message?: string | null
          is_public?: boolean
          is_anonymous?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "praise_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praise_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praise_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      praise_cooldowns: {
        Row: {
          id: string
          group_id: string
          sender_id: string
          receiver_id: string
          last_praised_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          sender_id: string
          receiver_id: string
          last_praised_at: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          sender_id?: string
          receiver_id?: string
          last_praised_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "praise_cooldowns_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praise_cooldowns_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "praise_cooldowns_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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