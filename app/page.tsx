import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-950 via-zinc-900 to-zinc-950 px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 h-[400px] w-[600px] rounded-full bg-teal-500/8 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
          {/* Success Icon */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              You&apos;re logged in!
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Welcome back to Bookmark App
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

          {/* User Info */}
          <div className="mb-6 rounded-xl border border-white/5 bg-white/5 p-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
                {user.email?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user.user_metadata?.full_name ?? "User"}
                </p>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <LogoutButton />

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-zinc-500">
            Bookmark App &middot; Manage your bookmarks
          </p>
        </div>

        {/* Bottom accent */}
        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-linear-to-r from-emerald-500/50 to-teal-500/50" />
      </div>
    </div>
  );
}
