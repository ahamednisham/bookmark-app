export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  favicon_url: string | null;
  created_at: string;
  updated_at: string;
}

export type BookmarkInsert = Pick<Bookmark, "url" | "title"> &
  Partial<Pick<Bookmark, "favicon_url">>;

export type BookmarkUpdate = Partial<Pick<Bookmark, "url" | "title" | "favicon_url">>;
