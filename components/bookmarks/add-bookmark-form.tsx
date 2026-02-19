"use client";

import type { BookmarkInsert } from "@/types/bookmark";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

interface AddBookmarkFormProps {
  onAdd: (bookmark: BookmarkInsert) => Promise<{ error: string | null }>;
}

export default function AddBookmarkForm({ onAdd }: AddBookmarkFormProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    // Auto-add protocol if missing
    const fullUrl = /^https?:\/\//.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    // If title is blank, leave it blank; the hook/backend will handle the fallback + fetch
    const finalTitle = title.trim();

    setLoading(true);
    // Pass the raw title (even if empty) to onAdd
    const result = await onAdd({ url: fullUrl, title: finalTitle });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    // Reset form on success
    setUrl("");
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        {/* URL input */}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a URL…"
          required
          className="h-11 w-full sm:flex-1 sm:w-auto rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white placeholder:text-zinc-500 transition focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
        />

        {/* Title input */}
        <div className="relative w-full sm:w-48">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/4 px-4 text-sm text-white placeholder:text-zinc-500 transition focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="sm:inline">Add</span>
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  );
}
