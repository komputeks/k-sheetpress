export interface Database {
  public: {
    Tables: {
      k_sheetpress_posts: {
        Row: {
          id: string;
          user_id: string;
          post_title: string;
          post_slug: string;
          cat1: string;
          cat2: string;
          post_description: string;
          post_excerpt: string;
          post_content: string;
          post_tags: string[];
          post_status: string;
          post_likes: number;
          featured_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_title: string;
          post_slug: string;
          cat1?: string;
          cat2?: string;
          post_description?: string;
          post_excerpt?: string;
          post_content?: string;
          post_tags?: string[];
          post_status?: string;
          post_likes?: number;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_title?: string;
          post_slug?: string;
          cat1?: string;
          cat2?: string;
          post_description?: string;
          post_excerpt?: string;
          post_content?: string;
          post_tags?: string[];
          post_status?: string;
          post_likes?: number;
          featured_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      k_sheetpress_profiles: {
        Row: {
          id: string;
          user_id: string;
          username: string;
          display_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          website: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          username: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          username?: string;
          display_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          website?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      k_sheetpress_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          author_name: string;
          author_email: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          author_name: string;
          author_email?: string | null;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string | null;
          author_name?: string;
          author_email?: string | null;
          content?: string;
          created_at?: string;
        };
      };
      k_sheetpress_likes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      k_sheetpress_user_sheets: {
        Row: {
          id: string;
          user_id: string;
          spreadsheet_id: string;
          spreadsheet_url: string;
          is_initialized: boolean;
          last_synced_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          spreadsheet_id: string;
          spreadsheet_url: string;
          is_initialized?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          spreadsheet_id?: string;
          spreadsheet_url?: string;
          is_initialized?: boolean;
          last_synced_at?: string | null;
          created_at?: string;
        };
      };
      k_sheetpress_sync_log: {
        Row: {
          id: string;
          user_id: string;
          direction: string;
          status: string;
          records_processed: number;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          direction: string;
          status: string;
          records_processed?: number;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          direction?: string;
          status?: string;
          records_processed?: number;
          error_message?: string | null;
          created_at?: string;
        };
      };
      k_sheetpress_site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
