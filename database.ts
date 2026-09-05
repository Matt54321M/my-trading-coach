export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
      };
      rules: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          updated_at?: string;
        };
      };
      patterns: {
        Row: {
          id: string;
          user_id: string;
          image_url: string | null;
          ai_description: string;
          classification: string;
          type: "good" | "failed" | "example";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url?: string | null;
          ai_description: string;
          classification: string;
          type?: "good" | "failed" | "example";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string | null;
          ai_description?: string;
          classification?: string;
          type?: "good" | "failed" | "example";
          created_at?: string;
        };
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          chart_image_url: string | null;
          tradingview_link: string | null;
          ai_response: string;
          probability: number | null;
          bias: string | null;
          setup_status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          chart_image_url?: string | null;
          tradingview_link?: string | null;
          ai_response: string;
          probability?: number | null;
          bias?: string | null;
          setup_status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          chart_image_url?: string | null;
          tradingview_link?: string | null;
          ai_response?: string;
          probability?: number | null;
          bias?: string | null;
          setup_status?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Rule = Database["public"]["Tables"]["rules"]["Row"];
export type Pattern = Database["public"]["Tables"]["patterns"]["Row"];
export type Analysis = Database["public"]["Tables"]["analyses"]["Row"];
