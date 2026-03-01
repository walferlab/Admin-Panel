# PDF Lovers Admin Panel

Production-ready admin panel scaffold for `pdflovers.app`, built with Next.js 14 App Router, TypeScript, Tailwind CSS, Clerk, Supabase, and Firebase.

## Included

- Dashboard (`/dashboard`)
- Books CRUD (`/books`)
- Workers monitor (`/workers`)
- Analytics (`/analytics`)
- Revenue calculator + CSV export (`/revenue`)
- Team chat (`/chat`)
- Tags manager (`/tags`)
- Approvals + roles (`/approvals`)
- Settings (`/settings`)
- Login + awaiting approval pages

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create local env:

```bash
cp .env.example .env.local
```

3. Fill required keys in `.env.local`:

- Clerk keys
- Supabase URL / anon key / service role key
- Firebase app keys

4. Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Notes

- Middleware enforces Clerk auth and checks Supabase `admins.approved` when env values are configured.
- Revenue formula lives in `src/lib/revenue.ts`.
- Type models and role permissions are in `src/types/index.ts`.
- Supabase and Firebase integrations are wired but require your real project credentials and DB rules.

## Existing Source Data

Your original extracted files are preserved in the `files/` directory.
