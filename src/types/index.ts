export interface KSheetpressPost {
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
  post_status: 'draft' | 'published' | 'archived';
  post_likes: number;
  featured_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface KSheetpressProfile {
  id: string;
  user_id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface KSheetpressComment {
  id: string;
  post_id: string;
  user_id: string | null;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
}

export interface KSheetpressLike {
  id: string;
  post_id: string;
  user_id: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface KSheetpressUserSheet {
  id: string;
  user_id: string;
  spreadsheet_id: string;
  spreadsheet_url: string;
  is_initialized: boolean;
  last_synced_at: string | null;
  created_at: string;
}

export interface KSheetpressSyncLog {
  id: string;
  user_id: string;
  direction: 'sheet_to_supabase' | 'supabase_to_sheet';
  status: 'success' | 'error' | 'partial';
  records_processed: number;
  error_message: string | null;
  created_at: string;
}

export interface KSheetpressSiteSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}
