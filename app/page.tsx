"use client";

import { useUser } from "@/hooks/use-user";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "@/components/layout/header";
import AddBookmarkForm from "@/components/bookmarks/add-bookmark-form";
import BookmarkList from "@/components/bookmarks/bookmark-list";
import EmptyState from "@/components/bookmarks/empty-state";

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();

  const {
    bookmarks,
    loading: bookmarksLoading,
    error,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  } = useBookmarks(user?.id);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!userLoading && !user) router.push("/login");
  }, [user, userLoading, router]);

  // Full-screen loader while checking auth
  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-indigo-500" />
      </div>
    );
  }

  if (!user) return null;

  const showEmptyState = !bookmarksLoading && !error && bookmarks.length === 0;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-500/[0.07] blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <Header />

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Add Bookmark Form */}
        <section className="mb-6 sm:mb-8">
          <AddBookmarkForm onAdd={addBookmark} />
        </section>

        {/* Bookmark count */}
        {!bookmarksLoading && bookmarks.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400">
              {bookmarks.length} bookmark{bookmarks.length !== 1 ? "s" : ""}
            </h2>
          </div>
        )}

        {/* Content */}
        {showEmptyState ? (
          <EmptyState />
        ) : (
          <BookmarkList
            bookmarks={bookmarks}
            loading={bookmarksLoading}
            error={error}
            onUpdate={updateBookmark}
            onDelete={deleteBookmark}
          />
        )}
      </main>
    </div>
  );
}
