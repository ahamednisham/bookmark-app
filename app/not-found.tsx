import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <h2 className="mb-4 text-3xl font-bold text-white">Page Not Found</h2>
      <p className="mb-8 text-zinc-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Return Home
      </Link>
    </div>
  );
}
