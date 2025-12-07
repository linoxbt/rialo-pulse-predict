export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      market_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          market_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          market_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          market_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_comments_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      market_outcomes: {
        Row: {
          created_at: string
          id: string
          market_id: string
          name: string
          price: number
          total_shares: number
        }
        Insert: {
          created_at?: string
          id?: string
          market_id: string
          name: string
          price?: number
          total_shares?: number
        }
        Update: {
          created_at?: string
          id?: string
          market_id?: string
          name?: string
          price?: number
          total_shares?: number
        }
        Relationships: [
          {
            foreignKeyName: "market_outcomes_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
        ]
      }
      markets: {
        Row: {
          category_id: string | null
          created_at: string
          creator_id: string
          description: string
          end_date: string
          id: string
          image_url: string | null
          liquidity: number
          resolution_source: string
          resolved_outcome: string | null
          status: string
          title: string
          total_volume: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          creator_id: string
          description: string
          end_date: string
          id?: string
          image_url?: string | null
          liquidity?: number
          resolution_source: string
          resolved_outcome?: string | null
          status?: string
          title: string
          total_volume?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          creator_id?: string
          description?: string
          end_date?: string
          id?: string
          image_url?: string | null
          liquidity?: number
          resolution_source?: string
          resolved_outcome?: string | null
          status?: string
          title?: string
          total_volume?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "markets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          avg_price: number
          created_at: string
          current_value: number
          id: string
          market_id: string
          outcome_id: string
          shares: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_price: number
          created_at?: string
          current_value?: number
          id?: string
          market_id: string
          outcome_id: string
          shares: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_price?: number
          created_at?: string
          current_value?: number
          id?: string
          market_id?: string
          outcome_id?: string
          shares?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "market_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          id: string
          outcome_id: string
          price: number
          timestamp: string
        }
        Insert: {
          id?: string
          outcome_id: string
          price: number
          timestamp?: string
        }
        Update: {
          id?: string
          outcome_id?: string
          price?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_history_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "market_outcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          total_profit: number
          total_trades: number
          total_volume: number
          updated_at: string
          username: string | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          total_profit?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          total_profit?: number
          total_trades?: number
          total_volume?: number
          updated_at?: string
          username?: string | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      trades: {
        Row: {
          amount: number
          created_at: string
          id: string
          market_id: string
          outcome_id: string
          price: number
          shares: number
          side: string
          status: string
          tx_hash: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          market_id: string
          outcome_id: string
          price: number
          shares: number
          side: string
          status?: string
          tx_hash?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          market_id?: string
          outcome_id?: string
          price?: number
          shares?: number
          side?: string
          status?: string
          tx_hash?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_market_id_fkey"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "markets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_outcome_id_fkey"
            columns: ["outcome_id"]
            isOneToOne: false
            referencedRelation: "market_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
