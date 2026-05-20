# DataCamp Donates × FOROZ — Scholarship Application

A scholarship application platform built for the FOROZ × DataCamp Donates program. Students apply for free access to 440+ DataCamp courses through a 6-step form. Applications are reviewed by admins through a protected dashboard.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Prisma 7** + **Neon** (PostgreSQL)
- **Cloudflare R2** (file storage)
- **Tailwind CSS 4**
- **iron-session** (admin authentication)

## Features

- 6-step application form with validation, progress tracking, and mobile support
- Duplicate submission prevention by email
- File uploads (PDFs, images) held locally until submit, then uploaded to R2
- Cumulative 10 MB file size limit with live progress bar
- Admin dashboard with application list, search, status filters, and pagination
- Per-application detail view with approve / reject / reset actions
- Multi-admin support — superadmin can create and remove additional admin accounts
- Auth via environment variables (superadmin) or database (created admins)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon → your project → Connection Details → select Prisma |
| `DATABASE_URL_UNPOOLED` | Same as above but remove `-pooler` from the hostname |
| `R2_ACCOUNT_ID` | Cloudflare dashboard → right sidebar |
| `R2_ACCESS_KEY_ID` | R2 → Manage R2 API Tokens → Create token |
| `R2_SECRET_ACCESS_KEY` | Same token creation (shown once) |
| `R2_BUCKET_NAME` | Your R2 bucket name |
| `R2_PUBLIC_URL` | Bucket → Settings → Public Development URL |
| `ADMIN_EMAIL` | Your choice — this is the superadmin login |
| `ADMIN_PASSWORD` | Your choice |
| `SESSION_SECRET` | Any random string, 32+ characters |

### 3. Run the database migration

```bash
npx prisma migrate dev
```

### 4. Start the dev server

```bash
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/apply` | Public scholarship application form |
| `/apply/success` | Confirmation page after submission |
| `/dashboard/login` | Admin login |
| `/dashboard` | Application list (protected) |
| `/dashboard/applications/[id]` | Application detail (protected) |
| `/dashboard/admins` | Manage admin accounts — superadmin only |

## Cloudflare R2 CORS

For file uploads to work from the browser, add this CORS policy to your R2 bucket (Settings → CORS Policy):

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000", "https://foroz.me"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

## Deployment

Deploy to Vercel and add all `.env` variables under **Project → Settings → Environment Variables**.
