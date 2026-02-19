"use client";

import type { Bookmark, BookmarkUpdate } from "@/types/bookmark";
import BookmarkItem from "./bookmark-item";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  onUpdate: (
    id: string,
    updates: BookmarkUpdate,
  ) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
}

export default function BookmarkList({
  bookmarks,
  loading,
  error,
  onUpdate,
  onDelete,
}: BookmarkListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/6 bg-white/3 p-4"
          >
            <div className="flex items-start gap-3">
              <div
                className="h-10 w-10 shrink-0 rounded-lg"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                  backgroundSize: "400px 100%",
                  animation: "var(--animate-shimmer)",
                }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                    backgroundSize: "400px 100%",
                    animation: "var(--animate-shimmer)",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <div
                  className="h-3 w-1/2 rounded"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)",
                    backgroundSize: "400px 100%",
                    animation: "var(--animate-shimmer)",
                    animationDelay: `${i * 0.1 + 0.05}s`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-2.5 sm:space-y-3">
      {bookmarks.map((bookmark, i) => (
        <BookmarkItem
          key={bookmark.id}
          bookmark={bookmark}
          onUpdate={onUpdate}
          onDelete={onDelete}
          style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
        />
      ))}
    </div>
  );
}
