"use client";

import type { Bookmark, BookmarkUpdate } from "@/types/bookmark";
import { Pencil, Trash2, Check, X, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onUpdate: (
    id: string,
    updates: BookmarkUpdate,
  ) => Promise<{ error: string | null }>;
  onDelete: (id: string) => Promise<{ error: string | null }>;
  /** CSS animation delay for staggered entrance */
  style?: React.CSSProperties;
}

export default function BookmarkItem({
  bookmark,
  onUpdate,
  onDelete,
  style,
}: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(bookmark.title);
  const [editUrl, setEditUrl] = useState(bookmark.url);
  const [prevTitle, setPrevTitle] = useState(bookmark.title);
  const [prevUrl, setPrevUrl] = useState(bookmark.url);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when the bookmark prop changes (e.g. realtime update)
  if (bookmark.title !== prevTitle) {
    setPrevTitle(bookmark.title);
    setEditTitle(bookmark.title);
  }
  if (bookmark.url !== prevUrl) {
    setPrevUrl(bookmark.url);
    setEditUrl(bookmark.url);
  }

  // Focus title input when editing starts
  useEffect(() => {
    if (isEditing) titleInputRef.current?.focus();
  }, [isEditing]);

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

    // Nothing changed → just close
    if (
      (!trimmedTitle || trimmedTitle === bookmark.title) &&
      (!trimmedUrl || trimmedUrl === bookmark.url)
    ) {
      setIsEditing(false);
      setEditTitle(bookmark.title);
      setEditUrl(bookmark.url);
      return;
    }

    const updates: BookmarkUpdate = {};
    if (trimmedTitle && trimmedTitle !== bookmark.title) {
      updates.title = trimmedTitle;
    }
    if (trimmedUrl && trimmedUrl !== bookmark.url) {
      // Auto-add protocol if missing
      updates.url = /^https?:\/\//.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;
    }

    await onUpdate(bookmark.id, updates);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-dismiss after 3s
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setIsDeleting(true);
    await onDelete(bookmark.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  const faviconUrl =
    bookmark.favicon_url ??
    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(bookmark.url)}&sz=32`;

  const displayUrl = bookmark.url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");

  const timeAgo = getTimeAgo(bookmark.created_at);

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block rounded-xl border border-white/6 bg-white/3 p-3.5 transition-all duration-200 hover:border-white/10 hover:bg-white/6 sm:p-4 ${
        isDeleting ? "pointer-events-none opacity-40" : ""
      } ${isEditing ? "pointer-events-auto" : ""}`}
      style={{ animation: "var(--animate-slide-up)", ...style }}
      onClick={(e) => {
        // When editing, don't navigate
        if (isEditing) e.preventDefault();
      }}
    >
      <div className="flex items-start gap-3">
        {/* Favicon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/6 sm:h-10 sm:w-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={faviconUrl}
            alt=""
            className="h-4 w-4 sm:h-5 sm:w-5"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              target.parentElement?.classList.add("text-zinc-500");
              const fallback =
                target.parentElement?.querySelector(".favicon-fallback");
              if (fallback) (fallback as HTMLElement).style.display = "block";
            }}
          />
          <Globe className="favicon-fallback hidden h-4 w-4 text-zinc-500 sm:h-5 sm:w-5" />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <div
              className="flex flex-col gap-2"
              onClick={(e) => e.preventDefault()}
            >
              <div className="flex items-center gap-2">
                <input
                  ref={titleInputRef}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="Bookmark title"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSave();
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/20 text-emerald-400 transition hover:bg-emerald-500/30"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCancel();
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-zinc-400 transition hover:bg-white/10"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-500 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                placeholder="https://example.com"
              />
            </div>
          ) : (
            <>
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-white transition group-hover:text-indigo-400">
                  {bookmark.title}
                </span>
              </span>
              <p className="mt-0.5 truncate text-xs text-zinc-500">
                {displayUrl}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-sm:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/10 hover:text-white"
              title="Edit"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDelete();
              }}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                confirmDelete
                  ? "bg-red-500/20 text-red-400"
                  : "text-zinc-500 hover:bg-white/10 hover:text-red-400"
              }`}
              title={confirmDelete ? "Click again to confirm" : "Delete"}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Timestamp */}
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[11px] text-zinc-600">{timeAgo}</span>
        {confirmDelete && (
          <span className="animate-fade-in text-[11px] text-red-400/70">
            Click again to confirm
          </span>
        )}
      </div>
    </a>
  );
}

/* ── Utility ─────────────────────────────────────────────────── */

function getTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
