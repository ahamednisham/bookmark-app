"use client";

import { createClient } from "@/lib/supabase/client";
import type { Bookmark, BookmarkInsert, BookmarkUpdate } from "@/types/bookmark";
import { useEffect, useState, useCallback, useRef } from "react";

export function useBookmarks(userId: string | undefined) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabaseRef = useRef(createClient());

  // ── Fetch bookmarks on mount & subscribe to realtime changes ──────
  useEffect(() => {
    if (!userId) return;

    const supabase = supabaseRef.current;
    let isMounted = true;

    // Initial fetch
    const fetchBookmarks = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setBookmarks(data ?? []);
      setError(null);
      setLoading(false);
    };

    fetchBookmarks();

    const channel = supabase
      .channel(`bookmarks:user:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => [newBookmark, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as Bookmark;
          setBookmarks((prev) =>
            prev.map((b) => (b.id === updated.id ? updated : b))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const deletedId = (payload.old as Partial<Bookmark>).id;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const safeBookmarks = userId ? bookmarks : [];
  const safeLoading   = userId ? loading   : false;
  const safeError     = userId ? error     : null;

  const addBookmark = useCallback(
    async (bookmark: BookmarkInsert) => {
      if (!userId) return { error: "Not authenticated" };

      const { error: insertError } = await supabaseRef.current
        .from("bookmarks")
        .insert({ ...bookmark, user_id: userId });

      if (insertError) return { error: insertError.message };
      return { error: null };
    },
    [userId]
  );

  const updateBookmark = useCallback(
    async (id: string, updates: BookmarkUpdate) => {
      const { error: updateError } = await supabaseRef.current
        .from("bookmarks")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) return { error: updateError.message };
      return { error: null };
    },
    []
  );

  const deleteBookmark = useCallback(async (id: string) => {
    const { error: deleteError } = await supabaseRef.current
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (deleteError) return { error: deleteError.message };

    // Optimistically remove from local state so the item disappears immediately
    // instead of waiting for the realtime DELETE event
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    return { error: null };
  }, []);

  return {
    bookmarks: safeBookmarks,
    loading: safeLoading,
    error: safeError,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  };
}
