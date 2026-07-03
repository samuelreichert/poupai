export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          risk_profile: 'conservative' | 'moderate' | 'aggressive' | null;
          onboarding_completed_at: string | null;
          macro_allocation_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          risk_profile?: 'conservative' | 'moderate' | 'aggressive' | null;
          onboarding_completed_at?: string | null;
          macro_allocation_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          risk_profile?: 'conservative' | 'moderate' | 'aggressive' | null;
          onboarding_completed_at?: string | null;
          macro_allocation_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          target_value: number;
          status: 'open' | 'reached' | 'archived';
          reached_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          target_value: number;
          status?: 'open' | 'reached' | 'archived';
          reached_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          target_value?: number;
          status?: 'open' | 'reached' | 'archived';
          reached_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      macros: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          kind: 'stocks' | 'fiis' | 'etf_exterior' | 'tesouro' | 'renda_fixa' | 'cripto' | 'custom';
          ideal_percent: number;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          kind: 'stocks' | 'fiis' | 'etf_exterior' | 'tesouro' | 'renda_fixa' | 'cripto' | 'custom';
          ideal_percent: number;
          display_order: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          kind?: 'stocks' | 'fiis' | 'etf_exterior' | 'tesouro' | 'renda_fixa' | 'cripto' | 'custom';
          ideal_percent?: number;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          macro_id: string;
          symbol: string | null;
          name: string;
          weight: number | null;
          manual_current_value: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          macro_id: string;
          symbol?: string | null;
          name: string;
          weight?: number | null;
          manual_current_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          macro_id?: string;
          symbol?: string | null;
          name?: string;
          weight?: number | null;
          manual_current_value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      v_macro_position: {
        Row: {
          macro_id: string;
          user_id: string;
          name: string;
          kind: 'stocks' | 'fiis' | 'etf_exterior' | 'tesouro' | 'renda_fixa' | 'cripto' | 'custom';
          ideal_percent: number;
          display_order: number;
          current_value: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      save_macro_mvp_plan: {
        Args: {
          p_investment_goal: number;
          p_risk_profile: 'conservative' | 'moderate' | 'aggressive' | null;
          p_macros: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
