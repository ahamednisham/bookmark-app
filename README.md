# Bookmark App

A modern, real-time bookmark manager built with **Next.js 16**, **React 19**, and **Supabase**. Save, organize, and manage your bookmarks from anywhere with instant sync across devices.

## ✨ Features

- **Google OAuth** — One-click sign-in via Supabase Auth
- **Real-time sync** — Bookmarks update instantly across tabs/devices using Supabase Realtime (Postgres Changes)
- **CRUD operations** — Add, edit (title & URL), and delete bookmarks
- **Optimistic UI** — Deletes reflect immediately without waiting for the server
- **Per-user isolation** — Row-Level Security ensures users only see their own bookmarks
- **Responsive design** — Glassmorphism-inspired dark UI that works on mobile and desktop
- **Favicon extraction** — Automatically displays site favicons alongside bookmarks

## 🛠️ Tech Stack

| Layer       | Technology                           |
| ----------- | ------------------------------------ |
| Framework   | Next.js 16 (App Router)              |
| UI          | React 19, Tailwind CSS v4            |
| Auth        | Supabase Auth (Google OAuth)         |
| Database    | Supabase (PostgreSQL)                |
| Realtime    | Supabase Realtime (Postgres Changes) |
| Icons       | Lucide React                         |
| Fonts       | Google Sans & Google Sans Mono       |
| Package Mgr | Yarn 4 (Berry)                       |
| Hosting     | Vercel                               |

## 📁 Project Structure

```
bookmark-app/
├── app/
│   ├── auth/callback/       # OAuth callback handler
│   ├── login/               # Google sign-in page
│   ├── globals.css           # Global styles & Tailwind imports
│   ├── layout.tsx            # Root layout (fonts, metadata)
│   └── page.tsx              # Main dashboard (bookmarks view)
├── components/
│   ├── auth/                 # Auth-related components
│   ├── bookmarks/
│   │   ├── add-bookmark-form.tsx   # URL/title input form
│   │   ├── bookmark-item.tsx       # Individual bookmark card
│   │   ├── bookmark-list.tsx       # Bookmark list with loading/error states
│   │   └── empty-state.tsx         # Shown when no bookmarks exist
│   └── layout/
│       └── header.tsx              # Top bar with branding & logout
├── hooks/
│   ├── use-bookmarks.ts      # Bookmark CRUD + realtime subscription
│   └── use-user.ts           # Auth state listener
├── lib/supabase/
│   ├── client.ts             # Browser Supabase client
│   ├── server.ts             # Server-side Supabase client
│   └── proxy.ts              # Favicon proxy utility
├── types/
│   └── bookmark.ts           # Bookmark, BookmarkInsert, BookmarkUpdate types
└── supabase/
    └── config.toml           # Supabase local config
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Yarn 4](https://yarnpkg.com/getting-started/install)
- A [Supabase](https://supabase.com/) project with Google OAuth configured

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/bookmark-app.git
cd bookmark-app
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 4. Set up the database

In your Supabase project, create a `bookmarks` table with the following schema:

| Column        | Type          | Notes                                    |
| ------------- | ------------- | ---------------------------------------- |
| `id`          | `uuid`        | Primary key, default `gen_random_uuid()` |
| `user_id`     | `uuid`        | References `auth.users(id)`              |
| `url`         | `text`        | Required                                 |
| `title`       | `text`        | Required                                 |
| `favicon_url` | `text`        | Nullable                                 |
| `created_at`  | `timestamptz` | Default `now()`                          |
| `updated_at`  | `timestamptz` | Default `now()`                          |

Enable **Row-Level Security** and add a policy so users can only access their own rows:

```sql
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own bookmarks"
  ON bookmarks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

Enable **Realtime** on the `bookmarks` table from the Supabase dashboard (Database → Replication).

### 5. Configure Google OAuth

1. Go to **Supabase Dashboard → Authentication → Providers → Google**
2. Add your Google OAuth client ID and secret
3. Set the redirect URL to `https://<your-domain>/auth/callback`

### 6. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `yarn dev`   | Start development server |
| `yarn build` | Create production build  |
| `yarn start` | Start production server  |
| `yarn lint`  | Run ESLint               |

## 🌐 Deployment

This app is optimized for [Vercel](https://vercel.com/):

1. Push your repo to GitHub
2. Import the project in Vercel
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables
4. Deploy — Vercel handles the rest automatically

## 📄 License

This project is for personal use.
