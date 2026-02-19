"use client";

import { BookmarkPlus } from "lucide-react";

export default function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24"
      style={{ animation: "var(--animate-fade-in)" }}
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/4 sm:h-20 sm:w-20">
        <BookmarkPlus className="h-7 w-7 text-zinc-600 sm:h-8 sm:w-8" />
      </div>
      <h3 className="text-lg font-semibold text-white sm:text-xl">
        No bookmarks yet
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-500">
        Save your favourite links by adding a URL above. They&apos;ll sync
        across all your devices in real time.
      </p>
    </div>
  );
}
