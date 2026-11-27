# AKSANI API

Fastify API for AKSANI. Designed to run as a separate Vercel Fastify project and to move to a standard Node.js/VPS host later.

## Runtime

- Node.js 24
- Fastify 5
- Better Auth 1.6
- PostgreSQL via `pg`
- No Supabase Auth or Supabase client dependency

## Required environment

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL`: PostgreSQL Session Pooler URL (port 5432) with SSL required
- `BETTER_AUTH_SECRET`: random secret, at least 32 characters
- `BETTER_AUTH_URL`: API base URL
- `CLIENT_ORIGIN`: frontend origin

Google OAuth is enabled automatically when both Google credentials are configured. Register this callback URL in Google Cloud:

`https://aksani-api.vercel.app/api/auth/callback/google`

## Local development

```bash
npm install
npm run dev
```

## Better Auth database

After setting `DATABASE_URL`, run:

```bash
npm run db:auth:migrate
```

This creates Better Auth's `user`, `session`, `account`, and `verification` tables in PostgreSQL.

## Routes

- `GET /health`
- `GET/POST /api/auth/*` — Better Auth
- `GET /api/me` — current user and AKSANI profile
- `GET /api/activity-categories`
- `GET /api/daily-entries?date=YYYY-MM-DD`
- `POST /api/daily-entries`

All application data routes require a valid Better Auth session. User role is read from the server-owned `aksani.profiles` record; never accept a role from the browser.
